import request from '@/utils/request'

// 查询固定差价明细列表
export function listFixedDiff(query) {
  return request({
    url: '/project/fixedDiff/list',
    method: 'get',
    params: query
  })
}

// 查询固定差价明细详细
export function getFixedDiff(id) {
  return request({
    url: '/project/fixedDiff/' + id,
    method: 'get'
  })
}

// 新增固定差价明细
export function addFixedDiff(data) {
  return request({
    url: '/project/fixedDiff',
    method: 'post',
    data: data
  })
}

// 修改固定差价明细
export function updateFixedDiff(data) {
  return request({
    url: '/project/fixedDiff',
    method: 'put',
    data: data
  })
}

// 删除固定差价明细
export function delFixedDiff(id) {
  return request({
    url: '/project/fixedDiff/' + id,
    method: 'delete'
  })
}
