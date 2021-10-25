import request from '@/utils/request'

// 查询供需列表
export function listCoal(query) {
    return request({
        url: '/central/coal/list',
        method: 'post',
        data: query
    })
}

// 查询供需详细
export function getCoal(supplydId) {
    return request({
        url: '/central/coal/' + supplydId,
        method: 'get'
    })
}

// 新增供需
export function addCoal(data) {
    return request({
        url: '/central/coal/addCoal',
        method: 'put',
        data: data
    })
}

// 修改供需
export function updateCoal(data) {
    return request({
        url: '/central/coal/updateCoal',
        method: 'post',
        data: data
    })
}

// 删除供需
export function delCoal(supplydId) {
    return request({
        url: '/central/coal/deleteById/' + supplydId,
        method: 'delete'
    })
}