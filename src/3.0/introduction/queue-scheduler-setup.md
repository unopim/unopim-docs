# Queue & Scheduler Setup

## Overview

UnoPim uses Laravel's queue system for background processing of imports, exports, completeness calculations, and other asynchronous tasks. The scheduler handles periodic tasks like cache cleanup and scheduled exports.

This guide covers setting up Supervisor for queue workers and cron for the scheduler on bare-metal installations.

::: tip Docker Users
If you are running UnoPim with Docker, queue workers and the scheduler are configured inside the container. You do not need to follow this guide. See the [Docker installation guide](installation-docker) for container-specific queue configuration.
:::

---

## Queue Driver Configuration

UnoPim supports multiple queue drivers. Configure the driver in your `.env` file.

### Redis (Recommended)

Redis is the recommended queue driver for production. It provides fast, reliable message queuing with minimal overhead.

```dotenv
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
```

Make sure Redis is installed and running:

```bash
redis-cli ping   # Should return PONG
```

### Database

The database driver stores jobs in a database table. It requires no additional infrastructure but is slower than Redis.

```dotenv
QUEUE_CONNECTION=database
```

UnoPim ships the `jobs`, `job_batches`, and `failed_jobs` migrations, so switching driver needs no extra table — just run any pending migrations:

```bash
php artisan migrate
```

### Sync (Development Only)

The sync driver processes jobs immediately during the request. This is useful for development and debugging but should never be used in production.

```dotenv
QUEUE_CONNECTION=sync
```

::: warning
The `sync` driver blocks the HTTP request until the job finishes. Long-running jobs like imports and exports will cause timeouts. Always use `redis` or `database` in production.
:::

---

## Queue Worker with Supervisor

Supervisor is a process control system that keeps queue workers running and restarts them if they fail.

### Install Supervisor

**Ubuntu / Debian:**
```bash
sudo apt install -y supervisor
```

**CentOS / RHEL:**
```bash
sudo dnf install -y supervisor
sudo systemctl enable supervisord
sudo systemctl start supervisord
```

### Supervisor Configuration

**Ubuntu / Debian** - create `/etc/supervisor/conf.d/unopim-worker.conf`:

```bash
sudo nano /etc/supervisor/conf.d/unopim-worker.conf
```

```ini
[program:unopim-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/unopim/artisan queue:work redis --queue=system,completeness,publication,webhooks,default --tries=3 --timeout=90 --max-jobs=1000 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/unopim-worker.log
stopwaitsecs=3600
```

**CentOS / RHEL** - create `/etc/supervisord.d/unopim-worker.ini`:

```bash
sudo nano /etc/supervisord.d/unopim-worker.ini
```

```ini
[program:unopim-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/unopim/artisan queue:work redis --queue=system,completeness,publication,webhooks,default --tries=3 --timeout=90 --max-jobs=1000 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=nginx
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/unopim-worker.log
stopwaitsecs=3600
```

### Configuration Options Explained

| Option | Value | Description |
|--------|-------|-------------|
| `--queue` | `system,completeness,publication,webhooks,default` | Queue names in priority order. `publication` carries passport publishing and `webhooks` carries webhook deliveries — omit either and that work queues up unprocessed. |
| `--tries` | `3` | Maximum number of attempts before a job is marked as failed |
| `--timeout` | `90` | Maximum seconds a job can run before being killed |
| `--max-jobs` | `1000` | Restart the worker after processing 1000 jobs (prevents memory leaks) |
| `--max-time` | `3600` | Restart the worker after running for 1 hour |
| `numprocs` | `2` | Number of parallel worker processes |
| `stopasgroup` | `true` | Stop all child processes when the worker is stopped |
| `killasgroup` | `true` | Kill all child processes when the worker is killed |

### Start the Workers

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start unopim-worker:*
```

### Common Supervisor Commands

```bash
# Check worker status
sudo supervisorctl status

# Restart workers (after code deployment)
sudo supervisorctl restart unopim-worker:*

