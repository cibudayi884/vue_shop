<template>
  <div class="home">
    <!-- 头部区域 -->
    <nav-bar></nav-bar>
    <!-- 页面主体区域 -->
    <container></container>
  </div>
</template>

<script>
  import NavBar from "components/content/NavBar";
  import Container from "components/content/Container";
  export default {
    name: "Home",
    components:{
      NavBar,
      Container
    }
  }
</script>

<style lang="less" scoped>

</style>
