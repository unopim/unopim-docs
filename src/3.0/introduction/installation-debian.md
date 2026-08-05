# Installation on Debian 12

## Overview

This guide walks you through installing UnoPim on a fresh Debian 12 (Bookworm) server. By the end, you will have a fully functional UnoPim instance with Nginx, PHP 8.4, MySQL 8.0, Redis, and Elasticsearch.

::: tip
For Docker-based installation, see [Installation with Docker](installation-docker) instead.
:::

## Prerequisites

- A fresh Debian 12 server (physical, VM, or cloud instance)
- Root or sudo access
- A domain name pointed to your server (for production)
- Minimum 2 GB RAM (4 GB recommended)
- At least 10 GB free disk space

---

## Step 1: Update the System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common
```

---

## Step 2: Install PHP 8.4

Debian 12 ships with PHP 8.2 by default. To install PHP 8.4, add the Sury repository:

```bash
curl -sSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb
sudo dpkg -i /tmp/debsuryorg-archive-keyring.deb

echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list

sudo apt update
```

Install PHP 8.4 and required extensions:

```bash
sudo apt install -y php8.4 php8.4-fpm php8.4-cli php8.4-common \
    php8.4-mysql php8.4-pgsql php8.4-xml php8.4-curl php8.4-mbstring \
    php8.4-zip php8.4-gd php8.4-bcmath php8.4-intl php8.4-redis \
    php8.4-tokenizer php8.4-fileinfo php8.4-ctype php8.4-dom
```

### Configure PHP

Edit the PHP-FPM configuration:

```bash
sudo nano /etc/php/8.4/fpm/php.ini
```

Update the following values:

```ini
memory_limit = 512M
max_execution_time = 120
upload_max_filesize = 50M
post_max_size = 50M
date.timezone = UTC
```

Edit the CLI configuration as well:

```bash
sudo nano /etc/php/8.4/cli/php.ini
```

Apply the same values for `memory_limit`, `max_execution_time`, and `upload_max_filesize`.

Restart PHP-FPM:

```bash
sudo systemctl restart php8.4-fpm
sudo systemctl enable php8.4-fpm
```

Verify PHP is installed:

```bash
php -v
```

---

## Step 3: Install MySQL 8.0

Debian 12 does not include MySQL 8.0 in its default repositories. Add the MySQL APT repository:

```bash
wget https://dev.mysql.com/get/mysql-apt-config_0.8.30-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.30-1_all.deb
```

During the configuration dialog, select **MySQL Server 8.0** and confirm. Then install:

```bash
sudo apt update
sudo apt install -y mysql-server
```

Secure the installation:

```bash
sudo mysql_secure_installation
```

Create the UnoPim database and user:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE unopim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'unopim'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON unopim.* TO 'unopim'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

::: warning
Replace `your_secure_password` with a strong, unique password. Never use default or weak passwords in production.
:::

---

## Step 4: Install Redis

```bash
sudo apt install -y redis-server
```

Enable and start Redis:

```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

Verify Redis is running:

```bash
redis-cli ping
```

You should see `PONG` as the response.

---

## Step 5: Install Elasticsearch 8.17

Import the Elasticsearch GPG key and repository:

```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

sudo apt update
sudo apt install -y elasticsearch
```

### Configure Elasticsearch

Edit the configuration file:

```bash
sudo nano /etc/elasticsearch/elasticsearch.yml
```

Set the following values:

```yaml
cluster.name: unopim
network.host: 127.0.0.1
http.port: 9200
xpack.security.enabled: false
```

::: tip
Setting `xpack.security.enabled: false` simplifies local development. For production environments with Elasticsearch exposed to a network, enable security and configure authentication.
:::

### Set JVM Heap Size

```bash
sudo nano /etc/elasticsearch/jvm.options.d/heap.options
```

```
-Xms512m
-Xmx512m
```

Adjust based on available RAM. For production, allocate up to half of available memory (max 4 GB).

Enable and start Elasticsearch:

```bash
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

Verify Elasticsearch is running:

```bash
curl -s http://127.0.0.1:9200
```

---

## Step 6: Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Verify:

```bash
composer --version
```

---

## Step 7: Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

## Step 8: Install UnoPim

Navigate to the web root and create the project:

```bash
cd /var/www
sudo composer create-project unopim/unopim
```

Set proper ownership:

```bash
sudo chown -R www-data:www-data /var/www/unopim
sudo chmod -R 775 /var/www/unopim/storage /var/www/unopim/bootstrap/cache
```

### Configure Environment

```bash
cd /var/www/unopim
sudo cp .env.example .env
sudo nano .env
```

Update the following:

```dotenv
APP_URL=https://your-domain.com
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=unopim
DB_USERNAME=unopim
DB_PASSWORD=your_secure_password

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

ELASTICSEARCH_HOST=127.0.0.1
ELASTICSEARCH_PORT=9200
```

### Run the Installer

```bash
cd /var/www/unopim
sudo -u www-data php artisan unopim:install
```

Follow the interactive prompts to configure your application name, default locale, currency, and admin credentials.

### Build Frontend Assets

```bash
cd /var/www/unopim
sudo -u www-data npm install
sudo -u www-data npm run build
```

---

## Step 9: Configure Nginx

Install Nginx:

```bash
sudo apt install -y nginx
```

Create the virtual host configuration:

```bash
sudo nano /etc/nginx/sites-available/unopim.conf
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/unopim/public;
    index index.php;

    charset utf-8;
    client_max_body_size 200M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 5;

    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        # Only allow index.php to be executed
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 600;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Deny PHP execution in writable directories
    location ~* ^/(storage|bootstrap/cache)/.*\.php$ {
        deny all;
    }

    error_log /var/log/nginx/unopim_error.log;
    access_log /var/log/nginx/unopim_access.log;
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/unopim.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

::: tip
For full web server configuration including SSL, Apache alternative, and local domain setup, see [Web Server Configuration](web-server-configuration).
:::

---

## Step 10: Queue Worker and Cron Scheduler

Configure Supervisor for the queue worker and add the Laravel scheduler to cron. The full procedure is documented in **[Queue & Scheduler Setup](queue-scheduler-setup)**.

Quick reference for Debian:

```bash
sudo apt install -y supervisor
# then follow Queue & Scheduler Setup using user www-data and queues system,completeness,default
```

---

## Step 11: Build Elasticsearch Index

After installation, build the product and category search indexes:

```bash
cd /var/www/unopim
sudo -u www-data php artisan unopim:product:index
sudo -u www-data php artisan unopim:category:index
```

::: tip
Re-run this command after bulk imports or if search results appear stale.
:::

---

## Verify Installation

Open your browser and navigate to:

```
http://your-domain.com
```

Log in with the admin credentials you configured during installation.

Check that all services are running:

```bash
sudo systemctl status php8.4-fpm
sudo systemctl status nginx
sudo systemctl status mysql
sudo systemctl status redis-server
sudo systemctl status elasticsearch
sudo supervisorctl status
```

---

## Next Steps

- [Web Server Configuration](web-server-configuration) - SSL setup, advanced Nginx/Apache configuration
- [Queue & Scheduler Setup](queue-scheduler-setup) - Advanced queue driver configuration and monitoring
- [Creating a New User](creating-newuser) - Add additional admin users
