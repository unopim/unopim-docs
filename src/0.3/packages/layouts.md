# Layouts



## Introduction

Layouts in UnoPim are fundamental to structuring your application's views in a consistent and reusable way. They provide a template for rendering HTML across multiple pages, ensuring a unified design and user experience. By defining layouts, you can streamline development, improve maintainability, and enhance the overall aesthetics of your web application.

To learn in detail about Layouts, you can visit the Laravel documentation [here](https://laravel.com/docs/10.x/blade).

## Admin Layout

`<x-admin::layouts>` This component serves as the container for your extended admin layout. It encapsulates the entire layout structure, including the title and content.

To extend the default layout of the UnoPim admin panel, you'll create or modify the `index.blade.php` file located at `packages/Webkul/Example/src/Resources/views/admin/index.blade.php`. Below is a detailed breakdown of how to integrate and customize the layout:

```html
<x-admin::layouts>
    <!-- Title of the page -->
    <x-slot:title>
        @lang('example::app.admin.index.page-title')
    </x-slot:title>

    <div class="flex gap-[16px] justify-between max-sm:flex-wrap">
        <p class="py-[11px] text-[20px] text-gray-800 dark:text-white font-bold">
            <!-- Section Title -->
            @lang('example::app.admin.index.page-title')
        </p> 

        <div class="flex gap-x-[10px] items-center">
            <!-- Action Button -->
        </div>
    </div>
</x-admin::layouts>
```
