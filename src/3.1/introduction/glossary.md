# Glossary

Terms used throughout UnoPim and this documentation, in alphabetical order.

| Term | Meaning |
|---|---|
| **ACL** | Access Control List — permission keys (`catalog.products.create`) checked per route and per UI action. Admin ACL and API ACL are separate trees. |
| **Association Type** | A named product-to-product relationship (built-in: related, up-sells, cross-sells; custom types since 3.0) optionally carrying per-link fields. |
| **Attribute** | A typed data field on products (`text`, `select`, `price`, `image`, `date`, `boolean`, `measurement`, …) with per-channel/per-locale scoping flags. |
| **Attribute Family** | The schema a product follows: which attributes it has, grouped into attribute groups, and which are required for completeness. |
| **Channel** | A distribution context (webshop, print, marketplace) with its own set of enabled locales and currencies. |
| **Completeness** | The per-channel, per-locale score of how many required attributes a product has filled. |
| **Configurable Product** | A product with variants, generated over one or two axes (e.g. colour × size). |
| **Data Carrier** | The physical link from product to passport — in UnoPim, a QR code (SVG) encoding the GS1 Digital Link or passport URL. |
| **DPP (Digital Product Passport)** | A structured public record of a product's compliance data, published per locale with immutable versions. |
| **GS1 Digital Link** | The retail-industry standard for GTIN-based URLs (`/01/{gtin}`) resolving to product information. |
| **GTIN** | Global Trade Item Number — 8/12/13/14-digit product identifier with a check digit; validated on save when passports are enabled. |
| **Locale** | A language/region combination (`en_US`, `de_DE`) enabled per channel; also the unit of localization for names, labels, and values. |
| **Measurement Family** | A group of units (Length: mm, cm, m…) with conversion rules to a standard unit. |
| **Proxy Model** | Concord's extension mechanism: models resolve through `*Proxy` classes so packages can override core models without editing them. |
| **Publication** | The generic publishing engine underneath passports: immutable versions, public routes, tiers, tombstones. |
| **Repository** | The data-access layer (`prettus/l5-repository` based) — controllers talk to repositories, not Eloquent directly. |
| **Robot User** | A dedicated `type = 'api'` admin account owning an API integration; cannot log into the panel. |
| **Scope** | The channel/locale context a value belongs to — one of `common`, `locale_specific`, `channel_specific`, `channel_locale_specific`. See [Data Model](../architecture/data-model). |
| **Tier (access tier)** | Passport data visibility level: `consumer` (public), `operator`, `authority` — elevated tiers open via signed, expiring links. |
| **Values document** | The JSON column `products.values` holding all attribute data for a product, partitioned by scope. |
| **Variant Group** | The internal intermediate product type in two-level variant structures (level-1 axis node). |
| **Variant Structure** | A family-level definition of variant axes and attribute placements across `common` / `sub_parent` / `variant` levels. |
