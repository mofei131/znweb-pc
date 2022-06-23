import request from '@/utils/request'

// 查询实控人管理列表
export function listActualControl(query) {
  return request({
    url: '/project/actualControl/list',
    method: 'get',
    params: query
  })
}

// 查询实控人管理详细
export function getActualControl(id) {
  return request({
    url: '/project/actualControl/' + id,
    method: 'get'
  })
}

// 新增实控人管理
export function addActualControl(data) {
  return request({
    url: '/project/actualControl',
    method: 'post',
    data: data
  })
}

// 修改实控人管理
export function updateActualControl(data) {
  return request({
    url: '/project/actualControl',
    method: 'put',
    data: data
  })
}

// 删除实控人管理
export function delActualControl(id) {
  return request({
    url: '/project/actualControl/' + id,
    method: 'delete'
  })
}
