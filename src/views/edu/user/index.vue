<template>
  <div class="app-container">
    用户列表


    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column prop="username" label="名称" width="80" />

      <el-table-column prop="password" label="密码" />

      <el-table-column prop="sex" label="性别" />

      <el-table-column prop="isTeacher" label="是否为教师" >
        <template slot-scope="scope">
          {{ scope.row.isTeacher==1?'是':'不是' }}
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>



      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!--<router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>-->
          <el-button type="primary" size="mini" icon="el-icon-setting" @click="becomeTeacher(scope.row.id)">升级该用户为教师</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getListUser"
    />
  </div>
</template>

<script>
  import user from '@/api/user'
    export default {
        name: "index",
      data() {
        return {
          list:null,
          page:1,
          limit:10, //每页记录数

          total:0, //总记录数

          listLoading: true
        }
      },
      created() {
        this.getListUser()
      },
      methods: {
        getListUser(page=1) {
          this.page = page
          this.listLoading = true
          user.getUserPageList(this.page,this.limit)
            .then(resp =>{
              this.listLoading = false

              this.list = resp.data.records
              console.log(resp.data.records)
              this.total = resp.data.total

            })
            .catch(error =>{

            })
        },
        becomeTeacher(id) {
            user.letBecomeTeacher(id)
              .then(resp => {
                this.$message({
                  type: 'success',
                  message: '他已经成为了教师'
                })
                //返回列表
                this.getListUser()
              })
        }

      }

    }
</script>

<style scoped>

</style>
