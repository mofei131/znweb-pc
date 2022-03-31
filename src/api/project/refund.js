import request from '@/utils/request'

// 查询退款金额列表
export function listRefund(query) {
  return request({
    url: '/project/refund/list',
    method: 'get',
    params: query
  })
}

// 查询退款金额详细
export function getRefund(refundId) {
  return request({
    url: '/project/refund/' + refundId,
    method: 'get'
  })
}

    export function getRefundDetail(refundId){
      return request({
        url: '/project/refund/detail/' + refundId,
        method: 'get'
      })
    }
// 新增退款金额
export function addRefund(data) {
  return request({
    url: '/project/refund',
    method: 'post',
    data: data
  })
}

// 修改退款金额
export function updateRefund(data) {
  return request({
    url: '/project/refund',
    method: 'put',
    data: data
  })
}

// 删除退款金额
export function delRefund(refundId) {
  return request({
    url: '/project/refund/' + refundId,
    method: 'delete'
  })
}
