import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 NProgress 对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 每次调用 API 时都要验证请求头是否有token 登陆时存入session
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // request 拦截器中 展示进度条
  NProgress.start()
  // 最后必须return config
  return config
})
axios.interceptors.response.use(config => {
  // response 拦截器中 隐藏进度条
  NProgress.done()
  return config
})

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
