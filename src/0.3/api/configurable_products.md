# Configurable Products API



This section details the APIs related to configurable products.

### Common Headers

For all API requests, include the following headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

---

## Get All Configurable Products

**Endpoint:**
```
GET {{url}}/api/v1/rest/configurable-products
```
**Headers:**
Use the [Common Headers](#common-headers).

### Query Parameters

| Name      | Info                                            | Type   | Default |
|-----------|-------------------------------------------------|--------|---------|
| `limit`   | The number of products to retrieve per request  | Number | `10`    |
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

The response will return a list of configurable products in JSON format:

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
        "first": "{{url}}/api/v1/rest/configrable-products?%3Flimit=10&page=1",
        "last": "{{url}}/api/v1/rest/configrable-products?%3Flimit=10&page=1",
        "next": null,
        "prev": null
    }
}
```
:::

---

## Get Configurable Product by SKU

**Endpoint:**
```
GET {{url}}/api/v1/rest/configurable-products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
GET {{url}}/api/v1/rest/configurable-products/1111104
```

### Response

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
---

## Create a Configurable Product

**Endpoint:**
```
POST {{url}}/api/v1/rest/configurable-products
```
**Headers:**
Use the [Common Headers](#common-headers).

### Request Body Example

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

::: details Response
```json
{
  "success": true,
  "message": "Configurable product created successfully"
}
```
:::

---

## Update a Configurable Product

**Endpoint:**
```
PUT {{url}}/api/v1/rest/configurable-products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Request Body Example

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

::: details Response
```json
{
  "success": true,
  "message": "Configurable product updated successfully"
}
```
:::

---

## Patch a Configurable Product

**Endpoint:**
```
PATCH {{url}}/api/v1/rest/configurable-products/{sku}
```

**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
PATCH {{url}}/api/v1/rest/configurable-products/test-product
```

### Request Body
Only include the fields that need to be updated:

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

::: details Response
```json
{
    "success": true,
    "message": "Product updated successfully"
}
```
:::
---

## Add New Variant (Product Child)

**Endpoint:**
```
POST {{url}}/api/v1/rest/products
```
**Headers:**
Use the [Common Headers](#common-headers).

### Request Body Example

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

::: details Response
```json
{
  "success": true,
  "message": "Product created successfully"
}
```
:::

---