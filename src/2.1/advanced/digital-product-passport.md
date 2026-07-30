# Digital Product Passport

The passport feature is two packages. `Webkul\Publication` is the generic publishing engine — immutable versions, public routes, tiered access, data carriers. `Webkul\ProductPassport` is the DPP publication type that plugs into it: templates, readiness, payload building.

Nothing about a passport's field list is hardcoded. A **passport template** is data, so a delegated act adding a field is a row, not a release.

## Data model

```
passport_templates                     code (unique), is_enabled
passport_template_translations          name per locale
passport_template_families              attribute_family_id (unique across all templates)
passport_template_sections              code, position
passport_template_section_translations   name per locale
passport_template_fields                code, source_type, attribute_id, tier,
                                        is_required, role, position
passport_template_field_translations     label, fixed_value per locale
```

A family resolves to **at most one** template, enforced by a unique index on `attribute_family_id`. That keeps "which passport does this product get" a single lookup with no precedence rules.

| Column | Notes |
|---|---|
| `source_type` | `PassportFieldSource` — `attribute` reads the product value, `fixed` publishes the field's localized `fixed_value`. |
| `tier` | `PassportFieldTier` — `consumer`, `operator`, `authority`. The list and its order are code-owned because signed-URL elevation depends on them; the per-field assignment is admin-editable. |
| `role` | `PassportFieldRole` — `gtin`, `model`, `batch`. A role field feeds the identifier block and the data carrier instead of publishing a row. Unique per template (NULL repeats freely). |
| `attribute_id` | Nullable. A field with no attribute is a draft: it publishes nothing and counts as unsourced. |

## Services

| Class | Responsibility |
|---|---|
| `PassportTemplateResolver` | The enabled template bound to a product's family, with sections, fields, attributes and translations eager-loaded. Memoized per family id, so a bulk publish of one family is a single query set without holding request state on the container. |
| `PassportReadinessService` | `missingFor()` / `isReady()` / `missingLabels()` — the required fields that resolve empty for a channel and locale. A product whose family has no template is never ready. |
| `TemplateReadinessGate` | `PublicationGate` implementation; fails closed. |
| `PassportPayloadBuilder` | Builds the published payload from the template. |
| `PassportPresetSeeder` | Materializes a preset from config into an editable template, idempotently. |

## The publish gate

`Publisher` no longer knows what "complete" means. A publication type declares its gate and the engine resolves it:

```php
'types' => [
    'dpp' => [
        'payload_builder' => PassportPayloadBuilder::class,
        'template'        => 'passport::public.passport',
        'route_prefix'    => 'p',
        'gate'            => TemplateReadinessGate::class,
        'jsonld'          => PassportJsonLdResource::class,
    ],
],
```

A type without a `gate` publishes unconditionally. A gate that is not a `PublicationGate` throws rather than being ignored.

```php
interface PublicationGate
{
    public function passes(Product $product, Channel $channel, Locale $locale): bool;
}
```

## Payload shape

```php
[
    'identifier' => ['gtin' => ..., 'model' => ..., 'batch' => ...],
    'operator'   => ['name' => ..., 'address' => ..., 'eu_representative' => ...],
    'sections'   => [['key' => 'materials', 'label' => 'Materials', 'fields' => [...]]],
    'documents'  => [...],
    'tiers'      => ['consumer' => ['fields' => [], 'documents' => []], 'operator' => ..., 'authority' => ...],
    'meta'       => ['uuid' => ..., 'url' => ..., 'locale' => ..., 'channel' => ..., 'built_at' => ..., 'template' => ...],
]
```

`sections` and `documents` carry the **base tier** only; `tiers` holds the full partition that signed elevation reads. `meta` is excluded from the checksum, so anything placed there never affects version dedupe.

Field resolution, in order: a `role` field goes to `identifier`; a `fixed` field publishes its localized value; an `attribute` field reads the product value for that channel and locale; a file or image attribute is copied to the asset disk and published as a document. An empty optional field is skipped, so no section renders as a bare heading.

## Adding a preset for a product group

Presets are config, keyed by template code. Merge your own into `passport_presets`:

```php
return [
    'tyres' => [
        'name_key'     => 'yourpackage::app.passport.tyres.name',
        'label_prefix' => 'yourpackage::app.passport.tyres.fields.',

        'sections' => [
            'identity' => 'yourpackage::app.passport.tyres.sections.identity',
        ],

        'fields' => [
            ['code' => 'tyre_id', 'section' => 'identity', 'role' => PassportFieldRole::Gtin, 'required' => true],
            ['code' => 'rolling_resistance', 'section' => 'identity'],
            ['code' => 'wet_grip', 'section' => 'identity', 'tier' => PassportFieldTier::Operator],
        ],
    ],
];
```

Field labels resolve from `label_prefix . code`, section names from their `name_key`, per **enabled catalog locale** — a catalogue with two locales gets two translation rows, not one per shipped language file.

Install with:

```bash
php artisan unopim:passport:install-preset --preset=tyres
```

The seeder skips a template whose code already exists, binds the template to **no family** and leaves every field unsourced, so installing changes nothing until an admin wires it up.

## Public surfaces

| Route | Purpose |
|---|---|
| `/{prefix}/{uuid}/{locale}` | The passport page. Returns JSON-LD instead when the request negotiates `application/ld+json`. |
| `/{prefix}/{uuid}/carrier` | QR code as SVG. Extensionless on purpose — a `.svg` suffix is answered by nginx's static rules and never reaches PHP. `carrier.svg` remains as an alias. |
| `/{prefix}/{uuid}/asset/{path}` | Published documents, tier-gated. |
| `/01/{gtin}` | GS1 Digital Link resolution to the passport of the designated channel. |

Elevation to `operator` or `authority` requires a Laravel signed URL carrying a `tier` parameter. Anything missing, tampered or unknown clamps back to `consumer`.

## Postgres payloads

`publication_version_payloads.payload` is gzip-compressed `bytea`. On Postgres the driver returns a **stream**, and reading it moves the pointer, so the accessor rewinds before reading and caches the decoded array per instance. Without that, the second consumer in one request — the published listener that syncs the GTIN, for example — sees an absent payload. MySQL returns a string and never exposes the fault.

## Extension points

- `catalog.passport_template.{create,update,delete}.{before,after}` events fire around every template write.
- Templates, sections and fields are audited through `HistoryTrait` under the `passport_template` tag.
- `PassportTemplateResolver`, `PassportReadinessService` and the payload builder are container-resolved, so a package can decorate or rebind them.
- ACL keys: `catalog.passport.template.{view,create,edit,delete}`.

## Commands

| Command | Purpose |
|---|---|
| `unopim:passport:install-preset [--preset=code]` | Install ready-made templates. Idempotent. |
