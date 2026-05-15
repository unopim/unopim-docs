# AI Agent Integration

## Introduction

UnoPim v2.0.0 introduces the **AI Agent** — a conversational interface for managing your product catalog using natural language. Built on [prism-php/prism](https://github.com/prism-php/prism) for multi-provider AI tool calling, the agent provides 38+ PIM tools that let you search, create, update, delete, bulk edit, export, categorize, generate content and images, plan multi-step workflows, and more — all from a single chat widget.

The agent is accessible from any page in the admin panel via the floating chat widget. It supports Server-Sent Events (SSE) streaming for real-time progress feedback and persists conversation history in the database.

---

## Architecture Overview

The AI Agent package (`Webkul\AiAgent`) follows UnoPim's modular Concord architecture and consists of these core layers:

```
packages/Webkul/AiAgent/
├── src/
│   ├── Chat/               # Agent runner, tool registry, tools, context
│   │   ├── AgentRunner.php       # Prism-based orchestration loop
│   │   ├── ChatContext.php        # Immutable request-scoped DTO
│   │   ├── ToolRegistry.php       # Singleton tool collection
│   │   ├── Contracts/PimTool.php  # Interface all tools implement
│   │   ├── Concerns/             # Reusable traits (ACL, approval)
│   │   └── Tools/                # 38+ individual tool classes
│   ├── Http/Controllers/   # Chat, Conversation, Approval, Dashboard
│   ├── Jobs/               # Auto-enrichment, translation, batch jobs
│   ├── Console/Commands/   # Quality monitor, temp cleanup
│   ├── Listeners/          # Event-driven auto-enrichment trigger
│   ├── Models/             # Eloquent models
│   ├── Repositories/       # Data access layer
│   ├── Services/           # ProductWriterService, EnrichmentService, etc.
│   └── Providers/          # Service provider, tool registration
├── Database/Migration/     # Database schema
└── Routes/                 # Admin routes
```

### Request Flow

1. User sends a message via the chat widget (POST to `/chat/stream`).
2. `ChatController` builds an immutable `ChatContext` DTO from the request.
3. The session lock is released before the LLM call to prevent blocking other requests.
4. `AgentRunner` constructs a Prism request with all registered tools and the system prompt.
5. The LLM autonomously decides which tools to call based on user intent.
6. Prism executes each tool, feeds results back, and iterates until a final text response.
7. SSE events stream progress (tool invocations) and the final response to the client.
8. Token usage is recorded for budget tracking.

---

## Configuration

### Admin Panel Settings

Navigate to **Configuration > General > Magic AI > Agentic PIM** to configure the agent:

| Setting | Config Key | Default | Description |
|---------|-----------|---------|-------------|
| Enable/Disable | `general.magic_ai.agentic_pim.enabled` | `1` | Master toggle for the AI Agent |
| Max Steps | `general.magic_ai.agentic_pim.max_steps` | `5` | Maximum tool-call iterations per request |
| Daily Token Budget | `general.magic_ai.agentic_pim.daily_token_budget` | `500000` | Per-user daily token limit |
| Auto-Enrichment | `general.magic_ai.agentic_pim.auto_enrichment` | `0` | Auto-fill missing fields on product creation |
| Quality Monitor | `general.magic_ai.agentic_pim.quality_monitor` | `0` | Enable scheduled catalog quality scanning |
| Confidence Threshold | `general.magic_ai.agentic_pim.confidence_threshold` | `0.7` | Minimum confidence for auto-actions |
| Approval Mode | `general.magic_ai.agentic_pim.approval_mode` | `auto` | `auto`, `review`, or `suggest` |

### Reading Configuration Values

```php
// Check if the agent is enabled
$enabled = core()->getConfigData('general.magic_ai.agentic_pim.enabled');

// Get the approval mode
$mode = core()->getConfigData('general.magic_ai.agentic_pim.approval_mode');
```

### Seeding Default Configuration

Default values are seeded via the `AgenticPimConfigSeeder`. It only inserts values that do not already exist, so user overrides are preserved:

```bash
php artisan db:seed --class="Webkul\AiAgent\Database\Seeders\AgenticPimConfigSeeder"
```

---

## Tool System

### Overview

The agent's capabilities are defined as individual **tool classes**, each implementing the `PimTool` interface. The LLM autonomously selects which tools to invoke based on the user's natural language request.

### PimTool Interface

Every tool must implement this contract:

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

### Available Tools

The agent ships with 38+ tools organized by category:

| Category | Tools |
|----------|-------|
| **Search & List** | `SearchProducts`, `GetProductDetails`, `ListAttributes`, `ListCategories`, `CategoryTree`, `CatalogSummary`, `FindSimilarProducts` |
| **Create** | `CreateProduct`, `CreateAttribute`, `CreateCategory` |
| **Update** | `UpdateProduct`, `UpdateCategory`, `AssignCategories`, `ManageOptions`, `ManageFamilies`, `ManageChannels`, `ManageUsers`, `ManageRoles` |
| **Delete** | `DeleteProducts` |
| **Bulk Operations** | `BulkEdit` (supports bulk transform: append, prepend, replace) |
| **Content Generation** | `GenerateContent`, `RateContent` |
| **Image Operations** | `GenerateImage`, `AttachImage`, `AnalyzeImage`, `EditImage` |
| **Export & Import** | `ExportProducts`, `ImportProducts` |
| **Quality** | `DataQualityReport`, `VerifyProduct` |
| **Memory & Planning** | `RememberFact`, `RecallMemory`, `PlanTasks` |

### Bulk Transform Operations

The `BulkEdit` tool goes beyond simple value overwrite — it supports **append**, **prepend**, and **replace** operations on existing attribute values. This lets you transform content in bulk without replacing the entire field.

| Operation | Description | Example |
|-----------|-------------|---------|
| `append` | Add text to the end of existing values | Append `-webkul` to all URL keys |
| `prepend` | Add text to the beginning of existing values | Prepend `NEW: ` to all product names |
| `replace` | Find and replace a substring within existing values | Replace `old-brand` with `new-brand` in descriptions |

```
User: "Append '-webkul' to the URL key of all products in the Electronics category"
Agent: (calls bulk_edit with operation="append", value="-webkul", attribute="url_key", filters=...)
```

```
User: "Replace 'Acme Corp' with 'Acme Industries' in all product descriptions"
Agent: (calls bulk_edit with operation="replace", find="Acme Corp", replace="Acme Industries", attribute="description")
```

These transform operations work across any text-based attribute and respect the same ACL permissions and approval modes as standard bulk edits.

### Implementing a Custom Tool

To add a new tool, create a class that implements `PimTool` and register it with the `ToolRegistry`:

```php
namespace App\AiAgent\Tools;

use Prism\Prism\Tool;
use Webkul\AiAgent\Chat\ChatContext;
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;
use Webkul\AiAgent\Chat\Contracts\PimTool;

class MyCustomTool implements PimTool
{
    use ChecksPermission;

    public function register(ChatContext $context): Tool
    {
        return (new Tool)
            ->as('my_custom_tool')
            ->for('Description of what this tool does — the LLM reads this to decide when to call it')
            ->withStringParameter('param1', 'Description of param1')
            ->withNumberParameter('limit', 'Max results (default 10)')
            ->using(function (string $param1, int $limit = 10) use ($context): string {
                // Check ACL permissions before write operations
                if ($denied = $this->denyUnlessAllowed($context, 'catalog.products')) {
                    return $denied;
                }

                // Your tool logic here...

                return json_encode(['result' => ['success' => true, 'data' => $data]]);
            });
    }
}
```

### Registering Custom Tools

Register your tool in a service provider's `boot()` method:

```php
public function boot(): void
{
    $registry = app(\Webkul\AiAgent\Chat\ToolRegistry::class);
    $registry->register(app(\App\AiAgent\Tools\MyCustomTool::class));
}
```

The `ToolRegistry` is a singleton. Third-party packages can resolve it and call `register()` to add tools without modifying any routing or controller code.

### ChatContext DTO

Every tool receives a `ChatContext` — an immutable DTO carrying all request-scoped data:

```php
final class ChatContext
{
    public function __construct(
        public readonly string $message,           // User's text message
        public readonly array $history,             // Conversation history
        public readonly ?int $productId,            // Product being edited (page context)
        public readonly ?string $productSku,        // SKU of the product
        public readonly ?string $productName,       // Name of the product
        public readonly string $locale,             // Active locale (e.g. en_US)
        public readonly string $channel,            // Active channel (e.g. default)
        public readonly MagicAIPlatform $platform,  // AI platform record
        public readonly string $model = '',         // Selected AI model
        public readonly array $uploadedImagePaths = [],
        public readonly array $uploadedFilePaths = [],
        public readonly ?string $currentPage = null,
        public readonly ?Admin $user = null,        // Authenticated admin (for ACL)
    ) {}
}
```

---

## ACL Authorization

All tools enforce role-based access control via the `ChecksPermission` trait. Before executing any write operation, tools call `denyUnlessAllowed()` which checks the authenticated user's permissions through UnoPim's bouncer system:

```php
use Webkul\AiAgent\Chat\Concerns\ChecksPermission;

class UpdateProduct implements PimTool
{
    use ChecksPermission;

    public function register(ChatContext $context): Tool
    {
        return (new Tool)
            ->as('update_product')
            ->for('Update a product...')
            ->using(function (...) use ($context): string {
                // Returns JSON error if user lacks 'catalog.products.edit'
                if ($denied = $this->denyUnlessAllowed($context, 'catalog.products.edit')) {
                    return $denied;
                }

                // Proceed with update...
            });
    }
}
```

If the user lacks the required permission, the tool returns:

```json
{
    "error": "Permission denied: you do not have 'catalog.products.edit' access. Contact your administrator."
}
```

The LLM interprets this response and relays the permission denial to the user in natural language.

---

## Approval Queue

### Approval Modes

The agent supports three approval modes controlled by the `approval_mode` configuration:

| Mode | Behavior |
|------|----------|
| `auto` | Changes are applied immediately (default) |
| `review` | Changes are queued as pending changesets for admin review |
| `suggest` | Changes are suggested only, not executed |

### QueuesForApproval Trait

Write tools use the `QueuesForApproval` trait to check whether changes should be queued:

```php
use Webkul\AiAgent\Chat\Concerns\QueuesForApproval;

class CreateProduct implements PimTool
{
    use ChecksPermission;
    use QueuesForApproval;

    public function register(ChatContext $context): Tool
    {
        return (new Tool)
            ->as('create_product')
            ->for('Create a product...')
            ->using(function (...) use ($context): string {
                if ($this->shouldQueueForApproval()) {
                    return $this->queueChange($context, 'Create product: SKU-123', [
                        'type'           => 'create_product',
                        'data'           => $productData,
                        'affected_count' => 1,
                    ]);
                }

                // Apply directly...
            });
    }
}
```

### Approval Workflow

When `approval_mode` is set to `review`, the `ApprovalController` provides endpoints for managing the queue:

- **List pending** — `GET /ai-agent/approvals` — returns all pending changesets
- **Approve** — `POST /ai-agent/approvals/{id}/approve` — applies the queued change
- **Reject** — `POST /ai-agent/approvals/{id}/reject` — marks the changeset as rolled back

The controller requires the `ai-agent.approvals` ACL permission.

---

## Auto-Enrichment

When enabled, the auto-enrichment feature automatically fills in missing product fields (descriptions, SEO metadata) when a product is created or imported.

### How It Works

1. A product is created or updated.
2. The event listener detects the change and checks if auto-enrichment is enabled.
3. An `AutoEnrichProductJob` is dispatched to the queue.
4. The job uses AI to generate content for missing locale-dependent fields.
5. A cache lock (`auto-enrich:{productId}`) prevents duplicate enrichment.

### Configuration

Enable auto-enrichment in the admin panel:

```
Configuration > General > Magic AI > Agentic PIM > Auto-Enrichment = Yes
```

Or via config:

```php
core()->getConfigData('general.magic_ai.agentic_pim.auto_enrichment');
```

---

## Auto-Translation

When a product is created or updated through the agent, text fields are automatically translated to all configured locales via the `TranslateProductValuesJob`.

### Behavior

- Runs asynchronously on the queue (does not block the user).
- Translates locale-dependent fields: `name`, `description`, `meta_title`, `meta_description`, `meta_keywords`.
- Uses the configured AI provider for translations.
- Retries up to 2 times with a 180-second timeout.

```php
// Dispatched automatically by CreateProduct and UpdateProduct tools
TranslateProductValuesJob::dispatch(
    productId: $product->id,
    sourceLocale: $context->locale,     // e.g. 'en_US'
    fieldsToTranslate: [
        'name'        => 'Leather Wallet',
        'description' => 'Premium leather wallet...',
    ],
    channel: $context->channel,
);
```

---

## AI Translation Command

The `unopim:translate` Artisan command provides a CLI alternative for bulk translating product attribute values across all configured locales using AI providers.

### Running the Command

```bash
php artisan unopim:translate
```

### When to Use

While the Auto-Translation feature (above) handles translations automatically when products are created or updated through the agent, the `unopim:translate` command is designed for:

- **Retroactive translation** — Translate existing products that were created before auto-translation was enabled.
- **Bulk operations** — Translate large batches of products without going through the chat interface.
- **CI/CD pipelines** — Integrate translation into automated deployment or data migration workflows.

The command uses the same AI provider configured under **Magic AI** settings and translates the same locale-dependent fields (`name`, `description`, `meta_title`, `meta_description`, `meta_keywords`).

::: tip
This command is especially useful after a large CSV import where products were loaded in a single locale and need to be translated to all active locales in bulk.
:::

---

## Content Feedback Loop

The `RateContent` tool captures user feedback on AI-generated content quality. This creates a feedback loop that improves future content generation.

### How It Works

1. After the agent generates content, the user can say something like "that description was too formal" or "perfect tone, keep it up."
2. The agent invokes the `rate_content` tool to record the feedback.
3. Feedback is stored as memories with scope `catalog` and keys like `content_feedback:description:negative`.
4. Positive feedback aggregates into a `content_style_preference` memory (last 500 characters).
5. On future requests, these style preferences are injected into the system prompt, guiding the LLM toward the user's preferred tone and style.

---

## Agent Memory System

The agent can remember facts, patterns, and preferences across conversations using two tools:

### RememberFact

Saves an observation for future reference:

```
User: "Remember that all our electronics products should use the 'Tech' category"
Agent: (calls remember_fact with key="electronics_category_rule", value="...", scope="catalog")
```

### RecallMemory

Retrieves relevant memories. Memories are also automatically injected into the system prompt when keywords match.

### Memory Scopes

| Scope | Description |
|-------|-------------|
| `user` | Private to the current admin user |
| `catalog` | Shared catalog knowledge (naming conventions, rules) |
| `global` | System-wide facts |

Memories are stored in the `ai_agent_memories` table with optional expiration dates.

---

## Task Planning

The `PlanTasks` tool decomposes complex, multi-step requests into a structured task plan:

```
User: "Make all our winter collection products market-ready"
Agent: (creates a plan with steps: scan products, fill missing descriptions,
        generate images, assign categories, verify quality)
```

### How It Works

1. The agent creates a parent task of type `planned_workflow`.
2. Individual steps become child tasks of type `planned_step`, each referencing the tool to use.
3. The plan is presented to the user for approval before execution.
4. Tasks are tracked in the `ai_agent_tasks` table with status, priority, and progress fields.

---

## Configurable Product Support

The agent can create configurable products with variants via natural language:

```
User: "Create a configurable T-shirt in Red, Blue, Green with sizes S, M, L, XL"
```

The `CreateProduct` tool accepts these parameters for configurable products:

| Parameter | Description |
|-----------|-------------|
| `product_type` | Set to `"configurable"` |
| `super_attributes` | Comma-separated attribute codes defining variants (e.g. `"color,size"`) |
| `variants_json` | JSON array of variant objects with unique attribute combinations |

### Example Variant JSON

```json
[
    {"sku": "TSHIRT-RED-S", "color": "Red", "size": "S", "price": 29.99},
    {"sku": "TSHIRT-RED-M", "color": "Red", "size": "M", "price": 29.99},
    {"sku": "TSHIRT-BLUE-S", "color": "Blue", "size": "S", "price": 29.99},
    {"sku": "TSHIRT-BLUE-M", "color": "Blue", "size": "M", "price": 29.99}
]
```

---

## AI-Powered Search

The AI Agent includes semantic search services that go beyond traditional keyword matching, enabling natural language queries to find relevant products.

### EmbeddingSimilarityService

The `EmbeddingSimilarityService` provides vector-based semantic similarity matching. It converts product attributes and search queries into embeddings, then computes cosine similarity to find products that are conceptually related — even when they share no keywords.

```
User: "Find products similar to our premium leather messenger bag"
Agent: (uses embedding similarity to surface related bags, briefcases, and leather accessories)
```

This service powers the `FindSimilarProducts` tool, allowing the agent to discover products by meaning rather than exact text matches.

### SemanticRankingService

The `SemanticRankingService` builds on embedding similarity to provide intelligent product discovery and ranking. It scores and orders search results by semantic relevance, ensuring the most contextually appropriate products appear first.

Together, these services enable queries like:

- *"Show me eco-friendly packaging alternatives"* — finds products tagged with sustainability attributes even if "eco-friendly" is not in the name.
- *"Which products compete with SKU-1234?"* — surfaces products with similar attributes and positioning.
- *"Find all winter clothing suitable for outdoor activities"* — matches across categories using contextual understanding.

::: tip
Semantic search requires a configured AI provider with embedding support. The services use the same provider configured under **Magic AI** settings.
:::

---

## Catalog Quality Monitor

A scheduled Artisan command that scans your catalog for data quality issues.

### Running the Command

```bash
php artisan ai-agent:quality-monitor

# With options
php artisan ai-agent:quality-monitor --channel=default --locale=en_US --limit=500
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--channel` | `default` | Channel to check |
| `--locale` | `en_US` | Locale to check |
| `--limit` | `500` | Maximum products to scan |

### Scheduling

Add the command to your Laravel scheduler for automated monitoring:

```php
// In your console kernel or scheduler
Schedule::command('ai-agent:quality-monitor')->daily();
```

The command checks for:
- Missing product names
- Missing descriptions
- Missing images
- Missing category assignments
- Short/inadequate descriptions

Results are stored as notifications accessible via the dashboard.

::: warning
Both the `enabled` and `quality_monitor` configuration toggles must be active for the command to run. If either is disabled, the command exits gracefully.
:::

---

## Database Schema

The AI Agent package creates the following tables:

### `ai_agent_token_usage`

Per-user daily token tracking for budget enforcement.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `user_id` | int (nullable) | FK to `admins` |
| `usage_date` | date | Date of usage |
| `tokens_used` | bigint | Tokens consumed |
| `request_count` | int | Number of requests |

Unique constraint on `(user_id, usage_date)`.

### `ai_agent_conversations`

Persistent chat sessions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `user_id` | int | FK to `admins` (cascading delete) |
| `title` | varchar(255) | Conversation title |
| `metadata` | json (nullable) | Additional metadata |

### `ai_agent_messages`

Individual messages within conversations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `conversation_id` | bigint | FK to `ai_agent_conversations` |
| `role` | enum | `user`, `assistant`, or `system` |
| `content` | longtext | Message content |
| `tool_calls` | json (nullable) | Tool invocations made |
| `tokens_used` | int | Tokens consumed by this message |

### `ai_agent_memories`

Persistent agent memory for facts and preferences.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `user_id` | int (nullable) | FK to `admins` |
| `scope` | enum | `user`, `product`, `catalog`, or `global` |
| `key` | varchar(255) | Memory key/label |
| `value` | text | The stored fact or preference |
| `expires_at` | timestamp (nullable) | Optional expiration |

### `ai_agent_changesets`

Change tracking for the approval queue and rollback capability.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `user_id` | int (nullable) | FK to `admins` |
| `description` | varchar(500) | Human-readable description |
| `changes` | json | The change data (tool-specific structure) |
| `status` | enum | `pending`, `applied`, or `rolled_back` |
| `affected_count` | int | Number of affected records |
| `applied_at` | timestamp (nullable) | When the change was applied |
| `rolled_back_at` | timestamp (nullable) | When the change was rolled back |

### `ai_agent_tasks`

Task planning and decomposition.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `type` | varchar(100) | Task type (e.g. `planned_workflow`, `planned_step`) |
| `status` | enum | `pending`, `running`, `completed`, `failed`, `paused` |
| `priority` | enum | `low`, `normal`, `high`, `critical` |
| `config` | json (nullable) | Task configuration |
| `result` | json (nullable) | Execution result |
| `progress` | tinyint | Progress percentage (0-100) |
| `parent_task_id` | bigint (nullable) | FK to parent task (self-referencing) |
| `created_by` | int (nullable) | FK to `admins` |
| `scheduled_at` | timestamp (nullable) | When to execute |
| `started_at` | timestamp (nullable) | When execution started |
| `completed_at` | timestamp (nullable) | When execution completed |
| `error` | text (nullable) | Error message if failed |

---

## Security

### ACL on Every Tool

All 38+ tools check user permissions via the `ChecksPermission` trait before executing write operations. Read-only tools like `SearchProducts` check `catalog.products`, while write tools check specific permissions like `catalog.products.create` or `catalog.products.edit`.

### Rate Limiting

Chat endpoints are rate-limited using Laravel's throttle middleware:

```php
Route::post('chat', [ChatController::class, 'send'])
    ->middleware('throttle:30,1')   // 30 requests per minute
    ->name('chat.send');

Route::post('chat/stream', [ChatController::class, 'stream'])
    ->middleware('throttle:30,1')
    ->name('chat.stream');
```

### Input Validation

The `ChatContext` constructor validates locale and channel codes against a strict pattern to prevent injection in JSON_EXTRACT SQL paths:

```php
if (! preg_match('/^[a-zA-Z0-9_-]+$/', $locale)) {
    throw new \InvalidArgumentException('Invalid locale code');
}
```

### Session Lock Release

Before making blocking LLM calls (which can take 30-120 seconds), the controller releases the session lock so other admin requests are not blocked:

```php
if (session()->isStarted()) {
    session()->save();
}
```

### Token Budget Enforcement

Each user's daily token consumption is tracked in the `ai_agent_token_usage` table. When the configured `daily_token_budget` is reached, further requests are denied until the next day.

---

## API Endpoints

All endpoints are prefixed with `/{admin_url}/ai-agent/` and require the `admin` middleware.

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send a chat message (blocking JSON response) |
| `POST` | `/chat/stream` | Send a chat message with SSE streaming |
| `GET` | `/chat/magic-ai-config` | Get current Magic AI configuration |

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/conversations` | List all conversations for the current user |
| `GET` | `/conversations/{id}` | Get a specific conversation with messages |
| `POST` | `/conversations` | Create a new conversation |
| `DELETE` | `/conversations/{id}` | Delete a conversation |

### Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/analytics` | Token usage and activity analytics |
| `GET` | `/dashboard/audit-trail` | List applied changesets (audit log) |
| `POST` | `/dashboard/rollback/{id}` | Rollback an applied changeset |
| `GET` | `/dashboard/notifications` | Get quality monitor notifications |
| `POST` | `/dashboard/notifications/{id}/dismiss` | Dismiss a notification |

### Agents (Configuration)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/agents` | List configured agents |
| `GET` | `/agents/create` | Create agent form |
| `POST` | `/agents` | Store a new agent |
| `GET` | `/agents/{id}/edit` | Edit agent form |
| `PUT` | `/agents/{id}` | Update an agent |
| `DELETE` | `/agents/{id}` | Delete an agent |

---

## Streaming (SSE)

The `/chat/stream` endpoint returns a `StreamedResponse` with Server-Sent Events. The client receives real-time updates as the agent works:

### Event Types

| Event | Description |
|-------|-------------|
| `status` | Progress indicator (e.g. "Thinking...", "Searching products...") |
| `tool_call` | A tool is being invoked (includes tool name) |
| `text` | Streamed text chunk from the final response |
| `done` | Final event with complete response data |
| `error` | Error event if something fails |

### Client-Side Example

```javascript
const eventSource = new EventSource('/admin/ai-agent/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message: 'Show me all active products',
        locale: 'en_US',
        channel: 'default',
    }),
});

eventSource.addEventListener('status', (e) => {
    console.log('Status:', JSON.parse(e.data).message);
});

eventSource.addEventListener('text', (e) => {
    // Append streamed text to the chat UI
    appendText(JSON.parse(e.data).chunk);
});

eventSource.addEventListener('done', (e) => {
    const result = JSON.parse(e.data);
    eventSource.close();
});
```

---

## Extending the Agent

### Adding Tools from a Third-Party Package

The tool system is fully extensible. Any Concord package can register additional tools without modifying the AI Agent package:

1. Create a class implementing `Webkul\AiAgent\Chat\Contracts\PimTool`.
2. In your package's service provider, resolve `ToolRegistry` and call `register()`.

```php
namespace MyPackage\Providers;

use Illuminate\Support\ServiceProvider;
use Webkul\AiAgent\Chat\ToolRegistry;

class MyPackageServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        if (class_exists(ToolRegistry::class)) {
            $registry = app(ToolRegistry::class);
            $registry->register(app(\MyPackage\Tools\SyncInventory::class));
            $registry->register(app(\MyPackage\Tools\CheckWarehouse::class));
        }
    }
}
```

### Tool Best Practices

- **Return JSON strings** — All tool callbacks must return a `string` (JSON-encoded). The LLM parses the JSON to compose its response.
- **Check permissions first** — Use the `ChecksPermission` trait for any tool that modifies data.
- **Support approval mode** — Use the `QueuesForApproval` trait on write tools so they respect the configured approval mode.
- **Keep tools focused** — Each tool should do one thing well. The LLM can chain multiple tools for complex workflows.
- **Write descriptive `->for()` strings** — The LLM uses this description to decide when to call your tool. Be specific about what it does and when to use it.
