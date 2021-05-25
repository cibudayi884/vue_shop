<template>
  <div>
     <!--订单列表数据 -->
    <el-table :data="orderlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot:default="scope">
          <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send">

      </el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template v-slot:default="scope">
          {{showDate(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {formatDate} from 'common/utils'
  export default {
    name: "OrderList",
    props:{
      orderlist:{
        type:Array,
        default:[]
      }
    },
    methods:{
      showDate(time){
        //1.先将时间戳转成Date对象
        const date = new Date(time * 1000)
        //2.将date进行格式化
        return formatDate(date,'yyyy-MM-dd hh:mm:ss') },
      //实现省市区数据联动效果
      showBox(){
        this.$bus.$emit('editShowBox')
      },
      //展示物流进度
      showProgressBox(){
        this.$bus.$emit('showProgress')
      }
    }
  }
</script>

<style scoped>

</style>
