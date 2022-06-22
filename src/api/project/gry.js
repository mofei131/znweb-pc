import request from '@/utils/request'

// 查询出库单列表
export function listGry(query) {
  return request({
    url: '/project/gry/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详细
export function getGry(gryId) {
  return request({
    url: '/project/gry/' + gryId,
    method: 'get'
  })
}

// 新增出库单
export function addGry(data) {
  return request({
    url: '/project/gry',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateGry(data) {
  return request({
    url: '/project/gry',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delGry(gryId) {
  return request({
    url: '/project/gry/' + gryId,
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
// 查询项目信息列表
export function getGrnList(stId) {
  return request({
    url: '/project/grn/listAll/'+stId,
    method: 'get'
  })
}

// 查询入库单详细
export function getContract(stId) {
  return request({
    url: '/project/contract/bystId/' + stId,
    method: 'get'
  })
}

// 计算奖惩
export function getJsjc(data) {
  return request({
    url: '/project/rewardsp/jsjc',
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
