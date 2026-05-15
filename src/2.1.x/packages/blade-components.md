# Blade Components



## Introduction

To ensure optimal user experience in **UnoPim** we have created several separate Blade components for the Admin packages. Now in **`UnoPim`** we have also merged the vue.js code inside the blade component to improve application performance.

Additionally, To learn in detail about blade components, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/blade#introduction).

- Here are the list of Blade component that is available in **`UnoPim`**.

## Component

components are reusable Blade components used to build the Admin.

### Accordion

UnoPim provides a collapsible accordion UI element, allowing users to toggle the visibility of content sections. It is commonly used for organizing and presenting information in a compact and intuitive manner.

| Props           | Type    | Default | Description                                                 |
| --------------- | ------- | ------- | ------------------------------------------------------------|
| **`is-active`** | Boolean | `false` | Determines the initial state of the accordion. When set to `true`, the accordion section will be expanded by default; otherwise, it will be collapsed. |

| Slots           | Description                                                      |
  | ------------- | ------------------------------------------------------------------------ |
  | **`header`**  | Used to customize the header section of the accordion. |
  | **`content`** | Used to customize the content section of the accordion. |

You can customize the appearance of the accordion `header` and `content` by passing additional CSS classes to the header and content slots, respectively.

Let's assume you want to use the **`accordion`** component, you can call it like this:

```html
<!-- Accordion -->
<x-admin::accordion
    title="Accordion"
    class="px-5"
>
    <x-slot:header class="bg-gray-200">
        Accordion Header
    </x-slot>

    <x-slot:content class="bg-green-200">
        Accordion Content
    </x-slot>
</x-admin::accordion>
```

### Select

The `Select` component in UnoPim provides a flexible Select element with support for various features like seaching options

  | Prop            | Type          | Default Value | Description                                                            |
| ---------------   | ------------- | ------------- | ---------------------------------------------------------------------- |
| **`options`**     | `Json`        | None          | Take options value in json                                    |
| **`value`**       | `String`     |  None      | Set the default value if none is selected                      |
| **`track-by`**    | `String`     | None       | Options value by 'id'.                      |
| **`label-by`**    | `String`     | None       | Display options by 'label'.                      |

Let's assume you want to use the **`Select`** component. You can call it like this:

1. First method to make select field

```html
<!-- Select Component -->
<x-admin::form.control-group>
  <!-- Label for the Select Element -->
  <x-admin::form.control-group.label class="required">
      @lang('admin::app.catalog.category_fields.create.set-section')
  </x-admin::form.control-group.label>

  @php
      // Define the supported types for the Select options
      $supportedTypes = ['left', 'right'];

      // Initialize an empty array for options
      $options = [];

      // Loop through supported types and build options array
      foreach($supportedTypes as $type) {
          $options[] = [
              'id'    => $type,  // Option ID
              'label' => trans('admin::app.catalog.category_fields.create.set-section-' . $type),  // Option label
          ];
      }

      // Encode the options array into JSON format
      $optionsInJson = json_encode($options);
  @endphp

  <!-- The Select Control with dynamic options -->
  <x-admin::form.control-group.control
      type="select"
      id="section"
      name="section"
      v-model="section"
      rules="required"
      :options="$optionsInJson"
      :value="old('section') ?? $supportedTypes[0]"
      track-by="id"
      label-by="label"
  >
  </x-admin::form.control-group.control>

  <!-- Error handling for the Select element -->
  <x-admin::form.control-group.error control-name="section" />
</x-admin::form.control-group>
```

2. Second method to make select field using route 'list-route'

```html
<x-admin::form.control-group>
    <!-- Label for the Select Element -->
    <x-admin::form.control-group.label class="required">
        @lang('admin::app.catalog.category_fields.create.set-section')
    </x-admin::form.control-group.label>

    <x-admin::form.control-group.control
        type="select"
        track-by="code"
        label-by="label"
        async=true
        :value="old('section') ?? ''"
        name="section"
        :list-route="route('admin.example.get-attribute')"
    />
    <x-admin::form.control-group.error control-name="section" />
</x-admin::form.control-group>
```

