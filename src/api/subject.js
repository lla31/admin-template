import request from '@/utils/request'

export default {
    getAllSubjectList() {
        return request({
            url: '/teacherservice/edu-subject',
            method: 'get'
          })
    },
    removeSubjectId(id) {
        return request({
            url: '/teacherservice/edu-subject/'+id,
            method: 'delete'
        })
    },
    addSubjectOne(subject) {
        return request({
            url: '/teacherservice/edu-subject/addOneLevel',
            method: 'post',
            data:subject
        })
    },
    addSubjectTwo(subject) {
        return request({
            url: '/teacherservice/edu-subject/addTwoLevel',
            method: 'post',
            data:subject
        })
    }
}
