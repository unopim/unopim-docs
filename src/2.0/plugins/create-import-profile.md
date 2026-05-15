# Implementing Data Import



The data import functionality allows you to integrate and process external data into your application. In UnoPim, custom data imports can be achieved by creating importer classes that validate, process, and store incoming data. This guide walks you through the steps required to implement a custom data importer.

---

## Overview of the Steps

1. **Create Importer File**: Create a dedicated importer file where the import logic will reside.
2. **Implement Importer Logic**: Define how the data is validated and processed.
3. **Register the Importer**: Configure UnoPim to recognize and utilize your custom importer.

---

## Step 1: Create the Importer File

To begin, create the directory structure for your import logic under the `Helpers/Importers` directory within your plugin. The structure should look like this:

```
└── packages
    └── Webkul
        └── Example
            ├── ...
            └── src
                └── Helpers
                    └── Importers
                        ├── ...
                        └── FileName
                            └── Importer.php
```

### Example:

- **Helpers/Importers**: This is the folder where all import logic for the plugin will reside.
- **Importer.php**: This file will contain the importer logic for the specific data type you're handling (e.g., products, tax rates).

---

## Step 2: Implement the Importer Logic

Once the `Importer.php` file is created, implement the logic to handle data validation and batch processing. The following is an example of how an importer can be structured for handling product imports, including validation and batch processing:

### Example Importer Logic:

```php
<?php

namespace Webkul\Example\Helpers\Importers\Product;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Webkul\DataTransfer\Helpers\Import;
use Webkul\DataTransfer\Helpers\Importers\AbstractImporter;

class Importer extends AbstractImporter
{
    protected array $validColumnNames = [
        'identifier', 'is_zip_range', 'zip_code',
        'zip_from', 'zip_to', 'state', 'country', 'tax_rate',
    ];

    protected array $messages = [
        self::ERROR_IDENTIFIER_NOT_FOUND_FOR_DELETE => 'data_transfer::app.importers.tax-rates.validation.errors.identifier-not-found',
        self::ERROR_DUPLICATE_IDENTIFIER => 'data_transfer::app.importers.tax-rates.validation.errors.duplicate-identifier',
    ];

    protected $permanentAttributes = ['identifier'];
    protected array $identifiers = [];

    /**
     * Validate the incoming data row by row
     *
     * @param array $rowData
     * @param int $rowNumber
     * @return bool
     */
    public function validateRow(array $rowData, int $rowNumber): bool
    {
        if ($this->import->action == Import::ACTION_DELETE) {
            if (! $this->isIdentifierExist($rowData['identifier'])) {
                $this->skipRow($rowNumber, self::ERROR_IDENTIFIER_NOT_FOUND_FOR_DELETE);
                return false;
            }
            return true;
        }

        $validator = Validator::make($rowData, [
            'identifier' => 'required|string',
            'country'    => 'required|string',
            'tax_rate'   => 'required|numeric|min:0.0001',
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->getMessages() as $attributeCode => $message) {
                $this->skipRow($rowNumber, current($message), $attributeCode);
            }
        }

        return ! $this->errorHelper->isRowInvalid($rowNumber);
    }

    /**
     * Process the import in batches
     *
     * @param ProductContract $batch
     * @return bool
     */
    public function importBatch(ProductContract $batch): bool
    {
        if ($batch->import->action == Import::ACTION_DELETE) {
            $this->deleteTaxRates($batch);
        } else {
            $this->saveTaxRatesData($batch);
        }

        $batch = $this->importBatchRepository->update([
            'state'   => Import::STATE_PROCESSED,
            'summary' => [
                'created' => $this->getCreatedItemsCount(),
                'updated' => $this->getUpdatedItemsCount(),
                'deleted' => $this->getDeletedItemsCount(),
            ],
        ], $batch->id);

        return true;
    }

    /**
     * Check if an identifier exists
     *
     * @param string $identifier
     * @return bool
     */
    public function isIdentifierExist(string $identifier): bool
    {
        return $this->taxRateStorage->has($identifier);
    }
}
```

### Key Functions Explained:

1. **`validateRow()`**:
    - This method validates each row of data to ensure it meets specific criteria (e.g., required fields, valid data types).
    - If the action is delete, it checks if the identifier exists in the system before deleting.
    - Uses Laravel's `Validator` to enforce field rules such as required values, valid numeric ranges, etc.

2. **`importBatch()`**:
    - This method processes the batch of data, either inserting new data, updating existing data, or deleting based on the action.
    - Handles the creation, updating, and deletion of records and generates a summary of what was processed.

3. **`isIdentifierExist()`**:
    - This helper function checks if a specific identifier exists in the system, which is important for actions like deletion.

---

## Step 3: Register the Importer

Now that the importer is created and the logic is defined, you need to register the importer so that UnoPim recognizes and can use it.

### Step 1: Create `importer.php`

In the `Config` directory of your plugin, create a new configuration file named `importer.php`. This file will contain the configuration for your importers.

Directory structure:

```
└── packages
    └── Webkul
        └── Example
            ├── ...
            └── src
                └── Config
                    └── importer.php
```

### Step 2: Define the Importer Configuration

In the `importer.php` file, define the configuration for your importer, specifying the importer class and other important settings like the title and sample file path.

