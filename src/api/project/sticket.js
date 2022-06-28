import request from '@/utils/request'

// 查询收票管理列表
export function listSticket(query) {
  return request({
    url: '/project/sticket/list',
    method: 'get',
    params: query
  })
}

// 查询收票管理详细
export function getSticket(sticketId) {
  return request({
    url: '/project/sticket/' + sticketId,
    method: 'get'
  })
}

// 新增收票管理
export function addSticket(data) {
  return request({
    url: '/project/sticket',
    method: 'post',
    data: data
  })
}

// 修改收票管理
export function updateSticket(data) {
  return request({
    url: '/project/sticket',
    method: 'put',
    data: data
  })
}

// 删除收票管理
export function delSticket(sticketId) {
  return request({
    url: '/project/sticket/' + sticketId,
    method: 'delete'
  })
}


// 查询全部最终付款
export function getOcrData(data) {
  return request({
    url: '/project/sticket/getOcrData',
    method: 'get',
    params: data
  })
}


// 初始化数据
export function findInit(data) {
  return request({
    url: '/project/sticket/findInit',
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
