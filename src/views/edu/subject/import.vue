<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/新建 XLS 工作表.xls'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/teacherservice/edu-subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default {
      name: "import",
      data() {
        return {
          BASE_API: process.env.BASE_API, // 接口API地址
          //OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
          fileUploadBtnText: '上传到服务器', // 按钮文字
          importBtnDisabled: false, // 按钮是否禁用,
          loading: false
          }
      },
      created() {
      },
      methods: {
        submitUpload() {
          this.fileUploadBtnText = '正在上传'
          this.importBtnDisabled = true
          this.loading = true
          this.$refs.upload.submit()
        },
        fileUploadSuccess(resp) {
          if(resp.success==true) {
            this.fileUploadBtnText = '上传成功'
            this.loading = false
            this.$message({
              type: 'success',
              message: resp.message
            })
          }else {

            this.fileUploadBtnText = '上传失败'
            this.loading = false
            //获取返回的msg（list集合)
            const messages = resp.data.msgList
            let msgString = '<ul>'
            messages.forEach(msg => {
              msgString += `<li>${msg}</li>`
            })
            msgString += '</ul>'
            this.$alert(msgString, response.message, {
              dangerouslyUseHTMLString: true
            })
          }
        },
        fileUploadError() {
          this.fileUploadBtnText = '上传失败'
          this.loading = false
          this.$message({
            type: 'error',
            message: '上传失败'
          })
        }
      }

    }
</script>

<style scoped>

</style>
