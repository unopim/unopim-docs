## Technical Codebase

If you are looking to extend the functionalities of the UnoPim platform, creating a package is the way to go. A package is a self-contained module that adds specific features to the platform. It allows developers to introduce custom functionality without altering the core codebase of UnoPim.

This guide will walk you through the process of developing a package for UnoPim.

In UnoPim, various packages are located at **`packages/Webkul/`**. Below is a basic tree structure of a package:


~~~directory-structure
└── Webkul
    └── Example
        └── src
            ├── Config
            │   ├── acl.php
            │   └── menu.php
            ├── Console
            │   └── Commands
            ├── Contracts
            │   └── Example.php
            ├── Database
            │   ├── Migrations
            │   │   └── 2024_10_10_122434_create_examples_table.php
            │   └── Seeders
            ├── Events
            ├── Helpers
            │   ├── Exporters
            |   |   └── Product
            │   │       └── Exporter.php
            │   └── Importers
            |       └── Product
            |           └── Importer.php
            ├── Http
            │   ├── Controllers
            │   │   └── ExampleController.php
            │   ├── Middleware
            │   └── Requests
            ├── Listeners
            ├── Models
            │   ├── Example.php
            │   └── ExampleProxy.php
            ├── Providers
            │   ├── ExampleServiceProvider.php
            │   └── ModuleServiceProvider.php
            ├── Routes
            │   └── routes.php
            ├── Repositories
            │   └── ExampleRepository.php
            └── Resources
                ├── assets
                │   ├── images
                │   │   └── example-icon.png
                │   ├── js
                │   │   └── app.js
                │   └── css
                │       └── app.css
                ├── lang
                │   └── app.php
                └── views
                    └── example
                        ├── create.blade.php
                        ├── edit.blade.php
                        └── index.blade.php

~~~