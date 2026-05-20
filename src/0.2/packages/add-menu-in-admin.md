# Side Menu



## Introduction

The side menu in UnoPim allows developers to customize and extend the default menu items within the admin panel. By adding custom menu items, you can provide easy access to various sections and features specific to your package. This guide will walk you through the process of configuring the side menu for your custom package.

## Configure the side menu

To ensure that the side menu includes the necessary configuration, follow these steps:

### Create Configuration File:

- Navigate to your package's source directory, typically located at `packages/Webkul/Example/src`.

- Create a new directory named `Config` if it doesn't already exist.

- Inside the `Config` directory, create a file `named menu.php`.

```
└── packages
    └── Webkul
        └── Example
            └── src
                ├── ...
                └── Config
                    └── menu.php
```

### Define Menu Items

Open `menu.php` and define your menu items using an array structure. Each item should include:

- `key` Unique identifier for the menu item.
- `name` Display name of the menu item.
- `route` Laravel route name corresponding to the menu item.
- `sort` Optional. Sort order for menu items.
- `icon` Optional. CSS class for an icon associated with the menu item.

```php
<?php

return [
    [
        'key'   => 'examples',
        'name'  => 'Examples',
        'route' => 'example.menu.index',
        'sort'  => 2,
        'icon'  => 'icon-example',
    ],
];
```

### Define Routes

In your package's `routes.php` file, define the named route used in` menu.php` as follows.

```php
Route::get('/example', [ExampleController::class, 'index'])->name('example.menu.index');
```

### Adding a Custom Menu Icon

1. **Place Icon Font**
   - Place your custom icon font (e.g., `font.woff`) in the `assets/fonts/` directory of your package.

2. **Define Icon in Blade Template**
   - Instead of creating a separate CSS file and running a build process, you can define the icon directly in the Blade template file (e.g., `style.blade.php`).

   Example:

   ```html
   <style>
     .icon-example::before {
         content: "\e929";  /* Your Icon Code */
     }
   </style>
   ```

3. **Load CSS via Event in Service Provider**
   - In your `ExampleServiceProvider`, listen for the `unopim.admin.layout.head` event to load the custom CSS in the main layout.

   Example:

   ```php
   public function boot()
   {
      $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'example');
      Event::listen('unopim.admin.layout.head', function($viewRenderEventManager) {
         $viewRenderEventManager->addTemplate('example::style');
      });
   }
   ```

### Merge Configuration:

In your package's service provider (`ExampleServiceProvider`), use `mergeConfigFrom()` to integrate your `menu.php` configuration with the core side menu.

```php
<?php

namespace Webkul\Example\Providers;

use Illuminate\Support\ServiceProvider;

class ExampleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(
            dirname(__DIR__) . '/Config/menu.php', 'menu.admin'
        );
    }
}
```

### Optimize Application

Finally, run the following command to optimize your application:

```
php artisan optimize:clear
```

After completing these steps, your custom menu item (Examples) with its associated route and icon should appear within the admin panel of UnoPim.

## Level of side Menu

In UnoPim, the side menu offers three levels of navigation to organize and access different sections and features efficiently:

### First Level (Sidebar): 
This level appears in the sidebar and contains the primary menu items. These are the main sections of the admin panel, such as Dashboard, Catalog.

### Second Level (Hover Menu): 
When you hover over an item in the first-level sidebar menu, the second level appears. This level contains sub-items related to the main section, providing more specific options. For example, hovering over "Catalog" might show options like Products, Categories, and Attributes.

### Third Level (Tabs):

The third level is presented as tabs within the second-level menu item. When you select a sub-item from the second level, it might open a page with additional tabs for further navigation. These tabs allow for deeper, more granular control and management within a specific section, such as different tabs for managing various attributes of a product.

By utilizing these three levels of navigation, UnoPim ensures a structured and intuitive user interface, making it easier to manage complex administrative tasks.
