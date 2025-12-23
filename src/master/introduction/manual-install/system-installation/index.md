# System Installation

This section covers the **system-level setup required to run UnoPim**.

System installation prepares the server environment by installing and
configuring the operating system, PHP runtime, web server, database server,
and required PHP extensions.

::: info
All steps in this section must be completed **before installing UnoPim**.
:::

## Installation flow

System installation is divided into **two stages** and should be followed
in order.

### 1. Base Preparation

This step installs and configures the **core system dependencies** required
by UnoPim, including:

* PHP 8.2 and required PHP extensions
* PHP-FPM
* Common system utilities

This step must be completed **before** selecting a web server and database
configuration.

➡️ Continue with:
[**Base Preparation (Ubuntu)**](./ubuntu/preparation)


### 2. Web Server and Database Setup

After completing base preparation, choose **one** web server and database
combination.

These guides configure the web server, database server, and the
database-specific PHP extensions required to run UnoPim.

#### Available configurations

Choose **only one** configuration from the below.

**Ubuntu**

* **Apache + MySQL**: 
  [Configure Apache with MySQL](./ubuntu/apache-mysql)

* **Apache + PostgreSQL**: 
  [Configure Apache with PostgreSQL](./ubuntu/apache-postgresql)

:::tip INSTALLATION GUIDES
* System installation guides are currently provided for **Ubuntu**
* The available guides focus on **Apache-based setups**
* Additional web servers (such as **NGINX**) and operating systems will be
  added in future.
:::

## Next steps

Start with **base preparation** for your operating system:

* **Ubuntu**: 
  [Begin Base Preparation](./ubuntu/preparation)

After completing base preparation, continue with the appropriate
**web server and database setup** guide.

## Notes

* Complete all system installation steps before proceeding to install UnoPim
* Do not mix multiple web server or database configurations on the same system
* Application-level setup is handled in the **Install UnoPim** section
