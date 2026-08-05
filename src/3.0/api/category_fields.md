# Category Fields

Category fields define the extra data your categories carry beyond their name and position. This page covers managing them over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Category Fields

Retrieves a paginated list of category fields.

```
GET {{url}}/api/v1/rest/category-fields
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts the following query parameters:

| Name    | Description                   | Type   | Default |
|---------|-------------------------------|--------|---------|
| `limit` | Number of records to return   | Number | `100`   |
| `page`  | Page number for pagination    | Number | `1`     |

For example, to retrieve the first page with up to 100 category fields:

```http
GET {{url}}/api/v1/rest/category-fields?limit=100&page=1
```

### Response

The response contains the list of category fields with pagination metadata:

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

## Get a Category Field by Code

Retrieves a single category field by its unique code.

```
GET {{url}}/api/v1/rest/category-fields/{field_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name           | Description                                                    | Type   |
|----------------|----------------------------------------------------------------|--------|
| `{field_code}` | The unique code for the category field (e.g., `simple_select`) | String |

### Response

The response contains the details of the requested category field:

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

## Create a Category Field

Creates a new category field from its code, type, labels, and configuration.

```
POST {{url}}/api/v1/rest/category-fields
```

**Headers:** use the [Common Headers](#common-headers).

Provide the necessary attributes like code, type, and labels in the request body:

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

Upon successful creation, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Field Created Successfully"
}
```
:::

## Update a Category Field by Code

Updates an existing category field; include only the attributes you want to modify.

```
PUT {{url}}/api/v1/rest/category-fields/{field_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name           | Description                                              | Type   |
|----------------|----------------------------------------------------------|--------|
| `{field_code}` | The unique code for the category field (e.g., `erpname`) | String |

Provide the attributes you want to modify in the request body:

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

Upon successful update, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Field Updated Successfully"
}
```
:::

## Partially Update a Category Field <Badge type="tip" text="3.0" />

`PATCH` performs a partial update — only the submitted keys change; everything else keeps its value.

```
PATCH {{url}}/api/v1/rest/category-fields/{category_field_code}
```

**Headers:** use the [Common Headers](#common-headers).

Submit just the keys you want to change:

```json
{
    "labels": {
        "en_US": "Updated field label"
    }
}
```

### Response

A successful patch returns a confirmation message:

```json
{
    "success": true,
    "message": "Updated successfully."
}
```

## Delete a Category Field <Badge type="tip" text="3.0" />

Deletes the category field identified by its code.

```
DELETE {{url}}/api/v1/rest/category-fields/{category_field_code}
```

**Headers:** use the [Common Headers](#common-headers).

### Response

A successful deletion returns a confirmation message:

```json
{
    "success": true,
    "message": "Deleted successfully."
}
```

::: warning
Deletion is permanent and follows the same guards as the admin panel — a resource still in use (for example an attribute mapped to a family) is refused with a `422` explaining why.
:::
