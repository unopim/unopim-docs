# Attribute Families



## Get All Attribute Families

**Endpoint:**  
```
GET {{url}}/api/v1/rest/families
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The API will return a list of attribute families in a JSON format.

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

---

## Get an Attribute Family By Family Code

**Endpoint:**  
```
GET {{url}}/api/v1/rest/families/{family_code}
```

- **family_code**: The code of the attribute family (e.g., `accessories`) to fetch specific family details.

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Response

The response contains details of the requested attribute family.

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

---

## Create an Attribute Family

**Endpoint:**  
```
POST {{url}}/api/v1/rest/families
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To create a new attribute family, provide the family code, labels, and associated attribute groups.

#### Example Request Body:

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

Upon successful creation, the API returns a success message.

::: details Response
```json
{
  "success": true,
  "message": "Attribute Family Created Successfully"
}
```
:::

---

## Update an Attribute Family

**Endpoint:**  
```
PUT {{url}}/api/v1/rest/families/{family_code}
```

### Headers

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

### Request Body

To update an existing attribute family, provide the updated code, labels, and attribute groups.

#### Example Request Body:

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

Upon successful update, the API returns a confirmation message.

::: details Response
```json
{
  "success": true,
  "message": "Attribute Family Updated Successfully"
}
```
:::