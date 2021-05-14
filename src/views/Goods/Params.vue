<template>
  <div>
    <!-- 面包屑导航区域 -->
    <nav-bar>
      <template v-slot:first>首页</template>
      <template v-slot:second>商品管理</template>
      <template v-slot:third>参数列表</template>
    </nav-bar>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数"
        type="warning" :closable="false">
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="add_sort">
        <el-col>
          <span>选择商品分类：</span>
        </el-col>
        <!--选择商品分类的级联选择框-->
        <el-cascader
          v-model="selectedCateKeys"
          :options="catelist"
          :props="cateProps"
          @change="handleChange"></el-cascader>
      </el-row>
      <!--tab页面区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="参数名称" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button size="mini" type="primary" class="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" class="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
                </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!--添加参数/属性对话框 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <el-form :model="addRuleForm" :rules="addFoemRules" ref="addRuleFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改参数的对话框 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <el-form :model="editRuleForm" :rules="editFormRules" ref="editRuleFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editRuleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import NavBar from "../../components/common/NavBar/NavBar";
  import {getAllCateList,getParamsData,addParams,getEditDialog,getEditParams,removeParams,SaveAttrVals} from 'network/goods'
  export default {
    name: "Params",
    components:{
      NavBar,
      getAllCateList,
      getParamsData,
      addParams,
      getEditDialog,
      getEditParams,
      removeParams,
      SaveAttrVals
    },
    data(){
      return{
        // 商品分类列表
        catelist: [],
        // 级联选择框的配置对象
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger:'hover',
          checkStrictly:true

        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys:[],
        activeName:'many',
        // 动态参数的数据
        manyTableData: [],
        // 静态属性的数据
        onlyTableData: [],
        addDialogVisible:false,
        addRuleForm: {
          attr_name: ''
        },
        addFoemRules:{
          attr_name: [
            {required:true, message:'请输入参数名称',trigger:'blur'}
          ]
        },
        editDialogVisible:false,
        editRuleForm:{
        },
        editFormRules:{
          attr_name: [
            {required:true, message:'请输入参数名称',trigger:'blur'}
          ]
        }
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
      //级联选择框选中项变化，会触发这个函数
      handleChange(){
        this.getParamsData()
      },
      handleTabClick(){
        console.log(this.activeName)
        this.getParamsData()
      },
      //获取参数列表数据
      async getParamsData(){
        // 证明选中的不是三级分类
        if (this.selectedCateKeys.length !==3){
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        // 证明选中的是三级分类
        const {data:res} =await getParamsData(this.cateID,this.activeName)
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })

        console.log(res.data)
        //将获取到的数据挂载到不同的数据源上
        if (this.activeName === "many"){
          this.manyTableData = res.data
        }else {
          this.onlyTableData = res.data
        }
      },
      //监听对话框的关闭事件
      addDialogClosed(){
        this.$refs.addRuleFormRef.resetFields()
      },
      addParams(){
        this.$refs.addRuleFormRef.validate(async valid=>{
          if (!valid) return
          const {data:res} = await addParams(this.cateID,{
            attr_name:this.addRuleForm.attr_name,
            attr_sel:this.activeName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败！')
          }

          this.$message.success('添加参数成功！')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      // 点击按钮，展示修改的对话框
      async showEditDialog(attrID){
        // 查询当前参数的信息
        const { data: res } = await getEditDialog(this.cateID,attrID,{
            attr_sel:this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败！')
        }

        this.editRuleForm = res.data
        this.editDialogVisible = true
      },
      // 重置修改的表单
      editDialogClosed(){
        this.$refs.editRuleFormRef.resetFields()
      },
      // 点击按钮，修改参数信息
      editParams(){
        this.$refs.editRuleFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await getEditParams(this.cateID,this.editRuleForm.attr_id,{
            attr_name:this.editRuleForm.attr_name,
            attr_sel:this.activeName
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }
          console.log(res)
          this.$message.success('修改参数成功！')
          this.getParamsData()
          this.editDialogVisible = false
        })
        },
      // 根据Id删除对应的参数项
      async removeParams(attrID){
        const confirmResult = await this.$confirm(
          '此操作将永久删除该参数, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)

        // 用户取消了删除的操作
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        // 删除的业务逻辑
        const { data: res } = await removeParams(this.cateID,attrID)
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }

        this.$message.success('删除参数成功！')
        this.getParamsData()
      },
      // 文本框失去焦点，或摁下了 Enter 都会触发
      handleInputConfirm(row){
        if (row.inputValue.trim().length === 0){
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        // 如果没有return，则证明输入的内容，需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 需要发起请求，保存这次操作
        this.saveAttrVals(row)
      },
      //将对attr_vals的操作，保存到数据库
      async saveAttrVals(row){
        const { data: res } = await SaveAttrVals(this.cateID,row.attr_id,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        console.log(res)
        this.$message.success('修改参数项成功！')
      },
      showInput(row){
        row.inputVisible = true
        // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除参数下的可选项
      handleClose(index,row){
        row.attr_vals.splice(index,1)
        this.saveAttrVals(row)
      }
    },
    computed:{
      isBtnDisabled(){
        if (this.selectedCateKeys.length !== 3){
          return true
        }
        return false
      },
      cateID(){
        if (this.selectedCateKeys.length === 3){
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText(){
        if (this.activeName === "many"){
          return '动态参数'
        }
        return '静态属性'
      }
    }

  }
</script>

<style scoped>
  .add_sort{
    margin-top: 15px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
