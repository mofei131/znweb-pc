import request from '@/utils/request'

// 查询收开票明细列表
export function listRid(query) {
  return request({
    url: '/project/rid/list',
    method: 'get',
    params: query
  })
}

// 查询收开票明细详细
export function getRid(ridId) {
  return request({
    url: '/project/rid/' + ridId,
    method: 'get'
  })
}

// 新增收开票明细
export function addRid(data) {
  return request({
    url: '/project/rid',
    method: 'post',
    data: data
  })
}

// 修改收开票明细
export function updateRid(data) {
  return request({
    url: '/project/rid',
    method: 'put',
    data: data
  })
}

// 删除收开票明细
export function delRid(ridId) {
  return request({
    url: '/project/rid/' + ridId,
    method: 'delete'
  })
}
