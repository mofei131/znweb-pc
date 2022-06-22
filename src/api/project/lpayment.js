import request from '@/utils/request'

// 查询物流付款列表
export function listLpayment(query) {
  return request({
    url: '/project/lpayment/list',
    method: 'get',
    params: query
  })
}

// 查询物流付款详细
export function getLpayment(lpaymentId) {
  return request({
    url: '/project/lpayment/' + lpaymentId,
    method: 'get'
  })
}

// 新增物流付款
export function addLpayment(data) {
  return request({
    url: '/project/lpayment',
    method: 'post',
    data: data
  })
}

// 修改物流付款
export function updateLpayment(data) {
  return request({
    url: '/project/lpayment',
    method: 'put',
    data: data
  })
}

// 删除物流付款
export function delLpayment(lpaymentId) {
  return request({
    url: '/project/lpayment/' + lpaymentId,
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

// 查询第三方公司列表
export function getTpcList() {
  return request({
    url: '/project/tpc/listAll',
    method: 'get'
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
