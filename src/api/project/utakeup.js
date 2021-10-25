import request from '@/utils/request'

// 查询个人资金占用情况列表
export function listUtakeup(query) {
  return request({
    url: '/project/utakeup/list',
    method: 'get',
    params: query
  })
}

// 查询个人资金占用情况列表
export function listUtakeupAll(query) {
  return request({
    url: '/project/utakeup/listAll',
    method: 'get',
    params: query
  })
}

// 查询个人资金占用情况详细
export function getUtakeup(utakeupId) {
  return request({
    url: '/project/utakeup/' + utakeupId,
    method: 'get'
  })
}

// 新增个人资金占用情况
export function addUtakeup(data) {
  return request({
    url: '/project/utakeup',
    method: 'post',
    data: data
  })
}

// 修改个人资金占用情况
export function updateUtakeup(data) {
  return request({
    url: '/project/utakeup',
    method: 'put',
    data: data
  })
}

// 删除个人资金占用情况
export function delUtakeup(utakeupId) {
  return request({
    url: '/project/utakeup/' + utakeupId,
    method: 'delete'
  })
}
