import request from '@/utils/request'

// 查询资金计划列表
export function listCplan(query) {
  return request({
    url: '/project/cplan/list',
    method: 'get',
    params: query
  })
}

// 查询资金计划详细
export function getCplan(cplanId) {
  return request({
    url: '/project/cplan/' + cplanId,
    method: 'get'
  })
}

// 新增资金计划
export function addCplan(data) {
  return request({
    url: '/project/cplan',
    method: 'post',
    data: data
  })
}

// 修改资金计划
export function updateCplan(data) {
  return request({
    url: '/project/cplan',
    method: 'put',
    data: data
  })
}

// 删除资金计划
export function delCplan(cplanId) {
  return request({
    url: '/project/cplan/' + cplanId,
    method: 'delete'
  })
}

// 查询项目信息列表
export function getStList() {
  return request({
    url: '/project/st/listAll',
    method: 'get'
  })
}
// 查询代理人信息列表
export function getUserList() {
  return request({
    url: '/system/user/listAll',
    method: 'get'
  })
}
// 业务列表
export function listForBus() {
  return request({
    url: "/project/business/listForCombobox",
    method: "get",
  });
}
// 项目列表
export function listForPro() {
  return request({
    url: "/project/project/listForCombobox",
    method: "get",
  });
}
