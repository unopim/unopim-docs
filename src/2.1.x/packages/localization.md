# Translations

## Introduction

UnoPim supports **33 locales** out of the box, and every user-facing string must be translated — never hardcoded. The translation system is built on Laravel's localization features, with additional tooling for auditing, fixing, and AI-powered translation.

This guide covers everything you need to know:

- **Package developers** — how to add translations to your package
- **Native translators** — how to contribute translations without writing code
- **Developers** — how to use the Artisan command to audit and auto-translate

## Supported Locales

UnoPim ships with the following 33 locales:

| Code | Language | Code | Language | Code | Language |
|------|----------|------|----------|------|----------|
| `ar_AE` | Arabic | `fr_FR` | French | `pl_PL` | Polish |
| `ca_ES` | Catalan | `hi_IN` | Hindi | `pt_BR` | Brazilian Portuguese |
| `da_DK` | Danish | `hr_HR` | Croatian | `pt_PT` | Portuguese |
| `de_DE` | German | `id_ID` | Indonesian | `ro_RO` | Romanian |
| `en_AU` | English (Australia) | `it_IT` | Italian | `ru_RU` | Russian |
| `en_GB` | English (UK) | `ja_JP` | Japanese | `sv_SE` | Swedish |
| `en_NZ` | English (NZ) | `ko_KR` | Korean | `tl_PH` | Filipino |
| `en_US` | English (US) | `mn_MN` | Mongolian | `tr_TR` | Turkish |
| `es_ES` | Spanish | `nl_NL` | Dutch | `uk_UA` | Ukrainian |
| `es_VE` | Spanish (Venezuela) | `no_NO` | Norwegian | `vi_VN` | Vietnamese |
| `fi_FI` | Finnish | | | `zh_CN` | Simplified Chinese |
| | | | | `zh_TW` | Traditional Chinese |

**`en_US` is the canonical (source) locale.** All other locales are compared against it.

## Translation File Structure

Each UnoPim package stores its translations in the `Resources/lang` directory:

```
packages/Webkul/Example/src/
└── Resources
    └── lang
        ├── en_US
        │   └── app.php
        ├── fr_FR
        │   └── app.php
        ├── de_DE
        │   └── app.php
        └── ... (all 33 locales)
```

Each `app.php` file returns a nested associative array:

```php
<?php

return [
    'admin' => [
        'title'   => 'Dashboard',
        'welcome' => 'Welcome, :name!',
    ],
];
```

## Creating Translations for Your Package

### Step 1: Create the Language Directory

Navigate to your package's `Resources` directory and create the `lang` folder with locale subdirectories:

```
packages/Webkul/YourPackage/src/Resources/lang/
├── en_US/
│   └── app.php
├── fr_FR/
│   └── app.php
└── ... (all 33 locales)
```

### Step 2: Define English (en_US) Translations First

Always start with `en_US` — this is the canonical source for all other locales.

```php
<?php

// packages/Webkul/YourPackage/src/Resources/lang/en_US/app.php

return [
    'credentials' => [
        'title'          => 'Credentials',
        'create-btn'     => 'Add Credential',
        'save-success'   => 'Credential :name saved successfully.',
        'delete-confirm' => 'Are you sure you want to delete this credential?',
    ],
];
```

### Step 3: Register Translations in the Service Provider

In your package's `ServiceProvider`, load translations in the `boot` method:

```php
<?php

namespace Webkul\YourPackage\Providers;

use Illuminate\Support\ServiceProvider;

class YourPackageServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadTranslationsFrom(
            __DIR__ . '/../Resources/lang',
            'your-package'
        );
    }
}
```

### Step 4: Translate Into All 33 Locales

Every key in `en_US/app.php` must exist in all 33 locale files. Translate values naturally into each language:

