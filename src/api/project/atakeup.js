import request from '@/utils/request'

// 查询资金占用情况列表
export function listAtakeup(query) {
  return request({
    url: '/project/atakeup/list',
    method: 'get',
    params: query
  })
}
// 查询资金占用情况列表
export function listAtakeupAll(query) {
  return request({
    url: '/project/atakeup/listAll',
    method: 'get',
    params: query
  })
}
// 查询资金占用情况详细
export function getAtakeup(atakeupId) {
  return request({
    url: '/project/atakeup/' + atakeupId,
    method: 'get'
  })
}

// 新增资金占用情况
export function addAtakeup(data) {
  return request({
    url: '/project/atakeup',
    method: 'post',
    data: data
  })
}

// 修改资金占用情况
export function updateAtakeup(data) {
  return request({
    url: '/project/atakeup',
    method: 'put',
    data: data
  })
}

// 删除资金占用情况
export function delAtakeup(atakeupId) {
  return request({
    url: '/project/atakeup/' + atakeupId,
    method: 'delete'
  })
}
