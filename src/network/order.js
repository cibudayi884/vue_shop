import Vue from 'vue'
import axios from "axios";
//配置请求的路径
axios.defaults.baseURL = 'http://106.53.73.30:8888/api/private/v1/'

//添加拦截器田间token
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

//获取商品分类数据
export function getOrderList(Info) {
  return axios.get('orders',{params:Info})
}
//获取物流信息
export function getProgress() {
  return axios.get('/kuaidi/1106975712662')
}
//获取折线图数据
export function getMyChart() {
  return axios.get('reports/type/1')
}
