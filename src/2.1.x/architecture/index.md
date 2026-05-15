# Architecture Overview

**UnoPim** is designed to be an intuitive and easy-to-understand platform. This document provides an overview of the architecture and how UnoPim works.

UnoPim v2.0.0 is built on top of popular open-source technologies such as [PHP 8.3+](https://php.net), [Laravel 12](https://laravel.com), [Vue.js 3](https://vuejs.org/), and [Tailwind CSS 3](https://tailwindcss.com/), making it a modern, scalable, and flexible PIM solution. The platform also integrates AI capabilities through the **MagicAI** and **AiAgent** packages, enabling intelligent content generation, product enrichment, and conversational PIM management powered by 10+ AI providers.

As **UnoPim** is tailored for Product Information Management (PIM) needs, it provides both front-end and back-end features that enable businesses to manage product data efficiently while allowing for comprehensive administrative control.

The architecture is highly modular, with Laravel packages separating each core functionality such as Categories, Products, AI-powered enrichment, and other essential features. This separation of concerns allows for easier customization and extension of the platform. UnoPim v2.0.0 introduces the **AiAgent** package, which provides a conversational AI interface with 32+ PIM-specific tools, and enhances the **MagicAI** package with multi-platform AI provider support and database-backed credential management.

**UnoPim** integrates Vue.js for building dynamic user interfaces, leveraging built-in components to enhance user experience and responsiveness.

Additionally, **UnoPim** registers various events that can be triggered on most pages, allowing developers to hook into these events and perform custom operations within the application, ensuring flexibility and adaptability in diverse business use cases.
