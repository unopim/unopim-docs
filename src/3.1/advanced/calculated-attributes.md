# Calculated Attributes

## Introduction

A **calculated attribute** holds no value of its own. Its value is derived from a formula every time the product is shown, exported or returned by the API, so it is always consistent with the attributes it is built from — there is nothing to rebuild or reindex after a formula changes or a category is renamed.

Because the value is derived rather than stored, a calculated attribute is:

- **read-only** in the product form,
- **ignored on import** — the column is accepted so an exported file still re-imports, but whatever it contains is discarded,
- **not offerable** as a completeness requirement, since nobody could ever fill it in.

Typical uses are an article key assembled from a manufacturer and a part number, a category path for a marketplace feed, or a display label that falls back from one attribute to another.

## Creating a calculated attribute

Go to **Catalog → Attributes → Create Attribute** and choose the type **Calculated**. Selecting that type reveals the **Formula** panel, which also lists every function and variable a formula may use.

| Field | Value |
|---|---|
| Code | `artikelfamilie` |
| Type | Calculated |
| Value per locale | on, when the result depends on the locale |
| Value per channel | on, when the result depends on the channel |

The formula is checked when you save. A syntax error, an unknown attribute code, a function outside the whitelist and a circular dependency each produce a message on the field rather than failing silently later.

Add the attribute to an attribute family under **Catalog → Families → (your family) → Attributes**, the same as any other attribute. Until you do, it will not appear on the product form.

## Walkthrough: a localised category path

Say you need a column holding the product's category path, using the **localised category names** joined with `#` — for example `Arbeitskleidung#Anzug`.

### 1. Check the category tree

Under **Catalog → Categories**, the categories must be nested the way the path should read, and each one needs a name in the locale you export:

```
root                        (the technical root — never part of the path)
└── arbeitskleidung         name (de_DE): "Arbeitskleidung"
    └── anzug               name (de_DE): "Anzug"
```

A category with no name in the exported locale falls back to its **code**, so a path can come out as `arbeitskleidung#anzug` if the German names are missing. That is the usual cause of a "why are my labels codes?" surprise.

### 2. Create the attribute

Create `artikelfamilie` as above, with **value per locale** on — category names are localised, so the value differs per locale — and this formula:

```
category_label_path('#')
```

### 3. Check a product

Open any product assigned to `anzug`. In the group you placed the attribute in, `artikelfamilie` shows as a greyed-out, non-editable field reading:

```
Arbeitskleidung#Anzug
```

Switch the locale selector and the value follows the category names of that locale.

### 4. Export it

Under **Settings → Data Transfer → Exports → Create**, entity type *Products*, `artikelfamilie` appears in the attribute selection alongside every other attribute — pick it like any other column. Leaving the selection empty exports every attribute, calculated ones included.

The exported file has one row per product per channel/locale, and the column holds the value computed for that row's scope:

```csv
sku,channel,locale,artikelfamilie
ANZUG-01,default,de_DE,Arbeitskleidung#Anzug
ANZUG-01,default,en_US,Workwear#Suit
```

## Writing formulas

### Referring to other attributes

Write the attribute **code** as a bare word:

```
concat(' ', manufacturer, model)
```

The value is resolved in the current scope automatically, following that attribute's own *value per locale* and *value per channel* settings — you never write the scope yourself. Variant products see the values inherited from their parent, the same ones the product form shows.

`concat()` drops empty parts, so a product with no model yields `ACME` rather than `ACME `. That is its most useful property, and the reason to prefer it over gluing strings together by hand.

### System variables

| Variable | Meaning |
|---|---|
| `sku` | the product SKU |
| `type` | the product type |
| `status` | the product status |
| `family` | the attribute family code |
| `parent` | the parent SKU, for variants |
| `categories` | the assigned category codes, as a list |
| `channel` | the channel being rendered |
| `locale` | the locale being rendered |

### Functions

**Text** — `concat(sep, ...)`, `join(sep, list)`, `coalesce(...)`, `upper`, `lower`, `trim`, `length`, `substr(s, start, len)`, `replace(s, search, replace)`, `pad_left(s, len, ch)`, `pad_right(s, len, ch)`, `split(s, sep)`

**Logic** — `if(cond, then, else)`, `is_empty(v)`, `default(v, fallback)`

**Numbers** — `round(n, p)`, `floor`, `ceil`, `abs`, `min(...)`, `max(...)`, `number_format(n, decimals, dec_point, thousands_sep)`

