# Patch / Minor Update Guide

## Overview

Use this guide for updates within the **same major version** — for example `2.0.0 → 2.0.3` or `2.0.x → 2.1.0`. These releases are backwards compatible: no breaking API changes, no PHP or database engine bumps, and no `bootstrap/app.php` rewrites.

If you are upgrading across a major version (for example `1.x → 2.x`), follow the [Upgrade Guide](upgrade-guide) instead.

::: tip
Always read the [release notes](https://github.com/unopim/unopim/releases) for the target version before applying. Even a patch release may include a new migration, queue, or config key that requires action.
:::

## 1. Backup

Even for a patch update, take a database snapshot and archive your project files. Restore is faster than debugging a partial update.

```bash
mysqldump -u your_db_user -p your_db_name > unopim_pre_patch_backup.sql
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
git checkout v2.0.x   # replace with the target tag
```

### Composer-based installs

```bash
composer update unopim/core --with-dependencies
```

### Zip / tarball installs

Download the new release archive, extract it next to your existing install, and copy `.env` and `storage/` into the new directory — the same pattern as a major upgrade, just without breaking changes.

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
```

## 9. Restart Services

```bash
sudo systemctl restart php8.3-fpm
sudo systemctl restart nginx        # or apache2
sudo supervisorctl start unopim-worker
```

---

## Docker Patch Update

For Docker-based installs the flow collapses into a few commands:

```bash
cd /path/to/unopim
git fetch --tags
git checkout v2.0.x
docker compose build
docker compose up -d
docker compose exec unopim-fpm php artisan migrate --force
docker compose exec unopim-fpm php artisan optimize:clear
docker compose exec unopim-fpm php artisan queue:restart
```

For the Docker Hub setup, simply pull the new image:

```bash
docker compose -f docker-compose.hub.yml pull
docker compose -f docker-compose.hub.yml up -d
```

---

## Rollback

If a patch update breaks your environment, restore the previous codebase and database dump:

```bash
# Restore files
tar -xzf unopim_pre_patch_files.tar.gz -C /

# Restore database
mysql -u your_db_user -p your_db_name < unopim_pre_patch_backup.sql

# Restart services
sudo systemctl restart php8.3-fpm nginx
sudo supervisorctl restart unopim-worker
```

::: warning
Rolling back **after** running new migrations may leave the database with extra columns or tables. Always test patch updates on staging first, and prefer rolling forward (fixing the issue) over rolling back in production.
:::

## Need Help?

- [UnoPim Documentation](https://docs.unopim.com)
- [GitHub Issues](https://github.com/unopim/unopim/issues)
- Contact support at [support@webkul.in](mailto:support@webkul.in)
