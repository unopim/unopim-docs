# Building Custom Agent Tools

The AI Agent ships with 38+ PIM tools, but its real power for developers is **extensibility**: any Concord package can register its own tools so the agent can drive *your* catalog logic in natural language. A tool is a small PHP class that the LLM autonomously decides to call based on the user's request.

This guide walks through building, securing, registering, and testing a custom PIM tool. For the agent's overall architecture, see [AI Agent Integration](./ai-agent.html).

---

## The `PimTool` Interface

Every tool implements a single-method contract:

```php
namespace Webkul\AiAgent\Chat\Contracts;

use Prism\Prism\Tool;
use Webkul\AiAgent\Chat\ChatContext;

interface PimTool
{
    /**
     * Return a configured Prism Tool instance.
     */
    public function register(ChatContext $context): Tool;
}
```

The `register()` method returns a [Prism](https://github.com/prism-php/prism) `Tool` describing:

- **`as()`** — the tool name the LLM calls.
- **`for()`** — a description the LLM reads to decide *when* to call it. Be specific; this is the single most important field for correct tool selection.
- **`withStringParameter()` / `withNumberParameter()` / …** — the parameters the LLM must supply.
- **`using()`** — the callback that runs your PIM logic and returns a JSON string.

---

## A Worked Example: a PIM Tool

Say you want the agent to report which products are missing a required attribute for a given channel — a common catalog-completeness check. Create a tool:

```php
namespace App\AiAgent\Tools;

use Prism\Prism\Tool;
use Webkul\AiAgent\Chat\ChatContext;
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;
use Webkul\AiAgent\Chat\Contracts\PimTool;
use Webkul\Product\Repositories\ProductRepository;

class FindProductsMissingAttribute implements PimTool
{
    use ChecksPermission;

    public function __construct(protected ProductRepository $productRepository) {}

    public function register(ChatContext $context): Tool
    {
        return (new Tool)
            ->as('find_products_missing_attribute')
            ->for('Find products that do not have a value for a given attribute code in the current channel and locale. Use when the user asks which products are missing a specific field, e.g. "which electronics are missing voltage".')
            ->withStringParameter('attribute_code', 'The attribute code to check, e.g. "voltage" or "description".')
            ->withNumberParameter('limit', 'Maximum products to return (default 25).')
            ->using(function (string $attribute_code, int $limit = 25) use ($context): string {
                // Read-only catalog access still requires the catalog.products permission.
                if ($denied = $this->denyUnlessAllowed($context, 'catalog.products')) {
                    return $denied;
                }

                $missing = $this->productRepository->findMissingAttribute(
                    code:    $attribute_code,
                    channel: $context->channel,
                    locale:  $context->locale,
                    limit:   $limit,
                );

                return json_encode([
                    'result' => [
                        'attribute' => $attribute_code,
                        'count'     => count($missing),
                        'products'  => $missing,
                    ],
                ]);
            });
    }
}
```

Now the user can ask *"Which products in Electronics are missing the voltage attribute?"* and the LLM will call this tool with `attribute_code="voltage"`.

::: tip
Always go through a `*Repository` for catalog access rather than querying Eloquent directly — this keeps tools aligned with UnoPim's repository pattern and proxy-model conventions.
:::

---

## The `ChatContext` DTO

Every tool callback receives the immutable `ChatContext` carrying request-scoped data — the active channel and locale, the product currently being edited (if the chat was opened from a product page), the AI platform/model, and the authenticated admin for ACL checks:

```php
final class ChatContext
{
    public function __construct(
        public readonly string $message,           // User's text message
        public readonly array $history,             // Conversation history
        public readonly ?int $productId,            // Product being edited (page context)
        public readonly ?string $productSku,
        public readonly ?string $productName,
        public readonly string $locale,             // Active locale (e.g. en_US)
        public readonly string $channel,            // Active channel (e.g. default)
        public readonly MagicAIPlatform $platform,  // AI platform record
        public readonly string $model = '',
        public readonly array $uploadedImagePaths = [],
        public readonly array $uploadedFilePaths = [],
        public readonly ?string $currentPage = null,
        public readonly ?Admin $user = null,        // Authenticated admin (for ACL)
    ) {}
}
```

Always scope catalog queries to `$context->channel` and `$context->locale` so results match what the user sees in the admin panel.

---

## Enforcing ACL

Tools that read or write the catalog must respect UnoPim's role-based permissions. The `ChecksPermission` trait wraps the bouncer system — call `denyUnlessAllowed()` before doing any work:

```php
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;

// Inside ->using():
if ($denied = $this->denyUnlessAllowed($context, 'catalog.products.edit')) {
    return $denied; // returns a JSON error the LLM relays to the user
}
```

Use read permissions (`catalog.products`) for search/list tools and specific write permissions (`catalog.products.create`, `catalog.products.edit`) for mutations. If the user lacks the permission, the tool returns a JSON error and the LLM explains the denial in natural language.

---

## Respecting the Approval Mode

Write tools should honour the configured `approval_mode` (`auto`, `review`, `suggest`) so AI-driven catalog changes can be queued for human review. Use the `QueuesForApproval` trait:

```php
use Webkul\AiAgent\Chat\Concerns\QueuesForApproval;

// Inside ->using() for a write tool:
if ($this->shouldQueueForApproval()) {
    return $this->queueChange($context, 'Update voltage on 12 products', [
        'type'           => 'bulk_edit',
        'data'           => $changes,
        'affected_count' => 12,
    ]);
}

// Otherwise apply directly…
```

In `review` mode the change becomes a pending changeset an admin approves via the [approval queue](./ai-agent.html#approval-queue); in `auto` mode it applies immediately.

---

## Registering the Tool

The `ToolRegistry` is a singleton. Register your tool in any service provider's `boot()` — no routing or controller changes needed:

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Webkul\AiAgent\Chat\ToolRegistry;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (class_exists(ToolRegistry::class)) {
            app(ToolRegistry::class)->register(
                app(\App\AiAgent\Tools\FindProductsMissingAttribute::class)
            );
        }
    }
}
```

The `class_exists` guard keeps your package safe to install even when the AiAgent package is absent.

---

## Testing Your Tool

Per the UnoPim development pipeline, every tool needs a Pest test. Test the tool's behaviour through its callback — assert on the JSON contract the LLM will consume:

```php
it('lists products missing the requested attribute', function () {
    $context = makeChatContext(channel: 'default', locale: 'en_US');

    $tool = app(\App\AiAgent\Tools\FindProductsMissingAttribute::class)
        ->register($context);

    $result = json_decode($tool->handle(attribute_code: 'voltage', limit: 5), true);

    expect($result['result']['attribute'])->toBe('voltage')
        ->and($result['result']['count'])->toBeGreaterThanOrEqual(0);
});
```

Also assert that a user without the `catalog.products` permission receives the denial JSON.

---

## Best Practices

- **Return JSON strings** — every callback returns a JSON-encoded `string`; the LLM parses it to compose its reply.
- **Check permissions first** — use `ChecksPermission` on any tool touching the catalog.
- **Support approval mode** — use `QueuesForApproval` on write tools.
- **Keep tools focused** — one tool, one job. The LLM chains tools for complex workflows.
- **Write a precise `->for()`** — the description drives whether the LLM picks your tool at the right moment.
- **Stay PIM-scoped** — operate on products, attributes, categories, families, channels, and locales through their repositories; honour the active channel/locale from `ChatContext`.
