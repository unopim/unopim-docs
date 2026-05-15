# Events



## Introduction

Event Listeners in UnoPim are a way to implement the observer pattern, where listeners respond to events that occur in the application. Events can be thought of as announcements made by the application, and listeners are the actions taken in response to those announcements. All event classes in UnoPim are stored in the `Providers` folder, and the listeners are stored in the `Listeners` folder.

In UnoPim, events and listeners are organized in a clear and structured manner:

- Events are typically stored in the Events folder.
- Listeners are stored in the Listeners folder.

This organization makes it easy to manage and locate the event-driven components of your application.

To learn in detail about Controllers, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/events).

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

        Event::listen('catalog.attribute.create.after', 'Webkul\Catalog\Listeners\Attribute@handleAttributeCreated');
    }
}
```

## Specifying Events

In UnoPim, events are typically fired before and after the execution of CRUD operations. This allows listeners to perform additional actions, such as logging, notifications, or data manipulation, at specific points in the lifecycle of an operation.

For example, you might have events fired during product creation, updating, or deletion. Here’s an example of firing events before and after saving a product:

```php
namespace Webkul\Catalog\Repositories;

use Webkul\Catalog\Contracts\Product;

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

In UnoPim, there are several events fired throughout its operations, allowing developers to hook into specific points in the application's lifecycle to customize behavior or add functionality. Here's a list of events that are fired in UnoPim, which you can listen to and handle as needed by creating event listeners:

