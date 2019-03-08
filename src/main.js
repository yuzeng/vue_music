import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
// import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './common/stylus/index.styl'
// import router from './router'
// Vue.config.productionTip = false
// fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
