# Web Server Configuration

## Overview

This guide covers web server configuration for UnoPim on bare-metal installations. It includes full Nginx and Apache virtual host configurations with SSL, gzip compression, static file caching, and security hardening.

::: tip Docker Users
If you are running UnoPim with Docker, the web server is pre-configured inside the container. You do not need to follow this guide.
:::

---

## Nginx (Recommended)

Nginx is the recommended web server for UnoPim due to its superior performance with PHP-FPM.

### Full Virtual Host Configuration

Create the configuration file:

**Ubuntu / Debian:**
```bash
sudo nano /etc/nginx/sites-available/unopim.conf
```

**CentOS / RHEL:**
```bash
sudo nano /etc/nginx/conf.d/unopim.conf
```

Add the following server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/unopim/public;
    index index.php;

    charset utf-8;

    # Allow large file uploads (images, CSVs, etc.)
    client_max_body_size 200M;

    # ──────────────────────────────────────────────
    # Gzip compression
    # ──────────────────────────────────────────────
    gzip on;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript
        image/svg+xml;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 5;
    gzip_proxied any;

    # ──────────────────────────────────────────────
    # Dynamic image cache — /cache/{template}/{filename} is rendered by
    # PHP, so it must reach the front controller. This block has to come
    # BEFORE the static-extension rule below, which would 404 it.
    # ──────────────────────────────────────────────
    location ^~ /cache/ {
        try_files $uri /index.php?$query_string;
    }

    # ──────────────────────────────────────────────
    # Passport QR carrier — /p/{uuid}/carrier.svg is generated on the fly.
    # Same reason: it must precede the static .svg rule.
    # ──────────────────────────────────────────────
    location ~ ^/p/[^/]+/carrier\.svg$ {
        try_files $uri /index.php?$query_string;
    }

    # ──────────────────────────────────────────────
    # Static file caching (30 days)
    # ──────────────────────────────────────────────
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp|map|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }

    # ──────────────────────────────────────────────
    # Main location — route all requests through Laravel
    # ──────────────────────────────────────────────
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # ──────────────────────────────────────────────
    # PHP processing via PHP-FPM
    # ──────────────────────────────────────────────
    location ~ ^/index\.php(/|$) {
        fastcgi_split_path_info ^(.+\.php)(/.*)$;

        # Ubuntu/Debian socket path:
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        # CentOS/RHEL socket path (uncomment if needed):
        # fastcgi_pass unix:/run/php-fpm/www.sock;

        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;

        # Prevent the httpoxy vulnerability
        fastcgi_param HTTP_PROXY "";

        # Forward client info so url(), secure() and trusted proxies work
        fastcgi_param HTTP_X_FORWARDED_FOR $proxy_add_x_forwarded_for;
        fastcgi_param HTTP_X_FORWARDED_PROTO $scheme;
        fastcgi_param HTTP_X_REAL_IP $remote_addr;

        # Timeout for long-running operations (imports, exports)
        fastcgi_read_timeout 600;
        fastcgi_send_timeout 600;

        # Buffer settings for large responses
        fastcgi_buffers 32 32k;
        fastcgi_buffer_size 128k;
        fastcgi_busy_buffers_size 256k;

        internal;
    }

    # ──────────────────────────────────────────────
    # Security: Never serve executable or active content from uploads
    # ──────────────────────────────────────────────
    location ~* ^/storage/.*\.(php[0-9]?|phtml|pht|phar|html?|shtml|xhtml)$ {
        return 404;
    }

    # ──────────────────────────────────────────────
    # Security: only index.php may execute
    # ──────────────────────────────────────────────
    location ~ \.php$ {
        return 404;
    }

    # ──────────────────────────────────────────────
    # ACME HTTP-01 validation (must precede the dot-file deny)
    # ──────────────────────────────────────────────
    location ^~ /.well-known/acme-challenge/ {
        allow all;
        try_files $uri =404;
    }

    # ──────────────────────────────────────────────
    # Security: Deny access to hidden files (.env, .git, etc.)
    # ──────────────────────────────────────────────
    location ~ /\. {
        deny all;
        access_log off;
    }

    # ──────────────────────────────────────────────
    # Logging
    # ──────────────────────────────────────────────
    error_log /var/log/nginx/unopim_error.log;
    access_log /var/log/nginx/unopim_access.log;
}
```

### Enable the Site

**Ubuntu / Debian:**
```bash
sudo ln -s /etc/nginx/sites-available/unopim.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

**CentOS / RHEL:**
```bash
sudo rm -f /etc/nginx/conf.d/default.conf
sudo nginx -t
sudo systemctl reload nginx
```

---

## Apache

If you prefer Apache, use the following virtual host configuration with PHP-FPM proxy.

### Prerequisites

Enable required Apache modules:

```bash
sudo a2enmod proxy_fcgi setenvif rewrite headers expires
sudo systemctl restart apache2
```

### Full Virtual Host Configuration

Create the configuration file:

