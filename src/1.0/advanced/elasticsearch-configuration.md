
# Elasticsearch Configuration



## Introduction
Elasticsearch is a distributed search and analytics engine designed for scalability and real-time data processing.
This guide provides the necessary steps to **install**, **configure**, and **use Elasticsearch** in the UnoPim project.

---

##  Installing Elasticsearch on Ubuntu Server

Follow the steps below to install Elasticsearch (v8.x) on Ubuntu 22.04 or 24.04:

🔎 **Note:**
Before proceeding, check if Elasticsearch is already installed:

```bash
dpkg -l | grep elasticsearch
# or
elasticsearch --version
```

* If a version is displayed → **Elasticsearch is already installed, skip installation.**
* If no output → **continue with installation.**


### Step 1: Install Required Dependencies

```bash
sudo apt-get update
sudo apt-get install apt-transport-https curl gnupg -y
```

### Step 2: Add Elasticsearch GPG Key

```bash
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
```

### Step 3: Add Elasticsearch Repository

```bash
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
```

### Step 4: Install Elasticsearch

```bash
sudo apt-get update
sudo apt-get install elasticsearch -y
```

### Step 5: Enable and Start Elasticsearch

```bash
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch.service
sudo systemctl start elasticsearch.service
sudo systemctl status elasticsearch.service
```

### Step 6: Verify Installation

```bash
curl 'http://localhost:9200'
```

You should see a JSON response with cluster information.

### Step 7: Optimize Linux Kernel Settings

Elasticsearch requires a higher `vm.max_map_count` value. Run:

```bash
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee /etc/sysctl.d/elasticsearch.conf
sudo systemctl restart elasticsearch
```

---

##  Configuring UnoPim to Use Elasticsearch

### Environment Variables

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

#### Explanation of Variables

* **ELASTICSEARCH\_ENABLED**: Enables or disables Elasticsearch (`true` / `false`)
* **ELASTICSEARCH\_CONNECTION**: Type of connection (`default`, `cloud`, or `api`)
* **ELASTICSEARCH\_HOST**: Server location (`localhost:9200` or `elastic.example.com:9200`)
* **ELASTICSEARCH\_USER / ELASTICSEARCH\_PASS**: Basic auth credentials (optional)
* **ELASTICSEARCH\_API\_KEY**: Base64-encoded API key (optional)
* **ELASTICSEARCH\_CLOUD\_ID**: Required only for Elastic Cloud deployments
* **ELASTICSEARCH\_INDEX\_PREFIX**: Prefix for indices (e.g., `unopim_dev_`, `unopim_prod_`)

---

### Cache Configuration

After updating `.env`, run:

```bash
php artisan config:cache
```

---

##  Indexing Commands

* **Clear Indexes**

```bash
php artisan unopim:elastic:clear
```

⚠️ Remove all indexed data and indexes for categories and products.

* **Index Products**

```bash
php artisan unopim:product:index
```

* **Index Categories**

```bash
php artisan unopim:category:index
```

---