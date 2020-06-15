
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-leaflet',
    // [
    //   '@nuxtjs/firebase',
    //   {
    //     config: {
    //       apiKey: "AIzaSyBGEah_5omm5NtPOODFPlRkUOw5nef3oYA",
    //       authDomain: "nn-projects-2.firebaseapp.com",
    //       databaseURL: "https://nn-projects-2.firebaseio.com",
    //       projectId: "nn-projects-2",
    //       storageBucket: "nn-projects-2.appspot.com",
    //       messagingSenderId: "710752818845",
    //       appId: "1:710752818845:web:b29f1167f38b55af21e674",
    //       measurementId: "G-6Q547468F2"
    //     },
    //     services: {
    //       firestore: true,
    //     }
    //   }
    // ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
