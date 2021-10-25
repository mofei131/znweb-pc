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
          <el-form-item label="基础信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4">
          收款类型：<span v-text="form.skType"></span>
        </el-col>
        <el-col :span="4">
          收款方式：<span v-text="form.skWay" ></span>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="出库信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-table
            ref="singleTable"
            :data="gryList"
            fit
            style="margin-bottom: 30px;">
            <el-table-column
              property="name"
              label="货品名称">
            </el-table-column>
            <el-table-column
              property="grnNumber"
              label="出库重量（吨）">
            </el-table-column>
            <el-table-column
              property="gryRz"
              label="出库热值（kcal）">
            </el-table-column>
            <el-table-column
              property="transportType"
              label="运输方式">
            </el-table-column>
            <el-table-column
              property="wlCompany"
              label="物流公司">
            </el-table-column>
            <el-table-column
              property="carNumber"
              label="车数">
            </el-table-column>
            <el-table-column
              property="batch"
              label="批次">
            </el-table-column>
            <el-table-column
              property="deliveryTime"
              label="到货日期">
            </el-table-column>
            <el-table-column
              property="valuePrice"
              label="货值单价（元）">
            </el-table-column>
            <el-table-column
              property="valueTprice"
              label="货值总额（吨）">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-text">
          <el-col :span="4" :offset="1">
            <el-form-item label="合计重量：" >
              <span  style="color: red">{{form.tweight}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="平均热值：" >
              <span  style="color: red">{{form.prz}}</span>
            </el-form-item>
          </el-col>
      </el-row>

      <el-row class="head-text" style="margin-top: 30px;">
        <el-col :span="4" :offset="1">
          收款总额(元)：<span v-text="form.skTprice"></span>
        </el-col>
        <el-col :span="4">
          税款(元)：<span v-text="form.tax"></span>
        </el-col>
        <el-col :span="4">
          收款单价：<span v-text="form.skPrice" ></span>
        </el-col>
        <el-col :span="4">
          收款日期：<span>{{ parseTime(form.skTime, '{y}-{m}-{d}') }}</span>
        </el-col>
        <el-col :span="4">
          承兑：<span v-text="form.accept" ></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          扣罚：<span v-text="form.punish"></span>
        </el-col>
        <el-col :span="4">
          其他扣罚：<span v-text="form.otherP"></span>
        </el-col>
        <el-col :span="12">
          其他扣罚说明：<span v-text="form.otherN"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          <el-form-item label="总计收款：" >
            <span  style="color: red">{{form.yftotalPrice}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="已预收金额：" >
            <span  style="color: red">{{form.yfPrice}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="实际应收金额：" >
            <span  style="color: red">{{form.sjPrice}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="12" :offset="1">
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
import {getProcessDataByStId} from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //审批集合
      stateList: [{"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"","state":"未审批"}],
      //出库集合
      gryList:[],

      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList:[],


      // 表单参数
      form: {},
    };
  },
  created() {
    const skId = this.$route.params && this.$route.params.skId;
    getSk(skId).then(response => {
      this.form=response.data
      this.fileList = response.data.fileList
      this.gryList = response.data.selnyList;
    })
    getProcessDataByStId("6",skId).then((res) => {
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

  }
};
</script>
