import request from '@/utils/request'

// 查询banner列表
export function listBanner(query) {
    return request({
        url: '/central/home/list',
        method: 'post',
        data: query
    })
}

// 查询banner详细
export function getBanner(bannerId) {
    return request({
        url: '/central/banner/' + bannerId,
        method: 'get'
    })
}

// 新增banner
export function addBanner(data) {
    return request({
        url: '/central/home/bannerAdd',
        method: 'put',
        data: data
    })
}

// 修改banner
export function updateBanner(data) {
    return request({
        url: '/central/home/bannerUpdate',
        method: 'post',
        data: data
    })
}

// 删除banner
export function delBanner(bannerId) {
    return request({
        url: '/central/home/deleteBannerById/' + bannerId,
        method: 'delete'
    })
}