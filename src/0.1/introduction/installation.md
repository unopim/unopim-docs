# Installation



## Install Using Composer

To install UnoPim using Composer, use the following steps:

- Choose the directory where you want to install UnoPim. Open your terminal and navigate to this directory.

- If you have downloaded the zip file from the Git repository, extract the files into your desired directory and run the following command to set up the project:

    ```sh
    composer create-project
    ```

- Otherwise, to directly install UnoPim, run the following command in your terminal:

    ```sh
    composer create-project unopim/unopim:^0.1
    ```

- Run the following command to complete the installation:

    ```sh
    php artisan unopim:install
    ```

    ::: warning
    During the installation process, if the **`.env`** file doesn't exist, the installer will prompt you to provide the necessary information.
    :::

    - Follow the prompts during the installation process to provide the following details:

    ```
    - Please Enter the APP URL :
    - Please Enter the Application Name :
    - Please select the default locale :
    - Please enter the default currency :
    - Please choose the Allowed Locales for your channels :
    - Please choose the Allowed Currencies for your channels :
    - Please select the Database Connection :
    - Please enter the Database Host :
    - Please enter the Database Port Number :
    - Please enter the Database Name :
    - Please enter the Database Prefix :
    - Please enter the Database Username :
    - Please enter the Database Password :
    ```

    - For Create your admin credentials:
    ```
    - Enter the Name of Admin User :
    - Enter the Email address of the Admin User :
    - Configure the Password for admin user :
    ```

## Install Using Docker

If you have Docker/Docker Compose installed, follow these steps:

1. **Clone the repository**:
   - HTTPS: `git clone https://github.com/unopim/unopim.git`
   - SSH: `git clone git@github.com:unopim/unopim.git`

2. **Enter the directory**:
   ```bash
   cd unopim
   ```

3. **Start the Docker containers**:
   ```bash
   docker-compose up -d
   ```

   This will pull the necessary images and set up the environment. Once running, access the application at:

   - Application: `http://localhost:8000`
   - MySQL: `http://localhost:3306`

> **Note**:
> If MySQL is already running on your system, change the MySQL port in the `docker-compose.yml` and `.env` files.
> Run `docker-compose up -d` again to apply changes.

## Start Using UnoPim

### On a Production Server

To access UnoPim on a production server, open your domain in a web browser. For example:

```
https://example.com/
```

### On Your Local Server

To access UnoPim on your local server, follow these steps:

1. Configure your HTTP server to point to the **`public/`** directory of the project.
2. Run the following command:

    ```sh
    php artisan serve
    ```

3. Open your browser and access the provided local server URL.

## Configure the Virtual Host

### Creating the Virtual Host File

This guide explains how to create and configure a virtual host for Apache to point to the installation folder of UnoPIM, Create the file **`/etc/apache2/sites-available/unopim.local.conf`**:

```apache
<VirtualHost *:80>
    ServerName unopim.local

    DocumentRoot /path/to/installation/unopim/public
    <Directory /path/to/installation/unopim/public>
        Options FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ReWriteEngine On

    <FilesMatch \.php$>
        SetHandler "proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost/"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/unopim_error.log
    LogLevel warn
    CustomLog ${APACHE_LOG_DIR}/unopim_access.log combined
</VirtualHost>
```
Notes:
- Replace **`/path/to/installation`** with the actual path where UnoPIM is installed.
- Ensure that **`/run/php/php8.2-fpm.sock`** matches the socket path defined in **`/etc/php/8.2/fpm/pool.d/www.conf`**. Update this value if it differs.

### Enabling the Virtual Host

Run the following commands to enable the virtual host:

   ```bash
   $ sudo apache2ctl configtest
    # This will return 'Syntax OK'

   $ sudo a2ensite unopim.local
   $ sudo service apache2 reload
   ```
### Adding the Virtual Host Name

Add the following entry to your **`/etc/hosts`** file:

   ```
    127.0.0.1    unopim.local
   ```
Your virtual host configuration for UnoPIM is now complete. Visit **`http://unopim.local`** in your browser to access the application.
