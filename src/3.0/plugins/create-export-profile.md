# Implementing Data Export

In UnoPim, the export functionality mirrors the import process, enabling you to export product or other data into various formats like CSV, XLS, or XLSX. This guide will walk you through the steps to create an exporter, define its logic, and register it in the system.

## Overview of the Steps

1. **Create the Exporter File**: This is where you define the logic for exporting data.
2. **Implement the Exporter Logic**: Implement how the data will be retrieved and processed.
3. **Register the Exporter**: Ensure UnoPim recognizes your exporter and its configuration.

---

## Step 1: Create Exporter File

### Directory Structure

First, create a directory structure for your export functionality. The exporter logic should be placed in a specific directory under your plugin:

```
└── packages
    └── Webkul
        └── Example
            ├── ...
            └── src
                └── Helpers
                    └── Exporters
                        ├── ...
                        └── FileName
                            └── Exporter.php
```

Here:
- **`Helpers/Exporters`**: This is the directory where all exporter-related files will reside.
- **`Exporter.php`**: This file contains the exporter logic.

---

## Step 2: Implement Exporter Logic

Inside the `Exporter.php` file, define the logic for exporting data. The exporter will typically extend the `AbstractExporter` class provided by UnoPim, which contains common export functionalities.

Here's an example implementation:

```php
<?php

namespace Webkul\Example\Helpers\Exporters\Product;

use Illuminate\Support\Facades\Event;
use Webkul\DataTransfer\Helpers\Exporters\AbstractExporter;
use Webkul\DataTransfer\Contracts\JobTrackBatch as JobTrackBatchContract;

class Exporter extends AbstractExporter
{
    /**
     * Start the export process.
     *
     * @param JobTrackBatchContract $batch
     * @param string $filePath
     * @return bool
     */
    public function exportBatch(JobTrackBatchContract $batch, $filePath): bool
    {
        // Logic to handle the export of a batch of data.
        // This function will prepare data and write it to the provided $filePath.
        //
        // You can gather data from the database, apply filters, and organize the export here.

        return true;  // Return true if the batch export is successful.
    }

    /**
     * Retrieve and process the results for the export.
     */
    protected function getResults()
    {
      return $this->source->all()?->getIterator();
    }
}
```

### Key Methods
- **`exportBatch()`**: This method is responsible for handling the export process for a batch of data. You can define the logic for data retrieval, formatting, and writing to a file.
- **`getResults()`**: This method is used to retrieve the data to be exported. You can query your repository or database here.

---

## Step 3: Register the Exporter

To make the exporter available in UnoPim, you need to register it. This involves defining it in a configuration file and loading that configuration within your service provider.

### Step 1: Create `exporters.php`

In your plugin's `Config` directory, create a new configuration file named `exporters.php`. This file will hold the configuration settings for your exporter.

Directory structure:

```
└── packages
    └── Webkul
        └── Example
            ├── ...
            └── src
                └── Config
                    └── exporters.php
```

### Step 2: Define the Exporter Configuration

In the `exporters.php` file, define your exporter and its settings. Here’s an example configuration for a product exporter:

```php
<?php

return [
    'example' => [
        'title'       => 'data_transfer::app.exporters.products.title',
        'exporter'    => 'Webkul\Example\Helpers\Exporters\Product\Exporter',
        'source'      => 'Webkul\Product\Repositories\ProductRepository', // Specify the repository
        'validator'   => 'Webkul\Example\Validators\JobInstances\Export\ProductJobValidator',// Validator class
        'filters'     => [
            'fields' => [
                [
                    'name'       => 'file_format',
                    'title'      => 'example::app.exporters.fields.file-format',
                    'type'       => 'select',
                    'required'   => true,
                    'validation' => 'required',
                    'options'    => [
                        [
                            'value' => 'Csv',
                            'label' => 'CSV',
                        ], [
                            'value' => 'Xls',
                            'label' => 'XLS',
                        ], [
                            'value' => 'Xlsx',
                            'label' => 'XLSX',
                        ],
                    ],
                ],
                [
                    'name'     => 'with_media',
                    'title'    => 'With Media',
                    'required' => false,
                    'type'     => 'boolean',
                ],
            ],
        ],
    ],
];
```

Explanation:
- **`title`**: The title of the exporter.
- **`exporter`**: The fully-qualified namespace of the exporter class.
- **`source`**: The data source (e.g., repository) from which the exporter will retrieve data.
- **`filters`**: Configuration options for the exporter, such as file format and other export options.
- **`validator`**: The validator class that will validate the export job.

