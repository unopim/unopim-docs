# Queue Management


This guide explains how to manage import/export jobs using terminal commands and cron scheduling.

## Running Jobs via Terminal

### Processing Single Jobs
To run a specific import or export job:

```bash
# Format: php artisan unopim:queue:work <job_id> <user_email> [options]
php artisan unopim:queue:work 1 admin@example.com

# With additional options
php artisan unopim:queue:work 1 admin@example.com --queue=custom-queue --timeout=120 --tries=3
```

Required parameters:
- `job_id`: ID of the import/export job (required)
- `user_email`: The email of the unopim user executing the job (required)

Optional parameters:
- `--queue`: Specify custom queue name
- `--name`: Worker name (default: 'single')
- `--memory`: Memory limit in MB (default: 128)
- `--timeout`: Job timeout in seconds (default: 60)
- `--tries`: Number of retry attempts (default: 1)

::: warning Important
Both `job_id` and `user_email` are required parameters. The command will fail if either is missing or invalid.
:::

### Managing Queue Workers
Basic queue management commands:

```bash
# Start the queue worker
php artisan queue:work --queue="system,completeness,default"

# Restart queue workers (after code changes)
php artisan queue:restart

# Stop running queue workers
php artisan queue:stop
```

## Scheduling Jobs with Cron

### Basic Setup
1. Configure your crontab:
```bash
crontab -e
```

2. Add the UnoPim scheduler:
```bash
* * * * * cd /path/to/unopim && php artisan schedule:run >> /var/log/unopim/scheduler.log 2>&1
```
### Scheduling a Single Job

To schedule a specific import/export job, add a cron entry that runs the `unopim:queue:work` command directly:
- Assuming the job ID is 1 and the user email is admin@example.com (replace with your values), schedule it to run every hour.

```bash
0 * * * * cd /path/to/unopim && php artisan unopim:queue:work 1 admin@example.com >> /var/log/unopim/job-1.log 2>&1
```

::: warning Important Notes
1. Always provide valid job ID and user email
2. User must exist in the system
3. Queue workers cache code, restart after changes:
```bash
php artisan queue:restart
```
:::

## Completeness Queue

New in v2.0.0, product completeness calculations are processed through a dedicated **`completeness`** queue. This ensures that completeness score recalculations do not block default or system queue workers, especially during bulk product updates.

When starting your queue worker, include the `completeness` queue alongside the default queues:

```bash
php artisan queue:work --queue="system,completeness,default"
```

If you are using Supervisor, update your configuration to include the `completeness` queue in the `--queue` argument (see [Configuring Supervisor](../introduction/configuring_supervisor.html)).

### Completeness Recalculation Commands

You can manually trigger completeness recalculation using the following commands:

```bash
# Recalculate completeness for all products
php artisan unopim:completeness:recalculate --all

# Recalculate completeness for a specific attribute family
php artisan unopim:completeness:recalculate --family=ID

# Recalculate completeness for a single product
php artisan unopim:completeness:recalculate --product=ID

# Recalculate completeness for specific product IDs
php artisan unopim:completeness:recalculate --products=1 --products=2
```

| Option | Description |
|--------|-------------|
| `--all` | Recalculate completeness for all products |
| `--family=ID` | Recalculate for all products in a specific attribute family |
| `--product=ID` | Recalculate for a single product by ID |
| `--products=ID` | Recalculate for multiple specific product IDs (repeat the option for each ID) |

::: tip
The `--all` option dispatches completeness jobs to the `completeness` queue, so ensure your queue worker is running with the `completeness` queue included.
:::

## Dashboard Cache

To clear the dashboard statistics cache so the next page load shows fresh data, run:

```bash
php artisan unopim:dashboard:refresh
```

This is useful when dashboard statistics appear stale or after bulk data operations.

---

## Scheduled Tasks (Automatic via Cron)

When the Laravel scheduler is configured (see [Scheduling Jobs with Cron](#scheduling-jobs-with-cron)), the following tasks run automatically:

| Task | Schedule | Description |
|------|----------|-------------|
| `unopim:product:index` | Daily at 00:01 & 12:01 | Elasticsearch product re-indexing |
| `unopim:category:index` | Daily at 00:01 & 12:01 | Elasticsearch category re-indexing |
| `unopim:completeness:recalculate --all` | Daily at 02:00 | Recalculate product completeness scores |
| `unopim:dashboard:refresh` | Every 10 minutes | Refresh dashboard statistics cache |

::: tip
These tasks require the cron entry for `php artisan schedule:run` to be active. See [Basic Setup](#basic-setup) above.
:::

---

## Notifications

### Completeness Notifications

When a bulk completeness calculation finishes, all admin users with full permissions are notified via:

1. **UI notification** — appears in the notification bell in the admin panel.
2. **Email notification** — sent if SMTP mail is configured in your `.env` file.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NOTIFICATIONS_ENABLED` | `true` | Enable or disable all notifications |
| `COMPLETENESS_QUEUE` | `system` | Queue name for completeness jobs |

---

## Pause, Resume, and Cancel Controls

Import and export jobs in v2.0.0 support **pause**, **resume**, and **cancel** controls. These controls are available both in the admin UI and through the job management commands, allowing administrators to:

- **Pause** a running import or export job to temporarily halt processing without losing progress.
- **Resume** a paused job to continue from where it left off.
- **Cancel** a job to stop it entirely and release queue resources.
