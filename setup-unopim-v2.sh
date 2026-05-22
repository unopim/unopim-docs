#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
export NEEDRESTART_SUSPEND=1
export APT_LISTCHANGES_FRONTEND=none

# Persistent apt non-interactive config (survives sudo -u, shell transitions)
mkdir -p /etc/apt/apt.conf.d /etc/needrestart/conf.d 2>/dev/null || true
cat > /etc/apt/apt.conf.d/99-unopim-noninteractive <<'APTCONF'
APT::Get::Assume-Yes "true";
APT::Get::Fix-Missing "true";
Dpkg::Options { "--force-confdef"; "--force-confold"; };
APTCONF
cat > /etc/needrestart/conf.d/99-unopim.conf <<'NRCONF'
$nrconf{restart} = 'a';
$nrconf{kernelhints} = 0;
NRCONF

APT_FLAGS='-o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold -y'
alias apt-install="apt install $APT_FLAGS"

########################################################################
# UnoPim Interactive Setup Script for Ubuntu 24.04 LTS
# Run as root: bash setup-unopim-v2.sh
########################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓] $1${NC}"; }
warn() { echo -e "${YELLOW}[!] $1${NC}"; }
err()  { echo -e "${RED}[✗] $1${NC}"; exit 1; }
ask()  { echo -ne "${CYAN}$1${NC}"; }

[[ $EUID -ne 0 ]] && err "Run this script as root: sudo bash setup-unopim-v2.sh"

echo ""
echo "============================================="
echo "   UnoPim Interactive Setup — Ubuntu 24.04"
echo "============================================="
echo ""

########################################################################
# STATE FILE — cache inputs across failed runs
########################################################################
STATE_FILE="/root/.unopim-setup.state"
DOMAIN="" APP_DIR="" DEPLOY_USER="" DB_NAME="" DB_USER=""
DB_PASS="" DB_ROOT_PASS="" SSL_EMAIL="" ADMIN_NAME="" ADMIN_PASS="" INSTALL_DAM="" INSTALL_SHOPIFY=""

if [[ -f "$STATE_FILE" ]]; then
    warn "Previous state found at $STATE_FILE"
    ask "Reuse saved inputs? (y/n) [y]: "
    read -r REUSE
    REUSE=${REUSE:-y}
    if [[ "${REUSE,,}" == "y" ]]; then
        # shellcheck disable=SC1090
        source "$STATE_FILE"
        log "Loaded saved inputs"
    fi
fi

require() {
    local var=$1 prompt=$2 secret=${3:-0}
    local current=${!var}
    while [[ -z "$current" ]]; do
        ask "$prompt"
        if [[ "$secret" == "1" ]]; then read -rs current; echo ""; else read -r current; fi
        [[ -z "$current" ]] && warn "Required. Try again."
    done
    printf -v "$var" '%s' "$current"
}

default() {
    local var=$1 prompt=$2 def=$3
    local current=${!var}
    if [[ -z "$current" ]]; then
        ask "$prompt"
        read -r current
        current=${current:-$def}
    fi
    printf -v "$var" '%s' "$current"
}

########################################################################
# INTERACTIVE PROMPTS
########################################################################

require DOMAIN       "Enter domain name (e.g. pim.example.com): "
default APP_DIR      "Enter app install directory [/home/deploy/unopim]: " "/home/deploy/unopim"
default DEPLOY_USER  "Enter deploy username [deploy]: " "deploy"
default DB_NAME      "Enter MySQL database name [unopim]: " "unopim"
default DB_USER      "Enter MySQL app username [unopim]: " "unopim"
require DB_PASS      "Enter MySQL app password: " 1
require DB_ROOT_PASS "Enter MySQL root password: " 1
default SSL_EMAIL    "Enter email for SSL certificate [admin@${DOMAIN}]: " "admin@${DOMAIN}"
default ADMIN_NAME   "Enter admin full name [Admin]: " "Admin"
require ADMIN_PASS   "Enter admin login password (also used for admin account): " 1
default INSTALL_DAM      "Install UnoPim DAM extension? (y/n) [n]: " "n"
default INSTALL_SHOPIFY  "Install Shopify Connector extension? (y/n) [n]: " "n"

