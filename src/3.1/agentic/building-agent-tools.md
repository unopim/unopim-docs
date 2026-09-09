# Building Custom Agent Tools

The AI Agent ships with 35 PIM tools, but its real power for developers is **extensibility**: any Concord package can register its own tools so the agent can drive *your* catalog logic in natural language. A tool is a small PHP class that the LLM autonomously decides to call based on the user's request.

This guide walks through building, securing, registering, and testing a custom PIM tool. For the agent's overall architecture, see [AI Agent Integration](./ai-agent.html).

---

## The `PimTool` Interface

Every tool implements a single-method contract:

```php
namespace Webkul\AiAgent\Chat\Contracts;

use Laravel\Ai\Contracts\Tool;
use Webkul\AiAgent\Chat\ChatContext;

interface PimTool
{
    /**
     * Return a configured laravel/ai Tool instance.
     */
    public function register(ChatContext $context): Tool;
}
```

The `register()` method returns a [`laravel/ai`](https://github.com/laravel/ai) `Tool`. UnoPim provides an abstract base, `Webkul\AiAgent\Chat\Tools\ContextualTool`, that holds the `ChatContext` for you, so a tool implements four methods:

- **`name()`** — the tool name the LLM calls.
- **`description()`** — what the LLM reads to decide *when* to call it. Be specific; this is the single most important piece of text for correct tool selection.
- **`schema(JsonSchema $schema)`** — the parameters the LLM must supply, returned as an array of schema definitions.
- **`handle(Request $request)`** — the code that runs your PIM logic and returns a JSON string.

---

## A Worked Example: a PIM Tool

Say you want the agent to report which products are missing a required attribute for a given channel — a common catalog-completeness check. Create a tool:

```php
namespace App\AiAgent\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Webkul\AiAgent\Chat\ChatContext;
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;
use Webkul\AiAgent\Chat\Contracts\PimTool;
use Webkul\AiAgent\Chat\Tools\ContextualTool;
use Webkul\Product\Repositories\ProductRepository;

class FindProductsMissingAttribute implements PimTool
{
    public function __construct(protected ProductRepository $productRepository) {}

    public function register(ChatContext $context): Tool
    {
        $outer = $this;

        return new class($context, $outer) extends ContextualTool
        {
            use ChecksPermission;

            public function __construct(ChatContext $context, protected FindProductsMissingAttribute $outer)
            {
                parent::__construct($context);
            }

            public function name(): string
            {
                return 'find_products_missing_attribute';
            }

            public function description(): string
            {
                return 'Find products that do not have a value for a given attribute code in the current channel and locale. Use when the user asks which products are missing a specific field, e.g. "which electronics are missing voltage".';
            }

            public function schema(JsonSchema $schema): array
            {
                return [
                    'attribute_code' => $schema->string()->description('The attribute code to check, e.g. "voltage" or "description".'),
                    'limit'          => $schema->integer()->description('Maximum products to return (default 25).'),
                ];
            }

            public function handle(Request $request): string
            {
                if ($denied = $this->denyUnlessAllowed($this->context, 'catalog.products')) {
                    return $denied;
                }

                $attributeCode = $request->string('attribute_code')->toString();
                $limit = $request->integer('limit') ?: 25;

                $missing = $this->outer->findMissing(
                    $attributeCode,
                    $this->context->channel,
                    $this->context->locale,
                    $limit,
                );

                return json_encode([
                    'result' => [
                        'attribute' => $attributeCode,
                        'count'     => count($missing),
                        'products'  => $missing,
                    ],
                ]);
            }
        };
    }

    /**
     * The catalog lookup, kept on the outer class so the anonymous tool stays thin.
     */
    public function findMissing(string $code, string $channel, string $locale, int $limit): array
    {
        return $this->productRepository->findMissingAttribute($code, $channel, $locale, $limit);
    }
}
```

The anonymous-class pattern is how UnoPim's own tools are written — `register()` returns a `ContextualTool` that already holds the context, while the outer class keeps the injected repositories and any heavy logic. Look at `Webkul\AiAgent\Chat\Tools\ExportProducts` for a complete example.

Now the user can ask *"Which products in Electronics are missing the voltage attribute?"* and the LLM will call this tool with `attribute_code="voltage"`.

::: tip
Always go through a `*Repository` for catalog access rather than querying Eloquent directly — this keeps tools aligned with UnoPim's repository pattern and proxy-model conventions.
:::

---

## The `ChatContext` DTO

Every tool receives the immutable `ChatContext` carrying request-scoped data — the active channel and locale, the product currently being edited (if the chat was opened from a product page), the AI platform and model, and the authenticated admin for ACL checks. `ContextualTool` exposes it as `$this->context`:

```php
final readonly class ChatContext
{
    public function __construct(
        public string $message,             // User's text message
        public array $history,              // Conversation history
        public ?int $productId,             // Product being edited (page context)
        public ?string $productSku,
        public ?string $productName,
        public string $locale,              // Active locale (e.g. en_US)
        public string $channel,             // Active channel (e.g. default)
        public MagicAIPlatform $platform,   // AI platform record
        public string $model = '',
        public array $uploadedImagePaths = [],
        public array $uploadedFilePaths = [],
        public ?string $currentPage = null,
        public ?Admin $user = null,         // Authenticated admin (for ACL)
    ) {}
}
```

Always scope catalog queries to `$context->channel` and `$context->locale` so results match what the user sees in the admin panel.

---

## Enforcing ACL

Tools that read or write the catalog must respect UnoPim's role-based permissions. The `ChecksPermission` trait wraps the bouncer system — call `denyUnlessAllowed()` before doing any work:

```php
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;

// Inside handle():
if ($denied = $this->denyUnlessAllowed($this->context, 'catalog.products.edit')) {
    return $denied; // returns a JSON error the LLM relays to the user
}
```

Use read permissions (`catalog.products`) for search/list tools and specific write permissions (`catalog.products.create`, `catalog.products.edit`) for mutations. If the user lacks the permission, the tool returns a JSON error and the LLM explains the denial in natural language.

---

## Respecting the Approval Mode

Write tools should honour the configured `approval_mode` (`auto`, `review`, `suggest`) so AI-driven catalog changes can be queued for human review. Use the `QueuesForApproval` trait:

```php
use Webkul\AiAgent\Chat\Concerns\QueuesForApproval;

// Inside handle() for a write tool:
if ($this->shouldQueueForApproval()) {
    return $this->queueChange($this->context, 'Update voltage on 12 products', [
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

Per the UnoPim development pipeline, every tool needs a Pest test. Test the tool's behaviour through its `handle()` method — assert on the JSON contract the LLM will consume:

```php
it('lists products missing the requested attribute', function () {
    $context = makeChatContext(channel: 'default', locale: 'en_US');

    $tool = app(\App\AiAgent\Tools\FindProductsMissingAttribute::class)
        ->register($context);

    $request = new \Laravel\Ai\Tools\Request(['attribute_code' => 'voltage', 'limit' => 5]);

    $result = json_decode($tool->handle($request), true);

    expect($result['result']['attribute'])->toBe('voltage')
        ->and($result['result']['count'])->toBeGreaterThanOrEqual(0);
});
```

Also assert that a user without the `catalog.products` permission receives the denial JSON.

---

## Best Practices

- **Return JSON strings** — `handle()` returns a JSON-encoded `string`; the LLM parses it to compose its reply.
- **Check permissions first** — use `ChecksPermission` on any tool touching the catalog.
- **Support approval mode** — use `QueuesForApproval` on write tools.
- **Keep tools focused** — one tool, one job. The LLM chains tools for complex workflows.
- **Write a precise `description()`** — it drives whether the LLM picks your tool at the right moment.
- **Stay PIM-scoped** — operate on products, attributes, categories, families, channels, and locales through their repositories; honour the active channel/locale from `ChatContext`.
