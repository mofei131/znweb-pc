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
      <!--    出库信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="出库信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          项目编号：<span v-text="form.number"></span>
        </el-col>
        <el-col :span="4">
          出库重量：<span v-text="form.grnNumber"></span>
        </el-col>
        <el-col :span="4">
          到货日期：<span>{{ parseTime(form.okTime, '{y}-{m}-{d}') }}</span>
        </el-col>
        <el-col :span="4">
          出库热值：<span v-text="form.gryRz"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="5" :offset="1">
          货值单价：<span v-text="$options.filters.moneyFilter(form.valuePrice)"></span>
        </el-col>
        <el-col :span="5">
          货值总额：<span v-text="$options.filters.moneyFilter(form.valueTprice)"></span>
        </el-col>
      </el-row>


      <el-row style="margin-top: 30px;">
        <el-col :span="20" :offset="1">
          <el-table :data="zlList" fit style="margin-bottom: 22px;">
            <el-table-column  label="水分(%)">
              <template slot-scope="scope" >
                <span v-text="form.coalSf"></span>
              </template>
            </el-table-column>
            <el-table-column  label="内水(%)">
              <template >
                <span v-text="form.coalNs"  />
              </template>
            </el-table-column>
            <el-table-column  label="灰份(%)">
              <el-table-column  label="Aad">
                <template   prop="coalAad">
                  <span v-text="form.coalAad"  />
                </template>
              </el-table-column>
              <el-table-column  label="ad">
                <template   prop="coalAd">
                  <span v-text="form.coalAd"  />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="挥发份(%)">
              <el-table-column  label="Vda">
                <template   prop="coalVda">
                  <span v-text="form.coalVda"  />
                </template>
              </el-table-column>
              <el-table-column  label="Vdae">
                <template   prop="coalVdae">
                  <span v-text="form.coalVdae"  />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column  label="灰熔点(℃)">
              <template   prop="coalHrd">
                <span v-text="form.coalHrd"  />
              </template>
            </el-table-column>
            <el-table-column   label="固定碳(%)">
              <template   prop="coalGdt">
                <span v-text="form.coalGdt"  />
              </template>
            </el-table-column>
            <el-table-column  label="含硫量(%)">
              <template   prop="coalHll">
                <span v-text="form.coalHll"  />
              </template>
            </el-table-column>
            <el-table-column label="热值(%)">
              <el-table-column  label="Qgr,ad">
                <template    prop="coalQgrad">
                  <span v-text="form.coalQgrad"  />
                </template>
              </el-table-column>
              <el-table-column  label="Qnt,ar">
                <template   prop="coalQntar">
                  <span v-text="form.coalQntar"  />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-title" style="margin-left: 0px;">
        <el-col :span="12" :offset="1" >
          <el-form-item label="奖惩"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span>水分：<span style="color: red" v-text="form.jc1">0.00</span></span>
            <span style="margin-left: 20px;">内水：<span style="color: red" v-text="form.jc2">0.00</span></span>
            <span style="margin-left: 20px;">灰份Aad：<span style="color: red" v-text="form.jc3">0.00</span></span>
            <span style="margin-left: 20px;">灰份ad：<span style="color: red" v-text="form.jc10">0.00</span></span>
            <span style="margin-left: 20px;">挥发份Vda：<span style="color: red" v-text="form.jc4">0.00</span></span>
            <span style="margin-left: 20px;">挥发份Vdaf：<span style="color: red" v-text="form.jc11">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span >灰熔点：<span style="color: red" v-text="form.jc5">0.00</span></span>
            <span style="margin-left: 20px;">固定碳：<span style="color: red" v-text="form.jc6">0.00</span></span>
            <span style="margin-left: 20px;">含硫量：<span style="color: red" v-text="form.jc7">0.00</span></span>
            <span style="margin-left: 20px;">热值Qgr,ad：<span style="color: red" v-text="form.jc8">0.00</span></span>
            <span style="margin-left: 20px;">热值Qnt,ar：<span style="color: red" v-text="form.jc9">0.00</span></span>
            <span style="margin-left: 20px;">热值Kcal：<span style="color: red" v-text="form.jc12">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="入库单信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px;">
        <el-col :span="20" :offset="1">
          <el-table
            ref="singleTable"
            :data="grnList"
            fit
            style="margin-bottom: 30px;">
            <el-table-column
              property="name"
              label="已选货品名称"
            >
            </el-table-column>
            <el-table-column
              property="grnNumber"
              label="入库重量（吨）">
              <template slot-scope="scope">
                    {{
                      Number(scope.row.grnNumber)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
            </el-table-column>
            <el-table-column
              property="grnRz"
              label="热值（kcal）">
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
              label="发货日期">
            </el-table-column>
            <el-table-column
              property="valuePrice"
              label="货值单价（元）">
              <template slot-scope="scope">
                  {{
                    Number(scope.row.valuePrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
            </el-table-column>
            <el-table-column
              property="valueTprice"
              label="货值总额（元）">
              <template slot-scope="scope">
                  {{
                    Number(scope.row.valueTprice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          <el-form-item label="重量差" >
            <span  style="color: red" v-text="zlc"></span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="热值差" prop="averageRz">
            <span  style="color: red" v-text="rzc"></span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="单价差" prop="averageRz">
            <span  style="color: red" v-text="$options.filters.moneyFilter(djc)"></span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="总额差" prop="averageRz">
            <span  style="color: red" v-text="$options.filters.moneyFilter(zec)"></span>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      审批流程·-->
      <approval-process :typeId="11" :stId="gryId"></approval-process>

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

import {getGry} from "@/api/project/gry";
import {getProcessDataByStId} from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //审批集合
      stateList: [{"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"没有问题，同意审批","state":"已通过"},
                  {"deptName":"风控部","roleName":"风控部经理","userName":"张三","content":"","state":"未审批"}],
      //煤炭质量集合
      zlList:[{show:true}],
      //入库集合
      grnList:[],
      // 表单参数
      form: {},
      //差值
      zlc:0,
      rzc:0,
      djc:0,
      zec:0,
      gryId:''
    };
  },
  created() {
    const gryId = this.$route.params && this.$route.params.gryId;
    this.gryId = gryId
    getGry(gryId).then(response => {
      this.form=response.data
      this.grnList = response.data.grnList;
      this.zlc=response.data.grnNumber-this.grnList[0].grnNumber;
      this.rzc=response.data.gryRz-this.grnList[0].grnRz;
      this.djc=response.data.valuePrice-this.grnList[0].valuePrice;
      this.zec=response.data.valueTprice-this.grnList[0].valueTprice;
    })
    getProcessDataByStId("11",gryId).then((res) => {
      this.stateList = res.data;
    });
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  }
};
</script>
