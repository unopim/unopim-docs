# Attribute Groups
[[TOC]]

## Get All Attribute Groups

**Endpoint:**  
```
GET {{url}}/api/v1/rest/attribute-groups
```

### Query Parameters:

| Name   | Info                               | Type   | Default |
|--------|------------------------------------|--------|---------|
| `page` | The page number to retrieve        | Number | `1`     |

#### Usage Example

- **Page:**
  
  Fetches the specified page of attribute groups.
  ```http
  GET {{url}}/api/v1/rest/attribute-groups?page=1
  ```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API response returns a JSON object containing the list of attribute groups.

::: details Response
```json
{
  "data": [
    {
      "code": "marketing",
      "labels": {
        "en_US": "Marketing",
        "fr_FR": "Marketing",
        "de_DE": "Marketing"
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 1,
  "links": {
    "first": "{{url}}/api/v1/rest/attribute-groups?page=1",
    "last": "{{url}}/api/v1/rest/attribute-groups?page=1",
    "next": null,
    "prev": null
  }
}
```
:::

---

## Get Attribute Group By Group Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/attribute-groups/{group_code}
```

- **group_code**: The unique code of the attribute group (e.g., `marketing`) to fetch details.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The response contains details for the requested attribute group.

::: details Response
```json
{
  "code": "marketing",
  "labels": {
    "en_US": "Marketing",
    "fr_FR": "Marketing",
    "de_DE": "Marketing"
  }
}
```
:::

---

## Create an Attribute Group

**Endpoint:**  
```
POST {{url}}/api/v1/rest/attribute-groups
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To create a new attribute group, provide the unique code and labels in different languages.

#### Example Request Body:

```json
{
    "code": "PIM2",
    "labels": {
        "en_US": "Pim Laravel1 German",
        "fr_FR": "Pim Laravel1",
        "de_DE": "Pim Laravel1 French"
    }
}
```

### Response

Upon successful creation, the API returns a success message.

::: details Response
```json
{
  "success": true,
  "message": "Attribute Group Created Successfully"
}
```
:::

---

## Update an Attribute Group

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/attribute-groups/{group_code}
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To update an existing attribute group, provide the updated details for the group, including any changes to the labels.

#### Example Request Body:

```json
{
    "code": "PIM2",
    "labels": {
        "en_US": "PIM23",
        "fr_FR": "PIM241",
        "de_DE": "PIM25"
    }
}
```

### Response

Upon successful update, the API returns a confirmation message.

::: details Response
```json
{
  "success": true,
  "message": "Attribute Group Updated Successfully"
}
```
:::
