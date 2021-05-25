<template>
  <div class="page">
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props:{
      queryInfo:{
        type:Object,
        default: {}
      },
      total:{
        type:Number,
        default: 0
      }
    },
    methods:{
      handleSizeChange(newSize){
        this.$emit('SizeChange',newSize)
      },
      handleCurrentChange(newPage){
        this.$emit('CurrentChange',newPage)
      }
    }
  }
</script>

<style scoped>
  .page{
    margin-top: 15px;
  }
</style>
