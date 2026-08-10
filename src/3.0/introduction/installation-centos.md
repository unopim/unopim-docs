# Installation on CentOS / RHEL 9

## Overview

This guide walks you through installing UnoPim on CentOS Stream 9 or Red Hat Enterprise Linux (RHEL) 9. By the end, you will have a fully functional UnoPim instance with Nginx, PHP 8.4, MySQL 8.0, Redis, and Elasticsearch.

::: tip
For Docker-based installation, see [Installation with Docker](installation-docker) instead.
:::

## Prerequisites

- A fresh CentOS Stream 9 or RHEL 9 server (physical, VM, or cloud instance)
- Root or sudo access
- A domain name pointed to your server (for production)
- Minimum 2 GB RAM (4 GB recommended)
- At least 10 GB free disk space

---

## Step 1: Update the System

```bash
sudo dnf update -y
sudo dnf install -y epel-release
sudo dnf install -y curl wget unzip git tar
```

---

## Step 2: Install PHP 8.4

CentOS 9 does not include PHP 8.4 in its default repositories. Add the Remi repository:

```bash
sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm
sudo dnf module reset php -y
sudo dnf module enable php:remi-8.4 -y
```

Install PHP 8.4 and required extensions:

```bash
sudo dnf install -y php php-fpm php-cli php-common \
    php-mysqlnd php-pgsql php-xml php-curl php-mbstring \
    php-zip php-gd php-bcmath php-intl php-redis \
    php-tokenizer php-fileinfo php-ctype php-dom php-opcache
```

### Configure PHP

Edit the PHP-FPM configuration:

```bash
sudo nano /etc/php.ini
```

Update the following values:

```ini
memory_limit = 512M
max_execution_time = 120
upload_max_filesize = 200M
post_max_size = 200M
date.timezone = UTC
```

### Configure PHP-FPM Pool

Edit the PHP-FPM pool configuration to use the `nginx` user:

```bash
sudo nano /etc/php-fpm.d/www.conf
```

Set the following:

```ini
user = nginx
group = nginx
listen = /run/php-fpm/www.sock
listen.owner = nginx
listen.group = nginx
```

Enable and start PHP-FPM:

```bash
sudo systemctl enable php-fpm
sudo systemctl start php-fpm
```

Verify PHP is installed:

```bash
php -v
```

---

## Step 3: Install MySQL 8.0

CentOS 9 ships with MySQL 8.0 in its default repositories:

```bash
sudo dnf install -y mysql-server
```

Enable and start MySQL:

```bash
sudo systemctl enable mysqld
sudo systemctl start mysqld
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
sudo dnf install -y redis
```

Enable and start Redis:

```bash
sudo systemctl enable redis
sudo systemctl start redis
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
sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

cat <<EOF | sudo tee /etc/yum.repos.d/elasticsearch.repo
[elasticsearch-8.x]
name=Elasticsearch repository for 8.x packages
baseurl=https://artifacts.elastic.co/packages/8.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
EOF
```

Install Elasticsearch:

```bash
sudo dnf install -y elasticsearch
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
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
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
sudo mkdir -p /var/www
cd /var/www
sudo composer create-project unopim/unopim
```

Set proper ownership:

```bash
sudo chown -R nginx:nginx /var/www/unopim
sudo chmod -R 775 /var/www/unopim/storage /var/www/unopim/bootstrap/cache
```

### Configure SELinux

If SELinux is enabled (default on CentOS/RHEL), set the correct file contexts:

```bash
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/unopim/storage(/.*)?"
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/unopim/bootstrap/cache(/.*)?"
sudo restorecon -Rv /var/www/unopim/storage
sudo restorecon -Rv /var/www/unopim/bootstrap/cache
```

Allow Nginx to make network connections (needed for Redis, MySQL, Elasticsearch):

```bash
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_can_network_connect_db 1
```

::: warning
Do not disable SELinux. Instead, configure it properly as shown above. SELinux provides an important layer of security in production environments.
:::

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

ELASTICSEARCH_HOST=127.0.0.1:9200
```

### Run the Installer

```bash
cd /var/www/unopim
sudo -u nginx php artisan unopim:install
```

Follow the interactive prompts to configure your application name, default locale, currency, and admin credentials.

### Build Frontend Assets

```bash
cd /var/www/unopim
sudo -u nginx npm install
sudo -u nginx npm run build
```

---

## Step 9: Configure Nginx

Install Nginx:

```bash
sudo dnf install -y nginx
```

Create the virtual host configuration:

```bash
sudo nano /etc/nginx/conf.d/unopim.conf
```

::: tip
On CentOS/RHEL, Nginx uses `/etc/nginx/conf.d/` instead of the `sites-available`/`sites-enabled` pattern used on Debian/Ubuntu.
:::

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
        fastcgi_pass unix:/run/php-fpm/www.sock;
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

Remove the default server block if present:

```bash
sudo rm -f /etc/nginx/conf.d/default.conf
```

Test and enable Nginx:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Configure Firewall

Open HTTP and HTTPS ports in firewalld:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

::: tip
For full web server configuration including SSL, Apache alternative, and local domain setup, see [Web Server Configuration](web-server-configuration).
:::

---

## Step 10: Queue Worker and Cron Scheduler

Configure Supervisor for the queue worker and add the Laravel scheduler to cron. The full procedure is documented in **[Queue & Scheduler Setup](queue-scheduler-setup)**.

Quick reference for CentOS / RHEL:

```bash
sudo dnf install -y supervisor
sudo systemctl enable --now supervisord
# then follow Queue & Scheduler Setup using user nginx and queues system,completeness,default
# CentOS/RHEL uses /etc/supervisord.d/*.ini instead of /etc/supervisor/conf.d/*.conf
```

---

## Step 11: Build Elasticsearch Index

After installation, build the product and category search indexes:

```bash
cd /var/www/unopim
sudo -u nginx php artisan unopim:product:index
sudo -u nginx php artisan unopim:category:index
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
sudo systemctl status php-fpm
sudo systemctl status nginx
sudo systemctl status mysqld
sudo systemctl status redis
sudo systemctl status elasticsearch
sudo supervisorctl status
```

---

## Next Steps

- [Web Server Configuration](web-server-configuration) - SSL setup, advanced Nginx/Apache configuration
- [Queue & Scheduler Setup](queue-scheduler-setup) - Advanced queue driver configuration and monitoring
- [Creating a New User](creating-newuser) - Add additional admin users