####  Validator for Exporter
The validator class is responsible for validating the data before the export process begins. You can create a custom validator class in your plugin's `Validators` directory.

* **Extending the Base Validator**:
 - You can create a custom validator by extending the base `JobValidator` class.
 - This allows you to define specific rules, messages, and attributes for your export job.

 #### Creating a Custom Validator
 ```php
<?php

namespace Webkul\Example\Validators\JobInstances\Export;

use Webkul\DataTransfer\Validators\JobInstances\Default\JobValidator;
use Webkul\Example\Rules\SeparatorTypes;

class ProductJobValidator extends JobValidator
{
    /**
     * Stores validation rules for data
     */
    protected array $rules = [
        'filters.file' => 'required|mimes:csv,xlsx',
    ];

    /**
     * Names to be used for attributes during generation of error message
     */
    protected array $attributeNames = [
        'filters.file' => 'File',
    ];

    /**
     * Add Custom error messages for validation
     */
    public function getMessages(array $options): array
    {
         return [
            'filters.file.required' => 'Please select a file to Export',
            'filters.file.mimes'    => 'The file must be a file of type: csv, xlsx',
        ];
    }

    /**
     * Add custom rules for validation
     */
    public function getRules(array $options): array
    {
        $this->rules['file'] = [
            empty($options['id']) ? 'required' : 'nullable',
            'mimes:csv,txt,xlsx,xls,html',
            'extensions:csv,xlsx,xls',
        ];

        $this->rules['field_separator'] = ['required', new SeparatorTypes];

        return $this->rules;
    }

   /**
     * Custom names for validation attributes
     */
    public function getAttributeNames(array $options): array
    {
        return [
            'filters.file' => 'File',
            'field_separator' => 'Field Separator',
        ];
    }

    /**
     * Process data before validation
     */
    public function preValidationProcess(mixed $data): mixed
    {
        // Example: Convert field separator to a standard format
        if (isset($data['field_separator'])) {
            $data['field_separator'] = str_replace([';', ','], ',', $data['field_separator']);
        }

        return $data;
    }

}
```

- **`validate()`**: Main method to trigger validation. Throws ValidationException if data is invalid.
- **`getRules()`**: Returns the validation rules. Extend this in child classes to add custom rules.
- **`getMessages()`**: Adds custom error messages. You can override this to add/merge messages.
- **`getAttributeNames()`**: Maps technical keys to human-readable names in error messages.
- **`preValidationProcess()`**: Use this if you need to modify the data before validation.

####  Filters for Exporters

Filters let the user customize an export run. Every filter is one entry in the `filters['fields']` array of your exporter config, and UnoPim renders it automatically in the admin panel under:

> **Data Transfer > Export > Create Export**

Each entry is a plain array. Only `name` and `type` are required:

```php
[
    'name'  => 'my_filter',   // key you read back from $this->getFilters()
    'type'  => 'select',      // how it renders — see the table below
    'title' => 'example::app.exporters.fields.my-filter',  // translation key or literal string
]
```

##### Common Keys

These apply to filters of any type:

