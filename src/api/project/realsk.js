import request from '@/utils/request'

// 查询实际收款列表
export function listRealsk(query) {
  return request({
    url: '/project/realsk/list',
    method: 'get',
    params: query
  })
}

// 查询实际收款详细
export function getRealsk(realskId) {
  return request({
    url: '/project/realsk/' + realskId,
    method: 'get'
  })
}

// 新增实际收款
export function addRealsk(data) {
  return request({
    url: '/project/realsk',
    method: 'post',
    data: data
  })
}

// 修改实际收款
export function updateRealsk(data) {
  return request({
    url: '/project/realsk',
    method: 'put',
    data: data
  })
}

// 删除实际收款
export function delRealsk(realskId) {
  return request({
    url: '/project/realsk/' + realskId,
    method: 'delete'
  })
}


// 初始化数据
export function findInit(data) {
  return request({
    url: '/project/realsk/findInit',
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
