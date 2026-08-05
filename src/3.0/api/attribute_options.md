# Attribute Options

Select-type attributes carry a list of options your users pick from. This page covers reading, creating, updating, and deleting those options over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get Attribute Options by Attribute Code

Retrieves all options defined for a given attribute.

```
GET {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name               | Description                                            | Type   |
|--------------------|--------------------------------------------------------|--------|
| `{attribute_code}` | The unique code of the attribute (e.g., `size`)        | String |

### Response

The response is the list of options for the specified attribute:

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

## Create Attribute Options by Attribute Code

Creates one or more options for an attribute in a single request.

```
POST {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

**Headers:** use the [Common Headers](#common-headers).

Provide each option's code, sort order, and labels in the request body:

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

Upon successful creation, the API returns a success message:

::: details Response
```json
{
    "success": true,
    "message": "Attribute Options Created Successfully"
}
```
:::

## Update Attribute Options by Attribute Code

Updates existing options; include only the fields that need to change.

```
PUT {{url}}/api/v1/rest/attributes/{attribute_code}/options
```

**Headers:** use the [Common Headers](#common-headers).

Provide the code, sort order, and labels for each option you want to update:

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

Upon successful update, the API returns a confirmation message:

::: details Response
```json
{
    "success": true,
    "message": "Attribute Options Updated Successfully"
}
```
:::

## Delete an Option <Badge type="tip" text="3.0" />

Deletes a single option from an attribute.

```
DELETE {{url}}/api/v1/rest/attributes/{attribute_code}/options/{option_code}
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
