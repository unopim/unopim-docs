# Upload & Generate Media File Path

### Common Headers

For all API requests, include the following headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

---

This API allows you to upload media files (such as images) associated with either a product or a category and returns the corresponding file path in the response. It can be used to store product or category images, linking them to their respective SKUs or category codes and specific attributes.

---

## Product Media Upload

**Endpoints:**  
- **Product Media Upload**  
  ```
  POST {{url}}/api/v1/rest/media-files/product
  ```
**Headers:**  
Use the [Common Headers](#common-headers).

### Query Parameters

| Name        | Description                          | Type   |
|-------------|--------------------------------------|--------|
| `file`      | Path to the file being uploaded      | String |
| `sku`       | Product SKU to associate the file    | String |
| `attribute` | Media attribute (e.g., `image`)      | String |
| `channel`   | The applicable channel (e.g., `default`) | String |
| `locale`    | (Optional) Locale for the media file | String |

### Example Request

```json
{
  "file": "/home/users/deepak.kumar/Downloads/Image/bag.jpg",
  "sku": "1111111304",
  "attribute": "image",
  "channel": "default",
  "locale": null
}
```

### Response

::: details Response
```json
{
  "success": true,
  "message": "Product file uploaded successfully.",
  "data": {
    "attribute": "image",
    "sku": "1111111304",
    "filePath": "product/12/image/4099514009964_2.jpg"
  }
}
```
:::

---

## Category Media Upload

**Endpoints:** 
- **Category Media Upload**  
  ```
  POST {{url}}/api/v1/rest/media-files/category
  ```
**Headers:**  
Use the [Common Headers](#common-headers).

### Query Parameters

| Name            | Description                          | Type   |
|-----------------|--------------------------------------|--------|
| `file`          | Path to the file being uploaded      | String |
| `code`          | Category code to associate the file  | String |
| `category_field`| Media attribute (e.g., `image`)      | String |
| `scope`         | The applicable channel (e.g., `default`) | String |
| `locale`        | (Optional) Locale for the media file | String |

### Example Request

```json
{
  "file": "/home/users/deepak.kumar/Downloads/Image/bag.jpg",
  "code": "electronic3",
  "category_field": "file",
  "scope": "null",
  "locale": "null"
}
```

### Response

::: details Response
```json
{
  "success": true,
  "message": "Category file uploaded successfully.",
  "data": {
      "field": "file",
      "code": "master",
      "filePath": "category/2/file/4099514009964_2.jpg"
  }
}
```
:::
