import request from '@/utils/request'

// 查询回款记录列表
export function listOm(query) {
  return request({
    url: '/project/om/list',
    method: 'get',
    params: query
  })
}

// 查询回款记录详细
export function getOm(omId) {
  return request({
    url: '/project/om/' + omId,
    method: 'get'
  })
}

// 新增回款记录
export function addOm(data) {
  return request({
    url: '/project/om',
    method: 'post',
    data: data
  })
}

// 修改回款记录
export function updateOm(data) {
  return request({
    url: '/project/om',
    method: 'put',
    data: data
  })
}

// 删除回款记录
export function delOm(omId) {
  return request({
    url: '/project/om/' + omId,
    method: 'delete'
  })
}
