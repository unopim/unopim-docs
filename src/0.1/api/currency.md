# Currency API



This section covers all the APIs related to managing currencies in UnoPim.

## Get All Currencies

**Endpoint:**  
```
GET {{url}}/api/v1/rest/currencies
```

### Query Parameters

| Name     | Description                                      | Type   | Default |
|----------|--------------------------------------------------|--------|---------|
| `limit`  | Maximum number of records per request            | Number | `100`   |
| `page`   | Page number to retrieve based on the limit       | Number | `1`     |
| `filters`| Criteria to filter the records returned          | JSON   | N/A     |

#### Example Filters

- **Active Currencies:**
  ```json
  {"status":[{"operator":"=","value": true}]}
  ```

- **Inactive Currencies:**
  ```json
  {"status":[{"operator":"=","value": false}]}
  ```

**Response:**
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
---

## Get Currency by Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/currencies/{currency_code}
```

### Path Parameter

| Name             | Description                               | Type   |
|------------------|-------------------------------------------|--------|
| `{currency_code}` | The ISO 4217 currency code (e.g., `SAR`)  | String |

### Response

The response will return detailed information about the specified currency in JSON format.