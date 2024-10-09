/* set version */
let version = 'master';

/* version prefix setter */
function setVersionPrefix(children) {
    if (children.constructor === Array) {
        return children.map(child => {
            child[0] = `/${version}/${child[0]}`;
            return child;
        });
    }
    return `/${version}/${children}`;
}

/* module export */
module.exports = [
    {
        title: 'Prologue',
        path: setVersionPrefix('prologue'),
        collapsable: true,
        children: setVersionPrefix([
            ['prologue/contribution-guide', ' Contribution Guide'],
        ])
    },
    {
        title: 'Introduction',
        path: setVersionPrefix('introduction'),
        collapsable: true,
        children: setVersionPrefix([
            ['introduction/requirements', 'Requirements'],
            ['introduction/installation', 'Installation'],
        ])
    },
    {
        title: 'Architecture Overview',
        path: setVersionPrefix('architecture'),
        collapsable: true,
        children: setVersionPrefix([
            ['architecture/packages', 'Packages'],
            ['architecture/frontend', 'Frontend'],
            ['architecture/repository-pattern', 'Repository Pattern'],
            ['architecture/modular-design', 'Modular Design']
        ])
    },
    {
        title: 'Technical Codebase',
        path: setVersionPrefix('packages'),
        collapsable: true,
        children: setVersionPrefix([
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
        ])
    },
    {
        title: 'Plugin Development',
        path: setVersionPrefix('plugins'),
        collapsable: true,
        children: setVersionPrefix([
            ['plugins/create-plugin', 'Getting Started'],
            ['plugins/add-side-menu', 'Side Menu'],
            ['plugins/create-export-profile', 'Export Profile'],
            ['plugins/create-import-profile', 'Import Profile'],
            ['plugins/plugin-deployment', 'Plugin Deployment'],
        ])
    },
    {
        title: 'Digging Deeper',
        path: setVersionPrefix('advanced'),
        collapsable: true,
        children: setVersionPrefix([
            ['advanced/events', 'Events Listeners'],
            ['advanced/helpers', 'Helpers'],
            ['advanced/override-core-model', 'Override Core Models'],
            ['advanced/render-event', 'View Render Event'],
        ])
    },
    {
        title: 'Rest APIs',
        path: setVersionPrefix('api'),
        collapsable: true,
        children: setVersionPrefix([
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
    },
]
