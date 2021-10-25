import request from '@/utils/request'

// 查询开票列表
export function listKp(query) {
  return request({
    url: '/project/kp/list',
    method: 'get',
    params: query
  })
}

// 查询开票详细
export function getKp(kpId) {
  return request({
    url: '/project/kp/' + kpId,
    method: 'get'
  })
}

// 新增开票
export function addKp(data) {
  return request({
    url: '/project/kp',
    method: 'post',
    data: data
  })
}

// 修改开票
export function updateKp(data) {
  return request({
    url: '/project/kp',
    method: 'put',
    data: data
  })
}

// 删除开票
export function delKp(kpId) {
  return request({
    url: '/project/kp/' + kpId,
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