```bash
sudo nano /etc/apache2/sites-available/unopim.conf
```

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/unopim/public

    <Directory /var/www/unopim/public>
        Options FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    # PHP-FPM proxy
    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.4-fpm.sock|fcgi://localhost/"
    </FilesMatch>

    # Timeout for long-running operations
    ProxyTimeout 600

    # Deny access to hidden files
    <DirectoryMatch "/\.">
        Require all denied
    </DirectoryMatch>

    # Deny PHP execution in writable directories
    <DirectoryMatch "^/var/www/unopim/(storage|bootstrap/cache)">
        <FilesMatch "\.php$">
            Require all denied
        </FilesMatch>
    </DirectoryMatch>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml
    </IfModule>

    # Dynamic routes that must not be treated as static files:
    # /cache/{template}/{filename} (image cache) and
    # /p/{uuid}/carrier.svg (passport QR carrier) are rendered by PHP.
    # Laravel's shipped public/.htaccess already routes anything that is
    # not an existing file to index.php, so keep AllowOverride All and do
    # not add expiry rules that bypass the front controller for them.
    <LocationMatch "^/(cache/|p/[^/]+/carrier\.svg$)">
        <IfModule mod_expires.c>
            ExpiresActive Off
        </IfModule>
        Header unset Cache-Control
    </LocationMatch>

    # Never serve executable or active content from uploads
    <LocationMatch "^/storage/.*\.(php[0-9]?|phtml|pht|phar|html?|shtml|xhtml)$">
        Require all denied
    </LocationMatch>

    # Static file caching
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpeg "access plus 30 days"
        ExpiresByType image/png "access plus 30 days"
        ExpiresByType image/gif "access plus 30 days"
        ExpiresByType image/svg+xml "access plus 30 days"
        ExpiresByType text/css "access plus 30 days"
        ExpiresByType application/javascript "access plus 30 days"
        ExpiresByType font/woff2 "access plus 30 days"
        ExpiresByType font/woff "access plus 30 days"
    </IfModule>

    # Upload size limit
    LimitRequestBody 209715200

    ErrorLog ${APACHE_LOG_DIR}/unopim_error.log
    LogLevel warn
    CustomLog ${APACHE_LOG_DIR}/unopim_access.log combined
</VirtualHost>
```

### Enable the Site

```bash
sudo a2ensite unopim.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## SSL with Let's Encrypt

### Install Certbot

**Ubuntu / Debian:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**CentOS / RHEL:**
```bash
sudo dnf install -y certbot python3-certbot-nginx
```

**For Apache** (replace `nginx` with `apache`):
```bash
sudo apt install -y certbot python3-certbot-apache   # Ubuntu/Debian
sudo dnf install -y certbot python3-certbot-apache    # CentOS/RHEL
```

### Obtain and Install Certificate

**Nginx:**
```bash
sudo certbot --nginx -d your-domain.com
```

**Apache:**
```bash
sudo certbot --apache -d your-domain.com
```

Certbot will automatically:
- Obtain a certificate from Let's Encrypt
- Modify your virtual host to serve over HTTPS
- Add an HTTP-to-HTTPS redirect
- Configure automatic certificate renewal

### Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### Update APP_URL

After enabling SSL, update your `.env` file:

```dotenv
APP_URL=https://your-domain.com
```

Then clear the config cache:

```bash
cd /var/www/unopim
php artisan config:cache
```

---

## Local Domain Setup (Development)

For local development, you can use a custom domain name instead of `localhost`.

### Step 1: Add Host Entry

Edit your hosts file:

```bash
sudo nano /etc/hosts
```

Add the following line:

```
127.0.0.1    unopim.local
```

### Step 2: Update Nginx Configuration

Set `server_name` to your local domain:

```nginx
server_name unopim.local;
```

### Step 3: Update .env

```dotenv
APP_URL=http://unopim.local
```

### Step 4: Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Open `http://unopim.local` in your browser to access UnoPim.

---

## PHP-FPM Configuration

### Verify Socket Path

Make sure the `fastcgi_pass` directive in your Nginx config matches the actual PHP-FPM socket path.

**Ubuntu / Debian:**
```bash
grep "^listen " /etc/php/8.4/fpm/pool.d/www.conf
```

Expected output: `listen = /run/php/php8.4-fpm.sock`

**CentOS / RHEL:**
```bash
grep "^listen " /etc/php-fpm.d/www.conf
```

Expected output: `listen = /run/php-fpm/www.sock`

### Tune PHP-FPM Workers

For production, adjust PHP-FPM worker settings based on available memory:

```bash
# Ubuntu/Debian
sudo nano /etc/php/8.4/fpm/pool.d/www.conf

# CentOS/RHEL
sudo nano /etc/php-fpm.d/www.conf
```

Recommended settings for a 4 GB server:

```ini
pm = dynamic
pm.max_children = 20
pm.start_servers = 5
pm.min_spare_servers = 3
pm.max_spare_servers = 10
pm.max_requests = 500
```
