# Attributes



### Common Headers

For all API requests, include the following headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

---

## Get All Attributes

**Endpoint:**  
```
GET {{url}}/api/v1/rest/attributes
```
**Headers:**  
Use the [Common Headers](#common-headers).

### Query Parameters

| Name     | Info                                         | Type   | Default |
|----------|----------------------------------------------|--------|---------|
| `limit`  | Maximum number of records to return per request | Number | `10`    |
| `page`   | Page number to retrieve based on the limit  | Number | `1`     |
| `filters`| Criteria to filter the records returned      | JSON   | N/A     |

#### Usage Examples

- **Limit:**  
  Retrieves results limited to a specified number.
  
  ```http
  GET {{url}}/api/v1/rest/attributes?limit=10
  ```

- **Page:**  
  Fetches the specified page of results.

  ```http
  GET {{url}}/api/v1/rest/attributes?page=1
  ```

- **Filters:**  
  Filters refine query results based on specific attribute criteria. You can combine multiple filters to achieve the desired output.

  #### Available Filters

  1. **code**
    - **Operators:** 
      - `=`: Exact match for the specified code.
      - `IN`: Matches any of the codes in the provided list.
      - `NOT IN`: Excludes any of the codes in the provided list.

  2. **type**
    - **Operators:** 
      - `=`: Exact match for the specified type.
      - `IN`: Matches any of the types in the provided list.
      - `NOT IN`: Excludes any of the types in the provided list.

  #### Example Usage

  - **Filter by Code**:
    ```json
    {"code":[{"operator":"IN","value":["weight", "height"]}]}
    ```

  - **Filter by Type**:
    ```json
    {"type":[{"operator":"=","value":"text"}]}
    ```

- **Combined Query:**  
  Retrieve a specific page of results with filters applied.

  ```http
  GET {{url}}/api/v1/rest/attributes?limit=10&page=1&filters={"code":[{"operator":"IN","value":["weight"]}]}
  ```

### Response

The API response will return a JSON object structured as follows:
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

## Get an Attribute By Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/attributes/{attribute_code}
```
**Headers:**  
Use the [Common Headers](#common-headers).

- **attribute_code**: The unique code for the attribute (e.g., `status`) to fetch details for a specific attribute.

### Response
The response will return a JSON object containing the details of the requested attribute:

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
---

## Create an Attribute

**Endpoint:**  
```
POST {{url}}/api/v1/rest/attributes
```
**Headers:**  
Use the [Common Headers](#common-headers).

#### Request Body :

This request body must include all required fields to create a new attribute.

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

### Response Body :

Upon successful creation of the attribute, the API will return a success message.

::: details Response
```json
{
    "success": true,
    "message": "Attribute Created Successfully"
}
```
:::

---

## Update an Attribute By Code

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/attributes/{attribute_code}
```
**Headers:**  
Use the [Common Headers](#common-headers).

#### Request Body :

To update an existing attribute, provide the necessary fields in the request body. Only the fields that need to be changed should be included.

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

The API will return a confirmation message upon successful update.

::: details Response
```json
{
    "success": true,
    "message": "Attribute Updated Successfully"
}
```
:::