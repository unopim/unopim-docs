# Swatch Types

## Introduction

UnoPim v2.0.0 introduces **swatch types** for `select` and `multiselect` attributes. Swatches provide a visual representation of attribute options, replacing plain text labels with color blocks, image thumbnails, or styled text chips.

Swatch values are displayed in:

- The product DataGrid listings
- Product detail pages
- API responses for attribute and attribute-option endpoints

---

## Available Swatch Types

| Swatch Type | Stored Value | Visual Rendering |
| ----------- | ------------ | ---------------- |
| **Color**   | Hex color code (e.g., `#FF5733`) | A colored square block |
| **Image**   | File path to an uploaded image | A thumbnail preview |
| **Text**    | Short text string | A styled label chip |

When no swatch type is set, the attribute option displays its standard translated label.

---

## Database Schema

Swatch data is stored across two existing tables:

### `wk_attributes` Table

| Column        | Type              | Description |
| ------------- | ----------------- | ----------- |
| `swatch_type` | `string` (nullable) | One of `color`, `image`, `text`, or `null` |

### `wk_attribute_options` Table

| Column         | Type              | Description |
| -------------- | ----------------- | ----------- |
| `swatch_value` | `string` (nullable) | The swatch value (hex code, file path, or text) |

The `AttributeOption` model also exposes a computed `swatch_value_url` attribute. For **image** swatches, this returns the full storage URL of the uploaded image. For other swatch types, it returns `null`.

---

## Creating Attributes with Swatch Types

### Via Admin Panel

1. Navigate to **Catalog > Attributes > Create Attribute**.
2. Set the **Type** to `select` or `multiselect`.
3. Choose a **Swatch Type**: Color, Image, or Text.
4. Add attribute options. For each option, provide:
   - **Code** -- Unique option identifier.
   - **Label** -- Translated display name.
   - **Swatch Value** -- Depending on the swatch type:
     - **Color**: Enter a hex color code (e.g., `#FF5733`).
     - **Image**: Upload an image file.
     - **Text**: Enter a short text label.

### Via Code

When creating an attribute programmatically through the repository:

```php
use Webkul\Attribute\Repositories\AttributeRepository;

$attributeRepository = app(AttributeRepository::class);

$attribute = $attributeRepository->create([
    'code'        => 'color',
    'type'        => 'select',
    'swatch_type' => 'color',   // 'color', 'image', or 'text'
    'en_US'       => ['name' => 'Color'],
]);
```

Then add options with swatch values:

```php
use Webkul\Attribute\Repositories\AttributeOptionRepository;

$optionRepository = app(AttributeOptionRepository::class);

$optionRepository->create([
    'code'         => 'red',
    'attribute_id' => $attribute->id,
    'swatch_value' => '#FF0000',
    'sort_order'   => 1,
    'en_US'        => ['label' => 'Red'],
]);

$optionRepository->create([
    'code'         => 'blue',
    'attribute_id' => $attribute->id,
    'swatch_value' => '#0000FF',
    'sort_order'   => 2,
    'en_US'        => ['label' => 'Blue'],
]);
```

---

## Validation

### ValidSwatchValue Rule

UnoPim provides a dedicated validation rule at `Webkul\Attribute\Rules\ValidSwatchValue` to ensure swatch values are only accepted for valid attribute configurations.

The rule checks that:

1. The parent attribute type is `select` or `multiselect`.
2. The parent attribute has a swatch type of `color` or `image`.

If either condition is not met, validation fails with a descriptive error message.

**Usage in a FormRequest or controller:**

```php
use Webkul\Attribute\Rules\ValidSwatchValue;

$rules = [
    'swatch_value' => [new ValidSwatchValue($attributeId)],
];
```

### SwatchTypes Rule

When creating or updating an attribute, the `swatch_type` field is validated using the `SwatchTypes` rule, ensuring only recognized swatch type values (`color`, `image`, `text`) are accepted.

---

## DataGrid Integration

### Attribute Options DataGrid

When viewing attribute options in the admin panel, swatch values are rendered visually:

- **Color swatches** display as a small colored square next to the option label.
- **Image swatches** display as a thumbnail preview.
- **Text swatches** display as a styled chip.

### Product DataGrid

Product listings that include `select` or `multiselect` columns with swatch types will display the swatch preview alongside the option label, providing quick visual identification of attribute values.

---

## API Support

### Attribute Endpoints

When retrieving attributes via the REST API, the `swatch_type` field is included in the response:

**GET** `/api/v1/rest/attributes/{code}`

```json
{
    "code": "color",
    "type": "select",
    "swatch_type": "color",
    "labels": {
        "en_US": "Color"
    },
    "options": [
        {
            "code": "red",
            "sort_order": 1,
            "swatch_value": "#FF0000",
            "swatch_value_url": null,
            "labels": {
                "en_US": "Red"
            }
        },
        {
            "code": "blue",
            "sort_order": 2,
            "swatch_value": "#0000FF",
            "swatch_value_url": null,
            "labels": {
                "en_US": "Blue"
            }
        }
    ]
}
```

For **image** swatch options, the `swatch_value_url` field contains the full URL to the uploaded image.

### Creating Attributes with Swatch Types via API

**POST** `/api/v1/rest/attributes`

```json
{
    "code": "material_finish",
    "type": "select",
    "swatch_type": "image",
    "labels": {
        "en_US": "Material Finish"
    }
}
```

### Creating Attribute Options with Swatch Values via API

**POST** `/api/v1/rest/attributes/{code}/options`

```json
{
    "code": "matte",
    "sort_order": 1,
    "swatch_value": "#CCCCCC",
    "labels": {
        "en_US": "Matte",
        "fr_FR": "Mat"
    }
}
```

For image swatches, upload the image file using a `multipart/form-data` request with the `swatch_value` field containing the image file.

### Updating Attributes

::: warning
The `swatch_type` field cannot be changed after an attribute is created. This is an immutable property, similar to `type`, `code`, `value_per_locale`, `value_per_channel`, and `is_unique`. The API will ignore `swatch_type` in update requests.
:::

---

## Model Reference

### Attribute Model

The `Webkul\Attribute\Models\Attribute` model includes `swatch_type` in its `$fillable` array. Supported values are:

- `'color'` -- Color hex code swatches
- `'image'` -- Uploaded image swatches
- `'text'` -- Text label swatches
- `null` -- No swatch (standard dropdown)

### AttributeOption Model

The `Webkul\Attribute\Models\AttributeOption` model stores swatch data:

- **`swatch_value`** (fillable) -- The raw swatch value (hex code, file path, or text string).
- **`swatch_value_url`** (appended attribute) -- Computed property that returns the full storage URL for image swatches, or `null` for other types.

```php
// Accessing swatch data
$option = AttributeOption::find(1);

$option->swatch_value;       // '#FF0000' or 'attribute/swatch/image.png'
$option->swatch_value_url;   // Full URL for image swatches, null otherwise
```

---

## Key Files

| File | Purpose |
| ---- | ------- |
| `packages/Webkul/Attribute/src/Models/Attribute.php` | Attribute model with `swatch_type` field |
| `packages/Webkul/Attribute/src/Models/AttributeOption.php` | Option model with `swatch_value` and `swatch_value_url` |
| `packages/Webkul/Attribute/src/Rules/ValidSwatchValue.php` | Validation rule for swatch values |
| `packages/Webkul/AdminApi/src/Http/Controllers/API/Catalog/AttributeController.php` | API controller with swatch validation |
| `packages/Webkul/Attribute/src/Database/Migrations/2018_07_05_130148_create_attributes_table.php` | Migration defining `swatch_type` column |
