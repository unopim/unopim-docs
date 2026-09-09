# Resource CRUD Kit

## Introduction

The `Webkul\Resource` package is a low-code scaffold for package developers. You describe a resource once — a repository, a DataGrid, a FormRequest, and a field schema — and the kit gives you a complete admin CRUD section: a listing with grid, create and edit forms, AJAX saves, and flash messages, all built from the standard Admin components.

You would reach for the kit whenever a package needs a straightforward "manage these records" screen and you don't want to hand-write six routes, two Blade views, and a controller full of boilerplate. For example, a connector that stores a list of brands can ship a full brands section — grid, permission-gated Create button, translatable fields — in a handful of small classes.

Everything the kit renders is composed from the existing Admin components, so your section looks and behaves like the rest of the panel automatically.

## Defining a Resource

A resource is any class implementing the `ResourceInterface` contract:

```php
namespace Webkul\Resource\Contracts;

interface ResourceInterface
{
    public function repository(): string;   // FQCN of the repository
    public function dataGrid(): string;     // FQCN of the DataGrid
    public function request(): string;      // FQCN of the FormRequest
    public function routePrefix(): string;  // e.g. "admin.brands"
    public function aclPrefix(): string;    // bouncer permission prefix
    public function schema(): FieldSchema;
    public function toViewModel(): array;
}
```

In practice, you should extend `Webkul\Resource\Support\AbstractResource` — it implements `toViewModel()` for you, exposing the route prefix, ACL prefix, schema array, and the index/create/store/update URLs the Blade views consume.

## Defining the Field Schema

The schema describes your form. Each field declares its type, rules, and options fluently:

```php
use Webkul\Resource\Support\Field;
use Webkul\Resource\Support\FieldSchema;

public function schema(): FieldSchema
{
    return FieldSchema::make([
        Field::text('name')->required()->rules('required|max:100'),
        Field::select('status')->options([
            ['id' => 1, 'label' => 'Active'],
            ['id' => 0, 'label' => 'Inactive'],
        ])->default(1),
        Field::textarea('description')->translatable(),
    ]);
}
```

`Field` supports `text`, `select`, and `textarea` factories with fluent `required()`, `rules()`, `options()`, `default()`, `label()`, and `translatable()` modifiers. When you need the validation rules as a whole, `FieldSchema::rules()` collects them keyed by field name.

## Creating the Controller

Your controller extends `AbstractResourceController` and implements exactly one method — telling the kit which resource it serves:

```php
use Webkul\Resource\Http\Controllers\AbstractResourceController;
use Webkul\Resource\Support\ResourceRegistry;

class BrandController extends AbstractResourceController
{
    protected function resource(): ResourceInterface
    {
        return app(ResourceRegistry::class)->get('brands');
    }
}
```

You inherit `index` (view, or DataGrid JSON on AJAX), `create`, `edit`, `store`, `update`, and `destroy`. The store and update actions resolve your FormRequest (resolution itself validates, so invalid input responds with a 422), persist through your repository with `$request->only(<schema field names>)`, flash localized messages, and return `{data: {redirect_url}, message}` JSON in the standard Admin shape.

::: tip
The controller persists `only()` the schema's field names rather than `validated()` — a schema field without validation rules would otherwise be silently dropped.
:::

## Registering the Resource and Routes

Finally, register the resource and its routes in your package's service provider:

```php
// In your package service provider's boot():
use Webkul\Resource\Routing\Resource;
use Webkul\Resource\Support\ResourceRegistry;

app(ResourceRegistry::class)->register('brands', BrandResource::class);

Route::middleware('web')->group(
    fn () => Resource::routes('brands', BrandController::class)
);
```

`Resource::routes()` registers the six routes under the `admin` middleware (index, create, store, edit, update, destroy — names `admin.{name}.*`). Add ACL entries for `<aclPrefix>` and `<aclPrefix>.create` and friends, plus a menu entry, and you have a full section.

## Views

The kit ships two Blade views composed entirely from existing Admin components. `resource::index` renders an `x-admin::datagrid` with a permission-gated Create button, while `resource::edit` renders an `x-admin::form ajax` with `x-admin::form.control-group.*` controls for each schema field.

If you need to inject extra markup, render events fire around both screens (`unopim.resource.index.list.before/after`, `unopim.resource.edit.*`) — so you rarely need to override the views themselves.

## A Worked Example

The package's own test fixtures are the canonical reference implementation — a complete resource in seven small files:

```
packages/Webkul/Resource/tests/Fixtures/
├── TestResource.php        # the ResourceInterface implementation
├── TestController.php      # 5-line controller
├── TestRepository.php
├── TestDataGrid.php
├── TestForm.php
├── TestModel.php
└── TestServiceProvider.php # registry + route wiring
```
