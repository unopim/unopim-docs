# Attributes

Attributes define the fields your products carry — text, selects, dates, prices, and more. This page covers listing, creating, updating, and deleting attributes over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Attributes

Retrieves a paginated list of attributes, optionally filtered by code or type.

```
GET {{url}}/api/v1/rest/attributes
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts the following query parameters:

| Name     | Info                                            | Type   | Default |
|----------|-------------------------------------------------|--------|---------|
| `limit`  | Records per request. Clamped to a maximum of `100` | Number | `10`    |
| `page`   | Page number to retrieve based on the limit      | Number | `1`     |
| `filters`| Criteria to filter the records returned         | JSON   | N/A     |

### Usage Examples

- **Limit** retrieves results limited to a specified number:

  ```http
  GET {{url}}/api/v1/rest/attributes?limit=10
  ```

- **Page** fetches the specified page of results:

  ```http
  GET {{url}}/api/v1/rest/attributes?page=1
  ```

- **Filters** refine the results by attribute criteria, and you may combine several in one request:

  The `code` filter supports the `=` (exact match), `IN` (matches any code in the list), and `NOT IN` (excludes the listed codes) operators. The `type` filter supports the same three operators for attribute types.

  Filter by code:

  ```json
  {"code":[{"operator":"IN","value":["weight", "height"]}]}
  ```

  Filter by type:

  ```json
  {"type":[{"operator":"=","value":"text"}]}
  ```

- A combined query retrieves a specific page of results with filters applied:

  ```http
  GET {{url}}/api/v1/rest/attributes?limit=10&page=1&filters={"code":[{"operator":"IN","value":["weight"]}]}
  ```

### Response

The response contains the matching attributes together with pagination metadata:

::: details Response

```json
{
  "data": [
    {
      "code": "weight",
      "type": "text",
      "validation": "decimal",
      "regex_pattern": null,
      "position": 25,
      "is_required": 1,
      "is_unique": 0,
      "value_per_locale": 0,
      "value_per_channel": 0,
      "enable_wysiwyg": 0,
      "labels": {
        "en_US": "Weight"
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 1,
  "links": {
      "first": "http://127.0.0.1:8000/api/v1/rest/attributes?page=1",
      "last": "http://127.0.0.1:8000/api/v1/rest/attributes?page=1",
      "next": null,
      "prev": null
  }
}
```

:::

## Get an Attribute by Code

Retrieves a single attribute by its unique code.

```
GET {{url}}/api/v1/rest/attributes/{attribute_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name               | Description                                          | Type   |
|--------------------|------------------------------------------------------|--------|
| `{attribute_code}` | The unique code for the attribute (e.g., `status`)   | String |

### Response

The response contains the details of the requested attribute:

::: details Response
```json
{
    "code": "weight",
    "type": "text",
    "validation": "decimal",
    "regex_pattern": null,
    "position": 25,
    "is_required": 1,
    "is_unique": 0,
    "value_per_locale": 0,
    "value_per_channel": 0,
    "enable_wysiwyg": 0,
    "labels": {
        "en_US": "Weight"
    }
}
```
:::

## Create an Attribute

Creates a new attribute from the fields you submit.

```
POST {{url}}/api/v1/rest/attributes
```

**Headers:** use the [Common Headers](#common-headers).

The request body must include all required fields for the new attribute:

```json
{
    "code": "erpname",
    "type": "text",
    "validation": null,
    "regex_pattern": null,
    "position": 25,
    "is_required": 1,
    "is_unique": 0,
    "value_per_locale": 0,
    "value_per_channel": 0,
    "enable_wysiwyg": 0,
    "labels": {
        "en_US": "ERP Name",
        "de_DE": "ERP Name",
        "fr_FR": "ERP Name"
    }
}
```

### Response

Upon successful creation, the API returns a success message:

::: details Response
```json
{
    "success": true,
    "message": "Attribute Created Successfully"
}
```
:::

## Update an Attribute by Code

Updates an existing attribute; include only the fields that need to change.

```
PUT {{url}}/api/v1/rest/attributes/{attribute_code}
```

**Headers:** use the [Common Headers](#common-headers).

Provide the fields to update in the request body:

```json
{
    "code": "releasedate",
    "type": "datetime",
    "validation": null,
    "regex_pattern": null,
    "position": 10,
    "is_required": 1,
    "is_unique": 0,
    "value_per_locale": 0,
    "value_per_channel": 0,
    "enable_wysiwyg": 0,
    "labels": {
        "en_US": "Release Date",
        "fr_FR": "Date de sortie",
        "de_DE": "Veröffentlichungsdatum"
    }
}
```

### Response

Upon successful update, the API returns a confirmation message:

::: details Response
```json
{
    "success": true,
    "message": "Attribute Updated Successfully"
}
```
:::

## Partially Update an Attribute <Badge type="tip" text="3.0" />

`PATCH` performs a partial update — only the submitted keys change; everything else keeps its value.

```
PATCH {{url}}/api/v1/rest/attributes/{attribute_code}
```

**Headers:** use the [Common Headers](#common-headers).

Submit just the keys you want to change:

```json
{
    "labels": {
        "en_US": "Updated label"
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

## Delete an Attribute <Badge type="tip" text="3.0" />

Deletes the attribute identified by its code.

```
DELETE {{url}}/api/v1/rest/attributes/{attribute_code}
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
