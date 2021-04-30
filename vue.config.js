module.exports = {
  configureWebpack:{
    resolve:{
      extensions:[],  //设置省略后缀名
      alias:{
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views',

      }
    }
  }
}


