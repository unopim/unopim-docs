# Currencies

Currencies define the monetary units available for price attributes and channels. This page covers listing, creating, updating, and deleting currencies over the REST API.

### Common Headers

Every request on this page carries the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Get All Currencies

Retrieves a paginated list of currencies, optionally filtered by status.

```
GET {{url}}/api/v1/rest/currencies
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint accepts the following query parameters:

| Name     | Description                                      | Type   | Default |
|----------|--------------------------------------------------|--------|---------|
| `limit`  | Records per request. Clamped to a maximum of `100` | Number | `10`    |
| `page`   | Page number to retrieve based on the limit       | Number | `1`     |
| `filters`| Criteria to filter the records returned          | JSON   | N/A     |

The `status` filter lets you fetch only active currencies:

```json
{"status":[{"operator":"=","value": true}]}
```

Or only inactive currencies:

```json
{"status":[{"operator":"=","value": false}]}
```

### Response

The response contains the matching currencies with pagination metadata:

::: details Response
```json
{
    "data": [
        {
            "code": "ADP",
            "status": 0,
            "label": "Andorran Peseta"
        },
        {
            "code": "AED",
            "status": 0,
            "label": "United Arab Emirates Dirham"
        },
        {
            "code": "AFA",
            "status": 0,
            "label": "Afghan Afghani (1927–2002)"
        },
        {
            "code": "AFN",
            "status": 0,
            "label": "Afghan Afghani"
        },
        {
            "code": "ALK",
            "status": 0,
            "label": "Albanian Lek (1946–1965)"
        },
        {
            "code": "ALL",
            "status": 0,
            "label": "Albanian Lek"
        },
        {
            "code": "AMD",
            "status": 0,
            "label": "Armenian Dram"
        },
        {
            "code": "ANG",
            "status": 0,
            "label": "Netherlands Antillean Guilder"
        },
        {
            "code": "AOA",
            "status": 0,
            "label": "Angolan Kwanza"
        },
        {
            "code": "AOK",
            "status": 0,
            "label": "Angolan Kwanza (1977–1991)"
        }
    ],
    "current_page": 1,
    "last_page": 9,
    "total": 90,
    "links": {
        "first": "{{url}}/api/v1/rest/currencies?limit=10&page=1",
        "last": "{{url}}/api/v1/rest/currencies?limit=10&page=9",
        "next": "{{url}}/api/v1/rest/currencies?limit=10&page=2",
        "prev": null
    }
}
```
:::

## Get Currency by Code

Retrieves a single currency by its ISO 4217 code.

```
GET {{url}}/api/v1/rest/currencies/{currency_code}
```

**Headers:** use the [Common Headers](#common-headers).

The endpoint takes one path parameter:

| Name              | Description                               | Type   |
|-------------------|-------------------------------------------|--------|
| `{currency_code}` | The ISO 4217 currency code (e.g., `SAR`)  | String |

### Response

The response returns detailed information about the specified currency in JSON format.

## Create a Currency <Badge type="tip" text="3.0" />

Creates a new currency from its code and status.

```
POST {{url}}/api/v1/rest/currencies
```

**Headers:** use the [Common Headers](#common-headers).

Provide the currency's code and status in the request body:

```json
{
    "code": "CAD",
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

## Update a Currency <Badge type="tip" text="3.0" />

Updates an existing currency. Provide the full resource body; omitted translations keep their values.

```
PUT {{url}}/api/v1/rest/currencies/{currency_code}
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

## Delete a Currency <Badge type="tip" text="3.0" />

Deletes the currency identified by its code.

```
DELETE {{url}}/api/v1/rest/currencies/{currency_code}
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
