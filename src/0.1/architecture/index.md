# Architecture Overview

**UnoPim** is designed to be an intuitive and easy-to-understand platform. This document provides an overview of the architecture and how UnoPim works.

UnoPim is built on top of popular open-source technologies such as [PHP](https://php.net), [Laravel](https://laravel.com), [Vue.js](https://vuejs.org/), and [Tailwind CSS](https://tailwindcss.com/), making it a modern, scalable, and flexible PIM solution.

As **UnoPim** is tailored for Product Information Management (PIM) needs, it provides both front-end and back-end features that enable businesses to manage product data efficiently while allowing for comprehensive administrative control.

The architecture is highly modular, with Laravel packages separating each core functionality such as Categories, Products, and other essential features. This separation of concerns allows for easier customization and extension of the platform.

**UnoPim** integrates Vue.js for building dynamic user interfaces, leveraging built-in components to enhance user experience and responsiveness.

Additionally, **UnoPim** registers various events that can be triggered on most pages, allowing developers to hook into these events and perform custom operations within the application, ensuring flexibility and adaptability in diverse business use cases.
