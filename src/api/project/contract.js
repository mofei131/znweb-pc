import request from '@/utils/request'

// 查询项目合同列表
export function listContract(query) {
  return request({
    url: '/project/contract/list',
    method: 'get',
    params: query
  })
}

// 查询项目合同详细
export function getContract(contractId) {
  return request({
    url: '/project/contract/' + contractId,
    method: 'get'
  })
}

// 新增项目合同
export function addContract(data) {
  return request({
    url: '/project/contract',
    method: 'post',
    data: data
  })
}

// 修改项目合同
export function updateContract(data) {
  return request({
    url: '/project/contract',
    method: 'put',
    data: data
  })
}

// 删除项目合同
export function delContract(contractId) {
  return request({
    url: '/project/contract/' + contractId,
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

// 查询供应商信息列表
export function getSupplierList() {
  return request({
    url: '/project/supplier/listAll',
    method: 'get'
  })
}
// 查询终端客户信息列表
export function getTerminalList() {
  return request({
    url: '/project/terminal/listAll',
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
