# Routes



## Introduction

Routes in Laravel define the entry points of your application, mapping HTTP requests to specific controllers or closures. They play a crucial role in defining how users interact with your web application's endpoints.

Routes can be defined to handle various HTTP methods (GET, POST, PUT, DELETE, etc.) and can include parameters and route parameters to capture dynamic values from the URL. Laravel's routing system is powerful and flexible, allowing for easy RESTful routing and middleware application to routes.

For detailed information on Laravel routes, including how to define routes, use route parameters, and apply middleware, refer to the [Laravel Documentation on Routing](https://laravel.com/docs/10.x/routing).

## Create a New Route

Let's start by creating routes for the **Example** package in UnoPim.

Start by creating a `Routes` folder inside `packages/Webkul/Example/src`.

Inside the `Routes` folder, create a file named `routes.php`. 

The updated directory structure will look like this:

```
└── packages
    └── Webkul
        └── Example
            └── src
                ├── ...
                └── Routes
                    └── routes.php
```

### Routes

Create `routes.php` for admin-specific routes. Add the following code to this file:

```php
<?php

use Illuminate\Support\Facades\Route;
use Webkul\Example\Http\Controllers\ExampleController;

Route::group(['middleware' => ['web', 'admin'], 'prefix' => config('app.admin_url')], function () {
    /**
     * Example routes for admin.
     */
    Route::controller(ExampleController::class)->prefix('examples')->group(function () {
        Route::get('', 'index')->name('admin.examples.index');
        // Add additional admin routes here
    });
});
```

#### Explanation

Routes inside `routes.php` are prefixed with the admin URL (`config('app.admin_url')`) and apply the `web` and `admin` middleware groups. Adjust the middleware and URL prefix according to your application's configuration.

## Loading Routes

### Register Routes in ServiceProvider

In the `ExampleServiceProvider.php` class, load the routes using the `loadRoutesFrom` method inside the `boot` method:

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
        // Load admin routes
        $this->loadRoutesFrom(__DIR__ . '/../Routes/routes.php');
    }
}
```

#### Explanation 

The `loadRoutesFrom` method registers routes defined in `routes.php` within the Laravel application, integrating them into the routing system.

## Available HTTP Methods

Basic routes respond to HTTP requests such as `GET`, `POST`, `PUT`, `DELETE`, etc., and map the URL to a specific controller method or closure function. For example:

### GET

The `GET` method is used to retrieve data from the server. It is typically used to display pages or retrieve information.

```php
// Define a route that responds to a GET request
Route::get('/examples', [ExampleController::class, 'index']);
```

### POST

The `POST` method is used to submit data to the server. It is commonly used for form submissions.

```php
// Define a route that responds to a POST request
Route::post('/examples', [ExampleController::class, 'store']);
```

### PUT

The `PUT` method is used to update existing data on the server. It is usually used for updating resources.

```php
// Define a route that responds to a PUT request
Route::put('/examples/{id}', [ExampleController::class, 'update']);
```

### DELETE

The `DELETE` method is used to delete data from the server. It is used to remove resources.

```php
// Define a route that responds to a DELETE request
Route::delete('/examples/{id}', [ExampleController::class, 'destroy']);
```

### PATCH

The `PATCH` method is similar to `PUT`, but it is used to make partial updates to data on the server.

```php
// Define a route that responds to a PATCH request
Route::patch('/examples/{id}', [ExampleController::class, 'partialUpdate']);
```
