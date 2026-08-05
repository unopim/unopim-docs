# Categories API

This page covers the category endpoints — listing the category tree, reading a single category, and creating, updating, patching, or deleting categories over the REST API.

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Categories

Retrieves a paginated list of categories, optionally filtered by their parent.

```
GET {{url}}/api/v1/rest/categories
```

**Headers** — use the [Common Headers](#common-headers).

You can shape the result set with these query parameters:

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

### Response

The API returns a paginated list of categories in JSON format:

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

## Get Category by Category Code

Fetches a single category when you already know its code.

```
GET {{url}}/api/v1/rest/categories/{category_code}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name            | Description                                                       | Type   |
|-----------------|-------------------------------------------------------------------|--------|
| `category_code` | The unique code for the category (e.g., `master_accessories`)     | String |

### Response

The response contains details of the requested category:

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

## Create a Category

Creates a new category under the parent you specify.

```
POST {{url}}/api/v1/rest/categories
```

**Headers** — use the [Common Headers](#common-headers).

To create a new category, provide the category code, parent category, and any additional data in the request body:

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

Upon successful creation, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Created Successfully"
}
```
:::

## Update a Category

Updates an existing category identified by its code.

```
PUT {{url}}/api/v1/rest/categories/{category_code}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name            | Description                                    | Type   |
|-----------------|------------------------------------------------|--------|
| `category_code` | The unique code for the category to be updated | String |

To update a category, provide the category code, parent category, and any additional data that needs to be updated. Any existing fields not included in the request will remain unchanged.

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

Upon successful update, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Updated Successfully"
}
```
:::

## Patch a Category

Applies a partial update — only the fields you send are changed, and everything else keeps its current value.

```
PATCH {{url}}/api/v1/rest/categories/{category_code}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name           | Description                    | Type   |
|----------------|--------------------------------|--------|
| `category_code`| The unique code of the category| String |

Example:
```
PATCH {{url}}/api/v1/rest/categories/electronic
```

Only include the fields that need to be updated in the request body:

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

A successful patch returns a confirmation message:

::: details Response
```json
{
    "success": true,
    "message": "Category updated successfully."
}
```
:::

## Delete a Category

Permanently removes a category by its code.

```
DELETE {{url}}/api/v1/rest/categories/{category_code}
```

**Headers** — use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name           | Description                    | Type   |
|----------------|--------------------------------|--------|
| `category_code`| The unique code of the category| String |

Example:
```
DELETE {{url}}/api/v1/rest/categories/electronic
```

### Response

The deleted code is echoed back so you can confirm the right category was removed:

::: details Response
```json
{
    "success": true,
    "message": "Category deleted successfully",
    "code": "electronic"
}
```
:::
