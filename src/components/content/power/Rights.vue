<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getRightsList} from "network/power";

  export default {
    name: "Rights",
    components:{
      getRightsList
    },
    data() {
      return {
        // 权限列表
        rightsList: []
      }
    },
    created() {
      // 获取所有的权限
      this.getRightsList()
    },
    methods:{
      // 获取权限列表
      async getRightsList(){
        const {data:res} = await getRightsList()
        if (res.meta.status !== 200){
          return this.$message.error('获取权限列表失败！')
        }
        this.rightsList = res.data
        // console.log(this.rightsList)
      }
    }
  }
</script>

<style scoped>

</style>