### Multi Select

The `Multi Select` component in UnoPim provides a flexible Multi Select element with support for various features like seaching options

  | Prop            | Type          | Default Value | Description                                                            |
| ---------------   | ------------- | ------------- | ---------------------------------------------------------------------- |
| **`options`**     | `Json`        | None          | Take options value in json                                    |
| **`value`**       | `String`     |  None      | Set the default value if none is selected                      |
| **`track-by`**    | `String`     | None       | Options value by 'id'.                      |
| **`label-by`**    | `String`     | None       | Display options by 'label'.                      |

Let's assume you want to use the **`Multi Select`** component. You can call it like this:

1. First method to make select field

```html
<!-- Multi Select Component -->
<x-admin::form.control-group>
  <!-- Label for the Multi Select Element -->
  <x-admin::form.control-group.label class="required">
      @lang('admin::app.catalog.category_fields.create.set-section')
  </x-admin::form.control-group.label>

  @php
      // Define the supported types for the Multi Select options
      $supportedTypes = ['left', 'right'];

      // Initialize an empty array for options
      $options = [];

      // Loop through supported types and build options array
      foreach($supportedTypes as $type) {
          $options[] = [
              'id'    => $type,  // Option ID
              'label' => trans('admin::app.catalog.category_fields.create.set-section-' . $type),  // Option label
          ];
      }

      // Encode the options array into JSON format
      $optionsInJson = json_encode($options);
  @endphp

  <!-- The Multi Select Control with dynamic options -->
  <x-admin::form.control-group.control
      type="multiselect"
      id="section"
      name="section"
      v-model="section"
      rules="required"
      :options="$optionsInJson"
      :value="old('section') ?? $supportedTypes[0]"
      track-by="id"
      label-by="label"
  >
  </x-admin::form.control-group.control>

  <!-- Error handling for the Multi Select element -->
  <x-admin::form.control-group.error control-name="section" />
</x-admin::form.control-group>
```

2. Second method to make select field using route 'list-route'

```html
<x-admin::form.control-group>
    <!-- Label for the Multi Select Element -->
    <x-admin::form.control-group.label class="required">
        @lang('admin::app.catalog.category_fields.create.set-section')
    </x-admin::form.control-group.label>

    <x-admin::form.control-group.control
        type="multiselect"
        track-by="code"
        label-by="label"
        async=true
        :value="old('section') ?? ''"
        name="section"
        :list-route="route('admin.example.get-attribute')"
    />
    <x-admin::form.control-group.error control-name="section" />
</x-admin::form.control-group>
```

### Async Select

The `async select` component provides dynamic loading of attributes with pagination and search functionality. It includes advanced features for handling saved values and searching identifiers.

| Props           | Type      | Default | Description                                                   |
|----------------|-----------|---------|---------------------------------------------------------------|
| **`async`**    | `Boolean` | `false` | Enables async loading of options                              |
| **`track-by`** | `String`  | `'code'`  | Field to use as option value                                 |
| **`label-by`** | `String`  | `'label'`| Field to display in the select                              |
| **`list-route`**| `String` | `null`  | Route for fetching options data                              |
| **`entityName`**| `Json`   | `null`  | Filter options by entity type or validation                   |
| **`value`**    | `Mixed`   | `null`  | Pre-selected value that should match with track-by field     |
| **`query`** | `String` | `null` | Parameter name used when sending search queries to the server |


#### Route Configuration

First, define the `routes` for `async` options:

```php
Route::get('options/async', [AjaxOptionsController::class, 'getOptions'])
    ->name('admin.example.options.async');
```

#### Controller Implementation
Here's a complete example of the controller with searchIdentifiers support:

