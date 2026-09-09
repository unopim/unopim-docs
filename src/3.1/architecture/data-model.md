# Data Model & Values Format

## Introduction

Every catalog in UnoPim is built from a small set of entities — channels, locales, attributes, families, categories, and products — and every product stores its attribute data in a single, well-defined JSON document. Once you understand how these pieces fit together, the rest of the platform becomes much easier to reason about.

This page is the reference for that structure — the equivalent of a "standard format" specification. You should read it before writing importers, exporters, API clients, or anything else that touches `products.values`, since every one of those tools produces or consumes the format described here.

We will start with the core entities, walk through the values document itself, and finish with the more advanced topics: variant inheritance, scope resolution, and completeness.

## Core Entities

A **channel** represents a distribution context — a web store, a print catalog, a marketplace — with its own set of locales and currencies. A **locale** is a language/region pair such as `en_US` or `de_DE`, and each locale is enabled per channel.

An **attribute** is a typed field (`text`, `select`, `price`, `image`, `measurement`, and so on) that carries per-channel and per-locale scoping flags. Attributes are organized into **attribute groups**, which control how they are presented, and groups are assembled into an **attribute family** — the schema a product follows, defining which attributes it has and in which groups they appear.

A **category** is a node in a nested-set tree and may carry custom **category fields**. A **product** is `simple`, `configurable`, or (internally) `variant_group`, and carries the `values` JSON document described below. An **association type** defines a named product-to-product relationship with optional per-link fields, while a **measurement family** defines the units and conversion rules available to measurement attributes.

## The Product Values Document

Every product stores its attribute data in one JSON column, `products.values`, partitioned by **scope**. Let's walk through a complete example:

```json
{
  "common": {
    "sku": "shirt-1",
    "brand": "verano"
  },
  "locale_specific": {
    "en_US": { "name": "Harbour Overshirt" },
    "de_DE": { "name": "Harbour Überhemd" }
  },
  "channel_specific": {
    "ecommerce": { "status": "1" }
  },
  "channel_locale_specific": {
    "ecommerce": { "en_US": { "description": "<p>…</p>" } }
  },
  "categories": ["apparel", "shirts"],
  "associations": {
    "related_products": ["shirt-2"],
    "up_sells": [],
    "cross_sells": []
  }
}
```

The `common` bucket holds values that are the same everywhere — here, the `sku` and `brand` apply regardless of channel or locale. The `locale_specific` bucket is keyed by locale, so the product's `name` can differ between `en_US` and `de_DE` while remaining channel-independent. The `channel_specific` bucket is keyed by channel: the `status` value applies to the `ecommerce` channel in every locale. Finally, `channel_locale_specific` nests channel and then locale, so the `description` shown here belongs only to the `ecommerce` channel in `en_US`. Alongside the four scope buckets, `categories` lists the product's category codes and `associations` lists linked SKUs.

Which bucket an attribute writes to follows directly from its two scoping flags:

| `value_per_channel` | `value_per_locale` | Bucket |
|---|---|---|
| ✗ | ✗ | `common` |
| ✗ | ✓ | `locale_specific.<locale>` |
| ✓ | ✗ | `channel_specific.<channel>` |
| ✓ | ✓ | `channel_locale_specific.<channel>.<locale>` |

The bucket keys are defined once as constants on `Webkul\Product\Type\AbstractType` — `COMMON_VALUES_KEY`, `LOCALE_VALUES_KEY`, `CHANNEL_VALUES_KEY`, `CHANNEL_LOCALE_VALUES_KEY`, `CATEGORY_VALUES_KEY`, and `ASSOCIATION_VALUES_KEY`. You should always use the constants rather than string literals.

### Value Types Worth Knowing

A few attribute types store their values in shapes you may not expect. Select and multiselect attributes store option *codes*, not labels. Media attributes store storage paths, while the files themselves live on the configured disk.

Measurement values are objects rather than plain scalars:

```json
{"unit": "cm", "amount": "180.0000", "family": "Length", "base_unit": "m", "base_data": "1.800000"}
```

See [Measurements](../packages/measurements) for how these are managed.

The `categories` key holds category *codes*, and `associations` holds SKU lists for the three legacy sections. Rich associations live in the `product_associations` table — see [Configurable Associations](../packages/configurable-associations).

## Variants and Inherited Values <Badge type="tip" text="3.0" />

For products inside a variant structure, `products.values` holds only the values the node itself *authors*. When you need the effective values, UnoPim merges the ancestor chain at read time:

```php
$effective = $product->resolvedValues();
```

You should never read a variant child's raw `values` column directly — see [Advanced Variants](../packages/advanced-variants) for the full inheritance model.

## Scope Resolution

Whenever UnoPim needs to know the current channel and locale, it resolves the context through `Webkul\Core\CatalogScope` in this order:

1. Explicit `?channel=` / `?locale=` request parameters (validated against `^[a-zA-Z0-9_-]+$`)
2. The admin's **catalog locale** and **default channel** preferences (per-user, new in 3.0)
3. The default channel and its default locale

Console and queue contexts skip step 2, since there is no authenticated admin in those contexts.

## Completeness

Completeness scores each product per channel and locale against the required attributes of its family. For variant trees, each node is scored only against the attributes it owns at its own level. Scores recalculate automatically on save (queued), on demand via `unopim:completeness:recalculate`, and nightly by the scheduler.
