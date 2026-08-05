# Locales

Locales determine which languages your catalog data can be translated into. This page covers listing, creating, updating, and deleting locales over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Locales

Retrieves a paginated list of locales, optionally filtered by status.

```
GET {{url}}/api/v1/rest/locales
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts the following query parameters:

| Name     | Description                                      | Type   | Default |
|----------|--------------------------------------------------|--------|---------|
| `limit`  | Maximum number of records per request            | Number | `10`    |
| `page`   | Page number to retrieve based on the limit       | Number | `1`     |
| `filters`| Criteria to filter the records returned          | JSON   | N/A     |

The `status` filter lets you fetch only enabled locales:

```json
{"status":[{"operator":"=","value": true}]}
```

Or only disabled locales:

```json
{"status":[{"operator":"=","value": false}]}
```

### Response

The response contains the matching locales with pagination metadata:

::: details Response
```json
{
    "data": [
        {
            "code": "af_ZA",
            "status": 0
        },
        {
            "code": "am_ET",
            "status": 0
        },
        {
            "code": "ar_AE",
            "status": 0
        },
        {
            "code": "ar_BH",
            "status": 0
        },
        {
            "code": "ar_DZ",
            "status": 0
        },
        {
            "code": "ar_EG",
            "status": 0
        },
        {
            "code": "ar_IQ",
            "status": 0
        },
        {
            "code": "ar_JO",
            "status": 0
        },
        {
            "code": "ar_KW",
            "status": 0
        },
        {
            "code": "ar_LB",
            "status": 0
        }
    ],
    "current_page": 1,
    "last_page": 21,
    "total": 210,
    "links": {
        "first": "{{url}}/api/v1/rest/locales?limit=10&page=1",
        "last": "{{url}}/api/v1/rest/locales?limit=10&page=21",
        "next": "{{url}}/api/v1/rest/locales?limit=10&page=2",
        "prev": null
    }
}
```
:::

## Get Locale by Code

Retrieves a single locale by its unique code.

```
GET {{url}}/api/v1/rest/locales/{locale_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name            | Description                      | Type   |
|-----------------|----------------------------------|--------|
| `{locale_code}` | The unique code of the locale    | String |

For example, to fetch the `en_US` locale:

```
GET {{url}}/api/v1/rest/locales/en_US
```

### Response

The response contains the locale's code and status:

::: details Response
```json
{
    "code": "en_US",
    "status": 1
}
```
:::

## Create a Locale <Badge type="tip" text="3.0" />

Creates a new locale from its code and status.

```
POST {{url}}/api/v1/rest/locales
```

**Headers:** use the [Common Headers](#common-headers).

Provide the locale's code and status in the request body:

```json
{
    "code": "fr_FR",
    "status": 1
}
```

### Response

Upon successful creation, the API returns a success message:

```json
{
    "success": true,
    "message": "Created successfully."
}
```

## Update a Locale <Badge type="tip" text="3.0" />

Updates an existing locale. Provide the full resource body; omitted translations keep their values.

```
PUT {{url}}/api/v1/rest/locales/{locale_code}
```

**Headers:** use the [Common Headers](#common-headers).

### Response

A successful update returns a confirmation message:

```json
{
    "success": true,
    "message": "Updated successfully."
}
```

## Delete a Locale <Badge type="tip" text="3.0" />

Deletes the locale identified by its code.

```
DELETE {{url}}/api/v1/rest/locales/{locale_code}
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

::: warning In-use and default-record guards
The API applies the same protections as the admin: you cannot delete a locale or currency still enabled on a channel, a channel's default locale, or the default channel itself — such requests return `422`.
:::
