# Requirements



## Server Configuration

- **Server**: Apache 2 or NGINX
- **RAM**: 8GB or higher
- **Node**: 18.12.0 LTS or higher
- **PHP**: 8.2 or higher
- **Composer**: 2.2.0 or higher

## PHP Extensions

Ensure the following extensions are installed and enabled. You can check using the **`phpinfo()`** page or the **`php -m`** command.

- **php-curl extension**: This extension is required for making HTTP requests within UnoPim.

- **php-fileinfo extension**: The **`fileinfo`** extension is used for file type detection, important for handling file uploads.

- **php-gd extension**: The **`php-gd`** extension must be properly installed to ensure correct image functionality in the project. If not installed correctly, image-related features may not work as expected.

  ::: tip Note
  It is important to ensure proper installation of the **`php-gd`** extension to avoid any issues with image manipulation in UnoPim.
  :::

- **php-intl extension**: This extension is required for internationalization support in UnoPim, enabling features like locale settings.

- **php-mbstring extension**: **`mbstring`** is required for handling multibyte string operations, which is important when working with non-ASCII characters.

- **php-openssl extension**: This extension enables secure communication using SSL/TLS protocols, required for encrypting data and secure file transfers.

- **php-pdo extension**: The **`PDO`** extension is necessary for database interactions, providing a consistent interface for working with different databases.

- **php-pdo_mysql extension**: Required when using a MySQL database. Enables PDO connections to MySQL in UnoPim.

- **php-pdo_pgsql extension**: Required when using a PostgreSQL database. Enables PDO connections to PostgreSQL in UnoPim.


- **php-tokenizer extension**: The **`tokenizer`** extension is needed for working with code parsing and analyzing tokens in the application.

- **php-zip extension**: This extension enables file compression and extraction features, allowing UnoPim to handle zip file imports and exports.

## How to Install PHP Extensions

### On Windows

1. **Locate the `php.ini` file**:
   - This file is typically located in your PHP installation directory (e.g., `C:\php\php.ini` or `C:\xampp\php\php.ini`).
2. **Enable the extensions**:
   - Open the `php.ini` file in a text editor and find the extensions listed below.
   - Uncomment the lines by removing the `;` at the beginning. If the extension is not listed, you'll need to download the corresponding `.dll` file.

   ```ini
   extension=curl
   extension=fileinfo
   extension=gd
   extension=intl
   extension=mbstring
   extension=openssl
   extension=pdo
   extension=pdo_mysql       ; Enable this if using MySQL
   extension=pdo_pgsql       ; Enable this if using PostgreSQL
   extension=tokenizer
   extension=zip
   ```

3. **Download missing `.dll` files** (if needed):
   - If any extension is missing, visit the [PECL repository](https://pecl.php.net/) or download the `.dll` files from the [PHP Windows downloads page](https://windows.php.net/download/).

4. **Restart your web server**:
   - After saving the `php.ini` file, restart Apache or NGINX to apply the changes.
### On Linux

1. **Install common PHP extensions via the package manager**:

   * Use the following commands based on your Linux distribution to install the required extensions.

   **For Ubuntu/Debian:**

   ```bash
   sudo apt update
   sudo apt install php-curl php-fileinfo php-gd php-intl php-mbstring php-openssl php-pdo php-tokenizer php-zip
   ```

   **For CentOS/RHEL:**

   ```bash
   sudo yum install php-curl php-fileinfo php-gd php-intl php-mbstring php-openssl php-pdo php-tokenizer php-zip
   ```

   **For Fedora:**

   ```bash
   sudo dnf install php-curl php-fileinfo php-gd php-intl php-mbstring php-openssl php-pdo php-tokenizer php-zip
   ```

2. **Install database-specific PHP extension**:

   * **For MySQL:**

     **Ubuntu/Debian:**

     ```bash
     sudo apt install php-pdo-mysql
     ```

     **CentOS/RHEL:**

     ```bash
     sudo yum install php-pdo_mysql
     ```

     **Fedora:**

     ```bash
     sudo dnf install php-pdo_mysql
     ```

   * **For PostgreSQL:**

     **Ubuntu/Debian:**

     ```bash
     sudo apt install php-pdo-pgsql
     ```

     **CentOS/RHEL:**

     ```bash
     sudo yum install php-pdo_pgsql
     ```

     **Fedora:**

     ```bash
     sudo dnf install php-pdo_pgsql
     ```

2. **Restart the web server**:
   - Once the extensions are installed, restart your Apache or NGINX server.

   ```bash
   sudo systemctl restart apache2  # For Ubuntu/Debian
   sudo systemctl restart httpd    # For CentOS/RHEL/Fedora
   sudo systemctl restart nginx    # If you're using NGINX
   ```

3. **Verify the extensions**:
   - You can verify the installed extensions by running:

   ```bash
   php -m
   ```

### On macOS

1. **Install PHP Extensions via Homebrew**:
   ```bash
   brew install php
   brew install php-curl
   brew install php-gd
   brew install php-intl
   brew install php-mbstring
   brew install php-openssl
   brew install php-pdo
   brew install php-zip
   ```

2. **Verify PHP Version and Extensions**:
   ```bash
   # Check PHP version
   php -v

   # List installed PHP extensions
   php -m
   ```

3. **Configure PHP Extensions**:
   - Locate your `php.ini` file:
   ```bash
   php --ini
   ```

   - Edit the `php.ini` file to enable extensions:
   ```ini
   extension=curl
   extension=fileinfo
   extension=gd
   extension=intl
   extension=mbstring
   extension=openssl
   extension=pdo
   extension=pdo_mysql       ; Enable this if using MySQL
   extension=pdo_pgsql       ; Enable this if using PostgreSQL
   extension=tokenizer
   extension=zip
   ```

4. **Restart PHP-FPM** (if using):
   ```bash
   brew services restart php
   ```


## PHP Configuration

Open your **`php.ini`** file and modify the following settings.

- **memory_limit**: Set the **`memory_limit`** directive to **`4G`** or higher to ensure sufficient memory allocation for the application.

- **max_execution_time**: Adjust the **`max_execution_time`** directive to **`360`** or higher. This value determines the maximum time (in seconds) a script is allowed to run. Increasing this value ensures that longer operations, such as import/export processes, can be completed successfully.

- **date.timezone**: Set the **`date.timezone`** directive to your specific timezone. For example, **`Asia/Kolkata`**. This ensures that date and time-related functions work accurately based on the specified timezone.

```ini
memory_limit = 4G
max_execution_time = 360
date.timezone = Asia/Kolkata <- Change this to your own timezone.
```

::: tip Remember to restart your web server
Whenever you make changes to the PHP configuration file, be sure to restart Apache or NGINX to apply the modifications.
:::

## Supported Database Servers

UnoPim supports the following database servers:

- **MySQL**: Version 8.0.32 or higher is recommended for optimal performance and compatibility.

- **MariaDB**: Version 10.3 or higher is recommended for optimal performance and compatibility.

- **PostgreSQL**: Version 14.x or higher is recommended for optimal performance and compatibility

- **Database Collation**: The recommended collation for the database is **`utf8mb4_unicode_ci`**, which ensures proper handling of Unicode characters and multilingual support.
