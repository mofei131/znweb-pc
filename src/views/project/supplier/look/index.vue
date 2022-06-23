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
          <el-form-item label="供应商信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #ff0000">{{ stateF(form.state) }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          供应商名称：<span v-text="form.name"></span>
        </el-col>
        <el-col :span="5">
          成立日期：<span v-text="form.clTime"></span>
        </el-col>
        <el-col :span="5">
          年发运量(万吨)：<span
            v-text="$options.filters.weightFilter(form.traffic)"
          ></span>
        </el-col>
        <el-col :span="5">
          注册资本(万元)：<span
            v-text="$options.filters.moneyFilter(form.capital)"
          ></span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          供应商账号：<span v-text="form.account"></span>
        </el-col>
        <el-col :span="5">
          开户行：<span v-text="form.openbank"></span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          发票面额：<span v-text="form.invoiceType"></span>
        </el-col>
        <el-col :span="5">
          企业性质：<span v-text="form.nature"></span>
        </el-col>
        <el-col :span="5"> 评级：<span v-text="form.rating"></span> </el-col>
        <el-col :span="5">
          评级说明：<span v-text="form.ratingDe"></span>
        </el-col>
      </el-row>
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="原资方信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          原资方名称：<span v-text="form.sourcemName"></span>
        </el-col>
        <el-col :span="5">
          原资方放款节点：<span v-text="form.sourcemLn"></span>
        </el-col>
        <el-col :span="5">
          原资方费率：<span v-text="form.sourcemRate"></span>
        </el-col>
        <el-col :span="5">
          原资方放款比例：<span v-text="form.sourcemLr"></span>
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
           
      <approval-process :typeId="12" :stId="supplierId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="12" :stId="supplierId"></approval-record>
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
      supplierId: "",
    };
  },
  created() {
    const supplierId = this.$route.params && this.$route.params.supplierId;
    this.supplierId = supplierId;
    getSupplier(supplierId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
      this.gryList = response.data.selnyList;
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
