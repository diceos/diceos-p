let globalFeaturedImage = 'https://diceos.com/diceos-512.png'
let baseRoutes = [
  '/', '/zh', '/en',
  '/zh/dice',
  '/zh/profile', '/zh/signup', '/zh/login',
  '/zh/asset',
  '/zh/logs',
  '/zh/fairness', '/zh/maintenance',
  '/en/dice',
  '/en/profile', '/en/signup', '/en/login',
  '/en/asset',
  '/en/logs',
  '/en/fairness', '/en/maintenance'
]
module.exports = {
  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://diceos.com',
    cacheTime: 1000 * 60 * 15,
    generate: true,
    routes: baseRoutes
  },
  head: {
    title: 'DICEOS - Fast CLAM Dice Game - 2% House Edge - Roll the Dice!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Diceos' },
      { hid: 'og-image', property: 'og:image', content: globalFeaturedImage },
      { hid: 'og-type', property: 'og:type', content: 'Website' },
      { hid: 'og-site-name', property: 'og:site_name', content: 'DICEOS - A CLAM Dice Game' },
      { hid: 'twitter-card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter-image', name: 'twitter:image', content: globalFeaturedImage },
      { hid: 'robots', name: 'robots', content: 'index,follow' },
      { hid: 'mobile-web-app-capable', name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'apple-mobile-web-app-capable', name: 'apple-mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/diceos-64.png' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', href: '/diceos-512.png' }
    ]
  },
  css: [
    '~/assets/scss/index.scss'
  ],
  env: {
    maintenance: false,
    maintenanceEndTime: Date.now() + 1000 * 60 * 60,
    apiBase: process.env.API_BASE || 'https://api.diceos.com/api'
  },
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/vue-qr.js',
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/vue-tabs.js', ssr: false },
    { src: '~/plugins/vue-modal.js', ssr: false },
    { src: '~/plugins/vue-notification.js', ssr: false },
    { src: '~/plugins/storage.js', ssr: false }
  ],
  router: {
    middleware: ['i18n']
  },
  generate: {
    routes: routes
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'axios',
      'fingerprintjs2'
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

