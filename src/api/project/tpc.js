import request from '@/utils/request'

// 查询第三方公司列表
export function listTpc(query) {
  return request({
    url: '/project/tpc/list',
    method: 'get',
    params: query
  })
}

// 查询第三方公司详细
export function getTpc(tpcId) {
  return request({
    url: '/project/tpc/' + tpcId,
    method: 'get'
  })
}

// 新增第三方公司
export function addTpc(data) {
  return request({
    url: '/project/tpc',
    method: 'post',
    data: data
  })
}

// 修改第三方公司
export function updateTpc(data) {
  return request({
    url: '/project/tpc',
    method: 'put',
    data: data
  })
}

// 删除第三方公司
export function delTpc(tpcId) {
  return request({
    url: '/project/tpc/' + tpcId,
    method: 'delete'
  })
}
