import request from '@/utils/request'

// 查询入库单列表
export function listGrn(query) {
  return request({
    url: '/project/grn/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详细
export function getGrn(grnId) {
  return request({
    url: '/project/grn/' + grnId,
    method: 'get'
  })
}

// 新增入库单
export function addGrn(data) {
  return request({
    url: '/project/grn',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateGrn(data) {
  return request({
    url: '/project/grn',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delGrn(grnId) {
  return request({
    url: '/project/grn/' + grnId,
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
