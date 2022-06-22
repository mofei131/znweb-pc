import request from '@/utils/request'

// 查询保证金列表
export function listMargin(query) {
  return request({
    url: '/project/margin/list',
    method: 'get',
    params: query
  })
}

// 查询保证金详细
export function getMargin(marginId) {
  return request({
    url: '/project/margin/' + marginId,
    method: 'get'
  })
}

// 新增保证金
export function addMargin(data) {
  return request({
    url: '/project/margin',
    method: 'post',
    data: data
  })
}

// 修改保证金
export function updateMargin(data) {
  return request({
    url: '/project/margin',
    method: 'put',
    data: data
  })
}

// 删除保证金
export function delMargin(marginId) {
  return request({
    url: '/project/margin/' + marginId,
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

// 查询合同
export function getContractListAll(data) {
  return request({
    url: '/project/contract/listAllByData',
    method: 'get',
    params: data
  })
}

// 查询终端客户
export function getTerminalListAll(data) {
  return request({
    url: '/project/terminal/listAll',
    method: 'get',
    params: data
  })
}

// 查询终端客户
export function getSupplierListAll(data) {
  return request({
    url: '/project/supplier/listAll',
    method: 'get',
    params: data
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
