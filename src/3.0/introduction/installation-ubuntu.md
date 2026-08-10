# Installation on Ubuntu 24.04

## Overview

This guide walks you through installing UnoPim on a fresh Ubuntu 24.04 LTS server. By the end, you will have a fully functional UnoPim instance with Nginx, PHP 8.4, MySQL 8.0, Redis, and Elasticsearch.

::: tip
For Docker-based installation, see [Installation with Docker](installation-docker) instead.
:::

## Prerequisites

- A fresh Ubuntu 24.04 LTS server (physical, VM, or cloud instance)
- Root or sudo access
- A domain name pointed to your server (for production)
- Minimum 2 GB RAM (4 GB recommended)
- At least 10 GB free disk space

---

## Step 1: Update the System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 2: Install PHP 8.4

Ubuntu 24.04 ships PHP 8.3 by default, so add the `ondrej/php` PPA for PHP 8.4:

```bash
sudo add-apt-repository ppa:ondrej/php -y && sudo apt update
```

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
upload_max_filesize = 200M
post_max_size = 200M
date.timezone = UTC
```

Edit the CLI configuration as well:

```bash
sudo nano /etc/php/8.4/cli/php.ini
```

Apply the same values for `memory_limit`, `max_execution_time`, and `upload_max_filesize`.

::: tip FPM pool user (optional)
The default FPM pool runs as `www-data`. If you install UnoPim under a different user (e.g. `/home/deploy/unopim`), edit `/etc/php/8.4/fpm/pool.d/www.conf` and update `user`, `group`, `listen.owner`, `listen.group` to that user before restarting FPM.
:::

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

```bash
sudo apt install -y mysql-server
```

Secure the installation:

```bash
sudo mysql_secure_installation
```

Create the UnoPim database and user:

```bash
sudo mysql -u root
```

::: tip Root authentication on Ubuntu 24.04
By default the MySQL `root` user authenticates via `auth_socket` (no password, only via `sudo mysql`). To switch to password authentication, run inside the MySQL prompt:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_root_password';
```
:::

```sql
CREATE DATABASE unopim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'unopim'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON unopim.* TO 'unopim'@'localhost';
SET GLOBAL log_bin_trust_function_creators = 1;
FLUSH PRIVILEGES;
EXIT;
```

::: warning
Replace `your_secure_password` with a strong, unique password. Never use default or weak passwords in production.
:::

Persist `log_bin_trust_function_creators` across MySQL restarts (UnoPim migrations create stored functions; binary logging blocks them without this flag):

```bash
echo "log_bin_trust_function_creators = 1" | sudo tee -a /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql
```

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

### Kernel tuning (required by Elasticsearch 8)

```bash
sudo sysctl -w vm.max_map_count=262144
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
```

### Configure Elasticsearch

Edit the configuration file:

```bash
sudo nano /etc/elasticsearch/elasticsearch.yml
```

Set the following values:

```yaml
cluster.name: unopim
node.name: unopim-node
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 127.0.0.1
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
xpack.security.enrollment.enabled: false
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false
bootstrap.memory_lock: false
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

Sizing guidance: set heap to ~25% of system RAM, bounded between **512m** and **2g** for typical UnoPim installs. Examples:

| RAM    | Heap         |
| ------ | ------------ |
| 2 GB   | `-Xms512m -Xmx512m` |
| 4 GB   | `-Xms1g -Xmx1g`     |
| 8 GB+  | `-Xms2g -Xmx2g`     |

For large catalogs (>500K products) and heavy filtering, see [Elasticsearch tuning for large catalogs](#elasticsearch-tuning-for-large-catalogs) below.

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

Install required tools:

```bash
sudo apt install -y unzip
```

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

ELASTICSEARCH_ENABLED=true
ELASTICSEARCH_CONNECTION=default
ELASTICSEARCH_HOST=127.0.0.1:9200
```

Generate the application key:

```bash
sudo -u www-data php artisan key:generate
```

### Run the Installer

```bash
cd /var/www/unopim
sudo -u www-data php artisan unopim:install
```

Follow the interactive prompts to configure your application name, default locale, currency, and admin credentials.

### Link Storage

