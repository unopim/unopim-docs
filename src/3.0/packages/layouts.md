# Layouts

## Introduction

Layouts in UnoPim are fundamental to structuring your application's views in a consistent and reusable way. They provide a template for rendering HTML across multiple pages, ensuring a unified design and user experience. By defining layouts, you can streamline development, improve maintainability, and enhance the overall aesthetics of your web application.

To learn in detail about Blade layouts, you can visit the Laravel documentation [here](https://laravel.com/docs/13.x/blade).

## Admin Layout

`<x-admin::layouts>` is the container for any admin page. It supplies the sidebar, header, breadcrumbs, dark-mode handling, flash messages, and the global unsaved-changes bar — so an admin view should never emit its own `<html>` document.

To build a listing page for your package, create `packages/Webkul/Example/src/Resources/views/admin/index.blade.php`:

```blade
<x-admin::layouts>
    <x-slot:title>
        @lang('example::app.admin.index.page-title')
    </x-slot>

    <x-admin::layouts.page-header :title="trans('example::app.admin.index.page-title')">
        <x-slot:actions>
            @if (bouncer()->hasPermission('example.create'))
                <a href="{{ route('example.admin.create') }}" class="primary-button">
                    @lang('example::app.admin.index.create-btn')
                </a>
            @endif
        </x-slot>
    </x-admin::layouts.page-header>

    <x-admin::datagrid :src="route('example.admin.index')" />
</x-admin::layouts>
```

## Page Headers

`<x-admin::layouts.page-header>` renders the title row of a listing page.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | String | — | The page title. |
| `description` | String | `null` | Optional subtitle under the title. |
| `breadcrumb` | Boolean | `true` | Whether to render breadcrumbs above the title. |

It exposes an `actions` slot for buttons on the right-hand side.

For edit screens, use `<x-admin::layouts.edit-page-header>` instead — it adds a back link and participates in the sticky-header and save-bar behaviour:

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | String | — | The page title. |
| `backUrl` | String | `null` | Where the back link points. |
| `backLabel` | String | Back | Label for the back link. |
| `saveLabel` | String | `null` | Label for the save action; suppressed automatically while viewing history. |
| `form` | String | `null` | Id of the form the save action submits. |
| `sticky` | Boolean | `true` | Keep the header pinned while scrolling. |
| `breadcrumb` | Boolean | `true` | Whether to render breadcrumbs. |

## Edit Pages with History

Entities that track history use `<x-admin::layouts.with-history>`, which renders the edit page and a History tab beside it without any extra wiring:

```blade
<x-admin::layouts.with-history
    :active-tab="$activeTab"
    entity-name="webhooks"
    :history-id="$webhook->id"
    :tab-items="$tabItems"
>
    <x-slot:title>
        @lang('example::app.admin.edit.title')
    </x-slot>

    <x-slot:pageHeader>
        {{-- your edit-page-header --}}
    </x-slot>

    {{-- form content --}}
</x-admin::layouts.with-history>
```

`entity-name` is the history entity key your model registers, and `history-id` is the record whose audit trail the tab loads. See [History Tracking](./history) for making a model auditable.

## Anonymous Layout

`<x-admin::layouts.anonymous>` is the layout for pages rendered outside the panel — login, password reset, and the installer. It carries the same theme handling but no sidebar or header.
