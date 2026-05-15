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
    composer create-project unopim/unopim
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

### Prerequisites

Make sure the following are installed on your system:

* **Docker** (v20.10+)
* **Docker Compose** (v2.0+ — included with Docker Desktop)

Verify installation:

```bash
docker --version
docker compose version
```

### Method 1: Using Docker Hub (Quick Start)

Download only the compose file and environment config — no source code needed.

```bash
curl -O https://raw.githubusercontent.com/unopim/unopim/master/docker-compose.hub.yml
curl -O https://raw.githubusercontent.com/unopim/unopim/master/.env.docker
cp .env.docker .env
docker compose -f docker-compose.hub.yml up -d
```

Wait approximately 90 seconds for the first-time setup (migrations, seeding) to complete, then open:

**`http://localhost:8000/admin`**

### Method 2: Using Docker Compose from Source (Recommended for Developers)

This method builds from source and gives full control over the environment.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/unopim/unopim.git
cd unopim
```

#### Step 2: Configure Environment

```bash
cp .env.docker .env
```

::: warning
Always copy from **`.env.docker`** (not `.env.example`) — it contains pre-configured Docker service hostnames and ports.
:::

#### Step 3: Start Containers

**Nginx + PHP-FPM** (default, recommended for production):

```bash
docker compose up -d
```

**Apache + mod_php** (alternative):

```bash
docker compose -f docker-compose.yml -f docker-compose.apache.yml up -d
```

The first start takes a few minutes as Docker builds the images and runs the initial setup (Composer install, migrations, seeding, Elasticsearch indexing).

#### Step 4: Access Services

| Service           | URL                          |
| ----------------- | ---------------------------- |
| UnoPim Admin      | `http://localhost:8000/admin` |
| Mailpit (email)   | `http://localhost:8025`       |
| MySQL             | `localhost:3306`              |
| Redis             | `localhost:6379`              |
| Elasticsearch     | `localhost:9200`              |

**Default Admin Credentials:**

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `admin123`          |

### Managing Containers

```bash
# Check status
docker compose ps

# View logs
docker compose logs -f unopim-fpm      # application logs
docker compose logs -f unopim-nginx    # web server logs

# Stop all containers
docker compose down

# Stop and remove all data (volumes)
docker compose down -v

# Rebuild after code changes
docker compose up --build -d
```

### Running Artisan Commands Inside Docker

```bash
docker compose exec unopim-fpm php artisan migrate
docker compose exec unopim-fpm php artisan cache:clear
docker compose exec unopim-fpm php artisan unopim:product:index
```

For the Apache variant, replace `unopim-fpm` with `unopim-web`:

```bash
docker compose exec unopim-web php artisan migrate
```

### Troubleshooting

#### Port Conflicts

If you already have MySQL, Redis, Elasticsearch, or a web server running locally, Docker will fail with:

```
Bind for 127.0.0.1:3306 failed: port is already allocated
```

**Fix:** Edit the `FORWARD_*` ports in your `.env` file. These only control the host-side mapping — they do **not** affect how services connect inside Docker:

```dotenv
# Change these to any available ports on your host
APP_PORT=8080
FORWARD_DB_PORT=33060
FORWARD_REDIS_PORT=16379
FORWARD_ES_PORT=19200
FORWARD_MAILPIT_PORT=18025
FORWARD_MAILPIT_SMTP_PORT=11025
```

Then restart:

```bash
docker compose down
docker compose up -d
```

Access UnoPim at the new port: `http://localhost:8080/admin`

#### Elasticsearch "503 Service Unavailable" or "no_shard_available"

If the product listing page shows an Elasticsearch error, the cluster may be unhealthy due to **disk space**. Elasticsearch stops allocating shards when disk usage exceeds 85%.

**Check cluster health:**

```bash
curl http://localhost:9200/_cluster/health
```

If status is `red`, override the disk watermark thresholds:

```bash
curl -X PUT http://localhost:9200/_cluster/settings \
  -H ‘Content-Type: application/json’ \
  -d ‘{
    "persistent": {
      "cluster.routing.allocation.disk.watermark.low": "95%",
      "cluster.routing.allocation.disk.watermark.high": "97%",
      "cluster.routing.allocation.disk.watermark.flood_stage": "99%"
    }
  }’
```

