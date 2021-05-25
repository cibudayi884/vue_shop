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
//获取所有的商品分类列表数据
export function getAllCateList() {
  return axios.get('categories')
}
//获取参数列表数据
export function getParamsData(cateID,activeName) {
  return axios.get('categories/'+cateID+'/attributes',{
    params:{
      sel:activeName
    }
  })
}
export function addParams(cateID,params) {
  return axios.post('categories/'+cateID+'/attributes',params)
}

//获取当前参数的信息
export function getEditDialog(cateID,attrId,params){
  return axios.get('categories/'+cateID+'/attributes/'+attrId,params)
}
//提交修改参数信息
export function getEditParams(cateID,attrId,params){
  return axios.put('categories/'+cateID+'/attributes/'+attrId,params)
}

//根据Id删除对应的参数项
export function removeParams(cateID,attrId) {
  return axios.delete('categories/'+cateID+'/attributes/'+attrId)

}

//需要发起请求，保存这次操作
export function SaveAttrVals(cateID,attrId,params) {
  return axios.put('categories/'+cateID+'/attributes/'+attrId,params)
}

// 根据分页获取对应的商品列表
export function getGoodsList(params) {
  return axios.get('goods',params)
}

//根据id删除商品数据
export function removeById(id){
  return axios.delete('goods/'+id)
}

// 发起请求添加商品
export function addGoods(config) {
  return axios.post('goods/',config)
}
