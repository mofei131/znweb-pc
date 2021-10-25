import request from '@/utils/request'

// 查询项目资金占用情况列表
export function listPtakeup(query) {
  return request({
    url: '/project/ptakeup/list',
    method: 'get',
    params: query
  })
}

// 查询项目资金占用情况列表
export function listPtakeupAll(query) {
  return request({
    url: '/project/ptakeup/listAll',
    method: 'get',
    params: query
  })
}

// 查询项目资金占用情况详细
export function getPtakeup(ptakeupId) {
  return request({
    url: '/project/ptakeup/' + ptakeupId,
    method: 'get'
  })
}

// 新增项目资金占用情况
export function addPtakeup(data) {
  return request({
    url: '/project/ptakeup',
    method: 'post',
    data: data
  })
}

// 修改项目资金占用情况
export function updatePtakeup(data) {
  return request({
    url: '/project/ptakeup',
    method: 'put',
    data: data
  })
}

// 删除项目资金占用情况
export function delPtakeup(ptakeupId) {
  return request({
    url: '/project/ptakeup/' + ptakeupId,
    method: 'delete'
  })
}
