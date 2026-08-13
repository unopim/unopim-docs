# Agentic Development

UnoPim is built to be worked on *with* AI — not just to ship an in-app assistant. The **Agentic Development** toolkit gives both end users and developers AI-native interfaces into a UnoPim instance, each tuned for a different audience and workflow.

There are two pillars:

| Pillar | Audience | What it does |
|--------|----------|--------------|
| **AI Agent** | Catalog managers, business users | A conversational chat widget inside the admin panel with 35 PIM tools — search, create, bulk edit, enrich, translate, plan multi-step workflows. |
| **Agentic Skills** | Developers using coding agents | Domain-specific skill packs (`SKILL.md`) that teach Claude Code, Cursor, Windsurf, and Copilot how UnoPim's architecture and conventions work, so generated code is correct on the first try. |

---

## How They Fit Together

```
┌─────────────────────────────────────────────────────────┐
│                     UnoPim Instance                      │
│                                                          │
│   ┌──────────────┐            ┌──────────────┐           │
│   │   AI Agent   │───────────▶│   Catalog &  │           │
│   │ (chat widget)│            │   Settings   │           │
│   └──────────────┘            └──────────────┘           │
└──────────────────────────────────────────────────────────┘

        Claude Code      Cursor         Copilot
              ▲
              │ Agentic Skills (SKILL.md)
              │ — domain context for the coding agent
              └──────────────────────────────
```

- The **AI Agent** lives inside the app and talks to your catalog directly. It is the right entry point for non-technical users who want to manage products in natural language.
- **Agentic Skills** ride alongside your coding agent. They do not call UnoPim themselves — they inject UnoPim's conventions (Concord packages, prefix-safe table names, repository pattern, cURL connectors, translation rules) into the agent's context so the code it writes follows UnoPim standards.

---

## What Makes UnoPim AI-Friendly

UnoPim is designed so AI assistants are first-class citizens, not bolted-on afterthoughts:

- **Native tool calling** — the AI Agent ships 35 PIM tools built on [`laravel/ai`](https://github.com/laravel/ai), so the LLM acts on your catalog directly instead of guessing.
- **Codified conventions** — the Agentic Skills encode UnoPim's Concord architecture and coding standards, so generated code follows the rules (repository pattern, prefix-safe table names, cURL connectors, translation requirements) the first time.
- **A documented REST API** — anything an assistant cannot do in-app it can do over [the REST API](../api/), which covers the full catalog, media, settings, and passports.
- **Security by default** — ACL enforcement, rate limiting, audit logging, and approval queues apply to every AI-driven action.

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
```

```
"Review my changes against UnoPim standards before I open a PR."
            → Agentic Skills (unopim-code-review)
```

---

## Choosing the Right Tool

- **"I want to manage my catalog by chatting."** → Use the [AI Agent](./ai-agent.html).
- **"I'm coding an UnoPim plugin and want my AI assistant to write correct UnoPim code."** → Install the [Agentic Skills](./agent-skills.html).
- **"I want an external system to read and write my catalog."** → Use the [REST API](../api/).

The first two are complementary: the AI Agent works inside the admin panel for catalog work, while the skills make your coding agent fluent in UnoPim when you are building on the platform.

---

## In This Section

- **[AI Agent Integration](./ai-agent.html)** — The in-app conversational assistant: chat widget, tool system, approval queues, auto-enrichment, semantic search.
- **[MagicAI Platform Management](./magic-ai-platform.html)** — Multi-provider AI configuration powering the agent and content generation.
- **[Agentic Skills](./agent-skills.html)** — The UnoPim skill packs, how to install them, and how to author your own.
- **[Building an Integration with AI](./building-integrations.html)** — End-to-end walkthrough: scaffold a connector with the skills, from credentials to export profile to review.
- **[Building Custom Agent Tools](./building-agent-tools.html)** — Extend the AI Agent with your own `PimTool` classes: ACL, approval, registration, and testing.
- **[Agentic Recipes](./recipes.html)** — End-to-end playbooks for building, enriching, and maintaining your catalog with AI.
