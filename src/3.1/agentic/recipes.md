# Agentic Recipes

Practical, end-to-end playbooks for working on UnoPim *with* AI. Each recipe states the **goal**, which agentic interface it uses, the **steps** (the prompts and tools involved), and what to **verify** afterwards.

The interfaces these recipes draw on:

- **AI Agent** — the in-app chat widget ([reference](./ai-agent.html)).
- **Agentic Skills** — UnoPim conventions loaded into your coding agent ([reference](./agent-skills.html)).
- **REST API** — for anything driven from outside the admin panel ([reference](../api/)).

---

## Recipe 1 — Scaffold a Connector with AI

**Goal:** Stand up a new third-party connector plugin without hand-writing boilerplate.

**Uses:** Agentic Skills (`unopim-plugin-development`).

**Steps:**

1. With the `unopim-plugin-development` skill installed, prompt your coding agent:
   > *"Scaffold a connector plugin named 'ShipStation' with a configuration page, credential storage, and a connection test."*
2. The skill supplies UnoPim's package conventions (service provider, `src/Database/Migrations/` folder, `['admin']` middleware, repository pattern, prefix-safe table names), and the agent writes the directory structure, `composer.json`, and base classes into `packages/Webkul/ShipStation`.
3. Ask it to wire the package up and migrate:
   > *"Run `composer dump-autoload`, then `php artisan migrate`."*

**Verify:** Read the generated `ServiceProvider`, confirm the plugin's config page loads in the admin panel, and run `vendor/bin/pint --test`.

---

## Recipe 2 — Bulk Attribute Enrichment

**Goal:** Fill missing descriptions across hundreds of products.

**Uses:** AI Agent (`search_products`, `generate_content`, `bulk_edit`).

**Steps:**

1. > *"Find products without a description created in the last 24 hours."* → the agent calls `search_products`.
2. > *"Generate a 200-word SEO-friendly description for each from its name and attributes."* → `generate_content`.
3. > *"Apply the descriptions and translate them to all active locales."* → `bulk_edit`, then translation runs on the queue.

**Verify:** Spot-check a few products in the admin panel; confirm locale-dependent fields populated for each active locale. If `approval_mode` is `review`, approve the changeset from the [approval queue](./ai-agent.html#approval-queue).

---

## Recipe 3 — Catalog Completeness Diagnostics

**Goal:** Find why a product isn't appearing in a channel and fix the gaps.

**Uses:** AI Agent (`get_product_details`, `data_quality_report`, `update_product`).

**Steps:**

1. > *"Check product SKU 'PHONE-001' completeness for channel 'default'. If it's below 100%, list the missing required attributes."* → `get_product_details`, which returns the product's completeness data.
2. > *"Show me the same gaps across the whole Electronics category."* → `data_quality_report`.
3. > *"Fill the missing attributes on PHONE-001 with sensible values."* → `update_product`.

**Verify:** Re-run the completeness check; confirm 100% for the target channel and that the product now surfaces in that channel.

---

## Recipe 4 — Mass Category Re-assignment

**Goal:** Restructure the catalog — move a set of products to a new category branch.

**Uses:** AI Agent (`search_products`, `assign_categories`, `bulk_edit`).

**Steps:**

1. > *"Find all products in the 'Winter Wear' category."*
2. > *"Assign them to 'Seasonal > Winter' and remove the old 'Winter Wear' assignment."*

**Verify:** Confirm the count of re-assigned products matches the original search count; check the category tree in the admin panel. Use `review` approval mode for large moves so the changeset is auditable and reversible.

---

## Recipe 5 — Define Attributes by Description

**Goal:** Rapidly prototype catalog structure during development.

**Uses:** AI Agent (`create_attribute`, `manage_attribute_options`, `manage_families`).

**Steps:**

1. > *"Create a select-type attribute 'Fabric Material' with options Cotton, Silk, Wool."*
2. > *"Add it to the 'Clothing' attribute group."*

**Verify:** Confirm the attribute and its options exist with `list_attributes`, and that it renders on a product in the relevant family.

---

## Recipe 6 — AI-Assisted Test & Review Loop

**Goal:** Ship a change that passes the UnoPim development pipeline.

**Uses:** Agentic Skills (`unopim-dev-cycle`, `unopim-code-review`).

**Steps:**

1. > *"Generate a Pest test for the new `ShipStationRepository`."*
2. > *"Run the test."* → `vendor/bin/pest`.
3. > *"Review my changes against UnoPim standards before I open a PR."* → the `unopim-code-review` skill flags convention violations (prefix-unsafe SQL, route middleware, hardcoded strings, repository pattern).

**Verify:** Tests pass, `vendor/bin/pint --test` reports zero issues, and `php artisan unopim:translations:check` passes with zero missing keys.

---

## Recipe 7 — Reusable Workflow as a Skill

**Goal:** Stop re-typing a multi-step instruction you run often.

**Uses:** Agentic Skills (your own).

**Steps:**

1. Write a `SKILL.md` for `audit-channel-pricing` describing the steps (search products, compare prices across two channels, report mismatches) and install it alongside the UnoPim skills.
2. Your coding agent loads it whenever the task matches its frontmatter.
3. Invoke it by name instead of re-explaining the sequence.

**Verify:** Run the workflow and confirm it produces the expected mismatch report.

---

## Recipe 8 — Scheduled Delta Sync over the API

**Goal:** Push only what changed to a downstream system, on a schedule.

**Uses:** [REST API](../api/) — date filters plus cursor pagination.

**Steps:**

1. Store the timestamp of your last successful run.
2. Request the products changed since then, in cursor mode:
   ```
   GET {{url}}/api/v1/rest/products
       ?filters={"updated_at":[{"operator":">=","value":"2026-08-01 00:00:00"}]}
       &pagination_type=search_after&limit=100
   ```
3. Follow `links.next` until it comes back `null`, then record the new timestamp.

**Verify:** Compare the number of records processed against the admin product grid filtered by the same date range. See [Migrating an API Client](../api/migrating-your-client) for the pagination and rate-limit rules a client must respect.

---

## General Best Practices

- **Discover before acting** — ask for a `catalog_summary` or `list_attributes` first so the assistant knows your custom attributes and families.
- **Use `review` mode for bulk changes** — queue AI-driven mutations as changesets so they're auditable and reversible before they hit the catalog.
- **Sequence read → write → verify** — read the current state, make the change, then confirm with a follow-up search or completeness check.
- **Let skills enforce conventions** — keep the relevant Agentic Skill active so generated code respects UnoPim's standards the first time.
