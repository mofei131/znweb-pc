import request from '@/utils/request'

// 查询物流收票列表
export function listWldetails(query) {
  return request({
    url: '/project/wldetails/list',
    method: 'get',
    params: query
  })
}

// 查询物流收票详细
export function getWldetails(wldetailsId) {
  return request({
    url: '/project/wldetails/' + wldetailsId,
    method: 'get'
  })
}

// 新增物流收票
export function addWldetails(data) {
  return request({
    url: '/project/wldetails',
    method: 'post',
    data: data
  })
}

// 修改物流收票
export function updateWldetails(data) {
  return request({
    url: '/project/wldetails',
    method: 'put',
    data: data
  })
}

// 删除物流收票
export function delWldetails(wldetailsId) {
  return request({
    url: '/project/wldetails/' + wldetailsId,
    method: 'delete'
  })
}
