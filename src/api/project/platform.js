import request from '@/utils/request'

// 查询站台管理列表
export function listPlatform(query) {
  return request({
    url: '/project/platform/list',
    method: 'get',
    params: query
  })
}

// 查询站台管理详细
export function getPlatform(id) {
  return request({
    url: '/project/platform/' + id,
    method: 'get'
  })
}

// 新增站台管理
export function addPlatform(data) {
  return request({
    url: '/project/platform',
    method: 'post',
    data: data
  })
}

// 修改站台管理
export function updatePlatform(data) {
  return request({
    url: '/project/platform',
    method: 'put',
    data: data
  })
}

// 删除站台管理
export function delPlatform(id) {
  return request({
    url: '/project/platform/' + id,
    method: 'delete'
  })
}