```php
<?php

// packages/Webkul/YourPackage/src/Resources/lang/fr_FR/app.php

return [
    'credentials' => [
        'title'          => 'Identifiants',
        'create-btn'     => 'Ajouter un identifiant',
        'save-success'   => 'Identifiant :name enregistré avec succès.',
        'delete-confirm' => 'Êtes-vous sûr de vouloir supprimer cet identifiant ?',
    ],
];
```

::: warning Important Rules
- **Placeholders** like `:name`, `:count`, `:attribute` must **never** be translated — keep them exactly as-is.
- **Translate naturally** — values should read idiomatically in the target language, not word-for-word.
- **Do not copy English** — every locale must have actual translations, not English text copied as-is.
:::

### Step 5: Use Translations in Your Code

In **Blade templates**:

```html
<!-- Using @lang directive -->
@lang('your-package::app.credentials.title')

<!-- Using trans() helper -->
{{ trans('your-package::app.credentials.save-success', ['name' => $credential->name]) }}

<!-- Using __() helper -->
{{ __('your-package::app.credentials.delete-confirm') }}
```

In **PHP code** (controllers, repositories, etc.):

```php
// Simple translation
$message = trans('your-package::app.credentials.save-success', [
    'name' => $credential->name,
]);

// In JSON responses
return new JsonResponse([
    'message' => trans('your-package::app.credentials.save-success', [
        'name' => $credential->name,
    ]),
]);
```

## Contributing Translations (For Native Translators)

You don't need to be a developer to contribute translations to UnoPim. If you're a native speaker of any supported language, here's how to help:

### What to Translate

Translation files are PHP arrays located at:

```
packages/Webkul/{PackageName}/src/Resources/lang/{locale}/app.php
```

The main packages that need translations are:

| Package | Path | Description |
|---------|------|-------------|
| **Admin** | `packages/Webkul/Admin/src/Resources/lang/` | Admin panel UI (largest) |
| **Installer** | `packages/Webkul/Installer/src/Resources/lang/` | Installation wizard |
| **Core** | `packages/Webkul/Core/src/Resources/lang/` | Core framework strings |
| **DataTransfer** | `packages/Webkul/DataTransfer/src/Resources/lang/` | Import/Export |
| **Product** | `packages/Webkul/Product/src/Resources/lang/` | Product management |
| **Webhook** | `packages/Webkul/Webhook/src/Resources/lang/` | Webhook management |
| **Completeness** | `packages/Webkul/Completeness/src/Resources/lang/` | Data quality scoring |

### How to Contribute

