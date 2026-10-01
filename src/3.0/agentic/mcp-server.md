# MCP Server

The **UnoPim MCP Bridge** lets AI assistants such as Claude, Claude Code, GitHub Copilot, Cursor and Windsurf work with your UnoPim catalog, settings and codebase through the [Model Context Protocol](https://modelcontextprotocol.io/).

::: tip Separate package
The MCP Bridge is not part of UnoPim core. It ships as the standalone Composer package `unopim/mcp` and has its own documentation and release cycle.

- **Documentation:** [docs-extensions.unopim.com/unopim-mcp](https://docs-extensions.unopim.com/unopim-mcp/)
- **Source code:** [github.com/unopim/unopim-mcp](https://github.com/unopim/unopim-mcp)
:::

## What It Does

The bridge exposes two transports from one package:

| Server | Transport | Best for |
|--------|-----------|----------|
| **HTTP Agent** | `POST /mcp/unopim` (SSE) | Remote AI assistants and PIM workflows, including claude.ai custom connectors over OAuth |
| **stdio Agent** | `php artisan mcp:start unopim-dev` | Coding agents running next to your UnoPim checkout |

Through these, an assistant can search and upsert products, categories and attributes, discover the catalog schema, manage channels and locales, and run developer tools. Every tool call is checked against the connected admin's ACL permissions and is rate limited and audit logged.

## Quick Start

Install the package in your UnoPim root and run its installer:

```bash
composer require unopim/mcp
php artisan mcp:install
```

Then register the server with your assistant. For example, in Claude Code:

```bash
claude mcp add unopim-dev -- php artisan mcp:start unopim-dev
```

Configuration for other editors, the full tool reference, every `config/mcp.php` key, and troubleshooting are covered in the [MCP Bridge documentation](https://docs-extensions.unopim.com/unopim-mcp/).

## MCP Bridge or AI Agent?

- Use the [AI Agent](./ai-agent.html) when users want to manage the catalog by chatting inside the admin panel.
- Use the **MCP Bridge** when an assistant outside UnoPim, such as your IDE agent or claude.ai, should read and write the catalog.
- Use the [Agentic Skills](./agent-skills.html) when you want your coding agent to write code that follows UnoPim conventions.
