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
| `file`      | The media file to be uploaded.       | File   |
| `sku`       | Product SKU to associate the file    | String |
| `attribute` | Media attribute (e.g., `image`)      | String |

### Example Request (Key-Value Format)

**Form Fields:**

| Key         | Value                      |
| ----------- | -------------------------- |
| `file`      | *(Select file)*            |
| `sku`       | `1111111304`               |
| `attribute` | `image`                    |


> 🔔 **Note:**
> The `"file"` field here represents the local file path on your system for illustrative purposes. In a real API call, the file is uploaded via `multipart/form-data`, not as JSON.

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
| `file`          | The media file to be uploaded.       | File   |
| `code`          | Category code to associate the file  | String |
| `category_field`| Media attribute (e.g., `image`)      | String |



### Example Request (Key-Value Format)

| Key              | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| `file`           | *(Select file)*                                                  |
| `code`           | `electronic3`                                                    |
| `category_field` | `file`                                                           |

> 🔔 **Note:**
> The `"file"` field here represents the local file path on your system for illustrative purposes. In a real API call, the file is uploaded via `multipart/form-data`, not as JSON.

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
