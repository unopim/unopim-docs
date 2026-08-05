# Release Notes

## Introduction

UnoPim 3.0 is a major release built on **Laravel 13** and **PHP 8.4.1**. It brings Digital Product Passports, configurable associations, advanced variants, a greatly expanded REST API, and a refreshed admin experience — alongside significant performance and security work.

Because this is a major version, it contains breaking changes. Before you upgrade a production installation, you should read the [Upgrade Guide](upgrade-guide) and run `php artisan unopim:upgrade --dry-run` to preview what the upgrade will do.

This page summarizes what shipped, from the headline features down to the breaking changes, with links to the detailed documentation for each area.

## UnoPim v3.0.0 <Badge type="tip" text="July 31, 2026" />

### Headline Features

The table below lists the major new capabilities and where each is documented:

| Feature | Documentation |
|---|---|
| **Digital Product Passports** — templates, per-locale publishing, QR carriers, GS1 Digital Link, ESPR & EU Battery Regulation presets | [Digital Product Passport](../advanced/digital-product-passport) |
| **Configurable Associations** — custom association types with localized labels and per-link fields | [Configurable Associations](../packages/configurable-associations) |
| **Advanced Variants** — two-level variant structures with read-time value inheritance | [Advanced Variants](../packages/advanced-variants) |
| **Measurements** — measurement families, units, conversions, precision strategies | [Measurements](../packages/measurements) |
| **Multi-Webhooks** — multiple endpoints, event subscriptions, HMAC delivery, logs | [Webhooks](../packages/webhooks) |
| **Microsoft SSO** — Entra ID login with an extensible provider contract | [Microsoft SSO](../advanced/microsoft-sso) |
| **REST API expansion** — full catalog CRUD, media, passports, delta sync | [What's New in the v3.0 API](../api/whats-new-v3) |

### Admin Experience

The admin panel now navigates SPA-style with AJAX and browser history, and a global unsaved-changes save bar protects your edits — see [Frontend Architecture](../architecture/frontend). A dark theme is included, with automatic browser detection.

Working with the catalog is faster throughout: the product grid gains filters for category, completeness, dates, properties, and attribute values, plus saved grid views; catalog structures can be created from quick modals; a native category tree browser and lazy attribute-group loading keep large screens responsive; and products support quick export and asynchronous mass actions.

Configuration moved into a config-driven [System Settings hub](../advanced/system-settings) with package extension hooks, and each admin may now set a personal catalog locale and default channel.

### Platform & Developer

The platform moves to Laravel 13, PHP 8.4.1, and Symfony 8 components, with Pest 5 / PHPUnit 13 for testing. Fresh Docker environments now default to native PostgreSQL support.

For extension authors, 3.0 opens several new surfaces: the [Resource CRUD Kit](../packages/resource-crud-kit), the `SsoProvider` contract, variant resolver contracts, the publication `PayloadBuilder` / `PublicationGate` / type registry, and the webhook `EventRegistry`.

API integrations now run as robot users with a one-time credential reveal, and import/export jobs cover attributes, families, groups, options, category fields, associations, locales, channels, currencies, roles, and users.

### Performance

This release adds keyset pagination for large exports, hot-path indexes, queued mass actions, bounded Elasticsearch bulk indexing, and N+1 elimination across the family, variant, product, and user workflows — see [Performance & Scalability](../advanced/performance-scalability).

### Security

OAuth signing keys are now per-installation 4096-bit keys, which invalidates existing tokens — clients must re-authenticate. The release also adds SSRF protection on webhooks and Magic AI, stored-XSS sanitisation, a centralized password policy, configurable CORS / rate limits / trusted hosts, and `APP_PREVIOUS_KEYS` rotation — see [Security Practices](../advanced/security-practice).

### Breaking Changes

The breaking changes are summarized in the [Upgrade Guide](upgrade-guide#breaking-changes): the PHP/Laravel requirement bump, OAuth token invalidation, robot-user integration ownership, variant value storage, renamed admin URLs, the webhook module replacement, the Docker layout, the deprecated `configrable-products` alias, and removed classes.

For the exhaustive list of every change, see the [CHANGELOG on GitHub](https://github.com/unopim/unopim/blob/master/CHANGELOG.md).
