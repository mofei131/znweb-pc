import request from '@/utils/request'

// 查询奖惩列表
export function listRewardsp(query) {
  return request({
    url: '/project/rewardsp/list',
    method: 'get',
    params: query
  })
}

// 查询奖惩详细
export function getRewardsp(rewardspId) {
  return request({
    url: '/project/rewardsp/' + rewardspId,
    method: 'get'
  })
}

// 新增奖惩
export function addRewardsp(data) {
  return request({
    url: '/project/rewardsp',
    method: 'post',
    data: data
  })
}

// 修改奖惩
export function updateRewardsp(data) {
  return request({
    url: '/project/rewardsp',
    method: 'put',
    data: data
  })
}

// 删除奖惩
export function delRewardsp(rewardspId) {
  return request({
    url: '/project/rewardsp/' + rewardspId,
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
