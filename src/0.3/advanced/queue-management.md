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
php artisan queue:work

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