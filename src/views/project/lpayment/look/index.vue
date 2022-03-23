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

</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    基础信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="项目信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4" >
          第三方公司：<span v-text="form.tpcName"></span>
        </el-col>
        <el-col :span="4">
          公司账号：<span v-text="form.account"></span>
        </el-col>
        <el-col :span="4">
          公司开户行：<span v-text="form.openbank" ></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="基本信息"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          实付金额：<span v-text="form.tntPrice"></span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          备注：<span v-text="form.bz"></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="服务费信息"></el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          是否产生服务费：<span v-text="form.serType"></span>
        </el-col>
        <el-col :span="5">
          支付日期：<span>{{ parseTime(form.putTime, '{y}-{m}-{d}') }}</span>
        </el-col>
        <el-col :span="5">
          年服务费费率(%)：<span v-text="form.stRate" ></span>
        </el-col>
        <el-col :span="5">
          保底服务费期限(天)：<span v-text="form.mfsp"></span>
        </el-col>
      </el-row>




<!--      <el-row class="head-title">-->
<!--        <el-col :span="19">-->
<!--          <el-form-item label="人库信息"></el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-col :span="20" :offset="1">-->
<!--          <el-table-->
<!--            ref="singleTable"-->
<!--            :data="gryList"-->
<!--            fit-->
<!--            style="margin-bottom: 30px;">-->
<!--            <el-table-column-->
<!--              property="name"-->
<!--              label="货品名称">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="grnNumber"-->
<!--              label="出库重量（吨）">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="grnRz"-->
<!--              label="出库热值（kcal）">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="transportType"-->
<!--              label="运输方式">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="wlCompany"-->
<!--              label="物流公司">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="carNumber"-->
<!--              label="车数">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="batch"-->
<!--              label="批次">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="deliveryTime"-->
<!--              label="到货日期">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="valuePrice"-->
<!--              label="货值单价（元）">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="valueTprice"-->
<!--              label="货值总额（吨）">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="head-title">-->
<!--        <el-col :span="19">-->
<!--          <el-form-item label="追加费用"></el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="head-text">-->
<!--        <el-col :offset="1">-->
<!--          <el-table-->
<!--            ref="wlsingleTable"-->
<!--            :data="form.wldetailsList"-->
<!--            style="width: 80%;margin-bottom: 30px;">-->
<!--            <el-table-column-->
<!--              property="number"-->
<!--              label="发票号">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="wlType"-->
<!--              label="费用名称">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="ntPrice"-->
<!--              label="不含税金额">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="tax"-->
<!--              label="税率">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              property="taxPrice"-->
<!--              label="税额">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--      </el-row>-->


      <!--      合同信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table
            ref="singleTable"
            :data="contract"
            style="width: 80%;margin-bottom: 30px;">
            <el-table-column
              property="name"
              label="合同名称">
            </el-table-column>
            <el-table-column
              property="type"
              label="合同类型"
              :formatter="contractTypeFormat">
            </el-table-column>
            <el-table-column
              property="expectNumber"
              label="货品重量(吨)">
            </el-table-column>
            <el-table-column
              property=""
              label="合同附件">
            </el-table-column>
            <el-table-column
              property=""
              label="补充合同附件">
            </el-table-column>
            <el-table-column
              property=""
              label="双章合同附件">
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="toContract(scope.row.contractId)"
                  type="text"
                  size="small">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file" >
            <el-upload
              disabled
              :action="url"
              :headers="headers"
              class="upload-hidden"
              :on-preview="handlePreview"
              list-type="text"
              :file-list="fileList">
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row class="head-text">-->
<!--        <el-col :span="5" :offset="1">-->
<!--          运费金额(元)：<span v-text="form.yPrice"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          运费税率(%)：<span v-text="form.yRate"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          运费税额(元)：<span v-text="form.yTax" ></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          运费价税合计(元)：<span v-text="form.yTprice"></span>-->
<!--        </el-col>-->
<!--      </el-row>-->

<!--      <el-row class="head-text">-->
<!--        <el-col :span="5" :offset="1">-->
<!--          站台费金额(元)：<span v-text="form.ztPrice"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          站台费税率(%)：<span v-text="form.ztRate"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          站台费税额(元)：<span v-text="form.ztTax" ></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          站台费价税合计(元)：<span v-text="form.ztTprice"></span>-->
<!--        </el-col>-->
<!--      </el-row>-->

<!--      <el-row class="head-text">-->
<!--        <el-col :span="5" :offset="1">-->
<!--          其他费用金额(元)：<span v-text="form.otherPrice"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          其他费用税率(%)：<span v-text="form.otherRate"></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          其他费用税额(元)：<span v-text="form.otherTax" ></span>-->
<!--        </el-col>-->
<!--        <el-col :span="5">-->
<!--          其他费用价税合计(元)：<span v-text="form.otherTprice"></span>-->
<!--        </el-col>-->
<!--      </el-row>-->




      <!--      审批信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="审批信息"></el-form-item>
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

import {getContract} from "@/api/project/contract";
import {getToken} from "@/utils/auth";
import {getApayment} from "@/api/project/apayment";
import {getSk} from "@/api/project/sk";
import {getLpayment} from "@/api/project/lpayment";
import {getProcessDataByStId} from "@/api/approve";
import {getContractList} from "@/api/project/all";

export default {
  name: "contractLook",
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


      //出库集合
      gryList:[],
      // 表单参数
      form: {},

      //合同集合
      contract:[],
    };
  },
  created() {
    const lpaymentId = this.$route.params && this.$route.params.lpaymentId;
    getLpayment(lpaymentId).then(response => {

      this.form=response.data
      this.fileList = response.data.fileList
      this.gryList = response.data.selnyList;
      this.form.wldetailsList = response.data.wldetailsList

      let data={"stId": this.form.stId}
      //合同
      getContractList(data).then(response =>{
        this.contract=response.rows
      })

    })
    getProcessDataByStId("9",lpaymentId).then((res) => {
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
    },
    handleExceed(files, fileList) {
    },
    beforeRemove(file, fileList) {
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {

    },
    uploadError(err, file, filelist) {
    },

    //跳转合同详情
    toContract(contractId){
      this.$router.push("/contract/look/" + contractId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if(row.type=='1'){
        return "上游合同"
      }else if(row.type=='2'){
        return "下游合同"
      }else if(row.type=='3'){
        return "物流运输合同"
      }else if(row.type=='4'){
        return "物流服务合同"
      }else if(row.type=='5'){
        return "其他合同"
      }
    },

  }
};
</script>
