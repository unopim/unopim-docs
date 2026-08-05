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

For more details on UnoPim's directory structure and configuration, visit the [official documentation](https://devdocs.unopim.com/master/packages/views.html#directory-structure).

## AJAX Navigation <Badge type="tip" text="3.0" />

The admin navigates like a single-page app: link clicks inside the admin are intercepted, the destination is fetched with an `X-Ajax-Nav: true` header, and the `#app` subtree is swapped and remounted — browser history included (`pushState`/`popstate`).

Key facts for extension authors (`assets/js/plugins/navigation.js`; contract constants in `assets/js/constants.js`):

- **Opt out per link** with the `data-no-ajax-nav` attribute (downloads, cross-origin, and `target` links are skipped automatically).
- **Lifecycle events** on `document`: `unopim:navigate:before` (cancelable), `unopim:navigate:success`, `unopim:navigate:error`. Any failure falls back to a full page load.
- **Navigation guards**: `window.unopim.registerNavigationGuard(fn)` — return `false` (sync or async) to cancel a visit. The unsaved-changes bar uses this to prompt before leaving.
- **Programmatic visits**: `window.unopim.visit(url)`, or `this.$navigate(url)` inside Vue components.
- Inline page scripts and Vue `x-template` scripts are re-executed per visit with template ids remapped, so **page-scoped scripts must be idempotent**.

::: warning For browser tests
Clicking an admin link is an AJAX visit, not a full page load. E2E tests that wait for navigation events must wait for the DOM swap instead.
:::

## Form Submission and Flash Messages <Badge type="tip" text="3.0" />

Forms rendered with `<x-admin::form ajax>` post their raw `FormData` with an `X-Ajax-Form: true` header. Server-side, the `ConvertAjaxFormRedirect` middleware converts controller redirects into JSON. On success the app emits the `add-flash` and `form-saved` mitt events and navigates to `redirect_url`; on 422 it maps errors onto fields and reveals the first invalid one. Any component can raise a toast:

```js
this.$emitter.emit('add-flash', { type: 'success', message: '...' });
```

## Unsaved-Changes Tracking <Badge type="tip" text="3.0" />

Edit forms sit inside `<x-admin::form.unsaved-changes>`: the component snapshots the form's `FormData`, watches for real user input, and shows a global Save/Discard bar when values differ. Integration points for custom widgets:

| Hook | Use |
|---|---|
| `unsaved-changes:touch` (bubbling DOM event, `detail: {name}`) | Tell the bar a field changed when plain input events can't see it (WYSIWYG, uploaders, drawers) |
| `unsaved-changes:sync` (bubbling DOM event) | Re-baseline dynamically added fields |
| `$emitter.on('unsaved-changes:reset', fn)` | Restore your internal state when the admin discards |
| `data-unsaved-ignore` / `data-unsaved-managed` | Exclude a subtree from tracking / from discard-revert |
| `[data-control-group]` / `[data-dirty-section]` | Field grouping for dirty badges and the section counter |

The bar registers itself as a navigation guard, so AJAX navigation, `beforeunload`, and the discard confirmation all behave consistently.

## Dark Theme <Badge type="tip" text="3.0" />

Theme state is a plain (unencrypted) `dark_mode` cookie with values `auto | light | dark`. Layouts read the cookie server-side and set `class="dark"` on `<html>` before paint; an inline script resolves `auto` against `prefers-color-scheme`, so there is no flash. The header toggle emits the `change-theme` mitt event on every switch.

Styling rules: colors come from CSS tokens in `assets/css/app.css` (`--c-primary-50…900`, `--c-success/warning/danger/info`, `--chart-*`) declared as space-separated RGB channels so Tailwind opacity modifiers work. Dark surfaces use the `dark:bg-cherry-*` scale. **Never hardcode a color** — add a token and expose it through `tailwind.config.js`.

## Package Views and the Tailwind Build

The Admin theme's `tailwind.config.js` scans sibling packages (`"../*/src/Resources/**/*.blade.php"`, `"../*/src/Resources/**/*.js"`), so utilities used only in your package's views are still generated. Build the theme from `packages/Webkul/Admin` — the root Vite build covers only the app shell. TinyMCE and fonts are self-hosted by the build (no runtime CDN access needed).
