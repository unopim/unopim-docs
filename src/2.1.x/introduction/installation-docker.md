# Installation with Docker

## Overview

Docker provides the easiest way to get UnoPim up and running. The Docker setup includes all required services — PHP, Nginx/Apache, MySQL, Redis, Elasticsearch, queue workers, and a task scheduler.

::: tip
If you are deploying UnoPim on bare metal (without Docker), see the platform-specific guides instead:
- [Ubuntu 24.04](installation-ubuntu)
- [Debian 12](installation-debian)
- [CentOS / RHEL 9](installation-centos)
:::

## Prerequisites

Make sure the following are installed on your system:

* **Docker** (v20.10+)
* **Docker Compose** (v2.0+ — included with Docker Desktop)

Verify installation:

```bash
docker --version
docker compose version
```

## Quick Start (Docker Hub)

This is the **fastest way** to get UnoPim running — no cloning or building required.

```bash
curl -O https://raw.githubusercontent.com/unopim/unopim/2.0/docker-compose.hub.yml
curl -O https://raw.githubusercontent.com/unopim/unopim/2.0/.env.docker
cp .env.docker .env
docker compose -f docker-compose.hub.yml up -d
```

Wait approximately 90 seconds for the first-time setup (migrations, seeding) to complete, then open:

```
http://localhost:8000/admin
```

**Default Admin Credentials:**

| Field    | Value               |
|----------|---------------------|
| Email    | `admin@example.com` |
| Password | `admin123`          |

**Default Database Credentials** (from `.env.docker`):

| Field            | Value      |
|------------------|------------|
| Database         | `unopim`   |
| Username         | `unopim`   |
| Password         | `password` |
| Root Password    | `password` |

::: warning
Change `DB_PASSWORD` and `DB_ROOT_PASSWORD` in `.env` before any non-local deployment.
:::

---

## Development Setup (Build from Source)

This method builds from source and gives full control over the environment. Ideal for development or customization.

### Step 1: Clone the Repository

```bash
git clone -b 2.0 https://github.com/unopim/unopim.git
cd unopim
```

### Step 2: Configure Environment

```bash
cp .env.docker .env
```

::: warning
Always copy from **`.env.docker`** (not `.env.example`) — it contains pre-configured Docker service hostnames, ports, and credentials that match the Docker Compose services.
:::

### Step 3: Start Containers

**Nginx + PHP-FPM** (default, recommended for production):

```bash
docker compose up -d
```

**Apache + mod_php** (alternative):

```bash
docker compose -f docker-compose.yml -f docker-compose.apache.yml up -d
```

The first start takes a few minutes as Docker builds the images and runs the initial setup (Composer install, key generation, migrations, seeding, Elasticsearch indexing).

### Step 4: Access UnoPim

Wait for all containers to become healthy (~90 seconds), then open:

```
http://localhost:8000/admin
```

Login with `admin@example.com` / `admin123`.

---

## Services Overview

The Docker Compose setup runs the following services:

| Service                | Description                          | Default Host Port |
|------------------------|--------------------------------------|--------------------|
| `unopim-nginx`         | Nginx reverse proxy                  | `8000`             |
| `unopim-fpm`           | PHP 8.3 FPM application server       | (internal: 9000)   |
| `unopim-q`             | Queue worker (system, completeness, default) | —          |
| `unopim-scheduler`     | Laravel task scheduler               | —                  |
| `unopim-mysql`         | MySQL 8.0 database                   | `3306`             |
| `unopim-redis`         | Redis 7.2 (cache + queue)            | `6379`             |
| `unopim-elasticsearch` | Elasticsearch 8.17 (product search)  | `9200`             |
| `unopim-mailpit`       | Local email testing                  | `8025` (UI), `1025` (SMTP) |

When using the Apache variant (`docker-compose.apache.yml`), `unopim-nginx` and `unopim-fpm` are replaced by a single `unopim-web` service.

::: tip Bind Address
Only `unopim-nginx` (or `unopim-web` in Apache mode) binds to all interfaces (`0.0.0.0`) so the application is reachable on your LAN. All other ports (`MySQL`, `Redis`, `Elasticsearch`, `Mailpit`) bind to `127.0.0.1` only and are not exposed outside the host.
:::

---

## Port Configuration

