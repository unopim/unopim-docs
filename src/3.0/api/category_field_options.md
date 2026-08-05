# Category Field Options

Select-type category fields carry a list of options to choose from. This page covers reading, creating, updating, and deleting those options over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get Category Field Options by Code

Retrieves all options defined for a given category field.

```
GET {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name          | Description                                              | Type   |
|---------------|----------------------------------------------------------|--------|
| `{FieldCode}` | The unique code of the category field (e.g., `checkbox`) | String |

### Response

The response is the list of options for the specified category field:

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

## Create Category Field Options

Creates one or more options for a category field in a single request.

```
POST {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name          | Description                                              | Type   |
|---------------|----------------------------------------------------------|--------|
| `{FieldCode}` | The unique code of the category field (e.g., `checkbox`) | String |

Provide each option's `code`, `sort_order`, and `labels` in the request body:

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

Upon successful creation, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Field Options Created Successfully"
}
```
:::

## Update Category Field Options

Updates existing options for a category field.

```
PUT {{url}}/api/v1/rest/category-fields/{FieldCode}/options
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name          | Description                                              | Type   |
|---------------|----------------------------------------------------------|--------|
| `{FieldCode}` | The unique code of the category field (e.g., `checkbox`) | String |

Provide the `code`, `sort_order`, and `labels` for each option you want to update:

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

Upon successful update, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Category Field Options Updated Successfully"
}
```
:::

## Delete an Option <Badge type="tip" text="3.0" />

Deletes a single option from a category field.

```
DELETE {{url}}/api/v1/rest/category-fields/{category_field_code}/options/{option_code}
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
