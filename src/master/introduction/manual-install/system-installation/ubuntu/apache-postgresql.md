# Apache + PostgreSQL (Ubuntu)

:::warning **Prerequisite**
Complete the [**Ubuntu Base Preparation**](./preparation.md) and
[**System Requirements**](../../requirements.md) steps before following this guide.

This page assumes PHP 8.2, PHP-FPM, Composer, Node.js, and the required system
packages are already installed.
:::

This guide installs and configures **Apache** and **PostgreSQL** for running UnoPim on Ubuntu.

## Summary

This guide covers:

- Installing and enabling Apache
- Enabling required Apache modules for PHP-FPM
- Installing PostgreSQL server
- Creating a database and user
- Installing the PostgreSQL PHP extension
- Apache virtual host configuration
- Verifying PHP-FPM integration

## Important notes

:::warning
**Documentation example credentials & paths (do not use in production)**

The examples below use the following demo values for clarity:

- **PostgreSQL superuser password:** `password`  
- **UnoPim database name:** `unopim_db`  
- **UnoPim database user:** `unopim_user`  
- **UnoPim database user password:** `unopim_password`  
- **Document root (example):** `/home/unopim/unopim/public`

These values are **only** examples to make the commands easier to copy/test.
**Replace** them with secure values on any real or production system.
:::

---

## Install Apache

```bash
sudo apt-get install -y apache2         # install Apache package
sudo systemctl enable apache2           # enable Apache at boot
sudo systemctl start apache2            # start Apache now
systemctl status apache2                 # verify Apache is running
````

## Enable required Apache modules

```bash
sudo a2enmod rewrite                    # enable URL rewriting
sudo a2enmod proxy                      # enable proxy support
sudo a2enmod proxy_fcgi                 # enable PHP-FPM proxying
sudo a2enmod headers                    # enable HTTP headers
sudo systemctl reload apache2           # reload Apache configuration
```

## Install PostgreSQL server

```bash
sudo apt-get install -y postgresql postgresql-contrib   # install PostgreSQL
sudo systemctl enable postgresql                        # enable PostgreSQL at boot
sudo systemctl start postgresql                         # start PostgreSQL now
systemctl status postgresql                              # verify PostgreSQL is running
```

## Install PHP PostgreSQL extension

```bash
sudo apt-get install -y php8.2-pgsql    # install PHP PostgreSQL extension
sudo systemctl restart php8.2-fpm       # restart PHP-FPM to load extension
```

## Configure PostgreSQL

Switch to the PostgreSQL superuser:

```bash
sudo -i -u postgres                     # switch to postgres user
psql                                    # open PostgreSQL shell
```

Create the UnoPim database:

```sql
CREATE DATABASE unopim_db;             -- create database
```

Create the database user and set password:

```sql
CREATE USER unopim_user WITH PASSWORD 'unopim_password';   -- create DB user
GRANT ALL PRIVILEGES ON DATABASE unopim_db TO unopim_user; -- grant privileges
\q
```

Exit the postgres user shell:

```bash
exit                                    # return to normal user
```

---

## Configure Apache Virtual Host

```bash
sudo nano /etc/apache2/sites-available/unopim.conf   # create vhost file
```

Add:

```apache
<VirtualHost *:80>
    ServerName your-domain-or-ip

    DocumentRoot /home/unopim/unopim/public

    <Directory /home/unopim/unopim/public>
        AllowOverride All
        Require all granted
    </Directory>

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/unopim_error.log
    CustomLog ${APACHE_LOG_DIR}/unopim_access.log combined
</VirtualHost>
```

Enable the site and reload Apache:

```bash
sudo a2dissite 000-default.conf          # disable default site
sudo a2ensite unopim.conf                # enable UnoPim site
sudo systemctl reload apache2            # reload Apache with new vhost
```

## Verify PHP-FPM integration

```bash
nano /home/unopim/unopim/public/info.php     # create test PHP file
```

Add:

```php
<?php phpinfo(); ?>
```

Open in browser:

```
http://your-domain-or-ip/info.php
```

Confirm PHP 8.2 and PostgreSQL extensions are loaded, then remove the file:

```bash
rm /home/unopim/unopim/public/info.php       # remove phpinfo file
```

## Next steps — Install UnoPim

Your system is now configured with **Apache, PostgreSql and PHP-FPM** and is ready
for UnoPim installation.

Choose **one** of the following installation methods:

### Option 1: Install via Composer (recommended for developers)

Use this method if you prefer a terminal-based installation experience.

➡️ Continue with:
[**Install UnoPim via Composer**](../../composer)

### Option 2: Install via GUI Installer

Use this method if you prefer a browser-based installation experience.

➡️ Continue with:
[**Install UnoPim via GUI Installer**](../../gui-installer)
