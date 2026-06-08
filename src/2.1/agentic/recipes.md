# Agentic Recipes

Practical, end-to-end playbooks for working on UnoPim *with* AI. Each recipe states the **goal**, which agentic interface it uses, the **steps** (the prompts and tools involved), and what to **verify** afterwards.

The three interfaces these recipes draw on:

- **AI Agent** — the in-app chat widget ([reference](./ai-agent.html)).
- **MCP Server** — your IDE's AI assistant connected to the live instance ([reference](./mcp-server.html)).
- **Agentic Skills** — UnoPim conventions loaded into your coding agent ([reference](./agent-skills.html)).

---

## Recipe 1 — Scaffold a Connector with AI

**Goal:** Stand up a new third-party connector plugin without hand-writing boilerplate.

**Uses:** Agentic Skills (`unopim-plugin-development`) + MCP Server (`dev_tools` → `generate_plugin`, `run_command`).

**Steps:**

1. With the `unopim-plugin-development` skill installed, prompt your coding agent:
   > *"Scaffold a connector plugin named 'ShipStation' with a configuration page, credential storage, and a connection test."*
2. The skill supplies UnoPim's package conventions (service provider, `Database/Migration/` folder, `['admin']` middleware, repository pattern); the MCP `generate_plugin` action writes the directory structure, `composer.json`, and base classes into `packages/Webkul/ShipStation`.
3. Run migrations through the bridge:
   > *"Run `php artisan migrate`."* → MCP `run_command`.

**Verify:** Ask the agent to `read_file` the generated `ServiceProvider`, then confirm the plugin's config page loads in the admin panel. Run `vendor/bin/pint --test`.

---

## Recipe 2 — Bulk Attribute Enrichment

**Goal:** Fill missing descriptions across hundreds of products.

**Uses:** AI Agent (search + content generation + bulk edit + auto-translation).

**Steps:**

1. > *"Find products without a description created in the last 24 hours."* → the agent calls `SearchProducts`.
2. > *"Generate a 200-word SEO-friendly description for each from its name and attributes."* → `GenerateContent`.
3. > *"Apply the descriptions and translate them to all active locales."* → `BulkEdit`, then the `TranslateProductValuesJob` runs on the queue.

**Verify:** Spot-check a few products in the admin panel; confirm locale-dependent fields populated for each active locale. If `approval_mode` is `review`, approve the changeset from the [approval queue](./ai-agent.html#approval-queue).

::: tip
For products created before auto-translation was enabled, run the CLI alternative: `php artisan unopim:translate`.
:::

---

## Recipe 3 — Catalog Completeness Diagnostics

**Goal:** Find why a product isn't appearing in a channel and fix the gaps.

**Uses:** MCP Server (`get_product`, `get_catalog_schema`, `upsert_products`).

**Steps:**

1. > *"Check product SKU 'PHONE-001' completeness for channel 'default'. If it's below 100%, list the missing required attributes."*
2. The assistant fetches the product with its completeness data and reports the missing required attributes.
3. > *"Fill the missing attributes with sensible values and upsert."* → `upsert_products` (max 50 per atomic batch).

**Verify:** Re-run the completeness check; confirm 100% for the target channel. Confirm the product now surfaces in that channel.

---

## Recipe 4 — Mass Category Re-assignment

**Goal:** Restructure the catalog — move a set of products to a new category branch.

**Uses:** AI Agent (`SearchProducts`, `AssignCategories`, `BulkEdit`).

**Steps:**

1. > *"Find all products in the 'Winter Wear' category."*
2. > *"Assign them to 'Seasonal > Winter' and remove the old 'Winter Wear' assignment."*

**Verify:** Confirm the count of re-assigned products matches the original search count; check the category tree in the admin panel. Use `review` approval mode for large moves so the changeset is auditable and reversible.

---

## Recipe 5 — Define Attributes by Description

**Goal:** Rapidly prototype catalog structure during development.

**Uses:** MCP Server (`upsert_attributes`, `upsert_attribute_groups`) or AI Agent (`CreateAttribute`, `ManageFamilies`).

**Steps:**

1. > *"Create a select-type attribute 'Fabric Material' with options Cotton, Silk, Wool."*
2. > *"Add it to the 'Clothing' attribute group."*

**Verify:** Confirm the attribute and its options exist via `search_attributes`, and that it renders on a product in the relevant family.

---

## Recipe 6 — AI-Assisted Test & Review Loop

**Goal:** Ship a change that passes the UnoPim development pipeline.

**Uses:** Agentic Skills (`unopim-dev-cycle`, `unopim-code-review`) + MCP Server (`generate_test`, `run_command`).

**Steps:**

1. > *"Generate a Pest test for the new `ShipStationRepository`."* → MCP `generate_test` (or `mcp:make test`).
2. > *"Run the test."* → `run_command` → `vendor/bin/pest`.
3. > *"Review my changes against UnoPim standards before I open a PR."* → the `unopim-code-review` skill flags convention violations (table prefix, route middleware, hardcoded strings, repository pattern).

**Verify:** Tests pass, `vendor/bin/pint --test` reports zero issues, and `php artisan unopim:translations:check` passes with zero missing keys.

---

## Recipe 7 — Reusable Workflow as a Skill

**Goal:** Stop re-typing a multi-step instruction you run often.

**Uses:** Dynamic Skills (MCP) — see [Extending the MCP Bridge](./extending-mcp.html#dynamic-skills-low-code).

**Steps:**

1. Drop a `SKILL.md` into `.ai/skills/audit-channel-pricing/` describing the steps (search products, compare prices across two channels, report mismatches).
2. The bridge registers `execute_audit_channel_pricing`.
3. Invoke it any time instead of re-explaining the sequence.

**Verify:** Run the new tool from your AI editor and confirm it produces the expected mismatch report.

---

## General Best Practices

- **Discover before acting** — call `get_catalog_schema` first so the assistant knows your custom attributes and filterable fields.
- **Keep batches atomic** — `upsert_*` tools cap at 50 items per call for clean error reporting.
- **Use `review` mode for bulk changes** — queue AI-driven mutations as changesets so they're auditable and reversible before they hit the catalog.
- **Sequence read → write → verify** — read the current state, make the change, then confirm with a follow-up search or completeness check.
- **Let skills enforce conventions** — keep the relevant Agentic Skill active so generated code respects UnoPim's standards the first time.
