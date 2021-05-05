import Vue from 'vue'
import axios from "axios";
//配置请求的路径
axios.defaults.baseURL = 'http://106.53.73.30:8888/api/private/v1/'

//添加拦截器田间token
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios
//请求验证接口
export function getDept(config) {
  return axios.post('/login',config)
}

export function getMenuList() {
  return axios.get('/menus')
}

/*export function getUserList(params) {
  return axios.get('/users',{params})
}*/

/*
export function changeUser() {
  return axios
}*/
