# CLI Commands

UnoPim provides a set of Artisan commands for managing your PIM installation. This page is the complete v3.0 reference. For deep dives, follow the links to each feature's documentation.

## Installation & System

| Command | Description |
|---------|-------------|
| `php artisan unopim:install` | Interactive installer (`--skip-env-check`, `--skip-admin-creation`, `--with-demo-data`) |
| `php artisan unopim:upgrade --dry-run` | Upgrade advisor — reports which v3.0 breaking changes apply to this installation. Run without `--dry-run` to execute the upgrade tasks |
| `php artisan unopim:install:demo-data` | Seed the sample catalog (`--force` to re-seed, `--scale=large` for a 2,000-product performance dataset) |
| `php artisan unopim:version` | Display the current UnoPim version |
| `php artisan unopim:publish` | Publish UnoPim assets and config (`--force` to overwrite) |
| `php artisan unopim:user:create` | Create an admin user (`--name`, `--email`, password, UI locale, timezone, admin flag) |
| `php artisan unopim:images:purge-unused` | Remove unused images from storage (`--dry-run` to preview) |
| `php artisan unopim:translations:check` | Audit translation files across all packages against the `en_US` canonical set (`--locale=`, `--package=`) |

## Search Indexing (Elasticsearch)

| Command | Description |
|---------|-------------|
| `php artisan unopim:product:index` | Index all products into Elasticsearch |
| `php artisan unopim:category:index` | Index all categories into Elasticsearch |
| `php artisan unopim:elastic:clear` | Delete this project's Elasticsearch indexes |

## Catalog Maintenance

| Command | Description |
|---------|-------------|
| `php artisan unopim:completeness:recalculate` | Recalculate product completeness (`--family=`, `--product=`, or all) |
| `php artisan unopim:variants:strip-redundant` | <Badge type="tip" text="3.0" /> Remove child attribute values that duplicate an inherited ancestor value. Dry-run by default — pass `--apply` to write, `--product=` to scope |
| `php artisan unopim:variants:resync` | <Badge type="tip" text="3.0" /> Rebuild derived data (completeness, search index) for variant subtrees (`--product=`, `--all`) |
| `php artisan measurement:recalculate` | <Badge type="tip" text="3.0" /> Rebuild the stored base value of every product measurement from current family definitions (`--family=`, `--chunk=200`) |
| `php artisan unopim:dashboard:refresh` | Refresh the dashboard statistics cache |

## Digital Product Passports

| Command | Description |
|---------|-------------|
| `php artisan unopim:passport:install-preset` | <Badge type="tip" text="3.0" /> Install ready-made passport templates (ESPR, EU Battery Regulation) from the `passport_presets` config. Idempotent — existing templates are never overwritten. `--preset=` may be repeated |

See [Digital Product Passport](digital-product-passport) for the preset config shape.

## Webhooks

| Command | Description |
|---------|-------------|
| `php artisan webhook:logs:prune` | <Badge type="tip" text="3.0" /> Delete webhook delivery logs older than the retention window (`--days=`) |

## Data Transfer & Queues

| Command | Description |
|---------|-------------|
| `php artisan unopim:queue:work {jobId} {userEmailId}` | Process a specific import/export job on the queue |
| `php artisan unopim:data-transfer:reap-stalled` | Fail import/export jobs whose worker died without reporting back |

## API

| Command | Description |
|---------|-------------|
| `php artisan unopim:passport:client` | Create a password-grant OAuth client (`--user_name=<admin email>`, `--name=`, `--provider=`). Despite the name, this is the REST API client command, unrelated to Digital Product Passports |

## AI Agent

| Command | Description |
|---------|-------------|
| `php artisan ai-agent:embeddings:index` | <Badge type="tip" text="3.0" /> Queue (re)indexing of product embeddings into the AI vector store (`--since=`, `--batch=`) |
| `php artisan ai-agent:quality-monitor` | Scan the catalog for data-quality issues (`--channel=`, `--locale=`) |
| `php artisan ai-agent:cleanup` | Clean up temporary AI files (`--days=7`, `--dry-run`) |

## Scheduled Commands

The scheduler (`bootstrap/app.php`) runs these automatically — all `onOneServer()`, `withoutOverlapping()`, `runInBackground()`:

| Command | Schedule |
|---------|----------|
| `unopim:product:index` | Twice daily (00:01, 12:01) |
| `unopim:category:index` | Twice daily (00:01, 12:01) |
| `unopim:completeness:recalculate --all` | Daily at 02:00 |
| `unopim:dashboard:refresh` | Every 10 minutes |
| `unopim:data-transfer:reap-stalled` | Every 5 minutes |

Make sure the scheduler is running:

```bash
* * * * * cd /path/to/unopim && php artisan schedule:run >> /dev/null 2>&1
```

## Queue Workers

Most heavy work is queued. A production worker should listen on every queue in use:

```bash
php artisan queue:work --queue="system,completeness,publication,default"
```

The `publication` queue (new in 3.0) carries all Digital Product Passport publishing, bulk transitions, and view-count aggregation. See [Queue Management](queue-management) for Supervisor configuration.
