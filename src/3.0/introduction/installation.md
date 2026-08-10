# Installation

Installing UnoPim takes only a handful of commands, whether you prefer the terminal, a browser-based installer, or a ready-made cloud image. Pick the method below that fits your environment, and this guide will walk you through every step from the first `composer` command to your running admin panel.

## Install Using Composer

To install UnoPim using Composer, follow these steps:

- Choose the directory where you want to install UnoPim. Open your terminal and navigate to this directory.

- If you have downloaded the zip file from the Git repository, extract the files into your desired directory and run the following command to set up the project:

    ```sh
    composer install
    ```

- Otherwise, to directly install UnoPim, run the following command in your terminal:

    ```sh
    composer create-project unopim/unopim
    ```

- Install frontend dependencies and build assets:

    ```sh
    npm install
    npm run build
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
    - Please provide the name of the application
    - Please provide the application URL
    - Please select the default application locale
    - Please select the default currency
    - Please choose the allowed locales for your channels
    - Please choose the allowed currencies for your channels
    - Please select the database connection
    - Please enter the database host
    - Please enter the database port
    - Please enter the database name
    - Please enter the database prefix
    - Please enter your database username
    - Please enter your database password
    - Do you want to enable Elasticsearch?
      (if yes: connection, host or Cloud ID, user, password or API key, index prefix)
    - Select optional packages to install
    - Do you want sample products? [no]
        [0] yes
        [1] no
    ```
    - You will then be asked to create your admin credentials:
    ```
    - Set the Name for Administrator
    - Provide Email of Administrator
    - Input a Password for Administrator
    ```

    ::: tip Command options
    `unopim:install` accepts `--skip-env-check`, `--skip-admin-creation`, `--with-demo-data`, and `--with-packages=` (comma-separated: `dam`, `shopify`, `bagisto`).
    :::

- After the installation completes, build the Elasticsearch indexes:

    ```sh
    php artisan unopim:product:index
    php artisan unopim:category:index
    ```

- Optionally, verify translation coverage across all 33 supported locales:

    ```sh
    php artisan unopim:translations:check
    ```

## Install with Demo Data

UnoPim can seed sample products, demo categories, and demo extras so you have data to explore immediately after installation. This is useful for evaluation, development, and testing environments.

::: warning
Demo data is intended for non-production environments. Do not seed demo data on a live store.
:::

### Option 1: Seed During Installation

When you answer **yes** to the sample products prompt during `php artisan unopim:install`, the installer automatically seeds the sample products once your admin account has been created — no extra command needed.

### Option 2: Seed After Installation

If you have already installed UnoPim and want to add demo data later, run the standalone command:

```sh
php artisan unopim:install:demo-data
```

