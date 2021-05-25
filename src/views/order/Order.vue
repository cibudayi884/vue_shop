<template>
  <div>
    <!-- 面包屑导航区域 -->
    <nav-bar>
      <template v-slot:first>首页</template>
      <template v-slot:second>订单管理</template>
      <template v-slot:third>订单列表</template>
    </nav-bar>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据 -->
      <order-list :orderlist="orderlist"></order-list>
      <!-- 分页区域 -->
      <pagination
        :query-info="queryInfo"
        :total="total" @SizeChange="handleSizeChange"
        @CurrentChange="handleCurrentChange"></pagination>

      <!--对话框区域-->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressRules" ref="addressRuleForm" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
              <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
<!--      <dialog :address-visible="addressVisible"></dialog>-->
      <!--物流进度对话框-->
      <el-dialog
        title="提示"
        :visible.sync="progressVisible"
        width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progress.data"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import NavBar from "components/common/NavBar/NavBar";
  import OrderList from "./children/OrderList";
  import Pagination from "./children/Pagination";
  import Dialog from "./children/Dialog";
  import cityData from './citydata.js'
  import progress from "./children/progress";
  import {getOrderList,getProgress} from 'network/order';

  export default {
    name: "Order",
    components:{
      NavBar,
      getOrderList,
      OrderList,
      Pagination,
      Dialog,
      getProgress
    },
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        total:0,
        orderlist:[],
        addressVisible:false,
        addressForm:{
          address1:'',
          address2:''
        },
        addressRules:{
          address1: [
            { required: true, message: '请选择省市区县', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        cityData,
        progress,
        progressVisible:false
      }
    },
    mounted() {
      this.$bus.$on('editShowBox',()=>{
        this.addressVisible = true;
      })
      this.$bus.$on('showProgress',()=>{
        this.progressVisible = true;
      })
    },
    created() {
      this.getOrderList();
    },
    methods:{
      async getOrderList(){
        const { data: res } = await getOrderList(this.queryInfo)
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        console.log(res)
        this.total = res.data.total
        this.orderlist = res.data.goods

      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getOrderList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getOrderList()
      },
      addressDialogClosed(){
        this.$refs.addressRuleForm.resetFields()
      },


    }
  }
</script>

<style scoped>
  @import "../../plugins/timeline/timeline.css";
  @import "../../plugins/timeline-item/timeline-item(1).css";
  .el-cascader{
    width: 100%;
  }
</style>
