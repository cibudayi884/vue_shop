<template>
  <el-container class="home-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse='isCollapse'
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id"
          >
            <!--一级菜单的模版-->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/'+ subitem.id+''"
              v-for="subitem in item.children"
              :key="subitem.id"
              >
              <!--二级菜单的模版-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span @click="Togglepath(subitem.path)">{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>

  </el-container>
</template>

<script>
  import {getMenuList} from "../../network";
  import User from "../../views/users/User";
  export default {
    name: "Container",
    data() {
      return {
        muneData:{},
        // 左侧菜单数据
        menulist: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        // 是否折叠
        isCollapse: false,
        // 被激活的链接地址
        activePath: ''
      }
    },
    components:{
      getMenuList,
      User
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        // 获取所有的菜单
        async getMenuList() {
          const { data: res } = await this.$http.get('menus')
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.menulist = res.data
          // console.log(res)
        },
        /*
         getMenuList(){
         getMenuList().then(res=>{
          this.muneData = res.data
          if (this.muneData.meta.status !== 200) return this.$message.error(this.muneData.meta.msg)
          this.menulist = this.muneData.data
          // console.log(this.menulist)
        })
      },*/
      // 点击按钮，切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //路由跳转
      Togglepath(index){
        this.$router.push(index)
        window.sessionStorage.setItem('activePath',index)
        // this.activePath = index
      }
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100vh;
  }
  .el-aside{
    background-color: #333744;
    float: left;
  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: #eaedf1;
    float: left;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
