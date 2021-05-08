import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
