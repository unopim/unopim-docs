# UnoPim Frontend Overview



UnoPim's frontend uses modern tools and frameworks to create a responsive and dynamic user interface.

## Tailwind CSS

UnoPim uses [Tailwind CSS](https://tailwindcss.com/), a customizable utility-first CSS framework for building responsive designs quickly.

- **Customization**: Tailwind CSS offers flexible configuration to suit different project needs.
- **Utility-First Approach**: It provides utility classes for efficient design within HTML.

To set up Tailwind CSS, define your Blade file path and the JavaScript directory in the `tailwind.config.js` file. Tailwind will compile the CSS from the defined location.

## Vue.js

UnoPim’s dynamic UI is powered by [Vue.js](https://vuejs.org/), a flexible JavaScript framework.

- **Reactive Components**: Vue.js allows for real-time updates as data changes.
- **Component-Based Architecture**: Vue.js promotes reusable and maintainable components.

UnoPim uses [Vite](https://vitejs.dev/) as a build tool, offering a faster development experience. The `vite.config.js` file defines the build paths, and Vite compiles CSS and JavaScript into the public directory.

## Blade

UnoPim leverages the Blade template engine, integrated with [Laravel](https://laravel.com), for creating flexible and dynamic templates.

- **Template Inheritance**: Blade allows a modular structure through template inheritance.
- **Directives**: Blade simplifies common tasks like loops and conditionals with its built-in directives.

For more details on UnoPim's directory structure and configuration, visit the [official documentation](https://devdocs.unopim.com/0.1/packages/views.html#directory-structure).