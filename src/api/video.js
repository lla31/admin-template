import request from '@/utils/request'

//根据课程id 查询某一课程所有章节和小节信息
export default {
  //添加章节
  addVideo(Video) {
    return request({
      url: '/teacherservice/edu-video/addVideo',
      method: 'post',
      data: Video
    })
  },
  //修改的第一步是先查询（回显），根据chapterid查询
  getVideo(videoId) {
    return request({
      url: '/teacherservice/edu-video/'+videoId,
      method: 'get',
    })
  },
  //修改章节
  updateVideo(Video) {
    return request({
      url: '/teacherservice/edu-video/updateVideo',
      method: 'post',
      data: Video
    })
  },
  //删除章节
  deleteVideo(VideoId) {
    return request({
      url: '/teacherservice/edu-video/deleteVideo/'+VideoId,
      method: 'delete'
    })
  },
  removeAliyunVideo(VideoId) {
    return request({
      url: '/vidservice/vod/'+VideoId,
      method: 'delete'
    })
  }
}
