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
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff; /* 设置背景颜色为黑色 */
}
</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    合同信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="基础信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.projectName"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          业务名称: <span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          立项编号: <span v-text="form.serialNo"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          投标平台：<span v-text="form.bidPlatform"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          单价模式：<span v-text="form.unitPriceMode"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          单价（元/{{ priceLabel }}）：<span
            v-text="$options.filters.moneyFilter(form.bidPrice)"
          ></span>
        </el-col>
        <el-col :span="4" :offset="1">
          投标数量（吨）：<span
            v-text="$options.filters.weightFilter(form.bidNumber)"
          ></span>
        </el-col>
        <el-col :span="4" :offset="1">
          投标保证金（元）：<span
            v-text="$options.filters.moneyFilter(form.bidBond)"
          ></span>
        </el-col>
        <el-col :span="4" :offset="1">
          履约保证金（元）：<span
            v-text="$options.filters.moneyFilter(form.performanceBond)"
          ></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          发站：<span v-text="form.sendStation"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          到站：<span v-text="form.arriveStation"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="18" :offset="1">
          备注：<el-input
            disabled
            type="textarea"
            :rows="3"
            v-model="form.remark"
            placeholder=""
          />
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file">
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      审批流程·-->
            <approval-process :typeId="18" :stId="bidId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="18" :stId="bidId"></approval-record>
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
import { getProcessDataByStId } from "@/api/approve";
import { getBidApply, listForBus, listForPro } from "@/api/project/bidApply";
import CustomUpload from "@/views/components/customUpload";
export default {
  name: "bidApplyLook",
  components: {
    CustomUpload,
  },
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
      bidId: "",
      listForBusArr: [],
      listForProArr: [],
    };
  },
  computed: {
    priceLabel() {
      if (this.form.unitPriceMode === "吨") {
        return "吨";
      } else if (this.form.unitPriceMode === "热值") {
        return "kcal";
      }
    },
  },
  created() {
    this.listForBus();
    this.listForPro();
    const bidId = this.$route.params && this.$route.params.bidId;
    this.bidId = bidId;
    getBidApply(bidId).then((response) => {
      this.form = response.data;
      this.fileList = this.form.fileList || [];
    });
  },
  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    // 查询业务列表
    async listForBus() {
      const { data } = await listForBus();
      this.listForBusArr = data;
      // console.log(11, this.listForBusArr);
      this.form = this.listForBusArr;
      // console.log(33, this.form);
    },
    // 查询项目列表
    async listForPro() {
      const { data } = await listForPro();
      this.listForProArr = data;
      // console.log(22, this.listForProArr);
      this.form = this.listForProArr;
      // console.log(44, this.form);
    },
  },
};
</script>
