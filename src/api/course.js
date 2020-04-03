import request from '@/utils/request'

export default {
  addCourseInfo(courseInfo) {
    return request({
      url: '/teacherservice/edu-course',
      method: 'post',
      data:courseInfo
    })
  },
  //查询所有教师显示到下拉列表中
  getAllTeacherList() {
    return request({
      url: '/teacherservice/edu-teacher',
      method: 'get',
    })
  },
  //根据课程id查询课程信息（包含课程描述）
  getCourseInfoById(id) {
    return request({
      url: '/teacherservice/edu-course/getCourseInfo/'+id,
      method: 'get',
    })
  },
  //修改课程基本信息表（包含课程描述）
  updataCourseInfoById(id,courseInfo) {
    return request({
      url: '/teacherservice/edu-course/updataCourseInfo/'+id,
      method: 'post',
      data: courseInfo
    })
  },
  //查询所有课程
  getCourseList(id) {
    return request({
      url: '/teacherservice/edu-course/listCourse',
      method: 'get',
    })
  },
  //组合查询+分页
  getConditionCoursePageList(page,limit,searchObj){
    return request({
      url: '/teacherservice/edu-course/moreConditionPageList/'+page+'/'+limit,
      method: 'post',
      //传递条件对象,如果传递json数据，使用data。如果不是json，使用params
      data: searchObj
    })
  },
  //查询所有课程+分页
  getCoursePageList(page,limit){
    return request({
      url: '/teacherservice/edu-course/pageListCourse/'+page+'/'+limit,
      method: 'get',
    })
  },
  //删除课程
  deleteCourseId(id) {
    return request({
      url: '/teacherservice/edu-course/deleteCourse/'+id,
      method: 'delete',
    })
  },
  //根据课程id查询课程的 多表信息
  getAllCourseInfo(id) {
    return request({
      url: '/teacherservice/edu-course/getCourseEveryInfo/'+id,
      method: 'get',
    })
  },
  //修改课程发布状态
  updateCourseStatus(id) {
    return request({
      url: '/teacherservice/edu-course/publishCourse/'+id,
      method: 'get',
    })
  }
}
