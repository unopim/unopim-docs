# CLI Commands

UnoPim provides a set of Artisan commands for managing your PIM installation. This page serves as a quick reference for all available commands. For detailed usage of specific commands, refer to their dedicated documentation pages.

## System Commands

| Command | Description |
|---------|-------------|
| `php artisan unopim:version` | Display the current UnoPim version |
| `php artisan unopim:install` | Run the interactive UnoPim installer |
| `php artisan unopim:publish` | Publish UnoPim assets and config (use `--force` to overwrite) |
| `php artisan unopim:user:create` | Create a default admin user |
| `php artisan unopim:passport:client` | Create an API OAuth client for REST API authentication |
| `php artisan unopim:images:purge-unused` | Remove unused product images from storage |

### UnoPim Version

```bash
php artisan unopim:version
```

Outputs the currently installed UnoPim version number.

### Publish Assets

```bash
# Publish assets and config
php artisan unopim:publish

# Force overwrite existing published files
php artisan unopim:publish --force
```

Use this after updating UnoPim to ensure all assets and configuration files are up to date.

### Create Admin User

```bash
php artisan unopim:user:create
```

Interactively creates a new admin user. See [Creating a New User](../introduction/creating-newuser.html) for more details.

### Create OAuth Client

```bash
php artisan unopim:passport:client
```

Creates an OAuth 2.0 client for API authentication. See [API Authentication](../api/authenticate.html) for more details.

### Purge Unused Images

```bash
# Preview which images would be removed (dry run)
php artisan unopim:images:purge-unused --dry-run

# Actually remove unused images
php artisan unopim:images:purge-unused
```

Scans product image storage and removes images that are no longer associated with any product. Always run with `--dry-run` first to review what will be deleted.

---

## Elasticsearch Indexing

| Command | Description |
|---------|-------------|
| `php artisan unopim:product:index` | Re-index all products in Elasticsearch |
| `php artisan unopim:category:index` | Re-index all categories in Elasticsearch |
| `php artisan unopim:elastic:clear` | Clear all Elasticsearch indices |

For full Elasticsearch setup and configuration, see [Elasticsearch Configuration](./elasticsearch-configuration.html).

---

## Completeness

| Command | Description |
|---------|-------------|
| `php artisan unopim:completeness:recalculate --all` | Recalculate completeness for all products |
| `php artisan unopim:completeness:recalculate --family=ID` | Recalculate for a specific attribute family |
| `php artisan unopim:completeness:recalculate --product=ID` | Recalculate for a single product |
| `php artisan unopim:completeness:recalculate --products=1 --products=2` | Recalculate for specific product IDs |

For more details, see [Queue Management — Completeness](./queue-management.html#completeness-queue).

---

## Dashboard

| Command | Description |
|---------|-------------|
| `php artisan unopim:dashboard:refresh` | Clear dashboard statistics cache so the next page load shows fresh data |

---

## Data Transfer

| Command | Description |
|---------|-------------|
| `php artisan unopim:queue:work <job_id> <user_email>` | Process a specific queued import/export job |

For queue worker setup, scheduling, and job management, see [Queue Management](./queue-management.html).

---

## Queue Worker

Start a queue worker to process background jobs (imports, exports, completeness calculations, notifications):

```bash
php artisan queue:work --queue="default,system,completeness" --sleep=3 --tries=3
```

For production environments, use Supervisor to keep the worker running. See [Configuring Supervisor](../introduction/configuring_supervisor.html).

---

## Cron Setup

UnoPim requires a single cron entry to run the Laravel scheduler:

```bash
crontab -e
```

Add this line (replace `/path/to/unopim` with your actual installation path):

```bash
* * * * * cd /path/to/unopim && php artisan schedule:run >> /dev/null 2>&1
```

The scheduler automatically runs the following tasks:

| Task | Schedule | Description |
|------|----------|-------------|
| `unopim:product:index` | Daily at 00:01 & 12:01 | Elasticsearch product re-indexing |
| `unopim:category:index` | Daily at 00:01 & 12:01 | Elasticsearch category re-indexing |
| `unopim:completeness:recalculate --all` | Daily at 02:00 | Recalculate product completeness scores |
| `unopim:dashboard:refresh` | Every 10 minutes | Refresh dashboard statistics cache |

For more details on scheduling and cron jobs, see [Queue Management — Scheduled Tasks](./queue-management.html#scheduled-tasks-automatic-via-cron).