```php
<?php

namespace Webkul\Example\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Webkul\Attribute\Repositories\AttributeRepository;

class AjaxOptionsController extends Controller
{
    const DEFAULT_PER_PAGE = 20;

    public function __construct(
        protected AttributeRepository $attributeRepository
    ) {}

    public function getOptions(): JsonResponse
    {
        $entityName = request()->get('entityName');
        $page = request()->get('page');
        $query = request()->get('query', '');
        $queryParams = request()->except(['page', 'query', 'entityName']);

        $repository = $this->attributeRepository;

        if (! empty($entityName)) {
            $entityName = json_decode($entityName);
            $repository = in_array('number', $entityName)
                ? $repository->whereIn('validation', $entityName)
                : $repository->whereIn('type', $entityName);
        }

        // Handle Search Query
        if (! empty($query)) {
            $repository = $repository->where('code', 'LIKE', '%' . $query . '%');
        }

        // Handle searchIdentifiers for saved values
        $searchIdentifiers = isset($queryParams['identifiers']['columnName'])
            ? $queryParams['identifiers']
            : [];

        if (! empty($searchIdentifiers)) {
            $repository = $repository->whereIn(
                $searchIdentifiers['columnName'],
                is_array($searchIdentifiers['values'])
                    ? $searchIdentifiers['values']
                    : [$searchIdentifiers['values']]
            );
        }

        // Handle Pagination
        $attributes = $repository->orderBy('id')
            ->paginate(self::DEFAULT_PER_PAGE);

        $options = collect($attributes->items())->map(function ($attribute) {
            $translatedLabel = $attribute->translate(
                core()->getRequestedLocaleCode()
            )?->name;

            return [
                'id'    => $attribute->id,
                'code'  => $attribute->code,
                'label' => ! empty($translatedLabel)
                    ? $translatedLabel
                    : "[{$attribute->code}]",
            ];
        });

        return new JsonResponse([
            'options'  => $options,
            'page'     => $attributes->currentPage(),
            'lastPage' => $attributes->lastPage(),
        ]);
    }
}
```
#### Handling Saved Values
When working with saved values where only codes are stored (instead of complete objects), the component uses searchIdentifiers to fetch and display the correct labels:

1. Single Value Example:
```html
@php

$value = "size"
@endphp

<x-admin::form.control-group.control
type="select"
name="attribute_code"
:value="$value"
track-by="code"
label-by="label"
:list-route="route('admin.example.options.async')"
async=true
/>
```

2. Multiple Values Example:
```html
@php

$value = "size,color,time"
@endphp

<x-admin::form.control-group.control
type="select"
name="attribute_code"
:value="$value"
track-by="code"
label-by="label"
:list-route="route('admin.example.options.async')"
async=true
/>
```
#### Component Usage
Example with pre-selected values:

```html
<!-- Basic usage with single value -->
<x-admin::form.control-group.control
    type="select"
    name="attribute"
    :value="$savedCode" <!-- Pass just the code -->
    track-by="code"
    label-by="label"
    :list-route="route('admin.example.options.async')"
    async=true
/>

<!-- Usage with multiple values -->
<x-admin::form.control-group.control
    type="multiselect"
    name="attributes"
    :value="$savedCodes" <!-- Pass array of codes -->
    track-by="code"
    label-by="label"
    :list-route="route('admin.example.options.async')"
    async=true
/>

<!-- Complete example with all props -->
<x-admin::form.control-group>
    <x-admin::form.control-group.label>
        @lang('admin::app.catalog.attributes.index.title')
        <span>*</span>
    </x-admin::form.control-group.label>

    <x-admin::form.control-group.control
        type="select"
        name="attributes"
        rules="required"
        :value="$savedCode"
        track-by="code"
        label-by="label"
        :entityName="json_encode(['text'])"
        :list-route="route('admin.example.options.async')"
        async=true
    />

    <x-admin::form.control-group.error
        control-name="attributes"
    />
</x-admin::form.control-group>
```

