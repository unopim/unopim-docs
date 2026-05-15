# Repository Pattern in UnoPim



UnoPim uses the **Repository Pattern** to improve flexibility and maintainability in its codebase. This pattern adds an extra layer of abstraction on top of the **ORM**, promoting better code organization.

### Benefits of the Repository Pattern

- **Consistency**: Avoids raw queries, ensuring a consistent way to handle database operations.
- **Maintainability**: Organizes the code to make it easier to manage and update.
- **Flexibility**: Allows changes to be made without affecting other parts of the code.

### Implementation in UnoPim

UnoPim implements the **Repository Pattern** with the [Prettus Repository](https://github.com/prettus/l5-repository) package, which offers:

- **Standardization**: A consistent way to implement repositories.
- **Extensibility**: Easier customization and expansion of the application.
- **Separation of Concerns**: Clear division between business logic and data access.

By using the Repository Pattern with Prettus, UnoPim ensures a more structured and adaptable architecture.

## Eloquent ORM

[Eloquent](https://laravel.com/docs/10.x/eloquent), the ORM in **Laravel**, simplifies database operations by letting developers work with objects instead of writing SQL queries, making data manipulation more intuitive.