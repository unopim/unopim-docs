# UnoPim API Documentation

Welcome to the UnoPim REST API docs. This page gives you the big picture of what the API can do before you dive into the individual endpoint pages.

## Overview

UnoPim is a Product Information Management (PIM) software that enables users to manage and centralize product data efficiently. The UnoPim API allows developers to interact with the platform using REST (Representational State Transfer) principles, supporting full Create, Read, Update, Patch, and Delete operations across the catalog. This API is designed for easy integration with external platforms, helping developers build Progressive Web Applications (PWA) or mobile applications for managing product data in the UnoPim system.

## Key Features

Here is what you get out of the box:

- **Operations**: Full CRUD (plus `PATCH` partial updates) on products, attributes, attribute groups, families, category fields, categories, locales, channels, currencies, media, measurements, and Digital Product Passports.
- **Delta Synchronization** <Badge type="tip" text="3.0" />: `created_at`/`updated_at` filters and `search_after` cursor pagination for incremental syncs at catalog scale.
- **Conditional Requests**: ETag / `If-None-Match` support returns `304 Not Modified` on unchanged responses.
- **Pagination Support**: Streamline data handling for larger datasets through pagination.
- **PIM Integration**: Facilitate seamless integration with eCommerce platforms, mobile apps, and other systems that rely on product information management.

## Coming from v2.x

New in 3.0 is covered in [What's New in v3.0](./whats-new-v3). If you maintain a client built against v2.x, [Migrating an API Client to v3.0](./migrating-your-client) covers what changed underneath it — permissions are now enforced on reads as well as writes, error responses share a single shape, rate limits are enforced, and `limit` is capped at 100.

## Explore the REST API Demo

Try out the UnoPim API through our interactive demo. This demo showcases the Create, Read, and Update operations and other API functionalities, providing developers with hands-on experience.

[Explore REST API Demo](https://www.postman.com/unopim/unopim-apis/documentation/kzy03uh/official-unopim-apis)
