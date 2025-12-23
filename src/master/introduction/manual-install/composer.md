# Install UnoPim via Composer

This guide explains how to install **UnoPim** using Composer as part of the manual
installation process. This method gives you full control over the system and
application configuration.

:::warning Prerequisites
Before continuing, ensure you have completed:

- [**System Requirements**](./requirements)
- [**System Installation**](./system-installation)

This includes PHP 8.2, PHP-FPM, a supported web server, a supported database,
and all required PHP extensions.
:::

## Step 1 - Download UnoPim

:::info
UnoPim **must be installed inside the directory configured as the
DocumentRoot in your web server**.

The installation directory **must match** the path configured in your
virtual host.

### Example

If your virtual host is configured like this:

```apache
DocumentRoot /home/unopim/unopim/public
````

Then UnoPim must be installed at:

```text
/home/unopim/unopim
```

The web server is configured to serve the public directory of the above path, so Unopim must be placed here.

:::

---

Navigate to your chosen installation directory and run:

```bash
composer create-project unopim/unopim
```

This will download the UnoPim source code along with all dependencies.

## Step 2 - Run the installer

From the UnoPim project root, run:

```bash
php artisan unopim:install
```

This command launches the interactive installation wizard.

### Installer prompts

During the installation, you will be asked to provide values for:

#### Application details

```text
Enter the Application Name: UnoPim
Enter the Application URL: http://your-domain-or-ip
Enter the Default Timezone: UTC
```

#### Localization

```text
Select the Default Locale: en_US
Select the Default Currency: USD
Select Allowed Locales: en_US, fr_FR, de_DE
Select Allowed Currencies: USD, EUR
```

#### Database details

```text
Select Database Connection: mysql
Enter Database Host: 127.0.0.1
Enter Database Port: 3306
Enter Database Name: unopim_db
Enter Database Username: unopim_user
Enter Database Password: ********
Enter Database Prefix (optional):
```

#### Elasticsearch (optional)

```text
Enable Elasticsearch? (yes/no): yes
Select Elasticsearch Connection Type: default
Enter Elasticsearch Host: 127.0.0.1:9200
Enter Elasticsearch User: elastic
Enter Elasticsearch Password: ********
Enter Elasticsearch Index Prefix: unopim_
```

If Elasticsearch is enabled, the installer will test the connection, clear
existing indexes, and index categories and products automatically.

#### Create your admin credentials

```text
Enter the Name of Admin User:
Enter the Email address of the Admin User:
Configure the Password for admin user:
```
## Step 3 - Access UnoPim

Once installation completes, open your browser and navigate to:

```text
http://your-domain-or-ip
```
