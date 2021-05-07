<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolelist"
        border
        stripe
        style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',index1 === 0 ? 'bdtop' : '','vcenter']">
              <!-- 渲染一级权限 -->
                <el-col :span="5" >
                  <el-tag closable @close="removeRightId(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id" :class="[index2 === 0 ? '' : 'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightId(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            closable
                            v-for="(item3,index3) in item2.children"
                            :key="item3.id" @close="removeRightId(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          prop="level"
          label="操作">
          <template v-slot:default="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!--树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRolesList,addUser,removeRightById,getRightsTree,allRights} from "network/power";

  export default {
    name: "Rules",
    components:{
      getRolesList,
      addUser,
      removeRightById,
      getRightsTree,
      allRights
    },
    data() {
      return {
        // 所有角色列表数据
        rolelist: [],
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addUserForm: {
          roleName: '',
          roleDesc: ''
        },
        addUserFormRules:{
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '用户名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          roleDesc: [
            { required: true, message: '请输入角色描述', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '用户名的长度在6~15个字符之间',
              trigger: 'blur'
            }
            ]
        },
        setRightDialogVisible:false,
        //所有权限的数据
        rightslist:[],
        //树形控件的属性绑定对象
        treeProps:{
          children:'children',
          label:'authName'
        },
        // 默认选中的节点Id值数组
        defKeys:[],
        // 当前即将分配权限的角色id
        roleId:''
      }
    },
    created() {
      this.getRolesList()
    },
    methods:{
      async getRolesList(){
        const { data: res } = await getRolesList()
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }

        this.rolelist = res.data

        // console.log(this.rolelist)
      },
      // 点击按钮，添加新用户
      addUser() {
        this.$refs.addUserFormRef.validate(async valid => {
          if (!valid) return
          // 可以发起添加用户的网络请求
          const { data: res } = await addUser(this.addUserForm)

          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }

          this.$message.success('添加用户成功！')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
        })
      },
      // 监听修改用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addUserFormRef.resetFields()
      },
      // 根据Id删除对应的权限
      async removeRightId(roleId,rightId){
        // 弹框提示用户是否要删除
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除！')
        }
        // console.log('确认了删除')
        const {data:res} = await removeRightById(roleId.id,rightId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        // this.getRolesList()
        //返回的data,是当前角色下最新的权限数据，重新赋值即可
        roleId.children = res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role){
        this.roleId = role.id
        //获取所有的权限
        const {data:res} = await getRightsTree()
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        //把获取到的权限数据保存到 data 中以供页面使用
        this.rightslist = res.data

        // 递归获取三级节点的Id
        this.defKeys=[]
        this.getLeafKeys(role,this.defKeys)
        console.log(this.defKeys)
        this.setRightDialogVisible = true
      },
      // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
      getLeafKeys(node,arr) {
        // 如果当前 node 节点不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }

        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      //点击为角色分配权限
      async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        //以逗号拼接的字符串
        const str = keys.join(',')
        const {data:res} = await allRights(this.roleId,str)
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }

        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style scoped>
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
