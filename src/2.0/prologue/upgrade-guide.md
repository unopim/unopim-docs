# Upgrade Guide

## Overview

This guide walks you through upgrading your UnoPim installation from **v1.0.0 to v2.0.0**. This is a major release that upgrades the underlying framework from Laravel 10 to Laravel 12 and raises the minimum PHP version to 8.3. Several internal APIs have changed, so please read the [Breaking Changes](#breaking-changes) section carefully before you begin.

::: tip
Applying a same-major-version update (for example `2.0.0 → 2.0.3` or `2.0.x → 2.1.0`)? See the [Patch / Minor Update Guide](patch-update) instead — that flow is shorter and contains no breaking changes.
:::

::: warning
UnoPim v2.0.0 contains breaking changes. If you have custom packages, middleware, or service providers, review every section of this guide before upgrading.
:::

## Pre-upgrade Checklist

Before starting the upgrade, verify the following:

- [ ] **PHP 8.3+** is installed on your server (`php -v`)
- [ ] **MySQL 8.0.32+** or **PostgreSQL 14.x** is available
- [ ] **Elasticsearch 8.17+** is running (if you use search indexing)
- [ ] **Composer 2.x** is installed
- [ ] **Node.js 18+** and **npm** are installed (for frontend assets)
- [ ] You have a complete backup of your database
- [ ] You have a complete backup of your project files (especially `.env`, `storage/`, and any custom packages)
- [ ] All queue workers, cron jobs, and Supervisor processes are stopped
- [ ] You have reviewed the [Breaking Changes](#breaking-changes) section below

## Upgrade Steps

### 1. Backup Your System

Create a complete backup of your database and project files before proceeding.

```bash
# Backup your database
mysqldump -u your_db_user -p your_db_name > unopim_v1_backup.sql

# Backup your project directory
tar -czf unopim_v1_files_backup.tar.gz /path/to/current/unopim
```

### 2. Download UnoPim v2.0.0

Download the new release from one of these sources:

- [GitHub Release v2.0.0](https://github.com/unopim/unopim/releases/tag/v2.0.0)
- [Official Website](https://unopim.com/download)

```bash
# Extract the new version
unzip unopim-2.0.0.zip
```

### 3. Copy Configuration and Storage

Copy your existing `.env` file and storage directory from your current installation to the new `unopim-2.0.0` folder:

```bash
# Copy your environment file
cp /path/to/current/unopim/.env unopim-2.0.0/

# Copy storage directory (uploaded files, logs, etc.)
cp -r /path/to/current/unopim/storage/* unopim-2.0.0/storage/
```

::: tip Note
The upgrade will be completed inside the new `unopim-2.0.0` folder. After a successful upgrade and testing, you can either rename the new folder to replace your current installation, move it to your desired path, or update your web server configuration to point to the new directory.
:::

### 4. Update PHP Version

UnoPim v2.0.0 requires **PHP 8.3 or higher**. If you are running PHP 8.2, you must upgrade PHP before continuing.

```bash
# Verify PHP version
php -v
# Expected output: PHP 8.3.x or higher
```

### 5. Install Dependencies

Navigate to the new UnoPim directory and install all PHP and frontend dependencies:

```bash
cd unopim-2.0.0

# Install PHP dependencies
composer install

# Install frontend dependencies and build assets
npm install
npm run build
```

### 6. Run Database Migrations

UnoPim v2.0.0 introduces 8 new database tables. Run the migration command to update your database schema:

```bash
php artisan migrate
```

The following new tables will be created:

| Table | Purpose |
|-------|---------|
| `ai_agent_token_usage` | Tracks AI agent token consumption |
| `ai_agent_conversations` | Stores AI agent chat conversations |
| `ai_agent_messages` | Stores individual AI agent messages |
| `ai_agent_memories` | Persists AI agent context memory |
| `ai_agent_changesets` | Records changes made by AI agents |
| `ai_agent_tasks` | Tracks AI agent task execution |
| `magic_ai_platforms` | Stores MagicAI platform configurations |

### 7. Clear Cache and Optimize

Clear all cached configurations and regenerate the storage link:

```bash
php artisan optimize:clear
php artisan storage:link
```

### 8. Update Queue Worker Configuration

UnoPim v2.0.0 introduces a dedicated `completeness` queue for product data quality scoring. Update your queue worker command to include this new queue:

```bash
php artisan queue:work --queue="system,completeness,default"
```

If you are using **Supervisor**, update your Supervisor configuration file:

```ini
[program:unopim-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/unopim-2.0.0/artisan queue:work --queue="system,completeness,default" --sleep=3 --tries=3
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/unopim-2.0.0/storage/logs/worker.log
```

Then restart Supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl restart unopim-worker
```

### 9. Restart Services

Restart your web server and any other related services:

```bash
# If using Nginx
sudo systemctl restart nginx

# If using Apache
sudo systemctl restart apache2

# If using PHP-FPM
sudo systemctl restart php8.3-fpm
```

## Breaking Changes

### PHP 8.3 Required

UnoPim v2.0.0 requires PHP 8.3 as the minimum version. PHP 8.2 is no longer supported. Update your server's PHP installation before upgrading.

### Laravel 12 Bootstrap Changes

Laravel 12 replaces the `Kernel.php`-based architecture with a fluent `Application::configure()` API in `bootstrap/app.php`. The following files have been removed:

- `app/Http/Kernel.php`
- `app/Console/Kernel.php`
- Individual middleware files under `app/Http/Middleware/`
- Legacy service providers under `app/Providers/`

**Service providers** are now registered in `bootstrap/providers.php` instead of `config/app.php`.

#### Migrating Custom Middleware

If you registered custom middleware in `app/Http/Kernel.php`, you must move those registrations to `bootstrap/app.php`.

**Before (v1.0.0 — Laravel 10):**

```php
// app/Http/Kernel.php
class Kernel extends HttpKernel
{
    protected $middleware = [
        \App\Http\Middleware\CustomGlobalMiddleware::class,
    ];

    protected $middlewareGroups = [
        'admin' => [
            \App\Http\Middleware\CustomAdminMiddleware::class,
        ],
    ];

    protected $middlewareAliases = [
        'custom' => \App\Http\Middleware\CustomMiddleware::class,
    ];
}
```

**After (v2.0.0 — Laravel 12):**

```php
// bootstrap/app.php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\App\Http\Middleware\CustomGlobalMiddleware::class);

        $middleware->appendToGroup('admin', [
            \App\Http\Middleware\CustomAdminMiddleware::class,
        ]);

        $middleware->alias([
            'custom' => \App\Http\Middleware\CustomMiddleware::class,
        ]);
    })
    ->create();
```

#### Migrating Custom Service Providers

If you registered custom service providers in `config/app.php`, move them to `bootstrap/providers.php`.

**Before (v1.0.0):**

```php
// config/app.php
'providers' => [
    // ...
    App\Providers\CustomServiceProvider::class,
],
```

**After (v2.0.0):**

```php
// bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\CustomServiceProvider::class,
];
```

### MagicAI Provider Classes Replaced

The individual MagicAI provider classes have been removed and replaced by a unified adapter that leverages the `laravel/ai` package. If your custom code references any of the old provider classes, you must update those references.

**Removed classes:**

- `Webkul\MagicAI\Services\OpenAI`
- `Webkul\MagicAI\Services\Gemini`
- `Webkul\MagicAI\Services\Groq`
- `Webkul\MagicAI\Services\Ollama`

**Replacement:**

- `Webkul\MagicAI\Services\LaravelAiAdapter`

**Before (v1.0.0):**

```php
use Webkul\MagicAI\Services\OpenAI;

$service = new OpenAI();
$result = $service->generateContent($prompt);
```

**After (v2.0.0):**

```php
use Webkul\MagicAI\Services\LaravelAiAdapter;

$service = app(LaravelAiAdapter::class);
$result = $service->generateContent($prompt);
```

::: tip
The `LaravelAiAdapter` supports 10+ AI providers (OpenAI, Gemini, Groq, Ollama, Anthropic, and more) through a single unified interface. Provider selection is handled via the admin configuration panel.
:::

### ImageManager Replaced

The `ImageManager` class has been replaced with `ImageCache`, a more performant image processing system.

The new `ImageCache` system introduces several improvements:

- **Deferred execution** — Images are only processed when actually requested, rather than eagerly on upload. This reduces server load during import and bulk-update operations.
- **Closure hashing** — Transformation closures are hashed to generate deterministic cache keys, ensuring that identical transformations are never processed twice.
- **ETag support** — HTTP responses include `ETag` and `Cache-Control` headers, allowing browsers and CDNs to serve cached images without hitting the server again.

**Before (v1.0.0):**

```php
use Webkul\Core\ImageCache\ImageManager;
```

**After (v2.0.0):**

```php
use Webkul\Core\ImageCache\ImageCache;
```

### API ACL Expanded

Two new ACL permission nodes have been added for API access:

- `api.catalog.products.delete`
- `api.catalog.categories.delete`

If you use custom API roles, review your role permissions to ensure they include or exclude these new nodes as needed.

### Dependency Version Changes

The following dependencies have been updated or added. If your custom packages depend on any of these, update your `composer.json` accordingly:

| Package | v1.0.0 | v2.0.0 |
|---------|--------|--------|
| `laravel/framework` | ^10.0 | ^12.0 |
| `laravel/sanctum` | ^3.0 | ^4.0 |
| `diglactic/laravel-breadcrumbs` | ^9.0 | ^10.0 |
| `pestphp/pest` | ^2.0 | ^3.0 |
| `phpunit/phpunit` | ^10.0 | ^11.0 |
| `nunomaduro/collision` | ^7.0 | ^8.0 |

**New dependencies in v2.0.0:**

| Package | Version | Purpose |
|---------|---------|---------|
| `laravel/ai` | ^0.3.2 | Unified AI provider abstraction |
| `laravel/boost` | ^2.1 | Performance and developer tooling |
| `prism-php/prism` | latest | AI model orchestration |

### PostgreSQL Migration Compatibility

MagicAI migrations in v1.0.0 used MySQL-only `MODIFY COLUMN ... ENUM()` syntax, which fails on PostgreSQL. In v2.0.0, these migrations now detect the database driver at runtime and use PostgreSQL-compatible `ALTER COLUMN ... TYPE VARCHAR` with `CHECK` constraints when running on PostgreSQL.

::: warning
If you have written **custom migrations** that use MySQL `ENUM()` syntax (e.g., `DB::statement('ALTER TABLE ... MODIFY COLUMN ... ENUM(...)'))`), review them for PostgreSQL compatibility before upgrading. Use `Schema::getConnection()->getDriverName()` to branch between MySQL and PostgreSQL DDL statements.
:::

## Post-upgrade Steps

After completing all upgrade steps, verify your installation:

1. **Test core functionalities** — Log in to the admin panel, browse products, categories, and attributes to ensure everything loads correctly.
2. **Verify file permissions** — Ensure the `storage/` and `bootstrap/cache/` directories are writable by the web server.
3. **Check error logs** — Review `storage/logs/laravel.log` for any errors or deprecation warnings.
4. **Test API endpoints** — If you use the REST API, verify that authentication and CRUD operations work as expected.
5. **Verify queue processing** — Ensure queue workers are processing jobs on all three queues (`default`, `system`, `completeness`).
6. **Test custom packages** — If you have custom packages or integrations, thoroughly test them against the new version.
7. **Re-index Elasticsearch** — If you use Elasticsearch, re-index your data to ensure search results are accurate.

```bash
php artisan unopim:product:index
```

## New Features in v2.0.0

UnoPim v2.0.0 introduces several major features alongside the framework upgrade:

- **AI Agent Chat** — A conversational AI assistant with 32+ PIM-specific tools for managing products, categories, attributes, and more directly through natural language.
- **Multi-Platform MagicAI** — Content generation powered by 10+ AI providers (OpenAI, Gemini, Groq, Ollama, Anthropic, and more) through a unified adapter.
- **Swatch Types for Attributes** — Visual swatch support (color, image, text) for product attributes, enabling richer catalog experiences.
- **Enhanced Dashboard** — A redesigned admin dashboard with improved analytics, quick actions, and at-a-glance product data insights.
- **Import/Export Tracker** — Real-time progress tracking for import and export jobs with pause, resume, and cancel capabilities.
- **Completeness Queue** — A dedicated queue for product completeness scoring, improving performance by offloading quality calculations from the main queue.
- **AI Translation Workflow** — Bulk-translate product attribute values across all configured locales using your chosen AI provider. Translations are dispatched from the admin panel and processed by the `SaveTranslatedDataJob` and `SaveTranslatedAllAttributesJob` background jobs. This eliminates the need to manually translate product data locale by locale.

For a complete and detailed list of all changes, new features, bug fixes, and improvements, please visit the [UnoPim CHANGELOG on GitHub](https://github.com/unopim/unopim/blob/master/CHANGELOG.md).

## Need Help?

- [UnoPim Documentation](https://docs.unopim.com)
- [GitHub Issues](https://github.com/unopim/unopim/issues)
- Contact support at [support@webkul.in](mailto:support@webkul.in)
