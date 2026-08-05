# MCP Server

The **UnoPim MCP Bridge** lets AI assistants (Claude Code, GitHub Copilot, Cursor, Windsurf) interact with your UnoPim catalog, settings, and codebase through the [Model Context Protocol](https://modelcontextprotocol.io/). It turns your IDE's AI assistant into a first-class UnoPim client — it can search and upsert products, discover the catalog schema, scaffold plugins, run safe Artisan/Composer commands, and execute custom skills, all without leaving the editor.

The bridge exposes two transports in one package. The **HTTP Agent** serves `POST /api/mcp/unopim` over SSE and is best for remote AI assistants and PIM workflows, while the **stdio Agent** starts with `php artisan mcp:start unopim-dev` and is best for coding agents such as Copilot, Cursor, and Claude Code.

---

## Requirements

Before installing, make sure your environment runs PHP 8.2+, UnoPim 1.0+, and Laravel 11.0+.

---

## Installation

Install the package via Composer into your UnoPim root, then run the installer:

```bash
composer require unopim/mcp
php artisan mcp:install
```

`mcp:install` runs Passport scaffolding (if installed), publishes `config/mcp.php` via the `mcp-config` tag, and clears caches.

Ensure `APP_URL` is set in your `.env`. If you plan to use the HTTP (SSE) transport for remote access, generate an API token for your user.

### The 10-Second Test

Verify everything works by launching the inspector — a web UI where you can test each tool manually:

```bash
php artisan mcp:inspector unopim-dev
```

---

## Connecting AI Editors

Register the MCP server in your editor's config. Both transports are supported.

### VS Code / GitHub Copilot — `.vscode/mcp.json`

```jsonc
{
    "servers": {
        "unopim-dev": {
            "command": "php",
            "args": ["artisan", "mcp:start", "unopim-dev"],
            "cwd": "/path/to/your/unopim"
        },
        "unopim-http": {
            "url": "http://127.0.0.1:8000/api/mcp/unopim",
            "type": "http"
        }
    }
}
```

### Claude Code

```bash
claude mcp add unopim-dev -- php artisan mcp:start unopim-dev
```

### Cursor — `Preferences > Models > MCP`

Add a new MCP server: **Type** `command`, **Command** `php artisan mcp:start unopim-dev`.

### Windsurf — `~/.windsurf/mcp.json`

```jsonc
{
    "servers": {
        "unopim-dev": {
            "command": "php",
            "args": ["artisan", "mcp:start", "unopim-dev"],
            "cwd": "/path/to/your/unopim"
        }
    }
}
```

---

## Available Tools

The bridge registers its tools in four groups — catalog, settings, data transfer, and developer tools — so you can quickly find the one that matches the task at hand.

### Catalog Tools

Reach for these 13 tools whenever you are reading or writing catalog data — products, categories, attributes, families, and groups. Each entity gets a paired `search_*` and `upsert_*` tool, and `get_catalog_schema` tells your assistant what it can filter on before it starts.

| Tool | Description |
|------|-------------|
| `get_catalog_schema` | Returns filterable fields, operators, and pagination info per entity. |
| `search_products` | Cursor-paginated product search with filters (max 100 per page). |
| `get_product` | Fetch full product details by ID or SKU with relationships and completeness. |
| `upsert_products` | Batch create/update products (max 50 per call, atomic transaction). |
| `search_categories` | Cursor-paginated category search with filters. |
| `upsert_categories` | Batch create/update categories (max 50 per call, atomic). |
| `search_attributes` | Cursor-paginated attribute search with filters. |
| `upsert_attributes` | Batch create/update attributes (max 50 per call, atomic). |
| `search_attribute_options` | Cursor-paginated search across attribute options. |
| `search_families` | Search attribute families. |
| `upsert_families` | Batch create/update attribute families. |
| `search_attribute_groups` | Search attribute groups. |
| `upsert_attribute_groups` | Batch create/update attribute groups. |

### Settings Tools

Use these 4 tools when you need to inspect or change instance-level configuration such as channels, locales, and currencies.

| Tool | Description |
|------|-------------|
| `search_settings` | Search channels or locales (pass `type`: `channels` or `locales`). |
| `upsert_settings` | Create/update channels or locales (max 50 per call). |
| `search_currencies` | Search currencies with filters. |
| `upsert_currencies` | Batch create/update currencies (max 50 per call). |

### Data Transfer Tools

These 2 tools let your assistant monitor the import/export pipeline — useful for checking whether a job ran and what it produced.

| Tool | Description |
|------|-------------|
| `search_jobs` | Search import/export job instances by `code`, `type`, `entity_type`, `action`. |
| `get_job_execution` | Fetch a single job execution (JobTrack) by ID with status, counts, and errors. |

### Developer Tools

When you are building on top of UnoPim rather than managing its data, these 6 core tools (plus dynamically registered skills) handle file operations, safe command execution, and app introspection.

| Tool | Description |
|------|-------------|
| `dev_tools` | Unified action tool: `create_file`, `read_file`, `update_file`, `run_command`, `generate_plugin`, `generate_test`. |
| `run_skill` | Execute a predefined skill from `.ai/skills/` by name. |
| `get_app_info` | Inspect the host app — Laravel/PHP versions, environment, installed packages. |
| `get_database_schema` | Introspect tables, columns, and relationships. Pass a `table` to scope. |
| `run_database_query` | Execute a read-only SQL query against the configured connection. |
| `read_logs` | Tail entries from `storage/logs/laravel.log` (and named channels). |
| Dynamic Skills | Each `SKILL.md` under `mcp.skills_path` is auto-registered as `execute_<skill_name>`. |

### Resources and Prompts

Alongside the tools, the bridge publishes one MCP resource and one prompt: the `catalog-schema` resource gives your assistant a high-level catalog summary (product, category, and attribute counts), and the `analyze-catalog` prompt walks it through a guided catalog analysis covering completeness, consistency, and optimization.

---

## Artisan Commands

The package also ships a set of Artisan commands for installing, scaffolding, and running the bridge from your terminal.

| Command | Description |
|---------|-------------|
| `php artisan mcp:install` | Passport scaffolding, publish `config/mcp.php`, clear caches. |
| `php artisan mcp:make plugin <Name> [--type=connector\|core-extension\|generic]` | Scaffold a complete UnoPim plugin. |
| `php artisan mcp:make test <Package> <Class>` | Generate a Pest test skeleton for a class. |
| `php artisan mcp:dev` | Alias for `mcp:start unopim-dev` — starts the stdio server. |
| `php artisan mcp:start <handle>` | Start an MCP server over stdio. |
| `php artisan mcp:inspector <server>` | Launch the MCP Inspector against a stdio handle or HTTP path. |

---

## Query Operators

Every search tool accepts the same filter syntax, so once you learn these operators you can query any entity.

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equals | `{"field": "status", "operator": "=", "value": "active"}` |
| `!=` | Not equals | `{"field": "type", "operator": "!=", "value": "bundle"}` |
| `IN` | In list | `{"field": "type", "operator": "IN", "value": ["simple", "configurable"]}` |
| `NOT IN` | Not in list | `{"field": "id", "operator": "NOT IN", "value": [1, 2]}` |
| `CONTAINS` | Like `%value%` | `{"field": "name", "operator": "CONTAINS", "value": "shirt"}` |
| `STARTS WITH` | Like `value%` | `{"field": "sku", "operator": "STARTS WITH", "value": "PRD"}` |
| `ENDS WITH` | Like `%value` | `{"field": "sku", "operator": "ENDS WITH", "value": "001"}` |
| `>` | Greater than | `{"field": "price", "operator": ">", "value": 100}` |
| `<` | Less than | `{"field": "stock", "operator": "<", "value": 5}` |

---

## Configuration

`mcp:install` publishes `config/mcp.php`. Key settings:

```php
return [
    // Require a Bearer token (Passport `auth:api`) for HTTP MCP endpoints.
    'api_auth' => env('MCP_API_AUTH', true),

    // Max requests per minute per tool per caller (IP for HTTP, "cli" for stdio).
    'rate_limit' => env('MCP_RATE_LIMIT', 60),

    // FileManager / dev-tool jail. Anything outside is rejected.
    'allowed_paths' => [
        base_path(),
        sys_get_temp_dir(),
    ],

    // Log every destructive tool call (upserts, dev_tools mutations).
    'audit_logging' => env('MCP_AUDIT_LOGGING', true),

    // Where SkillLoader looks for SKILL.md files.
    'skills_path' => env('MCP_SKILLS_PATH', base_path('.ai/skills')),

    // Skill registry caching.
    'enable_cache' => env('MCP_ENABLE_CACHE', true),
    'cache_key'    => 'mcp.skills',
    'cache_ttl'    => env('MCP_CACHE_TTL', 3600),
];
```

---

## Dynamic Skills

Drop a `SKILL.md` with YAML frontmatter into `.ai/skills/<skill-name>/SKILL.md` and it is automatically discovered, cached, and registered as an MCP tool named `execute_<skill_name>` — **no code required**.

```markdown
---
name: My Custom Skill
description: Automates a specific workflow
license: MIT
parameters:
  query:
    type: string
    required: true
metadata:
  author: your-name
---

# Instructions

Describe what this skill does and how to use it.
```

This is the same `SKILL.md` format used by the [Agentic Skills](./agent-skills.html) — so a skill authored for your coding agent can double as an executable MCP tool.

---

## Security

The bridge is production-hardened with multiple layers:

1. **Request Authentication** — HTTP SSE endpoints default to `auth:api` (OAuth2 via Laravel Passport).
2. **Rate Limiting** — configurable per-minute limit per tool per client (default 60 req/min).
3. **Path Traversal Guard** — all file operations are jailed within configured `allowed_paths` with `.`/`..` normalization.
4. **Command Whitelisting** — only `php artisan` and `composer` base commands are allowed; shell operators (`;`, `&`, `|`, `` ` ``, `$()`, `<`, `>`) are blocked.
5. **ACL Mapping** — every MCP tool maps to internal UnoPim permissions via `bouncer()`. CLI bypasses ACL for local development.
6. **Audit Logging** — all destructive operations (upsert, create, update) are logged with user ID, IP, tool name, and arguments.

---

## Development Workflow

The MCP bridge collapses the IDE → Terminal → Database → Admin UI loop into a single chat. A typical "AI-first" cycle:

1. **Discovery** — call `get_catalog_schema` first so the assistant knows your custom attributes and filterable fields.
2. **Scaffolding** — `dev_tools` → `generate_plugin` creates the directory structure, `composer.json`, ServiceProvider, and base classes.
3. **Execution** — `run_command` runs `php artisan migrate`, `db:seed`, etc. securely (base commands only).
4. **Verification** — `read_file` or `search_products` confirms the change landed.

::: tip
Pair the MCP Server with the [Agentic Skills](./agent-skills.html): the skills teach your agent UnoPim's conventions, and the MCP Server gives it the live instance to act on.
:::
