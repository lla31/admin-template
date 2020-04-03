<template>
  <div>
    <!--上传-->
    <el-form>
      <!-- 轮播图上传 -->
      <el-form-item label="首页轮播图">
        <span>建议尺寸高宽比 1:2.5</span>
        <!-- 头衔缩略图 -->
        <!--<pan-thumb :image="teacher.avatar"/>-->
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">添加轮播图
        </el-button>
        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="750"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/teacherservice/edu-lunbotu/lunbotuUpload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList">

      <el-table-column label="轮播图预览" width="800" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.lunbotuImgurl" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <span>{{ scope.row.lunbotuImgname }}</span>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import homeinfo from "@/api/homeinfo";
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
    export default {
        name: "upload",
      components: {ImageCropper,PanThumb},
      data() {
        return {
          BASE_API: process.env.BASE_API, // 取config/dev.env.js中的 接口API地址
          imagecropperShow:false,
          imagecropperKey:0,

          //列表
          list:[]

        }
      },
      created() {
          this.getLunbotuList()
      },
      methods: {
        getLunbotuList(){
          homeinfo.getLunbotuList()
            .then(resp => {
              this.list = resp.data.lunbotuList
            })
        },
        close() {
          //关闭头像弹出框】
          this.imagecropperShow =false
          //重新加载上传弹框
          this.imagecropperKey = this.imagecropperKey + 1
        },
        cropSuccess(data) {
          console.log(data)
          this.imagecropperShow =false
          //回显图片
          this.list.lunbotuImgurl = data.lunbotuImgurl
          //重新加载上传弹框
          this.imagecropperKey = this.imagecropperKey + 1
          this.getLunbotuList()
        },
        removeDataById(id){
          homeinfo.deleteOneLunbotu(id)
            .then(resp => {
              this.getLunbotuList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(resp => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })

        }
      }
    }
</script>

<style scoped>

</style>
