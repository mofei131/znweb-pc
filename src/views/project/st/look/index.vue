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
        <el-col :span="4" :offset="1">
          项目编号：<span v-text="form.number"></span>
        </el-col>
        <el-col :span="4"> 项目名称：<span v-text="form.name"></span> </el-col>
        <el-col :span="4">
          供应商：<span v-text="form.supplierName"></span>
        </el-col>
        <el-col :span="4"> 用煤单位：<span v-text="form.tName"></span> </el-col>
        <el-col :span="4">
          立项日期：<span>{{ parseTime(form.createTime, "{y}-{m}-{d}") }}</span>
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
          固定差价(元)：<span
            v-text="$options.filters.moneyFilter(form.chargemGd)"
          ></span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          预计吨数：<span
            v-text="$options.filters.weightFilter(form.expectWeight)"
          ></span>
        </el-col>
        <el-col :span="4">
          预计单价(元)：<span
            v-text="$options.filters.moneyFilter(form.expectPrice)"
          ></span>
        </el-col>
        <el-col :span="4">
          成本年服务费率(%)：<span v-text="form.rateYear"></span>
        </el-col>
        <el-col :span="4">
          预计利润(元)：<span
            v-text="$options.filters.moneyFilter(form.expectProfits)"
          ></span>
        </el-col>
        <el-row class="head-text">
          <el-col :span="4" :offset="1">
            立项编号：<span v-text="form.productNo"></span>
          </el-col>
        </el-row>
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
              <template slot-scope="scope">
                {{
                  Number(scope.row.expectNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
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
          <el-form-item label="随车数质量信息"></el-form-item>
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
            <el-table-column property="grnNumber" label="重量(吨)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="grnRz" label="热值(Kcal)">
            </el-table-column>
            <el-table-column property="transportType" label="运输方式">
            </el-table-column>
            <el-table-column property="wlCompany" label="物流公司">
            </el-table-column>
            <el-table-column property="carNumber" label="车数">
            </el-table-column>
            <el-table-column property="batch" label="批次"> </el-table-column>
            <el-table-column property="deliveryTime" label="发货日期">
            </el-table-column>
            <el-table-column property="valuePrice" label="货值单价(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valuePrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="valueTprice" label="货值总额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valueTprice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
          <el-form-item label="到厂数质量信息"></el-form-item>
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
            <el-table-column property="grnNumber" label="重量(吨)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="gryRz" label="热值(Kcal)">
            </el-table-column>
            <el-table-column property="transportType" label="运输方式">
            </el-table-column>
            <el-table-column property="wlCompany" label="物流公司">
            </el-table-column>
            <el-table-column property="carNumber" label="车数">
            </el-table-column>
            <el-table-column property="batch" label="批次"> </el-table-column>
            <el-table-column property="okTime" label="发货日期">
            </el-table-column>
            <el-table-column property="valuePrice" label="货值单价(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valuePrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="valueTprice" label="货值总额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valueTprice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
              <template slot-scope="scope">
                {{
                  Number(scope.row.grns)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="grys" label="验收总量(吨)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.grys)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="totalPrice" label="预付总额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.totalPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="expectPrice" label="预付单价(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.expectPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="ato" label="预付至"> </el-table-column>
            <el-table-column property="actualPrice" label="实际付款(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.actualPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
              <template slot-scope="scope">
                {{
                  Number(scope.row.tweight)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="skPrice" label="单价(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.skPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="skTprice" label="收款金额">
              <template slot-scope="scope">
                {{
                  Number(scope.row.skTprice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
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
              <template slot-scope="scope">
                {{
                  Number(scope.row.tntPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              property="serType"
              label="是否产生服务费">
            </el-table-column>
            <el-table-column
              property="putTime"
              label="付款时间">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.putTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column> -->
            <el-table-column property="tpcName" label="第三方公司">
            </el-table-column>
            <el-table-column property="account" label="公司账户">
            </el-table-column>
            <el-table-column property="openbank" label="公司开户行">
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
              <template slot-scope="scope">
                {{
                  Number(scope.row.tweight)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="price" label="终付单价(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.price)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="zzPrice" label="最终付款总额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.zzPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="yfPrice" label="已付款总额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.yfPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="sjPrice" label="最终实际付款(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.sjPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
                {{
                  Number(scope.row.kpPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="zzWeight" label="货品总重(吨)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.zzWeight)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="kpTax" label="发票税额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.kpTax)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="kpTotal" label="价税合计(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.kpTotal)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
                {{
                  Number(scope.row.price)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="number" label="货品总重(吨)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.number)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="tax" label="发票税额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.tax)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="totalPrice" label="价税合计(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.totalPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
                <span>{{ parseTime(scope.row.putTime, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column property="putPrice" label="付款金额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.putPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="outTime" label="回款日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.outTime, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column property="spTime" label="资金占用时间(天)">
            </el-table-column>
            <el-table-column property="spPrice" label="代理费(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.spPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="sjPrice" label="成本费用(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.sjPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="lrPrice" label="资金占用利润(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.lrPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
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
              <el-table-column label="重量">
                <template slot-scope="scope">
                  <span
                    v-text="$options.filters.weightFilter(gryNumber)"
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="固定差价">
                <template slot-scope="scope">
                  <span
                    v-text="$options.filters.moneyFilter(form.chargemGd)"
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="差价利润">
                <template slot-scope="scope">
                  <span v-text="$options.filters.moneyFilter(gryLr)"></span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <!--      <el-row class="head-text" style="margin-bottom: 200px;">-->
      <!--        <el-col :span="2" style="margin-left: 20px;">-->
      <!--          合计-->
      <!--        </el-col>-->
      <!--        <el-col :span="4">-->
      <!--          资金占用利润：<span style="color: #FF0000;">0.00</span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="4">-->
      <!--          固定差价利润：<span style="color: #FF0000;">0.00</span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="4">-->
      <!--          利润总和：<span style="color: #FF0000;">0.00</span>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
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
import { getSt } from "@/api/project/st";
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
import { getProcessDataByStId } from "@/api/approve";

export default {
  name: "look",
  data() {
    return {
      // 集合
      xxList: [
        { stName: "项目A" },
        { stName: "项目B" },
        { stName: "项目C" },
        { stName: "项目D" },
      ],
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
      // 表单参数
      form: {},
      gryLr: 0.0,
      gryNumber: 0,
    };
  },
  created() {
    const stId = this.$route.params && this.$route.params.stId;
    getSt(stId).then((response) => {
      this.form = response.data;
      if (this.form.chargemType == "1") {
        this.form.chargemType = "年息";
      } else if (this.form.chargemType == "2") {
        this.form.chargemType = "固定差价";
      } else if (this.form.chargemType == "3") {
        this.form.chargemType = "年息+固定差价";
      }
    });
    let data = { stId: stId };
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
          gryLr = (parseFloat(gryLr) + obj.grnNumber * obj.chargemGd).toFixed(
            2
          );
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

    // getProcessDataByStId("1",stId).then((res) => {
    //   this.stateList = res.data;
    // });
  },
  methods: {
    // 取消按钮
    // cancel() {
    //   this.$emit("cancel")
    // },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    //跳转合同详情
    toContract(contractId) {
      this.$router.push("/contract/look/" + contractId);
    },
    //跳转入库详情
    toGrn(grnId) {
      this.$router.push("/grn/look/" + grnId);
    },
    //跳转出库详情
    toGry(gryId) {
      this.$router.push("/gry/look/" + gryId);
    },
    //跳转出库编辑
    toGryAou(gryId) {
      this.$router.push("/gry/aou/" + gryId);
    },
    //跳转预付款详情
    toApayment(apyamentId) {
      this.$router.push("/apayment/look/" + apyamentId);
    },
    //跳转收款详情
    toSk(skId) {
      this.$router.push("/sk/look/" + skId);
    },
    //跳转物流付款详情
    toLpayment(lpaymentId) {
      this.$router.push("/lpayment/look/" + lpaymentId);
    },
    //跳转最终付款详情
    toFpayment(fpaymentId) {
      this.$router.push("/fpayment/look/" + fpaymentId);
    },
    //跳转发票详情
    toSticket(sticketId) {
      this.$router.push("/sticket/look/" + sticketId);
    },
    //跳转发票详情
    toKp(kpId) {
      this.$router.push("/kp/look/" + kpId);
    },

    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if (row.type == "1") {
        return "委托销售合同";
      } else if (row.type == "2") {
        return "煤炭采购合同";
      } else if (row.type == "3") {
        return "物流运输合同";
      } else if (row.type == "4") {
        return "物流服务合同";
      } else if (row.type == "5") {
        return "其他合同";
      }
    },
    // 开票状态字典翻译
    moFormat(row, column) {
      if (row.moType == "1") {
        return "未开票";
      } else {
        return "已开票";
      }
    },
  },
};
</script>