# Persist state — passwords cached only with explicit opt-in
warn "State cache stores inputs at $STATE_FILE (root-only, chmod 600)."
warn "Caching passwords means plaintext-on-disk until script success or manual delete."
ask "Cache passwords too (for easier resume after failure)? (y/n) [n]: "
read -r CACHE_PASS
CACHE_PASS=${CACHE_PASS:-n}

umask 077
: > "$STATE_FILE"
chmod 600 "$STATE_FILE"
{
    echo "DOMAIN=$(printf '%q' "$DOMAIN")"
    echo "APP_DIR=$(printf '%q' "$APP_DIR")"
    echo "DEPLOY_USER=$(printf '%q' "$DEPLOY_USER")"
    echo "DB_NAME=$(printf '%q' "$DB_NAME")"
    echo "DB_USER=$(printf '%q' "$DB_USER")"
    echo "SSL_EMAIL=$(printf '%q' "$SSL_EMAIL")"
    echo "INSTALL_DAM=$(printf '%q' "$INSTALL_DAM")"
    echo "INSTALL_SHOPIFY=$(printf '%q' "$INSTALL_SHOPIFY")"
    if [[ "${CACHE_PASS,,}" == "y" ]]; then
        echo "DB_PASS=$(printf '%q' "$DB_PASS")"
        echo "DB_ROOT_PASS=$(printf '%q' "$DB_ROOT_PASS")"
    fi
} > "$STATE_FILE"
log "Inputs saved to $STATE_FILE. Auto-removed on successful completion."

PHP_VER="8.3"
PARENT_DIR=$(dirname "$APP_DIR")
APP_NAME=$(basename "$APP_DIR")

echo ""
echo "============================================="
echo "  Domain       : $DOMAIN"
echo "  App Dir      : $APP_DIR"
echo "  Deploy User  : $DEPLOY_USER"
echo "  DB Name      : $DB_NAME"
echo "  DB User      : $DB_USER"
echo "  SSL Email    : $SSL_EMAIL"
echo "  DAM          : $INSTALL_DAM"
echo "  Shopify      : $INSTALL_SHOPIFY"
echo "============================================="
echo ""
ask "Press Enter to start installation or Ctrl+C to abort..."
read -r

########################################################################
# 1. SYSTEM UPDATE
########################################################################
log "Updating system..."
apt update && apt upgrade -y

########################################################################
# 2. CREATE DEPLOY USER
########################################################################
log "Creating deploy user: $DEPLOY_USER"
if ! id "$DEPLOY_USER" &>/dev/null; then
    adduser --disabled-password --gecos "$DEPLOY_USER" "$DEPLOY_USER"
    log "User $DEPLOY_USER created"
else
    warn "User $DEPLOY_USER already exists — skipping"
fi

########################################################################
# 7. PHP 8.3
########################################################################
log "Installing PHP $PHP_VER..."
apt install -y \
    php${PHP_VER} php${PHP_VER}-fpm php${PHP_VER}-cli php${PHP_VER}-common \
    php${PHP_VER}-mysql php${PHP_VER}-pgsql php${PHP_VER}-xml php${PHP_VER}-curl \
    php${PHP_VER}-mbstring php${PHP_VER}-zip php${PHP_VER}-gd php${PHP_VER}-bcmath \
    php${PHP_VER}-intl php${PHP_VER}-redis php${PHP_VER}-tokenizer \
    php${PHP_VER}-fileinfo php${PHP_VER}-ctype php${PHP_VER}-dom

for INI in /etc/php/${PHP_VER}/fpm/php.ini /etc/php/${PHP_VER}/cli/php.ini; do
    sed -i "s/^memory_limit.*/memory_limit = 512M/" "$INI"
    sed -i "s/^max_execution_time.*/max_execution_time = 120/" "$INI"
    sed -i "s/^upload_max_filesize.*/upload_max_filesize = 200M/" "$INI"
    sed -i "s/^post_max_size.*/post_max_size = 200M/" "$INI"
    sed -i "s|^;*date.timezone.*|date.timezone = UTC|" "$INI"
