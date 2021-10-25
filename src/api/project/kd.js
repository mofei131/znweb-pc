import request from '@/utils/request'

// 查询快递记录列表
export function listKd(query) {
  return request({
    url: '/project/kd/list',
    method: 'get',
    params: query
  })
}

// 查询快递记录详细
export function getKd(kdId) {
  return request({
    url: '/project/kd/' + kdId,
    method: 'get'
  })
}

// 新增快递记录
export function addKd(data) {
  return request({
    url: '/project/kd',
    method: 'post',
    data: data
  })
}

// 修改快递记录
export function updateKd(data) {
  return request({
    url: '/project/kd',
    method: 'put',
    data: data
  })
}

// 删除快递记录
export function delKd(kdId) {
  return request({
    url: '/project/kd/' + kdId,
    method: 'delete'
  })
}
