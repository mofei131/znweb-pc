import request from '@/utils/request'

// 查询付款明细列表
export function listPaydetails(query) {
  return request({
    url: '/project/paydetails/list',
    method: 'get',
    params: query
  })
}

// 查询付款明细详细
export function getPaydetails(paydetailsId) {
  return request({
    url: '/project/paydetails/' + paydetailsId,
    method: 'get'
  })
}

// 新增付款明细
export function addPaydetails(data) {
  return request({
    url: '/project/paydetails',
    method: 'post',
    data: data
  })
}

// 修改付款明细
export function updatePaydetails(data) {
  return request({
    url: '/project/paydetails',
    method: 'put',
    data: data
  })
}

// 删除付款明细
export function delPaydetails(paydetailsId) {
  return request({
    url: '/project/paydetails/' + paydetailsId,
    method: 'delete'
  })
}