**Dates** — `now()`, `date_format(v, 'Y-m-d')`, `date_add(v, '+1 month')`, `year`, `month`, `day`

**Categories** — `category_path(sep)`, `category_label_path(sep)`, `category_codes()`, `category_labels()`

Operators `+ - * / %`, comparisons, `and` / `or` / `not` and the ternary `a ? b : c` all work as expected. The regular-expression operator `matches` and the range operator `..` are deliberately **not** allowed: both let a short formula cost an unbounded amount of time or memory inside an export worker.

### Recipes

```
# Fall back to a second attribute when the first is empty
coalesce(short_description, name)

# Empty when a precondition is not met
if(is_empty(ean), '', concat('-', 'EAN', ean))

# Gross price from net
round(price * 1.19, 2)

# Year and month of a date attribute
date_format(release_date, 'Y-m')

# A different structure per locale, from one definition
if(locale == 'de_DE', category_label_path('#'), category_label_path(' > '))

# A calculated attribute may build on another calculated attribute
upper(concat('/', 'DE', article_key))
```

## Behaviour across the application

### Product form

The field renders read-only, with the computed value for the channel and locale currently selected. Nothing is submitted for it, so a derived value can never be written to the database by saving a product.

### Import

An import accepts a calculated column and discards its content. This keeps the export/import round trip working — an exported file contains the column — without ever storing a derived value.

### Completeness

Calculated attributes do not appear in the completeness attribute picker. A requirement on one could never be satisfied, because no editor can fill it in.

### Export

Calculated attributes behave like any other attribute in an export profile's attribute selection, and their values are written per channel/locale row.

### REST API

The product endpoints compute calculated values only when asked, with `with_calculated`:

```
GET /api/v1/rest/products?with_calculated=1
GET /api/v1/rest/products/{sku}?with_calculated=1
```

The flag mirrors `with_completeness`. It is off by default because the response carries every channel/locale scope at once, so a paginated listing would otherwise evaluate every formula for every scope of every row.

With the flag on, the derived values appear in the product's `values` block, under the scope the attribute declares:

```json
{
  "sku": "ANZUG-01",
  "values": {
    "locale_specific": {
      "de_DE": { "artikelfamilie": "Arbeitskleidung#Anzug" },
      "en_US": { "artikelfamilie": "Workwear#Suit" }
    }
  }
}
```

A formula is validated on the REST write endpoints exactly as it is in the admin form, so an API client cannot store a formula that does not parse, names an unknown attribute or closes a cycle.

## Rules and limits

- **No circular dependencies.** `a` referring to `b` while `b` refers to `a` is rejected on save, with the cycle named in the message (`a -> b -> a`). Chains of any length are checked, not just direct pairs.
- **No arbitrary code.** Only the functions listed above are callable; anything else is refused at save time. A formula cannot reach PHP functions, constants or objects.
- **Length limit** of 2000 characters per formula. Every text a function produces is capped at 10,000 characters (longer results are cut off), `number_format` uses at most 20 decimals, and `pad_left`/`pad_right` never pad beyond the same 10,000-character ceiling. This keeps a short formula such as a nested `replace()` from exhausting a worker's memory.
- **One formula per attribute**, evaluated once per channel/locale. If you need a different *structure* per locale, branch inside the formula on `locale`.
- An attribute code that is not a valid identifier — one starting with a digit, say — cannot be referenced from a formula.
- An attribute that a formula reads **cannot be deleted** until the formula stops referring to it. The error names the attributes that stand in the way.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Unknown attribute or variable "x"` | typo in the code, or the attribute does not exist |
| `Function "x" is not allowed in a formula.` | outside the whitelist — check the spelling against the list above |
| `The formula creates a circular dependency: …` | follow the named chain and break it |
| Column exports as empty | every source value is empty for that product and locale, or the formula no longer compiles — the failure is reported to the application log |
| Path shows codes instead of names | the categories have no name in that locale |
| Path is missing its top level | the technical root category is deliberately excluded |

## Operational notes

- Values are computed on demand and never stored, so nothing has to be rebuilt or reindexed after a formula changes or a category is renamed; the next render or export is already correct.
- Calculated values are **not** indexed in Elasticsearch, so the product grid cannot filter or sort on them in this version.
- A formula that stops compiling renders as an empty value rather than breaking the page or aborting an export, and the failure is reported to the application log once per formula per process.
