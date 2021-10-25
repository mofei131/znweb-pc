import request from '@/utils/request'

// 查询终端用户列表
export function listTerminal(query) {
  return request({
    url: '/project/terminal/list',
    method: 'get',
    params: query
  })
}

// 查询终端用户详细
export function getTerminal(terminalId) {
  return request({
    url: '/project/terminal/' + terminalId,
    method: 'get'
  })
}

// 新增终端用户
export function addTerminal(data) {
  return request({
    url: '/project/terminal',
    method: 'post',
    data: data
  })
}

// 修改终端用户
export function updateTerminal(data) {
  return request({
    url: '/project/terminal',
    method: 'put',
    data: data
  })
}

// 删除终端用户
export function delTerminal(terminalId) {
  return request({
    url: '/project/terminal/' + terminalId,
    method: 'delete'
  })
}
