import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'

import './plugins/element.js'

import axios from "axios";
//配置请求的路径
axios.defaults.baseURL = 'http://106.53.73.30:8888/api/private/v1/'
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
