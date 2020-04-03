import request from '@/utils/request'

export default {
  getLunbotuList() {
    return request({
      url: '/teacherservice/edu-lunbotu/getLunbotuUrl',
      method: 'get',
    })
  },
  deleteOneLunbotu(id) {
    return request({
      url: '/teacherservice/edu-lunbotu/deleteLunbotuUrl/'+id,
      method: 'delete',
    })
  }
}
