# Testing Packages

## Introduction

UnoPim's test suite runs on **Pest 5 / PHPUnit 13**. Every core package ships its own `tests/` directory, and your extension packages should follow the same conventions so their suites run alongside core — same commands, same CI matrix, no special casing.

Testing this way pays off quickly: when you add a brands section to a connector, a handful of feature tests will confirm the routes are gated by ACL, validation rejects bad input, and records actually persist — on both database engines CI runs.

This page walks you through adding a suite to your package, running it, and knowing what to cover for each kind of feature.

## Adding Tests to Your Package

First, create `packages/YourVendor/YourPackage/tests/{Unit,Feature}/`. Next, add (or reuse) a `TestCase` — you should extend the closest core case, such as `AdminTestCase` for admin-route tests. Then bind it in `tests/Pest.php`:

```php
uses(YourPackageTestCase::class)->in('../packages/YourVendor/YourPackage/tests');
```

Finally, register the suite in `phpunit.xml` so CI picks it up. From there, a feature test looks like any other Pest test:

```php
use function Pest\Laravel\get;

it('lists brands for an authorised admin', function () {
    $this->loginAsAdmin();

    get(route('admin.brands.index'))->assertOk();
});
```

::: warning PHPUnit 13 metadata
Doc-comment annotations are ignored — use PHP attributes (`#[Test]`, `#[DataProvider]`, `#[Group]`), never `@test` / `@dataProvider`.
:::

## Running Tests

You may run the whole suite, a single test, or the parallel configuration CI uses:

```bash
vendor/bin/pest                                  # everything
vendor/bin/pest --filter=BrandControllerTest     # one test/class
vendor/bin/pest --parallel --processes=3         # how CI runs it
```

Parallel runs use per-process database clones. If a run aborts and later runs fail en masse with "property on null" errors, the clones are stale — drop the `*_test_N` databases and rerun.

Test Impact Analysis is enabled (`pest()->tia()` in `tests/Pest.php`), so unaffected tests are automatically skipped on incremental runs.

## What to Test

What you should cover depends on what you built. For an admin CRUD section, test the route plus its ACL (a user without the permission gets a 403 or redirect), validation errors, happy-path persistence, and the events fired. For REST endpoints, cover auth (401 without a token), API-ACL scope (403), payload validation (422), and the response shape.

If you built an import or export job, round-trip a sample file, exercise error rows, and confirm re-runs are idempotent. Search and filter features must cover **both** branches — `elasticsearch.enabled` true and false — with an identical result shape. And anything touching SQL must be green on MySQL *and* PostgreSQL: watch `GROUP BY` strictness, boolean comparisons, and JSON paths.

## Reference Suites

When in doubt, copy from a suite that already does what you need:

- `packages/Webkul/Resource/tests` — a complete minimal package suite (fixtures + feature tests for the CRUD kit)
- `packages/Webkul/Product/tests/Feature/ProductAssociation*Test.php` — repository, sync, and migration coverage patterns
- `packages/Webkul/AdminApi/tests/Feature` — REST endpoint patterns including auth and scope

## How the Suite Is Organized

Suites are declared per package in the application's `phpunit.xml` (split `Unit`/`Feature` where both exist). A second config, `phpunit.pgsql.xml`, drives the PostgreSQL CI matrix — the same tests must pass on **MySQL and PostgreSQL**.

Test cases bind per package in `tests/Pest.php`:

```php
uses(ProductTestCase::class)->in('../packages/Webkul/Product/tests');
uses(AdminTestCase::class)->in('../packages/Webkul/Admin/tests');
uses(ApiTestCase::class)->in('../packages/Webkul/AdminApi/tests');
```

Available base cases include `CoreTestCase`, `AdminTestCase`, `ApiTestCase`, `UserTestCase`, `DataGridTestCase`, `AttributeTestCase`, `CategoryTestCase`, `CompletenessTestCase`, `MeasurementTestCase`, `ProductTestCase`, `ProductPassportTestCase`, `PublicationTestCase`, and `ResourceTestCase`. Each boots the application with a sync queue, in-memory cache, and array mail.
