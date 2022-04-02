import request from '@/utils/request'

export function getProjectBriefing(data) {
  return request({
    url: '/project/stat/projectBrief',
    method: 'get',
    params: data
  })
}

export function getFundOccupation(data) {
  return request({
    url: '/project/stat/capitalOcc',
    method: 'get',
    params: data
  })
}
export function getPlanSk(data) {
  return request({
    url: '/project/stat/planSk',
    method: 'get',
    params: data
  })
}
export function getplanFk(data) {
  return request({
    url: '/project/stat/planFk',
    method: 'get',
    params: data
  })
}
export function getStatisticFk(data) {
    return request({
      url: '/project/stat/statisticFk',
      method: 'get',
      params: data
    })
  }
  export function getStatisticSk(data) {
    return request({
      url: '/project/stat/statisticSk',
      method: 'get',
      params: data
    })
  }
  export function getUserListAll(data) {
    return request({
      url: '/system/user/listAll',
      method: 'get',
      params: data
    })
  }
  export function getStListAll(data) {
    return request({
      url: '/project/st/listAll',
      method: 'get',
      params: data
    })
  }