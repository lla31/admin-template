<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="教师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="教师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="教师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="讲师"/>
          <el-option :value="2" label="教授"/>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/teacherservice/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import teacher from '@/api/teacher'
    import ImageCropper from '@/components/ImageCropper'
    import PanThumb from '@/components/PanThumb'

    const defaultForm = {
      name: '',
      sort: 0,
      level: '',
      career: '',
      intro: '',
      avatar: ''
    }

    export default {
      name: "form",
      components: {ImageCropper,PanThumb},
      data() {
        return {
            BASE_API: process.env.BASE_API, // 取config/dev.env.js中的 接口API地址
            imagecropperShow:false,
            imagecropperKey:0,

            teacher: defaultForm
          }
        },
      watch: {
        $route(to,from) {
          console.log('watch $route')
          this.init()
        }
      },
      created() {
        this.init()
      },
      methods: {
        init() {
          if(this.$route.params && this.$route.params.id) {//修改按钮点击 数据回显
            const id = this.$route.params.id
            this.getTeacherById(id)
          } else {
            this.teacher = {...defaultForm}
          }
        },
        //保存按钮
        saveOrUpdate() {
          //表单页面接受两个来源的页面 1 空白表单页面的添加操作 2 由讲师列表的修改按钮跳转而来的 回显数据并修改的操作
          //进行不同操作的判断
          if(!this.teacher.id){
            this.saveTeacher()
          } else {
            this.updateTeacher()
          }

        },
        saveTeacher() {
          teacher.saveTeacher(this.teacher)
            .then(() => {
              //请求之后提示添加成功
                return this.$message({
                type: 'success',
                message: '添加成功!'
              })
            }).then(() => {
              //回到教师列表
              this.$router.push({path: '/teacher'})
             })
            .catch(() => {
              return this.$message({
                type: 'success',
                message: '添加失败'
              })
            })
        },
        getTeacherById(id) {
          teacher.getTeacherById(id)
            .then(resp => {
              this.teacher = resp.data.eduTeacher
            })
        },
        updateTeacher() {
          teacher.updateTeacherById(this.teacher.id,this.teacher)
            .then(() => {
              return this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }).then(() => {
              this.$router.push({path: '/teacher'})
          }).catch(() => {
              this.$message({
              type: 'error',
              message: '修改失败'
            })
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
          this.teacher.avatar = data.imageurl
          //重新加载上传弹框
          this.imagecropperKey = this.imagecropperKey + 1
        }

      }
    }
</script>

<style scoped>

</style>
