# Performance & Scalability

## Introduction

UnoPim is built for catalogs in the millions. Much of that work happens automatically — the platform paginates, indexes, queues, and caches its own hot paths so that a large catalog behaves like a small one.

Sometimes, though, you may wish to tune the platform for your own workload, or you may be writing extension code that must stay fast at scale. This page covers both: what UnoPim does for you out of the box, the knobs you can turn, and the rules your own code should follow.

We will begin with the platform's built-in behavior, then look at Elasticsearch, queues, and Octane, and finish with the extension rules and a tuning checklist for reference.

## What the Platform Does for You

On large product exports and completeness collection, UnoPim uses **keyset pagination** instead of offset pagination — `OFFSET` degrades badly at depth, while a `WHERE id > ?` cursor does not. The REST API exposes the same idea as [`search_after` pagination](../api/whats-new-v3#delta-synchronization).

The 3.0 migrations add **hot-path indexes** covering products, completeness, attribute-family mappings, and lookup-heavy catalog relations, so the queries the admin runs most often are always index-backed.

Product mass delete and status changes above a threshold run as **queued mass actions** instead of blocking the admin request. You may adjust the threshold in your environment file:

```env
PRODUCT_MASS_ACTION_ASYNC_THRESHOLD=200
```

The product edit screen loads **attribute groups lazily** with a persistent sidebar, so a 500-attribute family renders instantly. REST responses for slow-changing entities (attributes, families, locales, and so on) are served from a **versioned structure cache** with automatic invalidation ([details](../api/whats-new-v3)).

During indexing, **bounded Elasticsearch bulk requests** and isolated query-builder state prevent memory spikes and concurrent filter leakage. And rather than counting per request, **dashboard aggregates** are precomputed by `unopim:dashboard:refresh`, which runs every 10 minutes.

## Elasticsearch Is Optional — Both Paths Must Work

Search and grid filtering branch on `config('elasticsearch.enabled')`. When Elasticsearch is enabled, grids and filters run against the index — which is updated asynchronously, so you should never assume a write is searchable in the same request. When it is disabled, the same features run against the database.

If you write extension filters, you must implement both branches. Register them through the `unopim.database.attribute.filters` and `unopim.elasticsearch.attribute.filters` container tags, and keep the result shape, ordering, and pagination identical across the two paths.

## Queues

Heavy work belongs on queues. UnoPim uses named queues so each workload class can be scaled independently: the `system` queue carries imports, exports, and mass actions; `completeness` carries completeness recalculation; `publication` carries passport publishing, bulk transitions, and view analytics; `webhooks` carries webhook delivery; and `default` carries everything else.

A single worker can drain them all:

```bash
php artisan queue:work --queue="system,completeness,publication,webhooks,default"
```

In production, you should use Redis (`QUEUE_CONNECTION=redis`), and if any queue backs up, run one worker set per workload class.

## Octane

The codebase is Octane-safe: no request state lives in singletons (scoped bindings like `CatalogScope` and `SsoManager` reset per request), token TTLs use relative intervals, and configuration reads are cache-driver-consistent. If you run Octane, your extensions must follow the same rules — never memoize request data in a static or a singleton.

## Rules for Extension Code

These are the failure modes that actually reach production on large catalogs, so treat them as hard rules rather than suggestions:

1. **Never `->get()` an unbounded set.** Iterate with `chunkById()` / `lazyById()`; prefer `cursorPaginate()` on hot grids.
2. **Push work into SQL.** No filtering, summing, or de-duplicating large collections in PHP.
3. **No queries in loops or views.** Eager load with constrained selects.
4. **Index what you filter, sort, or join on** — in the same migration as the feature; check for an existing index first.
5. **Bulk write** with `upsert()` / chunked `insert()`, not per-row saves.
6. **Queue anything unbounded and user-triggered** (imports, recalculations, republishing) with a batch size.
7. **Cache expensive counts** — a `count()` on a million-row table for a UI badge is a slow query.
8. **Stay engine-portable** — the same code must run on MySQL 8 and PostgreSQL 16; let the query builder emit JSON paths and quote identifiers (`DB_PREFIX` installations break on interpolated table names).

## Tuning Checklist

For reference, these are the environment variables that most directly affect performance:

```env
PRODUCT_MASS_ACTION_ASYNC_THRESHOLD=200   # queue mass actions above this
UNOPIM_API_STRUCTURE_CACHE=true           # REST structure cache
UNOPIM_API_STRUCTURE_CACHE_TTL=3600
REST_API_RATE_LIMIT=120                   # protect the API tier
```

Beyond the environment file, a few infrastructure defaults serve large catalogs well:

- PHP: `memory_limit=4G`, OPcache enabled, `max_execution_time=360` for CLI imports
- Redis for cache, sessions, and queues
- Elasticsearch heap sized to the document count; keep 15% disk free
- Run `unopim:product:index` after bulk imports rather than relying on per-save indexing
