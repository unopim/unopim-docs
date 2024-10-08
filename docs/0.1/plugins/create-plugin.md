# Getting Started

[[TOC]]

## Introduction 

A plugin is a self-contained module that encapsulates specific features or functionality, allowing developers to add custom features without altering the core codebase. This approach not only preserves the integrity of the core system but also ensures that updates and maintenance can be carried out smoothly.

By developing packages, you can introduce new functionalities, integrate third-party services, or customize existing features to better meet your business requirements. Each plugin is isolated, promoting clean code practices and enabling easier debugging and testing.

This guide will take you through the process of creating a plugin for UnoPim, from setting up the directory structure to defining configurations, routes, controllers, models, and views. By the end of this guide, you will have a solid understanding of how to develop and integrate packages into the UnoPim platform, enhancing its capabilities while maintaining a robust and maintainable codebase.

## Prerequisites

- A working UnoPim application
- Composer installed

## Manual Setup of Files

If you prefer to set up your plugin manually, follow these steps assuming you are familiar with plugin directory structures and workflows. We'll use the default **`plugin`** folder in UnoPim as an example.

### Create plugin Directory

Inside the **`packages/Webkul`** folder, create a folder with your plugin name. Your structure should look like this:

   ```
   └── packages
       └── Webkul
           └── Example
   ```

In your plugin folder, create a folder named as **`src`**. This is where you'll put all your plugin-related files. Your updated structure will look like this:

   ```
   └── packages
       └── Webkul
           └── Example
               └── src
   ```

### Create Service Provider

In the **`src`** folder, create a folder named as **`Providers`**. Inside that folder, create a file named as **`ExampleServiceProvider.php`**. Your structure should look like this:

   ```
   └── packages
       └── Webkul
           └── Example
               └── src
                   └── Providers
                       └── ExampleServiceProvider.php
   ```

Copy the following code and paste it into **`ExampleServiceProvider.php`**:

   ```php
   <?php

   namespace Webkul\Example\Providers;

   use Illuminate\Support\ServiceProvider;

   class ExampleServiceProvider extends ServiceProvider
   {
       /**
        * Bootstrap services.
        *
        * @return void
        */
       public function boot()
       {
           //
       }

       /**
        * Register services.
        *
        * @return void
        */
       public function register()
       {
           //
       }
   }
   ```

### Register Your plugin

Add your plugin's namespace to the **`psr-4`** section in the **`composer.json`** file located in the root directory of your UnoPim application. Update it as follows:

   ```json
   "autoload": {
       ...
       "psr-4": {
           // Other PSR-4 namespaces
           "Webkul\\Example\\": "packages/Webkul/Example/src"
       }
   }
   ```

Register your plugin's service provider in the **`config/app.php`** file located in the root directory of your UnoPim application. Add the following line to the **`providers`** array:

```php
<?php

return [
    
    // Other configuration options

    'providers' => ServiceProvider::defaultProviders()->merge([
        // Other service providers
        Webkul\Example\Providers\ExampleServiceProvider::class,
    ])->toArray(),
    
    // Other configuration options
];
```

### Run the Commands 

Run the following command to autoload your plugin:

   ```shell
   composer dump-autoload
   ```

   Your plugin is now ready to use!