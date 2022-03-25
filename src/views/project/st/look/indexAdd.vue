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

</style>
<template>
  <div>

    <el-form label-width="20px;" label-position="left">
      <!--    基础信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="基本信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目编号：<span v-text="form.number"></span>
        </el-col>
        <el-col :span="4">
          项目名称：<span v-text="form.name"></span>
        </el-col>
        <el-col :span="4">
          项目金额(万元)：<span v-text="form.amount"></span>
        </el-col>
        <el-col :span="4">
          代办人：<span v-text="form.userName"></span>
        </el-col>
        <el-col :span="4" >
          供应商：<span v-text="form.supplierName"></span>
        </el-col>

      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          立项编号：<span v-text="form.productNo"></span>
        </el-col>
        <el-col :span="4">
          结算比例：<span v-text="form.settlementP"></span>
        </el-col>
        <el-col :span="4" >
          客户经理：<span v-text="form.managerName"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="履约保证金"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          履约保证金金额(万元)：<span v-text="form.margin"></span>
        </el-col>
        <el-col :span="4">
          结算方式(元)：<span v-text="form.settlementWay"></span>
        </el-col>
        <el-col :span="4">
          服务周期开始：<span v-text="form.cycleStart"></span>
        </el-col>
        <el-col :span="4">
          服务周期结束：<span v-text="form.cycleEnd"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="服务费"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          年费收取模式：<span v-text="form.chargemType"></span>
        </el-col>
        <el-col :span="4">
          年费服务费费率(%)：<span v-text="form.chargemNx"></span>
        </el-col>
        <el-col :span="4">
          固定差价：<span v-text="form.chargemGd"></span>
        </el-col>
        <el-col :span="4">
          预计单价(元)：<span v-text="form.expectPrice"></span>
        </el-col>
        <el-col :span="4">
          预计重量(吨)：<span v-text="form.expectWeight"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          成本年服务费费率(%)：<span v-text="form.rateYear"></span>
        </el-col>
        <el-col :span="4">
          预计利润：<span v-text="form.expectProfits"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="自助金融方"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          公司名称：<span v-text="form.shName"></span>
        </el-col>
        <el-col :span="4">
          性质：<span v-text="form.shXz"></span>
        </el-col>
        <el-col :span="4">
          合作方式：<span v-text="form.shHztype"></span>
        </el-col>
        <el-col :span="4">
          资金费率(%)：<span v-text="form.shHzrate"></span>
        </el-col>
        <el-col :span="4">
          下游渠道年限：<span v-text="form.shChannelyear"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          结算比例：<span v-text="form.shSettlement"></span>
        </el-col>
        <el-col :span="4">
          履约保证金(元)：<span v-text="form.shMargin"></span>
        </el-col>
        <el-col :span="4">
          合同签署：<span v-text="form.shContracttype"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="终端客户"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          终端客户名称：<span v-text="form.tName"></span>
        </el-col>
        <el-col :span="4">
          性质：<span v-text="form.tXz"></span>
        </el-col>
        <el-col :span="4">
          立户情况：<span v-text="form.tAccount"></span>
        </el-col>
        <el-col :span="4">
          合作年限：<span v-text="form.tCyear"></span>
        </el-col>
        <el-col :span="4" >
          投标方式：<span v-text="form.tTender"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          投标保证金：<span v-text="form.tMargintype"></span>
        </el-col>
        <el-col :span="4">
          投标保证金(万元)：<span v-text="form.tMargin"></span>
        </el-col>
        <el-col :span="4">
          保证金缴纳时间：<span v-text="form.tMargintime"></span>
        </el-col>
        <el-col :span="4">
          合同签署：<span v-text="form.tContracttype"></span>
        </el-col>
        <el-col :span="4">
          合同后置时间：<span v-text="form.tContracttime"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          运输方式：<span v-text="form.tTransporttype"></span>
        </el-col>
        <el-col :span="4">
          发站：<span v-text="form.tTransportstart"></span>
        </el-col>
        <el-col :span="4">
          到站：<span v-text="form.tTransportend"></span>
        </el-col>

      </el-row>

      <el-row class="head-text">
        <el-col :span="8" :offset="1">
          到场数质确认时间：<span v-text="form.tOktime"></span>
        </el-col>
        <el-col :span="8">
          到场数质确认方式：<span v-text="form.tOktype"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          开票结算方式：<span v-text="form.tSettlementtype"></span>
        </el-col>
        <el-col :span="4">
          结算规则：<span v-text="form.tSettlementgz"></span>
        </el-col>
        <el-col :span="4">
          回款账期：<span v-text="form.tPaymentdays"></span>
        </el-col>
        <el-col :span="4">
          付款方式：<span v-text="form.tPaymenttype"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="站台情况"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          站台名字：<span v-text="form.pName"></span>
        </el-col>
        <el-col :span="4">
          站台经营方式：<span v-text="form.pJymode"></span>
        </el-col>
        <el-col :span="4">
          站台规模：<span v-text="form.pSize"></span>
        </el-col>
        <el-col :span="4">
          站台发运方式：<span v-text="form.pFymode"></span>
        </el-col>
        <el-col :span="4">
          承运方发运名称：<span v-text="form.pCname"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          承运方性质：<span v-text="form.pCxz"></span>
        </el-col>
        <el-col :span="4">
          程远方发运年限：<span v-text="form.pCyear"></span>
        </el-col>
        <el-col :span="4">
          承运方发运规模(万吨/年)：<span v-text="form.pCnumber"></span>
        </el-col>
      </el-row>



      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="其他内容"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="10" :offset="1">
          备注说明： <el-input type="textarea" disabled :rows="5" v-model="form.node" placeholder="请输入备注说明" />
        </el-col>
      </el-row>

      <el-row class="head-text" style="margin-bottom: 50px;">
        <el-col :span="6" :offset="1">
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
      <approval-process :typeId="1" :stId="stId"></approval-process>

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

