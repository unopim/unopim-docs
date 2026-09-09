# Agentic Skills

**Agent Skills** are domain-specific, reusable context packs for AI coding agents — Claude Code, Cursor, Windsurf, GitHub Copilot, and any other agent that supports the [skills](https://github.com/anthropics/skills) format. They encode UnoPim's modular Concord architecture, connector conventions, and coding standards so the agent generates correct UnoPim code on the **first try** instead of guessing at generic Laravel patterns.

Each skill is a single `SKILL.md` file with a YAML frontmatter block defining when it activates. The agent reads the frontmatter, decides the skill is relevant to the task at hand, and loads its instructions into context — without you having to re-explain UnoPim's rules every session.

The skills live in the open-source [`unopim/agent-skills`](https://github.com/unopim/agent-skills) repository.

---

## What You Can Build

With the skills installed, you describe the outcome in natural language and the agent writes UnoPim-correct code:

```
"Scaffold a Shopify connector with credential storage and a connection test."
            → unopim-plugin-development (@quickstart, @credentials, @http)

"Add a credentials listing page with search, edit, and a mass-delete action."
            → unopim-datagrid

"Build an export profile that pushes products to the connector's API."
            → unopim-data-transfer (@export-workflow)

"Review my changes against UnoPim standards before I open a PR."
            → unopim-code-review
```

---

## Available Skills

### `unopim-plugin-development`

The comprehensive module-building skill. Covers plugin, package, and connector development end to end.

**Activates when:** creating modules/packages, service providers, models, repositories, controllers, routes, ACL, menus, migrations, credentials, cURL HTTP clients, attribute mapping, or scaffolding a third-party connector (WooCommerce, Shopify, Shopware, any REST API).

**Reference sections** (loaded on demand via `@`-tags):

| Tag | Covers |
|-----|--------|
| `@quickstart` | Day-1 ordered checklist to ship a complete connector |
| `@core` | Package structure, service providers, ACL, menu, migrations, config |
| `@backend` | PHP classes, models, repositories, events, listeners |
| `@credentials` | Credential storage, connection testing, history, CRUD |
| `@http` | cURL `ApiClient` with retry, BasicAuth/OAuth strategies |
| `@mapping` | Module attribute mapping and mapping history |

### `unopim-datagrid`

Implement DataGrid classes for admin listing pages with search, filter, sort, row actions (edit/delete), and mass actions — `prepareQueryBuilder` with `DB::table`, `addColumn` closures, `addAction`, `addMassAction`, and `bouncer()` permission checks.

### `unopim-data-transfer`

Import/export pipeline and connector export/import workflow. Activates when configuring imports/exports, debugging job pipelines, creating data transfer profiles, or building connector export jobs (`exporters.php`, `quick_exporters.php`, `importers.php`, `Exporter` classes, `Validator` classes, and queue jobs).

### `unopim-code-review`

Code review against UnoPim coding standards. Activates when reviewing changes, checking standards compliance, flagging violations, or performing PR reviews.

### `unopim-git`

Git and GitHub operations — branch naming, commit messages, pull requests, and changelog conventions.

### `unopim-dev-cycle`

The development workflow — running Pest tests, Laravel Pint formatting, building assets, and debugging.

---

## Installation

Skills install via the [`skills`](https://github.com/anthropics/skills) CLI. Install **all** UnoPim skills into your agent:

```bash
npx skills add unopim/agent-skills
```

Install a **specific** skill only:

```bash
npx skills add unopim/agent-skills --skill "unopim-plugin-development"
npx skills add unopim/agent-skills --skill "unopim-datagrid"
npx skills add unopim/agent-skills --skill "unopim-data-transfer"
npx skills add unopim/agent-skills --skill "unopim-code-review"
npx skills add unopim/agent-skills --skill "unopim-git"
npx skills add unopim/agent-skills --skill "unopim-dev-cycle"
```

Target a **specific agent**:

```bash
npx skills add unopim/agent-skills -a claude-code
npx skills add unopim/agent-skills -a cursor
```

---

## How Skills Activate

You do not invoke skills manually. Each `SKILL.md` declares a `description` in its frontmatter that tells the agent *when* the skill is relevant:

```yaml
---
name: unopim-datagrid
description: "Implement UnoPim DataGrid classes for listing records in admin
  panels with search, filter, sort, actions, and mass actions..."
license: MIT
metadata:
  author: unopim
---
```

When your request matches a skill's description — for example, "add a credentials listing page to my connector" matches `unopim-datagrid` — the agent loads that skill's body and follows its instructions. The comprehensive `unopim-plugin-development` skill is further split into `@`-tagged reference sections so only the relevant part is pulled into context.

---

## The `AGENTS.md` Convention File

Alongside the skills, the repository ships an `AGENTS.md` that establishes the foundation rules every agent must follow when touching an UnoPim codebase. The critical conventions:

- **Table prefix** — tables are declared unprefixed (`products`, `categories`). An installation may opt into a prefix with `DB_PREFIX`, which defaults to empty, so always reference the unprefixed name in `DB::table()` and let the query builder apply the prefix.
- **Migration folder** — package migrations live in `src/Database/Migrations/`.
- **Route middleware** — use `['admin']` only, never `['web', 'admin']`.
- **Models with history** — implement `PresentableHistoryInterface` and use `HistoryTrait`.
- **Controllers return JSON** — store/update/delete return `JsonResponse` with `redirect_url` and `message`.
- **FormRequest validation** — always type-hint FormRequest classes; never inline `$request->validate()`.
- **Repository pattern** — all DB queries go through `*Repository` classes, not Eloquent in controllers.
- **Proxy models** — Concord uses proxy models for extensibility (`ProductProxy`, `UserProxy`).
- **Connectors use cURL** — native cURL, not Guzzle or Laravel HTTP.
- **Sensitive fields** — go in `$auditExclude`, not `Crypt::encryptString()`.
- **ACL config** — flat arrays, no nested `children`.
- **No hardcoded strings** — all user-facing text via `trans('package::file.key')`, propagated to all supported locales.

The file also pins the mandatory development pipeline: write Pest tests → run Laravel Pint → run Larastan → run Playwright E2E for UI flows → verify translations with `php artisan unopim:translations:check`.

---

## Authoring Your Own Skill

A skill is a folder containing one `SKILL.md` with frontmatter and an instruction body:

```markdown
---
name: my-connector-skill
description: "When to activate this skill — be specific so the agent
  picks it up for the right tasks."
license: MIT
metadata:
  author: your-org
---

# My Connector Skill

## When to Use This Skill

Invoke this skill when ...

## Instructions

Step-by-step, opinionated guidance the agent should follow ...
```

Keep skills **focused and specific**: a sharp `description` ensures the agent activates the skill at the right moment, and a focused body keeps the loaded context small. Large skills can be split into `@`-tagged reference sections that the agent pulls in only when needed.

::: tip
The same `SKILL.md` format works for skills you write yourself — drop a new directory alongside the others and your agent picks it up, no code required.
:::
