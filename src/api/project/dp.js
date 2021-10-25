import request from '@/utils/request'

// 查询期间费用列表
export function listDp(query) {
  return request({
    url: '/project/dp/list',
    method: 'get',
    params: query
  })
}

// 查询期间费用详细
export function getDp(dpId) {
  return request({
    url: '/project/dp/' + dpId,
    method: 'get'
  })
}

// 新增期间费用
export function addDp(data) {
  return request({
    url: '/project/dp',
    method: 'post',
    data: data
  })
}

// 修改期间费用
export function updateDp(data) {
  return request({
    url: '/project/dp',
    method: 'put',
    data: data
  })
}

// 删除期间费用
export function delDp(dpId) {
  return request({
    url: '/project/dp/' + dpId,
    method: 'delete'
  })
}
