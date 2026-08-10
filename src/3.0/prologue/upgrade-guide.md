# Upgrade Guide

## Overview

This guide walks you through upgrading your UnoPim installation from **v2.1.x to v3.0.0**. This is a **major release**: it moves the platform to **Laravel 13** and **PHP 8.4.1**, replaces several subsystems (webhooks, API integrations, variant storage), and ships large schema migrations. Plan a maintenance window.

Before anything else, run the built-in upgrade advisor against your installation:

```bash
php artisan unopim:upgrade --dry-run
```

It inspects your database and configuration and reports exactly which of the breaking changes below apply to you — before you book downtime.

::: warning Breaking release
v3.0.0 contains breaking changes. Read the [Breaking Changes](#breaking-changes) section in full before upgrading a production environment. API clients **will need to re-authenticate** after the upgrade.
:::

## Pre-upgrade Checklist

- [ ] You are currently running **UnoPim v2.1.x**
- [ ] **PHP 8.4.1+**, **Composer 2.6+**, and **Node.js 20+** are installed on the target environment
- [ ] You have a complete backup of your database
- [ ] You have a complete backup of your project files (especially `.env`, `storage/`, and any custom packages)
- [ ] All queue workers, cron jobs, and Supervisor processes are stopped
- [ ] You have run `php artisan unopim:upgrade --dry-run` and reviewed its report
- [ ] Your API consumers are prepared to re-authenticate (see [OAuth keys](#oauth-tokens-and-signing-keys))
- [ ] Custom packages have been checked against the [Laravel 13 upgrade guide](https://laravel.com/docs/13.x/upgrade)

## Upgrade Steps

### 1. Backup Your System

```bash
# MySQL
mysqldump -u your_db_user -p your_db_name > unopim_v2.1_backup.sql

# PostgreSQL
pg_dump -U your_db_user your_db_name > unopim_v2.1_backup.sql

# Project files
tar -czf unopim_v2.1_files_backup.tar.gz /path/to/current/unopim
```

### 2. Stop Queue Workers and Scheduler

```bash
sudo supervisorctl stop unopim-worker
```

### 3. Upgrade PHP to 8.4

v3.0.0 requires **PHP 8.4.1 or newer**. A server running PHP 8.3 must be upgraded first:

```bash
# Ubuntu / Debian (ondrej PPA)
sudo apt install php8.4 php8.4-fpm php8.4-cli php8.4-common \
    php8.4-mysql php8.4-pgsql php8.4-xml php8.4-curl php8.4-mbstring \
    php8.4-zip php8.4-gd php8.4-bcmath php8.4-intl php8.4-redis
```

### 4. Download UnoPim v3.0.0

- [GitHub Release v3.0.0](https://github.com/unopim/unopim/releases/tag/v3.0.0)

Or with Git:

```bash
git fetch --tags
git checkout v3.0.0
```

### 5. Update Dependencies and Rebuild Assets

```bash
composer install
npm install
npm run build
```

v3.0.0 upgrades major dependencies. If you maintain custom packages, update their constraints for:

| Dependency | New major |
|---|---|
| `laravel/framework` | 13 (includes Symfony 8 components) |
| `laravel/passport` | 13 |
| `intervention/image` | 4 |
| `kalnoy/nestedset` | 7 |
| `laravel/tinker` | 3 |
| `predis/predis` | 3 |
| `prettus/l5-repository` | 4 |
| `pestphp/pest` / `phpunit/phpunit` | 5 / 13 |

### 6. Run Database Migrations

```bash
php artisan migrate
```

The release migrations add the association, variant-structure, measurement, publication, passport-template, saved-view, webhook, catalog-scope, SSO, and robot-user schemas; migrate existing associations and integrations; and create indexes on large catalog tables.

::: warning Plan maintenance time
On large catalogs the index creation and data migrations take real time. Run the upgrade during a maintenance window and do not serve traffic until migrations finish.
:::

### 7. Clear Caches and Restart

```bash
php artisan optimize:clear
php artisan storage:link
sudo systemctl restart php8.4-fpm nginx
sudo supervisorctl restart unopim-worker
```

Passports, publications, and webhook deliveries run on dedicated queues — your worker must list them, or that work is queued and never processed:

```bash
php artisan queue:work --queue="system,completeness,publication,webhooks,default"
```

## Breaking Changes

### Runtime and framework

- **PHP 8.4.1+** is required.
- **Laravel 13** replaces Laravel 12, including Symfony 8 components. Custom packages must update overridden method signatures, middleware references, service-provider behavior, and typed contracts.

### OAuth tokens and signing keys

The shared OAuth signing keys distributed with earlier releases are no longer shipped. Each installation now generates its own unique 4096-bit key pair when none exists. Replacing the old pair **invalidates every existing access and refresh token** — all API clients must authenticate again after the upgrade.

### API integration ownership (robot users)

Integration creation no longer accepts `admin_id`. Existing integrations are migrated automatically to dedicated least-privilege **robot users**. Custom clients or extensions that submit or read the assigned administrator must adopt the robot-credentials workflow (one-time credential reveal, password regeneration).

### Variant value storage

Newly created variant children no longer copy inherited parent values into their raw `products.values` JSON. Extensions that read that column directly must use `Product::resolvedValues()` or the `VariantValueResolver` contract to obtain effective values. Two commands help migrate existing catalogs:

```bash
php artisan unopim:variants:strip-redundant
php artisan unopim:variants:resync
```

### Changed admin URLs

Hardcoded admin URLs in extensions or bookmarks must be updated:

| Old | New |
|---|---|
| `catalog/attributegroups/*` | `catalog/attribute-groups/*` |
| `catalog/families/*` | `catalog/attribute-families/*` |
| `settings/data-transfer/*` | `data-transfer/*` |
| `settings/data-transfer/tracker/*` | `data-transfer/job-tracker/*` |
| `integrations/api-keys/*` | `configuration/integrations/*` |
| legacy combined settings page | `configuration/system-settings` hub (`configuration/system/{key}` editors) |

The standalone `admin.catalog.families.create` and `admin.catalog.families.copy` pages were removed in favor of the modal workflow.

### Admin UI extensions and E2E tests

Edit forms now use AJAX navigation and a global unsaved-changes save bar. Extensions or browser tests that depend on full-page reloads, per-form save buttons, or previous DOM IDs and selectors must be updated. See [Frontend Architecture](../architecture/frontend) for the new conventions.

### Webhooks

The single-webhook configuration was replaced by the multi-webhook module. `WebhookSettingsController` and the old `SettingsRepository` were removed; existing settings are migrated to the new model automatically. Extensions must use the new repository — see [Webhooks](../packages/webhooks).

### Docker

- **New Docker environments default to PostgreSQL.** Existing installations must keep their current `COMPOSE_PROFILES`, `DB_CONNECTION`, host, and port values — changing the profile does not migrate MySQL data to PostgreSQL.
- `compose.yaml` now runs UnoPim from the published images and needs no `.env`. The stack that builds from a checkout moved to `compose.dev.yaml` (`compose.dev.apache.yaml` for Apache, `compose.mysql.yaml` for MySQL on the image stack). A bare `docker compose up` in a clone resolves the image stack rather than building.

### Deprecated REST alias

The misspelled `configrable-products` endpoint still works in this release but returns deprecation and successor headers. Move clients to `configurable-products` before the alias is removed in a future release.

### Other API client changes

Permissions are now enforced on reads as well as writes, error responses share a single shape, rate limits are enforced, and `limit` is capped at 100. If you maintain a client built against the v2.x API, work through [Migrating an API Client to v3.0](../api/migrating-your-client) — it covers each change and what the client must do about it.

### Removed classes and services

- `Webkul\Admin\Helpers\Reporting`, `Webkul\Admin\Http\Resources\AttributeResource`, `AttributeOptionResource`, `Webkul\Admin\Listeners\Base`
- `Webkul\Theme\Providers\ModuleServiceProvider`, `Webkul\Theme\Repositories\ThemeCustomizationRepository`
- Admin Blade components `media.file`, `media.videos`, `select.multiselect`
- `spatie/laravel-responsecache`, `config/responsecache.php`, and the `Webkul\FPC` provider — `RESPONSE_CACHE_ENABLED` no longer has any effect
- The `Webkul\Inventory` Composer namespace — extensions must not reference it

## What's New in v3.0.0

Highlights (each links to its developer documentation):

- **[Digital Product Passports](../advanced/digital-product-passport)** — templates, per-locale publishing, QR carriers, GS1 Digital Link, ESPR and EU Battery Regulation presets
- **[Configurable Associations](../packages/configurable-associations)** — custom association types with localized labels and per-link fields
- **[Advanced Variants](../packages/advanced-variants)** — two-level variant structures with inherited values and resolver contracts
- **[Measurements](../packages/measurements)** — measurement families, units, conversions, and precision strategies
- **[Multi-Webhooks](../packages/webhooks)** — multiple endpoints, HMAC delivery, delivery logs
- **[Microsoft SSO](../advanced/microsoft-sso)** — Entra ID login with an extensible provider contract
- **[REST API expansion](../api/)** — full catalog-structure CRUD, media, passports, and delta synchronization
- Redesigned admin with AJAX navigation, dark theme, and unsaved-change tracking
- Product-grid filters, saved views, quick export, and asynchronous mass actions
- A config-driven System Settings hub with package extension hooks

For the complete list, see the [UnoPim CHANGELOG on GitHub](https://github.com/unopim/unopim/blob/master/CHANGELOG.md).

## Post-upgrade Steps

1. **Re-authenticate API clients** — issue new tokens; old ones are invalid.
2. **Test core functionality** — log in, browse products, categories, attributes.
3. **Check error logs** — review `storage/logs/laravel.log`.
4. **Verify queue processing** — confirm workers process the `system`, `completeness`, `webhooks`, and (if passports are enabled) `publication` queues.
5. **Re-index Elasticsearch** — if enabled:

   ```bash
   php artisan unopim:product:index
   php artisan unopim:category:index
   ```

6. **Verify custom packages** — especially anything touching removed classes, changed URLs, webhooks, or raw `products.values` reads.

## Need Help?

- [UnoPim Documentation](https://docs.unopim.com)
- [GitHub Issues](https://github.com/unopim/unopim/issues)
- Contact support at [support@webkul.in](mailto:support@webkul.in)
