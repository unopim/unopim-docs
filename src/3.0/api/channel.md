# Channels

Channels represent the distribution contexts your catalog publishes to — a webshop, a print catalog, a marketplace. This page covers managing them over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Channels

Retrieves a paginated list of all available channels.

```
GET {{url}}/api/v1/rest/channels
```

**Headers:** use the [Common Headers](#common-headers).

### Response

The response contains the list of channels with pagination metadata:

::: details Response
```json
{
    "data": [
        {
            "code": "default",
            "labels": {
                "en_US": "Default"
            },
            "root_category": "root",
            "locales": [
                "en_US"
            ],
            "currencies": [
                "USD"
            ]
        }
    ],
    "current_page": 1,
    "last_page": 1,
    "total": 1,
    "links": {
        "first": "{{url}}/api/v1/rest/channels?page=1",
        "last": "{{url}}/api/v1/rest/channels?page=1",
        "next": null,
        "prev": null
    }
}
```
:::

## Get Channel by Code

Retrieves a single channel by its unique code.

```
GET {{url}}/api/v1/rest/channels/{channel_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name             | Description                                          | Type   |
|------------------|------------------------------------------------------|--------|
| `{channel_code}` | The unique code for the channel (e.g., `ecommerce`)  | String |

### Response

The response returns detailed information about the specified channel in JSON format.

## Create a Channel <Badge type="tip" text="3.0" />

Creates a new channel from its code, locales, currencies, root category, and labels.

```
POST {{url}}/api/v1/rest/channels
```

**Headers:** use the [Common Headers](#common-headers).

Provide the channel's details in the request body:

```json
{
    "code": "print",
    "locales": ["en_US"],
    "currencies": ["USD"],
    "root_category": "root",
    "labels": {
        "en_US": "Print"
    }
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

## Update a Channel <Badge type="tip" text="3.0" />

Updates an existing channel. Provide the full resource body; omitted translations keep their values.

```
PUT {{url}}/api/v1/rest/channels/{channel_code}
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

## Delete a Channel <Badge type="tip" text="3.0" />

Deletes the channel identified by its code.

```
DELETE {{url}}/api/v1/rest/channels/{channel_code}
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
