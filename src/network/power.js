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

// 获取权限列表数据
export function getRightsList() {
  return axios.get('rights/list')
}
// 获取所有角色的列表数据
export function getRolesList() {
  return axios.get('roles')
}
//添加新用户
export function addUser(config) {
  return axios.post('roles',config)
}
//根据Id删除对应的权限
export function removeRightById(a,b) {
  return axios.delete('roles/'+a+'/rights/'+b)
}
// 获取权限树数据
export function getRightsTree() {
  return axios.get('rights/tree')
}
//点击为角色分配权限
export function allRights(roleId,config) {
  return axios.post('roles/'+roleId+'/rights',{rids:config})
}
