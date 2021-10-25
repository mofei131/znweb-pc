import request from '@/utils/request'

// 查询统计利润列表
export function listProfits(query) {
  return request({
    url: '/project/profits/list',
    method: 'get',
    params: query
  })
}

// 查询统计利润详细
export function getProfits(profitsId) {
  return request({
    url: '/project/profits/' + profitsId,
    method: 'get'
  })
}

// 新增统计利润
export function addProfits(data) {
  return request({
    url: '/project/profits',
    method: 'post',
    data: data
  })
}

// 修改统计利润
export function updateProfits(data) {
  return request({
    url: '/project/profits',
    method: 'put',
    data: data
  })
}

// 删除统计利润
export function delProfits(profitsId) {
  return request({
    url: '/project/profits/' + profitsId,
    method: 'delete'
  })
}
