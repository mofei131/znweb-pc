import request from '@/utils/request'

// 查询服务费明细列表
export function listSp(query) {
  return request({
    url: '/project/sp/list',
    method: 'get',
    params: query
  })
}

// 查询服务费明细详细
export function getSp(spId) {
  return request({
    url: '/project/sp/' + spId,
    method: 'get'
  })
}

// 新增服务费明细
export function addSp(data) {
  return request({
    url: '/project/sp',
    method: 'post',
    data: data
  })
}

// 修改服务费明细
export function updateSp(data) {
  return request({
    url: '/project/sp',
    method: 'put',
    data: data
  })
}

// 删除服务费明细
export function delSp(spId) {
  return request({
    url: '/project/sp/' + spId,
    method: 'delete'
  })
}
