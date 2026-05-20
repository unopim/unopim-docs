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
          "code": "root",
          "parent": null,
          "additional_data": null
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
    "code": "electronic",
    "parent": null,
    "additional_data": {
        "locale_specific": {
            "en_US": {
                "name": "Electronic (en_US)",
                "description": "<ol>\n<li><em><strong>Electronics category Description Editor</strong></em></li>\n</ol>"
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
    "code": "electronic",
    "parent": "root",
    "additional_data": {
        "locale_specific": {
            "en_US": {
                "name": "Electronic (en_US)",
                "description": "<ol>\r\n<li><em><strong>Electronics category Description Editor</strong></em></li>\r\n</ol>"
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
    "code": "electronic",
    "parent": "root",
    "additional_data": {
        "locale_specific": {
            "en_US": {
                "name": "Electronic",
                "description": "<ol>\r\n<li><em><strong>Electronics category Description Editor</strong></em></li>\r\n</ol>"
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

## Patch a Category

**Endpoint:**
```
PATCH {{url}}/api/v1/rest/categories/{category_code}
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Path Parameter

| Name           | Description                    | Type   |
|----------------|--------------------------------|--------|
| `category_code`| The unique code of the category| String |

Example:
```
PATCH {{url}}/api/v1/rest/categories/electronic
```

### Payload
Only include the fields that need to be updated:

```json
{
    "additional_data": {
        "locale_specific": {
            "en_US": {
                "name": "Updated Electronic Name",
                "description": "<ol>\r\n<li><em><strong>Updated Electronics category Description Editor</strong></em></li>\r\n</ol>"
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
    "message": "Category updated successfully."
}
```
:::

---

## Delete a Category

**Endpoint:**
```
DELETE {{url}}/api/v1/rest/categories/{category_code}
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Path Parameter

| Name           | Description                    | Type   |
|----------------|--------------------------------|--------|
| `category_code`| The unique code of the category| String |

Example:
```
DELETE {{url}}/api/v1/rest/categories/electronic
```

### Response

::: details Response
```json
{
    "success": true,
    "message": "Category deleted successfully",
    "code": "electronic"
}
```
:::