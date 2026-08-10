# Association Types

Association types define the named product-to-product relationships your catalog supports — the three built-in ones (`related_products`, `up_sells`, `cross_sells`) plus any custom type you add, each optionally carrying per-link fields. This page covers managing them over the REST API. For the concept and the admin UI, see [Configurable Associations](../packages/configurable-associations).

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
| ------------- | --------------------- |
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Association Types

```
GET {{url}}/api/v1/rest/association-types
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint accepts these query parameters:

| Name      | Info                                                                     | Type   | Default |
|-----------|--------------------------------------------------------------------------|--------|---------|
| `limit`   | Records per request. Clamped to a maximum of `100`                       | Number | `10`    |
| `page`    | Page number to retrieve                                                  | Number | `1`     |
| `filters` | Filter by `code` (`=`, `IN`, `NOT IN`) or `status` (`=`)                 | JSON   | N/A     |

### Response

::: details Response
```json
{
  "data": [
    {
      "code": "related_products",
      "status": true,
      "position": 1,
      "is_user_defined": false,
      "labels": {
        "en_US": "Related Products",
        "fr_FR": "Produits associés"
      }
    },
    {
      "code": "spare_parts",
      "status": true,
      "position": 4,
      "is_user_defined": true,
      "labels": {
        "en_US": "Spare Parts"
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 2
}
```
:::

`is_user_defined` is `false` for the three built-in types. Those are protected: they cannot be deleted, and their code cannot change.

## Get an Association Type by Code

```
GET {{url}}/api/v1/rest/association-types/{code}
```

## Create an Association Type

```
POST {{url}}/api/v1/rest/association-types
```

Send the code plus a name per locale. Locale keys are validated against the active locales:

```json
{
    "code": "spare_parts",
    "status": true,
    "en_US": { "name": "Spare Parts" },
    "fr_FR": { "name": "Pièces détachées" }
}
```

The `code` must be unique, pass the standard code rule (letters, numbers, underscores, no leading digit), and must not collide with a reserved product field.

### Response

```json
{
    "success": true,
    "message": "Association type created successfully."
}
```

## Update an Association Type

```
PUT   {{url}}/api/v1/rest/association-types/{code}
PATCH {{url}}/api/v1/rest/association-types/{code}
```

`PUT` replaces the submitted attributes; `PATCH` changes only the keys you send.

## Delete an Association Type

```
DELETE {{url}}/api/v1/rest/association-types/{code}
```

Deleting a type removes its links from every product. The three built-in types are refused with a `422`.

## Association Type Fields

Custom types may carry per-link fields — a quantity on a spare part, a note on a related product. Fields are managed under the type:

```
GET    {{url}}/api/v1/rest/association-types/{code}/fields
POST   {{url}}/api/v1/rest/association-types/{code}/fields
PUT    {{url}}/api/v1/rest/association-types/{code}/fields/{fieldCode}
DELETE {{url}}/api/v1/rest/association-types/{code}/fields/{fieldCode}
```

### Field Response

::: details Response
```json
{
  "data": [
    {
      "code": "quantity",
      "type": "text",
      "status": true,
      "validation": "numeric",
      "position": 1,
      "is_required": 1,
      "is_unique": 0,
      "value_per_locale": 0,
      "labels": {
        "en_US": "Quantity"
      }
    }
  ]
}
```
:::

Field codes are validated the same way as type codes, and `code`, `type`, and `locale` are reserved.

Values for these fields travel in a product's `associations` payload as `additional_data` — see [Product Associations](./product#product-associations).