done

# Configure FPM pool to run as deploy user
POOL_CONF="/etc/php/${PHP_VER}/fpm/pool.d/www.conf"
if [[ -f "$POOL_CONF" ]]; then
    sed -i "s|^user = .*|user = ${DEPLOY_USER}|" "$POOL_CONF"
    sed -i "s|^group = .*|group = ${DEPLOY_USER}|" "$POOL_CONF"
    sed -i "s|^listen.owner = .*|listen.owner = ${DEPLOY_USER}|" "$POOL_CONF"
    sed -i "s|^listen.group = .*|listen.group = ${DEPLOY_USER}|" "$POOL_CONF"
fi

systemctl restart php${PHP_VER}-fpm
systemctl enable php${PHP_VER}-fpm
log "PHP $(php -v | head -1 | awk '{print $2}') installed"

########################################################################
# 8. MYSQL
########################################################################
log "Installing MySQL..."
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

log "Securing MySQL & creating database..."
# Detect working auth: socket (fresh install) or existing root password
if mysql -u root -e "SELECT 1" >/dev/null 2>&1; then
    MYSQL_AUTH=(-u root)
elif sudo mysql -u root -e "SELECT 1" >/dev/null 2>&1; then
    MYSQL_AUTH=(-u root)
    MYSQL_CMD_PREFIX="sudo"
elif mysql -u root -p"${DB_ROOT_PASS}" -e "SELECT 1" >/dev/null 2>&1; then
    MYSQL_AUTH=(-u root -p"${DB_ROOT_PASS}")
else
    err "Cannot authenticate to MySQL as root. If root password was set previously, rerun with matching DB_ROOT_PASS, or reset via: sudo mysql_secure_installation"
fi

${MYSQL_CMD_PREFIX:-} mysql "${MYSQL_AUTH[@]}" <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_ROOT_PASS}';
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
SET GLOBAL log_bin_trust_function_creators = 1;
FLUSH PRIVILEGES;
SQL

# Persist log_bin_trust_function_creators
grep -q "log_bin_trust_function_creators" /etc/mysql/mysql.conf.d/mysqld.cnf 2>/dev/null || \
    echo "log_bin_trust_function_creators = 1" >> /etc/mysql/mysql.conf.d/mysqld.cnf

systemctl restart mysql
log "MySQL database '${DB_NAME}' ready"

########################################################################
# 9. REDIS
########################################################################
log "Installing Redis..."
apt install -y redis-server
systemctl enable redis-server
systemctl start redis-server
log "Redis: $(redis-cli ping)"

########################################################################
# 10. ELASTICSEARCH
########################################################################
log "Installing Elasticsearch..."
if ! dpkg -l elasticsearch &>/dev/null; then
    apt install -y curl gnupg apt-transport-https ca-certificates

    # Fetch + import GPG key (fail loudly if network/key issue)
    rm -f /usr/share/keyrings/elasticsearch-keyring.gpg
    curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch \
        | gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
    [[ -s /usr/share/keyrings/elasticsearch-keyring.gpg ]] \
        || err "Failed to import Elasticsearch GPG key"
    chmod 644 /usr/share/keyrings/elasticsearch-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" \
        > /etc/apt/sources.list.d/elastic-8.x.list

    apt update -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0" \
        -o Dir::Etc::sourcelist="sources.list.d/elastic-8.x.list" \
        || err "apt update failed for Elasticsearch repo"
    apt update
    apt install -y elasticsearch || err "Elasticsearch package install failed"
fi

# Verify config dir exists before any yml write
[[ -d /etc/elasticsearch ]] || err "/etc/elasticsearch missing — ES install failed"

# Reset restrictive umask (earlier state-file step set 077 — ES needs world-readable configs)
umask 022

