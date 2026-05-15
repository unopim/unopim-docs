# Upgrade Guide

## Overview

This guide walks you through upgrading your UnoPim installation from **v2.0.x to v2.1.0**. This is a minor release within the same major version: it adds new features, performance improvements, and security hardening, but contains **no breaking changes** — no PHP or database engine bump, no Laravel framework upgrade, and no `bootstrap/app.php` rewrite.

::: tip
Upgrading across a major version (for example `1.x → 2.x`)? Switch to the **2.0.x** documentation and follow its [Upgrade Guide](/2.0.x/prologue/upgrade-guide), which covers the Laravel 12 and PHP 8.3 migration. Once you are on v2.0.x, return here to move up to v2.1.0.
:::

::: tip
For the generic same-major update process (any `2.0.0 → 2.0.x` patch), see the [Patch / Minor Update Guide](patch-update). This page is the version-specific guide for the **v2.1.0** release.
:::

## Pre-upgrade Checklist

Before starting the upgrade, verify the following:

- [ ] You are currently running **UnoPim v2.0.x** (check the version in `composer.json` or the admin panel footer)
- [ ] **PHP 8.3+**, **Composer 2.x**, and **Node.js 18+** are installed (requirements are unchanged from v2.0.0)
- [ ] You have a complete backup of your database
- [ ] You have a complete backup of your project files (especially `.env`, `storage/`, and any custom packages)
- [ ] All queue workers, cron jobs, and Supervisor processes are stopped
- [ ] You have reviewed the **New in v2.1.0** section below

::: warning
If you are still on **v1.0.0**, do not use this guide. Complete the [v1.x → v2.0.0 upgrade](/2.0.x/prologue/upgrade-guide) first, then return here to upgrade to v2.1.0.
:::

## Upgrade Steps

### 1. Backup Your System

Create a complete backup of your database and project files before proceeding.

```bash
# Backup your database
mysqldump -u your_db_user -p your_db_name > unopim_v2.0_backup.sql

# Backup your project directory
tar -czf unopim_v2.0_files_backup.tar.gz /path/to/current/unopim
```

### 2. Stop Queue Workers and Scheduler

Stop queue workers and the scheduler so they do not pick up jobs against a half-updated codebase.

```bash
# If using Supervisor
sudo supervisorctl stop unopim-worker

# Or, if running queue:work directly, stop the process (Ctrl+C)
```

### 3. Download UnoPim v2.1.0

Download the new release from one of these sources:

