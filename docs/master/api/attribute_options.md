# Attribute Options
[[TOC]]

## Get Attribute Options By Attribute Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

- **attribute_code**: The unique code of the attribute (e.g., `size`) to fetch options for.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API will return a list of attribute options for the specified attribute code in a JSON format.

::: details Response
```json
[
  {
    "code": "size4",
    "sort_order": 4,
    "labels": {
      "de_DE": "Extra Large",
      "en_US": "Extra Large",
      "fr_FR": "Extra Large"
    }
  }
]
```
:::

---

## Create Attribute Options By Attribute Code

**Endpoint:**  
```
POST {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

You can create multiple attribute options by providing their details, such as code, sort order, and labels.

#### Example Request Body:

```json
[
    {
        "code": "size4",
        "sort_order": 4,
        "labels": {
            "de_DE": "Extra Large",
            "en_US": "Extra Large",
            "fr_FR": "Extra Large"
        }
    }
]
```

### Response

Upon successfully creating the options, the API will return a success message.

::: details Response
```json
{
    "success": true,
    "message": "Attribute Options Created Successfully"
}
```
:::

---

## Update Attribute Options By Attribute Code

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To update existing attribute options, provide the code, sort order, and labels in the request body. Only include the fields that need to be changed.

#### Example Request Body:

```json
[
    {
        "code": "SL",
        "sort_order": 1,
        "labels": {
            "en_US": "SELL123"
        }
    }
]
```

### Response

Upon successfully updating the options, the API will return a confirmation message.

::: details Response
```json
{
    "success": true,
    "message": "Attribute Options Updated Successfully"
}
```
:::
