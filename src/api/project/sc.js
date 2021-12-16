import request from '@/utils/request'

// 查询应收管理列表
export function listSc(query) {
  return request({
    url: '/project/sc/list',
    method: 'get',
    params: query
  })
}

// 查询应收管理详细
export function getSc(scId) {
  return request({
    url: '/project/sc/' + scId,
    method: 'get'
  })
}

// 新增应收管理
export function addSc(data) {
  return request({
    url: '/project/sc',
    method: 'post',
    data: data
  })
}

// 修改应收管理
export function updateSc(data) {
  return request({
    url: '/project/sc',
    method: 'put',
    data: data
  })
}

// 删除应收管理
export function delSc(scId) {
  return request({
    url: '/project/sc/' + scId,
    method: 'delete'
  })
}

// 查询应收管理列表
export function listScAll(query) {
  return request({
    url: '/project/sc/listAll',
    method: 'get',
    params: query
  })
}
