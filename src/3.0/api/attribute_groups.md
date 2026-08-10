# Attribute Groups

Attribute groups organize related attributes into named sections inside a family. This page covers managing them over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Attribute Groups

Retrieves a paginated list of attribute groups.

```
GET {{url}}/api/v1/rest/attribute-groups
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts the following query parameter:

| Name      | Info                                                        | Type   | Default |
|-----------|-------------------------------------------------------------|--------|---------|
| `limit`   | Records per request. Clamped to a maximum of `100`          | Number | `10`    |
| `page`    | The page number to retrieve                                 | Number | `1`     |
| `filters` | Filter by `code` with the `=`, `IN`, or `NOT IN` operators  | JSON   | N/A     |

For example, to fetch a specific page of attribute groups:

```http
GET {{url}}/api/v1/rest/attribute-groups?page=1
```

To filter by code:

```http
GET {{url}}/api/v1/rest/attribute-groups?filters={"code":[{"operator":"IN","value":["marketing","technical"]}]}
```

### Response

The response contains the list of attribute groups with pagination metadata:

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

## Get Attribute Group by Group Code

Retrieves a single attribute group by its unique code.

```
GET {{url}}/api/v1/rest/attribute-groups/{group_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name           | Description                                                | Type   |
|----------------|------------------------------------------------------------|--------|
| `{group_code}` | The unique code of the attribute group (e.g., `marketing`) | String |

### Response

The response contains the details of the requested attribute group:

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

## Create an Attribute Group

Creates a new attribute group from a unique code and localized labels.

```
POST {{url}}/api/v1/rest/attribute-groups
```

**Headers:** use the [Common Headers](#common-headers).

Provide the group's code and labels in the request body:

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

Upon successful creation, the API returns a success message:

::: details Response
```json
{
  "success": true,
  "message": "Attribute Group Created Successfully"
}
```
:::

## Update an Attribute Group

Updates an existing attribute group, including any changes to its labels.

```
PUT {{url}}/api/v1/rest/attribute-groups/{group_code}
```

**Headers:** use the [Common Headers](#common-headers).

Provide the updated details for the group in the request body:

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

Upon successful update, the API returns a confirmation message:

::: details Response
```json
{
  "success": true,
  "message": "Attribute Group Updated Successfully"
}
```
:::

## Partially Update an Attribute Group <Badge type="tip" text="3.0" />

`PATCH` performs a partial update — only the submitted keys change; everything else keeps its value.

```
PATCH {{url}}/api/v1/rest/attribute-groups/{attribute_group_code}
```

**Headers:** use the [Common Headers](#common-headers).

Submit just the keys you want to change:

```json
{
    "labels": {
        "en_US": "Updated group label"
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

## Delete an Attribute Group <Badge type="tip" text="3.0" />

Deletes the attribute group identified by its code.

```
DELETE {{url}}/api/v1/rest/attribute-groups/{attribute_group_code}
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
