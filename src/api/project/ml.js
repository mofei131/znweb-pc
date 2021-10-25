import request from '@/utils/request'

// 查询毛利测算统计列表
export function listMl(query) {
  return request({
    url: '/project/ml/list',
    method: 'get',
    params: query
  })
}

// 查询毛利测算统计详细
export function getMl(mlId) {
  return request({
    url: '/project/ml/' + mlId,
    method: 'get'
  })
}

// 新增毛利测算统计
export function addMl(data) {
  return request({
    url: '/project/ml',
    method: 'post',
    data: data
  })
}

// 修改毛利测算统计
export function updateMl(data) {
  return request({
    url: '/project/ml',
    method: 'put',
    data: data
  })
}

// 删除毛利测算统计
export function delMl(mlId) {
  return request({
    url: '/project/ml/' + mlId,
    method: 'delete'
  })
}
