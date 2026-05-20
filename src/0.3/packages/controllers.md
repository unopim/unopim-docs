# Controller



## Introduction

In Laravel, controllers are responsible for handling the request logic of an application. They act as intermediaries between the models and views, processing user input, interacting with the data layer, and returning the appropriate responses. By organizing related request handling logic into separate classes, controllers make it easier to manage and maintain the application's codebase.

To learn in detail about Controllers, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/controllers).

## How to create Controllers

To start building a controller for our example examples within the Laravel package named "Example", follow the steps below:

### Directory Structure

Create the necessary directory structure within the `packages/Webkul/Example/src` path. To create the directory structure follow the following steps:

1. Navigate to the `packages/Webkul/Example/src` directory.
2. Create an `Http` folder inside `src`.
3. Inside the `Http` folder, create another folder named `Controllers`.
4. Inside the `Controllers` folder, create one file named `Controller.php`.
5. Inside the `Controllers` folder, create a `ExampleController.php` file. The updated directory structure will look like this:

  ```
  └── packages
      └── Webkul
          └── Example
              └── src
                  ├── ...
                  └── Http
                      └── Controllers
                          ├── Controller.php
                          └── ExampleController.php
  ```

### Creating Controller Files

Now, create the necessary controller files.

#### Base Controller (Controller.php)

In `packages/Webkul/Example/src/Http/Controllers/Controller.php`, you can define the base controller for your package:

  ```php
  <?php

  namespace Webkul\Example\Http\Controllers;

  use Illuminate\Foundation\Bus\DispatchesJobs;
  use Illuminate\Routing\Controller as BaseController;
  use Illuminate\Foundation\Validation\ValidatesRequests;
  use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

  class Controller extends BaseController
  {
      use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
  }
  ```

### ExampleController.php

In `packages/Webkul/Example/src/Http/Controllers/ExampleController.php`, define the example controller:

  ```php
  <?php

  namespace Webkul\Example\Http\Controllers;

  use Illuminate\Http\Request;
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
          $examples = $this->exampleRepository->all();

          return view('example::admin.index', compact('examples'));
      }

      /**
       * Create.
       * 
       * @return \Illuminate\View\View
       */
      public function create() 
      {
          //
      }

      /**
       * Store.
       * 
       * @return \Illuminate\View\View
       */
      public function store(Request $request)
      {
          //
      }

      /**
       * Function to update items.
       */
       public function update(int $id)
       {
         //
       }

      /**
       * Function to remove items.
       */
       public function destroy(int $id)
       {
         //
       }
  }
  ```
