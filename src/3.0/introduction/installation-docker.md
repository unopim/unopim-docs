# Installation with Docker

## Overview

Docker provides the easiest way to get UnoPim up and running. The Docker setup includes all required services — PHP, Nginx or Apache, a database, Redis, Elasticsearch, queue workers, and a task scheduler.

As of UnoPim v3.0 the Compose layout changed:

| File | Purpose |
|---|---|
| `compose.yaml` | **Quick start** — runs the published Docker Hub images. Needs no checkout and no `.env`; every setting has a working default. |
| `compose.mysql.yaml` | Overlay that switches the quick-start stack from PostgreSQL to MySQL. |
| `compose.dev.yaml` | **Development** — builds from a source checkout (Nginx + PHP-FPM). |
| `compose.dev.apache.yaml` | Overlay that serves the development stack with Apache instead of Nginx. |
| `docker-compose.yml` / `docker-compose.hub.yml` | Thin compatibility includes of the new files, kept so existing commands continue to work. |

::: warning PostgreSQL is the new default
New Docker environments run **PostgreSQL 16** by default. Existing v2.1.x installations must keep their current `COMPOSE_PROFILES`, `DB_CONNECTION`, host, and port values — switching the profile does **not** migrate MySQL data to PostgreSQL.
:::

::: tip
Deploying on bare metal? See the platform guides: [Ubuntu 24.04](installation-ubuntu), [Debian 12](installation-debian), [CentOS / RHEL 9](installation-centos).
:::

## Prerequisites

* **Docker** (v20.10+)
* **Docker Compose** (v2.0+ — included with Docker Desktop)

```bash
docker --version
docker compose version
```

## Quick Start (published images)

The fastest way to run UnoPim — no cloning, no building, no `.env`:

```bash
curl -O https://raw.githubusercontent.com/unopim/unopim/master/compose.yaml
docker compose up -d
```

Wait for the first-time setup (migrations and seeding) to complete, then open:

```
http://localhost:8000/admin
```

**Admin credentials.** The first-run seeder creates `admin@example.com` and generates a **random 20-character password**, which it writes to `storage/app/admin-credentials.txt` inside the container:

```bash
docker compose exec unopim cat storage/app/admin-credentials.txt
```

Log in, change the password, and delete the file. To choose the credentials yourself instead, set them before the first boot — they are only read while the `admins` table is still empty:

```bash
INSTALLER_ADMIN_EMAIL=you@example.com INSTALLER_ADMIN_PASSWORD='a-strong-password' docker compose up -d
```

To change any setting, export the variable or drop it in a `.env` file next to `compose.yaml` — Compose interpolates it automatically:

```bash
APP_PORT=8080 docker compose up -d
```

### Using MySQL instead of PostgreSQL

Add the MySQL overlay:

```bash
curl -O https://raw.githubusercontent.com/unopim/unopim/master/compose.mysql.yaml
docker compose -f compose.yaml -f compose.mysql.yaml up -d
```

Or make it permanent for the directory:

```bash
echo 'COMPOSE_FILE=compose.yaml:compose.mysql.yaml' >> .env
docker compose up -d
```

::: warning
Change the database passwords before any non-local deployment. The quick-start stack ships production-safe defaults elsewhere: `APP_ENV=production` and `APP_DEBUG=false`.
:::

## Development Setup (build from source)

Use this when you develop UnoPim itself or customize packages. The development stack builds the images from your checkout and bind-mounts the source.

### Step 1: Clone the repository

```bash
git clone https://github.com/unopim/unopim.git
cd unopim
```

### Step 2: Configure the environment

```bash
cp .env.docker .env
```

::: warning
Always copy from **`.env.docker`** (not `.env.example`) — it contains pre-configured Docker service hostnames, ports, and credentials that match the Compose services.
:::

Key variables:

```env
APP_PORT=8000
COMPOSE_PROFILES=pgsql      # or: mysql
DB_CONNECTION=pgsql         # or: mysql
DB_HOST=unopim-pgsql        # or: unopim-mysql

# Match the container user to your host user so bind-mounted
# files stay writable both ways
HOST_UID=1000
HOST_GID=1000
```

Only the database engine selected by `COMPOSE_PROFILES` starts.

### Step 3: Build and start

```bash
docker compose -f compose.dev.yaml up -d --build
```

Prefer Apache over Nginx + PHP-FPM:

```bash
docker compose -f compose.dev.yaml -f compose.dev.apache.yaml up -d --build
```

The entrypoint installs Composer dependencies, waits for the database, runs migrations and seeders, and then starts the services. First boot on a fresh clone takes a few minutes.

### Step 4: Open the application

```
http://localhost:8000/admin
```

## Services in the stack

| Service | Purpose |
|---|---|
| `unopim` / `unopim-fpm` + web server | The application |
| `unopim-pgsql` or `unopim-mysql` | Database (profile-selected) |
| `unopim-redis` | Cache, sessions, queues |
| `unopim-elasticsearch` | Product search and filtering |
| `unopim-queue` / `unopim-q` | Queue worker |
| `unopim-scheduler` | Cron scheduler |
| `unopim-mailpit` | Local mail catcher (development) |

## Seeding Demo Data

UnoPim can seed a sample catalog — products with images, categories, attributes of every type, variants, associations, and a published Digital Product Passport template — so you have data to explore immediately. Demo data is for evaluation and development, not production.

```bash
docker compose exec unopim php artisan unopim:install:demo-data
```

On the development stack, target the FPM container:

```bash
docker compose -f compose.dev.yaml exec unopim-fpm php artisan unopim:install:demo-data
```

Re-seed over existing demo data with `--force`. After seeding, rebuild the search indexes:

```bash
docker compose exec unopim php artisan unopim:product:index
docker compose exec unopim php artisan unopim:category:index
```

## Common Operations

```bash
# Follow application logs
docker compose logs -f unopim

# Run artisan inside the app container
docker compose exec unopim php artisan unopim:product:index

# Stop the stack
docker compose down

# Stop and remove volumes (destroys data!)
docker compose down -v
```

::: tip Version pinning
The quick-start stack pins the service topology inside `compose.yaml` rather than reading it from the environment, so a stray Laravel `.env` in the same directory cannot redirect the containers at an external database.
:::

## Troubleshooting

- **Port already in use** — change `APP_PORT` (and the database forward ports) in `.env`.
- **Containers unhealthy on first boot** — MySQL and Elasticsearch can take one or two minutes to initialize; wait for the health checks, then re-run `docker compose up -d`.
- **Permission errors on bind mounts (dev stack)** — set `HOST_UID`/`HOST_GID` in `.env` to your host user and rebuild with `--build`.
- **Switched database engine and nothing migrated** — profiles select an engine; they never copy data between engines. Export from one database and import into the other explicitly.