```bash
sudo -u www-data php artisan storage:link
```

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
    # Dynamic routes rendered by PHP — these must precede the static rule
    # below, which would otherwise 404 them.
    location ^~ /cache/ {
        try_files $uri /index.php?$query_string;
    }

    location ~ ^/p/[^/]+/carrier\.svg$ {
        try_files $uri /index.php?$query_string;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|map|woff|woff2|ttf|eot)$ {
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

    # Never serve executable or active content from uploads
    location ~* ^/storage/.*\.(php[0-9]?|phtml|pht|phar|html?|shtml|xhtml)$ {
        return 404;
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

## Step 10: SSL with Let's Encrypt (production)

Skip this step for local or development installs. For production with a public domain pointing to the server:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com --agree-tos --email admin@your-domain.com
```

Certbot updates the Nginx vhost to listen on 443, installs the certificate, and registers a renewal timer (auto-renews every 90 days).

::: warning
DNS A-record for `your-domain.com` must resolve to this server before running certbot, or domain validation fails.
:::

---

## Step 11: Queue Worker and Cron Scheduler

Configure Supervisor for the queue worker and add the Laravel scheduler to cron. The full procedure (queue driver options, Supervisor config, scheduler entry, monitoring, and failed-job handling) is documented in **[Queue & Scheduler Setup](queue-scheduler-setup)**.

Quick reference for Ubuntu:

```bash
sudo apt install -y supervisor
# then follow Queue & Scheduler Setup using user www-data and queues system,completeness,default
```

---

## Step 12: Build Elasticsearch Index

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

## Elasticsearch tuning for large catalogs

Optional. Apply only when running large product catalogs (>500K SKUs), heavy filtering, or bulk imports. Skip for small/dev installs — defaults are fine.

### Cluster settings (`/etc/elasticsearch/elasticsearch.yml`)

Append:

```yaml
thread_pool.write.queue_size: 1000
thread_pool.search.queue_size: 2000

cluster.routing.allocation.disk.watermark.low: 85%
cluster.routing.allocation.disk.watermark.high: 90%
cluster.routing.allocation.disk.watermark.flood_stage: 95%

indices.fielddata.cache.size: 20%
indices.queries.cache.size: 15%

indices.recovery.max_bytes_per_sec: 100mb
```

### Heap (large catalogs)

Bump heap to 25–50% of RAM, hard cap at **31g** (compressed-oops boundary — never exceed):

| RAM    | Heap                |
| ------ | ------------------- |
| 8 GB   | `-Xms4g -Xmx4g`     |
| 16 GB  | `-Xms8g -Xmx8g`     |
| 64 GB+ | `-Xms31g -Xmx31g`   |

### System limits (`/etc/security/limits.d/elasticsearch.conf`)

```
elasticsearch  soft  nofile  65535
elasticsearch  hard  nofile  65535
elasticsearch  soft  memlock unlimited
elasticsearch  hard  memlock unlimited
```

To enable `bootstrap.memory_lock: true`, also add `LimitMEMLOCK=infinity` to a systemd override:

```bash
sudo systemctl edit elasticsearch
```

```ini
[Service]
LimitMEMLOCK=infinity
```

### Kernel sysctls (`/etc/sysctl.conf`)

```
vm.max_map_count=262144
vm.swappiness=1
fs.file-max=655360
```

Apply:

```bash
sudo sysctl -p
sudo systemctl daemon-reload
sudo systemctl restart elasticsearch
```

### Index-level settings (apply after first index build)

```bash
curl -X PUT "127.0.0.1:9200/products/_settings" -H 'Content-Type: application/json' -d '{
  "index": {
    "number_of_replicas": 0,
    "refresh_interval": "30s",
    "translog.durability": "async",
    "translog.sync_interval": "30s"
  }
}'
```

- `number_of_replicas: 0` — single-node deployments only
- `refresh_interval: 30s` — large indexing throughput gain, slight search staleness
- `translog.durability: async` — faster bulk writes, small data-loss window on crash

### Bulk import mode

Disable refresh + replicas during initial import, then restore and force-merge:

```bash
curl -X PUT "127.0.0.1:9200/products/_settings" -H 'Content-Type: application/json' \
  -d '{"index":{"refresh_interval":"-1","number_of_replicas":0}}'

php artisan unopim:product:index

curl -X PUT "127.0.0.1:9200/products/_settings" -H 'Content-Type: application/json' \
  -d '{"index":{"refresh_interval":"30s"}}'

curl -X POST "127.0.0.1:9200/products/_forcemerge?max_num_segments=1"
```

### Filter performance tips

- Verify filterable attributes mapped as `keyword` (not `text`): `curl 127.0.0.1:9200/products/_mapping`
- Range filters (price, stock) must use numeric types (`integer`, `scaled_float`) — not strings
- After large imports, force-merge to one segment per shard for fastest filter scans

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
