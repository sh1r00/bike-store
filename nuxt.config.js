/*
import axios from 'axios'

const dynamicRoutes = () => {
  return axios.get('/getData').then(res => {
    return res.data.map(product => {
      return {
        route: '/product/' + product.name,
        payload: product
      }
    })
  })
}
*/
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    script: [{ src: 'https://js.stripe.com/v3' }],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Montserrat:300,600|PT+Serif&display=swap'
      }
    ]
  },

  generate: {
    fallback: true
    // routes: dynamicRoutes
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['normalize.css', { src: '@/assets/main.scss', lang: 'sass' }],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [`@/plugins/currency-filter.js`, '@/plugins/vee-validate.js'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: false,
    progress: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        // Extend fs for nuxt
        config.node = {
          fs: 'empty'
        }
      }
    }
  }
}
