<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="确认信息"/>
    </el-steps>

    <el-button type="text" @click="beforeAddChapter()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>{{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="openaddVideoDialog(chapter.id)">添加小节</el-button>
                <el-button @click="getChapterById(chapter.id)">编辑</el-button>
                <button type="text" @click="removeChapter(chapter.id)">删除</button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="openeditVideoDialog(video.id)">编辑</el-button>
                        <el-button type="text"@click="removeVideo(video.id)">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <!--<div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>-->
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节和视频 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <!-- 添加小节视频 开始-->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vidservice/vod/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
        <!-- 添加小节视频 结束-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import chapter from '@/api/chapter'
  import video from '@/api/video'


  export default {
        name: "chapter",
      data() {
        return {
          id:'',  //定义id 用来存储上一步传来的course_id
          chapterVideoList: [], // 章节嵌套视频列表

          video: {
            title: '',
            sort: '',
            chapterId: '',
            courseId: '',
            videoSourceId: '',
            videoOriginalName: ''//阿里云中的视频名称
          },

          chapter: {
            title: '',
            sort: 0,
            courseId:''
          },
          dialogChapterFormVisible: false, //是否显示章节表单
          dialogVideoFormVisible: false, //添加&修改视频表单

          BASE_API: process.env.BASE_API, // 取config/dev.env.js中的 接口API地址
          fileList:[] //element-ui的上传组件中的文件列表
        }
      },
      created() {
        this.init() //路由中获取到id

      },
      methods: {

        //添加&修改小节
        saveOrUpdateVideo() {
          //判断是修改还是添加
          if(!this.video.id){
            this.addVideo()
          }else {
            this.updateVideo()
          }
        },
        //修改
        //1 (打开dialog）回显数据
        openeditVideoDialog(videoId) {
          this.dialogVideoFormVisible = true
          video.getVideo(videoId)
            .then(resp => {
              this.video = resp.data.eduVideo
              //把视频文件名称设置到fileList里面
              this.fileList = [{'name':this.video.videoOriginalName}]
            })
        },
        //2 修改
        updateVideo() {
          video.updateVideo(this.video)
            .then(resp => {
              //关闭弹框
              this.dialogVideoFormVisible = false
              //提示成功
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '修改失败'
              })
            })
        },

        //添加（不同按钮触发同一事件，上一次填写的信息 需要被清空
        //（位于章节部分的添加操作）打开添加小节弹框
        openaddVideoDialog(chapterid) {
          this.dialogVideoFormVisible = true
          //获取所属章节id
          this.video.chapterId = chapterid
          //清空小节对象(chapterId除外)
          this.video.courseId = ''
          this.video.sort = ''
          this.video.title = ''
          this.video.id = ''
          this.fileList = []
        },
        //添加小节
        addVideo() {
          //赋值courseId
          this.video.courseId = this.id

          video.addVideo(this.video)
            .then(resp => {
              //关闭弹框
              this.dialogVideoFormVisible = false
              //提示成功
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '添加失败'
              })
            })
        },

        //删除小节
        removeVideo(videoId) {

          this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //调用方法进行删除
            //return 表示后面then还会执行
            return video.deleteVideo(videoId)
          }).then(() => {
            //刷新整个页面
            this.getChapterVideoId(this.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(resp => {
            //判断点击取消，还是删除失败
            if (resp === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        },


          //删除章节
        removeChapter(chapterId){
            this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //调用方法进行删除
              //return 表示后面then还会执行
              return chapter.deleteChapter(chapterId)
            }).then(() => {
              //刷新整个页面
              this.getChapterVideoId(this.id)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }).catch(resp => {
              //判断点击取消，还是删除失败
              if (resp === 'cancel') {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败'
                })
              }
            })
          },
        //弹框中，保存&修改 章节的方法
        saveOrUpdate() {
          //判断是修改还是添加
          if(!this.chapter.id) {
            this.saveChapter()
          }else {
            this.updateChapter()
          }

        },
        //编辑按钮：点击编辑，弹框，根据章节id，回显数据
        getChapterById(chapterId) {
          //alert(chapterId)
          //根据chapterid查询章节
          this.dialogChapterFormVisible = true
          //根据id查询章节信息
          chapter.getChapter(chapterId)
            .then(resp => {
              this.chapter = resp.data.eduChapter
            })
        },
        //编辑按钮
        updateChapter() {
          chapter.updateChapter(this.chapter)
            .then(resp => {
              //关闭弹框
              this.dialogChapterFormVisible = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '修改失败'
              })
            })
        },
        beforeAddChapter() {
          //弹框
          this.dialogChapterFormVisible = true
          //清空表单
          this.chapter.sort = ''
          this.chapter.courseId =''
          this.chapter.title = ''
          this.chapter.id = ''
        },
        //添加
        saveChapter() {
          //设置课程id
          this.chapter.courseId = this.id

          chapter.addChapter(this.chapter)
            .then(resp => {
              //关闭弹框
              this.dialogChapterFormVisible = false
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              //刷新页面
              this.getChapterVideoId(this.id)
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '章节信息添加失败'
              })
            })
        },
        //根据课程id查询章节和小节
        getChapterVideoId(id) {
          chapter.getAllChapterVideoList(id)
            .then(resp => {
              this.chapterVideoList = resp.data.items
              /*console.log(this.chapterVideoList)*/
            })
            .catch(resp => {
              this.$message({
                type: 'success',
                message: '章节信息加载失败'
              })
            })
        },


        init() {
        //获取路由里的id
          if(this.$route.params && this.$route.params.id) {
            this.id = this.$route.params.id
            this.getChapterVideoId(this.id)
          }
        },
        previous() {
          this.$router.push({path:'/course/info/'+this.id})
        },
        next() {
          this.$router.push({path:'/course/publish/'+this.id})
        },

        //视频相关
        //上传视频成功后调用的方法
        handleVodUploadSuccess(response, file, fileList) {
          console.log(response.data.videoId)
          this.video.videoSourceId = response.data.videoId
          //赋值文件名称
          console.log(file.name)
          this.video.videoOriginalName = file.name
        },
        //上传之前的提示信息(文件大小，格式限制）
        handleUploadExceed(files, fileList) {
          this.$message.warning('重新上传视频，需要 先删除已上传的视频')
        },
        //删除之前弹 确认框
        beforeVodRemove(file, fileList) {
          return this.$confirm(`确定移除 ${file.name}？`)
        },
        //删除
        handleVodRemove(file, fileList) {
          /*console.log(this.video.videoSourceId)*/
          video.removeAliyunVideo(this.video.videoSourceId)
            .then(resp => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
          })
        }

      }
    }
</script>

<style scoped>
  .chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chanpterList li{
    position: relative;
  }
  .chanpterList p{
    /*float: left;*/
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
  }
  .chanpterList .acts {
    float: right;
    font-size: 14px;
  }

  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    /*float: left;*/
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    /*border: 1px dotted #DDD;*/
  }
</style>
