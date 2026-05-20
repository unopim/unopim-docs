# Side Menu



## Introduction

The side menu in UnoPim allows developers to customize and extend the default menu items within the admin panel. By adding custom menu items, you can provide easy access to various sections and features specific to your plugin. This guide will walk you through the process of configuring the side menu for your custom plugin.

## Configure the Side Menu

To ensure that the side menu includes the necessary configuration, follow these steps:

### 1. **Create the Configuration File**

- Navigate to your plugin's source directory, typically located at `packages/Webkul/Example/src`.

- Create a new directory named `Config` if it doesn't already exist.

- Inside the `Config` directory, create a file named `menu.php`.

```
└── packages
    └── Webkul
        └── Example
            └── src
                ├── ...
                └── Config
                    └── menu.php
```

### 2. **Define Menu Items**

Open `menu.php` and define your menu items using an array structure. Each item should include:

- `key`: A unique identifier for the menu item.
- `name`: Display name of the menu item.
- `route`: Laravel route name corresponding to the menu item.
- `sort`: Optional. Sort order for menu items.
- `icon`: Optional. CSS class for an icon associated with the menu item.

```php
<?php

return [
    [
        'key'   => 'examples',
        'name'  => 'Examples',
        'route' => 'example.menu.index',
        'sort'  => 2,
        'icon'  => 'icon-example', // Optional icon class
    ],
];
```

### 3. **Define Routes**

In your plugin's `routes.php` file, define the named route used in `menu.php` as follows:

```php
Route::get('/example', [ExampleController::class, 'index'])->name('example.menu.index');
```
### 4. **Merge Configuration**

After defining your menu items and routes, you need to merge your menu configuration with UnoPim's core menu configuration. Add the following to your plugin's service provider:

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

This step is crucial as it integrates your custom menu items into UnoPim's admin panel menu structure.

## Loading and Setting the Side Menu Icon

UnoPim allows developers to add custom icons to their side menu items. Icons can be added using either custom fonts or image files. This guide covers both methods.

---

### 1. **Using Font Icons**

#### Step 1: **Place the Icon Font**
- Ensure that your custom icon font (e.g., `example.woff`) is placed in your plugin's `assets/fonts/` directory.

#### Step 2: **Load the Vite Configuration**
- Ensure that your Vite configuration is properly set up for asset management. This ensures that the custom font is bundled with your package’s assets. Refer to UnoPim’s [Vite configuration documentation](../packages/bundling-assets.html).

#### Step 3: **Define the Font and Icon in CSS**
- In your plugin's `app.css` or another custom CSS file, define the font and the class for your custom icon:

```css
@font-face {
  font-family: "unopim-admin";
  src: url("../fonts/example.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.icon-example:before {
  content: "\e900"; /* Custom Unicode for the icon */
}
```

#### Step 4: **Reference the CSS in Blade Template**
- Include the CSS file in your Blade template using UnoPim’s Vite helper. For example, in `style.blade.php`:

```php
@unoPimVite([
  'src/Resources/assets/css/app.css'
], 'example')
```

#### Step 5: **Load the CSS in the Service Provider**
- Use the `unopim.admin.layout.head.before` event in your `ExampleServiceProvider` to load the custom CSS in the main admin layout:

```php
public function boot()
{
    $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'example');
    Event::listen('unopim.admin.layout.head.before', function($viewRenderEventManager) {
        $viewRenderEventManager->addTemplate('example::style');
    });
}
```

---

### 2. **Using Image Icons**

#### Step 1: **Place the Icon Image**
- Place your custom icon image (e.g., `example.png`) in your package’s `assets/images/` directory.

#### Step 2: **Add CSS for the Icon**
- Define the custom icon’s CSS in a file like `menu.css` within your package’s `assets/css/` directory:

```css
.icon-example {
    background-image: url("../images/example.png");
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
    opacity: 0.6;
    margin-left: 4px !important;
}

.active .icon-example {
    opacity: 1;
    background-image: url("../images/example.png");
}
```

#### Step 3: **Reference the CSS in Blade Template**
- Like with font icons, include the CSS file in your Blade template:

```php
@unoPimVite([
  'src/Resources/assets/css/menu.css'
], 'example')
```

#### Step 4: **Load the CSS in the Service Provider**
- Use the same method as above to load the CSS via the `unopim.admin.layout.head.before` event in your `ExampleServiceProvider`:

```php
public function boot()
{
    $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'example');
    Event::listen('unopim.admin.layout.head.before', function($viewRenderEventManager) {
        $viewRenderEventManager->addTemplate('example::style');
    });
}
```

---

### **Optimize Application**

Once the above steps are completed, run the following command to clear and optimize your application:

```bash
php artisan optimize:clear
```
