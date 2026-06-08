// .vitepress/version-configs/2.1.ts
let version = '2.1'

function setVersionPrefix(children: [string, string][]) {
    return children.map(child => ({
        text: child[1],
        link: `/${version}/${child[0]}`
    }))
}

export default [
    {
        text: 'Prologue',
        link: `/${version}/prologue/`,
        collapsed: false,
        items: setVersionPrefix([
            ['prologue/upgrade-guide', 'Upgrade Guide'],
            ['prologue/patch-update', 'Patch / Minor Update Guide'],
            ['prologue/contribution-guide', 'Contribution Guide'],
        ]),

    },
    {
        text: 'Introduction',
        link: `/${version}/introduction/`,
        collapsed: false,
        items: setVersionPrefix([
            ['introduction/requirements', 'Requirements'],
            ['introduction/installation', 'Installation'],
            ['introduction/installation-docker', 'Installation with Docker'],
            ['introduction/installation-ubuntu', 'Installation on Ubuntu 24.04'],
            ['introduction/installation-debian', 'Installation on Debian 12'],
            ['introduction/installation-centos', 'Installation on CentOS / RHEL 9'],
            ['introduction/installation-with-postgresql', 'Installation With PostgreSQL'],
            ['introduction/web-server-configuration', 'Web Server Configuration'],
            ['introduction/queue-scheduler-setup', 'Queue & Scheduler Setup'],
            ['introduction/creating-newuser', 'Creating a New User'],
        ])
    },
    {
        text: 'Architecture Overview',
        link: `/${version}/architecture/`,
        collapsed: false,
        items: setVersionPrefix([
            ['architecture/packages', 'Packages'],
            ['architecture/frontend', 'Frontend'],
            ['architecture/repository-pattern', 'Repository Pattern'],
            ['architecture/modular-design', 'Modular Design'],
        ])
    },
    {
        text: 'Technical Codebase',
        link: `/${version}/packages/`,
        collapsed: false,
        items: setVersionPrefix([
            ['packages/create-package', 'Getting Started'],
            ['packages/create-migrations', 'Migrations'],
            ['packages/create-models', 'Models'],
            ['packages/store-data-through-repositories', 'Repositories'],
            ['packages/controllers', 'Controllers'],
            ['packages/routes', 'Routes'],
            ['packages/views', 'Views'],
            ['packages/localization', 'Translations'],
            ['packages/layouts', 'Layouts'],
            ['packages/blade-components', 'Blade Components'],
            ['packages/bundling-assets', 'Bundling Assets'],
            ['packages/add-menu-in-admin', 'Side Menu'],
            ['packages/validation', 'Validation'],
            ['packages/datagrid', 'DataGrid'],
            ['packages/create-acl', 'Access Control List'],
            ['packages/history', 'History Tracking'],
            ['packages/data-transfer', 'Data Transfer'],
            ['packages/webhooks', 'Webhooks'],
            ['packages/swatch-types', 'Swatch Types'],
        ])
    },
    {
        text: 'Plugin Development',
        link: `/${version}/plugins/`,
        collapsed: false,
        items: setVersionPrefix([
            ['plugins/create-plugin', 'Getting Started'],
            ['plugins/add-side-menu', 'Side Menu'],
            ['plugins/create-export-profile', 'Export Profile'],
            ['plugins/create-import-profile', 'Import Profile'],
            ['plugins/plugin-deployment', 'Plugin Deployment'],
        ])
    },
    {
        text: 'Digging Deeper',
        link: `/${version}/advanced/`,
        collapsed: false,
        items: setVersionPrefix([
            ['advanced/events', 'Events Listeners'],
            ['advanced/helpers', 'Helpers'],
            ['advanced/override-core-model', 'Override Core Models'],
            ['advanced/render-event', 'View Render Event'],
            ['advanced/security-practice', 'Best Security Practices'],
            ['advanced/cli-commands', 'CLI Commands'],
            ['advanced/queue-management', 'Queue Management'],
            ['advanced/elasticsearch-configuration', 'Elasticsearch Configuration'],
        ])
    },
    {
        text: 'Agentic Development',
        link: `/${version}/agentic/`,
        collapsed: false,
        items: setVersionPrefix([
            ['agentic/ai-agent', 'AI Agent Integration'],
            ['agentic/magic-ai-platform', 'MagicAI Platform Management'],
            ['agentic/agent-skills', 'Agentic Skills'],
            ['agentic/mcp-server', 'MCP Server'],
            ['agentic/building-integrations', 'Building an Integration with AI'],
            ['agentic/building-agent-tools', 'Building Custom Agent Tools'],
            ['agentic/extending-mcp', 'Extending the MCP Bridge'],
            ['agentic/recipes', 'Agentic Recipes'],
        ])
    },
    {
        text: 'Rest APIs',
        link: `/${version}/api/`,
        collapsed: false,
        items: setVersionPrefix([
            ['api/configuration', 'Configuration'],
            ['api/authenticate', 'Authentication'],
            ['api/attribute', 'Attribute'],
            ['api/attribute_options', 'Attribute Options'],
            ['api/attribute_groups', 'Attribute Groups'],
            ['api/attribute_families', 'Attribute Families'],
            ['api/category', 'Category'],
            ['api/category_fields', 'Category Fields'],
            ['api/category_field_options', 'Category Field Options'],
            ['api/product', 'Product'],
            ['api/configurable_products', 'Configurable Products'],
            ['api/media', 'Media'],
            ['api/channel', 'Channel'],
            ['api/locales', 'Locales'],
            ['api/currency', 'Currency'],
        ])
    }
]
