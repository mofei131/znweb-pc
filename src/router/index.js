import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path(.*)",
            component: (resolve) => require(["@/views/redirect"], resolve),
        }, ],
    },
    {
        path: "/login",
        component: (resolve) => require(["@/views/login"], resolve),
        hidden: true,
    },
    {
        path: "/404",
        component: (resolve) => require(["@/views/error/404"], resolve),
        hidden: true,
    },
    {
        path: "/401",
        component: (resolve) => require(["@/views/error/401"], resolve),
        hidden: true,
    },
    {
        path: "",
        component: Layout,
        redirect: "index",
        children: [{
            path: "index",
            component: (resolve) => require(["@/views/index"], resolve),
            name: "首页",
            meta: { title: "首页", icon: "dashboard", noCache: true, affix: true },
        }, ],
    },
    {
        path: "",
        component: Layout,
        redirect: "financialStatement",
        children: [{
            path: "financialStatement",
            component: (resolve) => require(["@/views/project/financialStatement/index"], resolve),
            name: "财务报表",
            meta: { title: "财务报表", icon: "dashboard", noCache: true, affix: true },
        }, ],
    },
    {
        path: "/user",
        component: Layout,
        hidden: true,
        redirect: "noredirect",
        children: [{
            path: "profile",
            component: (resolve) =>
                require(["@/views/system/user/profile/index"], resolve),
            name: "Profile",
            meta: { title: "个人中心", icon: "user" },
        }, ],
    },
    {
        path: "/auth",
        component: Layout,
        hidden: true,
        children: [{
            path: "role/:userId(\\d+)",
            component: (resolve) =>
                require(["@/views/system/user/authRole"], resolve),
            name: "AuthRole",
            meta: { title: "分配角色" },
        }, ],
    },
    {
        path: "/auth",
        component: Layout,
        hidden: true,
        children: [{
            path: "user/:roleId(\\d+)",
            component: (resolve) =>
                require(["@/views/system/role/authUser"], resolve),
            name: "AuthUser",
            meta: { title: "分配用户" },
        }, ],
    },
    {
        path: "/dict",
        component: Layout,
        hidden: true,
        children: [{
            path: "type/data/:dictId(\\d+)",
            component: (resolve) => require(["@/views/system/dict/data"], resolve),
            name: "Data",
            meta: { title: "字典数据", icon: "" },
        }, ],
    },
    {
        path: "/job",
        component: Layout,
        hidden: true,
        children: [{
            path: "log",
            component: (resolve) => require(["@/views/monitor/job/log"], resolve),
            name: "JobLog",
            meta: { title: "调度日志" },
        }, ],
    },
    {
        path: "/gen",
        component: Layout,
        hidden: true,
        children: [{
            path: "edit/:tableId(\\d+)",
            component: (resolve) =>
                require(["@/views/tool/gen/editTable"], resolve),
            name: "GenEdit",
            meta: { title: "修改生成配置" },
        }, ],
    },
    {
        path: "/st",
        component: Layout,
        hidden: true,
        children: [{
            path: "look/:stId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/st/look/index"], resolve),
            name: "look",
            meta: { title: "查看明细" },
        }, ],
    },
    {
        path: "/st",
        component: Layout,
        hidden: true,
        children: [{
            path: "lookAdd/:stId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/st/look/indexAdd"], resolve),
            name: "lookAdd",
            meta: { title: "查看新增业务" },
        },
        {
            path: "lookAddP/:stId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/st/lookindexAdd"], resolve),
            name: "lookindexAdd",
            meta: { title: "查看新增项目" },
        },
     ],
    },
    {
        path: "/st",
        component: Layout,
        hidden: true,
        children: [{
                path: "lookUpdate",
                component: (resolve) =>
                    require(["@/views/project/st/look/indexUpdate"], resolve),
                name: "lookUpdate",
                meta: { title: "查看项目操作" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/st/index"], resolve),
                name: "stAdd",
                meta: { title: "添加项目" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/st/index"], resolve),
                name: "stEdit",
                meta: { title: "修改项目" },
            },
        ],
    },
    {
        path: "/contract",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:contractId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/contract/look/index"], resolve),
                name: "contractLook",
                meta: { title: "查看合同" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/contract/index"], resolve),
                name: "contractAdd",
                meta: { title: "添加合同" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/contract/index"], resolve),
                name: "contractEdit",
                meta: { title: "修改合同" },
            },
        ],
    },
    {
        path: "/grn",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:grnId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/grn/look/index"], resolve),
                name: "grnLook",
                meta: { title: "查看入库" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/grn/index"], resolve),
                name: "grnAdd",
                meta: { title: "添加入库" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/grn/index"], resolve),
                name: "grnEdit",
                meta: { title: "修改入库" },
            },
        ],
    },
    {
        path: "/gry",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:gryId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/gry/look/index"], resolve),
                name: "gryLook",
                meta: { title: "查看出库" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/gry/index"], resolve),
                name: "gryAdd",
                meta: { title: "添加出库" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/gry/index"], resolve),
                name: "gryEdit",
                meta: { title: "修改出库" },
            },
        ],
    },
    {
        path: "/gry",
        component: Layout,
        hidden: true,
        children: [{
            path: "aou/:gryId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/gry/aou/index"], resolve),
            name: "gryAou",
            meta: { title: "修改出库" },
        }, ],
    },
    {
        path: "/apayment",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:apyamentId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/apayment/look/index"], resolve),
                name: "apaymentLook",
                meta: { title: "查看预付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/apayment/index"], resolve),
                name: "apaymentAdd",
                meta: { title: "添加预付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/apayment/index"], resolve),
                name: "apaymentEdit",
                meta: { title: "修改预付款" },
            },
        ],
    },
    {
        path: "/sk",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:skId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/sk/look/index"], resolve),
                name: "skLook",
                meta: { title: "查看收款" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/sk/index"], resolve),
                name: "skAdd",
                meta: { title: "添加收款" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/sk/index"], resolve),
                name: "skEdit",
                meta: { title: "修改收款" },
            },
        ],
    },
    {
        path: "/lpayment",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:lpaymentId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/lpayment/look/index"], resolve),
                name: "lpaymentLook",
                meta: { title: "查看物流付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/lpayment/index"], resolve),
                name: "lpaymentAdd",
                meta: { title: "添加物流付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/lpayment/index"], resolve),
                name: "lpaymentEdit",
                meta: { title: "修改物流付款" },
            },
        ],
    },
    {
        path: "/fpayment",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:fpaymentId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/fpayment/look/index"], resolve),
                name: "fpaymentLook",
                meta: { title: "查看最终付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/fpayment/index"], resolve),
                name: "fpaymentAdd",
                meta: { title: "添加最终付款" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/fpayment/index"], resolve),
                name: "fpaymentEdit",
                meta: { title: "修改最终付款" },
            },
        ],
    },
    {
        path: "/sticket",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:sticketId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/sticket/look/index"], resolve),
                name: "sticketLook",
                meta: { title: "查看收票" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/sticket/index"], resolve),
                name: "sticketAdd",
                meta: { title: "添加收票" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/sticket/index"], resolve),
                name: "sticketEdit",
                meta: { title: "修改收票" },
            },
        ],
    },
    {
        path: "/supplier",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:supplierId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/supplier/look/index"], resolve),
                name: "supplierLook",
                meta: { title: "查看供应商" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/supplier/index"], resolve),
                name: "supplierEdit",
                meta: { title: "修改供应商" },
            },
        ],
    },
    {
        path: "/terminal",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:terminalId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/terminal/look/index"], resolve),
                name: "terminalLook",
                meta: { title: "查看终端客户" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/terminal/index"], resolve),
                name: "terminalEdit",
                meta: { title: "修改终端客户" },
            },
        ],
    },
    {
        path: "/margin",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:marginId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/margin/look/index"], resolve),
                name: "marginLook",
                meta: { title: "查看保证金" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/margin/index"], resolve),
                name: "marginAdd",
                meta: { title: "添加保证金" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/margin/index"], resolve),
                name: "marginEdit",
                meta: { title: "修改保证金" },
            },
        ],
    },
    {
        path: "/kp",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:kpId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/kp/look/index"], resolve),
                name: "kpLook",
                meta: { title: "查看开票" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/kp/index"], resolve),
                name: "kpAdd",
                meta: { title: "添加开票" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/kp/index"], resolve),
                name: "kpEdit",
                meta: { title: "修改开票" },
            },
        ],
    },
    {
        path: "/dp",
        component: Layout,
        hidden: true,
        children: [{
                path: "index",
                component: (resolve) => require(["@/views/project/dp/index"], resolve),
                name: "dpAdd",
                meta: { title: "添加期间费用" },
            },
            {
                path: "index",
                component: (resolve) => require(["@/views/project/dp/index"], resolve),
                name: "dpEdit",
                meta: { title: "修改期间费用" },
            },
        ],
    },
    {
        path: "/cplan",
        component: Layout,
        hidden: true,
        children: [{
            path: "look/:cplanId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/cplan/look/index"], resolve),
            name: "cplanLook",
            meta: { title: "查看资金计划" },
        }, ],
    },
    {
        path: "/dp",
        component: Layout,
        hidden: true,
        children: [{
            path: "look/:dpId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/dp/look/index"], resolve),
            name: "dpLook",
            meta: { title: "查看期间费用" },
        }, ],
    },
    {
        path: "/kd",
        component: Layout,
        hidden: true,
        children: [{
            path: "look/:kdId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/kd/look/index"], resolve),
            name: "kdLook",
            meta: { title: "查看快递记录" },
        }, ],
    },
    {
        path: "/paydetails",
        component: Layout,
        hidden: true,
        children: [{
            path: "list",
            component: (resolve) =>
                require(["@/views/project/paydetails/index"], resolve),
            name: "paydetailsList",
            meta: { title: "付款明细" },
        }, ],
    },
    {
        path: "/wldetails",
        component: Layout,
        hidden: true,
        children: [{
            path: "look/:wldetailsId(\\d+)",
            component: (resolve) =>
                require(["@/views/project/wldetails/look/index"], resolve),
            name: "wldetailsLook",
            meta: { title: "查看物流收票" },
        }, ],
    },
    {
        path: "/realsk",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:realskId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/realsk/look/index"], resolve),
                name: "realskLook",
                meta: { title: "查看实际收款" },
            },
            {
                path: "edit",
                component: (resolve) =>
                    require(["@/views/project/realsk/index"], resolve),
                name: "realskEdit",
                meta: { title: "修改实际收款" },
            },
        ],
    },
    {
        path: "/bidApply",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:bidId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/bidApply/look/index"], resolve),
                name: "bidApplyLook",
                meta: { title: "查看投标申请" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/bidApply/index"], resolve),
                name: "bidApplyEdit",
                meta: { title: "修改投标申请" },
            },
        ],
    },
    {
        path: "/preview",
        component: Layout,
        hidden: true,
        children: [{
            path: "index",
            component: (resolve) =>
                require(["@/views/project/preview/index"], resolve),
            name: "previewPage",
            meta: { title: "附件预览" },
        }, ],
    },
    {
        path: "/refund",
        component: Layout,
        hidden: true,
        children: [{
                path: "look/:refundId(\\d+)",
                component: (resolve) =>
                    require(["@/views/project/refund/look/index"], resolve),
                name: "refundLook",
                meta: { title: "退款管理查看" },
            },
            {
                path: "index",
                component: (resolve) =>
                    require(["@/views/project/refund/index"], resolve),
                name: "refundEdit",
                meta: { title: "添加退款申请" },
            },
        ],
    },
    {
        path: "/platform",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/platform",
                component: (resolve) =>
                    require(["@/views/project/platform/index"], resolve),
                name: "platform",
                meta: { title: "站台管理" },
            },
        ],
    },
];

export default new Router({
    mode: "history", // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});
