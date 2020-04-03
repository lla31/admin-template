import request from '@/utils/request'

export default {
  //三个参数为：当前页，每页记录数，封装的对象
  getUserPageList(page,limit) {
    return request({
      //后端controller里面的路径
      url: '/teacherservice/user/pageList/'+page+'/'+limit,
      //提交方式
      method: 'get'
    })
  },
  letBecomeTeacher(id) {
    return request({
      url: '/teacherservice/user/becomeTeacher/'+id,
      method: 'get'
    })
  }
}
