# Packages



## Introduction

[Laravel](https://laravel.com) packages are the primary way of adding functionality, and the following features are distributed into packages to enhance the application and allow developers to follow the standard way of developing custom functionality.

UnoPim comes with a set of powerful default packages that provide essential functionalities out of the box. Below is a list of these default packages along with a brief description of each:

## Available Packages In UnoPim

### Admin

The **Admin** package in UnoPim is a core component that provides the administrative interface and functionality for managing various aspects of the platform. It offers a comprehensive dashboard and a set of tools for administrators to efficiently manage products, attributes, categories, and configurations. Here's a detailed overview of the Admin package in UnoPim:

#### Key Features of the Admin Package

- **Dashboard**
    - Provides a summary of key metrics related to product information and category management.
    - Displays widgets for quick insights into products, attributes, and data updates.

- **Product Management**
    - Allows administrators to add, edit, and delete product information.
    - Supports the management of product attributes, categories, and variants.

- **Configuration and Settings**
    - Provides a wide range of configuration options to customize the platform’s behavior.
    - Includes settings for managing localization, languages, and data formats.
    - Allows customization of email templates and system notifications.

### AdminApi

The **AdminApi** package in UnoPim provides API functionalities for managing administrative operations. It enables the integration of external systems with UnoPim to handle products, categories, and configurations via REST APIs.

#### Key Features of the AdminApi Package

- **Product Management**
    - API endpoints for creating, editing, and deleting product information.
    - Support for managing product attributes and categories programmatically.

- **Configuration and Settings**
    - API access to platform settings, including languages, locales, and customization options.

### Attribute

The **Attribute** package in UnoPim handles all logic related to product attributes and attribute sets. This package allows you to define and organize product information effectively and customize data to enhance search and filtering capabilities.

#### Key Features of the Attribute Package

- **Attribute Management**
    - Create, edit, and delete product attributes.
    - Define various attribute types, such as text, textarea, multiselect, date, and boolean.
    - Set validation rules for attributes to ensure data consistency.

- **Attribute Options**
    - Manage option values for attributes, including sorting and display order.

- **Attribute Family**
    - Configure attribute families to group related attributes for efficient product data management.

### Category

The **Category** package manages the database logic related to product categories. It allows you to define, organize, and manage product categories efficiently, facilitating better categorization and hierarchical structuring of product information.

#### Key Features of the Category Package

- **Category Management**
    - Create, edit, and delete categories.
    - Define parent-child relationships to establish a hierarchical category structure.
    - Set category attributes such as name, description, and URL keys.
    - Enable or disable categories as needed.

### Core

The **Core** package serves as the foundation for various functionalities and utilities essential for the operation of the UnoPim platform. It provides critical components, settings, configurations, and common helper functions used across other packages.

#### Key Features and Components

- **Settings and Configurations**
    - Manages platform-wide configurations such as site name, logo, and localization settings.
    - Handles environment-specific configurations for development, staging, and production environments.

- **Common Helper Functions**
    - Provides utilities for tasks such as data manipulation, file handling, and date/time formatting.
    - Includes validation functions for input data, ensuring data integrity.

### Datagrid

The **Datagrid** package provides a solution for displaying and managing tabular data within the admin panel. It enables efficient data handling and enhances the user experience with configurable columns, filters, and sorting options.

#### Key Features of the Datagrid Package

- **Dynamic Data Presentation**
    - Allows administrators to configure columns, filters, and sorting for displaying product data in tables.
    - Supports pagination settings to manage large datasets.

- **Advanced Filtering and Sorting**
    - Enables filtering based on various criteria for refining data views.
    - Supports sorting to organize data based on specified attributes.

### DataTransfer

The **DataTransfer** package manages data imports and exports, facilitating bulk operations such as importing large volumes of product information. For more details, see the [DataTransfer documentation](/0.1/packages/data-transfer).

### DebugBar

The **DebugBar** package includes essential tools for monitoring, analyzing, and debugging the UnoPim platform, ensuring optimal performance during development and troubleshooting.

### FPC

The **FPC (Full Page Cache)** package optimizes the platform’s performance by caching generated pages, reducing server load, and improving response times for administrators.

### HistoryControl

The **HistoryControl** package keeps track of changes made to product data and other critical information, allowing administrators to monitor revisions and revert to previous versions if necessary.

### Installer

The **Installer** package simplifies the installation process of the UnoPim platform, providing an easy setup for database configuration, dependency installation, and environment initialization.

### MagicAI

The **MagicAI** package integrates AI-based functionalities into UnoPim, offering tools to enhance efficiency and decision-making processes based on product data.

### Notification

The **Notification** package manages system notifications and alerts, enabling administrators to receive automated updates based on product data changes and other key events.

### Product

The **Product** package in UnoPim manages all essential product information, including attributes, variants, and categorization. It allows administrators to create, update, and organize product data efficiently, supporting advanced configurations and real-time updates.

### User

The **User** package handles user management, including roles, permissions, and profiles for administrators, ensuring secure access and personalized experiences within the platform.