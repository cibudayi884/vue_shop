<template>
  <div class="nav-bar">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <slot name="first"></slot>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="second"></slot>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot name="third"></slot>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style scoped>

</style>
