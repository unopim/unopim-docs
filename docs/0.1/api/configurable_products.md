# Configurable Products API

[[TOC]]

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
            "sku": "1111104",
            "parent": null,
            "family": "accessories",
            "type": "configurable",
            "additional": null,
            "created_at": "2024-10-03T05:55:58.000000Z",
            "updated_at": "2024-10-03T05:55:58.000000Z",
            "values": {
                "common": {
                    "sku": "1111104"
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
  "sku": "1111104",
  "parent": null,
  "family": "accessories",
  "type": "configurable",
  "additional": null,
  "created_at": "2024-10-03T05:55:58.000000Z",
  "updated_at": "2024-10-03T05:55:58.000000Z",
  "values": {
      "common": {
          "sku": "1111104"
      }
  },
  "super_attributes": [
      "color",
      "size"
  ],
  "variants": []
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
  "sku": "test-product",
  "parent": null,
  "family": "accessories",
  "type": "configurable",
  "additional": null,
  "created_at": "2024-07-12T07:41:29.000000Z",
  "updated_at": "2024-07-24T11:17:13.000000Z",
  "values": {
    "common": {
      "sku": "test-product",
      "Name": "test Product",
      "size": "size4",
      "store": "mobile",
      "status": "false",
      "collection": "option3",
      "description": "<p>test product description</p>",
      "expire_date": "2024-07-12",
      "releasedate": "2024-07-12 12:00:00",
      "auto_exposure": "false",
      "short_description": "test Product"
    },
    "categories": [
      "master_men_blazers",
      "master_men_blazers_deals"
    ],
    "associations": {
      "up_sells": ["1111111304"],
      "cross_sells": ["1111111304"],
      "related_products": ["1111111304"]
    }
  },
  "super_attributes": ["color"]
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
  "sku": "test-product",
  "parent": null,
  "family": "accessories",
  "type": "test",
  "additional": null,
  "created_at": "2024-07-12T07:41:29.000000Z",
  "updated_at": "2024-07-24T11:17:13.000000Z",
  "values": {
    "common": {
      "sku": "test-product",
      "Name": "test Product",
      "size": "size4",
      "store": "mobile",
      "status": "false",
      "collection": "option3",
      "description": "<p>test product description</p>",
      "expire_date": "2024-07-12",
      "releasedate": "2024-07-12 12:00:00",
      "auto_exposure": "false",
      "short_description": "test Product111"
    },
    "categories": [
      "master_men_blazers",
      "master_men_blazers_deals"
    ],
    "associations": {
      "up_sells": ["1111111304"],
      "cross_sells": ["1111111304"],
      "related_products": ["1111111304"]
    }
  },
  "super_attributes": ["color"],
  "variants": [
    {
      "sku": "test-product-option1",
      "attributes": {
        "color": "option1"
      }
    },
    {
      "sku": "test-product-option2",
      "attributes": {
        "color": "option2"
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
  "message": "Configurable product updated successfully"
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
  "parent": "test-product",
  "family": "accessories",
  "additional": null,
  "created_at": "2024-07-12T07:41:29.000000Z",
  "updated_at": "2024-07-24T11:17:13.000000Z",
  "values": {
    "common": {
      "sku": "test-product-option2",
      "Name": "test Product",
      "size": "size4",
      "store": "mobile",
      "status": "false",
      "collection": "option3",
      "description": "<p>test product description</p>",
      "expire_date": "2024-07-12",
      "releasedate": "2024-07-12 12:00:00",
      "auto_exposure": "false",
      "short_description": "test Product111"
    },
    "categories": [
      "master_men_blazers",
      "master_men_blazers_deals"
    ],
    "associations": {
      "up_sells": ["1111111304"],
      "cross_sells": ["1111111304"],
      "related_products": ["1111111304"]
    }
  },
  "variant": {
    "attributes": {
      "color": "option2"
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


