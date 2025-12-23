# Contribution Guide



## Bug Reports

At UnoPim, we highly value active collaboration among our community members to continually enhance our platform's performance and reliability. To facilitate this collaborative effort, we extend a warm invitation to both report bugs and submit pull requests.

Rather than solely reporting bugs, we encourage you to take an active role in resolving issues by submitting pull requests containing fixes or negative test cases that effectively highlight the problem. This approach not only identifies issues but also provides practical solutions for their resolution.

When filing a bug report, we kindly request you to include a clear and descriptive title, along with a detailed description of the encountered problem. Additionally, please provide as much relevant information as possible, including a code sample that can reproduce the bug. Such comprehensive reports significantly expedite the troubleshooting process and enable swift resolution.

It is our collective goal to foster collaboration and find effective solutions to the challenges encountered. By actively participating in bug reporting, you not only engage fellow community members in problem-solving but also contribute significantly to the ongoing enhancement of the UnoPim project.

## Projects to Contribute

You can contribute to the following projects:

- [UnoPim](https://github.com/unopim/unopim)
- [UnoPim docs](https://github.com/unopim/unopim-docs)
- [UnoPim-Bagisto Connector](https://github.com/unopim/bagisto-connector)
- [UnoPim Shopify Connector](https://github.com/unopim/shopify-connector)
- [UnoPim Digital Asset Management (DAM)](https://github.com/unopim/unopim-digital-asset-management)


## Feature Requests

We welcome proposals for new features and enhancements to the existing UnoPim app. If you have a new feature in mind, please be prepared to contribute some of the code required to implement it.

## Branch Selection

Before submitting a pull request, it's important to consider the following points to help you choose the appropriate branch:

- **Bug Fixes**: If you're fixing a bug, make sure to port the fix to the master version.
- **Critical Bug Fixes**: If you're fixing a critical bug, make sure to port the fix to the latest stable version that supports it (currently v1.0.0).
- **Feature Requests**: If your request involves a feature with potential breaking changes, send it to the master branch, which corresponds to the upcoming release (v1.0.x).

## Compiled Assets

To determine the sorting order for Tailwind CSS classes, consult the official Tailwind CSS documentation for guidelines on class organization. Additionally, consider using the Tailwind Raw Reorder extension for VS Code to streamline the sorting process.

## Tailwind Class Reordering

When making changes to blade files that utilize Tailwind CSS classes, it's essential to maintain consistency and organization. Tailwind CSS classes should be ordered according to a predefined structure to enhance readability and maintain a clean codebase.

To determine how Tailwind CSS classes should be sorted, refer to the official Tailwind CSS documentation for guidelines on class ordering.

[Class Reordering](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)


## Pint Tests

Pint tests are an essential part of ensuring the quality and reliability of code changes in UnoPim. When making changes to the code, ensure that all Pint tests pass before submitting your pull request.Before submitting your changes, run the Pint tests locally to verify that all test cases pass. It is important to confirm that the modifications do not cause any Pint test failures or regressions.

* To run the Pint tests locally, execute the following command in your terminal:
```php
vendor/bin/pint
```

## Security Vulnerabilities

If you discover a security vulnerability within UnoPim, please notify us immediately by sending an email to Webkul at [support@webkul.in](mailto:support@webkul.in). We take security vulnerabilities seriously and will address them promptly.


## Coding Standards & Developer Guidelines

UnoPim follows **[PSR-4](https://www.php-fig.org/psr/psr-4/) autoloading** and **[PSR-2](https://www.php-fig.org/psr/psr-2/) / [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards**, aligned
with Laravel conventions.

It is opinionated on purpose to keep the codebase consistent and predictable.

If a pattern already exists in UnoPim, **reuse it** instead of introducing a new one.

## Core Principles

* Follow PSR standards and Laravel conventions
* Keep controllers thin
* Move logic to repositories, services, or helpers
* Prefer consistency over personal preference
* Follow existing UnoPim patterns

## Project / Package Structure

UnoPim is modular. Each feature lives in its own package:

```

packages/Webkul/<ModuleName>/

```

### Standard Package Layout

```

packages/Webkul/Example/src/
├── Config/
│   ├── acl.php
│   └── menu.php
├── Database/
│   ├── Migrations/
│   └── Seeders/
├── DataGrids/
│   └── ExampleDataGrid.php
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Routes/
├── Models/
├── Repositories/
├── Providers/
├── Resources/
│   ├── views/
│   └── lang/
└── Contracts/

```

## PHPDoc

Below is an example of a valid UnoPim doc block that follows the coding style:

```php

/**
 * Register a service with ExampleServiceProvider.
 */
protected function registerFacades(string|array $loader, string|null $concrete = null, bool $shared = false): void
{
  //
}
```

## Naming Conventions

* **Classes:** `StudlyCase`
* **Controllers:** `ProductController`
* **Repositories:** `ProductRepository`
* **Requests:** `ProductRequest`
* **Table Names**: Plural (`products`)
* **DataGrids:** `ProductDataGrid`
* **Models:** Singular (`Product`)
* **Methods / variables:** `camelCase`
* **Constants:** `SCREAMING_SNAKE_CASE`
* **Blade views:** `kebab-case.blade.php`

## Vue Component Naming

All Vue components must follow a naming convention.

### Rules

* Use **kebab-case**
* Prefix all components with `v-`
* One component per file

### Examples

```vue
<v-product-form />
<v-category-tree />
<v-media-uploader />
```

## Route → Controller → View → Translation Linking

Linking between these layers keeps the code easily manageable and reviewable.

| Layer       | Convention                                |
| ----------- | ----------------------------------------- |
| Route name  | `admin.catalog.products.index`            |
| Controller  | `ProductController@index`                 |
| View        | `catalog/products/index.blade.php`        |
| Translation | `admin::app.catalog.products.index.title` |

If one changes, **all others must be updated**.

## Controllers

* Handle HTTP concerns only
* No business logic
* Use resource controllers for CRUD
* Delegate logic to repositories or services/helpers
* Use Form Request classes for validation

## Models & Repositories

### Models

* Contain relationships, scopes, accessors, mutators
* Do not contain business logic

### Repositories

* Handle queries and persistence logic
* Extend `Webkul\Core\Eloquent\Repository`
* Inject into controllers or services

## Raw Queries (Mandatory Rule)

All raw SQL queries **must** use the table prefix helper.

Correct:

```php
$tablePrefix = DB::getTablePrefix();
DB::raw("SELECT * FROM {$tablePrefix}products");
```

Incorrect:

```php
DB::raw("SELECT * FROM products");
```

## DataGrids

* Handle queries, filters, and actions
* One DataGrid per resource

## Views & Blade Templates

* One folder per resource
* Use `index`, `create`, `edit`
* No hardcoded strings
* Always use translations

## Translations

* Stored in `Resources/lang/{locale}/app.php`
* Use nested keys
* Always use `trans()` or `@lang()`

## ACL (Access Control)

* Defined in `Config/acl.php`
* Keys must mirror route names
* Each route must have an ACL entry
* Separate permissions for CRUD actions

## Menu Configuration

* Defined in `Config/menu.php`
* Menu keys must match ACL keys
* Routes must exist
* Sorting controls menu order

## Validation

* Use Form Request classes
* Never validate inline in controllers
* Keep rules reusable

## Events & Extensibility

* Fire events before and after create/update/delete
* Enables plugin-based extensions
* Keeps core logic clean

## Testing

Tests are mandatory for all new features and bug fixes.

Run tests:

```bash
vendor/bin/pest
```

Run tests in parallel (recommended):

```bash
vendor/bin/pest --parallel
```

## Pint & Code Style

Run Pint before opening a pull request:

```bash
vendor/bin/pint
```

All formatting issues must be fixed.

## Common Pitfalls

Avoid these common mistakes:

* Business logic inside controllers
* Skipping repositories and querying directly
* Hardcoded UI strings
* Missing ACL or menu entries
* Raw SQL without table prefix
* Broken route/controller/view consistency
* Missing tests

## PR Review Checklist

Before submitting a pull request:

* Routes follow naming conventions
* Controller is thin
* Repository or service used for logic
* ACL entry added
* Menu entry added (if UI change)
* Translations added
* No hardcoded strings
* Raw queries use table prefix
* Tests added and passing
* `vendor/bin/pint` executed
* `vendor/bin/pest --parallel` executed
* No breaking changes or regressions

## Git & Contribution Conventions

### Branch Naming

Format:

```
<type>/<short-description>
```

Examples:

* `feature/add-product-media`
* `bugfix/fix-product-filter`
* `hotfix/fix-login-error`
* `refactor/cleanup-review-processor`
* `docs/update-installation-guide`
* `test/add-review-tests`
* `chore/update-dependencies`

Rules:

* One task per branch
* Do not mix concerns
* Delete branch after merge


## Commit Messages

Follow [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) format:

```
<type>: short description
```

Examples:

```text
feat: add product media upload support
fix: resolve issue with product filter
refactor: move logic to repository
docs: update docker setup guide
test: add tests for review attachments
style: fix formatting using pint
chore: update composer.lock
perf: optimize product listing query
ci: update github actions workflow
revert: revert "feat: add product export"
```

Keep commits small and focused.


## Summary

UnoPim expects more than PSR compliance.

It expects:

* Consistent structure
* Predictable patterns
* Clean separation of concerns
* Proper ACL, menu, and translations
* Tests for every change