- [GitHub Release v2.1.0](https://github.com/unopim/unopim/releases/tag/v2.1.0)
- [Official Website](https://unopim.com/download)

If you track UnoPim with Git, fetch and check out the tag instead:

```bash
git fetch --tags
git checkout v2.1.0
```

### 4. Update Dependencies

Install the updated PHP and frontend dependencies, then rebuild assets:

```bash
cd /path/to/unopim

# Install PHP dependencies
composer install

# Install frontend dependencies and build assets
npm install
npm run build
```

v2.1.0 bumps a few dependencies — `phpseclib/phpseclib` to `3.0.52` and `phpoffice/phpspreadsheet` to `1.30.4`. `composer install` applies these automatically.

### 5. Run Database Migrations

```bash
php artisan migrate
```

v2.1.0 ships schema migrations focused on **query performance**. No tables are dropped and no data is modified:

| Change | Purpose |
|--------|---------|
| Index on `channels.code` | Faster channel lookups by code |
| Index on `locales.status` | Faster filtering of active locales |
| Index on `currencies.status` | Faster filtering of active currencies |
| Composite index on `core_config (code, channel_code, locale_code)` | Faster configuration resolution |
| `webhook_logs.user_id` made nullable | Supports system-triggered webhooks with no associated user |

::: tip
The `add_tone_to_magic_ai_prompts_table` migration now includes a proper `down()` method, so it can be rolled back cleanly if needed.
:::

### 6. Clear Cache and Optimize

Clear all cached configurations and regenerate the storage link:

```bash
php artisan optimize:clear
php artisan storage:link
```

### 7. Update Environment Configuration (Optional)

v2.1.0 adds an optional **IP-based debug filter**. When `APP_DEBUG` is enabled, you can restrict detailed error pages to specific IP addresses by adding `APP_DEBUG_ALLOWED_IPS` to your `.env`:

```ini
APP_DEBUG=true
APP_DEBUG_ALLOWED_IPS=127.0.0.1,203.0.113.10
```

If `APP_DEBUG_ALLOWED_IPS` is empty or omitted, behaviour is unchanged. Leaving it set in production lets you keep debugging enabled for your own IP while everyone else sees a generic error page.

### 8. Restart Queue Workers and Services

v2.1.0 moves two heavy operations onto the queue, so a running worker is now more important than before:

- **`SendProductWebhook`** — product webhooks are dispatched asynchronously instead of blocking the save request.
- **`ImportProductsJob`** — product imports run as a queued job, enabling reliable imports of 10,000+ products.

Both jobs use UnoPim's existing queues, so no change to your `queue:work` command is required — just make sure a worker is running:

```bash
php artisan queue:work --queue="system,completeness,default"
```

If you use **Supervisor**, restart the worker:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart unopim-worker
```

Then restart your web server and PHP-FPM:

```bash
# If using Nginx
sudo systemctl restart nginx

# If using Apache
sudo systemctl restart apache2

# If using PHP-FPM
sudo systemctl restart php8.3-fpm
```

## New in v2.1.0

v2.1.0 is a feature and hardening release. Highlights:

### AI & MagicAI

- **ManageAssociations AI Agent tool** — manage product associations (related, cross-sell, up-sell) through natural language, with clickable product links in the responses.
- **MagicAI Custom Provider** — connect any OpenAI-compatible endpoint through a hardened adapter.
- **MagicAI ModelRecommender** — filters out non-chat model families when fetching the model list, so only compatible models are suggested.
- **PrismErrorResolver** — translates raw AI provider errors into clear, user-friendly messages.

### Performance & Data Processing

- **Async product webhooks** — the `SendProductWebhook` job keeps product save requests fast.
- **Queued product imports** — the `ImportProductsJob` job makes large imports reliable.
- **New database indexes** — faster channel, locale, currency, and configuration lookups.

### Deployment

- **Production-ready Docker setup** — a multi-container stack (Nginx + PHP-FPM) with healthchecks, Redis, Elasticsearch, Mailpit, and OPcache tuning.
- **Demo data seeding** — install sample catalog data with the `--with-demo-data` flag during installation, or via the standalone seeding command, for faster onboarding.

### Security

- **`clean_content()` helper** — XSS sanitisation of user-generated content via HTMLPurifier.
- **IP-based debug filtering** — restrict detailed error output with `APP_DEBUG_ALLOWED_IPS`.
- Fixes for 5 reported vulnerabilities and expanded automated test coverage.

### Dashboard & UX

- **Clickable dashboard product stats** — the dashboard product counters now act as filter chips that link straight to the filtered product grid.

For a complete and detailed list of all changes, please visit the [UnoPim CHANGELOG on GitHub](https://github.com/unopim/unopim/blob/master/CHANGELOG.md).

## Post-upgrade Steps

After completing all upgrade steps, verify your installation:

1. **Test core functionalities** — Log in to the admin panel, browse products, categories, and attributes to ensure everything loads correctly.
2. **Check error logs** — Review `storage/logs/laravel.log` for any errors or deprecation warnings.
3. **Verify queue processing** — Ensure queue workers are running and confirm that the new `SendProductWebhook` and `ImportProductsJob` jobs are processed.
4. **Test product webhooks** — If you use webhooks, save a product and confirm the webhook is delivered asynchronously.
5. **Test product import** — Run a product import and confirm it completes through the queued `ImportProductsJob`.
6. **Test custom packages** — If you have custom packages or integrations, verify they still work as expected.
7. **Re-index Elasticsearch** — If you use Elasticsearch, re-index your data to ensure search results are accurate.

```bash
php artisan unopim:product:index
```

## Need Help?

- [UnoPim Documentation](https://docs.unopim.com)
- [GitHub Issues](https://github.com/unopim/unopim/issues)
- Contact support at [support@webkul.in](mailto:support@webkul.in)
