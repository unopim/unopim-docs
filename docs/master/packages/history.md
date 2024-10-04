# History

[[TOC]]

## Add History to a Model

To add history tracking to a model, the model must implement both a `History Interface` and `History Trait`.

- **History Interface**: `Webkul\HistoryControl\Contracts\HistoryAuditable`
- **History Trait**: `Webkul\HistoryControl\Traits\HistoryTrait`

#### Example:

```php
use Webkul\HistoryControl\Contracts\HistoryAuditable;
use Webkul\HistoryControl\Traits\HistoryTrait;

class AttributeFamily extends Model implements HistoryAuditable
{
    use HistoryTrait;

    protected $historyTags = ['attributeFamily'];
}
```

## Defining History Tags

The `$historyTags` property provides a **unique identifier** for a model's history. This tag is primarily used for grouping and displaying the history of related records under a common name (e.g., the history of an entity and its translations). 

However, to link translations or other related models to their parent entity, we use the `getPrimaryModelIdForHistory()` function. This function helps identify which parent model the history of a related model (like a translation) belongs to.

### Example for Translations:

For an `AttributeFamilyTranslation` model, both the history tag and the function to link the history to the parent `AttributeFamily` model are defined as follows:

1. **History Tag**: Defines the history group label for `AttributeFamily`:

    ```php
    protected $historyTags = ['attributeFamily'];
    ```

    - This ensures the history entries related to this translation will be displayed under the **AttributeFamily** group in the history UI.

2. **Linking Translation to Parent Model**:

    The `getPrimaryModelIdForHistory()` function ensures the history of the `AttributeFamilyTranslation` model is linked to the parent `AttributeFamily` by returning the foreign key (`attribute_family_id`).

    ```php
    public function getPrimaryModelIdForHistory(): int
    {
        return $this->attribute_family_id;
    }
    ```

    - This function tells the system that the `AttributeFamilyTranslation` belongs to the `AttributeFamily` with the given `attribute_family_id`.

## Customizing History Fields

To control which fields should or should not be tracked in the history, you can use either `$auditExclude` or `$auditInclude`.

- **Exclude Specific Fields from History**:
  
  ```php
  protected $auditExclude = ['id', 'password'];
  ```

- **Include Only Specific Fields in History**:
  
  ```php
  protected $auditInclude = ['name'];
  ```

## Displaying History in the UI

To display the history of a model, use the following layout in the model's edit page:

```blade
<x-admin::layouts.with-history>
    <x-slot:entityName>
        attributeFamily
    </x-slot>
</x-admin::layouts.with-history>
```

The `entityName` slot defines the history tag to group the related records.

## Handling Translatable Fields

If the model contains translatable fields, you can specify a label for each field to be displayed in the history modal using `$historyTranslatableFields`.

#### Example:

```php
protected $historyTranslatableFields = [
    'name' => 'Name',
];
```

## Customizing History Display with Presenters

For fields with complex data (like JSON), you can customize how history is presented by implementing the `PresentableHistoryInterface`.

#### Example:

```php
use Webkul\HistoryControl\Interfaces\PresentableHistoryInterface;

class Product extends Model implements PresentableHistoryInterface
{
    public static function getPresenters(): array
    {
        return [
            'values' => ProductValuesPresenter::class,
        ];
    }
}
```

- **Creating a Custom Presenter**:

  To create a custom presenter, implement the `HistoryPresenterInterface` and define how the values should be represented:

  ```php
  use Webkul\HistoryControl\Interfaces\HistoryPresenterInterface;

  class ProductValuesPresenter implements HistoryPresenterInterface
  {
      public static function representValueForHistory($value)
      {
          // Format value as needed for the UI
          return json_encode($value, JSON_PRETTY_PRINT);
      }
  }
  ```

This custom presenter will format the `values` column data before displaying it in the history modal.

## Tracking History of Model Relations via Events

In cases where you need to track the history of a related model, you can use an event to dispatch the old and new values of the relation.

To dispatch the event, retrieve the old and new values of the relation and pass them along with the model.

#### Example:

```php
use Illuminate\Support\Facades\Event;

$oldCurrencies = $channel->currencies()->pluck('id')->toArray();
$newCurrencies = $request->get('currencies');

// Dispatch event with old and new values of the relation
Event::dispatch('core.model.proxy.sync.currencies', [
    'old_values' => $oldCurrencies, 
    'new_values' => $newCurrencies, 
    'model' => $channel
]);
```

In this example:
- `$oldCurrencies` holds the previous values for the `currencies` relation.
- `$newCurrencies` contains the updated values from the request.
- The `Event::dispatch()` method is used to trigger the event and pass both the old and new values, along with the related model (`$channel` in this case).

This can then be used to log and display the changes made to the relation, adding detailed history tracking.

Make sure you have listeners for the dispatched events to process and store this history, or you can use it in your custom logic to display the difference in the model’s history.
