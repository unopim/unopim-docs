# Ubuntu Base Preparation

This guide covers the common system-level preparation required before installing UnoPim on Ubuntu.
Database and web server specific steps are covered in separate installation guides.

## Operating System

This guide assumes a supported Ubuntu operating system.

* Ubuntu 22.04 LTS or newer

## System Update

Updates the system package index to ensure the latest available packages are installed.

```bash
sudo apt-get update
sudo apt-get upgrade -y
````

## Required System Packages

Installs essential system utilities required by PHP, Composer, and other UnoPim dependencies.

```bash
sudo apt-get install -y \
  ca-certificates \
  curl \
  unzip \
  zip \
  git \
  software-properties-common
```

## PHP

Adds the PHP repository and installs PHP 8.2 along with required core extensions.

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update
```

```bash
sudo apt-get install -y \
  php8.2 \
  php8.2-cli \
  php8.2-common \
  php8.2-curl \
  php8.2-gd \
  php8.2-intl \
  php8.2-mbstring \
  php8.2-xml \
  php8.2-zip \
  php8.2-bcmath
```

> Database-specific PHP extensions (`php8.2-mysql`, `php8.2-pgsql`) are installed in the corresponding database installation guides.

## PHP Configuration

Configures PHP runtime settings recommended for stable UnoPim operation.

Edit the PHP CLI configuration file:

```bash
sudo nano /etc/php/8.2/cli/php.ini
```

Ensure the following values are set:

```ini
memory_limit = 1024M
max_execution_time = 3600
date.timezone = UTC
```

Repeat the same changes for PHP-FPM:

```bash
sudo nano /etc/php/8.2/fpm/php.ini
```

Restart PHP-FPM after changes:

```bash
sudo systemctl restart php8.2-fpm
```

## PHP-FPM

Installs PHP-FPM, which is used to process PHP requests efficiently.

```bash
sudo apt-get install -y php8.2-fpm
```

Enable and start the service:

```bash
sudo systemctl enable php8.2-fpm
sudo systemctl start php8.2-fpm
```

## Composer

Installs Composer, which is required to manage UnoPim’s PHP dependencies.

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Verify installation:

```bash
composer --version
```

## Node.js

Installs Node.js for compiling and managing UnoPim frontend assets.

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:

```bash
node -v
npm -v
```

## Web Server

A web server is required to serve the UnoPim application and will be configured in stack-specific guides.

Supported web servers:

* Apache
* NGINX

Installation and configuration are covered in:

* [Apache + MySQL](./apache-mysql.md)
* [Apache + PostgreSQL](./apache-postgresql.md)

## File Permissions

Ensures required directories are writable by the web server.

These permissions will be finalized after the UnoPim source code is placed on the server.

## Elasticsearch (Optional)

Installs Elasticsearch 8.x to improve search performance for large product catalogs.

### Add Elasticsearch repository

```bash
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
```

```bash
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" \
| sudo tee /etc/apt/sources.list.d/elastic-8.x.list
```

### Install Elasticsearch

```bash
sudo apt-get update
sudo apt-get install -y elasticsearch
```

### Enable and start Elasticsearch

```bash
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

Verify status:

```bash
curl http://localhost:9200
```

## Next Steps

After completing the base preparation, continue with **one** of the following guides:

* Installation on Ubuntu with [**Apache + MySQL**](./apache-mysql.md)
* Installation on Ubuntu with [**Apache + PostgreSQL**](./apache-postgresql.md)

Do not install both database stacks on the same system.
