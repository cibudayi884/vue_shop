<template>
  <div>
    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
  </div>
</template>

<script>
  export default {
    name: "TextEdit",
    props:{
      addForm:{
        type:Object,
        default(){
          return Object
        }
      }
    },
    methods:{
      add(){
        this.$emit('addGoods')
      }
    }
  }
</script>

<style scoped>

</style>
