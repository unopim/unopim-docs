# MagicAI Platform Management

## Introduction

UnoPim uses a unified multi-platform AI provider architecture. Instead of individual service classes for each provider, a single **LaravelAiAdapter** bridges every supported AI provider through the [`laravel/ai`](https://github.com/laravel/ai) SDK (`^0.9.1`).

Credentials are now managed via a dedicated database table (`magic_ai_platforms`) with encrypted API key storage, replacing the previous configuration-file approach. Administrators can add, test, and switch between providers entirely from the admin panel.

---

## Supported Providers

UnoPim ships with support for the following AI providers out of the box:

| Provider                     | Slug         | Text Generation | Image Generation |
| ----------------------------- | ------------ | :-------------: | :--------------: |
| OpenAI                        | `openai`     | Yes             | Yes              |
| Anthropic                     | `anthropic`  | Yes             | No               |
| Google Gemini                 | `gemini`     | Yes             | Yes              |
| Groq                          | `groq`       | Yes             | No               |
| Ollama                        | `ollama`     | Yes             | No               |
| xAI (Grok)                   | `xai`        | Yes             | Yes              |
| Mistral                       | `mistral`    | Yes             | No               |
| DeepSeek                      | `deepseek`   | Yes             | No               |
| Azure OpenAI                  | `azure`      | Yes             | No               |
| OpenRouter                    | `openrouter` | Yes             | No               |
| Custom (OpenAI-compatible)    | `custom`     | Yes             | No               |

::: tip
Image generation is currently supported by OpenAI, Gemini, and xAI. Attempting to generate images with an unsupported provider will throw a `RuntimeException`.
:::

---

## Custom Provider (OpenAI-Compatible)

::: info Added in v2.1.0
The **Custom** provider lets you connect any OpenAI-compatible AI service — such as Cerebras, Together, Fireworks, or a self-hosted gateway — without writing a new provider class.
:::

When you select **Custom (OpenAI-compatible)** as the provider, the `LaravelAiAdapter` routes requests through the SDK's Groq lab. That lab posts to the legacy `/chat/completions` endpoint, which is the de-facto standard that virtually every OpenAI-compatible third-party service implements, so any service exposing a `/chat/completions` API works without further code changes.

### Configuring a Custom Provider

1. From **Platform Management**, click **Add Platform**.
2. Set **Provider** to **Custom (OpenAI-compatible)**.
3. Enter the service's **API URL** — this is **required** for the custom provider, since there is no default endpoint. Point it at the base URL of the OpenAI-compatible API (e.g. `https://api.together.xyz/v1`).
4. Enter the **API Key** issued by your provider (stored encrypted).
5. Add the **Models** you intend to use. Custom providers do not auto-discover models — the `fetchCustomModels()` routine returns an empty list when the API does not expose a models endpoint, so enter the model identifiers manually as a comma-separated list.
6. Save the platform.

![MagicAI custom provider configuration form](/assets/2.1/images/magic-ai-custom-provider-form.png)

### How the Custom Base URL Is Applied

At runtime, when a platform has an `api_url` set, the adapter dynamically overrides the SDK's base URL:

```php
config(["ai.providers.{$configKey}.url" => $this->platform->api_url]);
```

This keeps the custom endpoint scoped to the request and avoids any global configuration or `.env` changes.

::: warning
The custom provider is text-only — `supportsImages()` returns `false` for the `custom` slug. Use OpenAI, Gemini, or xAI for image generation.
:::

---

## Architecture Changes from v1.0.x

### Before (v1.0.x)

In v1.0.x, each AI provider had its own service class — these classes no longer exist:

```
Webkul\MagicAI\Services\OpenAI
Webkul\MagicAI\Services\Gemini
Webkul\MagicAI\Services\Groq
Webkul\MagicAI\Services\Ollama
```

Provider credentials were stored in Laravel config files, and switching providers required code or `.env` changes.

### After

All provider logic is consolidated into a single adapter:

```
Webkul\MagicAI\Services\LaravelAiAdapter
```

This adapter:

- Implements the `Webkul\MagicAI\Contracts\LLMModelInterface` contract.
- Uses the **Laravel AI SDK** (`laravel/ai`) for text generation, with full control over temperature, max tokens, and system prompts.
- Uses the same SDK's `Image::of()` for image generation.
- Reads credentials from the `magic_ai_platforms` database table at runtime.

### Key Components

| Component | Namespace / Location |
| --------- | -------------------- |
| Adapter service | `Webkul\MagicAI\Services\LaravelAiAdapter` |
| Contract interface | `Webkul\MagicAI\Contracts\LLMModelInterface` |
| Provider enum | `Webkul\MagicAI\Enums\AiProvider` |
| Platform model | `Webkul\MagicAI\Models\MagicAIPlatform` |
| Platform repository | `Webkul\MagicAI\Repository\MagicAIPlatformRepository` |
| Model recommender | `Webkul\MagicAI\Support\ModelRecommender` |
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

### Fetching Available Models

Click **Fetch Models** to query the provider's API for all available models. The results are passed through the `ModelRecommender`, whose `recommend()` method strips out model families that are not useful for chat or image generation — embeddings, speech, moderation, legacy completion bases, and dated snapshots — and returns the rest as suggested options for the **Models** field. If filtering removes everything, the original list is returned unchanged so the field is never empty.

::: tip
The Custom (OpenAI-compatible) provider does not support model discovery — **Fetch Models** returns an empty list when the API has no models endpoint. Enter the model identifiers manually instead.
:::

### Setting a Default Platform

Only one platform can be the default at a time. When a new platform is set as default, all other platforms are automatically unset. The default platform is used for all MagicAI operations (content generation, translation, etc.).

---

## Features

### Text Generation

The adapter calls the SDK directly for text generation, providing:

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

**After:**

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

### Generating Images

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
| `toLab()` | Maps to `Laravel\Ai\Enums\Lab` |
| `fetchModels()` | Fetches available models from the provider API |
| `options()` | Returns an array suitable for dropdown menus |

---

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| "Provider does not support image generation" | Using Anthropic, Groq, Custom, etc. for images | Switch to OpenAI, Gemini, or xAI |
| Connection test times out | Network or incorrect API URL | Verify `api_url` and network access |
| Invalid model names error | Model string contains invalid characters | Use alphanumeric names with hyphens, dots, colons, or slashes |
| Encrypted key read error | `APP_KEY` changed after platform was saved | Re-enter the API key and save again |
| Custom provider request fails with a 404 | The API URL does not point at the base of an OpenAI-compatible API | Set **API URL** to the base path that exposes `/chat/completions` (e.g. `https://api.together.xyz/v1`) |
| **Fetch Models** returns nothing for a Custom provider | The custom API does not expose a models endpoint | Enter the model identifiers manually in the **Models** field |
