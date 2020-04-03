<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="确认信息"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习"/>
      </el-form-item>

      <!-- 所属分类 TODO -->

      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select v-model="courseInfo.subjectParentId"
          placeholder="请选择" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in oneLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in twoLevelSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>


      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!--<el-form-item label="课程详情">
        <el-input v-model="courseInfo.description" placeholder=" 示例：从基础到搭建项目视频课程。"/>
      </el-form-item>-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/teacherservice/oss/upload?host=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>



      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import course from '@/api/course'
  import subject from '@/api/subject'
  import Tinymce from '@/components/Tinymce'

  const defaultForm = {
    title: '',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: '/static/111.png',
    price: 0
  }

    export default {
      components:{Tinymce},
        name: "info",
      data() {
          return {
            saveBtnDisabled:false, //按钮是否禁用
            courseInfo:defaultForm,
            oneLevelSubjectList:[],
            twoLevelSubjectList:[],

            teacherList:[],

            BASE_API: process.env.BASE_API // 接口API地址
          }
      },
      watch: {
        $route(to, from) {
          console.log('watch $route')
          this.init()
        }
      },
      created() {
          this.init()

      },
      methods:{
        //上传之前调用的方法
        beforeAvatarUpload() {

        },
        //上传成功后调用的方法
        handleAvatarSuccess(resp, file) {
          //将返回的图片路径添加到数据库中
          this.courseInfo.cover = resp.data.imageurl
        },
          //判断路由是否包含id
          init() {
            if(this.$route.params && this.$route.params.id) {
              //根据chapter中回传 的id查询，回显刚才保存的数据
              const id = this.$route.params.id
              //根据chapter传来的id 查询课程信息
              this.getIdCourse(id)
            }else {
              //如果没有id则，使表单清空
              this.courseInfo = {...defaultForm}
              //页面加载时调用 获取所有教师
              this.getTeacherList()
              //初始化一级分类
              this.getAllLevel()
            }
          },
        //根据课程id查询课程信息
        getIdCourse(id) {
          course.getCourseInfoById(id)
            .then(resp => {
              this.courseInfo = resp.data.courseInfoForm

              //查询所有一级分类
              subject.getAllSubjectList()
                .then(resp => {
                  this.oneLevelSubjectList = resp.data.OneSubjectDto
                  //遍历一级分类集合
                  for(let i=0;i<this.oneLevelSubjectList.length;i++) {
                    let levelOne = this.oneLevelSubjectList[i]
                    //根据课程表中的一级分类id 遍历找到一级分类信息
                    if(levelOne.id === this.courseInfo.subjectParentId) {
                      //获取这个一级分类里的二级分类
                      this.twoLevelSubjectList = levelOne.children
                    }
                  }
                })
              //页面加载时调用 获取所有教师
              this.getTeacherList()
            })
        },


        //二级分类
        subjectLevelOneChanged(value) { //value就是一级分类的id

            //根据id获取二级分类
          //遍历一级分类
          //获取每个一级分类
          //找到对应id值的一级分类，获取一级分类中的二级分类
          for(let i=0;this.oneLevelSubjectList.length;i++) {
            let levelone = this.oneLevelSubjectList[i]
            if(levelone.id === value) {
              this.twoLevelSubjectList = levelone.children
            }
          }
        },

        //获取所有分类
        getAllLevel() {
          subject.getAllSubjectList()
            .then(resp => {
              this.oneLevelSubjectList = resp.data.OneSubjectDto
            })
        },

          //获取所有教师，显示到下拉列表
        getTeacherList() {
          course.getAllTeacherList()
            .then(resp => {
              this.teacherList = resp.data.items
            })
            .catch(resp =>{

            })
        },

          //下一步按钮
        next() {
            if(!this.courseInfo.id) {
              this.addCourse()
            }else {
              this.updateCourse()
            }
        },
        //空白表单添加
        addCourse() {
          //调用
          course.addCourseInfo(this.courseInfo)
            .then(response => {
              console.log('*****￥￥￥ '+response.data.courseId)
              this.$message({
                type: 'success',
                message: '添加课程信息成功!'
              })
              //路由跳转，到编写大纲页面
              ////第一步，将courseId写入路径中，（变量名变成id)变成id（变成id的过程发生在router中）
              this.$router.push({path:'/course/chapter/'+response.data.courseId})
            })
            .catch(response => {
              console.log('###### '+response)
              this.$message({
                type: 'success',
                message: '添加课程信息失败!'
              })
            })
        },

        //（作为上一步）进行修改
        updateCourse() {
          course.updataCourseInfoById(this.courseInfo.id,this.courseInfo)
            .then(resp => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              //修改成功回到课程列表
              this.$router.push({path:'/course'})
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '修改失败'
              })
            })
        }


      }



    }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
