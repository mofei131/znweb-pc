<style scoped>
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
  line-height: 30px;
}
.head-text span{
  display: block;
  width:220px;
  line-height:30px;
  margin-top:0px
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
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>终端客户名称：</div><span v-text="form.name"></span>
          </div>
          <div style="display:flex">
            <div>成立日期：</div><span v-text="form.setupTime"></span>
          </div>
          <div style="display:flex">
            <div>企业性质：</div><span v-text="form.nature"></span>
          </div>
          <div style="display:flex">
            <div>年需求量(万吨)：</div><span v-text="$options.filters.weightFilter(form.demand)"></span>
          </div>
          <div style="display:flex">
            <div>注册资本(万元)：</div><span v-text="$options.filters.moneyFilter(form.capital)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>开票结算方式：</div><span v-text="form.settlementType"></span>
          </div>
          <div style="display:flex">
            <div>结算规则：</div><span v-text="form.settlementGz"></span>
          </div>
          <div style="display:flex">
            <div>回款账期：</div><span v-text="form.paymentdays"></span>
          </div>
          <div style="display:flex">
            <div>付款方式：</div><span v-text="form.paymentType"></span>
          </div>
          <div style="display:flex">
            <div>评级：</div><span v-text="form.rating"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>评级说明：</div><span v-text="form.ratingDe"></span>
          </div>
        </el-col>
        <el-col :span="5">
          客户代码：<span v-text="form.customerCode"></span>
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
      <approval-record :typeId="13" :stId="terminalId"></approval-record>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right; margin-bottom: 50px; margin-right: 50px">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
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
