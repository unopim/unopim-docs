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

| Name      | Info                                            | Type   | Default |
|-----------|-------------------------------------------------|--------|---------|
| `limit`   | The number of products to retrieve per request  | Number | `10`    |
| `page`    | Page number to retrieve                         | Number | `1`     |
| `filters` | Criteria to filter the records returned         | JSON   | N/A     |

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
          "sku": "305312",
          "parent": null,
          "family": "default",
          "type": "simple",
          "created_at": "2024-09-25T14:48:20.000000Z",
          "updated_at": "2024-09-25T14:48:20.000000Z",
          "values": {
              "common": {
                  "sku": "305312"
              }
          }
      },
      {
          "sku": "584577",
          "parent": null,
          "family": "default",
          "type": "simple",
          "created_at": "2024-09-25T14:49:00.000000Z",
          "updated_at": "2024-09-25T14:49:00.000000Z",
          "values": {
              "common": {
                  "sku": "584577"
              }
          }
      }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 3,
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
GET {{url}}/api/v1/rest/products/1111111304
```

### Response

::: details Response
```json
{
  "sku": "1111111304",
  "parent": null,
  "family": "default",
  "type": "simple",
  "additional": null,
  "created_at": "2024-10-03T05:25:49.000000Z",
  "updated_at": "2024-10-03T05:25:49.000000Z",
  "values": {
      "common": {
          "sku": "1111111304"
      }
  }
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
    "sku": "44441",
    "parent": null,
    "family": "accessories",
    "type": "simple",
    "created_at": "2024-07-11T13:21:46.000000Z",
    "updated_at": "2024-07-24T09:50:08.000000Z",
    "values": {
        "common": {
            "sku": "44441",
            "Name": "Webkul Simple Product",
            "size": "size3",
            "color": "option1",
            "files": "product/1/files/sample.pdf",
            "image": "product/1/image/sample.jpg",
            "price": "{\"USD\":\"100\"}",
            "store": "garment",
            "status": "true",
            "collection": "option2,option3",
            "description": "<p>Product Description</p>",
            "expire_date": "2024-07-11",
            "releasedate": "2024-07-11 08:25:00",
            "auto_exposure": "true",
            "colormuliselect": "red1,blue1",
            "short_description": "Short Description"
        },
        "categories": [
            "master",
            "master_accessories",
            "master_accessories_belts"
        ],
        "associations": {
            "up_sells": ["1111111307"],
            "cross_sells": ["1111111307"],
            "related_products": ["1111111307"]
        },
        "locale_specific": {
            "de_DE": {"colorlocalewise": "pink"},
            "en_US": {"colorlocalewise": "pink"},
            "fr_FR": {"colorlocalewise": "white"}
        },
        "channel_specific": {
            "default": {"colorchannelwise": "opt2"},
            "ecommerce": {"colorchannelwise": "opt2"}
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
PUT {{url}}/api/v1/rest/products/44441
```

### Payload

```json
{
    "sku": "44441",
    "parent": null,
    "family": "accessories",
    "type": "simple",
    "created_at": "2024-07-11T13:21:46.000000Z",
    "updated_at": "2024-07-24T09:50:08.000000Z",
    "values": {
        "common": {
            "sku": "44441",
            "Name": "Updated Product",
            "size": "size3",
            "color": "option1",
            "files": "product/1/files/sample.pdf",
            "image": "product/1/image/sample.jpg",
            "price": "{\"USD\":\"100\"}",
            "store": "garment",
            "status": "true",
            "collection": "option2,option3",
            "description": "<p>Updated Product Description</p>",
            "expire_date": "2024-07-11",
            "releasedate": "2024-07-11 08:25:00",
            "auto_exposure": "true",
            "colormuliselect": "red1,blue1",
            "short_description": "Updated Short Description"
        },
        "categories": [
            "master",
            "master_accessories_belts"
        ],
        "associations": {
            "up_sells": ["1111111307"],
            "cross_sells": ["1111111307"],
            "related_products": ["1111111307"]
        },
        "locale_specific": {
            "de_DE": {"colorlocalewise": "black"},
            "en_US": {"colorlocalewise": "pink"},
            "fr_FR": {"colorlocalewise": "white"}
        },
        "channel_specific": {
            "default": {"colorchannelwise": "opt2"},
            "ecommerce": {"colorchannelwise": "opt2"}
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