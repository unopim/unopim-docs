# Models

[[TOC]]

## Introduction

Laravel includes Eloquent, an object-relational mapper (ORM) that makes it enjoyable to interact with your database. When using Eloquent, each database table has a corresponding "Model" that is used to interact with that table. In addition to retrieving records from the database table, Eloquent models allow you to insert, update, and delete records from the table as well. 
To understand Models in detail, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/eloquent).

We are using the [konekt/concord](https://packagist.org/packages/konekt/concord) package, which is an extension of Laravel. It helps in building modular Laravel applications.

Let's create a new model for your application. We will assume that the package name is "**Example**". Follow these steps:

## Using Laravel Artisan Command

Before creating the model class, it's essential to create two additional components: the `Contract` and the `Proxy`.

### Create the Contract

Laravel's Contracts are a set of interfaces that define the core services provided by the framework. For example, the **`Illuminate\Contracts\Queue\Queue`** contract defines the methods needed for queueing jobs, while the **`Illuminate\Contracts\Mail\Mailer`** contract defines the methods needed for sending an email.

Each contract has a corresponding implementation provided by the framework. For example, Laravel provides a queue implementation with various drivers and a mailer implementation powered by SwiftMailer.

All Laravel contracts are stored in their own GitHub repository. This provides a quick reference for all available contracts and a single, decoupled package that can be used by package developers.

Now, create a folder named **`Contracts`** inside **`Webkul/Example/src/`** and create an interface file named **`Example.php`**.

  ```
  packages
  └── Webkul
      └── Example
          └── src
              ├── ...
              └── Contracts
                  └── Example.php
  ```

Copy the following code into the **`Example.php`** file.

  ```php
  <?php

  namespace Webkul\Example\Contracts;

  interface Example
  {
  }
  ```

### Create the Proxy

Proxies, as their name suggests, act as intermediaries to the actual model class. Model proxies are used to override the functionality of existing models without creating a new database table.

Navigate to the directory `packages/Webkul/Example/src/` and create a new folder named `Models`.

```
└── packages
  └── Webkul
    └── Example
    └── src
      ├── ...
      └── Models
```

Inside the `Models` folder, create a new PHP file named `ExampleProxy.php`.

  ```
  └── packages
      └── Webkul
          └── Example
              └── src
                  ├── ...
                  ├── Contracts
                  │   └── Example.php
                  └── Models
                      └── ExampleProxy.php
  ```

Copy the following code into the **`ExampleProxy.php`** file.

  ```php
  <?php

  namespace Webkul\Example\Models;

  use Konekt\Concord\Proxies\ModelProxy;

  class ExampleProxy extends ModelProxy
  {
  }
  ```

### Create the Model

The simple way to create a model is to execute the `make:model` artisan command

  ```sh
  php artisan make:model Example
  ```

Now, move your **`Example`** model from the project root directory (i.e., **`App/Models`**) to the **`packages/Webkul/Example/src/Models`** folder.

  ```
  └── packages
      └── Webkul
          └── Example
              └── src
                  ├── ...
                  ├── Contracts
                  │   └── Example.php
                  └── Models
                      ├── Example.php
                      └── ExampleProxy.php
  ```

Copy the following code into the **`Example.php`** file.

  ```php
  <?php

  namespace Webkul\Example\Models;

  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Database\Eloquent\Relations\BelongsTo;
  use Webkul\User\Models\Admin;
  use Webkul\Example\Contracts\Example as ExampleContract;

  class Example extends Model implements ExampleContract
  {
     /**
      * The attributes that are mass assignable.
      *
      * @var $fillable
      */
      protected $fillable = [
          'title',
          'description',
          'user_id',
          'status'
      ];

     /**
      * Get the user that owns the example.
      */
      public function author(): BelongsTo
      {
          return $this->belongsTo(Admin::class, 'user_id');
      }
  }
  ```

The `Example` model represents a example example in the application. It implements the `ExampleContract` and is part of the `Webkul\Example\Models` namespace.

`public function author(): BelongsTo` This method defines a `BelongsTo` relationship between the Example model and the Admin model.

### Create Module Service Provider

To create a provider named `ModuleServiceProvider.php` inside `Webkul/Example/src/Providers` for your Laravel package, follow these steps. 
  ```
  └── packages
    └── Webkul
        └── Example
            └── src
                ├── ...
                └── Providers
                    ├── ExampleServiceProvider.php
                    └── ModuleServiceProvider.php
  ```

In this file, we register the models used in this package. You can see the code below.

```php
<?php

namespace Webkul\Example\Providers;

use Konekt\Concord\BaseModuleServiceProvider;

class ModuleServiceProvider extends BaseModuleServiceProvider
{
    protected $models = [
        \Webkul\Example\Models\Example::class,
    ];
}
```

The `ModuleServiceProvider` class registers models used in the Example package. It extends `BaseModuleServiceProvider` from the `Konekt\Concord` package.

### Registering ModuleServiceProvider

To integrate the `ModuleServiceProvider` with the Concord module system in Laravel, you need to register it in the `config/concord.php` configuration file.

- Navigate to Configuration File Locate and open the `config/concord.php` file in your Laravel application.

- Add ServiceProvider Inside the `modules` array, add the `ModuleServiceProvider` class to register it with Concord.

```php
<?php

return [
    'modules' => [
        // Other service providers
        \Webkul\Example\Providers\ModuleServiceProvider::class,
    ]
];
```