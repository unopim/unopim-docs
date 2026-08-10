# Variant Structures

A variant structure defines how a family's configurable products are built: which attributes act as variant axes, over one or two levels, and at which level each attribute's value is stored. This page covers managing structures over the REST API. For the concept, see [Advanced Variants](../packages/advanced-variants).

Structures always belong to an attribute family, so every route is nested under the family code.

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
| ------------- | --------------------- |
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Structures for a Family

```
GET {{url}}/api/v1/rest/families/{code}/variant-structures
```

**Headers** — use the [Common Headers](#common-headers).

| Name    | Info                                               | Type   | Default |
|---------|----------------------------------------------------|--------|---------|
| `limit` | Records per request. Clamped to a maximum of `100` | Number | `10`    |
| `page`  | Page number to retrieve                            | Number | `1`     |

### Response

::: details Response
```json
{
  "data": [
    {
      "code": "colour_size",
      "name": "Colour then Size",
      "family": "apparel",
      "levels": 2,
      "axes": {
        "level_1": ["colour"],
        "level_2": ["size"]
      },
      "placements": {
        "common": ["brand"],
        "sub_parent": ["colour_image"],
        "variant": ["sku", "size"]
      },
      "effective_placements": {
        "common": ["brand"],
        "sub_parent": ["colour_image"],
        "variant": ["sku", "size"]
      },
      "created_at": "2026-07-22T10:14:03.000000Z",
      "updated_at": "2026-07-22T10:14:03.000000Z"
    }
  ]
}
```
:::

Both axis levels are always present — `level_2` comes back as an empty array for a single-level structure — so a client never has to branch on a missing key, and a `GET` result round-trips unchanged as a `PUT` body.

`placements` is what you configured; `effective_placements` is what the resolver actually applies once family defaults are taken into account.

## Get a Structure by Code

```
GET {{url}}/api/v1/rest/families/{code}/variant-structures/{structureCode}
```

## Create a Structure

```
POST {{url}}/api/v1/rest/families/{code}/variant-structures
```

```json
{
    "code": "colour_size",
    "name": "Colour then Size",
    "levels": 2,
    "axes": {
        "level_1": ["colour"],
        "level_2": ["size"]
    },
    "placements": {
        "common": ["brand"],
        "sub_parent": ["colour_image"],
        "variant": ["sku", "size"]
    }
}
```

| Field | Required | Notes |
|---|---|---|
| `code` | Yes | Must pass the standard code rule. |
| `name` | No | Display name. |
| `levels` | Yes | `1` or `2`. Only settable at creation. |
| `axes` | Yes | Keys `level_1` (required) and `level_2`; values are attribute codes. |
| `placements` | No | Keys `common`, `sub_parent`, `variant`; values are attribute codes. |

::: warning Levels and axes are immutable after creation
Creation is the only point at which `levels` and `axes` may be stated. The update verbs accept them only as unchanged values — a structure's shape cannot be rewritten once products are built on it.
:::

## Update a Structure

```
PUT   {{url}}/api/v1/rest/families/{code}/variant-structures/{structureCode}
PATCH {{url}}/api/v1/rest/families/{code}/variant-structures/{structureCode}
```

Use these to rename a structure or adjust `placements`.

## Delete a Structure

```
DELETE {{url}}/api/v1/rest/families/{code}/variant-structures/{structureCode}
```

A structure that products already point at cannot be deleted; the request is refused with a `422`.