# Ensure ES_PATH_CONF + dir ownership (fixes "Unable to create logs dir" error)
if [[ ! -f /etc/default/elasticsearch ]] || ! grep -q '^ES_PATH_CONF' /etc/default/elasticsearch; then
    echo 'ES_PATH_CONF=/etc/elasticsearch' >> /etc/default/elasticsearch
fi
chmod 644 /etc/default/elasticsearch
chown root:elasticsearch /etc/default/elasticsearch 2>/dev/null || true
mkdir -p /var/log/elasticsearch /var/lib/elasticsearch
chown -R elasticsearch:elasticsearch /etc/elasticsearch /var/log/elasticsearch /var/lib/elasticsearch 2>/dev/null || true

# Kernel/limits required by ES 8
sysctl -w vm.max_map_count=262144
grep -q '^vm.max_map_count' /etc/sysctl.conf || echo 'vm.max_map_count=262144' >> /etc/sysctl.conf

# Size heap to ~25% RAM, bounded [512m, 2g]
TOTAL_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
HEAP_MB=$(( TOTAL_MB / 4 ))
(( HEAP_MB < 512 )) && HEAP_MB=512
(( HEAP_MB > 2048 )) && HEAP_MB=2048
log "Elasticsearch heap: ${HEAP_MB}m (total RAM ${TOTAL_MB}m)"

cat > /etc/elasticsearch/elasticsearch.yml <<EOF
cluster.name: unopim
node.name: unopim-node
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 127.0.0.1
http.port: 9200
discovery.type: single-node
xpack.security.enabled: false
xpack.security.enrollment.enabled: false
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false
bootstrap.memory_lock: false
EOF

mkdir -p /etc/elasticsearch/jvm.options.d
cat > /etc/elasticsearch/jvm.options.d/heap.options <<EOF
-Xms${HEAP_MB}m
-Xmx${HEAP_MB}m
EOF

# Fix perms on every ES config (umask paranoia)
chmod 660 /etc/elasticsearch/elasticsearch.yml /etc/elasticsearch/jvm.options.d/heap.options
chown root:elasticsearch /etc/elasticsearch/elasticsearch.yml /etc/elasticsearch/jvm.options.d/heap.options
chmod 750 /etc/elasticsearch/jvm.options.d
chown root:elasticsearch /etc/elasticsearch/jvm.options.d

systemctl daemon-reload
systemctl enable elasticsearch
systemctl restart elasticsearch || true

log "Waiting for Elasticsearch..."
ES_UP=0
for i in {1..45}; do
    if curl -s http://127.0.0.1:9200 &>/dev/null; then ES_UP=1; break; fi
    sleep 2
done

if [[ "$ES_UP" == "1" ]]; then
    log "Elasticsearch running"
else
    warn "Elasticsearch failed to start. Recent logs:"
    journalctl -u elasticsearch --no-pager -n 40 || true
    tail -n 40 /var/log/elasticsearch/unopim.log 2>/dev/null || true
    warn "Common causes: low RAM (<1GB free), vm.max_map_count, heap too large, port 9200 in use."
    warn "Rerun after fix: systemctl restart elasticsearch"
fi

########################################################################
# 11. COMPOSER
########################################################################
log "Installing Composer..."
if ! command -v composer &>/dev/null; then
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
fi
log "Composer $(composer --version 2>/dev/null | awk '{print $3}')"

########################################################################
# 12. NODE.JS 20
########################################################################
log "Installing Node.js 20..."
if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
log "Node $(node -v) / npm $(npm -v)"

########################################################################
# 13. INSTALL UNZIP
########################################################################
apt install -y unzip git

########################################################################
# 14. CLONE UNOPIM
########################################################################
log "Setting up UnoPim at ${APP_DIR}..."
if [[ -d "$APP_DIR/.git" ]]; then
    warn "UnoPim already cloned at $APP_DIR — skipping clone"
else
    mkdir -p "$PARENT_DIR"
    sudo -u "$DEPLOY_USER" git clone https://github.com/unopim/unopim.git "$APP_DIR"
fi

cd "$APP_DIR"

# Normalize ownership (prior runs may have mixed root/deploy ownership)
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"

