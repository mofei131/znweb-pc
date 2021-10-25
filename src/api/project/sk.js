import request from '@/utils/request'

// 查询收款列表
export function listSk(query) {
  return request({
    url: '/project/sk/list',
    method: 'get',
    params: query
  })
}

// 查询收款详细
export function getSk(skId) {
  return request({
    url: '/project/sk/' + skId,
    method: 'get'
  })
}

// 新增收款
export function addSk(data) {
  return request({
    url: '/project/sk',
    method: 'post',
    data: data
  })
}

// 修改收款
export function updateSk(data) {
  return request({
    url: '/project/sk',
    method: 'put',
    data: data
  })
}

// 删除收款
export function delSk(skId) {
  return request({
    url: '/project/sk/' + skId,
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
