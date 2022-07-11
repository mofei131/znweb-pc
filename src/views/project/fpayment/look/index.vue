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
      <!--    出库信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="项目信息"></el-form-item>
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
              <td class="tdTitle">业务名称</td>
              <td class="tdCoent">{{form.stName}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
            </tr>
            <tr>
              <td class="tdTitle">业务类型</td>
              <td class="tdCoent">{{ businessTypeFormat(form.businessType) }}</td>
              <td class="tdTitle">供应商</td>
              <td class="tdCoent">{{form.supplierName}}</td>
              <td class="tdTitle">供应商账号</td>
              <td class="tdCoent">{{form.account}}</td>
            </tr>
            <tr>
              <td class="tdTitle">供应商开户行</td>
              <td class="tdCoent">{{form.openbank}}</td>
              <td class="tdTitle">电厂结算金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.jst)}}</td>
              <td class="tdTitle">结算税款(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.jstax)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">结算单价(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.price)}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>项目名称：</div><span v-text="form.projectName"></span>
          </div>
          <div style="display:flex">
            <div>业务名称：</div><span v-text="form.stName"></span>
          </div>
          <div style="display:flex">
            <div>项目编号：</div><span v-text="form.serialNo"></span>
          </div>
          <div style="display:flex">
            <div>结算方式：</div><span v-text="form.settlementWay"></span>
          </div>
          <div style="display:flex">
            <div>供应商：</div><span v-text="form.supplierName"></span>
          </div>
          <div style="display:flex">
            <div>供应商账号：</div><span v-text="form.account"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>供应商开户行：</div><span v-text="form.openbank"></span>
          </div>
        </el-col> -->
      <!--        <el-col :span="5">-->
      <!--          预付方式：<span v-text="form.payType"></span>-->
      <!--        </el-col>-->
      <!-- </el-row> -->

      <!-- <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="出库信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table ref="singleTable" :data="gryList" fit style="margin-bottom: 30px">
            <el-table-column property="name" label="货品名称">
            </el-table-column>
            <el-table-column property="grnNumber" label="出库重量（吨）">
              <template slot-scope="scope">
                {{
                Number(scope.row.grnNumber)
                .toFixed(3)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="grnRz" label="出库热值（kcal）">
            </el-table-column>
            <el-table-column property="transportType" label="运输方式">
            </el-table-column>
            <el-table-column property="wlCompany" label="物流公司">
            </el-table-column>
            <el-table-column property="carNumber" label="车数">
            </el-table-column>
            <el-table-column property="batch" label="批次"> </el-table-column>
            <el-table-column property="deliveryTime" label="到货日期">
            </el-table-column>
            <el-table-column property="valuePrice" label="货值单价（元）">
              <template slot-scope="scope">
                {{
                Number(scope.row.valuePrice)
                .toFixed(2)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="valueTprice" label="货值总额（元）">
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
          <el-form-item label="合计重量：">
            <span style="color: red">{{ $options.filters.moneyFilter(form.tweight) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="平均热值：">
            <span style="color: red">{{ form.prz }}</span>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="扣除费用明细"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">运费(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.ttPrice)}}</td>
              <td class="tdTitle">保证金(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.bzPrice)}}</td>
              <td class="tdTitle">固定差价总额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.gdxPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">服务费(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.servicePrice)}}</td>
              <td class="tdTitle">承兑贴息(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.cdtx)}}</td>
              <td class="tdTitle">补税金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.bsPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">其他扣费(元)</td>
              <td class="tdCoent">{{ $options.filters.moneyFilter(form.otherPrice)}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="增加费用明细"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">贴息(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.tx)}}</td>
              <td class="tdTitle">其他费用(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.qt)}}</td>
              <td class="tdTitle">最终应付款金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.yftotalPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">最终应付款税额(元)</td>
              <td class="tdCoent">{{ $options.filters.moneyFilter(form.yftotalPriceatx)}}</td>
              <td class="tdTitle">提单金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.yfPrice)}}</td>
              <td class="tdTitle">调整金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.je)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">最终实际付款(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.sjPrice)}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>电厂结算金额(元)：</div><span v-text="$options.filters.moneyFilter(form.jst)"></span>
          </div>
          <div style="display:flex">
            <div>税款：</div><span v-text="$options.filters.moneyFilter(form.jstax)"></span>
          </div>
          <div style="display:flex">
            <div>货品单价(元)：</div><span v-text="$options.filters.moneyFilter(form.price)"></span>
          </div>
          <div style="display:flex">
            <div>运费(元)：</div><span v-text="$options.filters.moneyFilter(form.ttPrice)"></span>
          </div>
          <div style="display:flex">
            <div>保证金(元)：</div><span v-text="$options.filters.moneyFilter(form.bzPrice)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>固定差价总额(元)：</div><span v-text="$options.filters.moneyFilter(form.gdxPrice)"></span>
          </div>
          <div style="display:flex">
            <div>服务费：</div><span v-text="$options.filters.moneyFilter(form.servicePrice)"></span>
          </div>
          <div style="display:flex">
            <div>承兑贴息：</div><span v-text="$options.filters.moneyFilter(form.cdtx)"></span>
          </div>
          <div style="display:flex">
            <div>补税金额：</div><span v-text="$options.filters.moneyFilter(form.bsPrice)"></span>
          </div>
          <div style="display:flex">
            <div>其他扣款：</div><span v-text="$options.filters.moneyFilter(form.otherPrice)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>贴息：</div><span v-text="$options.filters.moneyFilter(form.tx)"></span>
          </div>
          <div style="display:flex">
            <div>其他费用：</div><span v-text="$options.filters.moneyFilter(form.qt)"></span>
          </div>
          <div style="display:flex">
            <div>最终应付款金额：</div><span v-text="$options.filters.moneyFilter(form.yftotalPrice)"></span>
          </div>
          <div style="display:flex">
            <div>已付金额：</div><span v-text="$options.filters.moneyFilter(form.yfPrice)"></span>
          </div>
          <div style="display:flex">
            <div>调整金额：</div><span v-text="$options.filters.moneyFilter(form.je)"></span>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div style="display:flex">
            <div>最终实际付款(元)：</div><span v-text="$options.filters.moneyFilter(form.sjPrice)"></span>
          </div>
        </el-col>
      </el-row> -->

      <!--      合同信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table ref="singleTable" :data="contract" style="width: 80%; margin-bottom: 30px">
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

      <el-row class="head-text">
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
      <approval-process :typeId="5" :stId="fpaymentId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="5" :stId="fpaymentId"></approval-record>
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
import { getGry } from "@/api/project/gry";
import { getToken } from "@/utils/auth";
import { getFpayment } from "@/api/project/fpayment";
import { getProcessDataByStId } from "@/api/approve";
import { getContractList } from "@/api/project/all";

export default {
  name: "contractLook",
  data() {
    return {
      //入库集合
      gryList: [],
      // 表单参数
      form: {},
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],
      //
      queryParams: {
        fpaymentId: null,
      },
      //合同集合
      contract: [],
      fpaymentId: "",
    };
  },
  created() {
    const fpaymentId = this.$route.params && this.$route.params.fpaymentId;
    this.fpaymentId = fpaymentId;
    this.queryParams.fpaymentId=fpaymentId;
    getFpayment(fpaymentId).then((response) => {
      this.form = response.data;
      this.fileList = this.form.fileList;
      this.gryList = response.data.selnyList;

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
    businessTypeFormat(businessType) {
      if (businessType == "cud") {
        return "储备业务垫付运费";
      } else if (businessType == "cu") {
        return "储备业务不垫付运费";
      } else if (businessType == "dcd") {
        return "到厂业务垫付运费";
      } else if (businessType == "dc") {
        return "到厂业务不垫付运费";
      } else if (businessType == "cbd") {
        return "车板业务垫付运费";
      } else if (businessType == "cb") {
        return "车板业务不垫付运费";
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "project/fpayment/export",
        {
          ...this.queryParams,
        },
        `最终结算单.xlsx`
      );
    },
  },
};
</script>
