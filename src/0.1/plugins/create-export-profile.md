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