> **Note:** When passing only codes as values, the component automatically:
> 1. Sends the codes to the controller using searchIdentifiers
> 2. Fetches the complete option data including labels
> 3. Displays the proper labels in the select field
>
> This works for both single select and multiselect components.

### Tagging

The Tagging component provides an interactive interface for managing tags, combining both select and input functionality. Users can select from existing tags or create new ones dynamically.

| Props           | Type      | Default | Description                                                   |
|----------------|-----------|---------|---------------------------------------------------------------|
| **`name`**     | `String`  | `null`  | Name of the form control                                      |
| **`options`**  | `Array`   | `[]`    | Predefined tags available for selection                       |
| **`value`**    | `Array`   | `[]`    | Currently selected/added tags                                 |
| **`track-by`** | `String`  | `'id'`  | Property to use as unique identifier                         |
| **`label-by`** | `String`  | `'name'`| Property to display as tag label                             |

#### Basic Usage
Let's assume you want to use the **`tagging`** component. You can call it like this.

```html
<x-admin::form.control-group>
  <!-- Label for the Select Element -->
    <x-admin::form.control-group.label>
        Tags
    </x-admin::form.control-group.label>
    @php
        // Example data for existing tags
        $existingTags = [
            ['id' => 1, 'name' => 'Tag 1'],
            ['id' => 2, 'name' => 'Tag 2'],
            ['id' => 3, 'name' => 'Tag 3'],
        ];
        // Example data for selected tags
        $selectedTags = [1, 2];
    @endphp

    <x-admin::form.control-group.control
        type="tagging"
        name="tags"
        :options="$existingTags"
        :value="$selectedTags"
        track-by="id"
        label-by="name"
        :placeholder="'Select or add tags...'"
    />

    <x-admin::form.control-group.error
        control-name="tags"
    />
</x-admin::form.control-group>
```

### Drawer

The `drawer` component in UnoPim provides a versatile drawer that can be positioned on the top, bottom, left, or right side of the screen. It allows you to create interactive drawers that can contain various content such as headers, body, and footer sections. The drawer can be toggled open or closed, providing a clean and efficient way to display additional information or functionality.

| Props            | Type          | Default Value | Description                                                            |
| --------------  | ------------- | ------------- | ---------------------------------------------------------------------- |
| **`is-active`** | `Boolean`     | `false`       | Determines whether the drawer is initially active.                      |
| **`position`** | `String`      | `'left'`      | Specifies the position of the drawer (`top`, `bottom`, `left`, or `right`). |
| **`width`**    | `String`      | `'500px'`     | Specifies the width of the drawer.                                      |

| Slots           | Description                                                      |
  | ------------- | ------------------------------------------------------------------------ |
  | **`toggle`** | Slot for the toggle button or element. |
  | **`header`** | Slot for the header content. |
  | **`content`** | Slot for the main content. |
  | **`footer`** |  Slot for the footer content. |

You can customize the appearance of the Drawer by passing additional CSS.

* To customize the header section, you can target the `header` slot with your own CSS classes or styles.
* Similarly, you can customize the content section using the `content` slot.
* Similarly, you can customize the content section using the `footer` slot.

Let's assume you want to use the **`drawer`** component. You can call it like this.

```html
<!-- Drawer -->
<x-admin::drawer
    position="left"
    width="100%"
>
    <x-slot:toggle>
        Drawer Toggle
    </x-slot>

    <x-slot:header class="bg-red-100">  <!-- Pass your custom css to customize header -->
        Drawer Header
    </x-slot>

    <x-slot:content class="!p-5"> <!-- Pass your custom css to customize header -->
        Drawer Content
    </x-slot>
</x-admin::drawer>
```

### Dropdown

The `dropdown` component in UnoPim provides a customizable dropdown menu that can be positioned at different locations relative to its toggle button. It enables you to create dropdown menus with various content sections such as toggle button, content, and menu items.

