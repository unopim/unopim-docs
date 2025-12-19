// .vitepress/version-configs/master.ts
let version = 'master'

export default function getMasterSidebar(version: string) {
  function setVersionPrefix(children: [string, string][]) {
    return children.map(child => ({
      text: child[1],
      link: `/${version}/${child[0]}`
    }))
  }
  return [
    {
      text: 'Prologue',
      link: `/${version}/prologue/`,
      collapsed: false,
      items: setVersionPrefix([
        ['prologue/upgrade-guide', 'Upgrade Guide'],
        ['prologue/contribution-guide', 'Contribution Guide'],
      ])
    },
    {
      text: 'Introduction',
      link: `/${version}/introduction/`,
      collapsed: false,
      items: [
        {
          text: 'Requirements',
          link: `/${version}/introduction/requirements`
        },

        {
          text: 'System Installation',
          link: `/${version}/introduction/system-installation/`,
          items: [
            {
              text: 'Ubuntu',
              items: [
                {
                  text: 'Base Preparation',
                  link: `/${version}/introduction/system-installation/ubuntu/preparation`
                },
                {
                  text: 'Apache + MySQL',
                  link: `/${version}/introduction/system-installation/ubuntu/apache-mysql`
                },
                {
                  text: 'Apache + PostgreSQL',
                  link: `/${version}/introduction/system-installation/ubuntu/apache-postgresql`
                }
              ]
            }
          ]
        },

        {
          text: 'Creating a New User',
          link: `/${version}/introduction/creating-newuser`
        },
        {
          text: 'Configuring Supervisor',
          link: `/${version}/introduction/configuring_supervisor`
        }
      ]
    },


    // {
    //   text: 'Introduction',
    //   link: `/${version}/introduction/`,
    //   collapsed: false,
    //   items: setVersionPrefix([
    //     ['introduction/requirements', 'Requirements'],
    //     ['introduction/installation', 'Installation'],
    //     ['introduction/installation-with-postgresql', 'Installation With PostgreSql'],
    //     ['introduction/installation-with-mysql', 'Installation With MySql'],
    //     ['introduction/creating-newuser', 'Creating a New User'],
    //     ['introduction/configuring_supervisor', 'Configuring Supervisor'],
    //   ])
    // },
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
        ['advanced/queue-management', 'Queue Management'],
        ['advanced/elasticsearch-configuration', 'Elasticsearch Configuration'],
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
}
