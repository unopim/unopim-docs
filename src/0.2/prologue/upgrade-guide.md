# Upgrade Guide



## Overview
This guide will help you upgrade your Unopim installation to version 0.2.1. Please follow these instructions carefully to ensure a smooth upgrade process.

## Pre-upgrade Checklist
-  Backup your entire project
-  Backup your database
-  Stop all running processes (queue workers, etc.)

## Upgrade Steps

### 1. Backup Your System
Before proceeding, create a complete backup of your system:

```bash
# Backup database
mysqldump -u your_db_user -p your_db_name > unopim_backup.sql
```

### 2. Download New Version
Download Unopim v0.2.1 from one of these sources:
- [GitHub Release v0.2.1](https://github.com/unopim/unopim/archive/refs/tags/v0.2.1.zip)
- [Official Website](https://unopim.com/download)

### 3. Update Project Files

Update your project files with the new version. You can do this by extracting the downloaded zip file and copying over the necessary files.

```bash
# Extract the new version to your desired location
unzip unopim-0.2.1.zip
```

**Copy your existing configuration and data:**

Copy the `.env` file and storage folder from your current UnoPim installation to the new `unopim-0.2.1` folder:

```bash
# Copy your environment file from current installation
cp /path/to/current/unopim/.env unopim-0.2.1/

# Copy storage directory from current installation
cp -r /path/to/current/unopim/storage/* unopim-0.2.1/storage/
```

**Navigate to the new directory:**

Open terminal at the path of the new `unopim-0.2.1` directory (e.g., `unopim-0.2.1`) and run the commands in the following steps.

**Note:** The upgrade will be completed in this new `unopim-0.2.1` folder. After successful upgrade and testing, you can either:
- Rename the new folder to replace your current installation
- Move the upgraded installation to your required path
- Update your web server configuration to point to the new directory

### 4. Install Dependencies
Make sure you have Composer installed. Navigate to the new Unopim directory and run:
```bash
cd unopim-0.2.1
composer install
```

### 5. Database Updates
If there are any new migrations or database changes, run the following command to update your database schema:
```bash
php artisan migrate
```

### 6. Clear Cache and Optimize
Clear any cached configurations and optimize your application:
```bash
php artisan optimize:clear
php artisan storage:link
```

### 7. Restart Services
If you are using a process manager like Supervisor , restart the services to apply the changes.
```bash
# If using Supervisor
sudo supervisorctl restart unopim-worker
```

## Post-upgrade Steps
1. Test all core functionalities
2. Verify file permissions
3. Check error logs for any issues

## New Changes
We are excited to announce the latest updates in Unopim! These changes have been implemented in the master branch, which serves as the development branch for new features and breaking changes. These updates will be included in the upcoming stable release.

For a detailed list of changes, please visit the [Unopim CHANGELOG.md on GitHub](https://github.com/unopim/unopim/blob/master/Changelog.md).


## Need Help?

- Contact support at [support@webkul.in](mailto:support@webkul.in).