| Prop              | Type      | Default Value | Description                                                            |
| ----------------- | --------- | ------------- | ---------------------------------------------------------------------- |
| **`close-on-click`**| `Boolean` | `true`        | Determines whether the dropdown should close when clicking outside the menu. |
| **`position`**    | `String`  | `'bottom-left'`| Specifies the position of the dropdown menu relative to the toggle button (`top-left`, `top-right`, `bottom-left`, `bottom-right`). |

  | Slots           | Description                                                      |
  | ------------- | ------------------------------------------------------------------------ |
  | **`toggle`** | Slot for the toggle button or element.. |
  | **`content`** | Slot for the main content. |
  | **`menu`** | Slot for the menu items.. |

To customize the content section, you can target the `content` slot with your own CSS classes or styles.

Let's assume you want to use the **`dropdown`** component. You can call it like this.

```html
<!-- Dropdown -->
<x-admin::dropdown position="bottom-left">
    <x-slot:toggle>
        Dropdown Toggle
    </x-slot>

    <x-slot:content class="!p-0">
        Dropdown Content
    </x-slot>

    <x-slot:menu>
        <x-admin::dropdown.menu.item
            Menu Item 1
            Menu Item 2
        >
        </x-admin::dropdown.menu.item>
    </x-slot>
</x-admin::dropdown>
```

### Flat-Picker

The `datetime-picker` and `date-picker` components provide `date` and `time` picker functionality within UnoPim applications. These components are based on the Flatpickr library and offer customizable options for selecting dates and times.

It can be configured with various props to customize its behavior according to application requirements.

| Prop          | Type             | Default Value | Description                                                             |
| ------------- | ---------------- | ------------- | ----------------------------------------------------------------------- |
| **`name`**    | `String`         | None          | Name attribute for the input field.                                      |
| **`value`**   | `String`         | None          | Initial value of the date picker.                                        |
| **`allow-input`** | `Boolean`      | `true`      | Determines whether manual input is allowed in the input field.           |
| **`disable`** | `Array`          | `[]`          | Array of dates to disable in the date picker.                            |

Let's assume you want to use the **`flat-picker`** component. You can call it like this.

```html
<!-- DateTime Picker -->
<x-admin::flat-picker.date ::allow-input="false">
    <input
        type="datetime"
        name="datetime"
        class="mb-4"
        :value="selectedDateTime"
        :disable="disabledDates"
        placeholder="datetime"
    />
</x-admin::flat-picker.date>
```

### Data Grid

The `datagrid` component in UnoPim applications provides a flexible and customizable data grid interface for displaying tabular data. It includes features such as `sorting`, `filtering`, `pagination`, and `mass actions` to manage data efficiently.