import {getSt} from "@/api/project/st";
import {getToken} from "@/utils/auth";
import {getProcessDataByStId} from "@/api/approve";


export default {
  name: "look",
  data() {
    return {

      //审批集合
      stateList: [],

      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList:[],

      // 表单参数
      form: {},
      gryLr:0.00,
      gryNumber:0,
      stId:''
    };
  },
  created() {
    const stId = this.$route.params && this.$route.params.stId;
    this.stId=stId
    getSt(stId).then(response => {
      this.form=response.data
      this.fileList = response.data.fileList
      if(this.form.chargemType=='1'){
        this.form.chargemType="年息"
      }else if(this.form.chargemType=='2'){
        this.form.chargemType="固定差价"
      }else if(this.form.chargemType=='3'){
        this.form.chargemType="年息+固定差价"
      }
      if(this.form.tMargintype=='1'){
        this.form.tMargintype="有"
      }else if(this.form.tMargintype=='2'){
        this.form.tMargintype="无"
      }

      if(this.form.settlementP=='其他'){
        if(this.form.settlementPA1!=null && this.form.settlementPA1!=''){
          this.form.settlementP=this.form.settlementPA1+"%";
          if(this.form.settlementPA2!=null && this.form.settlementPA2!=''){
            this.form.settlementP=this.form.settlementPA1+"%-"+this.form.settlementPA2+"%";
            if(this.form.settlementPA3!=null && this.form.settlementPA3!=''){
              this.form.settlementP=this.form.settlementPA1+"%-"+this.form.settlementPA2+"%-"+this.form.settlementPA3+"%"
            }
          }
        }
        // this.form.settlementP=this.form.settlementPA1+"%-"+this.form.settlementPA2+"%-"+this.form.settlementPA3+"%"
      }
      if(this.form.shSettlement=='其他'){
        if(this.form.shSettlementA1!=null && this.form.shSettlementA1!=''){
          this.form.shSettlement=this.form.shSettlementA1+"%";
          if(this.form.shSettlementA2!=null && this.form.shSettlementA2!=''){
            this.form.shSettlement=this.form.shSettlementA1+"%-"+this.form.shSettlementA2+"%"
            if(this.form.shSettlementA3!=null && this.form.shSettlementA3!=''){
              this.form.shSettlement=this.form.shSettlementA1+"%-"+this.form.shSettlementA2+"%-"+this.form.shSettlementA3+"%"
            }
          }
        }
        // this.form.shSettlement=this.form.shSettlementA1+"%-"+this.form.shSettlementA2+"%-"+this.form.shSettlementA3+"%"
      }
    })

    getProcessDataByStId("1",stId).then((res) => {
      this.stateList = res.data;
    });
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    //点击触发
    handlePreview(file) {
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove(file, filelist) {
      this.form.fileList=[];
      for(let i=0;i<filelist.length;i++){
        if (filelist[i].response != undefined) {
          let art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
          this.form.fileList.push(art);
        }else {
          let art = {"name": filelist[i].name, "url": filelist[i].url};
          this.form.fileList.push(art);
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList=[];
        for(var i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index,1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },

  }
};
</script>
