# Extending the MCP Bridge

The [MCP Server](./mcp-server.html) is designed to be extended. When the built-in catalog, settings, and developer tools don't cover a workflow specific to your PIM, you can add new capabilities in two ways:

| Approach | Effort | Best for |
|----------|--------|----------|
| **Dynamic Skills** | Low-code (Markdown) | Repeatable instruction sequences, no new PHP logic |
| **Core Tools** | PHP | Deep integration, custom catalog logic, transactions |

---

## 1. Dynamic Skills (Low-Code)

Skills are the fastest way to extend the bridge. A skill is a Markdown file with instructions and parameters — the bridge auto-discovers it and registers it as an MCP tool.

### Create a Skill

1. Create a directory under `.ai/skills/` (e.g. `.ai/skills/enrich-missing-descriptions/`).
2. Add a `SKILL.md` with YAML frontmatter and an instruction body:

```markdown
---
name: Enrich Missing Descriptions
description: Find catalog products without a description and draft SEO-friendly copy
parameters:
  category:
    type: string
    description: Category code to scope the enrichment
    required: true
---

# Instructions

1. Use `search_products` to find products in the given category with no description.
2. For each product, draft a 200-word SEO-friendly description from its name and attributes.
3. Use `upsert_products` to write the descriptions back (batches of 50).
4. Report how many products were enriched.
```

The bridge registers this as `execute_enrich_missing_descriptions`. The skill body simply *orchestrates the existing catalog tools* — no PHP required.

::: tip
This is the same `SKILL.md` format used by the [Agentic Skills](./agent-skills.html). A skill you author for your coding agent can double as an executable MCP tool.
:::

---

## 2. Core Tools (PHP)

When you need custom catalog logic, transactions, or integration that Markdown can't express, implement a Core Tool. All tools extend `Webkul\MCP\Tools\BaseMcpTool`, which wraps `execute()` with standardized error handling and logging — you implement `execute()` and `schema()`.

```php
namespace Webkul\MCP\Tools\Catalog;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Webkul\MCP\Tools\BaseMcpTool;

class ProductCompletenessReportTool extends BaseMcpTool
{
    /**
     * The tool's name (exposed to the AI client).
     */
    public string $name = 'product_completeness_report';

    /**
     * The tool's description.
     */
    protected string $description = 'Report completeness percentage for a product SKU in a given channel.';

    /**
     * Throw exceptions for errors — BaseMcpTool logs them with a reference
     * ID and returns a safe error response to the client.
     */
    protected function execute(Request $request): Response
    {
        $validated = $request->validate([
            'sku'     => ['required', 'string', 'max:255'],
            'channel' => ['required', 'string', 'max:64'],
        ]);

        // Your PIM logic — resolve the product via its repository and
        // compute completeness for the requested channel.
        $report = [
            'sku'        => $validated['sku'],
            'channel'    => $validated['channel'],
            'percentage' => 100,
            'missing'    => [],
        ];

        return Response::json($report);
    }

    /**
     * JSON schema advertised to the AI client.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'sku' => $schema->string()
                ->description('Product SKU to evaluate.')
                ->required(),
            'channel' => $schema->string()
                ->description('Channel code, e.g. "default".')
                ->required(),
        ];
    }
}
```

::: warning Transactions
If your tool performs multiple writes, wrap them in `DB::transaction(...)`, or ensure every early `return Response::error(...)` is preceded by `DB::rollBack()`. Returning early inside an open transaction without a rollback leaks the transaction.
:::

### Register the Tool

Add the class to `Webkul\MCP\Registry\ToolRegistry`:

```php
// packages/Webkul/MCP/src/Registry/ToolRegistry.php

public static function tools(): array
{
    return [
        // ... existing tools
        \Webkul\MCP\Tools\Catalog\ProductCompletenessReportTool::class,
    ];
}
```

---

## Developing Securely

The bridge is production-hardened — your tools must uphold the same guarantees:

- **File operations** — use `FileManagerInterface`, which enforces path-traversal protection within the configured `allowed_paths`.
- **CLI operations** — use `CommandRunner`, which enforces command whitelisting (only `php artisan` and `composer` base commands; shell operators blocked).
- **Validate everything** — always validate arguments in `execute()` before acting.
- **Map to ACL** — write tools should map to the relevant UnoPim permission via `bouncer()` so the same role rules apply over MCP as in the admin panel.

---

## Testing

Every new tool needs a test in `packages/Webkul/MCP/tests/`:

- **Unit tests** — for isolated logic (validation, schema, business rules).
- **Feature tests** — for end-to-end execution through the MCP server, including the security layers (auth, rate limit, ACL, audit logging).

```bash
# From the package
cd packages/Webkul/MCP && ../../vendor/bin/pest

# From the project root
./vendor/bin/pest --filter=MCP
```

Run Laravel Pint after any change and verify with `vendor/bin/pint --test` before opening a PR.
