import request from '@/utils/request'

// 查询收付款明细列表
export function listSfdetails(query) {
  return request({
    url: '/project/sfdetails/list',
    method: 'get',
    params: query
  })
}

// 查询收付款明细详细
export function getSfdetails(sfdetails) {
  return request({
    url: '/project/sfdetails/' + sfdetails,
    method: 'get'
  })
}

// 新增收付款明细
export function addSfdetails(data) {
  return request({
    url: '/project/sfdetails',
    method: 'post',
    data: data
  })
}

// 修改收付款明细
export function updateSfdetails(data) {
  return request({
    url: '/project/sfdetails',
    method: 'put',
    data: data
  })
}

// 删除收付款明细
export function delSfdetails(sfdetails) {
  return request({
    url: '/project/sfdetails/' + sfdetails,
    method: 'delete'
  })
}
