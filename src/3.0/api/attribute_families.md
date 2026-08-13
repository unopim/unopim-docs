# Attribute Families

Attribute families bundle attribute groups into the full set of fields a product type carries. This page covers managing families over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Attribute Families

Retrieves a paginated list of attribute families.

```
GET {{url}}/api/v1/rest/families
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts these query parameters:

| Name      | Info                                                        | Type   | Default |
|-----------|-------------------------------------------------------------|--------|---------|
| `limit`   | Records per request. Clamped to a maximum of `100`          | Number | `10`    |
| `page`    | Page number to retrieve                                     | Number | `1`     |
| `filters` | Filter by `code` with the `=`, `IN`, or `NOT IN` operators  | JSON   | N/A     |

For example:

```http
GET {{url}}/api/v1/rest/families?limit=50&filters={"code":[{"operator":"IN","value":["accessories","default"]}]}
```

### Response

The response contains the list of attribute families with pagination metadata:

::: details Response
```json
{
  "data": [
    {
      "code": "accessories",
      "labels": {
        "en_US": "Accessories",
        "fr_FR": "Accessoires",
        "de_DE": "Zubehör"
      }
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "total": 1,
  "links": {
    "first": "{{url}}/api/v1/rest/families?page=1",
    "last": "{{url}}/api/v1/rest/families?page=1",
    "next": null,
    "prev": null
  }
}
```
:::

## Get an Attribute Family by Family Code

Retrieves a single attribute family, including its attribute groups and their attributes.

```
GET {{url}}/api/v1/rest/families/{family_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name            | Description                                              | Type   |
|-----------------|----------------------------------------------------------|--------|
| `{family_code}` | The code of the attribute family (e.g., `accessories`)   | String |

### Response

The response contains the details of the requested attribute family:

::: details Response
```json
{
  "code": "accessories",
  "labels": {
    "en_US": "Accessories",
    "fr_FR": "Accessoires",
    "de_DE": "Zubehör"
  },
  "attribute_groups": [
    {
      "code": "product",
      "position": 1,
      "custom_attributes": [
        {
          "code": "sku",
          "position": 1
        },
        {
          "code": "name",
          "position": 2
        }
      ]
    }
  ]
}
```
:::

## Create an Attribute Family

Creates a new attribute family from a code, labels, and its attribute groups.

```
POST {{url}}/api/v1/rest/families
```

**Headers:** use the [Common Headers](#common-headers).

Provide the family code, labels, and associated attribute groups in the request body:

```json
{
    "code": "Garment",
    "labels": {
        "de_DE": "Garment German",
        "en_US": "Garment",
        "fr_FR": "Garment French"
    },
    "attribute_groups": [
        {
            "code": "product",
            "position": 1,
            "custom_attributes": [
                {
                    "code": "sku",
                    "position": 1
                },
                {
                    "code": "Name",
                    "position": 2
                },
                {
                    "code": "erpname",
                    "position": 3
                }
            ]
        },
        {
            "code": "medias",
            "position": 2,
            "custom_attributes": [
                {
                    "code": "image",
                    "position": 1
                }
            ]
        }
    ]
}
```

### Response

Upon successful creation, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Attribute Family Created Successfully"
}
```
:::

## Update an Attribute Family

Updates an existing attribute family with new labels or attribute groups.

```
PUT {{url}}/api/v1/rest/families/{family_code}
```

**Headers:** use the [Common Headers](#common-headers).

Provide the updated code, labels, and attribute groups in the request body:

```json
{
    "code": "shoes",
    "labels": {
        "de_DE": "Shoes German",
        "en_US": "Shoes",
        "fr_FR": "Shoes French"
    },
    "attribute_groups": [
        {
            "code": "product",
            "position": 1,
            "custom_attributes": [
                {
                    "code": "sku",
                    "position": 1
                },
                {
                    "code": "Name",
                    "position": 2
                },
                {
                    "code": "collection",
                    "position": 3
                }
            ]
        }
    ]
}
```

### Response

Upon successful update, the API returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Attribute Family Updated Successfully"
}
```
:::

## Partially Update an Attribute Family <Badge type="tip" text="3.0" />

`PATCH` performs a partial update — only the submitted keys change; everything else keeps its value.

```
PATCH {{url}}/api/v1/rest/families/{attribute_family_code}
```

**Headers:** use the [Common Headers](#common-headers).

Submit just the keys you want to change:

```json
{
    "labels": {
        "en_US": "Updated family label"
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

## Delete an Attribute Family <Badge type="tip" text="3.0" />

Deletes the attribute family identified by its code.

```
DELETE {{url}}/api/v1/rest/families/{attribute_family_code}
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
