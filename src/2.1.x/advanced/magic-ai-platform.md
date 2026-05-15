# MagicAI Platform Management

## Introduction

UnoPim v2.0.0 introduces a unified multi-platform AI provider architecture. Instead of individual service classes for each provider, a single **LaravelAiAdapter** bridges all supported AI providers through the `laravel/ai` ^0.3.2 SDK and the Prism library.

Credentials are now managed via a dedicated database table (`magic_ai_platforms`) with encrypted API key storage, replacing the previous configuration-file approach. Administrators can add, test, and switch between providers entirely from the admin panel.

---

## Supported Providers

UnoPim v2.0.0 ships with support for the following AI providers out of the box:

| Provider       | Slug         | Text Generation | Image Generation |
| -------------- | ------------ | :-------------: | :--------------: |
| OpenAI         | `openai`     | Yes             | Yes              |
| Anthropic      | `anthropic`  | Yes             | No               |
| Google Gemini  | `gemini`     | Yes             | Yes              |
| Groq           | `groq`       | Yes             | No               |
| Ollama         | `ollama`     | Yes             | No               |
| xAI (Grok)    | `xai`        | Yes             | Yes              |
| Mistral        | `mistral`    | Yes             | No               |
| DeepSeek       | `deepseek`   | Yes             | No               |
| Azure OpenAI   | `azure`      | Yes             | No               |
| OpenRouter     | `openrouter` | Yes             | No               |

::: tip
Image generation is currently supported by OpenAI, Gemini, and xAI. Attempting to generate images with an unsupported provider will throw a `RuntimeException`.
:::

---

## Architecture Changes from v1.0.x

### Before (v1.0.x)

In v1.0.x, each AI provider had its own service class:

```
Webkul\MagicAI\Services\OpenAI
Webkul\MagicAI\Services\Gemini
Webkul\MagicAI\Services\Groq
Webkul\MagicAI\Services\Ollama
```

Provider credentials were stored in Laravel config files, and switching providers required code or `.env` changes.

### After (v2.0.0)

All provider logic is consolidated into a single adapter:

```
Webkul\MagicAI\Services\LaravelAiAdapter
```

This adapter:

- Implements the `Webkul\MagicAI\Contracts\LLMModelInterface` contract.
- Uses **Prism** (`echolabsdev/prism`) for text generation with full control over temperature, max tokens, and system prompts.
- Uses **Laravel AI SDK** (`laravel/ai`) `Image::of()` for image generation.
- Reads credentials from the `magic_ai_platforms` database table at runtime.

### Key Components

| Component | Namespace / Location |
| --------- | -------------------- |
| Adapter service | `Webkul\MagicAI\Services\LaravelAiAdapter` |
| Contract interface | `Webkul\MagicAI\Contracts\LLMModelInterface` |
| Provider enum | `Webkul\MagicAI\Enums\AiProvider` |
| Platform model | `Webkul\MagicAI\Models\MagicAIPlatform` |
| Platform repository | `Webkul\MagicAI\Repository\MagicAIPlatformRepository` |
| Admin controller | `Webkul\Admin\Http\Controllers\MagicAI\MagicAIPlatformController` |
| DataGrid | `Webkul\Admin\DataGrids\MagicAI\MagicAIPlatformDataGrid` |

---

## Database Schema

The `magic_ai_platforms` table stores provider configurations:

| Column       | Type          | Description |
| ------------ | ------------- | ----------- |
| `id`         | `bigint` (PK) | Auto-incrementing identifier |
| `label`      | `string`      | Human-readable name (e.g., "Production OpenAI") |
| `provider`   | `string(50)`  | Provider slug (e.g., `openai`, `anthropic`) |
| `api_url`    | `string(500)` | Custom API endpoint URL (nullable) |
| `api_key`    | `text`        | API key, stored with Laravel's `encrypted` cast |
| `models`     | `text`        | Comma-separated list of model identifiers |
| `extras`     | `json`        | Additional provider-specific configuration (nullable) |
| `is_default` | `boolean`     | Whether this is the default platform |
| `status`     | `boolean`     | Whether the platform is active |
| `created_at` | `timestamp`   | Creation timestamp |
| `updated_at` | `timestamp`   | Last update timestamp |

::: warning
The `api_key` column uses Laravel's `encrypted` cast, meaning values are automatically encrypted at rest and decrypted when accessed. The key is also hidden from JSON serialization via the model's `$hidden` property.
:::

---

## Configuration via Admin Panel

Navigate to **Configuration > MagicAI > Platform Management** in the admin panel.

### Adding a Platform

1. Click **Add Platform**.
2. Fill in the required fields:
   - **Label** -- A descriptive name for this configuration.
   - **Provider** -- Select from the dropdown (OpenAI, Anthropic, Gemini, etc.).
   - **API Key** -- Your provider API key (stored encrypted).
   - **API URL** -- Override the default endpoint if needed (useful for Azure or self-hosted Ollama).
   - **Models** -- Comma-separated model identifiers (e.g., `gpt-4o, gpt-4o-mini`).
   - **Extras** -- Optional JSON for provider-specific settings.
