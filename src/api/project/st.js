import request from '@/utils/request'

// 查询项目信息列表
export function listSt(query) {
  return request({
    url: '/project/st/list',
    method: 'get',
    params: query
  })
}

// 查询项目操作列表
export function listStUpdate(query) {
  return request({
    url: '/project/stupdate/list',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getSt(stId) {
  return request({
    url: '/project/st/' + stId,
    method: 'get'
  })
}

// 查询项目信息详细
export function getStupdate(stupdateId) {
  return request({
    url: '/project/stupdate/' + stupdateId,
    method: 'get'
  })
}

// 新增项目信息
export function addSt(data) {
  return request({
    url: '/project/st',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateSt(data) {
  return request({
    url: '/project/st',
    method: 'put',
    data: data
  })
}

// 删除项目信息
export function delSt(stId) {
  return request({
    url: '/project/st/' + stId,
    method: 'delete'
  })
}

// 删除操作信息
export function delStupdate(stId) {
  return request({
    url: '/project/stupdate/' + stId,
    method: 'delete'
  })
}

// 查询代理人信息列表
export function getUserList() {
  return request({
    url: '/system/user/listAll',
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
