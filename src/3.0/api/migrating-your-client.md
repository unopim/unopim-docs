# Migrating an API Client to v3.0

[What's New in v3.0](./whats-new-v3) describes the features the API gained. This page is the other half of the story: the behaviour that changed underneath a client you have already shipped. Work through it before you point an existing v2.x integration at a 3.0 installation.

Nothing here changes an endpoint path, the OAuth flow, or the product and category payload structure. The work is in permissions, error handling, request pacing, and pagination bookkeeping.

## What Changes for an Existing Client

| Change | Symptom if you ignore it | Section |
|---------------------------------------|------------------------------------------------|---------|
| Permissions enforced on reads too     | `403` on calls that worked before               | [Permissions](#permissions-are-now-enforced-on-every-request) |
| Rate limits enforced                  | `429` mid-sync, or token endpoint locked out    | [Pace Your Requests](#pace-your-requests) |
| `limit` capped at 100                 | Sync silently stops after the first page        | [Pagination](#pagination-bookkeeping) |
| Single error envelope                 | Error messages parsed from the wrong keys       | [Error Responses](#error-responses-have-a-single-shape) |
| `Accept` header enforced              | `406` on every request                          | [Headers](#headers-every-request-sends) |
| `configrable-products` deprecated     | Works today, breaks on a later release          | [Deprecated Alias](#the-deprecated-product-alias) |

Everything else on this page is additive — new data you may read, not changes you must absorb.

## Headers Every Request Sends

| Key           | Value                 |
| ------------- | --------------------- |
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

`Accept: application/json` is now mandatory. A request without it is rejected before it reaches the controller:

```json
{
    "error": "Accept header must be application/json"
}
```

That response carries `406 Not Acceptable`. Many HTTP clients send `Accept: */*` by default, which passes, but set the header explicitly rather than relying on it.

## Permissions Are Now Enforced on Every Request

In v2.x, an endpoint with no entry in the API access-control map was reachable by any authenticated key as long as the request was a read — only writes were checked. In 3.0 the check applies to every request, in both directions:

- A route the key is not granted returns `403`, whether it is a `GET` or a `DELETE`.
- A revoked API key returns `403`, even while its access token is still within its lifetime.
- A key whose API user has been disabled returns `403` for the same reason. If that user is disabled before you authenticate, the token request itself fails with `400` and an `invalid_grant` error rather than issuing a token.

Two consequences follow for an existing integration.

First, a key created with **Custom** permissions loses access to endpoints it could previously read. Grant the missing permissions on the integration, or switch the key to **All**. Keys already set to **All** are unaffected.

Second, the permissions your client needs belong in your own installation instructions. A `403` is no longer a sign that something is broken — it is a sign that a checkbox is unticked.

::: tip Verify permissions before you sync
Call one endpoint per capability your client uses at startup, and report a `403` to the merchant naming the call. Discovering a missing permission on the first request is far cheaper than discovering it halfway through a catalog import.
:::

### Permissions Behind the 3.0 Endpoints

The endpoints introduced in 3.0 are governed by these permission keys. Where a key already existed in v2.x, the new verb simply joins it:

| Endpoints | Permission key |
|---|---|
| `PATCH`, `DELETE` on attributes, and delete attribute option | `api.catalog.attributes.edit`, `api.catalog.attributes.delete` |
| `PATCH`, `DELETE` on attribute groups | `api.catalog.attribute_groups.edit`, `api.catalog.attribute_groups.delete` |
| `PATCH`, `DELETE` on families | `api.catalog.families.edit`, `api.catalog.families.delete` |
| `PATCH`, `DELETE` on category fields, and delete field option | `api.catalog.category_fields.edit`, `api.catalog.category_fields.delete` |
| `PATCH` on categories | `api.catalog.categories.edit` |
| `PATCH` on products and configurable products | `api.catalog.products.edit` |
| `GET`, `DELETE` product media | `api.catalog.products`, `api.catalog.products.delete` |
| `GET`, `DELETE` category media | `api.catalog.categories`, `api.catalog.categories.delete` |
| `GET`, `DELETE` swatch media | `api.catalog.attributes`, `api.catalog.attributes.delete` |
| Locale, channel, currency writes | `api.settings.locales.*`, `api.settings.channels.*`, `api.settings.currencies.*` (`create`, `edit`, `delete`) |
| Passport read and lifecycle | `api.catalog.passports`, `api.catalog.passports.publish`, `api.catalog.passports.withdraw` |
| Measurement families and units | `api.catalog.measurements`, `api.catalog.measurements.units`, each with `create`, `edit`, `delete` |

Reinstating a passport is governed by the publish permission, and redacting one by the withdraw permission, since each is the same class of action.

## Error Responses Have a Single Shape

Every failure now returns the same envelope, so a client can parse one structure instead of matching on message text. A validation failure carries a per-field `errors` object:

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": {
        "values.common.sku": ["The values.common.sku field is required."]
    }
}
```

Everything else — a missing record, a permission failure, a rejected filter — carries `success` and `message` alone:

```json
{
    "success": false,
    "message": "This action is unauthorized"
}
```

These are the status codes a client should handle explicitly:

| Status | Meaning | What the client should do |
|--------|-------------------------------------------------|--------------------------------------------------|
| `401`  | Token missing, expired, or revoked              | Re-authenticate, then replay the request once     |
| `403`  | The key lacks the permission for that endpoint  | Surface which call failed; do not retry           |
| `404`  | No record for that code or SKU                  | Treat as absent, not as an outage                 |
| `406`  | `Accept` header is not `application/json`       | Fix the client's headers                          |
| `422`  | Validation or filter error                      | Read `errors` and report per field                |
| `429`  | Rate limit exceeded                             | Back off and retry; see below                     |

Success responses keep the shape they had in v2.x: `success`, `message`, and an optional `data` key. Creates return `201`, updates and deletes `200`, and a passport publish returns `202` because the work is queued.

## Pace Your Requests

3.0 enforces rate limits: **120 requests per minute** across the API, and **10 per minute** against token issue and refresh. A client that fetches a fresh token before every call exhausts the token limit almost immediately.

Two changes cover it.

**Cache the access token.** Request it once, keep it for its lifetime — one hour by default, and the exact value comes back as `expires_in` — and only re-authenticate when it expires or a call returns `401`:

```
if (token is null or token expires within 60 seconds) {
    token = POST /oauth/token (grant_type=refresh_token, or password on first run)
}
```

**Back off on `429`.** Read the `Retry-After` header, wait that long, and retry with an exponential backoff instead of failing the whole sync:

```
attempt = 0
while (attempt < 5) {
    response = send(request)
    if (response.status != 429) return response
    wait(response.header("Retry-After") ?? 2 ** attempt)
    attempt++
}
```

Both limits are set per installation, so a merchant on a dedicated instance may have more headroom. Write the client against the defaults regardless — you cannot know which installation it will run on.

### Cheap Polling

If you poll frequently, adopt conditional requests. Every response carries an `ETag`; send it back in `If-None-Match` and a `304 Not Modified` tells you nothing changed, with no body to re-process:

```
GET {{url}}/api/v1/rest/attributes
If-None-Match: "a3f1c8..."
```

::: warning Do not treat 304 as an empty result
A `304` means *unchanged*, not *no records*. A client that maps it onto an empty collection will look like a catalog that emptied itself. Handle `304` explicitly, or leave `If-None-Match` off entirely.
:::

One caveat when writing and reading back: structure resources — attributes, attribute groups, families, category fields, locales, channels, currencies — are served from a server-side cache. It invalidates on writes and on import completion, but an immediate read-back is not how you confirm a write succeeded; the write's own response already told you.

## Pagination Bookkeeping

The `limit` parameter is clamped to a maximum of **100** and defaults to 10. A request for `limit=500` returns 100 records and no error.

::: danger The silent truncation
A loop that stops when a page is smaller than the page size it asked for will stop after the first page and report a successful, partial sync. This is the single most likely way a working v2.x client breaks against 3.0.
:::

Drive the loop from the response instead:

```
url = "{{url}}/api/v1/rest/products?limit=100"
while (url != null) {
    response = get(url)
    process(response.data)
    url = response.links.next
}
```

This works in both modes. In page mode, `links.next` is `null` on the last page. In cursor mode (`pagination_type=search_after`), `links.next` is `null` and `search_after` comes back as `null` when the catalog is exhausted.

Cursor responses carry no `meta.total` and no `meta.last_page` — avoiding the `COUNT(*)` those fields require is the point of the mode — so a progress indicator has to come from your own record count.

For a full catalog pull or a scheduled delta sync, cursor mode is the mode to choose:

```
GET {{url}}/api/v1/rest/products
    ?filters={"updated_at":[{"operator":">=","value":"2026-08-01 00:00:00"}]}
    &pagination_type=search_after
    &limit=100
```

Products also filter on `sku`, `status`, `family`, and `categories`. See [Delta Synchronization](./whats-new-v3#delta-synchronization) for the full operator list.

## Product Associations

A single product `GET` now returns an `associations` block alongside the existing payload. It covers every association type the installation defines, including custom ones, and carries each link's `additional_data`:

```json
{
    "associations": {
        "related": [
            { "related_sku": "shirt-2", "additional_data": null }
        ],
        "spare_parts": [
            { "related_sku": "filter-9", "additional_data": { "quantity": 2 } }
        ]
    }
}
```

This is additive. The `values.associations` SKU lists a v2.x client already reads are unchanged, and the listing endpoint does not include the block at all — it is returned only for a single product, to keep list responses free of a per-row query.

The same block may be sent on create and update, under a top-level `associations` key. The key naming differs by direction: write `sku`, read `related_sku`.

```json
{
    "associations": {
        "spare_parts": [
            { "sku": "filter-9", "additional_data": { "quantity": 2 } }
        ]
    }
}
```

How it resolves:

- Each type you submit replaces that type's links entirely; types you omit are left alone.
- `additional_data` is validated against the custom fields defined on that association type. An invalid value fails the whole request with `422` before anything is written.
- A SKU that does not resolve is skipped rather than failing the request.
- A product cannot be associated with itself; such a link is dropped.

## The Deprecated Product Alias

The misspelled `configrable-products` prefix still works and still resolves to the same controller, but it now returns RFC 8594 deprecation headers:

```
Deprecation: true
Link: </api/v1/rest/configurable-products>; rel="successor-version"
```

Change the prefix to `configurable-products` in your client. The alias will be removed in a future release; until then its permission keys mirror the correctly spelled route.

## Migration Checklist

| Change | Required |
|---|---|
| Send `Accept: application/json` on every request | Yes |
| Cache the access token; back off on `429` | Yes |
| Follow `links.next` instead of comparing page size to `limit` | Yes, if you request more than 100 per page |
| Parse the `errors` object on `422`; treat `403` as a missing permission | Yes |
| Handle `304`, or stop sending `If-None-Match` | Yes, if you send conditional requests |
| Re-check Custom permissions on the integration | Yes, for keys not set to All |
| Rename `configrable-products` to `configurable-products` | Yes |
| Move a full re-sync to `updated_at` filters with cursor pagination | Recommended |
| Read `associations` and `additional_data` for rich product links | Optional |
