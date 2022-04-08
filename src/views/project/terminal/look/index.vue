<style>
.head-title {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  margin-top: 30px;
  margin-left: 20px;
}
.head-text {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 53px;
}

.upload-hidden .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    基础信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="终端客户信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #ff0000">{{ stateF(form.state) }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          终端客户名称：<span v-text="form.name"></span>
        </el-col>
        <el-col :span="5">
          成立日期：<span v-text="form.setupTime"></span>
        </el-col>
        <el-col :span="5">
          企业性质：<span v-text="form.nature"></span>
        </el-col>
        <el-col :span="5">
          年需求量(万吨)：<span
            v-text="$options.filters.weightFilter(form.demand)"
          ></span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          注册资本(万元)：<span
            v-text="$options.filters.moneyFilter(form.capital)"
          ></span>
        </el-col>
        <el-col :span="5">
          开票结算方式：<span v-text="form.settlementType"></span>
        </el-col>
        <el-col :span="5">
          结算规则：<span v-text="form.settlementGz"></span>
        </el-col>
        <el-col :span="5">
          回款账期：<span v-text="form.paymentdays"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          付款方式：<span v-text="form.paymentType"></span>
        </el-col>
        <el-col :span="5"> 评级：<span v-text="form.rating"></span> </el-col>
        <el-col :span="5">
          评级说明：<span v-text="form.ratingDe"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="18" :offset="1">
          <el-form-item label="附件：" prop="file">
            <!-- <el-upload
              disabled
              :action="url"
              :headers="headers"
              class="upload-hidden "
              :on-preview="handlePreview"
              list-type="text"
              :file-list="fileList">
            </el-upload> -->
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      审批流程·-->
           
      <approval-process :typeId="13" :stId="terminalId"></approval-process>
      <!--      审批信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="审批记录"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table
            ref="singleTable"
            :data="stateList"
            style="width: 80%; margin-bottom: 30px"
          >
            <el-table-column property="deptName" label="部门">
            </el-table-column>
            <el-table-column property="nickName" label="审批人">
            </el-table-column>
            <el-table-column property="approveTime" label="审批时间">
            </el-table-column>
            <el-table-column property="processValue" label="审批说明">
            </el-table-column>
            <el-table-column property="status" label="审批状态">
              <template slot-scope="scope">
                {{ scope.row.status == 0 ? "驳回" : "通过" }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div
          slot=""
          class="dialog-footer"
          style="text-align: right; margin-bottom: 50px; margin-right: 50px"
        >
          <el-button type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getSupplier } from "@/api/project/supplier";
import { getTerminal } from "@/api/project/terminal";
import { getProcessDataByStId } from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //审批集合
      stateList: [
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "",
          state: "未审批",
        },
      ],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],

      // 表单参数
      form: {},
      terminalId: "",
    };
  },
  created() {
    const terminalId = this.$route.params && this.$route.params.terminalId;
    this.terminalId = terminalId;
    getTerminal(terminalId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
    });
    getProcessDataByStId("13", terminalId).then((res) => {
      this.stateList = res.data;
    });
  },
  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    //点击触发
    handlePreview(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove(file, filelist) {},
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {},
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {},
    uploadError(err, file, filelist) {},
  },
};
</script>
