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
export function getCateList(Info) {
  return axios.get('categories',{params:Info})
}
//获取父级分类数据
export function getParentCateList() {
  return axios.get('categories',{
    params:{
      type:2
    }
  })
}
//添加新的分类
export function addCate(addCateForm) {
  return axios.post('categories',addCateForm)
}
