import request from '@/utils/request'

//根据课程id 查询某一课程所有章节和小节信息
export default {
  getAllChapterVideoList(courseId) {
    return request({
      url: '/teacherservice/edu-chapter/getChapterVideoList/'+courseId,
      method: 'get',
    })
  },
  //添加章节
  addChapter(chapter) {
    return request({
      url: '/teacherservice/edu-chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
  //修改的第一步是先查询（回显），根据chapterid查询
  getChapter(chapterId) {
    return request({
      url: '/teacherservice/edu-chapter/getChapterInfo/'+chapterId,
      method: 'get',
    })
  },
  //修改章节
  updateChapter(chapter) {
    return request({
      url: '/teacherservice/edu-chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  },
  //删除章节
  deleteChapter(chapterId) {
    return request({
      url: '/teacherservice/edu-chapter/deleteChapter/'+chapterId,
      method: 'delete'
    })
  }
}