| Events name                                 | Functionality                                  |
|---------------------------------------------|-----------------------------------------------|
| admin.password.update.after                 | This event will be fired after admin password gets updated. |
| catalog.attribute.create.before             | This event is fired before an attribute is created. |
| catalog.attribute.create.after              | This event is fired after an attribute is created.  |
| catalog.attribute.delete.before             | This event is fired before an attribute is deleted. |
| catalog.attribute.delete.after              | This event is fired after an attribute is deleted.  |
| catalog.attribute.update.before             | This event is fired before an attribute is updated. |
| catalog.attribute.update.after              | This event is fired after an attribute is updated.  |
| catalog.attribute_family.create.before      | This event is fired before an attribute family is created. |
| catalog.attribute_family.create.after       | This event is fired after an attribute family is created.  |
| catalog.attribute_family.delete.before      | This event is fired before an attribute family is deleted. |
| catalog.attribute_family.delete.after       | This event is fired after an attribute family is deleted.  |
| catalog.attribute_family.update.before      | This event is fired before an attribute family is updated. |
| catalog.attribute_family.update.after       | This event is fired after an attribute family is updated.  |
| catalog.attribute.group.create.before       | This event is fired before an attribute group is created. |
| catalog.attribute.group.create.after        | This event is fired after an attribute group is created.  |
| catalog.attribute.group.delete.before       | This event is fired before an attribute group is deleted. |
| catalog.attribute.group.delete.after        | This event is fired after an attribute group is deleted.  |
| catalog.attribute.group.update.before       | This event is fired before an attribute group is updated. |
| catalog.attribute.group.update.after        | This event is fired after an attribute group is updated.  |
| catalog.categories.mass-update.before       | This event is fired before a bulk category update. |
| catalog.categories.mass-update.after        | This event is fired after a bulk category update.  |
| catalog.category.create.before              | This event is fired before a category is created. |
| catalog.category.create.after               | This event is fired after a category is created.  |
| catalog.category.delete.before              | This event is fired before a category is deleted. |
| catalog.category.delete.after               | This event is fired after a category is deleted.  |
| catalog.category.update.before              | This event is fired before a category is updated. |
| catalog.category.update.after               | This event is fired after a category is updated.  |
| catalog.category_field.create.before        | This event is fired before a category_field is created. |
| catalog.category_field.create.after         | This event is fired after a category_field is created.  |
| catalog.category_field.delete.before        | This event is fired before a category_field is deleted. |
| catalog.category_field.delete.after         | This event is fired after a category_field is deleted.  |
| catalog.category_field.update.before        | This event is fired before a category_field is updated. |
| catalog.category_field.update.after         | This event is fired after a category_field is updated.  |
| catalog.product.create.before               | This event is fired before a product is created.  |
| catalog.product.create.after                | This event is fired after a product is created.   |
| catalog.product.delete.before               | This event is fired before a product is deleted.  |
| catalog.product.delete.after                | This event is fired after a product is deleted.   |
| catalog.product.update.before               | This event is fired before a product is updated.  |
| catalog.product.update.after                | This event is fired after a product is updated.   |
| core.channel.create.before                  | This event will be fired before a channel gets created. |
| core.channel.create.after                   | This event will be fired after a channel gets created. |
| core.channel.delete.before                  | This event will be fired before a channel gets deleted. |
| core.channel.delete.after                   | This event will be fired after a channel gets deleted. |
| core.channel.update.before                  | This event will be fired before a channel gets updated. |
| core.channel.update.after                   | This event will be fired after a channel gets updated. |
| core.configuration.save.before              | This event will be fired before configuration save. |
| core.configuration.save.after               | This event will be fired after configuration save. |
| core.currency.create.before                 | This event will be fired before currency gets created. |
| core.currency.create.after                  | This event will be fired after currency gets created. |
| core.currency.delete.before                 | This event will be fired before currency gets deleted. |
| core.currency.delete.after                  | This event will be fired after currency gets deleted. |
| core.currency.update.before                 | This event will be fired before currency gets updated. |
| core.currency.update.after                  | This event will be fired after currency gets updated. |
| core.locale.create.before                   | This event will be fired before a locale gets created. |
| core.locale.create.after                    | This event will be fired after a locale gets created. |
| core.locale.delete.before                   | This event will be fired before a locale gets deleted. |
| core.locale.delete.after                    | This event will be fired after a locale gets deleted. |
| core.locale.update.before                   | This event will be fired before a locale gets updated. |
| core.locale.update.after                    | This event will be fired after a locale gets updated. |
| data_transfer.exports.batch.export.after    | This event will be fired after batch exports data_transfer. |
| data_transfer.exports.batch.export.before   | This event will be fired before batch exports data_transfer. |
| data_transfer.exports.completed             | This event will be fired if exports completed. |
| data_transfer.exports.create.after          | This event will be fired after exports data_transfer is created. |
| data_transfer.exports.create.before         | This event will be fired before exports data_transfer is created. |
| data_transfer.exports.export.now.before     | This event will be fired before export data_transfer is updated. |
| data_transfer.exports.started               | This event will be fired if exports started. |
| data_transfer.exports.update.after          | This event will be fired after export data_transfer is updated. |
| data_transfer.exports.update.before         | This event will be fired before export data_transfer is updated. |
| data_transfer.imports.batch.export.after    | This event will be fired after batch imports data_transfer. |
| data_transfer.imports.batch.export.before   | This event will be fired before batch imports data_transfer. |
| data_transfer.imports.completed             | This event will be fired if imports completed. |
| data_transfer.imports.create.after          | This event will be fired after imports data_transfer is created. |
| data_transfer.imports.create.before         | This event will be fired before imports data_transfer is created. |
| data_transfer.imports.indexing              | This event will be fired if imports indexing. |
| data_transfer.imports.linking               | This event will be fired if imports linking. |
| data_transfer.imports.started               | This event will be fired if imports started. |
| data_transfer.imports.update.after          | This event will be fired after imports data_transfer is updated. |
| data_transfer.imports.update.before         | This event will be fired before imports data_transfer is updated. |
| data_transfer.imports.validate.after        | This event will be fired after imports validate. |
| data_transfer.imports.validate.before       | This event will be fired before imports validate. |
| products.datagrid.sync                      | This event is fired to sync the product datagrid. |
| user.admin.create.after                     | This event will be fired after admin gets created. |
| user.admin.create.before                    | This event will be fired before admin gets created. |
| user.admin.delete.after                     | This event will be fired after admin gets deleted. |
| user.admin.delete.before                    | This event will be fired before admin gets deleted. |
| user.admin.update.after                     | This event will be fired after admin gets updated. |
| user.admin.update.before                    | This event will be fired before admin gets updated. |
| user.api_integration.create.after           | This event will be fired after API integration is created. |
| user.api_integration.create.before          | This event will be fired before API integration is created. |
| user.api_integration.update.after           | This event will be fired after API integration is updated. |
| user.api_integration.update.before          | This event will be fired before API integration is updated. |
| user.api_key.delete.after                   | This event will be fired after API key is deleted. |
| user.api_key.delete.before                  | This event will be fired before API key is deleted. |
| user.role.create.after                      | This event will be fired after role gets created. |
| user.role.create.before                     | This event will be fired before role gets created. |
| user.role.delete.after                      | This event will be fired after role gets deleted. |
| user.role.delete.before                     | This event will be fired before role gets deleted. |
| user.role.update.after                      | This event will be fired after role gets updated. |
| user.role.update.before                     | This event will be fired before role gets updated. |

## Listening to Existing Events

UnoPim uses events and listeners to implement the observer pattern, allowing you to respond to various actions and events within the application. You can listen to specific events and execute custom code when those events are triggered.

### Registering a Listener

Open the `EventServiceProvider.php` file located in the `Providers` directory of your UnoPim application. This file is where you register event listeners.

Inside the `boot()` method of `EventServiceProvider.php`, use the `Event::listen` method to register your listener. This method takes the event name and a callback function or a class method that will handle the event.

```php
Event::listen('catalog.product.create.after', 'Webkul\Notification\Listeners\Product@createNotification');
```

By registering the listener, you have associated the **`createNotification`** function with the **`catalog.product.create.after`** event. Whenever this event is triggered, the specified function will be executed.

You can modify the listener function according to your requirements to perform the desired operation.
