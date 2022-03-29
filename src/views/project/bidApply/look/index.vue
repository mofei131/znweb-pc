<style>
.head-title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  margin-top: 30px;
  margin-left: 20px;
}
.head-text{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 53px;
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
.el-textarea.is-disabled .el-textarea__inner{
  background-color:#FFF; /* 设置背景颜色为黑色 */
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
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          项目编号：<span v-text="form.stNumber"></span>
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
          单价（元/{{priceLabel}}）：<span v-text="form.bidPrice"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          投标数量（吨）：<span v-text="form.bidNumber"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          投标保证金（元）：<span v-text="form.bidBond"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          履约保证金（元）：<span v-text="form.performanceBond"></span>
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
          备注：<el-input disabled type="textarea"  :rows="3" v-model="form.remark" placeholder=""  />
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file" >
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>
       <!--      审批流程·-->
      <approval-process :typeId="18" :stId="bidId"></approval-process>

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
            style="width: 80%;margin-bottom: 30px;">
            <el-table-column
              property="deptName"
              label="部门">
            </el-table-column>
            <el-table-column
              property="nickName"
              label="审批人">
            </el-table-column>
            <el-table-column
              property="approveTime"
              label="审批时间">
            </el-table-column>
            <el-table-column
              property="processValue"
              label="审批说明">
            </el-table-column>
            <el-table-column
              property="status"
              label="审批状态">
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
        <div slot=""  class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getToken} from "@/utils/auth";
import {getProcessDataByStId} from "@/api/approve";
import { getBidApply } from "@/api/project/bidApply";
import CustomUpload from '@/views/components/customUpload'
export default {
  name: "bidApplyLook",
  components: {
    CustomUpload
  },
  data() {
    return {
      //审批集合
      stateList: [{"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"","state":"未审批"}],
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList:[],
      // 表单参数
      form: {},
      bidId:''
    };
  },
  computed:{
    priceLabel(){
      if(this.form.unitPriceMode === '吨'){
        return '吨';
      }else if(this.form.unitPriceMode === '热值'){
        return 'kcal';
      }
    }
  },
  created() {
    const bidId = this.$route.params && this.$route.params.bidId;
    this.bidId=bidId
    getBidApply(bidId).then(response => {
        this.form = response.data;
        this.fileList = this.form.fileList || []
      });
    getProcessDataByStId("18",bidId).then((res) => {
      this.stateList = res.data;
    });
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
