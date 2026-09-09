# Digital Product Passports

Digital Product Passports are published per product, channel, and locale, each publication being an immutable version with a public URL. This page covers the REST lifecycle: listing and reading publications, publishing new ones, and withdrawing, reinstating, or redacting existing ones. For templates, carriers, and the admin workflow, see [Digital Product Passport](../advanced/digital-product-passport).

::: warning Feature-gated
Every endpoint here returns `404` while Digital Product Passports are disabled for the installation. Enable the feature in the System Settings hub first.
:::

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
| ------------- | --------------------- |
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## List Publications

Returns publications newest first.

```
GET {{url}}/api/v1/rest/passports
```

| Name     | Info                                                     | Type   | Default |
|----------|----------------------------------------------------------|--------|---------|
| `limit`  | Records per request. Clamped to `1`–`100`                 | Number | `10`    |
| `sku`    | Only publications belonging to this product               | String | N/A     |
| `status` | Only publications in this status                          | String | N/A     |

### Response

::: details Response
```json
{
  "data": [
    {
      "uuid": "0f0f7a5c-6d1b-4a49-9a2e-7b5f2c9d1e34",
      "status": "published",
      "type": "dpp",
      "product_sku": "SHIRT-1",
      "channel": "ecommerce",
      "gtin": "04012345678901",
      "gs1_link": "/01/04012345678901",
      "public_url": "https://example.com/p/0f0f7a5c-6d1b-4a49-9a2e-7b5f2c9d1e34",
      "published_at": "2026-08-01T09:12:44+00:00"
    }
  ],
  "links": { "first": "…", "last": "…", "prev": null, "next": null },
  "meta": { "current_page": 1, "per_page": 10, "total": 1 }
}
```
:::

::: warning Envelope differs from the rest of the API
The passport endpoints are built on a Laravel resource collection, so they wrap pagination in `links` and `meta`. Every other list endpoint returns the counters at the top level instead — see [Response Structure Explained](./explanation). Do not share one pagination parser between them.
:::

## Read a Product's Publications

Every publication for one product, newest first, unpaginated.

```
GET {{url}}/api/v1/rest/passports/{sku}
```

An unknown SKU returns `404`.

## Publish

Queues publication for a product on one channel and one or more locales.

```
POST {{url}}/api/v1/rest/passports/publish/{sku}
```

```json
{
    "channel_id": 1,
    "locale_ids": [1, 3]
}
```

| Field | Required | Notes |
|---|---|---|
| `channel_id` | Yes | Must be an existing channel id. |
| `locale_ids` | Yes | Non-empty array of existing locale ids. |

### Response

The work runs on the `publication` queue, so the endpoint answers `202 Accepted` rather than waiting:

```json
{
    "success": true,
    "message": "Passport publication has been queued."
}
```

Make sure a worker is processing the `publication` queue, or nothing is published — see [Queue Management](../advanced/queue-management).

## Withdraw

Takes a published passport off the public URL. The version is retained.

```
POST {{url}}/api/v1/rest/passports/withdraw/{id}
```

`{id}` is the publication's numeric id. An unknown id returns `404`.

## Reinstate

Puts a withdrawn passport back online.

```
POST {{url}}/api/v1/rest/passports/reinstate/{id}
```

## Redact

Permanently removes the payload of a publication for a GDPR request, leaving a tombstone at the public URL.

```
POST {{url}}/api/v1/rest/passports/redact/{id}
```

```json
{
    "reason": "Data subject erasure request #4182"
}
```

`reason` is required and stored with the redaction, up to 1000 characters.

## Permissions

| Endpoint | Permission key |
|---|---|
| List and read | `api.catalog.passports` |
| Publish, reinstate | `api.catalog.passports.publish` |
| Withdraw, redact | `api.catalog.passports.withdraw` |