This seeds demo extras, demo categories, and sample products into an existing UnoPim database. See [CLI Commands](../advanced/cli-commands.html#demo-data-seeding) for full details, including the `--force` option for re-seeding.

After seeding demo data, rebuild the Elasticsearch indexes so the new products and categories appear in search and listings:

```sh
php artisan unopim:product:index
php artisan unopim:category:index
```

## Install Using Docker

For Docker-based installation, see the dedicated **[Installation with Docker](installation-docker)** guide.

## Install Using GUI Installer

If you prefer a browser-based setup over the terminal, the GUI installer walks you through the same configuration in a visual wizard. You can reach it through either of the following methods:

### Method 1: Direct Installation

1. Choose the directory where you want to install UnoPim. Open your terminal and navigate to this directory.

2. Run the following command in your terminal to install UnoPim:
    ```sh
    composer create-project unopim/unopim
    ```

3. Configure your HTTP server to point to the `public/` directory of the project.

4. Open your browser and access:
    ```
    http://localhost/unopim/public/
    ```
    This will launch the UnoPim installer.

### Method 2: Using Downloaded Package

1. [Download UnoPim](https://unopim.com/download/) from our official repository.

2. Extract the contents of the downloaded package to your desired directory.

3. Navigate to the project root directory.

4. Run the following command:
    ```sh
    composer install
    ```

5. Configure your HTTP server to point to the `public/` directory of the project.

6. Open your browser and access:
    ```
    http://localhost/unopim/public/
    ```
    This will launch the UnoPim installer.

::: warning Important Prerequisites
Make sure your system meets these requirements:
- Composer is installed on your system
- PHP >= 8.4.1
- Required PHP extensions are enabled
- Proper directory permissions are set
:::

::: tip Demo Data
During the admin setup step of the GUI installer, you can enable the demo data toggle to seed sample products, demo categories, and demo extras. Leave it off for a clean installation — you can always seed demo data later with `php artisan unopim:install:demo-data` (see [Install with Demo Data](#install-with-demo-data)).
:::

## Install on macOS

Follow these steps to install UnoPim on macOS:

### Prerequisites

1. **Update Homebrew**:
    To ensure you have the latest version of Homebrew, run the following command:
   ```sh
   brew update
   ```

2. **Install PHP**:
  To install PHP, run the following command:
   ```sh
   brew install php
   ```

3. **Install Node.js**:
   To install Node.js, run the following command:
   ```sh
   brew install node
   ```

4. **Install Composer**:
   To install Composer, run the following command:
   ```sh
   brew install composer
   ```

5. **Install MySQL**:
   To install MySQL, run the following command:
   ```sh
   brew install mysql
   ```

### Installation Steps

1. Choose the directory where you want to install UnoPim. Open your terminal and navigate to this directory.

2. **Install UnoPim** :
  - Run the following command in your terminal to install UnoPim:

     ```sh
     composer create-project unopim/unopim
     ```
  - Change directory to the project root directory:
    ```sh
     cd unopim
    ```
3. **Configure Environment (optional)** :
   - Copy the `.env.example` file to `.env`:
   ```sh
   cp .env.example .env
   ```
   - Update the following configurations in `.env`:
     ```
     APP_URL=http://localhost:8000
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=unopim
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Run the installation command**:
   ```sh
   php artisan unopim:install
   ```

5. **Start the development server**:
   ```sh
   php artisan serve
   ```

Your UnoPim installation should now be accessible at `http://localhost:8000`.

::: tip
For a more production-like environment on macOS, you can use tools like Laravel Valet or Docker.
:::

::: warning Note
- Make sure your PHP version is 8.4.1 or higher and all required PHP extensions are installed.
- Make sure your Composer version is 2.6 or higher and MySQL is installed.
:::

## Install Using Amazon Cloud AMI

Follow these steps to install UnoPim on Amazon Web Services (AWS) using an Amazon Machine Image (AMI):

### Installation Steps

**Step 1: Launch the EC2 Instance**

- [Launch an EC2 instance from the Unopim AMI via AWS Marketplace.](https://aws.amazon.com/marketplace/pp/prodview-fdyosdv7k3cgw)
- Wait until the instance status is “running”.

**Step 2: Access Your EC2 Instance**

- Set your PEM file permission:
    ```sh
    chmod 400 your-key-file.pem
    ```
- Connect to your instance:
    ```sh
    ssh -i your-key-file.pem ubuntu@your-instance-ip
    ```
    Replace `your-key-file.pem` and `your-instance-ip` with your actual key and public IP.

**Step 3: Run SSL Script**

- Make sure your domain’s A record points to your EC2 Elastic IP.
- (If using Cloudflare or a similar proxy, disable proxy before running the script.)
- Run the SSL configuration:
    ```sh
    sudo bash /root/ssl_configuration.sh
    ```
    This sets up Let's Encrypt SSL and configures Apache for HTTPS.

**Step 4: Complete Unopim Installation Through the Web Interface**

- Visit `https://yourdomain.com/` in your browser.
- Click **“Continue”** on the setup screen.
- Follow the on-screen steps:
    - **System Requirements:** Review and continue.
    - **Database Setup:** Use credentials found on your server:
        ```sh
        cat /var/www/html/unopim/mysql_password.txt
        ```
    - **Start Installation:** Click the button to install Unopim.
    - **Domain URL:** Enter your domain (e.g., `https://yourdomain.com`).
    - **Set Defaults:** Timezone, locale, currency, and allowed options.
    - **Admin Setup:** Create admin credentials and set timezone/locale.

- After setup, log in to the Unopim Admin Panel.

**Security Step:**
Delete the credentials file after setup:
```sh
sudo rm /var/www/html/unopim/mysql_password.txt
```

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

## Next Steps

After installing UnoPim, complete the following setup:

- **[Web Server Configuration](web-server-configuration)** - Configure Nginx or Apache virtual hosts, SSL with Let's Encrypt, and local domain setup.
- **[Queue & Scheduler Setup](queue-scheduler-setup)** - Set up Supervisor for queue workers and cron for the scheduler.
- **[Creating a New User](creating-newuser)** - Add additional admin users to your UnoPim instance.
