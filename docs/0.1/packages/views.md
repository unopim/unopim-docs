# Views

[[TOC]]

## Introduction

Views in Laravel are responsible for separating the application's logic from the presentation layer. They provide a clean way to manage and organize the HTML content of your application. Views are typically stored in the `resources/views` directory and are rendered using the Blade templating engine, which offers a simple and powerful way to create dynamic content.

By using views, you can create reusable templates and components, making your code more maintainable and easier to understand. Blade templates allow you to use control structures like loops and conditionals, as well as to include other templates, which helps to keep your views organized and modular.

To learn in detail about Views, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/views).

Here's a basic example of a Blade template:

## Directory Structure

To organize the views for our example package, we need to set up a specific directory structure. Follow the steps below to create the necessary folders.

#### Create the `Resources` Folder
   - Navigate to the `packages/Webkul/Example/src` directory.
   - Create a folder named `Resources`.

#### Create the `views` Folder
   - Inside the `Resources` folder, create another folder named `views`.

#### Create the `example` Folders
   - Inside the `views` folder, create two folders named `example`.

The updated directory structure will look like this:

  ```
  └── packages
      └── Webkul
          └── Example
              └── src
                  ├── ...
                  └── Resources
                      └── views
                          └── example
  ```
### Adding HTML Content

Below is an example of basic HTML content that you can add to the example `index.blade.php` file.

#### `index.blade.php` in the `example` Folder

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Example</title>
    </head>
    <body>
        <h1>Example</h1>
        <p>Welcome to the example section for managing example content.</p>
    </body>
</html>
```

## Load Views from Package

To make the views in our package accessible, we need to register them in the service provider's `boot` method. This involves updating the `ExampleServiceProvider.php` file to include the view loading logic. Follow the steps below:

#### Open the Service Provider File
   - Navigate to the `packages/Webkul/Example/src/Providers` directory.
   - Open the `ExampleServiceProvider.php` file.

#### Update the `boot` Method
   - Inside the `boot` method of the `ExampleServiceProvider` class, add the logic to load views from the package.

#### Updated `ExampleServiceProvider.php`

Here is the updated code for `ExampleServiceProvider.php`:

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
          //... 

          $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'example');
      }
  }
  ```

#### Explanation

- The `namespace` keyword defines the namespace for the `ExampleServiceProvider` class, which is `Webkul\Example\Providers`.
- The `ExampleServiceProvider` class extends Laravel's base `ServiceProvider` class.
- The `boot` method is used to bootstrap any application services.
- Inside the `boot` method, we use the `$this->loadViewsFrom` method to register the views from the package.
- The `loadViewsFrom` method takes two arguments:
    - The path to the views directory within the package: `__DIR__ . '/../Resources/views'`.
    - A namespace for the views: `'example'`.

## Rendering Views

In Laravel applications, views are typically rendered from controller methods using the `view` helper function. This section describes how views are invoked and passed data from a controller.

```php
  <?php

  namespace Webkul\Example\Http\Controllers\Shop;

  use Webkul\Example\Http\Controllers\Controller;
  use Webkul\Example\Repository\ExampleRepository;

  class ExampleController extends Controller
  {
      /**
       * Create a controller instance.
       * 
       * @param  \Webkul\Example\Repository\ExampleRepository  $exampleRepository
       * @return void
       */
      public function __construct(protected ExampleRepository $exampleRepository)
      {
      }

      /**
       * Index.
       * 
       * @return \Illuminate\View\View
       */
      public function index()
      {
          $examples = $this->exampleRepository->with(['author'])->all();

          return view('example::example.index', compact('examples'));
      }
  }
  ```

#### Explanation

- The `view` helper function in Laravel is used within the `index` method of the `ExampleController` to render the `example.index` view.

- It accepts two parameters the name of the view (`example::example.index`) and an array of data (`compact('examples')`) to pass to the `view`.

## Blade File Naming Convention

UnoPim utilizes Blade templates to handle `listing`, `creation`, and `updating` operations for resources like products, examples, and categories. This section provides a detailed guide on how to implement these operations using Blade templates within your UnoPim package.

### Listing (Index Blade):

- The `index.blade.php` template is used to display a list of all records (examples).

- The controller's `index` method fetches all examples and passes them to the view.

### Creation (Create Blade):

- The `create.blade.php` template contains a form for creating new records.

- The controller's `create` method renders this view.

### Updating (Edit Blade):

- The `edit.blade.php` template contains a form for editing existing records.

- The controller's `edit` method fetches the specific example and passes it to the view.

By following these steps, you can effectively utilize Blade templates in UnoPim for listing, creating, and updating resources, ensuring a structured and maintainable approach to managing CRUD operations within your application.