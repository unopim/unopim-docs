# Install UnoPim via GUI Installer

This guide explains how to install **UnoPim** using the web-based GUI installer.
This method is part of the manual installation flow and is suitable for users
who prefer a browser-driven setup experience.


:::warning Prerequisites
Before continuing, ensure you have completed:

- [**System Requirements**](./requirements)
- [**System Installation**](./system-installation)

This includes PHP 8.2, PHP-FPM, a supported web server, a supported database,
and all required PHP extensions.
:::

## Step 1 - Download UnoPim

Download the UnoPim source code from the UnoPim website.

Visit the [UnoPim download](https://unopim.com/download) page and click the **Download** button.

## Step 2 - Place UnoPim in the Web Server Directory

UnoPim **must be placed inside the directory that is publicly accessible by
your web server**.

The installation directory must match the path configured as the
`DocumentRoot` in your Apache virtual host.

### Example

If your virtual host is configured like this:

```apache
DocumentRoot /home/unopim/unopim/public
```

Then the extracted UnoPim files must be placed at:

```text
/home/unopim/unopim
```
The web server is configured to serve the public directory of the above path, so Unopim must be placed here.

## Step 3 - Launch the GUI Installer

Open your browser and navigate to the domain or IP address configured in
your virtual host.

### Example

```text
http://your-domain-or-ip
```

This will launch the UnoPim GUI installer. Follow the on-screen instructions
to complete the installation.
