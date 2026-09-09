# Patch / Minor Update Guide

## Overview

Use this guide to update an existing UnoPim 3.x installation, including **3.0.x → 3.1.0** and subsequent 3.1.x patches. Read the target release notes for migrations, configuration changes, and compatibility requirements before upgrading.

- Moving up to **v3.0.0** from v2.1.x for the first time? Follow the [Upgrade Guide](upgrade-guide) instead — v3.0.0 is a major release with breaking changes, and that guide lists the migrations, queues, and configuration changes it introduces.
- Upgrading across an older major version (for example `1.x → 2.x`)? Use the [2.0.x Upgrade Guide](/2.0/prologue/upgrade-guide) to reach v2.0.x, then the [2.1 Upgrade Guide](/2.1/prologue/upgrade-guide), and only then move to v3.0.0.

::: tip
Always read the [release notes](https://github.com/unopim/unopim/releases) for the target version before applying. Even a patch release may include a new migration, queue, or config key that requires action.
:::

## 1. Backup

Even for a patch update, take a database snapshot and archive your project files. Restore is faster than debugging a partial update.

```bash
# MariaDB
mariadb-dump -u your_db_user -p your_db_name > unopim_pre_patch_backup.sql

# MySQL
mysqldump -u your_db_user -p your_db_name > unopim_pre_patch_backup.sql

# PostgreSQL
pg_dump -U your_db_user your_db_name > unopim_pre_patch_backup.sql

# Project files
tar -czf unopim_pre_patch_files.tar.gz /path/to/unopim
```

## 2. Stop Workers

Stop queue workers and the scheduler so they do not pick up jobs against a half-updated codebase.

```bash
# Supervisor
sudo supervisorctl stop unopim-worker

# Or, if running queue:work directly
php artisan queue:restart
```

## 3. Pull the New Code

### Git-based installs

```bash
cd /path/to/unopim
git fetch --tags
git checkout v3.1.0   # replace with the target 3.1.x tag
```

### Zip / tarball installs

Download the new release archive, extract it next to your existing install, and copy `.env` and `storage/` into the new directory — the same pattern as a major upgrade, just without breaking changes.

::: tip
UnoPim is distributed as an application (`unopim/unopim`), not as a library you require into your own project, so a patch update means replacing the application code — there is no single Composer package to bump. `composer create-project unopim/unopim` installs a fresh copy; the steps above update an existing one.
:::

## 4. Reinstall Dependencies

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

## 5. Run Migrations

```bash
php artisan migrate --force
```

::: tip
`--force` is required in production — it suppresses the "are you sure?" prompt.
:::

## 6. Clear Caches and Republish

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

If the patch ships new published assets (config files, views), republish them:

```bash
php artisan vendor:publish --tag=unopim-config --force
php artisan vendor:publish --tag=unopim-assets --force
```

## 7. Verify Translations

If the patch adds new user-facing strings, every supported locale must contain the new keys. Run the translation check command before promoting the update:

```bash
php artisan unopim:translations:check
```

The command must pass with zero errors. Missing keys indicate the patch shipped without full locale coverage — file an issue or add the translations before deploying to production.

## 8. Re-index Elasticsearch (if schema changed)

Check the release notes — only required when an index mapping changed.

```bash
php artisan unopim:product:index
php artisan unopim:category:index
```

## 9. Restart Services

```bash
sudo systemctl restart php8.4-fpm
sudo systemctl restart nginx        # or apache2
sudo supervisorctl start unopim-worker
```

---

## Docker Patch Update

The flow depends on which stack you run — see [Installation with Docker](../introduction/installation-docker) for the file layout.

### Published image stack (`compose.yaml`)

Pull the new images and re-create the containers:

```bash
cd /path/to/unopim
docker compose pull
docker compose up -d
docker compose exec unopim php artisan migrate --force
docker compose exec unopim php artisan optimize:clear
docker compose exec unopim php artisan queue:restart
```

### Development stack built from a checkout (`compose.dev.yaml`)

Check out the target tag and rebuild:

```bash
cd /path/to/unopim
git fetch --tags
git checkout v3.1.0   # replace with the target 3.1.x tag
docker compose -f compose.dev.yaml up -d --build
docker compose -f compose.dev.yaml exec unopim-fpm php artisan migrate --force
docker compose -f compose.dev.yaml exec unopim-fpm php artisan optimize:clear
docker compose -f compose.dev.yaml exec unopim-fpm php artisan queue:restart
```

::: warning A bare `docker compose` no longer builds
Since v3.0.0, `docker compose up` in a clone resolves `compose.yaml` and pulls published images. Building from your checkout requires `-f compose.dev.yaml`.
:::

---

## Rollback

If a patch update breaks your environment, restore the previous codebase and database dump:

```bash
# Restore files
tar -xzf unopim_pre_patch_files.tar.gz -C /

# Restore database — MySQL
mysql -u your_db_user -p your_db_name < unopim_pre_patch_backup.sql

# Restore database — PostgreSQL
psql -U your_db_user your_db_name < unopim_pre_patch_backup.sql

# Restart services
sudo systemctl restart php8.4-fpm nginx
sudo supervisorctl restart unopim-worker
```

::: warning
Rolling back **after** running new migrations may leave the database with extra columns or tables. Always test patch updates on staging first, and prefer rolling forward (fixing the issue) over rolling back in production.
:::

## Need Help?

- [UnoPim Documentation](https://docs.unopim.com)
- [GitHub Issues](https://github.com/unopim/unopim/issues)
- Contact support at [support@webkul.in](mailto:support@webkul.in)
