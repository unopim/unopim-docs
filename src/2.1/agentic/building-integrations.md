# Building an Integration with AI

This is the end-to-end walkthrough for developing a real UnoPim integration — a third-party connector — using AI assistance at every step. It ties together the [Agentic Skills](./agent-skills.html) (which teach your coding agent UnoPim's conventions) and the [MCP Server](./mcp-server.html) (which gives it hands on the live instance), and maps each step to the underlying manual documentation so you always know what the AI is generating.

::: tip Prerequisites
- The [`unopim-plugin-development`](./agent-skills.html#unopim-plugin-development) skill installed in your coding agent.
- The [MCP Server](./mcp-server.html) connected to your local instance.
- Familiarity with [Plugin Development](../plugins/create-plugin.html) — the AI generates this structure; you should be able to read it.
:::

We'll build a connector named **`Acme`** that authenticates against a REST API, lets an admin store and test credentials, maps UnoPim attributes to the remote fields, and exports products. The same flow applies to WooCommerce, Shopify, Shopware, or any REST integration.

---

## How the Pieces Work Together

| Step | Skill section | MCP action | Manual reference |
|------|---------------|------------|------------------|
| Scaffold the package | `@core` | `generate_plugin` | [Getting Started](../plugins/create-plugin.html) |
| Models & repositories | `@backend` | `dev_tools` | [Models](../packages/create-models.html), [Repositories](../packages/store-data-through-repositories.html) |
| Credential storage | `@credentials` | `dev_tools` | [Migrations](../packages/create-migrations.html) |
| HTTP client | `@http` | `dev_tools` | — |
| Credentials DataGrid | `unopim-datagrid` skill | `dev_tools` | [DataGrid](../packages/datagrid.html) |
| Attribute mapping | `@mapping` | `dev_tools` | [History Tracking](../packages/history.html) |
| Export profile | `unopim-data-transfer` skill | `dev_tools` | [Export Profile](../plugins/create-export-profile.html) |
| Test & review | `unopim-dev-cycle`, `unopim-code-review` | `generate_test`, `run_command` | — |

The skill keeps the AI on UnoPim's rails (Concord package layout, `wk_` table prefix, `Database/Migration/` folder, `['admin']` middleware, repository pattern, cURL over Guzzle, translation keys for all strings). The MCP Server executes the scaffolding and commands against your instance.

---

## Step 1 — Scaffold the Package

Start from the day-1 checklist the `@quickstart` reference encodes. Prompt your agent:

> *"Scaffold an UnoPim connector plugin named 'Acme' with a service provider, config, ACL entry, and an admin menu item under a 'Connectors' group."*

Behind the scenes the agent uses the MCP `generate_plugin` action (`--type=connector`), producing `packages/Webkul/Acme` wired to UnoPim's conventions:

```
packages/Webkul/Acme/
├── composer.json
└── src/
    ├── Config/
    │   ├── acl.php              # flat array — no nested children
    │   ├── menu.php             # admin menu under "Connectors"
    │   └── system.php
    ├── Database/
    │   └── Migration/           # singular folder (no "s")
    ├── Http/
    │   └── Controllers/
    ├── Providers/
    │   └── AcmeServiceProvider.php
    ├── Repositories/
    ├── Resources/
    │   ├── lang/en_US/          # translation keys — no hardcoded strings
    │   └── views/
    └── Routes/
        └── admin-routes.php     # middleware: ['admin'] only
```

Notice what the skill enforced without being asked: the `Database/Migration/` folder is singular, the route file uses `['admin']` middleware only, the ACL config is a flat array, and every label lives in `Resources/lang/`. A generic assistant would get several of these wrong.

**Verify:**

> *"Run `composer dump-autoload` and confirm the Acme menu item renders in the admin panel."* → MCP `run_command`.

---

## Step 2 — Credential Storage & Connection Test

Connectors need a place to store API credentials and a way to test them. The `@credentials` reference covers the model, migration, repository, and connection-test pattern.

> *"Add credential storage for Acme: a `wk_acme_credentials` migration, model, repository, and a CRUD controller. Add a 'Test Connection' action that calls the Acme API and reports success or failure."*

The skill ensures:

- The migration lands in `packages/Webkul/Acme/src/Database/Migration/` (singular folder).
- Sensitive fields go in `$auditExclude` — **not** `Crypt::encryptString()` — per UnoPim convention.
- All DB access goes through an `AcmeCredentialRepository`.
- Controller store/update/delete return `JsonResponse` with `redirect_url` and `message`.

For example, the generated migration follows the `wk_` prefix and singular-folder rules automatically:

```php
// packages/Webkul/Acme/src/Database/Migration/2025_01_01_000000_create_acme_credentials_table.php
Schema::create('acme_credentials', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('api_url');
    $table->string('api_key');      // excluded from history via $auditExclude on the model
    $table->boolean('status')->default(0);
    $table->timestamps();
});
```

> `DB::table('acme_credentials')` — Laravel prepends the `wk_` prefix automatically, so you reference the unprefixed name in code.

**Verify:** Save a credential set in the admin panel and run the Test Connection action.

---

## Step 3 — The HTTP Client

UnoPim connectors use **native cURL**, not Guzzle or Laravel HTTP. The `@http` reference provides the `ApiClient` pattern with retry and auth strategies.

> *"Generate an `AcmeApiClient` using native cURL with retry, supporting Basic Auth and Bearer token strategies."*

**Verify:** Ask the agent to `generate_test` a unit test that mocks a cURL response, then `run_command` → `vendor/bin/pest`.

---

## Step 4 — Credentials DataGrid

List the stored credentials with search, edit, and delete. Switch to the [`unopim-datagrid`](./agent-skills.html#unopim-datagrid) skill:

> *"Create a `CredentialDataGrid` for Acme with columns for name and status, an edit action, and a mass-delete action, guarded by the `acme.credentials` permission."*

The skill produces `prepareQueryBuilder` with `DB::table` (unprefixed — Laravel adds `wk_`), `addColumn` closures, `addAction`, `addMassAction`, and a `bouncer()` permission check — matching the [DataGrid](../packages/datagrid.html) engine.

---

## Step 5 — Attribute Mapping

Connectors map UnoPim attributes to remote fields. The `@mapping` reference covers the mapping module and its history tracking.

> *"Add an attribute-mapping module for Acme that maps UnoPim attribute codes to Acme field names, with mapping history."*

The mapping model implements `PresentableHistoryInterface` and uses `HistoryTrait`, so changes are auditable — see [History Tracking](../packages/history.html).

---

## Step 6 — Export Profile

Push products to the remote API through UnoPim's data-transfer pipeline. Switch to the [`unopim-data-transfer`](./agent-skills.html#unopim-data-transfer) skill (`@export-workflow` section):

> *"Create an Acme export profile: register it in `exporters.php`, add an `AcmeProductExporter` and a `Validator`, and a queued job that pushes each batch through `AcmeApiClient`."*

This mirrors [Export Profile](../plugins/create-export-profile.html) — `exporters.php` registration, an `Exporter` class, a `Validator`, and a queued job with state tracking.

**Verify:** Run the export profile from the admin panel and watch the job's status, counts, and errors. From your AI editor you can also inspect it via the MCP `search_jobs` and `get_job_execution` tools.

---

## Step 7 — Test, Format, and Review

Close the loop with the [`unopim-dev-cycle`](./agent-skills.html#unopim-dev-cycle) and [`unopim-code-review`](./agent-skills.html#unopim-code-review) skills:

1. > *"Generate Pest feature tests for the Acme credential CRUD and export job."* → `generate_test`.
2. > *"Run the Acme test suite."* → `run_command` → `vendor/bin/pest`.
3. > *"Review all Acme changes against UnoPim standards."* → the review skill flags violations (table prefix, route middleware `['admin']` only, hardcoded strings, missing repository usage, `Crypt` on sensitive fields).

**Mandatory pipeline before you ship** (the skill enforces this):

```bash
vendor/bin/pest                       # tests pass
vendor/bin/pint                       # format
vendor/bin/pint --test                # zero issues
php artisan unopim:translations:check # all locale keys present
```

---

## Why AI + Skills Beats AI Alone

A generic AI assistant writes *plausible Laravel* — wrong table prefix, `web` middleware, inline validation, Guzzle, English-only strings. The `unopim-plugin-development` skill injects UnoPim's actual conventions into the agent's context, so the generated connector is **UnoPim-correct on the first pass**. The MCP Server then lets the agent scaffold, migrate, test, and verify against your live instance without you switching tools.

For deeper detail on any generated artifact, follow the manual references linked in each step — the AI accelerates the work, but the [Technical Codebase](../packages/create-package.html) and [Plugin Development](../plugins/create-plugin.html) sections remain the source of truth.
