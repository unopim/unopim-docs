# Events

## Introduction

Event Listeners in UnoPim are a way to implement the observer pattern, where listeners respond to events that occur in the application. Events can be thought of as announcements made by the application, and listeners are the actions taken in response to those announcements. All event classes in UnoPim are stored in the `Providers` folder, and the listeners are stored in the `Listeners` folder.

In UnoPim, events and listeners are organized in a clear and structured manner:

- Events are typically stored in the Events folder.
- Listeners are stored in the Listeners folder.

This organization makes it easy to manage and locate the event-driven components of your application.

To learn in detail about events, you can visit the Laravel documentation [here](https://laravel.com/docs/13.x/events).

## Creating an Event Class

### Manually Registering Events

In UnoPim, you register events manually in the `boot` method of your `EventServiceProvider.php` file. Here is an example of how to register events:

```php
/**
 * Register any other events for your application.
 *
 * @return void
 */
public function boot()
{
    //...

    Event::listen('event.name', 'path-upto-listener@function');
}
```

In this example, `event.name` is the name of the event, and `path-upto-listener@function` is the listener method that will handle the event.

### Manually Registering Listeners

When registering events, you specify the listener function to be executed when an event is triggered. Here is an example of how to register a listener:

```php
class EventServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //...

        Event::listen('catalog.attribute.create.after', 'App\Listeners\AttributeListener@handleAttributeCreated');
    }
}
```

## Specifying Events

In UnoPim, events are typically fired before and after the execution of CRUD operations. This allows listeners to perform additional actions, such as logging, notifications, or data manipulation, at specific points in the lifecycle of an operation.

For example, you might have events fired during product creation, updating, or deletion. Here’s an example of firing events before and after saving a product:

```php
namespace Webkul\Product\Repositories;

use Webkul\Product\Contracts\Product;

class ProductRepository extends Repository
{
    public function create(array $data)
    {
        Event::dispatch('catalog.product.create.before', $data);

        $product = parent::create($data);

        Event::dispatch('catalog.product.create.after', $product);

        return $product;
    }
}
```

## Events Fired in UnoPim

UnoPim fires events throughout its operations, letting you hook into specific points in the application's lifecycle to customize behavior or add functionality. The tables below group every event by the subsystem that fires it.

::: tip Event names are matched literally
`Event::listen()` matches the string exactly. A typo in an event name fails silently — the listener is registered, but nothing ever calls it. Copy the names from this page rather than guessing at the pattern, because a few of them do not follow it (`catalog.attributegroup.update.after` and `data_transfer.export.completed` in particular).
:::

### Catalog — Products

| Event name | Fired |
|---|---|
| `catalog.product.create.before` | Before a product is created. |
| `catalog.product.create.after` | After a product is created. |
| `catalog.product.update.before` | Before a product is updated. |
| `catalog.product.update.after` | After a product is updated. |
| `catalog.product.delete.before` | Before a product is deleted. |
| `catalog.product.delete.after` | After a product is deleted. |
| `catalog.product.bulk.edit.after` | <Badge type="tip" text="3.0" /> After a bulk edit is applied to a selection of products. |
| `products.datagrid.sync` | Fired to sync the product datagrid. |

### Catalog — Attributes

| Event name | Fired |
|---|---|
| `catalog.attribute.create.before` | Before an attribute is created. |
| `catalog.attribute.create.after` | After an attribute is created. |
| `catalog.attribute.update.before` | Before an attribute is updated. |
| `catalog.attribute.update.after` | After an attribute is updated. |
| `catalog.attribute.delete.before` | Before an attribute is deleted. |
| `catalog.attribute.delete.after` | After an attribute is deleted. |
| `catalog.attribute.option.create.before` | Before an attribute option is created. |
| `catalog.attribute.option.create.after` | After an attribute option is created. |
| `catalog.attribute.option.update.before` | Before an attribute option is updated. |
| `catalog.attribute.option.update.after` | After an attribute option is updated. |
| `catalog.attribute.option.delete.before` | Before an attribute option is deleted. |
| `catalog.attribute.option.delete.after` | After an attribute option is deleted. |

### Catalog — Attribute Groups

| Event name | Fired |
|---|---|
| `catalog.attribute.group.create.before` | Before an attribute group is created. |
| `catalog.attribute.group.create.after` | After an attribute group is created. |
| `catalog.attribute.group.update.before` | Before an attribute group is updated. |
| `catalog.attributegroup.update.after` | After an attribute group is updated. **Note the missing dot** — this name is inconsistent with the others in the group and is kept for backward compatibility. |
| `catalog.attribute.group.delete.before` | Before an attribute group is deleted. |
| `catalog.attribute.group.delete.after` | After an attribute group is deleted. |

### Catalog — Attribute Families

| Event name | Fired |
|---|---|
| `catalog.attribute_family.create.before` | Before an attribute family is created. |
| `catalog.attribute_family.create.after` | After an attribute family is created. |
| `catalog.attribute_family.update.before` | Before an attribute family is updated. |
| `catalog.attribute_family.update.after` | After an attribute family is updated. |
| `catalog.attribute_family.delete.before` | Before an attribute family is deleted. |
| `catalog.attribute_family.delete.after` | After an attribute family is deleted. |
| `catalog.attribute_family.attributes.changed` | <Badge type="tip" text="3.0" /> After a family's attribute set changes. Downstream completeness recalculation hangs off this. |
| `catalog.attribute_family.copied` | <Badge type="tip" text="3.0" /> After a family is duplicated from an existing one. |

### Catalog — Categories and Category Fields

| Event name | Fired |
|---|---|
| `catalog.category.create.before` | Before a category is created. |
| `catalog.category.create.after` | After a category is created. |
| `catalog.category.update.before` | Before a category is updated. |
| `catalog.category.update.after` | After a category is updated. |
| `catalog.category.delete.before` | Before a category is deleted. |
| `catalog.category.delete.after` | After a category is deleted. |
| `catalog.category_field.create.before` | Before a category field is created. |
| `catalog.category_field.create.after` | After a category field is created. |
| `catalog.category_field.update.before` | Before a category field is updated. |
| `catalog.category_field.update.after` | After a category field is updated. |
| `catalog.category_field.delete.before` | Before a category field is deleted. |
| `catalog.category_field.delete.after` | After a category field is deleted. |

### Catalog — Association Types

<Badge type="tip" text="3.0" /> Configurable association types are new in v3.0. See [Configurable Associations](../packages/configurable-associations).

| Event name | Fired |
|---|---|
| `catalog.association_type.create.before` | Before an association type is created. |
| `catalog.association_type.create.after` | After an association type is created. |
| `catalog.association_type.update.before` | Before an association type is updated. |
| `catalog.association_type.update.after` | After an association type is updated. |
| `catalog.association_type.delete.before` | Before an association type is deleted. |
| `catalog.association_type.delete.after` | After an association type is deleted. |
| `product_association.sync.before` | Before a product's associations are synchronized. |
| `product_association.sync.after` | After a product's associations are synchronized. |

### Catalog — Passport Templates

<Badge type="tip" text="3.0" /> See [Digital Product Passport](digital-product-passport).

| Event name | Fired |
|---|---|
| `catalog.passport_template.create.before` | Before a passport template is created. |
| `catalog.passport_template.create.after` | After a passport template is created. |
| `catalog.passport_template.update.before` | Before a passport template is updated. |
| `catalog.passport_template.update.after` | After a passport template is updated. |
| `catalog.passport_template.delete.before` | Before a passport template is deleted. |
| `catalog.passport_template.delete.after` | After a passport template is deleted. |

### Core — Channels, Locales, Currencies, Configuration

| Event name | Fired |
|---|---|
| `core.channel.create.before` | Before a channel is created. |
| `core.channel.create.after` | After a channel is created. |
| `core.channel.update.before` | Before a channel is updated. |
| `core.channel.update.after` | After a channel is updated. |
| `core.channel.delete.before` | Before a channel is deleted. |
| `core.channel.delete.after` | After a channel is deleted. |
| `core.locale.create.before` | Before a locale is created. |
| `core.locale.create.after` | After a locale is created. |
| `core.locale.update.before` | Before a locale is updated. |
| `core.locale.update.after` | After a locale is updated. |
| `core.locale.delete.before` | Before a locale is deleted. |
| `core.locale.delete.after` | After a locale is deleted. |
| `core.locale.activation.synced` | <Badge type="tip" text="3.0" /> After the set of active locales changes (activation or deactivation). |
| `core.currency.create.before` | Before a currency is created. |
| `core.currency.create.after` | After a currency is created. |
| `core.currency.update.before` | Before a currency is updated. |
| `core.currency.update.after` | After a currency is updated. |
| `core.currency.delete.before` | Before a currency is deleted. |
| `core.currency.delete.after` | After a currency is deleted. |
| `core.currency.activation.synced` | <Badge type="tip" text="3.0" /> After the set of active currencies changes. |
| `core.configuration.save.before` | Before configuration is saved. |
| `core.configuration.save.after` | After configuration is saved. |

### Core — Model Proxy Sync

These fire when a proxied core model's dataset is rebuilt. They are primarily an internal cache-invalidation hook, but you may listen to them if a package derives its own state from these tables.

| Event name | Fired |
|---|---|
| `core.model.proxy.sync.locales` | After the locales dataset is synchronized. |
| `core.model.proxy.sync.currencies` | After the currencies dataset is synchronized. |
| `core.model.proxy.sync.variantStructure` | <Badge type="tip" text="3.0" /> After a family's variant structure is synchronized. |
| `core.model.proxy.sync.AttributeFamilyGroupMapping` | After the family-to-group mapping is synchronized. |

### Data Transfer — Exports

| Event name | Fired |
|---|---|
| `data_transfer.exports.create.before` | Before an export profile is created. |
| `data_transfer.exports.create.after` | After an export profile is created. |
| `data_transfer.exports.update.before` | Before an export profile is updated. |
| `data_transfer.exports.update.after` | After an export profile is updated. |
| `data_transfer.exports.create.validate.before` | <Badge type="tip" text="3.0" /> Before an export profile's filters are validated on create. |
| `data_transfer.exports.create.validate.after` | <Badge type="tip" text="3.0" /> After an export profile's filters are validated on create. |
| `data_transfer.exports.update.validate.before` | <Badge type="tip" text="3.0" /> Before an export profile's filters are validated on update. |
| `data_transfer.exports.update.validate.after` | <Badge type="tip" text="3.0" /> After an export profile's filters are validated on update. |
| `data_transfer.exports.export.now.before` | Before an export is triggered from the profile screen. |
| `data_transfer.exports.started` | When an export run starts. |
| `data_transfer.exports.batch.export.before` | Before each export batch is processed. |
| `data_transfer.exports.batch.export.after` | After each export batch is processed. |
| `data_transfer.export.completed` | When an export run completes. **Note the singular `export`** — this name is inconsistent with its siblings and is kept for backward compatibility. |
| `data_transfer.exports.paused` | <Badge type="tip" text="3.0" /> When a running export is paused from the tracker. |
| `data_transfer.exports.resumed` | <Badge type="tip" text="3.0" /> When a paused export is resumed. |
| `data_transfer.exports.cancelled` | <Badge type="tip" text="3.0" /> When an export is cancelled. |

### Data Transfer — Imports

| Event name | Fired |
|---|---|
| `data_transfer.imports.create.before` | Before an import profile is created. |
| `data_transfer.imports.create.after` | After an import profile is created. |
| `data_transfer.imports.update.before` | Before an import profile is updated. |
| `data_transfer.imports.update.after` | After an import profile is updated. |
| `data_transfer.imports.import.now.before` | <Badge type="tip" text="3.0" /> Before an import is triggered from the profile screen. |
| `data_transfer.imports.validate.before` | Before the uploaded file is validated. |
| `data_transfer.imports.validate.after` | After the uploaded file is validated. |
| `data_transfer.import.validate.state_failed` | <Badge type="tip" text="3.0" /> When validation fails and the job moves to the failed state. |
| `data_transfer.imports.started` | When an import run starts. |
| `data_transfer.imports.batch.import.before` | Before each import batch is processed. |
| `data_transfer.imports.batch.import.after` | After each import batch is processed. |
| `data_transfer.imports.batch.product.save.before` | <Badge type="tip" text="3.0" /> Before a product row is written during an import batch. |
| `data_transfer.imports.batch.product.save.after` | <Badge type="tip" text="3.0" /> After a product row is written during an import batch. |
| `data_transfer.imports.batch.product.created.after` | <Badge type="tip" text="3.0" /> After a product row is created (as opposed to updated) during an import batch. |
| `data_transfer.imports.batch.product.updated.after` | <Badge type="tip" text="3.0" /> After an existing product row is updated during an import batch. |
| `data_transfer.imports.linking` | When the import enters the linking stage. |
| `data_transfer.imports.indexing` | When the import enters the indexing stage. |
| `data_transfer.imports.completed` | When an import run completes. |
| `data_transfer.imports.paused` | <Badge type="tip" text="3.0" /> When a running import is paused from the tracker. |
| `data_transfer.imports.resumed` | <Badge type="tip" text="3.0" /> When a paused import is resumed. |
| `data_transfer.imports.cancelled` | <Badge type="tip" text="3.0" /> When an import is cancelled. |

### Users, Roles, and API Integrations

| Event name | Fired |
|---|---|
| `user.admin.create.before` | Before an admin user is created. |
| `user.admin.create.after` | After an admin user is created. |
| `user.admin.update.before` | Before an admin user is updated. |
| `user.admin.update.after` | After an admin user is updated. |
| `user.admin.delete.before` | Before an admin user is deleted. |
| `user.admin.delete.after` | After an admin user is deleted. |
| `admin.password.update.after` | After an admin password is updated. |
| `user.role.create.before` | Before a role is created. |
| `user.role.create.after` | After a role is created. |
| `user.role.update.before` | Before a role is updated. |
| `user.role.update.after` | After a role is updated. |
| `user.role.delete.before` | Before a role is deleted. |
| `user.role.delete.after` | After a role is deleted. |
| `user.api_integration.create.before` | Before an API integration is created. |
| `user.api_integration.create.after` | After an API integration is created. |
| `user.api_integration.update.before` | Before an API integration is updated. |
| `user.api_integration.update.after` | After an API integration is updated. |
| `user.api_key.delete.before` | Before an API key is deleted. |
| `user.api_key.delete.after` | After an API key is deleted. |

### Authentication (Microsoft SSO)

<Badge type="tip" text="3.0" /> See [Microsoft SSO](microsoft-sso).

| Event name | Fired |
|---|---|
| `unopim.admin.sso.login.before` | Before an SSO login is completed. |
| `unopim.admin.sso.identity.resolved` | After the external identity is resolved to a local admin user. Useful for just-in-time provisioning or role mapping. |
| `unopim.admin.sso.login.after` | After an SSO login is completed. |

### Installation

| Event name | Fired |
|---|---|
| `unopim.installed` | <Badge type="tip" text="3.0" /> After `unopim:install` finishes. Use it to seed package-specific data on a fresh installation. |

::: tip View render events are listed separately
The `unopim.admin.*` names you see in Blade templates (for example `unopim.admin.catalog.products.list.before`) are **view render events** fired through the `view_render_event()` helper, not application events. They are documented in [Render Event](render-event).
:::

## Listening to Existing Events

UnoPim uses events and listeners to implement the observer pattern, allowing you to respond to various actions and events within the application. You can listen to specific events and execute custom code when those events are triggered.

### Registering a Listener

Open the `EventServiceProvider.php` file located in the `Providers` directory of your UnoPim application. This file is where you register event listeners.

Inside the `boot()` method of `EventServiceProvider.php`, use the `Event::listen` method to register your listener. This method takes the event name and a callback function or a class method that will handle the event.

```php
Event::listen('catalog.product.create.after', 'App\Listeners\ProductListener@createNotification');
```

By registering the listener, you have associated the **`createNotification`** function with the **`catalog.product.create.after`** event. Whenever this event is triggered, the specified function will be executed.

You can modify the listener function according to your requirements to perform the desired operation.
