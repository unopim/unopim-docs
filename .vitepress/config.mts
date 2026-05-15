import { defineConfig } from 'vitepress'


import v1 from './version-configs/1.0'
import v2 from './version-configs/2.0'
import v21 from './version-configs/2.1'


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

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.ico' }],
    [
      'script',
      {},
      `
        (function() {
            var script = document.createElement('script');
            script.innerHTML = 'window.chatbotConfig = { url: "https://ask.unopim.com:5001/chat", logoUrl: "https://docs.unopim.com/logoBot.png" };';
            document.head.appendChild(script);
        })();
      `
    ]
  ],

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
      { text: 'Extensions Doc', link: 'http://docs-extensions.unopim.com/' },
      { text: 'Contact Us', link: 'https://unopim.com/en/contacts/' },
      { text: 'Contribute', link: 'https://github.com/unopim/unopim' },
    ],

    sidebar: {
      '/2.1/': v21,
      '/2.0/': v2,
      '/1.0/': v1,
    },


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


   
    outline: {
      level: 'deep'
    },

    footer: {
      message: 'Released under the <a href="https://opensource.org/licenses/mit" target="_blank">MIT License</a>.',
      copyright: `Copyright © ${new Date().getFullYear()} UnoPim`
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    lineNumbers: false
  }
})
