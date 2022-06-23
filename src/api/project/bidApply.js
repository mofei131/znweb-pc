import request from "@/utils/request";

// 查询投标申请列表
export function listBidApply(query) {
  return request({
    url: "/project/bidApply/list",
    method: "get",
    params: query,
  });
}

// 查询投标申请详细
export function getBidApply(bidId) {
  return request({
    url: "/project/bidApply/" + bidId,
    method: "get",
  });
}

// 新增投标申请
export function addBidApply(data) {
  return request({
    url: "/project/bidApply",
    method: "post",
    data: data,
  });
}

// 修改投标申请
export function updateBidApply(data) {
  return request({
    url: "/project/bidApply",
    method: "put",
    data: data,
  });
}

// 删除投标申请
export function delBidApply(bidId) {
  return request({
    url: "/project/bidApply/" + bidId,
    method: "delete",
  });
}

// 查询项目信息列表
export function getStList() {
  return request({
    url: "/project/st/listAll",
    method: "get",
  });
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
