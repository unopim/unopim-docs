# Install UnoPim using Docker

This guide explains how to run UnoPim in Docker using two methods: a fast setup with the official prebuilt image, and a more flexible setup with Docker Compose for customization

## Prerequisites
You must have Docker installed on the host. If you plan to use Docker Compose, install Docker Compose as well.

Download and install Docker from the official site: [Docker](https://docs.docker.com/get-started/get-docker/)


## Method 1 — Using the prebuilt UnoPim image (quick setup)

1. Pull the UnoPim image:

```bash
docker pull webkul/unopim:v1.0.0
```

2. Run the container (example):

```bash
docker run -d --name unopim_container -p 80:80 webkul/unopim:v1.0.0
```

If port 80 is already used, map a different host port (for example `8082:80`):

```bash
docker run -d --name unopim_container -p 8082:80 webkul/unopim:v1.0.0
```

3. Open the app in your browser:

```
http://localhost
# or if you used port 8082:
http://localhost:8082
```

4. Default admin credentials (for recent UnoPim releases):

* Username: `admin@example.com`
* Password: `admin123`

::: tip
If you need a persistent database or custom configuration, prefer Method 2 (Docker Compose).
:::


## Method 2 — Using Docker Compose

This method gives you control over service names, ports, and volumes.

1. Clone the UnoPim repository (or download the project files):

```bash
git clone https://github.com/unopim/unopim.git
cd unopim
```

2. Create a `.env` file from the example and update DB settings to match the docker compose file:

```bash
cp .env.example .env
# edit .env and set DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

```env
DB_CONNECTION=mysql
DB_HOST=unopim-mysql
DB_PORT=3306
DB_DATABASE=unopim
DB_USERNAME=root
DB_PASSWORD=password
```

3. Then start services:

```bash
docker-compose up -d
```

4. Verify services are running:

```bash
docker ps
```

5. Open the UnoPim app in your browser:

```
http://localhost:8000
```

Adjust the port if your Compose file maps a different host port.


## Managing containers

* Stop containers:

```bash
docker-compose stp[]
```

* Restart containers:

```bash
docker-compose up -d
```

* Rebuild (after changes to images or Dockerfile):

```bash
docker-compose up --build -d
```


## Notes and tips

* If MySQL is already running on the host, change MySQL container port and update `.env` accordingly.
* For production, add persistent volumes for MySQL data and review network and security settings.
* If you need Docker or Compose installation instructions, see Docker’s docs: [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
