# Requirements



## Server Configuration

- **Server**: Apache 2 or NGINX
- **RAM**: 8GB or higher
- **Node**: 20.x LTS or higher
- **PHP**: 8.3 or higher
- **Composer**: 2.6.0 or higher

## PHP Extensions

Ensure the following extensions are installed and enabled. You can check using the **`phpinfo()`** page or the **`php -m`** command.

- **bcmath**: Required for arbitrary precision math operations used in pricing and quantity calculations.
- **curl**: Required for HTTP requests to external services and AI providers.
- **dom**, **xml**: Required for XML parsing in import/export pipelines.
- **exif**: Required for reading image metadata during media uploads.
- **fileinfo**: Used for file type detection, important for handling file uploads.
- **gd**: Required for image manipulation. Must be properly installed for product image processing.
- **intl**: Required for internationalization, locale-based formatting, and translation support.
- **mbstring**: Required for multibyte string operations and non-ASCII character handling.
- **openssl**: Bundled with PHP on most distributions. Enables SSL/TLS for secure communication.
- **pdo**: Required for database interactions.
- **pdo_mysql**: Required when using MySQL or MariaDB.
- **pdo_pgsql**: Required when using PostgreSQL.
- **redis**: Required when using Redis for cache, sessions, or queues (recommended).
- **tokenizer**: Bundled with PHP. Required by Laravel for code parsing.
- **zip**: Required for handling zip imports and exports.

::: tip Note
The `gd` extension must be compiled with JPEG, PNG, and WebP support to avoid issues with image manipulation in UnoPim.
:::

## How to Install PHP Extensions

### On Windows

1. **Locate the `php.ini` file**:
   - This file is typically located in your PHP installation directory (e.g., `C:\php\php.ini` or `C:\xampp\php\php.ini`).
2. **Enable the extensions**:
   - Open the `php.ini` file in a text editor and find the extensions listed below.
   - Uncomment the lines by removing the `;` at the beginning. If the extension is not listed, you'll need to download the corresponding `.dll` file.

   ```ini
   extension=curl
   extension=fileinfo
   extension=gd
   extension=intl
   extension=mbstring
   extension=openssl
   extension=pdo
   extension=pdo_mysql       ; Enable this if using MySQL
   extension=pdo_pgsql       ; Enable this if using PostgreSQL
   extension=tokenizer
   extension=zip
   ```

