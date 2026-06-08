# Agentic Development

UnoPim is built to be worked on *with* AI — not just to ship an in-app assistant. The **Agentic Development** toolkit gives both end users and developers a set of AI-native interfaces into a UnoPim instance, each tuned for a different audience and workflow.

There are three pillars:

| Pillar | Audience | What it does |
|--------|----------|--------------|
| **AI Agent** | Catalog managers, business users | A conversational chat widget inside the admin panel with 38+ PIM tools — search, create, bulk edit, enrich, translate, plan multi-step workflows. |
| **Agentic Skills** | Developers using coding agents | Domain-specific skill packs (`SKILL.md`) that teach Claude Code, Cursor, Windsurf, and Copilot how UnoPim's architecture and conventions work, so generated code is correct on the first try. |
| **MCP Server** | Developers & remote AI assistants | A [Model Context Protocol](https://modelcontextprotocol.io/) bridge that exposes the catalog, settings, and developer tools to any MCP-compatible client over HTTP (SSE) or stdio. |

---

## How They Fit Together

```
┌─────────────────────────────────────────────────────────┐
│                     UnoPim Instance                       │
│                                                           │
│   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐ │
│   │  AI Agent    │   │  MCP Server   │   │   Catalog &   │ │
│   │ (chat widget)│──▶│ (HTTP + stdio)│──▶│   Settings    │ │
│   └─────────────┘   └──────┬───────┘   └──────────────┘ │
│                            │                              │
└────────────────────────────┼──────────────────────────────┘
                             │ MCP protocol
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Claude Code      Cursor         Copilot
              ▲
              │ Agentic Skills (SKILL.md)
              │ — domain context for the coding agent
              └──────────────────────────────
```

- The **AI Agent** lives inside the app and talks to your catalog directly. It is the right entry point for non-technical users who want to manage products in natural language.
- The **MCP Server** exposes that same catalog (plus developer tooling) to *external* AI editors, so a developer in Cursor or Claude Code can read, write, and scaffold without leaving the IDE.
- **Agentic Skills** ride alongside the coding agent. They do not call UnoPim themselves — they inject UnoPim's conventions (Concord packages, `wk_` table prefix, repository pattern, cURL connectors, translation rules) into the agent's context so the code it writes — or the code it writes *through* the MCP Server — follows UnoPim standards.

---

## What Makes UnoPim AI-Friendly

UnoPim is designed so AI assistants are first-class citizens, not bolted-on afterthoughts:

- **Native tool calling** — the AI Agent ships 38+ PIM tools built on [prism-php/prism](https://github.com/prism-php/prism), so the LLM acts on your catalog directly instead of guessing.
- **A standard protocol** — the MCP Server speaks the open [Model Context Protocol](https://modelcontextprotocol.io/), so any compatible editor connects without custom glue.
- **Codified conventions** — the Agentic Skills encode UnoPim's Concord architecture and coding standards, so generated code follows the rules (repository pattern, `wk_` table prefix, cURL connectors, translation requirements) the first time.
- **Security by default** — ACL enforcement, rate limiting, audit logging, command whitelisting, and approval queues apply to every AI-driven action.

## What You Can Build

A few examples of what these tools unlock:

```
"Find all products in the Electronics category missing a description,
 generate one for each, and translate it to every active locale."
            → AI Agent (search + bulk edit + auto-translation)
```

```
"Scaffold a WooCommerce connector plugin with credential storage,
 a connection test, and an export profile."
            → Agentic Skills (unopim-plugin-development)
            + MCP Server (generate_plugin, run_command)
```

```
"What's the schema for products? Then create 20 demo products
 with realistic attributes and verify they imported correctly."
            → MCP Server (get_catalog_schema + upsert_products + search_products)
```

---

## Choosing the Right Tool

- **"I want to manage my catalog by chatting."** → Use the [AI Agent](./ai-agent.html).
- **"I'm coding an UnoPim plugin and want my AI assistant to write correct UnoPim code."** → Install the [Agentic Skills](./agent-skills.html).
- **"I want my AI editor to read/write my live catalog and run Artisan commands."** → Set up the [MCP Server](./mcp-server.html).

These are complementary. A typical developer setup installs the Agentic Skills **and** connects the MCP Server: the skills tell the agent *how* to write UnoPim code, and the MCP Server gives it the *hands* to inspect the live instance, scaffold plugins, and verify changes.

---

## In This Section

- **[AI Agent Integration](./ai-agent.html)** — The in-app conversational assistant: chat widget, tool system, approval queues, auto-enrichment, semantic search.
- **[MagicAI Platform Management](./magic-ai-platform.html)** — Multi-provider AI configuration powering the agent and content generation.
- **[Agentic Skills](./agent-skills.html)** — The six UnoPim skill packs, how to install them, and how to author your own.
- **[MCP Server](./mcp-server.html)** — Installing the MCP bridge, connecting AI editors, available tools, configuration, and security.
- **[Building an Integration with AI](./building-integrations.html)** — End-to-end walkthrough: scaffold a connector with the skills + MCP, from credentials to export profile to review.
- **[Building Custom Agent Tools](./building-agent-tools.html)** — Extend the AI Agent with your own `PimTool` classes: ACL, approval, registration, and testing.
- **[Extending the MCP Bridge](./extending-mcp.html)** — Add custom MCP capabilities via dynamic Skills (low-code) or PHP Core Tools.
- **[Agentic Recipes](./recipes.html)** — End-to-end playbooks for building, enriching, and maintaining your catalog with AI.
