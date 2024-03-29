import request from "@/utils/request";

// 查询我的发起
export function myInitiate(query) {
    return request({
        url: "/approve/process/myInitiate",
        method: "post",
        data: query,
    });
}

// 根据部门获取用户下拉列表
export function selectUserItemByDeptId(deptId) {
    return request({
        url: "/approve/process/selectUserItemByDeptId/" + deptId,
        method: "get",
    });
}

// 查询我的发起
export function createProcess(query) {
    return request({
        url: "/approve/process/create",
        method: "put",
        data: query,
    });
}

// 获取审批记录
export function getProcessData(query) {
    return request({
        url: "/approve/process/selectNodesByProcessId/" + query,
        method: "get",
    });
}

// 获取审批记录
export function getProcessDataByStId(typeId, stId) {
    return request({
        url: "/approve/process/selectNodesByProcessIdByStId/" + typeId + "/" + stId,
        method: "get",
    });
}

// 审批通过
export function passed(query, id, level, remark) {
    return request({
        url: "/approve/process/passed/" +
            query +
            "/" +
            id +
            "/" +
            level +
            "/" +
            remark,
        method: "get",
    });
}

// 驳回
export function turnDownByProcessId(query, id, remark) {
    return request({
        url: "/approve/process/turnDown/" + query + "/" + id + "/" + remark,
        method: "get",
    });
}

// 我的待办
export function getMyUpcoming(query) {
    return request({
        url: "/approve/process/myUpcoming",
        method: "post",
        data: query,
    });
}

// 我的部门待办
export function getMyUpcomingDept(query) {
    return request({
        url: "/approve/process/myUpcomingDeptList",
        method: "post",
        data: query,
    });
}

// 我的已办
export function myAlreadyDoneList(query) {
    return request({
        url: "/approve/process/myAlreadyDone",
        method: "post",
        data: query,
    });
}

// 抄送我的
export function myCcList(query) {
    return request({
        url: "/approve/process/myCc",
        method: "post",
        data: query,
    });
}

//重新发起
export function reInitiate(query) {
    return request({
        url: "/approve/process/update",
        method: "post",
        data: query,
    });
}

//重新发起
export function reInitiates(query) {
    return request({
        url: "/approve/process/reInitiates/" + query,
        method: "get",
    });
}

// 查看详情
export function view(query) {
    return request({
        url: "/approve/process/view",
        method: "post",
        data: query,
    });
}

// // 获取全部流程
// export function list(query) {
//     return request({
//         url: "/approve/process/list",
//         method: "post",
//         data: query,
//     });
// }

// 根据流程ID获取流程信息
export function info(query) {
    return request({
        url: "/approve/process/info/" + query,
        method: "get",
    });
}

// 获取部门信息
export function selectDeptInfoById(query) {
    return request({
        url: "/approve/process/selectDeptInfoById/" + query,
        method: "get",
    });
}

// 获取抄送人与审批人
export function selectCCAndApproveByProcessId(query) {
    return request({
        url: "/approve/process/select/cc/approve/" + query,
        method: "get",
    });
}

// 获取部门信息
export function selectDeptInfoByDeptId(query) {
    return request({
        url: "/approve/process/select/dept/info/" + query,
        method: "get",
    });
}

// 启用禁用
export function updateStatus(query, status) {
    return request({
        url: "/approve/process/updateStatus/" + query + "/" + status,
        method: "get",
    });
}

// 删除审批记录
export function deleteByStId(stId) {
    return request({
        url: "/approve/approve/delete/" + stId,
        method: "get",
    });
}

export function selectUserNameByDeptIdAndOrder(id, nodeOrder, deptId) {
    return request({
        url: "/approve/process/selectUserNameByDeptIdAndOrder/" +
            id +
            "/" +
            nodeOrder +
            "/" +
            deptId,
        method: "get",
    });
}

export function listByMonth(query) {
    return request({
        url: "/project/profits/listByMonth",
        method: "get",
        params: query,
    });
}

// 审批环节列表接口
export function getApprovalProcessList(typeId, stId) {
    return request({
        url: "/approve/process/selectNodesDefByStId/" + typeId + "/" + stId,
        method: "get",
    });
}
// 审批类型
export function getApprovalType(query) {
    return request({
        url: "/approve/approve/checkProcessConfig",
        method: "get",
        params: query
    })
}

// 撤回
export function withdraw(query, id) {
    return request({
        url: "/approve/process/withdraw/" + query + "/" + id,
        method: "post",
    });
}

//220621流程配置保存
export function processDefSave(query) {
    return request({
        url: "/approve/processDef/save",
        method: "post",
        data: query,
    });
}
//220621获取所有人员列表
export function listForCombobox(query) {
    return request({
        url: "/system/user/listForCombobox",
        method: "get",
    });
}
// 220621获取全部流程
export function list(query) {
    return request({
        url: "/approve/processDef/list",
        method: "get",
        params: query,
    });
}
//220621获取流程详情
export function getProcessDefInfo(query) {
    return request({
        url: "/approve/processDef/info/" + query,
        method: "get",
    });
}

// 我的待办
export function taskTodo(query) {
    return request({
        url: "/approve/approve/taskTodo",
        method: "get",
        params: query,
    });
}

// 我的已办
export function taskDone(query) {
    return request({
        url: "/approve/approve/taskDone",
        method: "get",
        params: query,
    });
}

// 抄送我的
export function taskCc(query) {
    return request({
        url: "/approve/approve/taskCc",
        method: "get",
        params: query,
    });
}

// 我的发起
export function taskInitiator(query) {
    return request({
        url: "/approve/approve/taskInitiator",
        method: "get",
        params: query,
    });
}

// 任务提交
export function submitTask(query) {
    return request({
        url: "/approve/approve/submitTask",
        method: "post",
        data: query,
    });
}

// 重新发起流程
export function restartProcess(query) {
    return request({
        url: "/approve/approve/restartProcess",
        method: "post",
        data: query,
    });
}

// 撤回流程
export function withdrawProcess(query) {
    return request({
        url: "/approve/approve/withdrawProcess",
        method: "post",
        data: query,
    });
}

// 删除流程数据
export function removeProcess(query) {
    return request({
        url: "/approve/approve/removeProcess",
        method: "post",
        data: query,
    });
}