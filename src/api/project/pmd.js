import request from '@/utils/request'

// 查询应付管理明细列表
export function listPmd(query) {
  return request({
    url: '/project/pmd/list',
    method: 'get',
    params: query
  })
}

// 查询应付管理明细详细
export function getPmd(pmdId) {
  return request({
    url: '/project/pmd/' + pmdId,
    method: 'get'
  })
}

// 新增应付管理明细
export function addPmd(data) {
  return request({
    url: '/project/pmd',
    method: 'post',
    data: data
  })
}

// 修改应付管理明细
export function updatePmd(data) {
  return request({
    url: '/project/pmd',
    method: 'put',
    data: data
  })
}

// 删除应付管理明细
export function delPmd(pmdId) {
  return request({
    url: '/project/pmd/' + pmdId,
    method: 'delete'
  })
}

// 查询列表
export function listPmdAll(query) {
  return request({
    url: '/project/pmd/listAll',
    method: 'get',
    params: query
  })
}
