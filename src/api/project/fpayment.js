import request from "@/utils/request";

// 查询最终付款列表
export function listFpayment(query) {
    return request({
        url: "/project/fpayment/list",
        method: "get",
        params: query,
    });
}

// 查询最终付款详细
export function getFpayment(fpaymentId) {
    return request({
        url: "/project/fpayment/" + fpaymentId,
        method: "get",
    });
}

// 新增最终付款
export function addFpayment(data) {
    return request({
        url: "/project/fpayment",
        method: "post",
        data: data,
    });
}

// 修改最终付款
export function updateFpayment(data) {
    return request({
        url: "/project/fpayment",
        method: "put",
        data: data,
    });
}

// 删除最终付款
export function delFpayment(fpaymentId) {
    return request({
        url: "/project/fpayment/" + fpaymentId,
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

// 查询出库单列表
export function getGryList(data) {
    return request({
        url: "/project/gry/bydata",
        method: "get",
        params: data,
    });
}

// 查询委托合同
export function getContract(data) {
    return request({
        url: "/project/contract/bydata",
        method: "get",
        params: data,
    });
}

// 查询是否有未回款物流与保证金
export function getHkState(data) {
    return request({
        url: "/project/fpayment/HkState",
        method: "get",
        params: data,
    });
}

// 查询回款集合
export function getOmList(data) {
    return request({
        url: "/project/om/bydata",
        method: "get",
        params: data,
    });
}

// 结算服务费
export function jsSp(data) {
    return request({
        url: "/project/fpayment/jsSp",
        method: "get",
        params: data,
    });
}

// 查询开票列表
export function getSticktList(data) {
    return request({
        url: "/project/sticket/bydata",
        method: "get",
        params: data,
    });
}

// 验证出入库单状态是否可用
export function checkSelnyStatusF(fpaymentId) {
    return request({
        url: "/project/fpayment/checkSelnyStatus/" + fpaymentId,
        method: "get",
    });
}

// 重新绑定入/出库单
export function reBindSelnyF(fpaymentId) {
    return request({
        url: "/project/fpayment/reBindSelny/" + fpaymentId,
        method: "post",
    });
}

// 绑定入/出库单
export function releaseSelnyF(fpaymentId) {
    return request({
        url: "/project/fpayment/releaseSelny/" + fpaymentId,
        method: "post",
    });
}