<template>
  <div>
    <el-upload
      :action="uploadURL"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      list-type="picture"
      :headers="uploadHeader"
      :on-success="handleSuccess">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <!--图片预览 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <img :src='previewPath' alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UpLoadPicture",
    data(){
      return{
        // 上传图片的URL地址
        uploadURL:'http://106.53.73.30:8888/api/private/v1/upload',
        fileList:[],
        // 图片上传组件的headers请求头对象
        uploadHeader:{
          Authorization:window.sessionStorage.getItem('token')
        },
        dialogVisible:false
      }
    },
    props:{
      previewPath:{
        type:String,
        default:''
      }
    },
    methods:{
      handleSuccess(response){
        this.$emit('Successhandle',response)
      },
      handleRemove(file){
        this.$emit('Removehandle',file)
      },
      handlePreview(file){
        this.$emit('Previewhandle',file)
        this.dialogVisible = true
      }

    }
  }
</script>

<style scoped>

</style>
