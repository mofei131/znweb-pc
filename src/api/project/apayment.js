import request from '@/utils/request'

// 查询预付款列表
export function listApayment(query) {
  return request({
    url: '/project/apayment/list',
    method: 'get',
    params: query
  })
}

// 查询预付款详细
export function getApayment(apyamentId) {
  return request({
    url: '/project/apayment/' + apyamentId,
    method: 'get'
  })
}

// 新增预付款
export function addApayment(data) {
  return request({
    url: '/project/apayment',
    method: 'post',
    data: data
  })
}

// 修改预付款
export function updateApayment(data) {
  return request({
    url: '/project/apayment',
    method: 'put',
    data: data
  })
}

// 删除预付款
export function delApayment(apyamentId) {
  return request({
    url: '/project/apayment/' + apyamentId,
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
// 查询入库单列表
export function getGrnList(data) {
  return request({
    url: '/project/grn/bydata',
    method: 'get',
    params: data
  })
}
// 查询出库单列表
export function getGryList(data) {
  return request({
    url: '/project/gry/bydata',
    method: 'get',
    params: data
  })
}

// 查询委托合同
export function getContract(data) {
  return request({
    url: '/project/contract/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部首付款
export function getApaymentbydata(data) {
  return request({
    url: '/project/apayment/bydata',
    method: 'get',
    params: data
  })
}
