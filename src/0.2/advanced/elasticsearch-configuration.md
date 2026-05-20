
# Elasticsearch Configuration



## Introduction

Elasticsearch is a distributed search and analytics engine designed for scalability and real-time data processing. This guide provides the necessary steps to configure and use Elasticsearch in the Unopim project.

---

## Configuration Steps

  1. **Environment Variables**

Add the following settings to your `.env` file:
```env
ELASTICSEARCH_ENABLED=true
ELASTICSEARCH_CONNECTION=default
ELASTICSEARCH_HOST=localhost:9200
ELASTICSEARCH_USER=
ELASTICSEARCH_PASS=
ELASTICSEARCH_API_KEY=
ELASTICSEARCH_CLOUD_ID=
ELASTICSEARCH_INDEX_PREFIX=unopim_testing
```

### Environment Variables

- `ELASTICSEARCH_ENABLED`: Enables or disables the Elasticsearch functionality
  - Values: `true`/`false`
  - Default: `false`
  - Purpose: Controls whether ElasticSearch functionality is active

- `ELASTICSEARCH_CONNECTION`: Determines the connection type
  - Values: `default`, `cloud`, `api`
  - Default: `default`
  - Purpose: Specifies which connection configuration to use

- `ELASTICSEARCH_HOST`: ElasticSearch server location
  - Format: `hostname:port`
  - Default: `localhost:9200`
  - Example: `localhost:9200` or `elastic.example.com:9200`

- `ELASTICSEARCH_USER` & `ELASTICSEARCH_PASS`: Basic authentication credentials
  - Optional: Required only when using username/password authentication
  - Example:
    ```
    ELASTICSEARCH_USER=elastic
    ELASTICSEARCH_PASS=your_secure_password
    ```

- `ELASTICSEARCH_API_KEY`: API key-based authentication
  - Optional: Alternative to username/password authentication
  - Format: Base64 encoded string
  - Example: `VnVhQ2ZHY0JDZGJrUW0tZTVhT3g6dWkybHAyYXhUTm1iX0ZmZHM3T0diUQ==`

- `ELASTICSEARCH_CLOUD_ID`: Elastic Cloud deployment identifier
  - Optional: Required only for Elastic Cloud deployments
  - Format: `deployment:base64_data`
  - Example: `deployment:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbzo0NDM=`

- `ELASTICSEARCH_INDEX_PREFIX`: Index naming prefix
  - Purpose: Separates indices across different environments
  - Examples:
    - Development: `unopim_dev_`
    - Production: `unopim_prod_`
    - Testing: `unopim_testing`

 2. **Cache Configuration**

After updating the environment variables, run the following command to cache the configuration:

```bash
php artisan config:cache
```

---

### **Indexing Commands**

  -  Clear Indexes

This command clears all existing Elasticsearch indexes for the Unopim project.
 **Warning:** This will delete all indexed data. Use with caution.

```bash
php artisan unopim:elastic:clear
```

 - Index Products

This command indexes all products in the database.
Use it to create or update the product index in Elasticsearch:

```bash
php artisan unopim:product:index
```

 - Index Categories

This command indexes all categories in the database.
Use it to create or update the category index in Elasticsearch:

```bash
php artisan unopim:category:index
```

---