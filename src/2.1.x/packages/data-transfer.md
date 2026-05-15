# Data Transfer



## Introduction

Creating custom data import and export functionalities in UnoPim allows seamless bulk data management directly from the admin panel under the `Settings Menu`. This feature is essential for efficiently handling large datasets within your application.

## Import

Import is a feature that allows users to import large quantities of data into a system quickly and efficiently. It simplifies the process and saves time by not having to add each piece of information one by one.

The feature works differently for each system and has a vast variety of use cases across many industries as well as [UnoPim](https://unopim.com/).

## Export

Exporting data to save information in files is a common practice for data management, analysis, and sharing. This involves transferring data from a source system into a file format that is suitable for storage, future use, or sharing with others.

## Import/Export Tracker UI (v2.0.0)

UnoPim v2.0.0 introduces a real-time **Import/Export Tracker** in the admin panel that provides step-by-step pipeline visualization for running jobs. The tracker displays each stage of the import or export process, including validation, processing, and indexing, with live progress indicators.

### Key Features

- **Real-time step pipeline visualization** showing the current stage, completed stages, and remaining stages of the job.
- **Job-specific logging** that captures detailed logs for each import/export run, making it easier to diagnose issues.
- **Pause, Resume, and Cancel controls** available directly in the tracker UI, allowing administrators to manage running jobs without terminal access.

## File Upload Enhancements (v2.0.0)

### Drag-and-Drop File Upload

Import jobs now support **drag-and-drop file upload** for CSV, XLSX, and XLS files. Users can drag files directly onto the import configuration form instead of using the traditional file picker.

### ZIP Image Upload Modal

A dedicated **ZIP image upload modal** with drag-and-drop support is available for importing product images in bulk. Users can upload a ZIP archive containing product images, which are automatically extracted and associated with the corresponding products.

## Optimized Export Pipeline (v2.0.0)

The export pipeline has been significantly optimized for better performance with large datasets:

- **Eager loading** of relationships to reduce N+1 query issues during export.
- **Cached `initialize()` method** to avoid redundant setup on each batch iteration.
- **Increased `BATCH_SIZE` to 200** for faster throughput on large catalogs.
- **Optimized category export** that replaces in-memory product loading with direct count queries, preventing timeouts on large catalogs with millions of products.

### Export Batch Job Reliability

Export batch jobs now support `$tries` and `$timeout` properties for improved queue reliability. These allow you to configure retry attempts and timeout duration per job:

```php
// Example configuration on an export batch job
protected $tries   = 3;       // Retry up to 3 times on failure
protected $timeout = 1800;    // 30-minute timeout per attempt
```

Tuning these values helps prevent silent failures on long-running exports and ensures jobs are retried automatically when transient errors occur.

## Optimized Import Pipeline (v2.0.0)

The import pipeline includes several performance and reliability improvements:

- **Deferred indexing** that postpones search index updates until after the entire import completes, reducing overhead during processing.
- **Field processor improvements** for faster attribute value parsing and validation.
- **Batch state tracking** that persists progress per batch, enabling accurate resume after pause or failure.
- **Configurable batch and chunk sizes** allowing administrators to tune import performance based on server resources and dataset characteristics.

## Translatable Tracker UI (v2.0.0)

All tracker UI elements now use **translation strings** instead of hardcoded text. Labels such as "Importing", "Exporting", step names, and status messages are fully translatable, making it straightforward to localize the entire import/export experience.

- Labels, button text, and progress messages are resolved through Laravel's translation helpers (`trans()` / `__()`).
- Custom tracker labels can be overridden by publishing or editing the corresponding language files in your package's `Resources/lang/{locale}/` directory.