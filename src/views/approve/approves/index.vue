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
          <el-form-item label="发起人：">{{
            queryParams.nickName
          }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form
      :model="queryParams"
      ref="ruleForm"
      :inline="true"
      label-width="0px"
    >
      <div v-if="initData.processType == '1'">
        <el-form label-width="20px;" label-position="left">
          <!--    基础信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="基本信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
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
              立项编号：<span v-text="form.productNo"></span>
            </el-col>
            <el-col :span="4">
              项目金额(万元)：<span v-text="form.amount"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              代办人：<span v-text="form.userName"></span>
            </el-col>
            <el-col :span="4">
              供应商：<span v-text="form.supplierName"></span>
            </el-col>
            <el-col :span="4">
              结算比例：<span v-text="form.settlementP"></span>
            </el-col>
            <el-col :span="4">
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
            <el-col :span="4"> 性质：<span v-text="form.shXz"></span> </el-col>
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
            <el-col :span="4"> 性质：<span v-text="form.tXz"></span> </el-col>
            <el-col :span="4">
              立户情况：<span v-text="form.tAccount"></span>
            </el-col>
            <el-col :span="4">
              合作年限：<span v-text="form.tCyear"></span>
            </el-col>
            <el-col :span="4">
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
              备注说明：
              <el-input
                type="textarea"
                disabled
                :rows="5"
                v-model="form.node"
                placeholder="请输入备注说明"
              />
            </el-col>
          </el-row>

          <el-row class="head-text" style="margin-bottom: 50px">
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
        </el-form>
      </div>
      <div v-if="initData.processType == '2'">
        <el-form label-width="20px;" label-position="left">
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="说明"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="10" :offset="1">
              备注说明：
              <el-input
                disabled
                type="textarea"
                :rows="5"
                v-model="xmNode"
                placeholder=""
              />
            </el-col>
          </el-row>

          <el-row class="head-text" style="margin-bottom: 50px">
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
            <el-col :span="4" :offset="1">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              项目名称：<span v-text="form.name"></span>
            </el-col>
            <el-col :span="4">
              供应商：<span v-text="form.supplierName"></span>
            </el-col>
            <el-col :span="4">
              用煤单位：<span v-text="form.tName"></span>
            </el-col>
            <el-col :span="4">
              立项日期：<span>{{
                parseTime(form.createTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              代办人：<span v-text="form.userName"></span>
            </el-col>
            <el-col :span="4">
              服务周期：<span v-text="form.cycleStart"></span>
            </el-col>
            <el-col :span="4">
              服务费收取模式：<span v-text="form.chargemType"></span>
            </el-col>
            <el-col :span="4">
              服务费率(%)：<span v-text="form.chargemNx"></span>
            </el-col>
            <el-col :span="4">
              固定差价(元)：<span v-text="form.chargemGd"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              预计吨数：<span v-text="form.expectWeight"></span>
            </el-col>
            <el-col :span="4">
              预计单价(元)：<span v-text="form.expectPrice"></span>
            </el-col>
            <el-col :span="4">
              成本年服务费率(%)：<span v-text="form.rateYear"></span>
            </el-col>
            <el-col :span="4">
              预计利润(元)：<span v-text="form.expectProfits"></span>
            </el-col>
          </el-row>
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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      入库信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="入库信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="grnList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="grnNumber" label="入库重量(吨)">
                </el-table-column>
                <el-table-column property="grnRz" label="入库热值(Kcal)">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司">
                </el-table-column>
                <el-table-column property="carNumber" label="车数">
                </el-table-column>
                <el-table-column property="batch" label="批次">
                </el-table-column>
                <el-table-column property="deliveryTime" label="发货日期">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价(元)">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额(元)">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toGrn(scope.row.grnId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      出库信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="出库信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="gryList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="grnNumber" label="出库重量(吨)">
                </el-table-column>
                <el-table-column property="gryRz" label="入库热值(Kcal)">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司">
                </el-table-column>
                <el-table-column property="carNumber" label="车数">
                </el-table-column>
                <el-table-column property="batch" label="批次">
                </el-table-column>
                <el-table-column property="okTime" label="发货日期">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价(元)">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额(元)">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toGry(scope.row.gryId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                    <el-button
                      @click.native.prevent="toGryAou(scope.row.gryId)"
                      type="text"
                      size="small"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      预付款信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="预付款信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="apaymentList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="grns" label="发货总量(吨)">
                </el-table-column>
                <el-table-column property="grys" label="验收总量(吨)">
                </el-table-column>
                <el-table-column property="totalPrice" label="预付总额(元)">
                                <template slot-scope="scope">
                  {{scope.row.totalPrice }}
                </template>
                </el-table-column>
                <el-table-column property="expectPrice" label="预付单价(元)">
                                <template slot-scope="scope">
                  {{scope.row.expectPrice }}
                </template>
                </el-table-column>
                <el-table-column property="ato" label="预付至">
                </el-table-column>
                <el-table-column property="actualPrice" label="实际付款(元)">
                                <template slot-scope="scope">
                  {{scope.row.actualPrice }}
                </template>
                </el-table-column>
                <el-table-column property="state" label="95%收票">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toApayment(scope.row.apyamentId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      收款信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="收款信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="skList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="skType" label="收款类型">
                </el-table-column>
                <el-table-column property="tweight" label="验收重量(吨)">
                </el-table-column>
                <el-table-column property="skPrice" label="单价(元)">
                  <template slot-scope="scope">
                  {{scope.row.skPrice }}
                </template>
                </el-table-column>
                <el-table-column property="skTprice" label="收款金额">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toSk(scope.row.skId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      物流付款信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="物流付款信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="lpaymentList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column label="物流类型"> 物流付款 </el-table-column>
                <el-table-column property="tntPrice" label="实付金额">
                </el-table-column>
                <!-- <el-table-column property="serType" label="是否产生服务费">
                </el-table-column>
                <el-table-column property="putTime" label="付款时间">
                  <template slot-scope="scope">
                    <span>{{
                      parseTime(scope.row.putTime, "{y}-{m}-{d}")
                    }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column
              property="tpcName"
              label="第三方公司">
            </el-table-column>
            <el-table-column
              property="account"
              label="公司账户">
            </el-table-column>
            <el-table-column
              property="openbank"
              label="公司开户行">
            </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toLpayment(scope.row.lpaymentId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      最终付款信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="最终付款信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="fpaymentList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="stName" label="项目名称">
                </el-table-column>
                <el-table-column property="tweight" label="验收重量（吨）">
                </el-table-column>
                <el-table-column property="price" label="终付单价(元)">
                                <template slot-scope="scope">
                  {{scope.row.price }}
                </template>
                </el-table-column>
                <el-table-column property="zzPrice" label="电厂结算金额(元)">
                  <template slot-scope="scope">
                  {{scope.row.zzPrice }}
                </template>
                </el-table-column>
                <el-table-column property="yfPrice" label="已付款总额(元)">
                  <template slot-scope="scope">
                  {{scope.row.yfPrice }}
                </template>
                </el-table-column>
                <el-table-column property="sjPrice" label="最终实际付款(元)">
                  <template slot-scope="scope">
                  {{scope.row.sjPrice }}
                </template>
                </el-table-column>
                <el-table-column
                  property="moType"
                  label="收票状态"
                  :formatter="moFormat"
                >
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toFpayment(scope.row.fpaymentId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      发票信息-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="发票信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="kpList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column label="开票类型">
                  <span>开票</span>
                </el-table-column>
                <el-table-column property="kpPrice" label="开票金额(元)">
                  <template slot-scope="scope">
                  {{scope.row.kpPrice }}
                </template>
                </el-table-column>
                <el-table-column property="zzWeight" label="货品总重(吨)">
                </el-table-column>
                <el-table-column property="kpTax" label="发票税额(元)">
                  <template slot-scope="scope">
                  {{scope.row.kpTax }}
                </template>
                </el-table-column>
                <el-table-column property="kpTotal" label="价税合计(元)">
                  <template slot-scope="scope">
                  {{scope.row.kpTotal }}
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toKp(scope.row.kpId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="sticketList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column label="开票类型">
                  <span>收票</span>
                </el-table-column>
                <el-table-column property="price" label="开票金额(元)">
                  <template slot-scope="scope">
                  {{scope.row.price }}
                </template>
                </el-table-column>
                <el-table-column property="number" label="货品总重(吨)">
                </el-table-column>
                <el-table-column property="tax" label="发票税额(元)">
                  <template slot-scope="scope">
                  {{scope.row.tax }}
                </template>
                </el-table-column>
                <el-table-column property="totalPrice" label="价税合计(元)">
                  <template slot-scope="scope">
                  {{scope.row.totalPrice }}
                </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toSticket(scope.row.sticketId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      服务费明细-->
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="服务费明细"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table
                ref="singleTable"
                :data="spList"
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="type" label="费用类型">
                </el-table-column>
                <el-table-column property="putTime" label="付款日期">
                  <template slot-scope="scope">
                    <span>{{
                      parseTime(scope.row.putTime, "{y}-{m}-{d}")
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="putPrice" label="付款金额(元)">
                  <template slot-scope="scope">
                  {{scope.row.putPrice }}
                </template>
                </el-table-column>
                <el-table-column property="outTime" label="回款日期">
                  <template slot-scope="scope">
                    <span>{{
                      parseTime(scope.row.outTime, "{y}-{m}-{d}")
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="spTime" label="资金占用时间(天)">
                </el-table-column>
                <el-table-column property="spPrice" label="代理费(元)">
                  <template slot-scope="scope">
                  {{scope.row.spPrice }}
                </template>
                </el-table-column>
                <el-table-column property="sjPrice" label="成本费用(元)">
                  <template slot-scope="scope">
                  {{scope.row.sjPrice }}
                </template>
                </el-table-column>
                <el-table-column property="lrPrice" label="资金占用利润(元)">
                  <template slot-scope="scope">
                  {{scope.row.lrPrice }}
                </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <!--      固定差价明细-->
          <div v-if="form.chargemType == '2' || form.chargemType == '3'">
            <el-row class="head-title">
              <el-col :span="12">
                <el-form-item label="固定差价明细"></el-form-item>
              </el-col>
            </el-row>
            <el-row class="head-text">
              <el-col :offset="1">
                <el-table
                  :data="gdList"
                  fit
                  style="width: 80%; margin-bottom: 30px"
                >
                  <el-table-column label="出库重量">
                    <template slot-scope="scope">
                      <span v-text="gryNumber"></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="固定差价">
                    <template slot-scope="scope">
                      <span v-text="form.chargemGd"></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="差价利润">
                    <template slot-scope="scope">
                      <span v-text="gryLr"></span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div v-if="initData.processType == '3'">
        <el-form label-width="20px;" label-position="left">
          <!--    合同信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="合同信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.projectNumber"></span>
            </el-col>
            <el-col :span="4">
              合同名称：<span v-text="form.name"></span>
            </el-col>
            <el-col :span="4">
              合同类型：<span v-text="form.type"></span>
            </el-col>
            <el-col :span="4">
              合同编号：<span v-text="form.number"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              立项编号：<span v-text="form.productNo"></span>
            </el-col>
            <el-col :span="4">
              签约日期：<span>{{
                parseTime(form.signingTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
            <el-col :span="4" :offset="1" v-if="form.type == '上游合同'">
              供应商：<span v-text="form.supplierName"></span>
            </el-col>
            <el-col :span="4" :offset="1" v-if="form.type == '下游合同'">
              终端客户：<span v-text="form.terminalName"></span>
            </el-col>
            <el-col :span="4" :offset="1" v-if="form.type == '其他合同'">
              客户名称：<span v-text="form.khName"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              货品名称：<span v-text="form.goodsName"></span>
            </el-col>
            <el-col :span="4" v-if="form.type == '下游合同'">
              预计吨数：<span v-text="form.expectNumber"></span>
            </el-col>
            <el-col :span="4" v-if="form.type == '下游合同'">
              基准单价：<span v-text="form.price"></span>
            </el-col>
            <el-col :span="4" v-if="form.type == '上游合同'">
              保底服务费期限：<span v-text="form.mfsp"></span>
            </el-col>
          </el-row>

          <el-row class="head-text" v-if="form.type == '上游合同'">
            <el-col :span="4" :offset="1">
              超时服务费期限：<span v-text="form.csmfsp"></span>
            </el-col>
            <el-col :span="4">
              超时服务费费率：<span v-text="form.csrate"></span>
            </el-col>
            <el-col :span="4">
              违约服务费期限：<span v-text="form.vymfsp"></span>
            </el-col>
            <el-col :span="4">
              违约服务费费率：<span v-text="form.vyrate"></span>
            </el-col>
          </el-row>

          <el-row
            class="head-text"
            v-if="form.type == '物流运输合同' || form.type == '物流服务合同'"
          >
            <el-col :span="4" :offset="1">
              运输单位：<span v-text="form.goodsName"></span>
            </el-col>
            <el-col :span="4">
              运输方式：<span v-text="form.expectNumber"></span>
            </el-col>
            <el-col :span="4">
              起运地：<span v-text="form.price"></span>
            </el-col>
            <el-col :span="4">
              目的地：<span v-text="form.mfsp"></span>
            </el-col>
          </el-row>
          <el-row
            class="head-text"
            v-if="form.type == '物流运输合同' || form.type == '物流服务合同'"
          >
            <el-col :span="4" :offset="1">
              运费单价(吨/元)：<span v-text="form.goodsName"></span>
            </el-col>
            <el-col :span="4">
              损耗率：<span v-text="form.expectNumber"></span>
            </el-col>
          </el-row>

          <el-row class="head-text" v-if="form.type == '其他合同'">
            <el-col :span="4" :offset="1">
              备注：<el-input
                disabled
                type="textarea"
                :rows="5"
                v-model="form.node"
                placeholder=""
              />
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="20" :offset="1">
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

          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="补充合同"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="6" :offset="1">
              补充说明：<span v-text="form.content"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="6" :offset="1">
              <el-form-item label="附件：" prop="file">
                <!-- <el-upload
                  disabled
                  :action="url"
                  :headers="headers"
                  class="upload-hidden "
                  :on-preview="handlePreview"
                  list-type="text"
                  :file-list="bcfileList">
                </el-upload> -->
                <custom-upload :fileList="bcfileList"></custom-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!--      <el-row class="head-text">-->
          <!--        <el-col :span="12">-->
          <!--          <el-form-item label="附件" prop="file">-->
          <!--            <el-upload-->
          <!--              class="upload-demo"-->
          <!--              :action="url"-->
          <!--              :headers="headers"-->
          <!--              multiple-->
          <!--              :limit="5"-->
          <!--              :file-list="fileList">-->
          <!--              <el-button size="small" type="primary" v-if="isLook!=3">点击上传</el-button>-->
          <!--              &lt;!&ndash;                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
          <!--            </el-upload>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->
          <!--      </el-row>-->
        </el-form>
      </div>
      <div v-if="initData.processType == '4'">
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
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              结算方式：<span v-text="form.settlementWay"></span>
            </el-col>
            <el-col :span="4">
              付款批次：<span v-text="form.away"></span>
            </el-col>
            <el-col :span="4">
              预付方式：<span v-text="form.type"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              供应商：<span v-text="form.supplierName"></span>
            </el-col>
            <el-col :span="4">
              供应商账号：<span v-text="form.account"></span>
            </el-col>
            <el-col :span="4">
              供应商开户行：<span v-text="form.openbank"></span>
            </el-col>
          </el-row>
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="出入库信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1">
              <el-table
                ref="singleTable"
                :data="dataList"
                fit
                style="margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称" width="90">
                </el-table-column>
                <el-table-column
                  v-if="form.away == '首次'"
                  property="grnNumber"
                  label="入库重量（吨）"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  v-if="form.away == '二次'"
                  property="grnNumber"
                  label="出库重量（吨）"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  v-if="form.away == '首次'"
                  property="grnRz"
                  label="入库热值（kcal）"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  v-if="form.away == '二次'"
                  property="gryRz"
                  label="出库热值（kcal）"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  property="transportType"
                  label="运输方式"
                  width="90"
                >
                </el-table-column>
                <el-table-column
                  property="wlCompany"
                  label="物流公司"
                  width="120"
                >
                </el-table-column>
                <el-table-column property="carNumber" label="车数" width="90">
                </el-table-column>
                <el-table-column property="batch" label="批次" width="90">
                </el-table-column>
                <el-table-column
                  v-if="form.away == '首次'"
                  property="deliveryTime"
                  label="发货日期"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  v-if="form.away == '二次'"
                  property="deliveryTime"
                  label="到货日期"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  property="valuePrice"
                  label="货值单价（元）"
                  width="90"
                >
                              <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column
                  property="valueTprice"
                  label="货值总额（吨）"
                  width="90"
                >
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              <el-form-item label="合计重量：">
                <span style="color: red; line-height: 57px !important">{{
                  form.totalWeight
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="平均热值：">
                <span style="color: red; line-height: 57px !important">{{
                  form.averageRz
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-title" style="margin-left: 0px">
            <el-col :span="12" :offset="1">
              <el-form-item label="奖惩"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >水分：<span style="color: red" v-text="form.jc1"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >内水：<span style="color: red" v-text="form.jc2"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份Aad：<span style="color: red" v-text="form.jc3"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份ad：<span style="color: red" v-text="form.jc10"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vda：<span style="color: red" v-text="form.jc4"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vdaf：<span style="color: red" v-text="form.jc11"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >灰熔点：<span style="color: red" v-text="form.jc5"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >固定碳：<span style="color: red" v-text="form.jc6"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >含硫量：<span style="color: red" v-text="form.jc7"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qgr,ad：<span style="color: red" v-text="form.jc8"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qnt,ar：<span style="color: red" v-text="form.jc9"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Kcal：<span style="color: red" v-text="form.jc12"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-text" style="margin-top: 30px">
            <el-col :span="4" :offset="1">
              预付总额(元)：<span v-text="form.totalPrice"></span>
            </el-col>
            <el-col :span="4">
              固定差价：<span v-text="form.dPrice"></span>
            </el-col>
            <el-col :span="4"> 预付至：<span v-text="form.ato"></span> </el-col>
            <el-col :span="4">
              税款(元)：<span v-text="form.tax"></span>
            </el-col>
            <el-col :span="4">
              预付单价(元)：<span v-text="form.expectPrice"></span>
            </el-col>
          </el-row>

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
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              扣款金额：<span v-text="form.kkPrice"></span>
            </el-col>
            <el-col :span="4">
              扣款备注：<span v-text="form.kkNode"></span>
            </el-col>
            <el-col :span="4">
              运费金额：<span v-text="form.yfPrice"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              <el-form-item label="付款总额：">
                <span style="color: red">{{ form.payTprice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="已付金额：">
                <span style="color: red">{{ form.prepaidPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="垫付保证金：">
                <span style="color: red">{{ form.dfPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="实际付款金额：">
                <span style="color: red">{{ form.actualPrice }}</span>
              </el-form-item>
            </el-col>
          </el-row>

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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
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
        </el-form>
      </div>
      <div v-if="initData.processType == '5'">
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
            <el-col :span="5" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              结算方式：<span v-text="form.settlementWay"></span>
            </el-col>
            <el-col :span="5">
              预付方式：<span v-text="form.payType"></span>
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
                style="margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="grnNumber" label="出库重量（吨）">
                </el-table-column>
                <el-table-column property="grnRz" label="出库热值（kcal）">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司">
                </el-table-column>
                <el-table-column property="carNumber" label="车数">
                </el-table-column>
                <el-table-column property="batch" label="批次">
                </el-table-column>
                <el-table-column property="deliveryTime" label="到货日期">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价（元）">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额（吨）">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              <el-form-item label="合计重量：">
                <span style="color: red">{{ form.tweight }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="平均热值：">
                <span style="color: red">{{ form.prz }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="基础信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              电厂结算金额(元)：<span v-text="form.zzPrice"></span>
            </el-col>
            <el-col :span="5"> 税款：<span v-text="form.tax"></span> </el-col>
            <el-col :span="5">
              货品单价(元)：<span v-text="form.price"></span>
            </el-col>
            <el-col :span="5">
              付款日期：<span>{{
                parseTime(form.payTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              运费(元)：<span v-text="form.ttPrice"></span>
            </el-col>
            <el-col :span="5">
              保证金(元)：<span v-text="form.bzPrice"></span>
            </el-col>
            <el-col :span="5">
              固定差价总额(元)：<span v-text="form.gdxPrice"></span>
            </el-col>
            <el-col :span="5">
              服务费：<span v-text="form.servicePrice"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              承兑贴息：<span v-text="form.cdtx"></span>
            </el-col>
            <el-col :span="5">
              补税金额：<span v-text="form.bsPrice"></span>
            </el-col>
            <el-col :span="5">
              其他扣款：<span v-text="form.otherPrice"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              贴息：<span v-text="form.tx"></span>
            </el-col>
            <el-col :span="5"> 其他：<span v-text="form.qt"></span> </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              最终应付款金额：<span v-text="form.yftotalPrice"></span>
            </el-col>
            <el-col :span="5">
              最终应付款税额：<span v-text="form.yftotalPriceatx"></span>
            </el-col>
            <el-col :span="5">
              提单金额：<span v-text="form.yfPrice"></span>
            </el-col>
            <el-col :span="5"> 金额：<span v-text="form.je"></span> </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              最终实际付款(元)：<span v-text="form.sjPrice"></span>
            </el-col>
          </el-row>

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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
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
        </el-form>
      </div>
      <div v-if="initData.processType == '6'">
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
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              收款类型：<span v-text="form.skType"></span>
            </el-col>
            <el-col :span="4">
              收款方式：<span v-text="form.skWay"></span>
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
                style="margin-bottom: 30px"
              >
                <el-table-column property="name" label="货品名称">
                </el-table-column>
                <el-table-column property="grnNumber" label="出库重量（吨）">
                </el-table-column>
                <el-table-column property="gryRz" label="出库热值（kcal）">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司">
                </el-table-column>
                <el-table-column property="carNumber" label="车数">
                </el-table-column>
                <el-table-column property="batch" label="批次">
                </el-table-column>
                <el-table-column property="deliveryTime" label="到货日期">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价（元）">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额（吨）">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              <el-form-item label="合计重量：">
                <span style="color: red">{{ form.tweight }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="平均热值：">
                <span style="color: red">{{ form.prz }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-text" style="margin-top: 30px">
            <el-col :span="4" :offset="1">
              收款总额(元)：<span v-text="form.skTprice"></span>
            </el-col>
            <el-col :span="4">
              税款(元)：<span v-text="form.tax"></span>
            </el-col>
            <el-col :span="4">
              收款单价：<span v-text="form.skPrice"></span>
            </el-col>
            <el-col :span="4">
              收款日期：<span>{{ parseTime(form.skTime, "{y}-{m}-{d}") }}</span>
            </el-col>
            <el-col :span="4">
              承兑：<span v-text="form.accept"></span>
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
              <el-form-item label="总计收款：">
                <span style="color: red">{{ form.yftotalPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="已预收金额：">
                <span style="color: red">{{ form.yfPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="实际应收金额：">
                <span style="color: red">{{ form.sjPrice }}</span>
              </el-form-item>
            </el-col>
          </el-row>

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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
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
        </el-form>
      </div>
      <div v-if="initData.processType == '7'">
        <el-form label-width="20px;" label-position="left">
          <!--    基础信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="保证金信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              保证金对象：<span v-text="form.type"></span>
            </el-col>
            <el-col :span="4">
              保证金类型：<span v-text="form.obj"></span>
            </el-col>
          </el-row>
          <div v-if="form.type == '上游'">
            <el-row class="head-text">
              <el-col :span="4" :offset="1">
                合同名称：<span v-text="form.contractName"></span>
              </el-col>
              <el-col :span="4">
                供应商名称：<span v-text="form.terminalName"></span>
              </el-col>
              <el-col :span="4">
                保证金金额(元)：<span v-text="form.putPrice"></span>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '下游'">
            <el-row class="head-text">
              <el-col :span="4" :offset="1">
                项目名称：<span v-text="form.stName"></span>
              </el-col>
              <el-col :span="4">
                项目编号：<span v-text="form.number"></span>
              </el-col>
              <el-col :span="4">
                合同名称：<span v-text="form.contractName"></span>
              </el-col>
              <el-col :span="4">
                客户名称：<span v-text="form.terminalName"></span>
              </el-col>
              <el-col :span="4">
                保证金金额(元)：<span v-text="form.putPrice"></span>
              </el-col>
            </el-row>

            <el-row class="head-title">
              <el-col :span="19">
                <el-form-item label="服务费"></el-form-item>
              </el-col>
            </el-row>

            <el-row class="head-text">
              <el-col :span="4" :offset="1">
                年服务费率%：<span v-text="form.stRate"></span>
              </el-col>
              <el-col :span="4">
                保底服务费期限(天)：<span v-text="form.mfsp"></span>
              </el-col>
              <el-col :span="4">
                支付日期：<span>{{
                  parseTime(form.putTime, "{y}-{m}-{d}")
                }}</span>
              </el-col>
            </el-row>
          </div>
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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row class="head-text">
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
        </el-form>
      </div>
      <div v-if="initData.processType == '8'">
        <el-form label-width="20px;" label-position="left">
          <!--    合同信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="基本信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.projectNumber"></span>
            </el-col>
            <el-col :span="4">
              代办人：<span v-text="form.userName"></span>
            </el-col>
            <el-col :span="4"> 月份：<span v-text="form.month"></span> </el-col>
            <el-col :span="4">
              数量(吨)：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              预计付款时间：<span>{{
                parseTime(form.fkTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              预计付款总额(元)：<span v-text="form.fkPrice"></span>
            </el-col>
            <el-col :span="4">
              预计收款时间：<span>{{
                parseTime(form.skTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
            <el-col :span="4">
              预计收款总额(元)：<span v-text="form.skPrice"></span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="initData.processType == '9'">
        <el-form label-width="20px;" label-position="left">
          <!--    基础信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="项目信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
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
              支付日期：<span>{{
                parseTime(form.putTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
            <el-col :span="5">
              年服务费费率(%)：<span v-text="form.stRate"></span>
            </el-col>
            <el-col :span="5">
              保底服务费期限(天)：<span v-text="form.mfsp"></span>
            </el-col>
          </el-row>

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
                style="width: 80%; margin-bottom: 30px"
              >
                <el-table-column property="name" label="合同名称">
                </el-table-column>
                <el-table-column
                  property="type"
                  label="合同类型"
                  :formatter="contractTypeFormat"
                >
                </el-table-column>
                <el-table-column property="expectNumber" label="货品重量(吨)">
                </el-table-column>
                <el-table-column property="" label="合同附件">
                </el-table-column>
                <el-table-column property="" label="补充合同附件">
                </el-table-column>
                <el-table-column property="" label="双章合同附件">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="toContract(scope.row.contractId)"
                      type="text"
                      size="small"
                    >
                      查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="20" :offset="1">
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
        </el-form>
      </div>
      <div v-if="initData.processType == '10'">
        <el-form label-width="20px;" label-position="left">
          <!--    合同信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="入库信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              物流公司：<span v-text="form.wlCompany"></span>
            </el-col>
            <el-col :span="4">
              货品名称：<span v-text="form.name"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              入库重量(吨)：<span v-text="form.grnNumber"></span>
            </el-col>
            <el-col :span="4">
              发货日期：<span>{{
                parseTime(form.deliveryTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
            <el-col :span="4">
              入库热值：<span v-text="form.grnRz"></span>
            </el-col>
            <el-col :span="4">
              运输方式：<span v-text="form.transportType"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              车数：<span v-text="form.carNumber"></span>
            </el-col>
            <el-col :span="4"> 批次：<span v-text="form.batch"></span> </el-col>
            <el-col :span="4">
              基准单价(元)：<span v-text="form.basePrice"></span>
            </el-col>
          </el-row>

          <el-row style="margin-top: 30px">
            <el-col :span="20" :offset="1">
              <el-table :data="tabledatas" fit style="margin-bottom: 22px">
                <el-table-column label="水分(%)">
                  <template slot-scope="scope">
                    <span v-text="form.coalSf"></span>
                  </template>
                </el-table-column>
                <el-table-column label="内水(%)">
                  <template>
                    <span v-text="form.coalNs" />
                  </template>
                </el-table-column>
                <el-table-column label="灰份(%)">
                  <el-table-column label="Aad">
                    <template prop="coalAad">
                      <span v-text="form.coalAad" />
                    </template>
                  </el-table-column>
                  <el-table-column label="ad">
                    <template prop="coalAd">
                      <span v-text="form.coalAd" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="挥发份(%)">
                  <el-table-column label="Vda">
                    <template prop="coalVda">
                      <span v-text="form.coalVda" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Vdaf">
                    <template prop="coalVdae">
                      <span v-text="form.coalVdae" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="灰熔点(℃)">
                  <template prop="coalHrd">
                    <span v-text="form.coalHrd" />
                  </template>
                </el-table-column>
                <el-table-column label="固定碳(%)">
                  <template prop="coalGdt">
                    <span v-text="form.coalGdt" />
                  </template>
                </el-table-column>
                <el-table-column label="含硫量(%)">
                  <template prop="coalHll">
                    <span v-text="form.coalHll" />
                  </template>
                </el-table-column>
                <el-table-column label="热值(%)">
                  <el-table-column label="Qgr,ad">
                    <template prop="coalQgrad">
                      <span v-text="form.coalQgrad" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Qnt,ar">
                    <template prop="coalQntar">
                      <span v-text="form.coalQntar" />
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-title" style="margin-left: 0px">
            <el-col :span="12" :offset="1">
              <el-form-item label="奖惩"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >水分：<span style="color: red" v-text="form.jc1"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >内水：<span style="color: red" v-text="form.jc2"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份Aad：<span style="color: red" v-text="form.jc3"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份ad：<span style="color: red" v-text="form.jc10"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vda：<span style="color: red" v-text="form.jc4"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vdaf：<span style="color: red" v-text="form.jc11"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >灰熔点：<span style="color: red" v-text="form.jc5"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >固定碳：<span style="color: red" v-text="form.jc6"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >含硫量：<span style="color: red" v-text="form.jc7"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qgr,ad：<span style="color: red" v-text="form.jc8"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qnt,ar：<span style="color: red" v-text="form.jc9"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Kcal：<span style="color: red" v-text="form.jc12"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              货值单价(元)：<span v-text="form.valuePrice"></span>
            </el-col>
            <el-col :span="5">
              货值总价(元)：<span v-text="form.valueTprice"></span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="initData.processType == '11'">
        <el-form label-width="20px;" label-position="left">
          <!--    出库信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="出库信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="5">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="5">
              出库重量：<span v-text="form.grnNumber"></span>
            </el-col>
            <el-col :span="5">
              到货日期：<span>{{ parseTime(form.okTime, "{y}-{m}-{d}") }}</span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              出库热值：<span v-text="form.gryRz"></span>
            </el-col>
            <el-col :span="5">
              货值单价：<span v-text="form.valuePrice"></span>
            </el-col>
            <el-col :span="5">
              货值总额：<span v-text="form.valueTprice"></span>
            </el-col>
          </el-row>

          <el-row style="margin-top: 30px">
            <el-col :span="20" :offset="1">
              <el-table :data="zlList" fit style="margin-bottom: 22px">
                <el-table-column label="水分(%)">
                  <template slot-scope="scope">
                    <span v-text="form.coalSf"></span>
                  </template>
                </el-table-column>
                <el-table-column label="内水(%)">
                  <template>
                    <span v-text="form.coalNs" />
                  </template>
                </el-table-column>
                <el-table-column label="灰份(%)">
                  <el-table-column label="Aad">
                    <template prop="coalAad">
                      <span v-text="form.coalAad" />
                    </template>
                  </el-table-column>
                  <el-table-column label="ad">
                    <template prop="coalAd">
                      <span v-text="form.coalAd" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="挥发份(%)">
                  <el-table-column label="Vda">
                    <template prop="coalVda">
                      <span v-text="form.coalVda" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Vdaf">
                    <template prop="coalVdae">
                      <span v-text="form.coalVdae" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="灰熔点(℃)">
                  <template prop="coalHrd">
                    <span v-text="form.coalHrd" />
                  </template>
                </el-table-column>
                <el-table-column label="固定碳(%)">
                  <template prop="coalGdt">
                    <span v-text="form.coalGdt" />
                  </template>
                </el-table-column>
                <el-table-column label="含硫量(%)">
                  <template prop="coalHll">
                    <span v-text="form.coalHll" />
                  </template>
                </el-table-column>
                <el-table-column label="热值(%)">
                  <el-table-column label="Qgr,ad">
                    <template prop="coalQgrad">
                      <span v-text="form.coalQgrad" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Qnt,ar">
                    <template prop="coalQntar">
                      <span v-text="form.coalQntar" />
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-title" style="margin-left: 0px">
            <el-col :span="12" :offset="1">
              <el-form-item label="奖惩"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >水分：<span style="color: red" v-text="form.jc1"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >内水：<span style="color: red" v-text="form.jc2"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份Aad：<span style="color: red" v-text="form.jc3"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >灰份ad：<span style="color: red" v-text="form.jc10"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vda：<span style="color: red" v-text="form.jc4"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >挥发份Vdaf：<span style="color: red" v-text="form.jc11"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="20" :offset="1">
              <el-form-item label="">
                <span
                  >灰熔点：<span style="color: red" v-text="form.jc5"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >固定碳：<span style="color: red" v-text="form.jc6"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >含硫量：<span style="color: red" v-text="form.jc7"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qgr,ad：<span style="color: red" v-text="form.jc8"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Qnt,ar：<span style="color: red" v-text="form.jc9"
                    >0.00</span
                  ></span
                >
                <span style="margin-left: 20px"
                  >热值Kcal：<span style="color: red" v-text="form.jc12"
                    >0.00</span
                  ></span
                >
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="入库库信息"></el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 30px">
            <el-col :span="20" :offset="1">
              <el-table
                ref="singleTable"
                :data="grnList"
                fit
                style="margin-bottom: 30px"
              >
                <el-table-column property="name" label="已选货品名称">
                </el-table-column>
                <el-table-column property="grnNumber" label="入库重量（吨）">
                </el-table-column>
                <el-table-column property="grnRz" label="热值（kcal）">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司">
                </el-table-column>
                <el-table-column property="carNumber" label="车数">
                </el-table-column>
                <el-table-column property="batch" label="批次">
                </el-table-column>
                <el-table-column property="deliveryTime" label="发货日期（吨）">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价（元）">
                                <template slot-scope="scope">
                  {{scope.row.valuePrice }}
                </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额（吨）">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              <el-form-item label="重量差">
                <span
                  style="color: red; line-height: 57px !important"
                  v-text="zlc"
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="热值差" prop="averageRz">
                <span
                  style="color: red; line-height: 57px !important"
                  v-text="rzc"
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="单价差" prop="averageRz">
                <span
                  style="color: red; line-height: 57px !important"
                  v-text="djc"
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="总额差" prop="averageRz">
                <span
                  style="color: red; line-height: 57px !important"
                  v-text="zec"
                ></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="initData.processType == '12'">
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
              年发运量(万吨)：<span v-text="form.traffic"></span>
            </el-col>
            <el-col :span="5">
              注册资本(万元)：<span v-text="form.capital"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              发票面额：<span v-text="form.invoiceType"></span>
            </el-col>
            <el-col :span="5">
              企业性质：<span v-text="form.nature"></span>
            </el-col>
            <el-col :span="5">
              评级：<span v-text="form.rating"></span>
            </el-col>
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
        </el-form>
      </div>
      <div v-if="initData.processType == '13'">
        <el-form label-width="20px;" label-position="left">
          <!--    基础信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="终端客户信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              终端客户名称：<span v-text="form.name"></span>
            </el-col>
            <el-col :span="5">
              成立日期：<span v-text="form.setupTime"></span>
            </el-col>
            <el-col :span="5">
              企业性质：<span v-text="form.nature"></span>
            </el-col>
            <el-col :span="5">
              年需求量(万吨)：<span v-text="form.demand"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              注册资本(万元)：<span v-text="form.capital"></span>
            </el-col>
            <el-col :span="5">
              开票结算方式：<span v-text="form.settlementType"></span>
            </el-col>
            <el-col :span="5">
              结算规则：<span v-text="form.settlementGz"></span>
            </el-col>
            <el-col :span="5">
              回款账期：<span v-text="form.paymentdays"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              付款方式：<span v-text="form.paymentType"></span>
            </el-col>
            <el-col :span="5">
              评级：<span v-text="form.rating"></span>
            </el-col>
            <el-col :span="5">
              评级说明：<span v-text="form.ratingDe"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
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
        </el-form>
      </div>
      <div v-if="initData.processType == '14'">
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
            <el-col :span="5" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="5">
              项目编号：<span v-text="form.projectNumber"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              收票类型：<span v-text="form.proportion"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              数量：<span v-text="form.number"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              代办人：<span v-text="form.uName"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              终端用户：<span v-text="form.tName"></span>
            </el-col>
          </el-row>
          <!--      <el-row class="head-text">-->
          <!--        <el-col :span="5" :offset="1">-->
          <!--          最终结算总额(元)：<span v-text="form.ysPrice"></span>-->
          <!--        </el-col>-->
          <!--        <el-col :span="5">-->
          <!--          已收票金额：<span v-text="form.totalPrice"></span>-->
          <!--        </el-col>-->
          <!--        <el-col :span="5">-->
          <!--          剩余收票金额：<span v-text="form.sy"></span>-->
          <!--        </el-col>-->
          <!--      </el-row>-->
          <!--          <el-row class="head-title">-->
          <!--            <el-col :span="19">-->
          <!--              <el-form-item label="发票信息"></el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--          <el-row>-->
          <!--            <el-col :span="20" :offset="1">-->
          <!--              <el-table-->
          <!--                ref="singleTable"-->
          <!--                :data="ocrList"-->
          <!--                fit-->
          <!--                style="margin-bottom: 30px;">-->
          <!--                <el-table-column-->
          <!--                  property="number"-->
          <!--                  label="发票号码">-->
          <!--                </el-table-column>-->
          <!--                <el-table-column-->
          <!--                  property="date"-->
          <!--                  label="开票日期">-->
          <!--                </el-table-column>-->
          <!--                <el-table-column-->
          <!--                  property="price"-->
          <!--                  label="开票金额(元)">-->
          <!--                </el-table-column>-->
          <!--                <el-table-column-->
          <!--                  property="tax"-->
          <!--                  label="开票税额(元)">-->
          <!--                </el-table-column>-->
          <!--                <el-table-column-->
          <!--                  property="total"-->
          <!--                  label="价税合计(元)">-->
          <!--                </el-table-column>-->
          <!--              </el-table>-->
          <!--            </el-col>-->
          <!--          </el-row>-->

          <!--          <el-row class="head-text">-->
          <!--            <el-col :span="24">-->
          <!--              <el-form-item label="合计："  >-->
          <!--                <span>数量(吨)：<span style="color: red" v-text="form.number">0.00</span></span>-->
          <!--                <span style="margin-left: 20px;">开票金额(元)：<span style="color: red" v-text="form.price">0.00</span></span>-->
          <!--                <span style="margin-left: 20px;">开票税额(元)：<span style="color: red" v-text="form.tax">0.00</span></span>-->
          <!--                <span style="margin-left: 20px;">价税合计(元)：<span style="color: red" v-text="form.totalPrice">0.00</span></span>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              数量(吨)：<span v-text="form.number"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              开票金额(元)：<span v-text="form.price"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              开票税额(元)：<span v-text="form.tax"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="5" :offset="1">
              价税合计(元)：<span v-text="form.totalPrice"></span>
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
        </el-form>
      </div>
      <div v-if="initData.processType == '15'">
        <el-form label-width="20px;" label-position="left">
          <!--    基础信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="开票信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              代办人：<span v-text="form.uName"></span>
            </el-col>
            <el-col :span="4">
              供应商：<span v-text="form.sName"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              结算金额：<span v-text="form.zzTprice"></span>
            </el-col>
            <el-col :span="4">
              验收重量(吨)：<span v-text="form.zzWeight"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              开票金额(元)：<span v-text="form.kpPrice"></span>
            </el-col>
            <el-col :span="4">
              开票税额(元)：<span v-text="form.kpTax"></span>
            </el-col>
            <el-col :span="4">
              价税合计(元)：<span v-text="form.kpTotal"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              货品单价(元)：<span v-text="form.zzPrice"></span>
            </el-col>
            <el-col :span="4">
              货品名称：<span v-text="form.mc"></span>
            </el-col>
            <el-col :span="4">
              货品型号：<span v-text="form.xh"></span>
            </el-col>
          </el-row>
          <el-row class="head-text">
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
        </el-form>
      </div>
      <div v-if="initData.processType == '16'">
        <el-form label-width="20px;" label-position="left">
          <!--    合同信息-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="基本信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              申请人：<span v-text="form.sqName"></span>
            </el-col>
            <el-col :span="4">
              客户经理：<span v-text="form.managerName"></span>
            </el-col>
            <el-col :span="4">
              支出类型：<span v-text="form.type"></span>
            </el-col>
            <el-col :span="4">
              金额(元)：<span v-text="form.price"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              支出时间：<span>{{
                parseTime(form.payTime, "{y}-{m}-{d}")
              }}</span>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="initData.processType == '17'">
        <el-form label-width="20px;" label-position="left">
          <!--    实际收款-->
          <el-row class="head-title">
            <el-col :span="19">
              <el-form-item label="基本信息"></el-form-item>
            </el-col>
            <el-col :span="4">
              <span style="color: #ff0000">{{ stateF(form.state) }}</span>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              项目名称：<span v-text="form.stName"></span>
            </el-col>
            <el-col :span="4">
              项目编号：<span v-text="form.number"></span>
            </el-col>
            <el-col :span="4">
              预估应收：<span v-text="form.ygPrice"></span>
            </el-col>
            <el-col :span="4">
              开票金额：<span v-text="form.kpPrice"></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              结算单价：<span v-text="form.jsDj"></span>
            </el-col>
            <el-col :span="4">
              结算煤量(元)：<span v-text="form.jsMl"></span>
            </el-col>
            <el-col :span="4">
              结算煤款：<span v-text="form.jsMk"></span>
            </el-col>
            <el-col :span="4">
              结算税款(元)：<span v-text="form.jsTax"></span>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div v-if="initData.processType == '18'">
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
              单价（元/{{ priceLabel }}）：<span v-text="form.bidPrice"></span>
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
        </el-form>
      </div>

      <div style="margin-top: 30px">
        <el-form label-width="20px;" label-position="left">
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="审批信息"></el-form-item>
            </el-col>
          </el-row>
          <!--        <span>审批信息</span>-->
          <el-row class="head-text">
            <el-col :offset="1">
              <el-table :data="processData" fit style="width: 80%">
                <el-table-column label="部门" align="center" prop="deptName" />
                <el-table-column
                  label="审批人"
                  align="center"
                  prop="nickName"
                />
                <el-table-column
                  label="审批时间"
                  align="center"
                  prop="approveTime"
                />
                <el-table-column
                  label="审批说明"
                  align="center"
                  prop="processValue"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.processValue == undefined ||
                      scope.row.processValue == null ||
                      scope.row.processValue == "undefined"
                        ? ""
                        : scope.row.processValue
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="审批状态" align="center" prop="status">
                  <template slot-scope="scope">
                    {{ scope.row.status == 0 ? "驳回" : "通过" }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="margin-top: 30px">
        <el-form label-width="20px;" label-position="left">
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="审批说明"></el-form-item>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :offset="1" :span="20">
              <el-form-item prop="remark">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入审批说明"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model="queryParams.remark"
                  style="width: 750px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button">
          <el-button type="primary" @click="pass">审批通过</el-button>
          <el-button type="danger" @click="turnDown">审批驳回</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getProcessData,
  passed,
  turnDownByProcessId,
} from "@/api/approve/index.js";
import { getToken } from "@/utils/auth";
import { getSupplier } from "@/api/project/supplier";
import { getSt, getStupdate } from "@/api/project/st";
import { getContract } from "@/api/project/contract";
import { getApayment } from "@/api/project/apayment";
import { getFpayment } from "@/api/project/fpayment";
import { getSk } from "@/api/project/sk";
import { getMargin } from "@/api/project/margin";
import { getCplan } from "@/api/project/cplan";
import { getLpayment } from "@/api/project/lpayment";
import { getGrn } from "@/api/project/grn";
import { getGry } from "@/api/project/gry";
import { getTerminal } from "@/api/project/terminal";
import { getSticket } from "@/api/project/sticket";
import { getKp } from "@/api/project/kp";
import { getDp } from "@/api/project/dp";
import { getRealsk } from "@/api/project/realsk";
import { getBidApply } from "@/api/project/bidApply";
import {
  getApaymentList,
  getContractList,
  getFpaymentList,
  getGrnList,
  getGryList,
  getLpaymentList,
  getSkList,
  getSticketList,
  getSpList,
  getKpList,
} from "@/api/project/all";
export default {
  props: ["mode", "initData"],
  data() {
    return {
      queryParams: {},
      processData: [],

      //审批集合
      stateList: [
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "",
          state: "未审批",
        },
      ],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],
      //补充附件集合
      bcfileList: [],

      //说明
      xmNode: "",
      //合同集合
      contract: [],
      //入库集合
      grnList: [],
      //出库集合
      gryList: [],
      //预付款集合
      apaymentList: [],
      //收款集合
      skList: [],
      //物流付款集合
      lpaymentList: [],
      //最终付款集合
      fpaymentList: [],
      //发票集合
      sticketList: [],
      //发票集合
      kpList: [],
      //服务费集合
      spList: [],
      //固定差价集合
      gdList: [{ show: true }],

      //出入库集合
      dataList: [],

      // //煤炭质量集合
      // zlList:[],
      //煤炭质量集合
      zlList: [{ show: true }],
      tabledatas: [{ show: true }],

      //差值
      zlc: 0,
      rzc: 0,
      djc: 0,
      zec: 0,

      //ocr集合
      ocrList: [],

      // 表单参数
      form: {},
      gryLr: 0.0,
      gryNumber: 0,
      htform: {},
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
    this.init();
    this.getList();
  },
  methods: {
    init() {
      this.queryParams = this.initData;
    },
    getList() {
      console.log("A1:" + this.queryParams.id);
      getProcessData(this.initData.id).then((res) => {
        this.processData = res.data;
      });
      let typeId = this.initData.processType;
      let stId = this.initData.stId;
      if (typeId == "1") {
        getSt(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          if (this.form.chargemType == "1") {
            this.form.chargemType = "年息";
          } else if (this.form.chargemType == "2") {
            this.form.chargemType = "固定差价";
          } else if (this.form.chargemType == "3") {
            this.form.chargemType = "年息+固定差价";
          }
          if (this.form.tMargintype == "1") {
            this.form.tMargintype = "有";
          } else if (this.form.tMargintype == "2") {
            this.form.tMargintype = "无";
          }
          if (this.form.settlementP == "其他") {
            if (
              this.form.settlementPA1 != null &&
              this.form.settlementPA1 != ""
            ) {
              this.form.settlementP = this.form.settlementPA1 + "%";
              if (
                this.form.settlementPA2 != null &&
                this.form.settlementPA2 != ""
              ) {
                this.form.settlementP =
                  this.form.settlementPA1 +
                  "%-" +
                  this.form.settlementPA2 +
                  "%";
                if (
                  this.form.settlementPA3 != null &&
                  this.form.settlementPA3 != ""
                ) {
                  this.form.settlementP =
                    this.form.settlementPA1 +
                    "%-" +
                    this.form.settlementPA2 +
                    "%-" +
                    this.form.settlementPA3 +
                    "%";
                }
              }
            }
            // this.form.settlementP=this.form.settlementPA1+"%-"+this.form.settlementPA2+"%-"+this.form.settlementPA3+"%"
          }
          if (this.form.shSettlement == "其他") {
            if (
              this.form.shSettlementA1 != null &&
              this.form.shSettlementA1 != ""
            ) {
              this.form.shSettlement = this.form.shSettlementA1 + "%";
              if (
                this.form.shSettlementA2 != null &&
                this.form.shSettlementA2 != ""
              ) {
                this.form.shSettlement =
                  this.form.shSettlementA1 +
                  "%-" +
                  this.form.shSettlementA2 +
                  "%";
                if (
                  this.form.shSettlementA3 != null &&
                  this.form.shSettlementA3 != ""
                ) {
                  this.form.shSettlement =
                    this.form.shSettlementA1 +
                    "%-" +
                    this.form.shSettlementA2 +
                    "%-" +
                    this.form.shSettlementA3 +
                    "%";
                }
              }
            }
            // this.form.shSettlement=this.form.shSettlementA1+"%-"+this.form.shSettlementA2+"%-"+this.form.shSettlementA3+"%"
          }
        });
      } else if (typeId == "2") {
        getStupdate(stId).then((response) => {
          getSt(response.data.stId).then((response) => {
            this.form = response.data;
          });
          this.form.state = response.data.state;
          this.fileList = response.data.fileList;
          this.xmNode = response.data.xmNode;
        });
        let data = { stId: response.data.stId };
        //合同
        getContractList(data).then((response) => {
          this.contract = response.rows;
        });
        // 入库
        getGrnList(data).then((response) => {
          this.grnList = response.rows;
        });
        // 出库
        getGryList(data).then((response) => {
          this.gryList = response.rows;

          let gryNumber = 0;
          let gryLr = 0.0;
          for (let i = 0; i < this.gryList.length; i++) {
            let obj = this.gryList[i];
            if (obj.chargemGd != null && obj.chargemGd != "") {
              gryNumber = gryNumber + obj.grnNumber;
              gryLr = (
                parseFloat(gryLr) +
                obj.grnNumber * obj.chargemGd
              ).toFixed(2);
            }
          }
          this.gryNumber = gryNumber;
          this.gryLr = gryLr;
        });
        // 预付款
        let apaymentData = { stId: stId, stLook: "1" };
        getApaymentList(apaymentData).then((response) => {
          this.apaymentList = response.rows;
        });
        // 收款
        let skData = { stId: stId, stLook: "1" };
        getSkList(skData).then((response) => {
          this.skList = response.rows;
        });
        // 物流付款
        getLpaymentList(data).then((response) => {
          this.lpaymentList = response.rows;
        });
        // 最终付款
        getFpaymentList(data).then((response) => {
          this.fpaymentList = response.rows;
        });
        // 发票
        getSticketList(data).then((response) => {
          this.sticketList = response.rows;
        });
        // 发票
        getKpList(data).then((response) => {
          this.kpList = response.rows;
        });
        // 服务费
        getSpList(data).then((response) => {
          this.spList = response.rows;
        });
      } else if (typeId == "3") {
        getContract(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.bcfileList = response.data.filebcList;
          if (this.form.type == "1") {
            this.form.type = "上游合同";
          } else if (this.form.type == "2") {
            this.form.type = "下游合同";
          } else if (this.form.type == "3") {
            this.form.type = "物流运输合同";
          } else if (this.form.type == "4") {
            this.form.type = "物流服务合同";
          }
          console.log(this.fileList);
        });
      } else if (typeId == "4") {
        getApayment(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.dataList = response.data.selnyList;
          let data = { stId: this.form.stId };
          //合同
          getContractList(data).then((response) => {
            this.contract = response.rows;
          });
        });
      } else if (typeId == "5") {
        getFpayment(stId).then((response) => {
          this.form = response.data;
          this.fileList = this.form.fileList;
          this.gryList = response.data.selnyList;

          let data = { stId: this.form.stId };
          //合同
          getContractList(data).then((response) => {
            this.contract = response.rows;
          });

          let sticketData = { stId: this.form.stId };
          getSticketList(sticketData).then((response) => {
            let sticketList = response.rows;
            let a1 = false;
            let a2 = false;
            for (let i = 0; i < sticketList.length; i++) {
              if (
                sticketList[i].proportion != null &&
                sticketList[i].proportion != ""
              ) {
                if (sticketList[i].proportion == "5%") {
                  a1 = true;
                }
                if (sticketList[i].proportion == "95%") {
                  a2 = true;
                }
              }
            }
            if (!a1 && !a2) {
              this.$message.error("该项目没有5%和95%收票记录");
            } else {
              if (!a1) {
                this.$message.error("该项目没有5%收票记录");
              }
              if (!a2) {
                this.$message.error("该项目没有95%收票记录");
              }
            }
          });
        });
      } else if (typeId == "6") {
        getSk(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.gryList = response.data.selnyList;

          let data = { stId: this.form.stId };
          //合同
          getContractList(data).then((response) => {
            this.contract = response.rows;
          });
        });
      } else if (typeId == "7") {
        getMargin(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;

          let data = { stId: this.form.stId };
          //合同
          getContractList(data).then((response) => {
            this.contract = response.rows;
          });
        });
      } else if (typeId == "8") {
        getCplan(stId).then((response) => {
          this.form = response.data;
        });
      } else if (typeId == "9") {
        getLpayment(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.gryList = response.data.selnyList;
          this.form.wldetailsList = response.data.wldetailsList;

          let data = { stId: this.form.stId };
          //合同
          getContractList(data).then((response) => {
            this.contract = response.rows;
          });
        });
      } else if (typeId == "10") {
        getGrn(stId).then((response) => {
          this.form = response.data;
        });
      } else if (typeId == "11") {
        getGry(stId).then((response) => {
          this.form = response.data;
          console.log(this.form);
          this.grnList = response.data.grnList;
          this.zlc = response.data.grnNumber - this.grnList[0].grnNumber;
          this.rzc = response.data.gryRz - this.grnList[0].grnRz;
          this.djc = response.data.valuePrice - this.grnList[0].valuePrice;
          this.zec = response.data.valueTprice - this.grnList[0].valueTprice;
        });
      } else if (typeId == "12") {
        getSupplier(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.gryList = response.data.selnyList;
        });
      } else if (typeId == "13") {
        getTerminal(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
        });
      } else if (typeId == "14") {
        getSticket(stId).then((response) => {
          this.form = response.data;
          this.fileList = this.form.fileList;
          this.ocrList = this.form.ocrList;
          this.form.sy = this.form.ysPrice - this.form.totalPrice;
        });
      } else if (typeId == "15") {
        getKp(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
        });
      } else if (typeId == "16") {
        getDp(stId).then((response) => {
          this.form = response.data;
        });
      } else if (typeId == "17") {
        getRealsk(stId).then((response) => {
          this.form = response.data;
        });
      } else if (typeId == "18") {
        getBidApply(stId).then((response) => {
          this.form = response.data;
          this.fileList = this.form.fileList || [];
        });
      }
    },
    pass() {
      if (this.queryParams.remark == undefined) {
        this.queryParams.remark = "无";
      }
      passed(
        this.initData.processId,
        this.initData.id,
        this.initData.level,
        this.queryParams.remark
      ).then(() => {
        this.$messageContent.message("S000003", ["审批"]);
        this.getList();
        this.$emit("popOk");
      });
    },
    turnDown() {
      if (this.queryParams.remark == undefined) {
        this.queryParams.remark = "无";
      }
      turnDownByProcessId(
        this.initData.processId,
        this.initData.id,
        this.queryParams.remark
      ).then((res) => {
        this.$messageContent.message("S000003", ["驳回"]);
        this.getList();
        // this.getMyUpcomings();
        this.$emit("popOk");
      });
      // turnDownByProcessId(this.initData.id).then(() => {
      //   this.$messageContent.message("S000003", ["驳回"]);
      //   this.$emit("popOk");
      // });
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
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
}
</style>
>
