import request from '@/utils/request'

// 查询应付管理列表
export function listSf(query) {
  return request({
    url: '/project/sf/list',
    method: 'get',
    params: query
  })
}

// 查询应付管理详细
export function getSf(sfId) {
  return request({
    url: '/project/sf/' + sfId,
    method: 'get'
  })
}

// 新增应付管理
export function addSf(data) {
  return request({
    url: '/project/sf',
    method: 'post',
    data: data
  })
}

// 修改应付管理
export function updateSf(data) {
  return request({
    url: '/project/sf',
    method: 'put',
    data: data
  })
}

// 删除应付管理
export function delSf(sfId) {
  return request({
    url: '/project/sf/' + sfId,
    method: 'delete'
  })
}

// 查询应付管理列表
export function listSfAll(query) {
  return request({
    url: '/project/sf/listAll',
    method: 'get',
    params: query
  })
}
