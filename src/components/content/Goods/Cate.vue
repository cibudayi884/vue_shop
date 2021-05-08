<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable">
        <!--是否有效-->
        <template v-slot:isok="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!--排序-->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template v-slot:opt="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类的对话框-->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addUserFormRef" label-width="90px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCatChanged"
            style="width: 100%"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getCateList,getParentCateList,addCate} from 'network/goods'
  export default {
    name: "Cate",
    components:{
      getCateList,
      getParentCateList,
      addCate
    },
    data(){
      return{
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        // 商品分类的数据列表，默认为空
        catelist: [],
        // 总数据条数
        total: 0,
        columns:[
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'order'
          },
          {
            label: '操作',
            // 表示，将当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'opt'
          }
        ],
        //控制分类对话框的显示和隐藏
        addCateDialogVisible:false,
        addCateForm:{
          // 将要添加的分类的名称
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          // 分类的等级，默认要添加的是1级分类
          cat_level: 0
        },
        addCateFormRules:{
          cat_name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ]
        },
        // 选中的父级分类的Id数组
        parentCateList:[],
        // 指定级联选择器的配置对象
        cascaderProps:{
          value:'cat_id',
          children:'children',
          expandTrigger:'hover',
          label:'cat_name',
          checkStrictly:true
        },
        // 选中的父级分类的Id数组
        selectedKeys:[]
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await getCateList(this.queryInfo)
        if (res.meta.status !== 200){
          return this.$message.error('获取商品分类失败！')
        }
        // 把数据列表，赋值给 catelist
        this.catelist = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
        console.log(this.catelist)
      },
      //监听pagesize的改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      showAddCateDialog(){
        // 先获取父级分类的数据列表
        this.getParentCateList()
        // 再展示出对话框
        this.addCateDialogVisible = true
      },
      async getParentCateList(){
        const { data: res } = await getParentCateList()
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败！')
        }
        console.log(res.data)
        //保存到data中以供选择父级分类使用
        this.parentCateList = res.data
      },
      // 选择项发生变化触发这个函数
      parentCatChanged(){
        // console.log(this.selectedKeys)
        // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
        // 反之，就说明没有选中任何父级分类
        if (this.selectedKeys.length>0){
          // 父级分类的Id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
        }else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0

        }
      },
      addCate(){
        this.$refs.addUserFormRef.validate(async valid=>{
          if (!valid) return
          const { data: res } = await addCate(this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      },
      addCateDialogClosed(){
        this.$refs.addUserFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    }
  }
</script>

<style scoped>
  .treeTable{
    margin-top: 15px;
  }
</style>