You can customize the appearance of the `DataGrid` by referring to the [DataGrid Customization](https://devdocs.unopim.com/2.x/packages/datagrid.html#datagrid-customization) documentation.

Let's assume you want to use the **`datagrid`** component. You can call it like this.

```html
<!-- Datagrid -->
<x-admin::datagrid :src="route('admin.catalog.products.index')" />
```

### Tabs

The Tabs component allows users to navigate between different content sections using tabs. It consists of two main parts: the `tabs` component for managing the tabs and the `tab-item` component for defining individual tab items.

| Prop          | Type             | Default Value | Description                                                             |
| ------------- | ---------------- | ------------- | ----------------------------------------------------------------------- |
| **`position`**| `String`         | `'left'`      | Specifies the position of the tabs (`left`, `right`, `center`).         |

### Tinymce

The `tinymce` component wraps the Tinymce editor and provides additional functionalities like AI content generation.

| Props          | Type    | Default Value | Description                                                      |
| -------------- | ------- | ------------- | ---------------------------------------------------------------- |
| **`selector`** | String  | `''`          | The CSS selector for the textarea element to initialize as TinyMCE. |
| **`field`**    | Object  | `{}`          | Vue Formulate field object.                                      |
| **`prompt`**   | String  | `''`          | The prompt to be used for AI content generation.                 |

Let's assume you want to use the **`tinymce`** component on admin and shop. You can call it like this.

```html
<!-- Tinymce -->
<x-admin::form.control-group.control
    type="textarea"
    id="content"
    name="content"
    rules="required"
    :value="old('content')"
    :label="Content"
    :placeholder="Content"
    :tinymce="true"
    :prompt="core()->getConfigData('general.magic_ai.content_generation.category_description_prompt')"
/>
```

### Shimmer

Prebuilt `shimmer` effects are available in UnoPim. You can easily use them.

Let's assume you want to use the **`shimmer`** You can call it like this.

```html
<!-- shimmer -->
<x-admin::shimmer.datagrid />
```

### Quantity Changer

The Quantity Changer component, provides a simple interface for users to increase or decrease a quantity value.

| Props          | Type    | Default Value | Description                       |
| -------------- | ------- | ------------- | --------------------------------- |
| **`name`**     | String  | `''`          | The name attribute for the hidden input field. |
| **`value`**    | Number  | `1`           | The initial quantity value.       |

Let's assume you want to use the **`Quantity Changer`** component on shop. You can call it like this.

```html
<!-- Quantity changer -->
<x-admin::quantity-changer
    name="quantity"
    value="1"
    class="w-max gap-x-4 rounded-l px-4 py-1"
/>
```

### Table

The Table component provides a structured way to display tabular data in UnoPim. You can customize the appearance of the table elements using CSS. Below are some common customization options:

| Styling        | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **`Table`**    | Apply custom styles to the `table` element to change its appearance, such as borders, padding, and background color. |
| **`Cell`**     | Customize the appearance of `th` and `td` elements using CSS, such as font size, text alignment, and background color. |
| **`Row`**      | Apply styles to `tr` elements to change their appearance, such as background color, hover effects, and borders. |
| **`Header`**   | Customize the appearance of the header cells within the `thead` section using `th` elements. Apply styles such as font weight, text color, and background color. |

Let's assume you want to use the **`Table`** component on shop. You can call it like this.

```html
<!-- Table -->
<x-admin::table>
    <x-admin::table.thead>
        <x-admin::table.thead.tr>
            <x-admin::table.th>
                Heading 1
            </x-admin::table.th>

            <x-admin::table.th>
                Heading 2
            </x-admin::table.th>

            <x-admin::table.th>
                Heading 3
            </x-admin::table.th>

            <x-admin::table.th>
                Heading 4
            </x-admin::table.th>
        </x-admin::table.thead.tr>
    </x-admin::table.thead>

    <x-admin::table.tbody>
        <x-admin::table.tbody.tr>
            <x-admin::table.td>
                Column 1
            </x-admin::table.td>

            <x-admin::table.td>
                Column 2
            </x-admin::table.td>

            <x-admin::table.td>
                Column 3
            </x-admin::table.td>

            <x-admin::table.td>
                Column 4
            </x-admin::table.td>
        </x-admin::table.thead.tr>
    </x-admin::table.tbody>
</x-admin::table>
```

### Modal

The `modal` component in UnoPim provides a flexible way to create modal dialogs. It allows you to display content in a layer that floats above the rest of the page.

| Props         | Type      | Default Value | Description                           |
|--------------|-----------|---------------|---------------------------------------|
| `is-active`  | Boolean   | `false`       | Controls the visibility of the modal.  |

| Slot          | Description                                                 |
|---------------|-------------------------------------------------------------|
| **`toggle`**  | Used for the element that toggles the visibility of the modal. |
| **`header`**  | Allows customization of the modal header content.           |
| **`content`** | Provides a slot for the main body content of the modal.      |
| **`footer`**  | Allows customization of the footer content within the modal. |

You can customize the appearance of the Modal by passing additional CSS.

* To customize the header section, you can target the `header` slot with your own CSS classes or styles.
* Similarly, you can customize the content section using the `content` slot.
* Similarly, you can customize the content section using the `footer` slot.

Let's assume you want to use the **`modal`** component, You can call it like this.

```html
<!-- Modal -->
<x-admin::modal>
    <x-slot:toggle>
        Modal Toggle
    </x-slot>

    <x-slot:header>
        Modal Header
    </x-slot>

    <x-slot:content>
        Modal Content
    </x-slot>
</x-admin::modal>
```

### Tree

The Tree component in UnoPim enables you to display hierarchical data in a tree-like structure, with support for checkboxes or radio buttons for selection.

| Props           | Type                             | Default Value | Description                                                      |
|-----------------|----------------------------------|---------------|------------------------------------------------------------------|
| **`input-type`** | `String`                         | `'checkbox'`  | Specifies the type of input to use for selection. Can be either `checkbox` or `radio`. |
| **`selection-type`** | `String`                     | `'hierarchical'` | Specifies the selection type. Can be `'hierarchical'` or `'individual'`. |
| **`name-field`** | `String`                         | `'permissions'` | The field name to use as the identifier for each tree node.      |
| **`value-field`** | `String`                         | `'value'`      | The field name to use as the value for each tree node.           |
| **`id-field`**    | `String`                         | `'id'`         | The field name to use as the unique identifier for each tree node. |
| **`label-field`** | `String`                         | `'name'`       | The field name to use as the label for each tree node.           |
| **`children-field`** | `String`                      | `'children'`   | The field name to use for nesting child nodes within each tree node. |
| **`items`**      | `Array`, `String`, `Object`      | `[]`           | The hierarchical data to be displayed in the tree structure.      |
| **`value`**      | `Array`, `String`, `Object`      | `[]`           | The selected values.                                             |
| **`fallback-locale`** | `String`                     | `'en'`         | The fallback locale to use for translations.                     |
| **`collapse`**   | `Boolean`                        | `false`       | Determines whether the tree nodes are initially collapsed (`true`) or expanded (`false`). |

Let's assume you want to use the **`tree`** component, You can call it like this.

```html
<x-admin::tree.view
    input-type="checkbox"
    selection-type="individual"
    name-field="categories"
    id-field="id"
    value-field="id"
    ::items="categories"
    :value="($product->categories->pluck('id'))"
    :fallback-locale="config('app.fallback_locale')"
    :collapse="true"
>
</x-admin::tree.view>
```

### Media(Image/Video)

The Media component in UnoPim provides a user interface for managing and displaying images/videos, allowing users to upload, edit, and delete images.:

| Props               | Type        | Default Value | Description                                                      |
|---------------------|-------------|---------------|------------------------------------------------------------------|
| **`name`**          | `String`    |               | The name of the input field.                                      |
| **`allow-multiple`** | `Boolean`   | `false`       | Whether to allow uploading multiple images.                       |
| **`show-placeholders`** | `Boolean` | `true`        | Whether to show placeholder images when no images are uploaded.   |
| **`uploaded-images`** | `Array`     | `[]`          | Array of uploaded images.                                         |
| **`uploaded-videos`** | `Array`     | `[]`          | Array of uploaded videos.                                         |
| **`width`**         | `String`    | `'100%'`      | Width of the image container.                                     |
| **`height`**        | `String`    | `'auto'`      | Height of the image container.                                    |

Let's assume you want to use the **`Image/Video`** component, You can call it like this.

```html
<!-- Image Component -->
<x-admin::media.images
    name="images"
    allow-multiple="true"
    show-placeholders="true"
    :uploaded-images="$product->images"
/>

<!-- Video Component -->
<x-admin::media.videos
    name="videos[files]"
    :allow-multiple="true"
    :uploaded-videos="$product->videos"
/>
```
