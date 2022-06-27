<style scoped>
.newTable td{
  min-width: 110px;
}
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
  text-align: center;
}
.head-text1 {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 53px;
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
.newproColor{
  color: red;
  width: 80px;
  min-width: 80px;
}
.dtdTitle{
  width: 80px;
  min-width: 80px;
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
          <span style="color: #ff0000">{{ stateF(form.state) }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{form.projectName}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
              <td class="tdTitle">付款批次</td>
              <td class="tdCoent">{{form.away}}</td>
            </tr>
            <tr>
              <td class="tdTitle">预付方式</td>
              <td class="tdCoent">{{form.type}}</td>
              <td class="tdTitle">结算方式</td>
              <td class="tdCoent">{{form.settlementWay}}</td>
              <td class="tdTitle">供应商</td>
              <td class="tdCoent">{{form.supplierName}}</td>
            </tr>
            <tr>
              <td class="tdTitle">供应商账号</td>
              <td class="tdCoent">{{form.account}}</td>
              <td class="tdTitle">供应商开户行</td>
              <td class="tdCoent">{{form.openbank}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="8" :offset="1">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr class="newTable">
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{form.projectName}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
              <td class="tdTitle">付款批次</td>
              <td class="tdCoent">{{form.away}}</td>
              <td class="tdTitle">预付方式</td>
              <td class="tdCoent">{{form.type}}</td>
              <td class="tdTitle">结算方式</td>
              <td class="tdCoent">{{form.settlementWay}}</td>
            </tr>
            <tr class="newTable">
              <td class="tdTitle">供应商</td>
              <td class="tdCoent">{{form.supplierName}}</td>
              <td class="tdTitle">供应商账号</td>
              <td class="tdCoent">{{form.account}}</td>
              <td class="tdTitle">供应商开户行</td>
              <td class="tdCoent">{{form.openbank}}</td>
            </tr>
          </table>
        </el-col>
      </el-row> -->

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="出入库信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table ref="singleTable" :data="dataList" fit style="margin-bottom: 30px;width:90%;" >
            <el-table-column property="name" label="货品名称" width="90">
            </el-table-column>
            <el-table-column v-if="form.away == '首次'" property="grnNumber" label="入库重量（吨）" width="120">
              <template slot-scope="scope">
                {{
                Number(scope.row.grnNumber)
                .toFixed(3)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column v-if="form.away == '二次'" property="grnNumber" label="出库重量（吨）" width="120">
              <template slot-scope="scope">
                {{
                Number(scope.row.grnNumber)
                .toFixed(3)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column v-if="form.away == '首次'" property="grnRz" label="入库热值（kcal）" width="120">
            </el-table-column>
            <el-table-column v-if="form.away == '二次'" property="gryRz" label="出库热值（kcal）" width="120">
            </el-table-column>
            <el-table-column property="transportType" label="运输方式" width="90">
            </el-table-column>
            <el-table-column property="wlCompany" label="物流公司" width="120">
            </el-table-column>
            <el-table-column property="carNumber" label="车数" width="90">
            </el-table-column>
            <el-table-column property="batch" label="批次" width="90">
            </el-table-column>
            <el-table-column v-if="form.away == '首次'" property="deliveryTime" label="发货日期" width="120">
            </el-table-column>
            <el-table-column v-if="form.away == '二次'" property="deliveryTime" label="到货日期" width="120">
            </el-table-column>
            <el-table-column property="valuePrice" label="货值单价（元）" width="90">
              <template slot-scope="scope">
                {{
                Number(scope.row.valuePrice)
                .toFixed(2)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="valueTprice" label="货值总额（元）" width="90">
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
      <el-row class="head-text1">
        <el-col :span="4" :offset="1">
          <el-form-item label="合计重量：">
            <span style="color: red">{{ $options.filters.weightFilter(form.totalWeight) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="平均热值：">
            <span style="color: red">{{ form.averageRz }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="head-title" style="margin-left: 0px">
        <el-col :span="12" :offset="1">
          <el-form-item label="奖惩"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle dtdTitle">水分</td>
              <td class="tdCoent newproColor">{{form.jc1}}</td>
              <td class="tdTitle dtdTitle">内水</td>
              <td class="tdCoent newproColor">{{form.jc2}}</td>
              <td class="tdTitle dtdTitle">灰份Aad</td>
              <td class="tdCoent newproColor">{{form.jc3}}</td>
              <td class="tdTitle dtdTitle">灰份ad</td>
              <td class="tdCoent newproColor">{{form.jc10}}</td>
              <td class="tdTitle dtdTitle">挥发份Vda</td>
              <td class="tdCoent newproColor">{{form.jc4}}</td>
              <td class="tdTitle dtdTitle">挥发份Vdaf</td>
              <td class="tdCoent newproColor">{{form.jc11}}</td>
            </tr>
            <tr>
              <td class="tdTitle dtdTitle">灰熔点</td>
              <td class="tdCoent newproColor">{{form.jc5}}</td>
              <td class="tdTitle dtdTitle">固定碳</td>
              <td class="tdCoent newproColor">{{form.jc6}}</td>
              <td class="tdTitle dtdTitle">含硫量</td>
              <td class="tdCoent newproColor">{{form.jc7}}</td>
              <td class="tdTitle dtdTitle">热值Qgr,ad</td>
              <td class="tdCoent newproColor">{{form.jc8}}</td>
              <td class="tdTitle dtdTitle">热值Qnt,ar</td>
              <td class="tdCoent newproColor">{{form.jc9}}</td>
              <td class="tdTitle dtdTitle">热值Kcal</td>
              <td class="tdCoent newproColor">{{form.jc12}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text1">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span>水分：<span style="color: red" v-text="form.jc1">0.00</span></span>
            <span style="margin-left: 20px">内水：<span style="color: red" v-text="form.jc2">0.00</span></span>
            <span style="margin-left: 20px">灰份Aad：<span style="color: red" v-text="form.jc3">0.00</span></span>
            <span style="margin-left: 20px">灰份ad：<span style="color: red" v-text="form.jc10">0.00</span></span>
            <span style="margin-left: 20px">挥发份Vda：<span style="color: red" v-text="form.jc4">0.00</span></span>
            <span style="margin-left: 20px">挥发份Vdaf：<span style="color: red" v-text="form.jc11">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text1">
        <el-col :span="20" :offset="1">
          <el-form-item label="">
            <span>灰熔点：<span style="color: red" v-text="form.jc5">0.00</span></span>
            <span style="margin-left: 20px">固定碳：<span style="color: red" v-text="form.jc6">0.00</span></span>
            <span style="margin-left: 20px">含硫量：<span style="color: red" v-text="form.jc7">0.00</span></span>
            <span style="margin-left: 20px">热值Qgr,ad：<span style="color: red" v-text="form.jc8">0.00</span></span>
            <span style="margin-left: 20px">热值Qnt,ar：<span style="color: red" v-text="form.jc9">0.00</span></span>
            <span style="margin-left: 20px">热值Kcal：<span style="color: red" v-text="form.jc12">0.00</span></span>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row class="head-text" style="margin-top: 30px">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">预付总额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.totalPrice)}}</td>
              <td class="tdTitle">固定差价</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.dPrice)}}</td>
              <td class="tdTitle">预付至</td>
              <td class="tdCoent">{{form.ato}}</td>
            </tr>
            <tr>
              <td class="tdTitle">税款(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.tax)}}</td>
              <td class="tdTitle">预付单价(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.expectPrice)}}</td>
              <td class="tdTitle">扣款金额</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.kkPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">扣款备注</td>
              <td class="tdCoent">{{form.kkNode}}</td>
              <td class="tdTitle">运费金额</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.yfPrice)}}</td>
              <td class="tdTitle">付款总额</td>
              <td class="tdCoent newproColor">{{$options.filters.moneyFilter(form.payTprice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">已付金额</td>
              <td class="tdCoent newproColor">{{$options.filters.moneyFilter(form.prepaidPrice)}}</td>
              <td class="tdTitle">垫付保证金</td>
              <td class="tdCoent newproColor">{{$options.filters.moneyFilter(form.dfPrice)}}</td>
              <td class="tdTitle">实际付款金额</td>
              <td class="tdCoent newproColor">{{$options.filters.moneyFilter(form.actualPrice)}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text1" style="margin-top: 30px">
        <el-col :span="4" :offset="1">
          预付总额(元)：<span v-text="$options.filters.moneyFilter(form.totalPrice)"></span>
        </el-col>
        <el-col :span="4">
          固定差价：<span v-text="$options.filters.moneyFilter(form.dPrice)"></span>
        </el-col>
        <el-col :span="4"> 预付至：<span v-text="form.ato"></span> </el-col>
        <el-col :span="4"> 税款(元)：<span v-text="$options.filters.moneyFilter(form.tax)"></span> </el-col>
        <el-col :span="4">
          预付单价(元)：<span v-text="$options.filters.moneyFilter(form.expectPrice)"></span>
        </el-col>
      </el-row> -->

      <!--      <el-row class="head-text">-->
      <!--        <el-col :span="4" :offset="1">-->
      <!--          付款日期：<span>{{ parseTime(form.payTime, '{y}-{m}-{d}') }}</span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="4">-->
      <!--          成本年服务费率(%)：<span v-text="form.rateYear"></span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="4">-->
      <!--          保底服务费期限(天)：<span v-text="form.mfsp"></span>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!-- <el-row class="head-text1">
        <el-col :span="4" :offset="1">
          扣款金额：<span v-text="$options.filters.moneyFilter(form.kkPrice)"></span>
        </el-col>
        <el-col :span="4">
          扣款备注：<span v-text="form.kkNode"></span>
        </el-col>
        <el-col :span="4">
          运费金额：<span v-text="$options.filters.moneyFilter(form.yfPrice)"></span>
        </el-col>
      </el-row>

      <el-row class="head-text1">
        <el-col :span="4" :offset="1">
          <el-form-item label="付款总额：">
            <span style="color: red">{{ $options.filters.moneyFilter(form.payTprice) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="已付金额：">
            <span style="color: red">{{ $options.filters.moneyFilter(form.prepaidPrice) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="垫付保证金：">
            <span style="color: red">{{ $options.filters.moneyFilter(form.dfPrice) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="实际付款金额：">
            <span style="color: red">{{ $options.filters.moneyFilter(form.actualPrice) }}</span>
          </el-form-item>
        </el-col>
      </el-row> -->

      <!--      合同信息-->
      <el-row class="head-title1">
        <el-col :span="12">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text1">
        <el-col :offset="1">
          <el-table ref="singleTable" :data="contract" style="width: 90%; margin-bottom: 30px">
            <el-table-column property="name" label="合同名称">
            </el-table-column>
            <el-table-column property="type" label="合同类型" :formatter="contractTypeFormat">
            </el-table-column>
            <el-table-column property="expectNumber" label="货品重量(吨)">
              <template slot-scope="scope">
                {{
                Number(scope.row.expectNumber)
                .toFixed(3)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="" label="合同附件"> </el-table-column>
            <el-table-column property="" label="补充合同附件">
            </el-table-column>
            <el-table-column property="" label="双章合同附件">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="toContract(scope.row.contractId)" type="text" size="small">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row class="head-text1">
        <el-col :span="12" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file">
            <!-- <el-upload
              disabled
              :action="url"
              :headers="headers"
              class="upload-hidden"
              :on-preview="handlePreview"
              list-type="text"
              :file-list="fileList">
            </el-upload> -->
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      审批流程·-->
      <approval-process :typeId="4" :stId="apyamentId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="4" :stId="apyamentId"></approval-record>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right; margin-bottom: 50px; margin-right: 50px">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
          <el-button size="small" type="primary" @click="handleExport">导 出</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getContract } from "@/api/project/contract";
import { getToken } from "@/utils/auth";
import { getApayment } from "@/api/project/apayment";
import { getProcessDataByStId } from "@/api/approve";
import { getContractList } from "@/api/project/all";

export default {
  name: "contractLook",
  data() {
    return {
      //出入库集合
      dataList: [],

      queryParams: {
        apaymentId: null,
      },

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],

      //合同集合
      contract: [],

      // 表单参数
      form: {},
      apyamentId: "",
    };
  },
  created() {
    const apyamentId = this.$route.params && this.$route.params.apyamentId;
    this.apyamentId = apyamentId;
    this.queryParams.apyamentId=apyamentId;
    getApayment(apyamentId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
      this.dataList = response.data.selnyList;

      let data = { stId: this.form.stId };
      //合同
      getContractList(data).then((response) => {
        this.contract = response.rows;
      });
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

    //跳转合同详情
    toContract(contractId) {
      this.$router.push("/contract/look/" + contractId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if (row.type == "1") {
        return "上游合同";
      } else if (row.type == "2") {
        return "下游合同";
      } else if (row.type == "3") {
        return "物流运输合同";
      } else if (row.type == "4") {
        return "物流服务合同";
      } else if (row.type == "5") {
        return "其他合同";
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "project/apayment/export",
        {
          ...this.queryParams,
        },
        `预结算单.xlsx`
      );
    },
  },
};
</script>
