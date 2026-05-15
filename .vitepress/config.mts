import { defineConfig } from 'vitepress'


import v01 from './version-configs/0.1'
import v02 from './version-configs/0.2'
import v03 from './version-configs/0.3'
import v1 from './version-configs/1.0.x'
import v2 from './version-configs/2.0.x'
import v21 from './version-configs/2.1.x'
import getMasterSidebar from './version-configs/master'


export default defineConfig({
  lang: 'en-US',
  title: "UnoPim Documentation",
  description: "UnoPim Developer Portal",

  vite: {
    server: {
      host: '0.0.0.0',
      port: 8080
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    }
  },

  srcDir: './src',

  themeConfig: {
    siteTitle: false,

    logo: {
      light: '/logo.svg',
      dark: '/dark_logo.svg',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: 'https://docs.unopim.com/' },
      { text: 'Contact Us', link: 'https://unopim.com/en/contacts/' },
      { text: 'Contribute', link: 'https://github.com/unopim/unopim' },
    ],

    editLink: {
      pattern: 'https://github.com/unopim/unopim-docs/edit/main/src/:path',
      text: 'Help us improve this page on Github.'
    },

    lastUpdated: {
      text: 'Last Updated',
      formatOptions: {
        dateStyle: 'full'
      }
    },


    sidebar: {
      '/master/': getMasterSidebar('master'),
      '/2.1.x/': v21,
      '/2.0.x/': v2,
      '/1.0.x/': v1,
      '/0.2/': v02,
      '/0.3/': v03,
      '/0.1/': v01,
    },

    outline: {
      level: 'deep'
    },

    footer: {
      message: 'Released under the <a href="https://opensource.org/licenses/mit" target="_blank">MIT License</a>.',
      copyright: `Copyright © ${new Date().getFullYear()} UnoPim`
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/unopim/unopim' }
    ],

    search: {
      provider: 'local'
    }
  }
})
