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

### Key Methods:

- **`exportBatch()`**: This method is responsible for handling the export process for a batch of data. You can define the logic for data retrieval, formatting, and writing to a file.
- **`getResults()`**: This method is used to retrieve the data to be exported. You can query your repository or database here.

---

## Step 3: Register the Exporter

To make the exporter available in UnoPim, you need to register it. This involves defining it in a configuration file and loading that configuration within your service provider.

### Step 1: Create `exporter.php`

In your plugin's `Config` directory, create a new configuration file named `exporter.php`. This file will hold the configuration settings for your exporter.

Directory structure:

```
└── packages
    └── Webkul
        └── Example
            ├── ...
            └── src
                └── Config
                    └── exporter.php
```

### Step 2: Define the Exporter Configuration

In the `exporter.php` file, define your exporter and its settings. Here’s an example configuration for a product exporter:

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
                    'title'      => 'File Format',
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

Filters allow users to customize export behavior by offering configurable options. All filters should be defined inside the `filters['fields']` array. These will automatically appear in the UnoPim admin panel under:

> **Data Transfer > Export > Create Export**

Below are examples of supported filter types — **add each one inside the `fields` array as shown**:


- **Boolean**: A toggle switch to enable or disable the feature.
 ```php

 'filters' => [
    'fields' => [
        [
            'name'       => 'is_active',
            'title'      => 'data_transfer::app.exporters.products.is_active',
            'type'       => 'boolean',
            'required'   => false,
        ],
    ],
],
```
- **Select**: A dropdown menu to choose one option from a list.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'file_format',
            'title'      => 'data_transfer::app.exporters.products.file_format',
            'type'       => 'select',
            'required'   => true,
            'validation' => 'required',
            'options'    => [
                [
                    'value' => 'csv',
                    'label' => 'CSV',
                ],
                [
                    'value' => 'xlsx',
                    'label' => 'XLSX',
                ],
            ],
        ],
    ],
],
```
- **Multiselect**: A dropdown menu allowing multiple selections.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'categories',
            'title'      => 'data_transfer::app.exporters.products.categories',
            'type'       => 'multiselect',
            'required'   => true,
            'validation' => 'required',
            'options'    => [
                [
                    'value' => 1,
                    'label' => 'Electronics',
                ],
                [
                    'value' => 2,
                    'label' => 'Books',
                ],
            ],
        ],
    ],
],
```
- **Async-Select**: A dynamic dropdown that loads options asynchronously via API.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'channel',
            'title'      => 'Channel',
            'type'       => 'select',
            'required'   => true,
            'validation' => 'required',
            'async'      => true,
            'track_by'   => 'id',      // Field to use as value
            'label_by'   => 'label',   // Field to display as label
            'list_route' => 'admin.channel.fetch-all', // Route name for fetching options
        ],
    ],
],
```

> **Note**: When using async-select, make sure the specified `list_route` exists in your application and returns data in the expected format with the defined `track_by` and `label_by` fields.

- **Date**: A date picker for selecting a specific date.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'start_date',
            'title'      => 'data_transfer::app.exporters.products.start_date',
            'type'       => 'date',
            'required'   => true,
            'validation' => 'required|date',
        ],
    ],
],
```
- **Datetime**: A date and time picker for selecting a specific date and time.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'export_time',
            'title'      => 'data_transfer::app.exporters.products.export_time',
            'type'       => 'datetime',
            'required'   => true,
            'validation' => 'required|date',
        ],
    ],
],
```
- **Textarea**: A larger text input for multi-line text.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'comments',
            'title'      => 'data_transfer::app.exporters.products.comments',
            'type'       => 'textarea',
            'required'   => false,
        ],
    ],
],
```

### Step 3: Load the Configuration in the Service Provider

To ensure that UnoPim loads your exporter configuration, you must register it in your service provider by merging the configuration.

In your `ExampleServiceProvider`, add the following code to the `register()` method:

```php
public function register()
{
    $this->mergeConfigFrom(
        dirname(__DIR__) . '/Config/exporter.php', 'exporters'
    );
}
```

This merges the custom `exporter.php` configuration into the core exporter settings in UnoPim.

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