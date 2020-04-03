import request from '@/utils/request' //模板提供的组件，axios封装

export default {
  //三个参数为：当前页，每页记录数，封装的对象
  getTeacherPageList(page,limit,searchObj) {
    return request({
        //后端controller里面的路径
        url: '/teacherservice/edu-teacher/moreConditionPageList/'+page+'/'+limit,
        //提交方式
        method: 'post',
        //传递条件对象,如果传递json数据，使用data。如果不是json，使用params
        data: searchObj
    })
  },
  deleteTeacherById(id) {
    return request({
      url: '/teacherservice/edu-teacher/'+id,
      method: 'delete'
    })
  },
  saveTeacher(teacher) {
    return request({
      url: '/teacherservice/edu-teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  getTeacherById(id) {
    return request({
      url: '/teacherservice/edu-teacher/getTeacherInfo/'+id,
      method: 'get',
    })
  },
  updateTeacherById(id,teacher) {
    return request({
      url: '/teacherservice/edu-teacher/updateTeacher/'+id,
      method: 'post',
      data: teacher
    })
  }
}
