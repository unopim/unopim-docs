module.exports = {
    base: '/',
    port: '8080',
    cache: false,
    title: 'UnoPim Documentation',
    description: 'UnoPim Developer Portal',
    head: [
        ['link', { rel: "icon", type: "image/png", href: "/favicon.ico" }],
    ],
    themeConfig: {
        smoothScroll: true,
        lastUpdated: 'Last Updated',
        repo: 'unopim/unopim',
        repoLabel: 'Contribute to UnoPim',
        docsRepo: 'unopim/unopim-docs',
        docsDir: 'docs',
        docsBranch: 'main',
        editLinks: true,
        editLinkText: 'Help us improve this page on Github.',

        logo: '/logo.png',
        nav: [
            { text: 'Home', link: '/' }
        ],

        contactUs: { text: 'Contact Us', link: 'https://unopim.com/en/contacts/' },

        sidebar: {
            '/0.1/': require('./version-configs/0.1'),
            '/master/': require('./version-configs/master')
        }
    },
    markdown: {
        lineNumbers: false
    },
    plugins: ['@vuepress/pwa', 'copy-code', '@vuepress/back-to-top']
};
