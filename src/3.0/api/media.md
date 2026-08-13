# Media Files API

This page shows you how to upload media files (such as images) for a product or a category and get back the stored file path, plus how to read and delete existing media. Uploaded files are linked to their SKU or category code and a specific attribute.

### Common Headers

Every request on this page sends the same two headers:

| Key           | Value                 |
|---------------|-----------------------|
| Accept        | application/json      |
| Authorization | Bearer `access_token` |

## Product Media Upload

Uploads a media file and attaches it to a product's media attribute.

::: info Gallery Attribute file type support
Gallery-type attributes now support video files along with images. This API can be used to upload both images and videos, but only when the target attribute is of type gallery.
:::

```
POST {{url}}/api/v1/rest/media-files/product
```

**Headers** — use the [Common Headers](#common-headers).

The request takes these parameters:

| Name        | Description                          | Type   |
|-------------|--------------------------------------|--------|
| `file`      | The media file to be uploaded.       | File   |
| `sku`       | Product SKU to associate the file    | String |
| `attribute` | Media attribute (e.g., `image`)      | String |

Send them as form fields, for example:

| Key         | Value                      |
| ----------- | -------------------------- |
| `file`      | *(Select file)*            |
| `sku`       | `1111111304`               |
| `attribute` | `image`                    |

> 🔔 **Note:**
> The `"file"` field here represents the local file path on your system for illustrative purposes. In a real API call, the file is uploaded via `multipart/form-data`, not as JSON.

### Response

The stored file path is returned so you can reference it in product values:

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

## Category Media Upload

Uploads a media file and attaches it to a category's media field.

```
POST {{url}}/api/v1/rest/media-files/category
```

**Headers** — use the [Common Headers](#common-headers).

The request takes these parameters:

| Name            | Description                          | Type   |
|-----------------|--------------------------------------|--------|
| `file`          | The media file to be uploaded.       | File   |
| `code`          | Category code to associate the file  | String |
| `category_field`| Media attribute (e.g., `image`)      | String |

Send them as form fields, for example:

| Key              | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| `file`           | *(Select file)*                                                  |
| `code`           | `electronic3`                                                    |
| `category_field` | `file`                                                           |

> 🔔 **Note:**
> The `"file"` field here represents the local file path on your system for illustrative purposes. In a real API call, the file is uploaded via `multipart/form-data`, not as JSON.

### Response

The stored file path is returned so you can reference it in category data:

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

## Swatch Media Upload

Uploads a swatch image for an attribute option. The attribute's swatch type must be **Image**, or the request fails with `422`.

```
POST {{url}}/api/v1/rest/media-files/swatch
```

**Headers** — use the [Common Headers](#common-headers).

The request takes these parameters:

| Name             | Description                                                     | Type   |
|------------------|-----------------------------------------------------------------|--------|
| `file`           | The swatch image: `jpeg`, `png`, `jpg`, `webp`, or `svg`, max 2 MB | File   |
| `code`           | Code of the attribute option the swatch belongs to               | String |
| `attribute_code` | Code of the attribute that owns the option                       | String |

### Response

The stored path and its public URL come back on success:

::: details Response
```json
{
  "success": true,
  "message": "Attribute option updated successfully.",
  "data": {
    "code": "red",
    "swatch_value": "attribute_option/12/nEr4h2Kq….png",
    "swatch_value_url": "https://example.com/storage/attribute_option/12/nEr4h2Kq….png"
  }
}
```
:::

::: tip Never build the path yourself
The stored filename is generated, not taken from the uploaded file. Always use the `swatch_value` returned here.
:::

## Read Media <Badge type="tip" text="3.0" />

Lists the file paths already stored for a product, category, or swatch. Media files are identified by query parameters, not path segments:

Product media is scoped like any other attribute value. Pass `channel` and `locale` when the attribute is channel- or locale-scoped; omit them and the default channel and its default locale are used.

```
GET {{url}}/api/v1/rest/media-files/product?sku=shirt-1&attribute=image
GET {{url}}/api/v1/rest/media-files/category?code=apparel&category_field=banner
GET {{url}}/api/v1/rest/media-files/swatch?code=red&attribute_code=color
```

### Response

The matching file paths come back as a simple array:

```json
{
    "data": [
        "product/1/image/shirt-front.webp"
    ]
}
```

## Delete Media <Badge type="tip" text="3.0" />

Removes stored media using the same parameter scheme with the `DELETE` verb. The file is deleted from storage and the value cleared:

```
DELETE {{url}}/api/v1/rest/media-files/product?sku=shirt-1&attribute=image
DELETE {{url}}/api/v1/rest/media-files/category?code=apparel&category_field=banner
DELETE {{url}}/api/v1/rest/media-files/swatch?code=red&attribute_code=color
```

If no file is stored at that scope, the response is `404`.

### Response

A successful deletion returns a confirmation message:

```json
{
    "success": true,
    "message": "Deleted successfully."
}
```