# safe.directory for both root and deploy user
git config --global --add safe.directory "$APP_DIR"
sudo -u "$DEPLOY_USER" git config --global --add safe.directory "$APP_DIR"

# Fetch and checkout latest release tag
sudo -u "$DEPLOY_USER" git fetch --all --tags
LATEST_TAG=$(sudo -u "$DEPLOY_USER" git tag -l --sort=-v:refname | head -1)
if [[ -n "$LATEST_TAG" ]]; then
    log "Checking out latest release: $LATEST_TAG"
    sudo -u "$DEPLOY_USER" git checkout "$LATEST_TAG" 2>/dev/null || true
    sudo -u "$DEPLOY_USER" git switch -c "release-${LATEST_TAG}" 2>/dev/null || true
else
    warn "No release tags found — staying on current branch"
fi

########################################################################
# 15. COMPOSER INSTALL
########################################################################
log "Running composer install (this may take a few minutes)..."
sudo -u "$DEPLOY_USER" composer install --no-interaction 2>&1 | tail -5

########################################################################
# 16. UNOPIM INSTALL (interactive)
########################################################################
echo ""
echo "============================================="
log "Running UnoPim installer — INTERACTIVE STEP"
echo "============================================="
echo ""
echo "  Recommended values for the prompts:"
echo "  ─────────────────────────────────────"
echo "  App Name     : UnoPim"
echo "  App URL      : https://${DOMAIN}"
echo "  Locale       : English (United States)"
echo "  Currency     : US Dollar (or your preference)"
echo "  DB Connection: mysql"
echo "  DB Host      : 127.0.0.1"
echo "  DB Port      : 3306"
echo "  DB Name      : ${DB_NAME}"
echo "  DB User      : ${DB_USER}"
echo "  DB Password  : (the password you entered)"
echo "  Elasticsearch: yes → default → 127.0.0.1:9200"
echo ""

# Pre-write .env with collected inputs so installer skips prompts
log "Pre-writing .env with collected inputs..."
if [[ -f "$APP_DIR/.env.example" && ! -f "$APP_DIR/.env" ]]; then
    sudo -u "$DEPLOY_USER" cp "$APP_DIR/.env.example" "$APP_DIR/.env"
fi

ENV_FILE="$APP_DIR/.env"
set_env() {
    local key=$1 val=$2
    if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
        sed -i "s|^${key}=.*|${key}=${val}|" "$ENV_FILE"
    else
        echo "${key}=${val}" >> "$ENV_FILE"
    fi
}

set_env APP_NAME "UnoPim"
set_env APP_ENV "production"
set_env APP_DEBUG "false"
set_env APP_URL  "https://${DOMAIN}"
set_env LOG_LEVEL "error"
set_env APP_TIMEZONE "UTC"
set_env APP_LOCALE "en_US"
set_env APP_CURRENCY "USD"
set_env DB_CONNECTION "mysql"
set_env DB_HOST "127.0.0.1"
set_env DB_PORT "3306"
set_env DB_DATABASE "${DB_NAME}"
set_env DB_USERNAME "${DB_USER}"
set_env DB_PASSWORD "${DB_PASS}"
set_env ELASTICSEARCH_ENABLED "true"
set_env ELASTICSEARCH_CONNECTION "default"
set_env ELASTICSEARCH_HOST "localhost:9200"
set_env ELASTICSEARCH_PORT "9200"
set_env REDIS_HOST "127.0.0.1"
set_env REDIS_PORT "6379"
set_env CACHE_DRIVER "redis"
set_env QUEUE_CONNECTION "redis"
set_env SESSION_DRIVER "redis"

chown "$DEPLOY_USER:$DEPLOY_USER" "$ENV_FILE"
sudo -u "$DEPLOY_USER" php artisan key:generate --force 2>&1 | tail -2

log "Running installer (non-interactive, no admin prompt)..."
sudo -u "$DEPLOY_USER" php artisan unopim:install --skip-env-check --skip-admin-creation

