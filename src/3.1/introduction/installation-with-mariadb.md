# Installation with MariaDB

UnoPim 3.1.0 introduced first-class MariaDB support. MariaDB stores the application's catalog, users, configuration, and job data when selected as the database engine. MySQL and PostgreSQL remain supported alternatives.

## Prerequisites

- Meet the [PHP, Composer, extension, and service requirements](requirements).
- Install the latest patch release of MariaDB **10.11 LTS** or **11.8 LTS**. These are the series targeted by the MariaDB CI workflow.
- Enable PHP's `pdo_mysql` extension. MariaDB does not require a separate `pdo_mariadb` extension.
- Install the MariaDB command-line client, including `mariadb` and `mariadb-dump`, on the machine or application container that runs UnoPim's upgrade command. Installing them only on the database server is insufficient for a remote database.

Verify the installation:

```bash
php --ri pdo_mysql
mariadb --version
mariadb-dump --version
```

The client version is separate from the server version. After connecting to the database, run `SELECT VERSION();` to verify the server.

MariaDB Community Server 10.6 and 10.10 are end of life. Check the [MariaDB maintenance policy](https://mariadb.org/about/#maintenance-policy) before selecting a server series.

## Create the database and application user

Connect using your database administrator account. For a local installation configured with socket authentication:

```bash
sudo mariadb
```

Create a database and a dedicated user. Replace the example password before running these statements:

```sql
CREATE DATABASE unopim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'unopim'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-unique-password';
GRANT ALL PRIVILEGES ON unopim.* TO 'unopim'@'127.0.0.1';
```

These privileges are scoped to the UnoPim database and allow the installer and migrations to manage its schema and triggers. For a remote application server, replace `127.0.0.1` in the account host with the application's permitted source host and configure the database's network access accordingly.

## Configure UnoPim

Create a new project from the 3.1 release series:

```bash
composer create-project unopim/unopim unopim '3.1.*'
cd unopim
```

Set these values in the generated `.env` file, using the database credentials created above:

```dotenv
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=unopim
DB_USERNAME=unopim
DB_PASSWORD="replace-with-a-unique-password"
DB_PREFIX=
```

Use `DB_CONNECTION=mariadb` even though the PHP extension is named `pdo_mysql`. An optional prefix, such as `wk_`, is supported. Set the application URL, locale, currency, queue, and optional Elasticsearch settings for your environment before installing.

::: warning Fresh installations only
The installer runs `migrate:fresh`, which removes existing tables. Run it only against the new, empty database. Use the upgrade procedure below for an existing installation.
:::

```bash
php artisan config:clear
php artisan unopim:install --skip-env-check
```

Follow the prompts to create the administrator account. Configure the [web server](/3.1/introduction/web-server-configuration) and [queue workers and scheduler](/3.1/introduction/queue-scheduler-setup) using the installation guides.

## Upgrade an existing MariaDB installation

Follow the [minor-update guide](/3.1/prologue/patch-update) to prepare the new application release and preserve its environment, storage, and OAuth signing keys. Back up the database and files first, then run the upgrade commands from the prepared release:

```bash
php artisan config:clear
php artisan unopim:upgrade --dry-run
php artisan unopim:upgrade
```

Keep `mariadb-dump` available to the application process so UnoPim can create its pre-migration backup. Changing `DB_CONNECTION` does not migrate data from MySQL or PostgreSQL to MariaDB; moving between database engines needs a separate data-migration procedure.

## Defaults and validation

The Composer template defaults to MySQL and the supplied Docker stack defaults to PostgreSQL. Selecting MariaDB makes it the primary application database for that installation.

The [MariaDB workflow](https://github.com/unopim/unopim/blob/3.x/.github/workflows/pest_tests_mariadb.yml) runs installation and Pest tests on MariaDB 10.11 and 11.8 with the `mariadb` connection and a `wk_` table prefix. It includes installer/upgrade, REST API, catalog, audit, and import/export coverage. Elasticsearch is disabled in this workflow; the existing MySQL and PostgreSQL workflows provide separate Elasticsearch coverage.