All host-side ports are configurable via `FORWARD_*` environment variables in your `.env` file. These only control how ports are mapped to your host machine — they do **not** affect how services communicate inside Docker.

```dotenv
# Application port
APP_PORT=8000

# Database
FORWARD_DB_PORT=3306

# Redis
FORWARD_REDIS_PORT=6379

# Elasticsearch
FORWARD_ES_PORT=9200

# Mailpit
FORWARD_MAILPIT_PORT=8025
FORWARD_MAILPIT_SMTP_PORT=1025
```

After changing ports, restart the containers:

```bash
docker compose down
docker compose up -d
```

---

## Running Commands Inside Docker

### Artisan Commands

```bash
docker compose exec unopim-fpm php artisan migrate
docker compose exec unopim-fpm php artisan cache:clear
docker compose exec unopim-fpm php artisan config:cache
docker compose exec unopim-fpm php artisan unopim:product:index
docker compose exec unopim-fpm php artisan queue:restart
```

::: warning
Do not run `php artisan queue:work` in `unopim-fpm`. The `unopim-q` container already runs the queue worker. Use `queue:restart` to reload workers after a deploy, or `queue:failed` to inspect failures.
:::

For the Apache variant, replace `unopim-fpm` with `unopim-web`:

```bash
docker compose exec unopim-web php artisan migrate
```

### Composer Commands

```bash
docker compose exec unopim-fpm composer install
docker compose exec unopim-fpm composer update
```

### MySQL Access

```bash
docker compose exec unopim-mysql mysql -u unopim -p unopim
```

When prompted, enter the password from `.env` (`DB_PASSWORD`, default `password`). The trailing `unopim` selects the database.

### Interactive Shell

```bash
docker compose exec unopim-fpm bash
```

---

## Managing Containers

```bash
# Check status of all services
docker compose ps

# View logs (all services)
docker compose logs -f

# View logs for a specific service
docker compose logs -f unopim-fpm

# Stop all containers
docker compose down

# Stop and remove all data (volumes) — WARNING: destroys database
docker compose down -v

# Rebuild after Dockerfile or dependency changes
docker compose up --build -d

# Restart a single service
docker compose restart unopim-fpm
```

---

## Data Persistence

All data is persisted using Docker named volumes:

| Volume                         | Purpose                        |
|--------------------------------|--------------------------------|
| `unopim-mysql-data`            | MySQL database files           |
| `unopim-redis-data`            | Redis persistence              |
| `unopim-elasticsearch-data`    | Elasticsearch indices          |

::: warning
Running `docker compose down -v` removes all volumes and **permanently deletes** your database, search index, and cache. Use `docker compose down` (without `-v`) to stop containers while preserving data.
:::

---

## Updating UnoPim

To pull the latest source and rebuild the images:

```bash
git pull origin master
docker compose up --build -d
docker compose exec unopim-fpm php artisan migrate
docker compose exec unopim-fpm php artisan unopim:product:index
docker compose exec unopim-fpm php artisan queue:restart
```

For the Docker Hub setup, pull the new image instead:

```bash
docker compose -f docker-compose.hub.yml pull
docker compose -f docker-compose.hub.yml up -d
```

---

## Health Checks and Logs

Inspect service health and watch container logs:

```bash
# Status of every service (look for "(healthy)")
docker compose ps

# Tail logs for a service
docker compose logs -f unopim-fpm
docker compose logs -f unopim-q
docker compose logs -f unopim-nginx

# Application logs inside the container
docker compose exec unopim-fpm tail -f storage/logs/laravel.log
```

A service stuck in `(health: starting)` for more than two minutes usually indicates a misconfigured `.env` value or a port conflict — check the logs for that service.

---

## Production Deployment

When deploying UnoPim with Docker in production:

1. **Change default credentials** — Update `DB_PASSWORD`, `DB_ROOT_PASSWORD` in `.env` before first start.
2. **Set `APP_ENV=production`** and **`APP_DEBUG=false`** in `.env`.
3. **Use a reverse proxy** (Nginx, Traefik, or Caddy) for SSL termination.
4. **Back up volumes regularly** — especially the MySQL data volume.
5. **Use Docker secrets** for sensitive credentials instead of `.env` in production. See the [Docker Compose secrets reference](https://docs.docker.com/compose/use-secrets/).
6. **Monitor disk space** — Elasticsearch requires at least 15% free disk space (see troubleshooting below).

---

## Troubleshooting

### Port Conflicts

If you see an error like:

```
Bind for 127.0.0.1:3306 failed: port is already allocated
```

This means another service (e.g., a locally installed MySQL) is already using that port.

**Fix:** Change the `FORWARD_*` port in `.env`:

```dotenv
FORWARD_DB_PORT=33060
FORWARD_REDIS_PORT=16379
FORWARD_ES_PORT=19200
APP_PORT=8080
```

Then restart:

```bash
docker compose down
docker compose up -d
```

To find what is using a specific port:

```bash
# Linux
sudo ss -tlnp | grep 3306

# macOS
sudo lsof -i :3306
```

The output reveals whether the holder is a Docker proxy or a host service:

- **Host service** (`mysqld`, `nginx`, `apache2`, `redis-server`): stop it with your service manager, e.g.
  ```bash
  sudo systemctl stop mysql
  sudo systemctl stop nginx
  ```
  Or change the `FORWARD_*` port in `.env` to leave the host service running.

- **Another Docker container**: stop it with
  ```bash
  docker stop <container-name>
  ```

### Stale Container Name Conflict

After a failed `docker compose up`, you may see:

```
Conflict. The container name "/xxxx_unopim-unopim-scheduler-1" is already in use
```

Remove the orphaned container and retry:

```bash
docker compose rm -f
docker compose up -d
```

If a single container is stuck, remove it directly:

```bash
docker rm -f <container-id-or-name>
```

### Elasticsearch "503 Service Unavailable" or "no_shard_available"

If the product listing page shows an Elasticsearch error, the cluster may be unhealthy due to **disk space**. Elasticsearch stops allocating shards when disk usage exceeds 85%.

**Check cluster health:**

```bash
curl http://localhost:9200/_cluster/health
```

If status is `red` and you see `unassigned_shards`, check disk allocation:

```bash
curl http://localhost:9200/_cat/allocation?v
```

**Temporary fix** — raise the disk watermark thresholds:

```bash
curl -X PUT http://localhost:9200/_cluster/settings \
  -H 'Content-Type: application/json' \
  -d '{
    "persistent": {
      "cluster.routing.allocation.disk.watermark.low": "95%",
      "cluster.routing.allocation.disk.watermark.high": "97%",
      "cluster.routing.allocation.disk.watermark.flood_stage": "99%"
    }
  }'
```

Then reindex products:

```bash
docker compose exec unopim-fpm php artisan unopim:product:index
```

::: tip
For production, free up disk space rather than raising watermarks. The defaults (85%/90%/95%) exist to protect your data.
:::

Once disk space is reclaimed, revert the watermark overrides to their defaults:

```bash
curl -X PUT http://localhost:9200/_cluster/settings \
  -H 'Content-Type: application/json' \
  -d '{
    "persistent": {
      "cluster.routing.allocation.disk.watermark.low": null,
      "cluster.routing.allocation.disk.watermark.high": null,
      "cluster.routing.allocation.disk.watermark.flood_stage": null
    }
  }'
```

### First-Time Setup Hangs or Fails

The entrypoint script runs migrations and seeds on first start. If it fails:

```bash
# Check what happened
docker compose logs unopim-fpm | tail -50

# Retry by removing the lock file and restarting
docker compose exec unopim-fpm rm -f /var/www/html/storage/unopim.lock
docker compose restart unopim-fpm
```

### Product Images Return 404 or 403

Product images are served through a storage symlink: `public/storage -> storage/app/public`.

```bash
# Verify symlink exists
docker compose exec unopim-fpm ls -la public/storage

# If missing, recreate it
docker compose exec unopim-fpm php artisan storage:link

# Fix file permissions
docker compose exec unopim-fpm chown -R www-data:www-data storage bootstrap/cache
docker compose exec unopim-fpm chmod -R 775 storage bootstrap/cache
```

### Permission Denied on Log Files

If you see "Failed to open stream: Permission denied" for `storage/logs/laravel.log`:

```bash
docker compose exec unopim-fpm chown -R www-data:www-data storage
docker compose exec unopim-fpm chmod -R 775 storage
```

### Reset Everything

To completely start fresh:

```bash
docker compose down -v    # WARNING: removes all data
docker compose up --build -d
```
