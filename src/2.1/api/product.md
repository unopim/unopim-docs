# Products API



This section details the APIs related to managing products.

### Common Headers

For all API requests, include the following headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Products

**Endpoint:**
```
GET {{url}}/api/v1/rest/products
```
**Headers:**
Use the [Common Headers](#common-headers).

### Query Parameters

| Name                | Info                                            | Type    | Default |
|---------------------|-------------------------------------------------|---------|---------|
| `limit`             | The number of products to retrieve per request  | Number  | `10`    |
| `page`              | Page number to retrieve                         | Number  | `1`     |
| `filters`           | Criteria to filter the records returned         | JSON    | N/A     |
| `with_completeness` | Returns completeness scores for the product     | Boolean | false   |

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

The response will return a list of products in JSON format:

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
---

## Get Product by SKU

**Endpoint:**
```
GET {{url}}/api/v1/rest/products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
GET {{url}}/api/v1/rest/products/100PS3333
```

### Query Parameters

| Name                | Info                                        | Type    | Default |
|---------------------|---------------------------------------------|---------|---------|
| `with_completeness` | Returns completeness scores for the product | Boolean | false   |

Example:
```
GET {{url}}/api/v1/rest/products/100PS3333?with_completeness=true
```


### Response

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
---

## Create a Product

**Endpoint:**
```
POST {{url}}/api/v1/rest/products
```
**Headers:**
Use the [Common Headers](#common-headers).

### Payload

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

::: details Response
```json
{
  "success": true,
  "message": "Product created successfully"
}
```
:::
---

## Update a Product

**Endpoint:**
```
PUT {{url}}/api/v1/rest/products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                       | Type   |
|-------|-----------------------------------|--------|
| `sku` | The unique SKU of the product     | String |

Example:
```
PUT {{url}}/api/v1/rest/products/100PS3355
```

### Payload

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

::: details Response
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```
:::

## Patch a Product

**Endpoint:**
```
PATCH {{url}}/api/v1/rest/products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
PATCH {{url}}/api/v1/rest/products/100PS3355
```

### Payload
Only include the fields that need to be updated:

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

::: details Response
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```
:::

---

## Delete a Product

**Endpoint:**
```
DELETE {{url}}/api/v1/rest/products/{sku}
```
**Headers:**
Use the [Common Headers](#common-headers).

### Path Parameter

| Name  | Description                   | Type   |
|-------|-------------------------------|--------|
| `sku` | The unique SKU of the product | String |

Example:
```
DELETE {{url}}/api/v1/rest/products/100PS3355
```

### Response

::: details Response
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "sku": "100PS3355"
}
```
:::
