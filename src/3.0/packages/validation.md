# Validation

## Validation Using Laravel

### Introduction

Laravel offers multiple approaches to validate incoming data in your application, ensuring that your data is accurate and meets the specified requirements before it is processed. The most common method is to use the validate method available on incoming HTTP requests.

This method is easy to use and integrates seamlessly with Laravel's request lifecycle. By leveraging Laravel's built-in validation rules and custom validation logic, you can ensure your application handles data validation efficiently and effectively.

For detailed information about validation in Laravel, refer to the [Laravel documentation](https://laravel.com/docs/13.x/validation).

### Usage

UnoPim validates every write through a **FormRequest** class. Inline `$request->validate()` calls are not used in core and should not be used in packages: a FormRequest keeps rules out of the controller, gives you an `authorize()` hook, and is reusable across the store and update paths.

### Creating a FormRequest

Put the class in your package's `Http/Requests` folder:

```php
<?php

namespace Webkul\Example\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Webkul\Core\Rules\Code;

class ExampleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return bouncer()->hasPermission('example.create');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code'        => ['required', 'unique:examples,code', new Code],
            'title'       => ['required', 'max:255'],
            'description' => ['nullable', 'string'],
            'status'      => ['boolean'],
        ];
    }

    /**
     * Custom messages for the rules above.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.unique' => trans('example::app.validation.code-taken'),
        ];
    }
}
```

Messages must come from translation files — never hardcode the English string, or the error will not follow the admin's locale.

### Using It in the Controller

Type-hint the request. Laravel resolves it, runs the rules before your method body, and returns a `422` with the error bag when they fail:

```php
use Webkul\Example\Http\Requests\ExampleRequest;

public function store(ExampleRequest $request): JsonResponse
{
    $example = $this->exampleRepository->create($request->validated());

    return new JsonResponse([
        'message' => trans('example::app.examples.create-success'),
    ]);
}
```

`$request->validated()` returns only the keys that passed a rule, which keeps unexpected input out of a mass-assignment call.

### Custom Rules

For validation that repeats across requests, write a rule class rather than a closure. UnoPim ships several you can reuse — `Webkul\Core\Rules\Code` for entity codes, and `Webkul\Core\Rules\FileMimeExtensionMatch` for uploads where the extension must match the real MIME type.

## Validation Using Vue

### Introduction

VeeValidate is a powerful validation library for Vue.js that provides an extensive set of validation rules out of the box, along with support for custom rules. It is template-based, making it easy to validate HTML5 inputs as well as custom Vue components. VeeValidate also supports localization with 44 languages maintained by the community.

For detailed information about validation in Vue.js using VeeValidate v4, refer to the [VeeValidate documentation](https://vee-validate.logaretm.com/v4/guide/overview/).

### Installation

UnoPim already includes the VeeValidate v4 library, so there is no need to install it separately.

### Configuration

UnoPim ships pre-configured `vee-validate` settings in `packages/Webkul/Admin/src/Resources/assets/js/plugins/vee-validate.js`, registered from `app.js`. The plugin:

- registers every rule from `@vee-validate/rules` globally,
- registers UnoPim's own rules — `phone`, `address`, `decimal`, and `required_if`,
- registers the `VForm`, `VField`, and `VErrorMessage` components,
- loads the `@vee-validate/i18n` message catalogue for each supported locale, so validation errors appear in the admin's language,
- and validates on blur, input, and change.

Because the rules are global, a Blade control only needs the `rules` attribute — no imports or per-component setup.

### Examples

Below are examples of how to use VeeValidate for validation in Vue components within UnoPim:

```html
<x-admin::form.control-group class="w-full mb-[10px]">
    <x-admin::form.control-group.label class="required">
        @lang('example::app.admin.example.create.title')
    </x-admin::form.control-group.label>

    <x-admin::form.control-group.control
        type="text"
        name="title"
        :value="old('title')"
        rules="required"
        :label="trans('example::app.admin.example.create.title')"
        :placeholder="trans('example::app.admin.example.create.title')"
    >
    </x-admin::form.control-group.control>

    <x-admin::form.control-group.error
        control-name="title"
    >
    </x-admin::form.control-group.error>
</x-admin::form.control-group>
```

### Available Custom Validation in unopim

- `phone` The phone validation rule is designed to ensure that the input is a valid phone number.

```javascript
defineRule("phone", (value) => {
    if (!value || !value.length) {
        return true;
    }

    if (!/^\+?\d+$/.test(value)) {
        return false;
    }

    return true;
});
```
- `address` The address validation rule typically ensures that an address field is not left empty and may include additional logic to check for valid address formats. 

```javascript
defineRule("address", (value) => {
    if (!value || !value.length) {
        return true;
    }

    if (
        !/^[a-zA-Z0-9\s.\/*'\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0590-\u05FF\u3040-\u309F\u30A0-\u30FF\u0400-\u04FF\u0D80-\u0DFF\u3400-\u4DBF\u2000-\u2A6D\u00C0-\u017F\u0980-\u09FF\u0900-\u097F\u4E00-\u9FFF,\(\)-]{1,60}$/iu.test(
            value
        )
    ) {
        return false;
    }

    return true;
});
```

- `decimal` The decimal validation rule ensures that the input is a valid decimal number. This rule allows specifying the number of decimal places and the decimal separator. By default, it accepts any number of decimal places and uses the period (".") as the separator.

```javascript
defineRule(
    "decimal",
    (value, { decimals = "*", separator = "." } = {}) => {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        if (Number(decimals) === 0) {
            return /^-?\d*$/.test(value);
        }

        const regexPart = decimals === "*" ? "+" : `{1,${decimals}}`;
        const regex = new RegExp(
            `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
        );

        return regex.test(value);
    }
);
```

- `required_if` Makes a field required only when a condition you pass is true — useful for fields that appear conditionally in a form.

```javascript
defineRule("required_if", (value, { condition = true } = {}) => {
    if (condition) {
        if (value === null || value === undefined || value === '') {
            return false;
        }
    }

    return true;
});
```
