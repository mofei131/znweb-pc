import request from '@/utils/request'

// 查询前段管理列表
export function listQdm(query) {
  return request({
    url: '/project/qdm/list',
    method: 'get',
    params: query
  })
}

// 查询前段管理详细
export function getQdm(qdmId) {
  return request({
    url: '/project/qdm/' + qdmId,
    method: 'get'
  })
}

// 新增前段管理
export function addQdm(data) {
  return request({
    url: '/project/qdm',
    method: 'post',
    data: data
  })
}

// 修改前段管理
export function updateQdm(data) {
  return request({
    url: '/project/qdm',
    method: 'put',
    data: data
  })
}

// 删除前段管理
export function delQdm(qdmId) {
  return request({
    url: '/project/qdm/' + qdmId,
    method: 'delete'
  })
}
