import Vue from "vue";

import Cookies from "js-cookie";

import Element from "element-ui";
import "./assets/styles/element-variables.scss";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css
import "@/assets/styles/print.scss"; // ruoyi css
import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; //directive
import { download } from "@/utils/request";

import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
    parseTime,
    resetForm,
    addDateRange,
    selectDictLabel,
    selectDictLabels,
    handleTree,
} from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import Pagination5 from "@/components/Pagination5";
import businessMessage from "@/utils/message";

// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 富文本组件
import Editor from "@/components/Editor";
// 文件上传组件
import FileUpload from "@/components/FileUpload";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload";
// 字典标签组件
import DictTag from "@/components/DictTag";
// 头部标签组件
import VueMeta from "vue-meta";
//echarts
//import echarts from 'echarts'
import * as echarts from "echarts";
import approvalProcess from "@/views/components/approvalProcess.vue";
Vue.component("approvalProcess", approvalProcess);
import approvalRecord from '@/views/components/approvalRecord.vue';
Vue.component("approvalRecord", approvalRecord);
import approvalPrint from '@/views/components/approvalPrint.vue';
Vue.component("approvalPrint", approvalPrint);
import customUpload from "@/views/components/customUpload.vue";
Vue.component("customUpload", customUpload);
import htmlImage from "@/utils/htmlImage";
Vue.use(htmlImage);
import filters from "@/utils/filters";
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.$messageContent = businessMessage;
Vue.prototype.$echarts = echarts;

Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
};

Vue.prototype.stateF = function(id) {
    if (id == "1") {
        return "待审批";
    } else if (id == "2") {
        return "审批中";
    } else if (id == "3") {
        return "已通过";
    } else if (id == "4") {
        return "已打回";
    } else if (id == "5") {
        return "已撤回";
    }
};

// 全局组件挂载
Vue.component("DictTag", DictTag);
Vue.component("Pagination", Pagination);
Vue.component("Pagination5", Pagination5);
Vue.component("RightToolbar", RightToolbar);
Vue.component("Editor", Editor);
Vue.component("FileUpload", FileUpload);
Vue.component("ImageUpload", ImageUpload);

Vue.use(directive);
Vue.use(VueMeta);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get("size") || "medium", // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});