# Category Field Options APIs



In this section, we will explore all the APIs related to **Category Field Options**.

## Get Category Field Options by Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

- **FieldCode**: The unique code of the category field (e.g., `checkbox`) for which to retrieve options.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API returns a list of options for the specified category field.

::: details Response
```json
[
  {
    "code": "black",
    "sort_order": 1,
    "labels": {
      "en_US": "Black",
      "fr_FR": "Noir"
    }
  },
  {
    "code": "red",
    "sort_order": 2,
    "labels": {
      "en_US": "Red",
      "fr_FR": "Rouge"
    }
  }
]
```
:::

---

## Create Category Field Options

**Endpoint:**  
```
POST {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

- **FieldCode**: The unique code of the category field (e.g., `checkbox`) for which you want to create options.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To create new options for a category field, provide the `code`, `sort_order`, and `labels`.

#### Example Request Body:

```json
[
    {
        "code": "black",
        "sort_order": 2,
        "labels": {
            "en_US": "Black",
            "fr_FR": "Noir"
        }
    },
    {
        "code": "red",
        "sort_order": 2,
        "labels": {
            "en_US": "Red",
            "fr_FR": "Rouge"
        }
    },
    {
        "code": "ddsdfasdas",
        "sort_order": 2,
        "labels": {
            "en_US": "Black",
            "fr_FR": "Noir"
        }
    }
]
```

### Response

Upon successful creation, the API will return a success message.

::: details Response
```json
{
  "success": true,
  "message": "Category Field Options Created Successfully"
}
```
:::

---

## Update Category Field Options

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

- **FieldCode**: The unique code of the category field (e.g., `checkbox`) for which you want to update options.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To update existing options for a category field, provide the `code`, `sort_order`, and `labels`.

#### Example Request Body:

```json
[
    {
        "code": "black",
        "sort_order": 2,
        "labels": {
            "en_US": "Black",
            "fr_FR": "Noir"
        }
    },
    {
        "code": "red",
        "sort_order": 1,
        "labels": {
            "en_US": "Red",
            "fr_FR": "Rouge"
        }
    },
    {
        "code": "ddsdfasdas",
        "sort_order": 3,
        "labels": {
            "en_US": "Black",
            "fr_FR": "Noir"
        }
    }
]
```

### Response

Upon successful update, the API will return a success message.

::: details Response
```json
{
  "success": true,
  "message": "Category Field Options Updated Successfully"
}
```
:::