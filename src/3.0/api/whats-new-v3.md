# What's New in the v3.0 API

## Introduction

UnoPim 3.0 substantially expands the REST API. Resources that were previously read-only can now be written, media files can be read and deleted, products support incremental synchronization, and API integrations run under a new authentication model.

If you are building or maintaining an API client, this page is your tour of everything that changed. Every endpoint lives under `/api/v1/rest/`, authenticates with OAuth 2.0 (password grant), and requires an `Accept: application/json` header.

We will start with the new write operations and media endpoints, move on to delta synchronization, and finish with the authentication changes and a deprecation you should plan for.

## New Write Operations

Catalog-structure resources gained the verbs they were missing. The table below lists each resource and the operations added in 3.0:

| Resource | New in 3.0 |
|---|---|
| `attributes` | `PATCH /attributes/{code}`, `DELETE /attributes/{code}`, `DELETE /attributes/{code}/options/{optionCode}` |
| `attribute-groups` | `PATCH`, `DELETE` |
| `families` | `PATCH`, `DELETE` |
| `category-fields` | `PATCH`, `DELETE`, `DELETE .../options/{optionCode}` |
| `locales` | `POST`, `PUT`, `DELETE` (previously read-only) |
| `channels` | `POST`, `PUT`, `DELETE` |
| `currencies` | `POST`, `PUT`, `DELETE` |

`PATCH` performs a partial update — only the keys you submit will change. Locale, channel, and currency writes apply the same in-use and default-record guards as the admin panel, so you cannot delete a channel's default locale over the API.

## Media Endpoints

Product, category, and swatch media now support read and delete alongside upload. Media files are identified by query parameters rather than path segments:

```
GET    /api/v1/rest/media-files/product?sku=shirt-1&attribute=image
DELETE /api/v1/rest/media-files/product?sku=shirt-1&attribute=image
GET    /api/v1/rest/media-files/category?code=apparel&category_field=banner
GET    /api/v1/rest/media-files/swatch?code=red&attribute_code=color
```

## Digital Product Passports

Passports are fully manageable over the API under `/api/v1/rest/passports` — you may list them, read them per SKU, publish (the endpoint returns `202` and queues the work), withdraw, reinstate, and perform a GDPR redact. See [Digital Product Passport](../advanced/digital-product-passport#rest-api).

## Measurements

Measurement families, units, and attribute bindings are fully manageable over the API — see [Measurements](../packages/measurements#rest-api).

## Delta Synchronization

Sometimes you may wish to sync only the products that changed since your last run rather than paging through the entire catalog. Products now support exactly that, combining date filters with cursor pagination:

```
GET /api/v1/rest/products
    ?filters={"updated_at":[{"operator":">=","value":"2026-08-01 00:00:00"}]}
    &pagination_type=search_after
    &limit=100
```

Date filters on `created_at` / `updated_at` support the `>`, `>=`, `<`, `<=`, and `BETWEEN` operators (`BETWEEN` requires exactly two values), and multiple filters combine with AND.

Cursor pagination (`pagination_type=search_after`) avoids the `COUNT(*)` and deep-offset costs of page mode. Each response returns the cursor for the next page:

```json
{
  "data": [ ... ],
  "search_after": 1234,
  "links": { "next": "...?pagination_type=search_after&search_after=1234" }
}
```

When `search_after` comes back as `null`, there are no more pages. The `limit` parameter is clamped to 1–100 and defaults to 10.

Two further features make repeated polling cheap. Responses carry an `ETag`, so you may send `If-None-Match` and receive `304 Not Modified` — skipping re-processing of unchanged data entirely. And slow-changing resources (attributes, groups, families, category fields, locales, channels, currencies) are served from a versioned server-side structure cache that invalidates automatically on writes and import completion; it is controlled by `UNOPIM_API_STRUCTURE_CACHE` and the TTL by `UNOPIM_API_STRUCTURE_CACHE_TTL`.

## Robot Users and Authentication

API integrations now run as dedicated **robot users**. When you create an integration, UnoPim will automatically provision a least-privilege `type = 'api'` admin, and the credentials are revealed exactly once. Integration creation no longer accepts `admin_id` — existing integrations were migrated automatically. If you lose the credentials, you may recover access by regenerating the password or client secret from the integration edit screen; both actions revoke existing tokens.

::: warning Token invalidation on upgrade
v3.0 replaces the previously shared OAuth signing keys with per-installation 4096-bit keys. All tokens issued before the upgrade are invalid — authenticate again.
:::

Rate limits are configurable: `REST_API_RATE_LIMIT` (default 120/min) applies to all endpoints, and `OAUTH_TOKEN_RATE_LIMIT` (default 10/min) applies to token issue and refresh. Token lifetimes are controlled by `ACCESS_TOKEN_TTL` and `REFRESH_TOKEN_TTL` (default 3600 seconds).

## Deprecated Alias

The misspelled `configrable-products` prefix still works, but it now returns RFC 8594 deprecation headers:

```
Deprecation: true
Link: </api/v1/rest/configurable-products>; rel="successor-version"
```

You should migrate your clients to `configurable-products` — the alias will be removed in a future release.
