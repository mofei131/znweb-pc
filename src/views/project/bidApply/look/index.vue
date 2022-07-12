<style scoped>
.newTable td{
  min-width: 130px;
}
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
  line-height: 30px;
}
.head-text span{
  display: block;
  width:220px;
  line-height:30px;
  margin-top:0px
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
.el-textarea.is-disabled .el-textarea__inner{
  background-color:#fff; /* 设置背景颜色为黑色 */
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
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{form.projectName}}</td>
              <td class="tdTitle">业务名称</td>
              <td class="tdCoent">{{form.stName}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
            </tr>
            <tr>
              <td class="tdTitle">投标平台</td>
              <td class="tdCoent">{{form.bidPlatform}}</td>
              <td class="tdTitle">单价模式</td>
              <td class="tdCoent">{{form.unitPriceMode}}</td>
              <td class="tdTitle">单价（元/{{priceLabel }}）</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.bidPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">投标数量（吨）</td>
              <td class="tdCoent">{{$options.filters.weightFilter(form.bidNumber)}}</td>
              <td class="tdTitle">投标保证金（元）</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.bidBond)}}</td>
              <td class="tdTitle">履约保证金（元）</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.performanceBond)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">发站</td>
              <td class="tdCoent">{{form.sendStation}}</td>
              <td class="tdTitle">到站</td>
              <td class="tdCoent">{{form.arriveStation}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="22" :offset="1">
          备注：
          <el-input disabled type="textarea" :rows="3" v-model="form.remark" placeholder="" />
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
        <div slot="" class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getToken} from "@/utils/auth";
import {getProcessDataByStId} from "@/api/approve";
import { getBidApply} from "@/api/project/bidApply";
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
      bidId: ""
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
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