Then reindex products:

```bash
docker compose exec unopim-fpm php artisan unopim:product:index
```

::: tip
For production, free up disk space instead of raising watermarks. The defaults (85%/90%/95%) exist to protect your data.
:::

#### First-Time Setup Hangs or Fails

The entrypoint script runs migrations and seeds on first start. If it fails:

```bash
# Check what happened
docker compose logs unopim-fpm | tail -50

# Retry by removing the lock file and restarting
docker compose exec unopim-fpm rm -f /var/www/html/storage/unopim.lock
docker compose restart unopim-fpm
```

#### Storage/Image Permissions

Product images are stored via a symlink: `public/storage -> storage/app/public`. If images return 404 or 403:

```bash
# Verify symlink exists
docker compose exec unopim-fpm ls -la public/storage

# If missing, recreate it
docker compose exec unopim-fpm php artisan storage:link

# Fix permissions
docker compose exec unopim-fpm chown -R www-data:www-data storage bootstrap/cache
docker compose exec unopim-fpm chmod -R 775 storage bootstrap/cache
```


## Install Using GUI Installer

To install UnoPim using our GUI installer, you can follow any of the following methods:

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
    composer create
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
- PHP >= 8.2
- Required PHP extensions are enabled
- Proper directory permissions are set
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
  - Chnage directory to project root directory
    ```sh
     cd unopim
    ```
3. **Configure Environment(optional)** :
   - Copy the `.env.example` file to `.env`
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
- Make sure your PHP version is 8.1 or higher and all required PHP extensions are installed.
- Make sure your Composer version is 2.0 or higher and mysql is installed.
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


### Cloud Installation via Amazon AMI

You can quickly launch UnoPim on the cloud using our official Amazon Machine Image (AMI): [Launch on Cloud](https://aws.amazon.com/marketplace/pp/prodview-fdyosdv7k3cgw)


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

Depending on your web server, you can configure UnoPim with either **Apache 2** or **NGINX**.

---

### Configure Using Apache 2

#### Creating the Virtual Host File

Create the file **`/etc/apache2/sites-available/unopim.local.conf`**:

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

**Notes**:

* Replace **`/path/to/installation`** with the actual path where UnoPim is installed.
* Ensure that **`/run/php/php8.2-fpm.sock`** matches the socket path defined in **`/etc/php/8.2/fpm/pool.d/www.conf`**.

#### Enabling the Virtual Host

```bash
sudo apache2ctl configtest   # should return "Syntax OK"
sudo a2ensite unopim.local
sudo service apache2 reload
```

#### Adding the Virtual Host Name

Edit your **`/etc/hosts`** file:

```
127.0.0.1    unopim.local
```

Now open **`http://unopim.local`** in your browser to access UnoPim.

---

### Configure Using NGINX

#### Creating the Virtual Host File

Create the file **`/etc/nginx/sites-available/unopim.local.conf`**:

```nginx
server {
    listen 80;
    server_name unopim.local;   # Replace with your dev domain or server IP

    root /home/unopim/html/unopim/public;   # UnoPim document root
    index index.php index.html index.htm;

    # Handle static files (CSS, JS, images)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle PHP requests
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;   # Adjust PHP-FPM socket if needed
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files like .htaccess
    location ~ /\.ht {
        deny all;
    }

    error_log /var/log/nginx/unopim_error.log;
    access_log /var/log/nginx/unopim_access.log;
}
```

**Notes**:

* Replace **`/home/unopim/html/unopim/public`** with your actual UnoPim installation path if different.
* Make sure PHP-FPM is running (`php8.2-fpm` by default).

---

#### Enabling the Virtual Host

```bash
sudo ln -s /etc/nginx/sites-available/unopim.local.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove default config
sudo nginx -t   # test config
sudo systemctl reload nginx
```

---

#### Adding the Virtual Host Name

Add this entry to your **`/etc/hosts`** file on your server (and local machine if testing from there):

```
127.0.0.1    unopim.local
```

---


Now open **`http://unopim.local`** in your browser to access UnoPim.
