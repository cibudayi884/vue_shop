import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