1. **Fork** the [UnoPim repository](https://github.com/unopim/unopim) on GitHub
2. **Find your locale** folder (e.g., `fr_FR` for French)
3. **Open `app.php`** and compare it with the `en_US/app.php` file in the same package
4. **Translate** any values that are still in English
5. **Submit a Pull Request** with your translations

### Translation Guidelines

- **Compare with `en_US`** — the English file is the source of truth
- **Keep the same array structure** — don't add, remove, or reorder keys
- **Preserve placeholders** — `:name`, `:count`, `:attribute` must stay as-is
- **Preserve formatting** — keep `--`, `...`, brackets, and other formatting characters
- **Translate naturally** — use idioms and phrasing natural to your language
- **Don't translate technical terms** — words like "API", "URL", "JSON", "CSV" stay in English

### Example

English source (`en_US/app.php`):

```php
'save-success' => 'Product :name created successfully.',
```

Good French translation (`fr_FR/app.php`):

```php
'save-success' => 'Produit :name créé avec succès.',
```

Bad translation (don't do this):

```php
// DON'T copy English
'save-success' => 'Product :name created successfully.',

// DON'T translate placeholders
'save-success' => 'Produit :nom créé avec succès.',
```

## Translation Audit Command

UnoPim includes a powerful Artisan command to audit and fix translations across all packages and locales.

### Basic Audit

Run the translation audit to check all locales against `en_US`:

```bash
php artisan unopim:translations:check
```

This checks for:
- **Missing keys** — keys in `en_US` that are absent from a locale
- **Orphan keys** — keys in a locale that don't exist in `en_US`
- **Parse errors** — PHP syntax errors in translation files

### Audit a Single Locale or Package

```bash
# Check only French
php artisan unopim:translations:check --locale=fr_FR

# Check only the Admin package
php artisan unopim:translations:check --package=Admin

# Combine both
php artisan unopim:translations:check --locale=fr_FR --package=Admin
```

### Detailed Diagnostics

```bash
# Show per-file, per-key details
php artisan unopim:translations:check --details

# Output as JSON (for CI pipelines)
php artisan unopim:translations:check --json
```

### Quality Checks

```bash
# Check placeholder consistency (:name, :count, etc.)
php artisan unopim:translations:check --placeholder-check

# Find empty translation values
php artisan unopim:translations:check --empty-values

# Find keys where locale value is identical to en_US (likely untranslated)
php artisan unopim:translations:check --untranslated

# Check key ordering matches en_US
php artisan unopim:translations:check --sort-check

# Check HTML tag consistency
php artisan unopim:translations:check --html-check

# Enable ALL quality checks at once
php artisan unopim:translations:check --strict

# Show translation coverage percentage per locale
php artisan unopim:translations:check --coverage
```

### Fix Missing Keys (Copy English)

The `--fix` flag adds missing keys and removes orphan keys. By default, absent keys are filled with the English (`en_US`) value:

```bash
php artisan unopim:translations:check --fix
```

This is useful for structural reconciliation — ensuring all locales have the same keys — but the values will be in English and need manual translation.

## AI-Powered Translation

UnoPim can automatically translate missing or untranslated values using AI. This requires a configured AI platform (OpenAI, Groq, Gemini, etc.).

### Prerequisites

You need an AI platform configured in UnoPim:

1. **Get an API key** from your AI provider (e.g., [OpenAI](https://platform.openai.com/api-keys))
2. **Add the key to `.env`**:

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

3. **Configure the platform** in the UnoPim Admin panel:
   - Go to **Configuration > Magic AI > Platforms**
   - Click **Add Platform**
   - Select your provider (e.g., OpenAI)
   - Enter your API key
   - Select a model (e.g., `gpt-4o-mini`)
   - Set as **Default** and **Active**

Alternatively, configure via Artisan tinker:

```bash
php artisan tinker
```

```php
app(\Webkul\MagicAI\Repository\MagicAIPlatformRepository::class)->create([
    'label'      => 'OpenAI',
    'provider'   => 'openai',
    'api_url'    => 'https://api.openai.com/v1',
    'api_key'    => env('OPENAI_API_KEY'),
    'models'     => 'gpt-4o-mini',
    'is_default' => true,
    'status'     => true,
]);
```

### Supported AI Providers

| Provider | Enum Value | Notes |
|----------|-----------|-------|
| OpenAI | `openai` | GPT-4o, GPT-4o-mini recommended |
| Anthropic | `anthropic` | Claude models |
| Google Gemini | `gemini` | Gemini Pro/Flash |
| Groq | `groq` | Fast inference |
| Ollama | `ollama` | Local/self-hosted models |
| xAI | `xai` | Grok models |
| Mistral | `mistral` | Mistral/Mixtral |
| DeepSeek | `deepseek` | DeepSeek models |
| Azure OpenAI | `azure` | Azure-hosted OpenAI |
| OpenRouter | `openrouter` | Multi-provider gateway |

### Translate Missing Keys

Use `--fix --translate` to translate absent keys via AI instead of copying English:

```bash
php artisan unopim:translations:check --fix --translate
```

This sends missing keys to the AI in batches and inserts the translated values. Large batches (100+ keys) are automatically chunked into smaller requests.

### Translate Untranslated Values

Use `--fix-untranslated` to also re-translate keys where the locale value is identical to English (likely copied, not translated):

```bash
php artisan unopim:translations:check --fix --translate --fix-untranslated
```

This detects keys where the locale value matches `en_US` exactly (e.g., `'Dashboard' => 'Dashboard'` in `fr_FR`) and sends them to the AI for proper translation.

### Scope to Specific Locale or Package

```bash
# Translate only French
php artisan unopim:translations:check --fix --translate --locale=fr_FR

# Translate only the Admin package
php artisan unopim:translations:check --fix --translate --package=Admin

# Translate untranslated keys in French Admin package
php artisan unopim:translations:check --fix --translate --fix-untranslated --locale=fr_FR --package=Admin
```

### Fallback Behavior

By default, if the AI platform is not configured or an API call fails, the command **aborts** and shows an error with instructions:

```
No default AI platform configured.
  Configure a default AI platform in Admin > Configuration > Magic AI > Platforms.
  Use --fallback to copy English values instead of aborting.
```

Add `--fallback` to copy English values when AI is unavailable instead of aborting:

```bash
php artisan unopim:translations:check --fix --translate --fallback
```

With `--fallback`:
- If no AI platform is configured → warns, then copies English values
- If an API call fails for a specific locale → warns, then copies English for that locale
- Successfully translated locales still get proper translations

### Command Reference

| Flag | Requires | Description |
|------|----------|-------------|
| `--fix` | — | Add missing keys, remove orphan keys |
| `--translate` | `--fix` | Use AI to translate instead of copying English |
| `--fix-untranslated` | `--fix --translate` | Also re-translate values identical to `en_US` |
| `--fallback` | — | Copy English when AI is unavailable (instead of aborting) |
| `--locale=` | — | Scope to a single locale (e.g., `fr_FR`) |
| `--package=` | — | Scope to a single package (e.g., `Admin`) |
| `--details` | — | Show per-file, per-key diagnostics |
| `--json` | — | Output as machine-readable JSON |
| `--strict` | — | Enable all quality checks |
| `--untranslated` | — | Detect keys identical to `en_US` |
| `--coverage` | — | Show coverage percentage per locale |
| `--placeholder-check` | — | Verify `:placeholder` consistency |
| `--empty-values` | — | Detect blank/empty values |
| `--sort-check` | — | Verify key ordering matches `en_US` |
| `--html-check` | — | Verify HTML tag consistency |

### Full Workflow Example

Here's a typical workflow for bringing translations up to date:

```bash
# 1. Check the current state
php artisan unopim:translations:check --untranslated --coverage

# 2. Fix missing keys + translate untranslated values via AI
php artisan unopim:translations:check --fix --translate --fix-untranslated

# 3. Verify the audit passes
php artisan unopim:translations:check

# 4. Run code formatting
vendor/bin/pint

# 5. Commit the translations
git add packages/Webkul/*/src/Resources/lang/
git commit -m "fix: translate missing and untranslated keys via AI"
```

## CI Integration

The translation audit runs automatically in CI via GitHub Actions. The workflow at `.github/workflows/translation_tests.yml` runs:

```bash
php artisan unopim:translations:check
```

This ensures that no PR introduces missing translation keys. To add stricter checks in your CI pipeline:

```bash
# Fail if any locale has untranslated keys
php artisan unopim:translations:check --strict --json
```

## Configuring the Locale

The default language for your application is stored in the `config/app.php` configuration file's `locale` option:

```php
'locale' => env('APP_LOCALE', 'en_US'),

'fallback_locale' => 'en_US',
```

You can set the `APP_LOCALE` environment variable in your `.env` file to change the default locale.

## Best Practices

1. **Always use translation helpers** — never hardcode strings in Blade views or controllers
2. **Start with `en_US`** — define keys here first, then propagate to all locales
3. **Run the audit before committing** — `php artisan unopim:translations:check` catches missing keys
4. **Use AI translation as a starting point** — review AI output for accuracy, especially for domain-specific terms
5. **Keep key names descriptive** — use dot-notation that reflects the UI location (e.g., `configuration.prompt.create.title`)
6. **Group related keys** — nest translations by feature/section for better organization
7. **Don't translate technical terms** — "API", "URL", "JSON", "CSV", "OAuth" stay in English across all locales
