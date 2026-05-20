# Plugin Deployment

When deploying a custom UnoPim plugin or plugin, it's important to handle asset management properly. This ensures that assets like CSS, JavaScript, and images are available after deployment without needing to rebuild the assets on the production server.

In this section, we will cover how to structure and publish your assets during deployment so that they are accessible via the `public` directory.

---

### 1. **Directory Structure**

Your plugin should include a `publishable` directory to store assets that need to be copied to the `public` directory during deployment. The typical structure for this setup is as follows:

```
└── packages
    └── Webkul
        └── Example
            └── src
            └── publishable
                └── example
                    └── build
```

In this example:

- The `publishable` directory contains the `build` folder where your precompiled assets are stored (CSS, JS, fonts, images, etc.).
- These assets will be copied to the `public` directory when the plugin is deployed.

---

### 2. **Building Assets for Deployment**

Before deploying your plugin, ensure that the assets are properly built.

If you are using a bundler like Vite, you should run the build process locally:

```bash
npm run build
```

This command will generate the production-ready assets, which will be placed in the `publishable/example/build/` directory.

---

### 3. **Publishing Assets**

To ensure the built assets are available after deploying your plugin, you need to configure your service provider to publish the `build` directory contents to the `public` directory. This can be achieved using Laravel's `publishes()` method in your service provider (`ExampleServiceProvider`).

#### Step 1: **Update Service Provider**

In the `ExampleServiceProvider`, add the following `publishes()` method inside the `boot()` function:

```php
public function boot()
{
    $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'example');

    // Publish the assets from the 'publishable' directory to the 'public/themes' directory
    $this->publishes([
        __DIR__.'/../../publishable' => public_path('themes'),
    ], 'example');

    // Optionally, load the CSS for your custom menu using the 'unopim.admin.layout.head.before' event
    Event::listen('unopim.admin.layout.head.before', function($viewRenderEventManager) {
        $viewRenderEventManager->addTemplate('example::style');
    });
}
```

In this example:
- The `publishes()` method copies everything from your package’s `publishable` directory into the `public/themes` directory during the deployment process.
- This ensures that assets like CSS, JavaScript, fonts, or images are publicly accessible from the `public` directory.

---

### 4. **Deployment Without Rebuilding**

By following this process, you can avoid needing to build the assets again after deploying the plugin. The assets built locally (in `publishable/example/build`) are published directly to the `public` directory during the deployment phase.

After deployment, run the following command to publish the assets:

```bash
php artisan vendor:publish --tag=example
```

This command will copy the assets from `publishable` to the `public` directory, making them accessible via the browser.

---

### 5. **Verify Deployment**

After running the `vendor:publish` command, verify that the assets have been correctly copied to the `public/themes/example/build` directory. This will ensure the plugin's assets are served correctly in the admin panel without requiring additional builds on the production server.

---

### 6. **Final Optimization**

After publishing the assets, it's a good practice to clear any caches and optimize the application. You can do this by running:

```bash
php artisan optimize:clear
```

This command will clear compiled views, route caches, and configuration caches, ensuring that your application is ready to serve the latest version of your plugin.

---

By following these steps, you ensure that your custom UnoPim plugin's assets are deployed efficiently, reducing the need to build the assets on the production server. This approach is ideal for environments where you have limited control over asset building during deployment.