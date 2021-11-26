import request from '@/utils/request'

// 查询全部预付款
export function getApaymentList(data) {
  return request({
    url: '/project/apayment/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部最终付款
export function getFpaymentList(data) {
  return request({
    url: '/project/fpayment/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部合同
export function getContractList(data) {
  return request({
    url: '/project/contract/listAllByData',
    method: 'get',
    params: data
  })
}

// 查询全部入库
export function getGrnList(data) {
  return request({
    url: '/project/grn/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部出库
export function getGryList(data) {
  return request({
    url: '/project/gry/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部收款
export function getSkList(data) {
  return request({
    url: '/project/sk/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部物流付款
export function getLpaymentList(data) {
  return request({
    url: '/project/lpayment/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部发票
export function getSticketList(data) {
  return request({
    url: '/project/sticket/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部发票
export function getKpList(data) {
  return request({
    url: '/project/kp/bydata',
    method: 'get',
    params: data
  })
}

// 查询全部服务费
export function getSpList(data) {
  return request({
    url: '/project/sp/bydata',
    method: 'get',
    params: data
  })
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function stateF(id){
  if(id=='1'){
    return "待审核"
  }else  if(id=='2'){
    return "审核中"
  }else  if(id=='3'){
    return "已通过"
  }else  if(id=='2'){
    return "已驳打回"
  }
}
