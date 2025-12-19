# Apache + MySQL (Ubuntu)

:::warning **Prerequisite**
Complete the [**Ubuntu Base Preparation**](./preparation.md) and
[**System Requirements**](../../requirements.md) steps before following this guide.

This page assumes PHP 8.2, PHP-FPM, Composer, Node.js, and the required system
packages are already installed.
:::

This guide installs and configures **Apache** and **MySQL** for running UnoPim on
Ubuntu.

## Summary

This guide covers:

* Installing and enabling Apache
* Enabling required Apache modules for PHP-FPM
* Installing MySQL server
* Creating a database and database user
* Installing the **MySQL PHP extension** (database-specific)
* Apache virtual host configuration
* Verifying PHP-FPM integration

:::warning
**Documentation example credentials & paths (do not use in production)**

The examples below use the following demo values for clarity:

- **MySQL root password:** `password`  
- **UnoPim database name:** `unopim_db`  
- **UnoPim database user:** `unopim_user`  
- **UnoPim database user password:** `unopim_password`  
- **Document root (example):** `/home/unopim/unopim/public`

These values are **only** examples to make the commands easier to copy/test.
**Replace** them with secure values on any real or production system.
:::

## Install Apache

Install the Apache web server.

```bash
sudo apt-get install -y apache2         # install Apache package
```

Enable Apache at boot and start the service.

```bash
sudo systemctl enable apache2           # enable Apache at boot
sudo systemctl start apache2            # start Apache
```

Verify Apache status.

```bash
systemctl status apache2                # check Apache status
```

## Enable required Apache modules

Enable modules required to run PHP applications with PHP-FPM.

```bash
sudo a2enmod rewrite                    # enable URL rewriting
sudo a2enmod proxy                      # enable proxy support
sudo a2enmod proxy_fcgi                 # enable PHP-FPM proxying
sudo a2enmod headers                    # enable HTTP headers
```

Reload Apache to apply changes.

```bash
sudo systemctl reload apache2           # reload Apache configuration
```

## Install MySQL server

Install MySQL from Ubuntu repositories.

```bash
sudo apt-get install -y mysql-server    # install MySQL server
```

Enable and start MySQL.

```bash
sudo systemctl enable mysql             # enable MySQL at boot
sudo systemctl start mysql              # start MySQL
```

Verify MySQL status.

```bash
systemctl status mysql                  # check MySQL status
```


## Install PHP MySQL extension

Install the PDO MySQL extension required by UnoPim.

```bash
sudo apt-get install -y php8.2-mysql    # install MySQL PHP extension
sudo systemctl restart php8.2-fpm       # restart PHP-FPM
```
:::danger IMPORTANT
The PDO MySQL extension must be enabled. Without it, PHP cannot connect to the MySQL database.
:::

## Configure MySQL

Log in to MySQL as root using the Unix socket.

```bash
sudo mysql                              # open MySQL shell as root
```

### Option A — Set root password with explicit plugin (example)

Use this only if `mysql_native_password` is required.

```sql
ALTER USER 'root'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'password';
```

### Option B — Set root password using default plugin (recommended)

Uses MySQL’s default authentication plugin.

```sql
ALTER USER 'root'@'localhost'
IDENTIFIED BY 'password';
```

Exit MySQL and re-login using password authentication.

```sql
EXIT;
```

```bash
mysql -u root -p                        # login using root password
```

## Create UnoPim database and user

Create the database (example name `unopim_db`).

```sql
CREATE DATABASE unopim_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Create a dedicated database user (`unopim_user`) with password `unopim_password`.

```sql
CREATE USER 'unopim_user'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'unopim_password';
```

Grant privileges to the user.

```sql
GRANT ALL PRIVILEGES ON unopim_db.*
TO 'unopim_user'@'localhost';
```

Apply changes and exit.

```sql
FLUSH PRIVILEGES;
EXIT;
```


## Configure Apache Virtual Host

Create a new virtual host file.

```bash
sudo nano /etc/apache2/sites-available/unopim.conf   # create vhost file
```

Add the following configuration. Use `your-domain-or-ip` for `ServerName`
and replace the path if your code lives elsewhere:

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

Enable the site and reload Apache.

```bash
sudo a2dissite 000-default.conf          # disable default site
sudo a2ensite unopim.conf                # enable UnoPim site
sudo systemctl reload apache2            # reload Apache
```

## Verify PHP-FPM integration

Create a temporary PHP info file.

```bash
nano /home/unopim/unopim/public/info.php     # create test PHP file
```

Add:

```php
<?php phpinfo(); ?>
```

Open in a browser:

```
http://your-domain-or-ip/info.php
```

Confirm PHP 8.2 and MySQL extensions are loaded, then remove the file.

```bash
rm /home/unopim/unopim/public/info.php       # remove phpinfo file
```
