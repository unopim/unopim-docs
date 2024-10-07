# Locale API
This section covers all the APIs related to managing locales in UnoPim.

## Get All Locales

**Endpoint:**  
```
GET {{url}}/api/v1/rest/locales
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Authorization | Bearer `access_token` |
| Accept        | application/json      |

### Query Parameters

| Name     | Description                                      | Type   | Default |
|----------|--------------------------------------------------|--------|---------|
| `limit`  | Maximum number of records per request            | Number | `10`    |
| `page`   | Page number to retrieve based on the limit       | Number | `1`     |
| `filters`| Criteria to filter the records returned          | JSON   | N/A     |

#### Example Filters

- **Enabled Locales:**
  ```json
  {"status":[{"operator":"=","value": true}]}
  ```

- **Disabled Locales:**
  ```json
  {"status":[{"operator":"=","value": false}]}
  ```

### Response
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

---

## Get Locale by Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/locales/{locale_code}
```

### Path Parameter

| Name            | Description                      | Type   |
|-----------------|----------------------------------|--------|
| `{locale_code}` | The unique code of the locale    | String |


**Example :**
```
GET {{url}}/api/v1/rest/locales/en_US
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Authorization | Bearer `access_token` |
| Accept        | application/json      |

### Response
::: details Response
```json
{
    "code": "en_US",
    "status": 1
}
```