# System Requirements

This page lists the minimum system requirements needed to run UnoPim.  
All requirements must be met before proceeding with any installation method.

## Hardware Requirements

- **RAM**: 8 GB or higher
- **CPU**: 4 cores or higher
- **Disk Space**: 20 GB or higher

## Operating System

UnoPim can be installed on the following operating systems:

- **Ubuntu**: 22.04 or higher
- **Windows**: Windows 10 and Windows 11
- **macOS**

Linux-based operating systems are recommended for production environments.

## Web Server

UnoPim supports Apache and NGINX as web servers.

- **Apache**: 2.4.52 or higher
- **NGINX**: 1.28.0 or higher

### Apache Requirements

Apache must be configured to serve UnoPim’s `public/` directory  
and to pass PHP requests to PHP-FPM.

### NGINX Requirements

NGINX must be configured to serve UnoPim’s `public/` directory  
and to pass PHP requests to PHP-FPM using FastCGI.

## PHP Runtime

- **PHP**: 8.2 or higher
- **PHP-FPM**: Required

## Software Requirements

- **Composer**: 2.2.0 or higher
- **Node.js**: 18.12.0 LTS or higher

## PHP Extensions

The following PHP extensions must be installed and enabled.

### Required PHP Extensions

- `curl` (`php-curl`)
- `fileinfo` (`php-fileinfo`)
- `gd` (`php-gd`)
- `intl` (`php-intl`)
- `mbstring` (`php-mbstring`)
- `openssl` (`php-openssl`)
- `pdo` (`php-pdo`)
- `tokenizer` (`php-tokenizer`)
- `zip` (`php-zip`)

### Database Driver Extensions

Install **only the extension required for the selected database**:

- **MySQL / MariaDB**
  - `pdo_mysql` (`php-pdo-mysql`)

- **PostgreSQL**
  - `pdo_pgsql` (`php-pdo-pgsql`)

These extensions are part of PHP and must be enabled for database connectivity.

## Database Requirements

### Supported Database Servers

- **MySQL**: 8.0.32 or higher
- **MariaDB**: 10.3 or higher
- **PostgreSQL**: 14.x or higher

### Database Collation

- Recommended collation: `utf8mb4_unicode_ci`

## PHP Configuration

The following PHP configuration values must be set:

- **memory_limit**: 4G or higher
- **max_execution_time**: 360 or higher
- **date.timezone**: Set to the server timezone

## File System Permissions

The following directories must be writable by the web server user:

- `storage/`
- `bootstrap/cache/`

## Background Processing

- **Supervisor**: Recommended to manage and monitor queue workers.

## Optional Components

- **Elasticsearch**: 8.x  
  Recommended for faster search performance and large catalogs.

- **Redis**  
  Recommended for handling background jobs in the queue system, currently uses the database driver.

## Next Steps

After verifying all system requirements, proceed to the installation guide for your selected setup.