```php
<?php

return [
    'products' => [
        'title'       => 'data_transfer::app.importers.products.title',  // Display title for the importer
        'importer'    => 'Webkul\Example\Helpers\Importers\Product\Importer',  // Importer class
        'sample_path' => 'data-transfer/samples/products.csv',  // Path to a sample CSV file for users
        'validator'   => 'Webkul\Example\Validators\JobInstances\Import\ProductJobValidator',// Validator class
        'filters' => [
            'fields' => [
                [
                    'name'       => 'file',
                    'title'      => 'data_transfer::app.importers.products.fields.file',
                    'type'       => 'file',
                    'required'   => true,
                    'async'      => false,
                    'validation' => 'required',
                ],
            ],
        ],
  ],
];
```
Explanation:
 - **`title`**: The title displayed in the Create Import page.
 - **`filters`**: An array of filter fields that will be displayed in the Create Import page.
 - **`importer`**: The fully qualified class name of the importer you created.
 - **`validator`**: The validator class that will be used to validate the import data.
 - **`sample_path`**: The path to a sample CSV file that users can download to understand the expected format.

####   Validator for Import
They are used to validate the input data before it is processed by the importer.

* **Extending the Base Validator**:
   - You can create a custom validator by extending the base `JobValidator` class.
   - This allows you to define specific rules, messages, and attributes for your import type.

#### Creating a Custom Validator

To add a new validation rule, extend the `JobValidator` class and define the rule in the `$rules` array. For example:

```php
<?php

namespace Webkul\Example\Validators\JobInstances\Import;

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
            'filters.file.required' => 'Please select a file to import',
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
- **`getAttributeNames()`**: Maps technical keys to human-readable names in error messages.
- **`getMessages()`**: Adds custom error messages. You can override this to add/merge messages.
- **`preValidationProcess()`**: Use this if you need to modify the data before validation.


#### Filters for Import
Filters allow users to customize import behavior by offering configurable options. All filters should be defined inside the `filters['fields']` array. These will automatically appear in the UnoPim admin panel under:

> **Data Transfer > Import > Create Import**

Below are examples of supported filter types — **add each one inside the `fields` array as shown**:

- **Boolean**: A toggle switch to enable or disable the feature.
 ```php

 'filters' => [
    'fields' => [
        [
            'name'       => 'is_active',
            'title'      => 'data_transfer::app.importers.products.fields.is_active',
            'type'       => 'boolean',
            'required'   => false,
        ],
    ],
],
```

- **Select**: A dropdown for single selection.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'channel',
            'title'      => 'data_transfer::app.importers.products.fields.channel',
            'type'       => 'select',
            'required'   => true,
            'validation' => 'required',
            'async'      => true,
            'track_by'   => 'id',
            'label_by'   => 'label',
            'list_route' => 'admin.channels.fetch-all', // Route for fetching options
        ],
    ],
],
```

- **Multiselect**: A dropdown for multiple selections.

```php
'filters' => [
    'fields' => [
        [
            'name'       => 'categories',
            'title'      => 'data_transfer::app.importers.products.fields.categories',
            'type'       => 'multiselect',
            'required'   => true,
            'validation' => 'required',
            'async'      => true,
            'track_by'   => 'id',
            'label_by'   => 'label',
            'list_route' => 'admin.categories.fetch-all', // Route for fetching options
        ],
    ],
],
```
- **Date**: A date picker.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'import_date',
            'title'      => 'data_transfer::app.importers.products.fields.import_date',
            'type'       => 'date',
            'required'   => false,
        ],
    ],
],
```
- **Datetime**: A date and time picker.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'import_datetime',
            'title'      => 'data_transfer::app.importers.products.fields.import_datetime',
            'type'       => 'datetime',
            'required'   => false,
        ],
    ],
],
```
- **Textarea**: A multi-line text input.
```php
'filters' => [
    'fields' => [
        [
            'name'       => 'description',
            'title'      => 'data_transfer::app.importers.products.fields.description',
            'type'       => 'textarea',
            'required'   => false,
        ],
    ],
],
```

### Step 3: Load the Configuration in the Service Provider

To make sure the configuration is loaded into the system, register it in your service provider using the `mergeConfigFrom` method. Add the following code to the `register()` method in your `ExampleServiceProvider`:


```php
public function register()
{
    $this->mergeConfigFrom(
        dirname(__DIR__) . '/Config/importer.php', 'importers'
    );
}
```

This ensures that the `importer.php` configuration is merged into the system, allowing UnoPim to recognize the importer.

## Step 4: Queue Operations

After setting up your importer, you need to configure and manage the queue system for processing imports. This is crucial for handling background tasks efficiently.

### Managing Queue Workers

When you make changes to any Importer class or its configurations, follow these steps:

```bash
# Restart the queue worker
php artisan queue:restart

# Start the queue worker again
php artisan queue:work
```

### Running Specific Import Jobs

To run a specific import job for a particular user:

```bash
# Format: php artisan unopim:queue:work [import_id] [user_email]
php artisan unopim:queue:work 1 johndoe@example.com
```

Parameters explained:
- `1`: The ID of the import job you want to process
- `johndoe@example.com`: The email of the logged-in user who initiated the import

::: warning Important
Always restart the queue workers after:
- Modifying Importer classes
- Updating configurations
- Installing or updating modules

This ensures your changes take effect in the queue system.
:::