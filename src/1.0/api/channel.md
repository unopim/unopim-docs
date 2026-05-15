# Channel API



This section covers all the APIs related to managing channels in UnoPim.

## Get All Channels

**Endpoint:**  
```
GET {{url}}/api/v1/rest/channels
```

### Response

The API will return a list of all available channels.

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
---

## Get Channel by Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/channels/{channel_code}
```

### Path Parameter

| Name              | Description                                  | Type   |
|-------------------|----------------------------------------------|--------|
| `{channel_code}`   | The unique code for the channel (e.g., `ecommerce`) | String |

### Response

The response will return detailed information about the specified channel in JSON format.