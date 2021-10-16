// import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#0039b3',
        secondary: '#75787B',
        anchor: '#8c9eff',
        dark: '#434343',
      },
    },
    icons: {
      iconfont: 'mdi', // default - only for display purposes
    },
  },
});

export default vuetify;
