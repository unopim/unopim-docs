# Products API

This page covers everything you can do with products over the REST API — from listing and filtering to partial updates and deletion. Each endpoint below uses the same authentication headers, so grab your access token and follow along.

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Products

Retrieves a paginated list of products. Use it to browse the catalog or, combined with filters, to pull exactly the subset you need.

```
GET {{url}}/api/v1/rest/products
```

**Headers** — use the [Common Headers](#common-headers).

You can shape the result set with these query parameters:

| Name                | Info                                                              | Type    | Default |
|---------------------|-------------------------------------------------------------------|---------|---------|
| `limit`             | Products per request. Clamped to a maximum of `100`                | Number  | `10`    |
| `page`              | Page number to retrieve (page mode only)                          | Number  | `1`     |
| `filters`           | Criteria to filter the records returned                           | JSON    | N/A     |
| `with_completeness` | Returns completeness scores for the product                       | Boolean | `false` |
| `pagination_type`   | `page` (default) or `search_after` for cursor pagination          | String  | `page`  |
| `search_after`      | Cursor from the previous cursor-mode response                     | Number  | N/A     |

### Usage Examples

- **Limit:**
  Retrieve 10 products per page.
  ```http
  GET {{url}}/api/v1/rest/products?limit=10
  ```

- **Page:**
  Fetch products from page 1.
  ```http
  GET {{url}}/api/v1/rest/products?page=1
  ```

- **With Completeness:**
  Fetch completeness scores for the product.
  ```http
  GET {{url}}/api/v1/rest/products?with_completeness=true
  ```

- **Filters:**
  Filters refine query results based on specific product attributes. You can combine multiple filters to achieve the desired output.

  #### Available Filters

  1. **sku**
     - **Operators:**
       - `=`: Exact match for the specified SKU.
       - `IN`: Matches any of the SKUs in the provided list.
       - `NOT IN`: Excludes any of the SKUs in the provided list.

  2. **parent**
     - **Operators:**
       - `=`: Exact match for the parent value.

  3. **status**
     - **Operators:**
       - `=`: Exact match for the status value.

  4. **categories**
     - **Operators:**
       - `IN`: Matches any of the categories in the provided list.
       - `NOT IN`: Excludes any of the categories in the provided list.

  5. **family**
     - **Operators:**
       - `IN`: Matches any of the family types in the provided list.
       - `NOT IN`: Excludes any of the family types in the provided list.

  6. **updated_at** and **created_at** <Badge type="tip" text="3.0" />
     - **Operators:** `>`, `>=`, `<`, `<=`, and `BETWEEN` (which expects exactly two values).
     - Values are date strings, for example `2026-08-01 00:00:00`. An unparseable value returns `422`.
     - These combine with AND, so a delta filter always narrows the result set. Pair them with `pagination_type=search_after` for incremental syncs — see [Delta Synchronization](./whats-new-v3#delta-synchronization).

#### Example Usage

- **Filter by SKU:**
  Retrieve products with specific SKUs.
  ```json
  {"sku":[{"operator":"IN","value":["305312", "584577"]}]}
  ```

- **Filter by Parent:**
  Retrieve products with the parent set to `"root"`.
  ```json
  {"parent":[{"operator":"=","value":"root"}]}
  ```

- **Filter by Status:**
  Retrieve products with status set to `true`.
  ```json
  {"status":[{"operator":"=","value":true}]}
  ```

- **Combined Query:**
  Retrieve 10 products from page 1 that belong to the `root` parent and have a status of `true`.
  ```http
  GET {{url}}/api/v1/rest/products?limit=10&page=1&filters={"parent":[{"operator":"=","value":"root"}],"status":[{"operator":"=","value":true}]}
  ```

### Response

The response returns a paginated list of products in JSON format:

::: details Response
```json
{
  "data": [
    {
      "sku": "100PS3333",
      "status": true,
      "parent": null,
      "family": "default",
      "type": "simple",
      "additional": null,
      "created_at": "2025-06-27T07:20:58.000000Z",
      "updated_at": "2025-06-27T07:23:37.000000Z",
      "values": {
        "common": {
          "sku": "100PS3333",
          "size": "L",
          "color": "Yellow",
          "image": false,
          "url_key": "sample Product",
          "product_number": "Product Number"
        },
        "categories": ["root"],
        "channel_specific": {
          "default": {
            "cost": {"USD": "12"}
          }
        },
        "channel_locale_specific": {
          "default": {
            "en_AU": {
              "name": "Name",
              "price": {"USD": "12"},
              "meta_title": "Meta Title",
              "description": "<p>&nbsp; Description for Product<\/p>",
              "meta_keywords": "meta Keyword",
              "meta_description": "meta Description",
              "short_description": "<p>Short Description&nbsp; for Product<\/p>"
            }
          }
        }
      },
      "completeness": [
        {
          "channel": "default",
          "locale": "en_AU",
          "score": 100
        },
        {
          "channel": "default",
          "locale": "fr_FR",
          "score": 0
        },
        {
          "channel": "ecommerce",
          "locale": "de_DE",
          "score": 0
        },
      ]
    },
    {
      "sku": "100PS",
      "status": true,
      "parent": null,
      "family": "default",
      "type": "simple",
      "additional": null,
      "created_at": "2025-06-27T07:37:01.000000Z",
      "updated_at": "2025-06-27T07:39:07.000000Z",
      "values": {
        "common": {
          "sku": "100PS",
          "size": "M",
          "color": "Green",
          "url_key": "sample Product Test",
          "product_number": "123452"
        },
        "categories": ["root"],
        "channel_specific": {
          "default": {
            "cost": {"USD": "23"}
          }
        },
        "channel_locale_specific": {
          "default": {
            "en_AU": {
              "name": "Product Name",
              "price": {"USD": "23"},
              "meta_title": "Meta",
              "description": "<p>Description For Product<\/p>",
              "meta_keywords": "Key",
              "meta_description": "Description",
              "short_description": "<p>Short Description For Product<\/p>"
            }
          }
        }
      },
      // When there is no completeness setting for this family and product completeness is not calculated blank array is returned
      "completeness": []
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 2,
  "links": {
      "first": "{{url}}/api/v1/rest/products?page=1",
      "last": "{{url}}/api/v1/rest/products?page=1",
      "next": null,
      "prev": null
  }
}
```
:::

## Get Product by SKU

Fetches a single product when you already know its SKU — handy for detail views and sync checks.

```
GET {{url}}/api/v1/rest/products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
GET {{url}}/api/v1/rest/products/100PS3333
```

You can also request completeness data alongside the product:

| Name                | Info                                        | Type    | Default |
|---------------------|---------------------------------------------|---------|---------|
| `with_completeness` | Returns completeness scores for the product | Boolean | false   |

Example:
```
GET {{url}}/api/v1/rest/products/100PS3333?with_completeness=true
```

### Response

The full product record is returned:

::: details Response
```json
{
  "sku": "100PS3333",
  "status": true,
  "parent": null,
  "family": "default",
  "type": "simple",
  "additional": null,
  "created_at": "2025-06-27T07:20:58.000000Z",
  "updated_at": "2025-06-27T07:23:37.000000Z",
  "values": {
    "common": {
      "sku": "100PS3333",
      "size": "L",
      "color": "Yellow",
      "image": false,
      "url_key": "sample Product",
      "product_number": "Product Number"
    },
    "categories": ["root"],
    "channel_specific": {
      "default": {
        "cost": {"USD": "12"}
      }
    },
    "channel_locale_specific": {
      "default": {
        "en_AU": {
          "name": "Name",
          "price": {"USD": "12"},
          "meta_title": "Meta Title",
          "description": "<p>&nbsp; Description for Product<\/p>",
          "meta_keywords": "meta Keyword",
          "meta_description": "meta Description",
          "short_description": "<p>Short Description&nbsp; for Product<\/p>"
        }
      }
    }
  },
  "completeness": [
    {
      "channel": "default",
      "locale": "en_AU",
      "score": 50
    },
    {
      "channel": "default",
      "locale": "fr_FR",
      "score": 80
    },
  ]
}
```
:::

## Product Associations <Badge type="tip" text="3.0" />

A single-product `GET` returns an extra `associations` block alongside `values`. It covers every association type the installation defines — the three built-in sections and any custom type — and carries each link's `additional_data`:

```json
{
    "associations": {
        "related_products": [
            { "related_sku": "100PS", "additional_data": null }
        ],
        "spare_parts": [
            { "related_sku": "FILTER-9", "additional_data": { "quantity": 2 } }
        ]
    }
}
```

The block is returned only for a single product, never on the listing, so a paginated response does not run one query per row. The legacy `values.associations` SKU lists are unchanged.

The same block may be sent when creating or updating a product, under a top-level `associations` key. Note the one difference: a request identifies the linked product with `sku`, while a response returns it as `related_sku`.

```json
{
    "associations": {
        "spare_parts": [
            { "sku": "FILTER-9", "additional_data": { "quantity": 2 } }
        ]
    }
}
```

Each type you submit replaces that type's links entirely, and types you omit are left alone. `additional_data` is validated against the fields defined on that association type — an invalid value fails the request with `422` before anything is written. A SKU that does not resolve is skipped, and a product cannot be associated with itself. See [Configurable Associations](../packages/configurable-associations) for defining types.

## Create a Product

Creates a new simple product with the SKU, family, and attribute values you supply.

```
POST {{url}}/api/v1/rest/products
```

**Headers** — use the [Common Headers](#common-headers).

Send the complete product definition as the request body:

```json
{
    "sku": "100PS3355",
    "status": true,
    "parent": null,
    "family": "default",
    "type": "simple",
    "additional": null,
    "values": {
        "common": {
            "sku": "100PS3355",
            "size": "L",
            "color": "Yellow",
            "image": false,
            "url_key": "sample Product API",
            "product_number": "Product 122"
        },
        "categories": [
            "root"
        ],
        "channel_specific": {
            "default": {
                "cost": {
                    "USD": "12"
                }
            }
        },
        "channel_locale_specific": {
            "default": {
                "en_AU": {
                    "name": "Name",
                    "price": {
                        "USD": "12"
                    },
                    "meta_title": "Meta Title",
                    "description": "<p>&nbsp; Description for Product</p>",
                    "meta_keywords": "meta Keyword",
                    "meta_description": "meta Description",
                    "short_description": "<p>Short Description&nbsp; for Product</p>"
                }
            }
        }
    }
}
```

### Response

A successful creation returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Product created successfully"
}
```
:::

## Update a Product

Replaces a product's data with the payload you send. Use it when you have the full record; for partial changes, prefer [Patch a Product](#patch-a-product).

```
PUT {{url}}/api/v1/rest/products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
PUT {{url}}/api/v1/rest/products/100PS3355
```

Send the updated product as the request body:

```json
{
    "sku": "100PS3355",
    "status": true,
    "parent": null,
    "family": "default",
    "type": "simple",
    "additional": null,
    "values": {
        "common": {
            "sku": "100PS3355",
            "size": "M",
            "color": "Yellow",
            "image": false,
            "url_key": "sample Product API",
            "product_number": "Product 123"
        },
        "categories": [
            "root"
        ],
        "channel_specific": {
            "default": {
                "cost": {
                    "USD": "122"
                }
            }
        },
        "channel_locale_specific": {
            "default": {
                "en_AU": {
                    "name": "Name Update",
                    "price": {
                        "USD": "122"
                    },
                    "meta_title": "Meta Title",
                    "description": "<p>&nbsp; Description for Product Update</p>",
                    "meta_keywords": "meta Keyword",
                    "meta_description": "meta Description",
                    "short_description": "<p>Short Description&nbsp; for Product</p>"
                }
            }
        }
    }
}
```

### Response

A successful update returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```
:::

## Patch a Product

Applies a partial update — only the fields you send are changed, and everything else keeps its current value.

```
PATCH {{url}}/api/v1/rest/products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
PATCH {{url}}/api/v1/rest/products/100PS3355
```

Only include the fields that need to be updated in the request body:

```json
{
    "values": {
        "common": {
            "Name": "Updated Product Name",
            "description": "<p>Partially Updated Description</p>"
        },
        "categories": [
            "master",
            "master_accessories"
        ]
    }
}
```

### Response

A successful patch returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```
:::

## Delete a Product

Permanently removes a product by its SKU.

```
DELETE {{url}}/api/v1/rest/products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
DELETE {{url}}/api/v1/rest/products/100PS3355
```

### Response

The deleted SKU is echoed back so you can confirm the right product was removed:

::: details Response
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "sku": "100PS3355"
}
```
:::

## Delta Synchronization <Badge type="tip" text="3.0" />

Products support incremental sync via date filters and cursor pagination — the recommended pattern for keeping an external system current:

```
GET {{url}}/api/v1/rest/products
    ?filters={"updated_at":[{"operator":">=","value":"2026-08-01 00:00:00"}]}
    &pagination_type=search_after
    &limit=100
```

The response replaces page metadata with a cursor:

```json
{
    "data": [ ... ],
    "search_after": 1234,
    "links": {
        "next": "...?pagination_type=search_after&search_after=1234"
    }
}
```

Follow `links.next` until `search_after` is `null`. Supported date operators on `created_at` / `updated_at`: `>`, `>=`, `<`, `<=`, `BETWEEN` (exactly two values). See [What's New in the v3.0 API](whats-new-v3#delta-synchronization) for details.