| Key | Purpose |
|---|---|
| `name` | **Required.** The key stored on the job's `filters` payload and read back in your exporter. |
| `type` | **Required.** The control to render — see [Filter Types](#filter-types). |
| `title` | Label shown above the control. Pass a translation key (`package::app.path.to.key`) or a literal string. |
| `info` | Help text rendered as a tooltip next to the label. Also accepts a translation key. |
| `required` | Marks the field as required in the UI. Defaults to `false`. |
| `validation` | Laravel validation rules applied to the submitted value, e.g. `'required'`. |
| `default` | Value pre-filled when the form first opens. |
| `placeholder` | Placeholder text for text, number, and select controls. |
| `full_width` | `true` makes the control span both columns of the two-column filter grid. Use it for controls with long values, such as attribute or category pickers. |

##### Filter Types

| `type` | Renders |
|---|---|
| `text` | Single-line text input. |
| `number` | Numeric input. |
| `boolean` | Toggle switch. |
| `select` | Single-choice dropdown. |
| `multiselect` | Multi-choice dropdown. |
| `date` | Date picker. |
| `datetime` | Date and time picker. |
| `date-range` | <Badge type="tip" text="3.0" /> Paired from/to date pickers. |
| `datetime-range` | <Badge type="tip" text="3.0" /> Paired from/to date and time pickers. |
| `price` | Amount input with a currency selector. |
| `textarea` | Multi-line text input. |
| `tags` | <Badge type="tip" text="3.0" /> Free-form tag input for a list of values. The core product exporter uses this for its SKU identifier list. |
| `category-tree` | <Badge type="tip" text="3.0" /> Hierarchical category picker. |
| `attribute-conditions` | <Badge type="tip" text="3.0" /> Attribute/operator/value condition builder — the control behind the product exporter's **custom attributes** filter. |

##### Static Options — `select` and `multiselect`

Provide the choices inline with `options`. Each option is a `value`/`label` pair, and `label` may be a translation key:

```php
[
    'name'       => 'file_format',
    'title'      => 'data_transfer::app.exporters.fields.file-format',
    'type'       => 'select',
    'required'   => true,
    'validation' => 'required',
    'options'    => [
        ['value' => 'Csv',  'label' => 'CSV'],
        ['value' => 'Xls',  'label' => 'XLS'],
        ['value' => 'Xlsx', 'label' => 'XLSX'],
    ],
],
```

##### Async Options — Loading Choices from a Route

For lists that are too large or too dynamic to hard-code, set `async => true` and point the control at a route that returns the options.

| Key | Purpose |
|---|---|
| `async` | `true` to load options over HTTP instead of from `options`. |
| `list_route` | **Required when `async`.** Route *name* that returns the option list. |
| `track_by` | Field in each returned record used as the stored value, e.g. `code`. |
| `label_by` | Field in each returned record shown to the user, e.g. `label`. |
| `query_params` | Extra query parameters sent with every request to `list_route`. |

```php
[
    'name'       => 'channels',
    'title'      => 'data_transfer::app.exporters.products.filters.channels',
    'info'       => 'data_transfer::app.exporters.products.filters.channels-info',
    'type'       => 'multiselect',
    'required'   => false,
    'async'      => true,
    'list_route' => 'admin.settings.data_transfer.exports.filters.channels',
    'track_by'   => 'code',
    'label_by'   => 'label',
],
```

::: warning
The route named in `list_route` must exist and must return records containing the `track_by` and `label_by` fields, or the control renders empty with no error.
:::

##### Conditional Filters

Two keys let filters react to what the user has already chosen. Both are new in v3.0.

**`visible_when`** — show the filter only while another field holds one of the listed values. The control is hidden entirely otherwise:

```php
[
    'name'         => 'time_value',
    'title'        => 'data_transfer::app.exporters.products.filters.time-value',
    'type'         => 'number',
    'required'     => false,
    'visible_when' => [
        'field'  => 'time_condition',
        'values' => ['last_n_days'],
    ],
],
```

**`depends_on`** — narrow an async filter's options by the value of another field. UnoPim re-requests `list_route` whenever the parent field changes, passing the parent's selected codes as the query parameter named in `as`:

```php
[
    'name'       => 'locales',
    'title'      => 'data_transfer::app.exporters.products.filters.locales',
    'type'       => 'multiselect',
    'full_width' => true,
    'async'      => true,
    'list_route' => 'admin.settings.data_transfer.exports.filters.locales',
    'track_by'   => 'code',
    'label_by'   => 'label',
    'depends_on' => ['field' => 'channels', 'as' => 'channels'],
],
```

Here, selecting channels first restricts the locale list to the locales those channels actually carry.

##### Reference: The Product Exporter's Filters

The built-in product exporter is the fullest worked example of everything above. Its filters ship in `packages/Webkul/DataTransfer/src/Config/exporters.php`, and their names are mirrored in the `Webkul\DataTransfer\Enums\ProductFilter` enum — reference the enum rather than string literals when you extend or override the exporter.

| Filter | Type | Notes |
|---|---|---|
| `file_format` | `select` | CSV, XLS, or XLSX. Required. |
| `with_media` | `boolean` | Include media files in the export. |
| `with_associations` | `boolean` | Include product associations. |
| `header_row` | `boolean` | Write a header row. Defaults to on. |
| `use_labels` | `boolean` | Write attribute labels instead of codes. |
| `date_format` | `select` | `Y-m-d`, `d-m-Y`, `d/m/Y`, or `m/d/Y`. |
| `file_path` | `text` | Output path pattern. Placeholder `[code]_[date]`. |
| `channels` | `multiselect`, async | Scope the export to specific channels. |
| `locales` | `multiselect`, async | Depends on `channels`. |
| `currencies` | `multiselect`, async | Depends on `channels`. |
| `attributes` | `multiselect`, async | Restrict the exported columns. |
| `attribute_families` | `multiselect`, async | Restrict to products in these families. |
| `categories` | `multiselect`, async | Restrict to products in these categories. |
| `completeness` | `select` | `none`, `at_least_one`, or `all`. |
| `time_condition` | `select` | `none`, `last_n_days`, `since_last_export`, or `between_dates`. |
| `time_value` | `number` | Visible when `time_condition` is `last_n_days`. |
| `time_date` / `time_date_end` | `date` | Visible when `time_condition` is `between_dates`. |
| `status` | `select` | `enable`, `disable`, or `all`. |
| `sku` | `tags` | An explicit list of SKUs to export. |
| `custom_attributes` | `attribute-conditions` | Attribute-value conditions. Excludes `sku` from its attribute list via `query_params`. |

### Step 3: Load the Configuration in the Service Provider

To ensure that UnoPim loads your exporter configuration, you must register it in your service provider by merging the configuration.

In your `ExampleServiceProvider`, add the following code to the `register()` method:

```php
public function register()
{
    $this->mergeConfigFrom(
        dirname(__DIR__) . '/Config/exporters.php', 'exporters'
    );
}
```

This merges the custom `exporters.php` configuration into the core exporter settings in UnoPim.

## Step 4: Queue Operations

After setting up your exporter, you need to configure and manage the queue system for processing exports. This is crucial for handling background tasks efficiently.

### Managing Queue Workers

When you make changes to any Exporter class or its configurations, follow these steps:

```bash
# Restart the queue worker
php artisan queue:restart

# Start the queue worker again
php artisan queue:work
```

### Running Specific Export Jobs

To run a specific export job for a particular user:

```bash
# Format: php artisan unopim:queue:work [export_id] [user_email]
php artisan unopim:queue:work 1 johndoe@example.com
```

Parameters explained:
- `1`: The ID of the export job you want to process
- `johndoe@example.com`: The email of the logged-in user who initiated the export

::: warning Important
Always restart the queue workers after:
- Modifying Exporter classes
- Updating configurations
- Installing or updating modules

This ensures your changes take effect in the queue system.
:::

## QuickExport

QuickExport is a streamlined export feature in UnoPim that enables rapid data export using pre-configured settings. Here’s how to set up and use QuickExport for your own plugin or data type:

### 1. Understanding QuickExport Configuration

Define your QuickExport profiles in the `Config/quick_exporters.php` configuration file. For example, to export products using your own plugin:

```php
return [
    'ProductQuickExport' => [
        'title'    => 'Product Quick Export',
        'route'    => 'product.quick_export',
        'exporter' => 'Webkul\Example\Helpers\Exporters\Product\Exporter',
        'source'   => 'Webkul\Product\Repositories\ProductRepository',
    ],
];
```

- **title**: Display name for the export option.
- **route**: Unique route name for the export action.
- **exporter**: Fully-qualified class name of your exporter.
- **source**: Repository or data source for export.

---

### 2. Using QuickExport

**Via Admin Panel:**
- Go to **Data Transfer > Export**
- Select **Product Quick Export** from the quick export options
- Export runs instantly with the pre-set configuration

---

### 3. Key Features

A typical QuickExport profile can:
- Map products to your desired format
- Handle updates for existing records and creation for new ones
- Process images and media files
- Synchronize categories and attributes
- Manage product variations (if applicable)
- Export data in batches (e.g., 100 items per batch)

---

### 4. Creating a Custom QuickExport

To add your own QuickExport:
1. Add a configuration entry to `quick_exporters.php` (see above).
2. Create an exporter class (e.g., `Product\Exporter`) that extends `AbstractExporter`.
3. Register the export route in your plugin’s service provider.

Example exporter class:

```php
namespace Webkul\Example\Helpers\Exporters\Product;

use Webkul\DataTransfer\Helpers\Exporters\AbstractExporter;

class Exporter extends AbstractExporter
{
    public function exportBatch($batch, $filePath): bool
    {
        // Your export logic here
        return true;
    }
}
```

---

### 5. Running QuickExport Jobs

After making changes, restart your queue workers:

```bash
php artisan queue:restart
php artisan queue:work
```

---

**Tip:** QuickExport is ideal for one-click exports with minimal configuration. For more advanced options, use the standard export