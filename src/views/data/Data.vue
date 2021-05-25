<template>
 <div>
  <!-- 面包屑导航区域 -->
  <nav-bar>
   <template v-slot:first>首页</template>
   <template v-slot:second>商品管理</template>
   <template v-slot:third>参数列表</template>
  </nav-bar>
  <!-- 卡片视图区域 -->
  <el-card>
   <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
   <div id="main" style="width: 600px;height:400px;"></div>

  </el-card>
 </div>
</template>

<script>
 //1.导入 echarts
 import * as echarts from 'echarts'
 import NavBar from "components/common/NavBar/NavBar";
 import {getMyChart} from "network/order"
 import _ from "lodash"
 export default {
   name: "Data",
   components:{
     NavBar,
     getMyChart
   },
  data(){
    return{
     options: {
      title: {
       text: '用户来源'
      },
      tooltip: {
       trigger: 'axis',
       axisPointer: {
        type: 'cross',
        label: {
         backgroundColor: '#E9EEF3'
        }
       }
      },
      grid: {
       left: '3%',
       right: '4%',
       bottom: '3%',
       containLabel: true
      },
      xAxis: [
       {
        boundaryGap: false
       }
      ],
      yAxis: [
       {
        type: 'value'
       }
      ]
     }
    }
  },
  //此时，页面上的元素，已经被渲染完成了
  async mounted() {
   //3.基于准备好的dom，初始化echarts实例
   var myChart = echarts.init(document.getElementById('main'));

   const {data:res} = await getMyChart()
   if (res.meta.status !== 200) {
    return this.$message.error('获取折线图数据失败！')
   }
   const result = _.merge(res.data,this.options)
   //4.准备配置项和数据
  /* var option = {
    title: {
     text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
     data:['销量']
    },
    xAxis: {
     data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [{
     name: '销量',
     type: 'bar',
     data: [5, 20, 36, 10, 10, 20]
    }]
   };*/
   //5.使用刚指定的配置项和数据显示图表。
   myChart.setOption(result);
  }
 }
</script>

<style scoped>

</style>