3. Toggle **Status** to enable the platform.
4. Toggle **Set as Default** to make it the primary platform for AI operations.

### Testing a Connection

Before saving, use the **Test Connection** button. This sends a minimal prompt (`Say OK`) to the first model in the list and verifies the provider responds successfully.

### Fetching Available Models

Click **Fetch Models** to query the provider's API for all available models. The system will also suggest recommended models based on the provider.

### Setting a Default Platform

Only one platform can be the default at a time. When a new platform is set as default, all other platforms are automatically unset. The default platform is used for all MagicAI operations (content generation, translation, etc.).

---

## Features

### Text Generation

The adapter uses Prism directly for text generation, providing:

- Configurable **temperature** (0.0 -- 1.0)
- Configurable **max tokens** (automatically increased for reasoning models like o1, o3)
- Optional **system prompt** for context setting
- 120-second timeout for long-running requests

### Image Generation

Image generation uses Laravel AI SDK's `Image::of()` API with support for:

- **Size mapping**: `1024x1024` (1:1), `1024x1792` (2:3), `1792x1024` (3:2)
- **Quality levels**: `standard` (medium) and `hd` (high)
- Returns base64-encoded data URIs

### AI Content Generation

MagicAI generates product content including:

- Product descriptions and short descriptions
- SEO meta titles and descriptions
- Feature bullet points
- Custom prompt-based content

### Product Value Translation

Use AI to translate product attribute values across locales. The system sends the source text with a translation prompt and writes the result back to the target locale.

---

## Migration Guide

### Updating Custom Code

If you previously used the individual provider service classes, you must update your code to use the unified adapter.

**Before (v1.0.x):**

```php
use Webkul\MagicAI\Services\OpenAI;

$service = new OpenAI();
$response = $service->ask('Generate a product description for...');
```

**After (v2.0.0):**

```php
use Webkul\MagicAI\Models\MagicAIPlatform;
use Webkul\MagicAI\Services\LaravelAiAdapter;

// Fetch the default platform
$platform = MagicAIPlatform::default()->active()->firstOrFail();

$adapter = new LaravelAiAdapter(
    platform: $platform,
    model: $platform->model_list[0],    // First model from the platform
    prompt: 'Generate a product description for...',
    temperature: 0.7,
    maxTokens: 1054,
    systemPrompt: 'You are a product copywriter.',
);

$response = $adapter->ask();
```

### Generating Images (v2.0.0)

```php
$adapter = new LaravelAiAdapter(
    platform: $platform,
    model: 'gpt-image-1',
    prompt: 'A professional product photo of a leather handbag',
);

$images = $adapter->images([
    'size'    => '1024x1024',
    'quality' => 'hd',
]);

// $images[0]['url'] contains a base64 data URI
```

### Database Migration

The migration `2026_03_20_000001_create_magic_ai_platforms_table` creates the new table. A companion migration `2026_03_20_000002_migrate_magic_ai_config_to_platforms` automatically migrates existing configuration-based credentials into the new database table.

Run the standard migration command:

```bash
php artisan migrate
```

---

## The LLMModelInterface Contract

All AI adapter implementations must satisfy the `LLMModelInterface` contract:

```php
namespace Webkul\MagicAI\Contracts;

interface LLMModelInterface
{
    public function ask(): string;

    public function images(array $options): array;
}
```

- **`ask()`** -- Sends the prompt to the provider and returns the generated text.
- **`images(array $options)`** -- Generates images and returns an array of `['url' => '...']` entries.

---

## The AiProvider Enum

The `Webkul\MagicAI\Enums\AiProvider` backed enum provides utility methods for each provider:

| Method | Description |
| ------ | ----------- |
| `label()` | Human-readable provider name |
| `configKey()` | Laravel config key for the provider |
| `defaultUrl()` | Default API base URL |
| `supportsImages()` | Whether the provider supports image generation |
| `toPrismProvider()` | Maps to `Prism\Prism\Enums\Provider` |
| `toLab()` | Maps to `Laravel\Ai\Enums\Lab` |
| `fetchModels()` | Fetches available models from the provider API |
| `options()` | Returns an array suitable for dropdown menus |

---

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| "Provider does not support image generation" | Using Anthropic, Groq, etc. for images | Switch to OpenAI, Gemini, or xAI |
| Connection test times out | Network or incorrect API URL | Verify `api_url` and network access |
| Invalid model names error | Model string contains invalid characters | Use alphanumeric names with hyphens, dots, colons, or slashes |
| Encrypted key read error | `APP_KEY` changed after platform was saved | Re-enter the API key and save again |
