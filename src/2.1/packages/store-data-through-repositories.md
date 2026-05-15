# Repositories



## Introduction

In traditional development, application logic is often embedded in controllers. An alternative approach uses Repositories to abstract database operations and queries, promoting cleaner, more maintainable code.

Repositories decouple models from controllers and provide readable names for complex queries. Each Repository class binds to an Eloquent model in its constructor, enabling the use of methods like `findOrFail`, `update`, and `all`. This separation enhances code readability, reusability, and adherence to the separation of concerns principle, making the application easier to manage and scale.

## Dependency Injection

In the given constructor, we are using dependency injection to bind the ExampleRepository to a protected property within the class. This allows for easy access to the repository's methods and ensures that the class adheres to the principle of dependency inversion, promoting loose coupling and enhancing testability.

```php
// Bound in constructor
public function __construct(protected ExampleRepository $exampleRepository) {}
```

The constructor binds an instance of `ExampleRepository` to the `$exampleRepository` property of the class. This is achieved using PHP's constructor property promotion, a feature introduced in PHP 8 that simplifies the declaration and initialization of class properties.

## Manually Setting Up Repository Files

Manually setting up repository files involves creating and organizing repository classes in your application without relying on automated generators. This approach allows for custom structuring and naming conventions tailored to your project's needs. By manually managing repository files, developers can ensure precise control over code organization and maintain consistency across the application architecture.

### Setting Up ExampleRepository in Webkul/Example Package

Start by creating a `Repository` folder within the `Webkul/Example/src/` directory. This folder will house the repository class responsible for handling example-related database operations.Create a file named `ExampleRepository.php`. 

  ```
  └── packages
      └── Webkul
          └── Example
              └── src
                  ├── ...
                  └── Repository
                      └── ExampleRepository.php
  ```

This file will contain the `ExampleRepository` class, which will encapsulate methods for interacting with example data.
Copy the following code into your newly created repository file.

  ```php
  <?php

  namespace Webkul\Example\Repository;

  use Webkul\Core\Eloquent\Repository;

  class ExampleRepository extends Repository
  {
      /**
      * Specify the Model class name
      *
      * @return string
      */
      function model(): string
      {
          return 'Webkul\Example\Contracts\Example';
      }
  }
  ```

The `model()` method within ExampleRepository.php returns the path of your contract class (`ExampleContract` in this example). This method initializes the model instance used throughout the repository for database interactions.

Your `ExampleRepository` is now set up and ready for use within your application. It encapsulates the logic for interacting with example data, following best practices for separation of concerns and promoting clean architecture.

By utilizing the `ExampleRepository`, you can efficiently perform database operations related to examples while maintaining a structured and maintainable codebase.

## Available Methods

We are using the Prettus Repository package. You can find all available methods in the Prettus repository [here](https://github.com/andersao/l5-repository?tab=readme-ov-file#methods). Here are some examples:

Examples:

| Sl. no. | Method              | Description                               |
| ------- | ------              | -----------                               |
| 1       | all                 | Find all results in the Repository        |
| 2       | find                | Find a result by ID                       |
| 3       | findOrFail          | Retrieve a single record by its ID or throw an exception if not found.|
| 4       | create              | Create a new record.                       |
| 5       | update              | Update an existing record by its ID.       |
| 6       | delete              | Delete a record by its ID.                 |
| 7       | paginate            | Find all results in the Repository with pagination  |
| 8       | where               | Retrieve records matching specific conditions.  |
| 9       | first               | Retrieve the first record matching specific conditions. |
| 10      | With(['table_name'])| Load the model relationships Eager load relationships |
| 11      | findWhereIn         | Find results by multiple values in one field|

### All

Retrieve all records.

```php
$examples = $this->exampleRepository->all();

```

### Find

Retrieve a single record by its ID.

```php
$example = $this->exampleRepository->find($id);
```

### FindOrFail

Retrieve a single record by its ID or throw an exception if not found.

```php
$example = $this->exampleRepository->findOrFail($id);
```

### Create

Create a new record.

```php
$example = $this->exampleRepository->create(Input::all());
```

### Update

Update an existing record by its ID.

```php
$example = $this->exampleRepository->update(Input::all(), $id);
```

### Delete

Delete a record by its ID.

```php
$this->exampleRepository->delete($id)
```

### Paginate

Retrieve paginated records.

```php
$examples = $this->exampleRepository->paginate($limit = null, $columns = ['*']);
```

### Where

Retrieve records matching specific conditions.

```php
$this->exampleRepository->deleteWhere([
    //Default Condition =
    'email' => 'admin@example.com',
])
```

### First

Retrieve the first record matching specific conditions.

```php
$this->exampleRepository->findWhere([
    //Default Condition =
    'email' => 'admin@example.com',
])->first()
```

### With

Eager load relationships.

```php
$example = $this->exampleRepository->with(['state'])->find($id);
```

### FindWhereIn

Retrieve records where a specified column's value is within a given array of values.

```php
$examples = $this->exampleRepository->findWhereIn('id', [1,2,3,4,5]);
```
