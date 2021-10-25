import request from '@/utils/request'

// 查询咨询列表
export function listConsulting(query) {
    return request({
        url: '/central/consulting/list',
        method: 'post',
        data: query
    })
}

// 查询咨询详细
export function getConsulting(consultingId) {
    return request({
        url: '/system/consulting/' + consultingId,
        method: 'get'
    })
}

// 新增咨询
export function addConsulting(data) {
    return request({
        url: '/central/consulting/add',
        method: 'put',
        data: data
    })
}

// 修改咨询
export function updateConsulting(data) {
    return request({
        url: '/central/consulting/updateById',
        method: 'post',
        data: data
    })
}

// 删除咨询
export function delConsulting(consultingId) {
    return request({
        url: '/central/consulting/deleteById/' + consultingId,
        method: 'delete'
    })
}