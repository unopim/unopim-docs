# UnoPim 3.1 Release Notes

## UnoPim v3.1.0

Released August 27, 2026. See the [GitHub release](https://github.com/unopim/unopim/releases/tag/v3.1.0) for the complete changelog.

### MariaDB support

[Commit c369e23](https://github.com/unopim/unopim/commit/c369e23de1e6047552c2de5e57e859ce07d25b58) adds first-class MariaDB support across installation, upgrades, migrations, audit logs, and REST APIs. Configure Laravel with `DB_CONNECTION=mariadb`; the PHP extension remains `pdo_mysql`.

MariaDB can serve as the primary application datastore. MySQL and PostgreSQL remain supported; the Composer and Docker defaults are MySQL and PostgreSQL respectively. See the [current database requirements](../introduction/requirements#supported-database-servers) and [MariaDB installation guide](../introduction/installation-with-mariadb).

The release commit records validation against MariaDB 11.8.6. Ongoing MariaDB CI coverage is a subsequent change and must not be presented as part of the original 3.1.0 release.

### Other changes

- REST APIs for association types, variant structures, and variant groups.
- Improvements to Elasticsearch indexing, catalog performance, and dashboard statistics.
- Authenticated media downloads and fixes to Docker queue/scheduler permissions and OAuth key persistence.
- Reliability improvements to imports, exports, variants, webhooks, and REST APIs.

Follow the [minor-update guide](/3.1/prologue/patch-update) when upgrading an existing installation.
