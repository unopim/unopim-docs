# Category Fields APIs

[[TOC]]

In this section, we will explore all the APIs related to **Category Fields**.

## Get All Category Fields

**Endpoint:**  
```
GET {{url}}/api/v1/rest/category-fields
```

### Query Parameters

| Name   | Description                    | Type   | Default |
|--------|--------------------------------|--------|---------|
| `limit` | Number of records to return   | Number | `100`   |
| `page`  | Page number for pagination    | Number | `1`     |

### Example Usage

- **Limit and Page:**  
  Retrieve the first page with up to 100 category fields.

  ```http
  GET {{url}}/api/v1/rest/category-fields?limit=100&page=1
  ```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API will return a list of category fields in a JSON format.

::: details Response
```json
{
  "data": [
    {
      "code": "erpname",
      "type": "text",
      "labels": {
        "en_US": "Erp Name"
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 1,
  "links": {
    "first": "{{url}}/api/v1/rest/category-fields?page=1",
    "last": "{{url}}/api/v1/rest/category-fields?page=1",
    "next": null,
    "prev": null
  }
}
```
:::

---

## Get a Category Field by Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/category-fields/{field_code}
```

- **field_code**: The unique code for the category field (e.g., `simple_select`) to fetch details for a specific field.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The response will contain details of the requested category field.

::: details Response
```json
{
  "code": "simple_select",
  "type": "select",
  "labels": {
    "en_US": "Simple Select"
  }
}
```
:::

---

## Create a Category Field

**Endpoint:**  
```
POST {{url}}/api/v1/rest/category-fields
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To create a new category field, provide the necessary attributes like code, type, and labels.

#### Example Request Body:

```json
{
    "code": "erpname",
    "type": "text",
    "status": 1,
    "validation": null,
    "regex_pattern": "",
    "position": 1,
    "is_required": 0,
    "is_unique": 0,
    "value_per_locale": 0,
    "enable_wysiwyg": 0,
    "section": "left",
    "labels": {
        "en_US": "Erp Name",
        "fr_FR": "Erp Name",
        "de_DE": "Erp Name"
    }
}
```

### Response

Upon successful creation, the API will return a success message.

::: details Response
```json
{
  "success": true,
  "message": "Category Field Created Successfully"
}
```
:::

---

## Update a Category Field by Code

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/category-fields/{field_code}
```

- **field_code**: The unique code for the category field (e.g., `erpname`) to be updated.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To update an existing category field, provide the attributes you want to modify.

#### Example Request Body:

```json
{
    "type": "text",
    "status": 1,
    "regex_pattern": "",
    "validation": null,
    "position": 1,
    "is_required": 1,
    "is_unique": 1,
    "section": "left",
    "value_per_locale": 1,
    "enable_wysiwyg": 0,
    "labels": {
        "en_US": "Erp Name",
        "fr_FR": "Erp Name",
        "de_DE": "Erp Name"
    }
}
```

### Response

Upon successful update, the API will return a success message.

::: details Response
```json
{
  "success": true,
  "message": "Category Field Updated Successfully"
}
```
:::
