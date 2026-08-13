# Configurable Products API

This page covers configurable products — parent products that group variants by super attributes such as color and size. You'll find endpoints for listing, reading, creating, updating, and patching configurable products, plus adding variants.

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Configurable Products

Retrieves a paginated list of configurable products, with optional filters to narrow the result set.

```
GET {{url}}/api/v1/rest/configurable-products
```

**Headers** — use the [Common Headers](#common-headers).

You can shape the result set with these query parameters:

| Name      | Info                                            | Type   | Default |
|-----------|-------------------------------------------------|--------|---------|
| `limit`   | Products per request. Clamped to a maximum of `100` | Number | `10`    |
| `page`    | Page number to retrieve                         | Number | `1`     |
| `filters` | Criteria to filter the records returned         | JSON   | N/A     |

### Usage Examples

- **Limit:**
  Retrieve 10 configurable products per page.
  ```http
  GET {{url}}/api/v1/rest/configurable-products?limit=10
  ```

- **Page:**
  Fetch configurable products from page 1.
  ```http
  GET {{url}}/api/v1/rest/configurable-products?page=1
  ```

- **Filters:**
  Filters refine query results based on specific configurable product attributes. You can combine multiple filters to achieve the desired output.

  #### Available Filters

  1. **sku**
     - **Operators:**
       - `=`: Exact match for the specified SKU.
       - `IN`: Matches any of the SKUs in the provided list.
       - `NOT IN`: Excludes any of the SKUs in the provided list.

  2. **categories**
     - **Operators:**
       - `IN`: Matches any of the categories in the provided list.
       - `NOT IN`: Excludes any of the categories in the provided list.

#### Example Usage

- **Filter by SKU:**
  Retrieve configurable products with specific SKUs.
  ```json
  {"sku":[{"operator":"IN","value":["305312", "584577"]}]}
  ```

- **Filter by Categories:**
  Retrieve configurable products with specific categories.
  ```json
  {"categories":[{"operator":"IN","value":["category1", "category2"]}]}
  ```

- **Combined Query:**
  Retrieve 10 configurable products from page 1 that have specific SKUs and categories.
  ```http
  GET {{url}}/api/v1/rest/configurable-products?limit=10&page=1&filters={"sku":[{"operator":"IN","value":["305312", "584577"]}],"categories":[{"operator":"IN","value":["category1", "category2"]}]}
  ```

### Response

The response returns a paginated list of configurable products in JSON format:

::: details Response
```json
{
    "data": [
         {
            "sku": "2001PS",
            "status": true,
            "parent": null,
            "family": "default",
            "type": "configurable",
            "additional": null,
            "created_at": "2025-06-27T09:34:16.000000Z",
            "updated_at": "2025-06-27T09:36:36.000000Z",
            "values": {
                "common": {
                    "sku": "2001PS",
                    "url_key": "sample Configurable",
                    "product_number": "Product Number 21"
                },
                "categories": [
                    "root"
                ],
                "channel_specific": {
                    "default": {
                        "cost": {
                            "USD": "5645"
                        }
                    }
                },
                "channel_locale_specific": {
                    "default": {
                        "en_AU": {
                            "name": "Product Name Configurable",
                            "price": {
                                "USD": "5465"
                            },
                            "meta_title": "Title",
                            "description": "<p>Description of Product</p>",
                            "meta_keywords": "Keywords",
                            "meta_description": "Description",
                            "short_description": "<p>Short Description For Product</p>"
                        }
                    }
                }
            },
            "super_attributes": [
                "color",
                "size"
            ],
            "variants": []
        }
    ],
    "current_page": 1,
    "last_page": 1,
    "total": 1,
    "links": {
        "first": "{{url}}/api/v1/rest/configurable-products?limit=10&page=1",
        "last": "{{url}}/api/v1/rest/configurable-products?limit=10&page=1",
        "next": null,
        "prev": null
    }
}
```
:::

## Get Configurable Product by SKU

Fetches a single configurable product, including its super attributes and variants.

```
GET {{url}}/api/v1/rest/configurable-products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
GET {{url}}/api/v1/rest/configurable-products/1111104
```

### Response

The full configurable product record is returned:

::: details Response
```json
{
    "sku": "2001PS",
    "status": true,
    "parent": null,
    "family": "default",
    "type": "configurable",
    "additional": null,
    "created_at": "2025-06-27T09:34:16.000000Z",
    "updated_at": "2025-06-27T09:36:36.000000Z",
    "values": {
        "common": {
            "sku": "2001PS",
            "url_key": "sample Configurable",
            "product_number": "Product Number 21"
        },
        "categories": [
            "root"
        ],
        "channel_specific": {
            "default": {
                "cost": {
                    "USD": "5645"
                }
            }
        },
        "channel_locale_specific": {
            "default": {
                "en_AU": {
                    "name": "Product Name Configurable",
                    "price": {
                        "USD": "5465"
                    },
                    "meta_title": "Title",
                    "description": "<p>Description of Product</p>",
                    "meta_keywords": "Keywords",
                    "meta_description": "Description",
                    "short_description": "<p>Short Description For Product</p>"
                }
            }
        }
    },
    "super_attributes": [
        "color",
        "size"
    ],
    "variants":[]
}
```
:::

## Create a Configurable Product

Creates a new configurable product with the super attributes that its variants will vary on.

```
POST {{url}}/api/v1/rest/configurable-products
```

**Headers** — use the [Common Headers](#common-headers).

Send the complete product definition as the request body:

```json
{
    "sku": "2001PS2",
    "status": true,
    "parent": null,
    "family": "default",
    "type": "configurable",
    "additional": null,
    "values": {
        "common": {
            "sku": "2001PS2",
            "url_key": "sample Configurable Test",
            "product_number": "Product Number 212"
        },
        "categories": [
            "root"
        ],
        "channel_specific": {
            "default": {
                "cost": {
                    "USD": "5645"
                }
            }
        },
        "channel_locale_specific": {
            "default": {
                "en_AU": {
                    "name": "Product Name Configurable",
                    "price": {
                        "USD": "5465"
                    },
                    "meta_title": "Title",
                    "description": "<p>Description of Product</p>",
                    "meta_keywords": "Keywords",
                    "meta_description": "Description",
                    "short_description": "<p>Short Description For Product</p>"
                }
            }
        }
    },
    "super_attributes": [
        "color",
        "size"
    ],
    "variants": []
}
```

### Response

A successful creation returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Configurable product created successfully"
}
```
:::

## Update a Configurable Product

Replaces a configurable product's data with the payload you send. For partial changes, prefer [Patch a Configurable Product](#patch-a-configurable-product).

```
PUT {{url}}/api/v1/rest/configurable-products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

Send the updated product as the request body:

```json
{
    "sku": "2001PS2",
    "status": true,
    "parent": null,
    "family": "default",
    "type": "configurable",
    "additional": null,
    "values": {
        "common": {
            "sku": "2001PS2",
            "url_key": "sample Configurable Update",
            "product_number": "Product Number 212"
        },
        "categories": [
            "root"
        ],
        "channel_specific": {
            "default": {
                "cost": {
                    "USD": "565"
                }
            }
        },
        "channel_locale_specific": {
            "default": {
                "en_AU": {
                    "name": "Product Name Configurable",
                    "price": {
                        "USD": "545"
                    },
                    "meta_title": "Title",
                    "description": "<p>Description of Product Update</p>",
                    "meta_keywords": "Keywords",
                    "meta_description": "Description",
                    "short_description": "<p>Short Description For Product</p>"
                }
            }
        }
    },
    "super_attributes": [
        "color",
        "size"
    ],
    "variants": []
}
```

### Response

A successful update returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Configurable product updated successfully"
}
```
:::

## Patch a Configurable Product

Applies a partial update — only the fields you send are changed, including super attributes and variants if provided.

```
PATCH {{url}}/api/v1/rest/configurable-products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
PATCH {{url}}/api/v1/rest/configurable-products/test-product
```

Only include the fields that need to be updated in the request body:

```json
{
    "values": {
        "common": {
            "Name": "Product Name Updated",
            "short_description": "short description"
        },
        "categories": [
            "root"
        ]
    },
    "super_attributes": ["size"],
    "variants": [
        {
            "sku": "configurable-product-5-small",
            "attributes": {
                "size": "small"
            }
        }
    ]
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

## Add New Variant (Product Child)

Creates a variant under an existing configurable product by pointing the `parent` field at it and supplying the variant's attribute values.

```
POST {{url}}/api/v1/rest/products
```

**Headers** — use the [Common Headers](#common-headers).

Send the variant definition as the request body:

```json
{
    "parent": "2001PS",
    "family": "default",
    "additional": null,
    "values": {
        "common": {
            "sku": "product-option1"
        },
        "categories": [
            "root"
        ]
    },
    "variant": {
        "attributes": {
            "color": "Red",
            "size": "L"
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

## Delete a Configurable Product

Deletes the configurable product identified by its SKU, along with its variants.

```
DELETE {{url}}/api/v1/rest/configurable-products/{sku}
```

**Headers** — use the [Common Headers](#common-headers).

### Response

```json
{
    "success": true,
    "message": "Product deleted successfully."
}
```

::: warning
Deleting a configurable product removes every variant beneath it. There is no undo.
:::

## Deprecated Alias <Badge type="warning" text="deprecated" />

The misspelled `configrable-products` prefix still answers with identical behavior but returns RFC 8594 deprecation headers:

```
Deprecation: true
Link: </api/v1/rest/configurable-products>; rel="successor-version"
```

Migrate clients to `configurable-products`; the alias will be removed in a future release.