3. **Download missing `.dll` files** (if needed):
   - If any extension is missing, visit the [PECL repository](https://pecl.php.net/) or download the `.dll` files from the [PHP Windows downloads page](https://windows.php.net/download/).

4. **Restart your web server**:
   - After saving the `php.ini` file, restart Apache or NGINX to apply the changes.
### On Linux

1. **Install common PHP extensions via the package manager**:

   * Use the following commands based on your Linux distribution to install the required extensions.

   **For Ubuntu/Debian:**

   ```bash
   sudo apt update
   sudo apt install php8.3-bcmath php8.3-curl php8.3-dom php8.3-xml php8.3-gd \
       php8.3-intl php8.3-mbstring php8.3-redis php8.3-zip
   ```

   **For CentOS/RHEL:**

   ```bash
   sudo dnf install php-bcmath php-curl php-dom php-xml php-gd \
       php-intl php-mbstring php-pecl-redis php-zip
   ```

   **For Fedora:**

   ```bash
   sudo dnf install php-bcmath php-curl php-dom php-xml php-gd \
       php-intl php-mbstring php-pecl-redis php-zip
   ```

2. **Install database-specific PHP extension**:

   * **For MySQL:**

     **Ubuntu/Debian:**

     ```bash
     sudo apt install php-pdo-mysql
     ```

     **CentOS/RHEL:**

     ```bash
     sudo yum install php-pdo_mysql
     ```

     **Fedora:**

     ```bash
     sudo dnf install php-pdo_mysql
     ```

   * **For PostgreSQL:**

     **Ubuntu/Debian:**

     ```bash
     sudo apt install php-pdo-pgsql
     ```

     **CentOS/RHEL:**

     ```bash
     sudo yum install php-pdo_pgsql
     ```

     **Fedora:**

     ```bash
     sudo dnf install php-pdo_pgsql
     ```

3. **Restart the web server**:
   - Once the extensions are installed, restart your Apache or NGINX server.

   ```bash
   sudo systemctl restart apache2  # For Ubuntu/Debian
   sudo systemctl restart httpd    # For CentOS/RHEL/Fedora
   sudo systemctl restart nginx    # If you're using NGINX
   ```

4. **Verify the extensions**:
   - You can verify the installed extensions by running:

   ```bash
   php -m
   ```

### On macOS

1. **Install PHP via Homebrew** — most extensions ship bundled with the `php` formula:

   ```bash
   brew install php@8.3
   ```

2. **Install the Redis PECL extension** (not bundled):

   ```bash
   pecl install redis
   ```

3. **Verify PHP version and extensions**:

   ```bash
   php -v
   php -m
   ```

4. **Locate `php.ini`** and confirm extensions load:

   ```bash
   php --ini
   ```

   ::: tip
   Homebrew's `php` formula already enables `bcmath`, `curl`, `dom`, `exif`, `fileinfo`, `gd`, `intl`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `pdo_pgsql`, `tokenizer`, `xml`, and `zip` by default. You typically only need to add `extension=redis.so` after installing it via PECL.
   :::

5. **Restart PHP-FPM** (if running):

   ```bash
   brew services restart php@8.3
   ```


## PHP Configuration

Open your **`php.ini`** file and modify the following settings.

- **memory_limit**: Set the **`memory_limit`** directive to **`4G`** or higher to ensure sufficient memory allocation for the application.

- **max_execution_time**: Adjust the **`max_execution_time`** directive to **`360`** or higher. This value determines the maximum time (in seconds) a script is allowed to run. Increasing this value ensures that longer operations, such as import/export processes, can be completed successfully.

- **date.timezone**: Set the **`date.timezone`** directive to your specific timezone. For example, **`Asia/Kolkata`**. This ensures that date and time-related functions work accurately based on the specified timezone.

```ini
memory_limit = 4G
max_execution_time = 360
date.timezone = Asia/Kolkata <- Change this to your own timezone.
```

::: tip Remember to restart your web server
Whenever you make changes to the PHP configuration file, be sure to restart Apache or NGINX to apply the modifications.
:::

## Required Services

### Redis

Redis is recommended for cache, session storage, and queue processing. UnoPim's `.env.docker` defaults to Redis on all three.

- **Version**: Redis 7.x (or newer)
- **Use cases**: queue driver (`QUEUE_CONNECTION=redis`), cache (`CACHE_DRIVER=redis`), sessions (`SESSION_DRIVER=redis`)

The `database` driver is supported as a fallback but is slower under load. The `sync` driver should be used for development only.

### Elasticsearch

UnoPim uses Elasticsearch for product search, filtering, and listing in the admin panel.

- **Version**: Elasticsearch 8.17+
- **Disk space**: Elasticsearch stops allocating shards when disk usage exceeds 85% — keep at least 15% free.
- **Heap**: 1–2 GB for small catalogs; tune based on document count and concurrent queries.

After installation and migration, build the indexes:

```bash
php artisan unopim:product:index
php artisan unopim:category:index
```

## Supported Database Servers

UnoPim supports the following database servers:

- **MySQL**: Version 8.0.32 or higher is recommended for optimal performance and compatibility.

- **MariaDB**: Version 10.3 or higher is recommended for optimal performance and compatibility.

- **PostgreSQL**: Version 14.x or higher is recommended for optimal performance and compatibility.

- **Database Collation**: The recommended collation for the database is **`utf8mb4_unicode_ci`**, which ensures proper handling of Unicode characters and multilingual support.

## Key Dependencies

UnoPim 2.0.x ships with the following core dependencies (from `composer.json`):

| Package | Version | Notes |
|---|---|---|
| **laravel/framework** | ^12.0 | Application framework |
| **laravel/sanctum** | ^4.0 | API token authentication |
| **laravel/passport** | ^12.2 | OAuth 2.0 server |
| **laravel/octane** | ^2.3 | Optional high-performance server |
| **laravel/ai** | ^0.3.2 | Multi-provider AI adapter (powers MagicAI) |
| **laravel/boost** | ^2.1 | Developer tooling (dev/CI) |
| **laravel/pint** | ^1.29 | Code style fixer (dev) |
| **pestphp/pest** | ^3.0 | Test runner |
| **phpunit/phpunit** | ^11.0 | Unit test framework |