# Stop workers
sudo supervisorctl stop unopim-worker:*

# View worker logs
sudo tail -f /var/log/supervisor/unopim-worker.log
```

::: warning
After deploying new code, always restart queue workers so they pick up the latest changes:
```bash
sudo supervisorctl restart unopim-worker:*
```
:::

---

## Cron Scheduler Setup

The Laravel scheduler runs periodic tasks every minute. UnoPim uses it for cache cleanup, scheduled exports, and other maintenance tasks.

### Add the Cron Entry

**Ubuntu / Debian** (user: `www-data`):

```bash
sudo crontab -u www-data -e
```

**CentOS / RHEL** (user: `nginx`):

```bash
sudo crontab -u nginx -e
```

Add the following line:

```
* * * * * cd /var/www/unopim && php artisan schedule:run >> /dev/null 2>&1
```

### Verify the Cron Entry

```bash
# Ubuntu / Debian
sudo crontab -u www-data -l

# CentOS / RHEL
sudo crontab -u nginx -l
```

### View Scheduled Tasks

To see which tasks are scheduled:

```bash
cd /var/www/unopim
php artisan schedule:list
```

---

## Monitoring Failed Jobs

When a queued job fails after exhausting all retry attempts, it is stored in the `failed_jobs` table (prefixed, if you set `DB_PREFIX`).

### List Failed Jobs

```bash
cd /var/www/unopim
php artisan queue:failed
```

### Retry a Failed Job

```bash
# Retry a specific job by ID
php artisan queue:retry <job-id>

# Retry all failed jobs
php artisan queue:retry all
```

### Delete Failed Jobs

```bash
# Delete a specific failed job
php artisan queue:forget <job-id>

# Delete all failed jobs
php artisan queue:flush
```

### Monitor Queue Size

Check how many jobs are pending in each queue:

```bash
# With Redis driver
redis-cli LLEN queues:system
redis-cli LLEN queues:completeness
redis-cli LLEN queues:publication
redis-cli LLEN queues:webhooks
redis-cli LLEN queues:default
```

---

## Troubleshooting

### Workers not processing jobs

1. Check that the queue driver in `.env` matches the `--connection` in the Supervisor config:
   ```bash
   grep QUEUE_CONNECTION /var/www/unopim/.env
   ```

2. Verify Supervisor is running:
   ```bash
   sudo systemctl status supervisor     # Ubuntu/Debian
   sudo systemctl status supervisord    # CentOS/RHEL
   ```

3. Check worker logs:
   ```bash
   sudo tail -f /var/log/supervisor/unopim-worker.log
   ```

### Jobs failing immediately

1. Check the Laravel log for errors:
   ```bash
   tail -f /var/www/unopim/storage/logs/laravel.log
   ```

2. List failed jobs and inspect the error message:
   ```bash
   php artisan queue:failed
   ```

### Workers consuming too much memory

Reduce the `--max-jobs` value or add `--memory=128` to limit memory usage per worker:

```ini
command=php /var/www/unopim/artisan queue:work redis --queue=system,completeness,publication,webhooks,default --tries=3 --timeout=90 --max-jobs=500 --max-time=3600 --memory=128
```

### Scheduler not running

1. Verify the cron entry exists:
   ```bash
   sudo crontab -u www-data -l   # Ubuntu/Debian
   sudo crontab -u nginx -l      # CentOS/RHEL
   ```

2. Check that the cron service is running:
   ```bash
   sudo systemctl status cron      # Ubuntu/Debian
   sudo systemctl status crond     # CentOS/RHEL
   ```

3. Test the scheduler manually:
   ```bash
   cd /var/www/unopim
   php artisan schedule:run
   ```

### Redis connection refused

1. Verify Redis is running:
   ```bash
   sudo systemctl status redis-server   # Ubuntu/Debian
   sudo systemctl status redis          # CentOS/RHEL
   ```

2. Test the connection:
   ```bash
   redis-cli ping
   ```

3. Check `.env` Redis settings match the actual Redis configuration.
