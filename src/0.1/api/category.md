# Category



## Get All Categories

**Endpoint:**  
```
GET {{url}}/api/v1/rest/categories
```

### Query Parameters

| Name      | Info                                         | Type   | Default |
|-----------|----------------------------------------------|--------|---------|
| `filters` | Filter by parent category (e.g., `master`)   | JSON   | N/A     |
| `page`    | Page number to retrieve                      | Number | `1`     |

#### Usage Examples

- **Filters:**  
  Retrieve categories that have a specific parent category.

  ```http
  GET {{url}}/api/v1/rest/categories?filters={"parent":[{"operator":"=","value": "master"}]}
  ```

- **Page:**  
  Retrieve a specific page of categories.

  ```http
  GET {{url}}/api/v1/rest/categories?page=1
  ```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API will return a list of categories in a JSON format.

::: details Response
```json
{
  "data": [
    {
      "code": "master_accessories",
      "parent": "master",
      "additional_data": {
        "common": {
          "description": "Accessories Category"
        }
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 1,
  "links": {
    "first": "{{url}}/api/v1/rest/categories?page=1",
    "last": "{{url}}/api/v1/rest/categories?page=1",
    "next": null,
    "prev": null
  }
}
```
:::

---

## Get Category by Category Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/categories/{category_code}
```

- **category_code**: The unique code for the category (e.g., `master_accessories`) to fetch details for a specific category.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The response will contain details of the requested category.

::: details Response
```json
{
  "code": "master_accessories",
  "parent": "master",
  "additional_data": {
    "common": {
      "description": "Accessories Category"
    },
    "locale_specific": {
      "en_US": {
        "name": "Master Accessories"
      }
    }
  }
}
```
:::

---

## Create a Category

**Endpoint:**  
```
POST {{url}}/api/v1/rest/categories
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To create a new category, provide the category code, parent category, and any additional data.

#### Example Request Body:

```json
{
    "code": "electronic4",
    "parent": "electronic2",
    "additional_data": {
        "common": {
            "file": "https://morth.nic.in/sites/default/files/dd12-13_0.pdf",
            "image": "https://www.gstatic.com/webp/gallery3/1.sm.png",
            "unique": "Electronics Unique Category",
            "boolean": "1",
            "date123": "2024-07-24",
            "checkbox": "cbcat2,cbcat3",
            "required": "Electronics Required Category",
            "date_time": "2024-07-23 11:40:00",
            "description": "Electronics Category Description",
            "multi_select": "mcat3,mcat4",
            "configuration": "Electronics Configuration Section Category",
            "simple_select": "cat2",
            "description_editor": "<ol>\r\n<li><em><strong>Electronics category Description Editor</strong></em></li>\r\n</ol>"
        },
        "locale_specific": {
            "de_DE": {
                "name": "Electronic 3 (de_DE)"
            },
            "en_US": {
                "name": "Electronic 3(en_US)"
            },
            "fr_FR": {
                "name": "Electronic 3(fr_FR)"
            }
        }
    }
}
```

### Response

Upon successful creation, the API will return a success message.

::: details Response
```json
{
  "success": true,
  "message": "Category Created Successfully"
}
```
:::

## Update a Category

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/categories/{category_code}
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Path Parameter

- **category_code**: The unique code for the category to be updated.

### Request Body

To update a category, provide the category code, parent category, and any additional data that needs to be updated. Any existing fields not included in the request will remain unchanged.

#### Example Request Body:

```json
{
  "code": "electronic3",
  "parent": "electronic2",
  "additional_data": {
      "common": {
          "file": "category/19/file/WK-HR-004 - Holiday list_2020.pdf",
          "image": "category/19/image/6.jpg",
          "unique": "Electronics Unique Category",
          "boolean": "1",
          "date123": "2024-07-24",
          "checkbox": "cbcat2,cbcat3",
          "required": "Electronics Required Category",
          "date_time": "2024-07-23 11:40:00",
          "description": "Electronics Category Description",
          "multi_select": "mcat3,mcat4",
          "configuration": "Electronics Configuration Section Category",
          "simple_select": "cat2",
          "description_editor": "<ol>\r\n<li><em><strong>Electronics category Description Editor</strong></em></li>\r\n</ol>"
      },
      "locale_specific": {
          "de_DE": {
              "name": "Electronic 4 (de_DE)",
              "locale": "Electronic Locale wise Category DE"
          },
          "en_US": {
              "name": "Electronic 4(en_US)",
              "locale": "Electronic Locale wise Category EN"
          },
          "fr_FR": {
              "name": "Electronic 4(fr_FR)",
              "locale": "Electronic Locale wise Category FR"
          }
      }
  }
}
```

### Response

Upon successful update, the API will return a success message indicating the category has been updated.

::: details Response
```json
{
  "success": true,
  "message": "Category Updated Successfully"
}
```
:::