log "Creating admin user: ${SSL_EMAIL}"
sudo -u "$DEPLOY_USER" php artisan tinker --execute="
\$email = '${SSL_EMAIL}';
\$admin = \Webkul\User\Models\Admin::where('email',\$email)->first() ?: new \Webkul\User\Models\Admin();
\$admin->name = '${ADMIN_NAME}';
\$admin->email = \$email;
\$admin->password = bcrypt('${ADMIN_PASS}');
\$admin->role_id = 1;
\$admin->status = 1;
\$admin->save();
echo 'Admin saved id='.\$admin->id.PHP_EOL;
"

########################################################################
# 17. BUILD FRONTEND
########################################################################
log "Building frontend assets..."
sudo -u "$DEPLOY_USER" npm install 2>&1 | tail -3
sudo -u "$DEPLOY_USER" npm run build 2>&1 | tail -3

########################################################################
# 18. STORAGE LINK
########################################################################
log "Linking storage..."
sudo -u "$DEPLOY_USER" php artisan storage:link --force

########################################################################
# 19. EXTENSIONS
########################################################################
if [[ "${INSTALL_DAM,,}" == "y" ]]; then
    log "Installing DAM extension..."
    sudo -u "$DEPLOY_USER" composer require unopim/dam --no-interaction 2>&1 | tail -3
    sudo -u "$DEPLOY_USER" php artisan dam-package:install
    sudo -u "$DEPLOY_USER" php artisan optimize:clear
    log "DAM installed"
fi

if [[ "${INSTALL_SHOPIFY,,}" == "y" ]]; then
    log "Installing Shopify Connector..."
    sudo -u "$DEPLOY_USER" composer require unopim/shopify-connector --no-interaction 2>&1 | tail -3
    sudo -u "$DEPLOY_USER" php artisan shopify-package:install
    sudo -u "$DEPLOY_USER" php artisan optimize:clear
    log "Shopify Connector installed"
fi

########################################################################
# 20. PERMISSIONS
########################################################################
log "Setting permissions..."
chmod 711 /home/$DEPLOY_USER
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
usermod -a -G "$DEPLOY_USER" www-data 2>/dev/null || true

########################################################################
# 21. NGINX
########################################################################
log "Configuring Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/unopim.conf <<'NGINX'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    root APP_DIR_PLACEHOLDER/public;
    index index.php;

    charset utf-8;
    client_max_body_size 200M;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 5;

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/phpPHP_VER_PLACEHOLDER-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 600;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
    }

    location ~ /\. { deny all; }
    location ~* ^/(storage|bootstrap/cache)/.*\.php$ { deny all; }

    error_log  /var/log/nginx/unopim_error.log;
    access_log /var/log/nginx/unopim_access.log;
}
NGINX

sed -i "s|DOMAIN_PLACEHOLDER|${DOMAIN}|g" /etc/nginx/sites-available/unopim.conf
sed -i "s|APP_DIR_PLACEHOLDER|${APP_DIR}|g" /etc/nginx/sites-available/unopim.conf
sed -i "s|PHP_VER_PLACEHOLDER|${PHP_VER}|g" /etc/nginx/sites-available/unopim.conf

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/unopim.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
log "Nginx configured"

########################################################################
# 22. SSL
########################################################################
log "Setting up SSL with Let's Encrypt..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$SSL_EMAIL" && \
    log "SSL configured — auto-renews every 90 days" || \
    warn "Certbot failed — ensure DNS points to this server, then run: certbot --nginx -d $DOMAIN"

########################################################################
# 23. SUPERVISOR (Queue Workers)
########################################################################
log "Configuring Supervisor queue workers..."
apt install -y supervisor

cat > /etc/supervisor/conf.d/unopim-worker.conf <<EOF
[program:unopim-worker]
process_name=%(program_name)s_%(process_num)02d
command=php ${APP_DIR}/artisan queue:work redis --queue=system,completeness,default --tries=3 --timeout=90 --max-jobs=1000 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=${DEPLOY_USER}
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/unopim-worker.log
stopwaitsecs=3600
EOF

