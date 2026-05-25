import { defineConfig } from 'vitepress'


import v01 from './version-configs/0.1'
import v02 from './version-configs/0.2'
import v03 from './version-configs/0.3'
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
          try {
            var path = window.location.pathname;
            var search = window.location.search || '';
            var hash = window.location.hash || '';
            var LATEST = '2.1';
            var LANDING = '/prologue/';
            var m;

            // /master or /master/<rest> -> /<LATEST>/<rest>
            // Bare /master or /master/ lands on the LATEST docs landing page.
            m = path.match(/^\\/master(\\/.*)?$/);
            if (m) {
              var rest = m[1] && m[1] !== '/' ? m[1] : LANDING;
              window.location.replace('/' + LATEST + rest + search + hash);
              return;
            }

            // /<X.Y>.x/<rest> -> /<X.Y>/<rest>   (e.g. /1.0.x/foo -> /1.0/foo)
            // Bare /<X.Y>.x or /<X.Y>.x/ lands on that version's landing page.
            m = path.match(/^\\/(\\d+\\.\\d+)\\.x(\\/.*)?$/);
            if (m) {
              var rest2 = m[2] && m[2] !== '/' ? m[2] : LANDING;
              window.location.replace('/' + m[1] + rest2 + search + hash);
              return;
            }
          } catch (e) { /* no-op */ }
        })();
      `
    ],
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
      '/0.3/': v03,
      '/0.2/': v02,
      '/0.1/': v01,
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
