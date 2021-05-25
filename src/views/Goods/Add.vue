<template>
  <div>
    <!-- 面包屑导航区域 -->
    <nav-bar>
      <template v-slot:first>首页</template>
      <template v-slot:second>商品管理</template>
      <template v-slot:third>参数列表</template>
    </nav-bar>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        closable center>
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
      <el-tabs v-model='activeIndex' :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="catelist"
              :props="addProps"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 渲染表单的Item项 -->
          <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,index1) in item.attr_vals" :key="index1"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <up-load-picture
            @Successhandle="Handlepicture"
            @Removehandle="Removepicture"
            @Previewhandle="Previewpicture"
            :preview-path="previewPath"></up-load-picture>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <text-edit :add-form="addForm" @addGoods="add"></text-edit>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import NavBar from "components/common/NavBar/NavBar";
  import UpLoadPicture from "./addchild/UpLoadPicture";
  import TextEdit from "./addchild/TextEdit";
  import {getAllCateList,getParamsData,addGoods} from 'network/goods';
  import _ from 'lodash'
  export default {
    name: "Add",
    components:{
      NavBar,
      getAllCateList,
      getParamsData,
      UpLoadPicture,
      TextEdit,
      addGoods
    },
    data(){
      return{
        activeIndex:'0',
        // 添加商品的表单数据对象
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          //商品所属的分类数组
          goods_cat: [],
          pics:[],
          // 商品的详情描述
          goods_introduce: '',
          attrs:[]
        },
        addFormRules: {
          goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_cat: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ]
        },
        catelist:[],
        addProps:{
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger:'hover',
          checkStrictly:true
        },
        manyTableData:[],
        onlyTableData:[],
        //图片预览路径
        previewPath:'',
      }
    },
    created() {
      this.getAllCateList()
    },
    methods:{
      // 获取所有的商品分类列表
      async getAllCateList(){
        const { data: res } = await getAllCateList()
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }

        this.catelist = res.data

        // console.log(this.catelist)
      },
      // 级联选择器选中项变化，会触发这个函数
      handleChange(){
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length !== 3){
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName,oldActiveName){
        // console.log('即将离开的标签页名字是：' + oldActiveName)
        // console.log('即将进入的标签页名字是：' + activeName)
        // return false
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
          this.$message.error('请先选择商品分类！ ')
          return false
        }
      },
      //获取参数列表数据
      async tabClicked(){
        if (this.activeIndex === '1'){
          const {data:res} =await getParamsData(this.cateID,'many')
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数列表失败！')
          }
          res.data.forEach(item=>{
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          })
          this.manyTableData = res.data
          console.log(this.manyTableData)
        }else if (this.activeIndex === '2'){
          const {data:res} =await getParamsData(this.cateID,'only')
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性失败！')
          }

          console.log(res.data)
          this.onlyTableData = res.data
        }

      },
      Handlepicture(response){
        // console.log(response)
        // 1. 拼接得到一个图片信息对象
        const picInfo = {
          pic: response.data.tmp_path
        }
        // 2. 将图片信息对象，push 到pics数组中
        this.addForm.pics.push(picInfo)
        console.log(this.addForm)
      },
      Removepicture(file){
        console.log(file)
        // 1. 获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2. 从 pics 数组中，找到这个图片对应的索引值
        const i = this.addForm.pics.findIndex(x => x.pics === filePath)
        // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
        this.addForm.pics.splice(i,1)
        console.log(this.addForm)
      },
      Previewpicture(file){
        console.log(file)
        this.previewPath = 'http://106.53.73.30:8888/'+file.response.data.tmp_path
      },
      //添加商品
      add(){
       this.$refs.addFormRef.validate(async valid =>{
         if (!valid) {
           return this.$message.error('请填写必要的表单项！')
         }
         // 执行添加的业务逻辑
         // lodash   cloneDeep(obj)
         const form = _.cloneDeep(this.addForm)
         form.goods_cat = form.goods_cat.join(',')
         //处理动态参数
         this.manyTableData.forEach(item=>{
           const newInfo = {
             attr_id : item.attr_id,
             attr_value:item.attr_vals.join(' ')
           }
           this.addForm.attrs.push(newInfo)
         })
         //处理静态属性
         this.onlyTableData.forEach(item=>{
           const newInfo = {
             attr_id : item.attr_id,
             attr_value:item.attr_vals
           }
           this.addForm.attrs.push(newInfo)
         })
         //form与this.addForm不相关
         form.attrs = this.addForm.attrs
         // 发起请求添加商品
         // 商品的名称，必须是唯一的
         const {data :res} = await addGoods(form)
         if (res.meta.status !== 201) {
           return this.$message.error('添加商品失败！')
         }

         this.$message.success('添加商品成功！')
         this.$router.push('/goods')
       })
      }
    },
    computed:{
      cateID(){
        if (this.addForm.goods_cat.length === 3){
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>

<style scoped>

</style>