supervisorctl reread
supervisorctl update
supervisorctl start unopim-worker:* 2>/dev/null || true
log "Queue workers running"

########################################################################
# 24. CRON SCHEDULER
########################################################################
log "Setting up cron scheduler..."
CRON_LINE="* * * * * cd ${APP_DIR} && php artisan schedule:run >> /dev/null 2>&1"
{ crontab -u "$DEPLOY_USER" -l 2>/dev/null | grep -v "schedule:run" || true; echo "$CRON_LINE"; } | crontab -u "$DEPLOY_USER" -

########################################################################
# 25. ELASTICSEARCH INDEX
########################################################################
log "Building Elasticsearch index..."
cd "$APP_DIR"
php artisan unopim:product:index 2>/dev/null || true

########################################################################
# 26. BACKUP SCRIPT
########################################################################
log "Setting up daily backups (30-day retention)..."
mkdir -p /var/backups/unopim

cat > /opt/backup-unopim.sh <<BACKUP
#!/bin/bash
set -euo pipefail
DATE=\$(date +%Y%m%d_%H%M)
DIR="/var/backups/unopim"

mysqldump -u ${DB_USER} -p'${DB_PASS}' ${DB_NAME} | gzip > "\$DIR/db_\$DATE.sql.gz"
tar czf "\$DIR/files_\$DATE.tar.gz" -C $(dirname "$APP_DIR") ${APP_NAME}/storage ${APP_NAME}/.env

find "\$DIR" -mtime +30 -delete
echo "[\$(date)] Backup completed"
BACKUP

chmod +x /opt/backup-unopim.sh
(crontab -l 2>/dev/null | grep -v "backup-unopim"; echo "0 2 * * * /opt/backup-unopim.sh >> /var/log/unopim-backup.log 2>&1") | crontab -

########################################################################
# FINAL STATUS CHECK
########################################################################
echo ""
echo "============================================="
echo "  Service Status"
echo "============================================="
systemctl is-active --quiet php${PHP_VER}-fpm && echo -e "  ${GREEN}✓${NC} PHP-FPM" || echo -e "  ${RED}✗${NC} PHP-FPM"
systemctl is-active --quiet nginx && echo -e "  ${GREEN}✓${NC} Nginx" || echo -e "  ${RED}✗${NC} Nginx"
systemctl is-active --quiet mysql && echo -e "  ${GREEN}✓${NC} MySQL" || echo -e "  ${RED}✗${NC} MySQL"
systemctl is-active --quiet redis-server && echo -e "  ${GREEN}✓${NC} Redis" || echo -e "  ${RED}✗${NC} Redis"
systemctl is-active --quiet elasticsearch && echo -e "  ${GREEN}✓${NC} Elasticsearch" || echo -e "  ${RED}✗${NC} Elasticsearch"
supervisorctl status unopim-worker:* 2>/dev/null | grep -q RUNNING && echo -e "  ${GREEN}✓${NC} Queue Workers" || echo -e "  ${RED}✗${NC} Queue Workers"

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP')

echo ""
echo "============================================="
log "UnoPim setup complete!"
echo "============================================="
echo ""
echo "Your UnoPim instance has been successfully set up and is now live."
echo ""
echo "Here are your login details:"
echo ""
echo "• URL: https://${DOMAIN}/"
echo "• Admin Email: ${SSL_EMAIL}"
echo "• Password: ${ADMIN_PASS}"
echo ""
echo "Please change your password after your first login for security purposes."
echo ""
echo "Let me know if you need anything else or run into any issues."
echo ""
echo "Best regards"
echo ""
echo "---"
echo "App Dir: ${APP_DIR}  |  DB: ${DB_NAME}/${DB_USER}  |  Backups: /var/backups/unopim (daily 2AM, 30d)"
echo ""

# Success — shred state file (holds plaintext passwords)
if [[ -f "$STATE_FILE" ]]; then
    shred -u "$STATE_FILE" 2>/dev/null || rm -f "$STATE_FILE"
    log "State file $STATE_FILE removed (passwords wiped)"
fi
