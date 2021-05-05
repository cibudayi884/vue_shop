<template>
  <el-header>
    <div>
      <img src="~/assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
  export default {
    name: "NavBar",
    methods:{
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-header{
    background-color: #373d41;
   /* height: 60px;
    line-height: 60px;*/
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
    .el-button{
      width: 66px;
      height: 40px;
      margin-top: 10px;

    }
  }
</style>
