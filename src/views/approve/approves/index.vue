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
            queryParams.initiatorUserName
            }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="initData.approvalType == '20'">
      <el-form label-width="20px;" label-position="left">
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">立项类型</td>
                <td class="tdCoent">{{projectInfo.projectType}}</td>
                <td class="tdTitle">立项编号</td>
                <td class="tdCoent">{{projectInfo.projectNo}}</td>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{projectInfo.projectName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{projectInfo.serialNo}}</td>
                <td class="tdTitle">供应商</td>
                <td class="tdCoent">{{projectInfo.supplierName}}</td>
                <td class="tdTitle">代办人</td>
                <td class="tdCoent">{{projectInfo.userName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">终端客户</td>
                <td class="tdCoent">{{projectInfo.terminalName}}</td>
                <td class="tdTitle">业务经理</td>
                <td class="tdCoent">{{projectInfo.serviceManagerName}}</td>
                <td class="tdTitle">业务类型</td>
                <td class="tdCoent">{{changeBusinessType(projectInfo.businessType)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">业务实控人</td>
                <td class="tdCoent">{{projectInfo.actualControlName}}</td>
                <td class="tdTitle">收费模式</td>
                <td class="tdCoent">{{changeChargemType(projectInfo.chargemType)}}</td>
                <td class="tdTitle">货运方式</td>
                <td class="tdCoent">{{changeTransType(projectInfo.freightMode)}}</td>
              </tr>
              <template v-if="projectInfo.chargemType == '1'">
                <tr>
                  <td class="tdTitle">年服务费率(%)</td>
                  <td class="tdCoent">{{projectInfo.chargemNx}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </template>
              <template v-if="projectInfo.chargemType == '2'">
                <tr>
                  <td class="tdTitle">固定差价(元)</td>
                  <td class="tdCoent">{{projectInfo.chargemGd}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </template>
              <template v-if="projectInfo.chargemType == '3'">
                <tr>
                  <td class="tdTitle">年服务费率(%)</td>
                  <td class="tdCoent">{{projectInfo.chargemNx}}</td>
                  <td class="tdTitle">固定差价(元)</td>
                  <td class="tdCoent">{{projectInfo.chargemGd}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                </tr>
              </template>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col :span="18" :offset="1">
            <el-form-item label="附件：" prop="file">
              <custom-upload :fileList="projectInfo.filesList"></custom-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="initData.approvalType == '1'">
      <el-form label-width="20px;" label-position="left">
        <el-row class="head-title">
          <el-col :span="12">
            <el-form-item label="项目信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">立项类型</td>
                <td class="tdCoent">{{projectInfo.projectType}}</td>
                <td class="tdTitle">立项编号</td>
                <td class="tdCoent">{{projectInfo.projectNo}}</td>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{projectInfo.projectName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{projectInfo.serialNo}}</td>
                <td class="tdTitle">供应商</td>
                <td class="tdCoent">{{projectInfo.supplierName}}</td>
                <td class="tdTitle">代办人</td>
                <td class="tdCoent">{{projectInfo.userName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">终端客户</td>
                <td class="tdCoent">{{projectInfo.terminalName}}</td>
                <td class="tdTitle">业务经理</td>
                <td class="tdCoent">{{projectInfo.serviceManagerName}}</td>
                <td class="tdTitle">业务类型</td>
                <td class="tdCoent">{{changeBusinessType(projectInfo.businessType)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">业务实控人</td>
                <td class="tdCoent">{{projectInfo.actualControlName}}</td>
                <td class="tdTitle">收费模式</td>
                <td class="tdCoent">{{changeChargemType(projectInfo.chargemType)}}</td>
                <td class="tdTitle">货运方式</td>
                <td class="tdCoent">{{changeTransType(projectInfo.freightMode)}}</td>
              </tr>
              <template v-if="projectInfo.chargemType == '1'">
                <tr>
                  <td class="tdTitle">年服务费率(%)</td>
                  <td class="tdCoent">{{projectInfo.chargemNx}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </template>
              <template v-if="projectInfo.chargemType == '2'">
                <tr>
                  <td class="tdTitle">固定差价(元)</td>
                  <td class="tdCoent">{{projectInfo.chargemGd}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </template>
              <template v-if="projectInfo.chargemType == '3'">
                <tr>
                  <td class="tdTitle">年服务费率(%)</td>
                  <td class="tdCoent">{{projectInfo.chargemNx}}</td>
                  <td class="tdTitle">固定差价(元)</td>
                  <td class="tdCoent">{{projectInfo.chargemGd}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                </tr>
              </template>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col :span="18" :offset="1">
            <el-form-item label="附件：" prop="file">
              <custom-upload :fileList="projectInfo.filesList"></custom-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-title">
          <el-col :span="12">
            <el-form-item label="业务基础信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{ stInfo.stName }}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ stInfo.serialNo }}</td>
                <td class="tdTitle">业务金额(万元)</td>
                <td class="tdCoent">{{ stInfo.stAmount }}</td>
              </tr>
              <tr>
                <td class="tdTitle">结算比例</td>
                <td class="tdCoent">{{
                  parseSettlement(stInfo.settlementPA1,stInfo.settlementPA2,stInfo.settlementPA3)}}</td>
                <td class="tdTitle">履约保证金</td>
                <td class="tdCoent">{{ stInfo.marginType == 1 ? '有' : '无' }}</td>
                <td class="tdTitle">履约保证金金额(万元)</td>
                <td class="tdCoent">{{ stInfo.margin }}</td>
              </tr>
              <tr>
                <td class="tdTitle">服务周期</td>
                <td class="tdCoent">{{ (stInfo.cycleStart||'') + '-' + (stInfo.cycleEnd||'') }}</td>
                <td class="tdTitle">预计重量(吨)</td>
                <td class="tdCoent">{{ stInfo.expectWeight }}</td>
                <td class="tdTitle">预计单价(元)</td>
                <td class="tdCoent">{{ stInfo.expectPrice }}</td>
              </tr>
              <tr>
                <td class="tdTitle">成本年服务费率(%)</td>
                <td class="tdCoent">{{ stInfo.rateYear }}</td>
                <td class="tdTitle">预计利润</td>
                <td class="tdCoent">{{ stInfo.expectProfits }}</td>
                <td class="tdTitle">备注说明</td>
                <td class="tdCoent">{{ stInfo.node}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col :span="18" :offset="1">
            <el-form-item label="附件：" prop="file">
              <custom-upload :fileList="stInfo.filesList"></custom-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="stInfo.shType == '1'">
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="自融资金方"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col class="newTable">
              <table width="90%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="tdTitle">公司名称</td>
                  <td class="tdCoent">{{ stInfo.shName }}</td>
                  <td class="tdTitle">性质</td>
                  <td class="tdCoent">{{ stInfo.shXz }}</td>
                  <td class="tdTitle">合作方式</td>
                  <td class="tdCoent">{{ stInfo.shHztype }}</td>
                </tr>
                <tr>
                  <td class="tdTitle">资金费率(%)</td>
                  <td class="tdCoent">{{ stInfo.shHzrate }}</td>
                  <td class="tdTitle">下游渠道</td>
                  <td class="tdCoent">{{ stInfo.shChanneltype == 1 ? '有' : '无' }}</td>
                  <td class="tdTitle">下游渠道年限</td>
                  <td class="tdCoent">{{ stInfo.shChannelyear }}</td>
                </tr>
                <tr>
                  <td class="tdTitle">结算比例</td>
                  <td class="tdCoent">{{
                    parseSettlement(stInfo.shSettlementA1,stInfo.shSettlementA2,stInfo.shSettlementA3)}}</td>
                  <td class="tdTitle">履约保证金</td>
                  <td class="tdCoent">{{ stInfo.shMargintype == 1 ? '有' : '无' }}</td>
                  <td class="tdTitle">保证金金额</td>
                  <td class="tdCoent">{{ stInfo.shMargin }}</td>
                </tr>
                <tr>
                  <td class="tdTitle">合同签署</td>
                  <td class="tdCoent">{{ stInfo.shContracttype }}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </table>
            </el-col>
          </el-row>
        </template>
        <template v-if="stInfo.platformType == '1'">
          <el-row class="head-title">
            <el-col :span="12">
              <el-form-item label="站台情况"></el-form-item>
            </el-col>
          </el-row>
          <el-row class="head-text">
            <el-col class="newTable">
              <table width="90%" cellpadding="0" cellspacing="0">
                <tr v-for="(item, index) in stInfo.ztList" :key="index">
                  <td class="tdTitle">站台名称</td>
                  <td class="tdCoent">{{ item.ztName }}</td>
                  <td class="tdTitle">站台费用</td>
                  <td class="tdCoent">{{ item.ztFee }}</td>
                  <td class="tdTitle">运费</td>
                  <td class="tdCoent">{{ item.freight }}</td>
                </tr>
              </table>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>
    <div v-if="initData.approvalType == '2'">
      <el-form label-width="20px;" label-position="left">
        <el-row class="head-text">
          <el-col :span="18" :offset="1">
            <el-form-item label="操作：">
              {{businessStateChange(form.xmState)}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col :span="10" :offset="1">
            说明：
            <el-input disabled type="textarea" :rows="5" v-model="xmNode" placeholder="" />
          </el-col>
        </el-row>

        <el-row class="head-text" style="margin-bottom: 50px">
          <el-col :span="18" :offset="1">
            <el-form-item label="附件：" prop="file">
              <custom-upload :fileList="fileList"></custom-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <!--    基础信息-->
        <business-detail-view :stIdd="form.stId" v-if="showBusinessDetail"></business-detail-view>
      </el-form>
    </div>
    <div v-if="initData.approvalType == '3'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">合同名称</td>
                <td class="tdCoent">{{form.name}}</td>
                <td class="tdTitle">合同类型</td>
                <td class="tdCoent">{{form.type}}</td>
                <td class="tdTitle">合同立项编号</td>
                <td class="tdCoent">{{form.productNo}}</td>
              </tr>
              <template v-if="form.type == '上游合同'">
                <tr>
                  <td class="tdTitle">合同编号</td>
                  <td class="tdCoent">{{form.number}}</td>
                  <td class="tdTitle">供应商</td>
                  <td class="tdCoent">{{form.supplierName}}</td>
                  <td class="tdTitle">签约日期</td>
                  <td class="tdCoent">{{parseTime(form.signingTime, "{y}-{m}-{d}")}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">货品名称</td>
                  <td class="tdCoent">{{form.goodsName}}</td>
                  <td class="tdTitle">预计吨数</td>
                  <td class="tdCoent">{{ $options.filters.weightFilter(form.expectNumber) }}</td>
                  <td class="tdTitle">保底服务费期限(天)</td>
                  <td class="tdCoent">{{form.mfsp}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">超时服务费期限(天)</td>
                  <td class="tdCoent">{{form.csmfsp}}</td>
                  <td class="tdTitle">超时服务费费率(%)</td>
                  <td class="tdCoent">{{form.csrate}}</td>
                  <td class="tdTitle">违约服务费期限(天)</td>
                  <td class="tdCoent">{{form.vymfsp}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">违约服务费费率(%)</td>
                  <td class="tdCoent">{{form.vyrate}}</td>
                  <td class="tdTitle">备注</td>
                  <td class="tdCoent" colspan="3">{{form.node}}</td>

                </tr>
              </template>
              <template v-if="form.type == '下游合同'">
                <tr>
                  <td class="tdTitle">终端客户</td>
                  <td class="tdCoent">{{form.terminalName}}</td>
                  <td class="tdTitle">签约日期</td>
                  <td class="tdCoent">{{parseTime(form.signingTime, "{y}-{m}-{d}")}}</td>
                  <td class="tdTitle">货品名称</td>
                  <td class="tdCoent">{{form.goodsName}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">基准单价(元)</td>
                  <td class="tdCoent">{{ $options.filters.moneyFilter(form.price) }}</td>
                  <td class="tdTitle">预计吨数</td>
                  <td class="tdCoent">{{ $options.filters.weightFilter(form.expectNumber) }}</td>
                  <td class="tdTitle">备注</td>
                  <td class="tdCoent">{{form.node}}</td>
                </tr>
              </template>
              <template v-if="form.type == '物流运输合同' || form.type == '物流服务合同'">
                <tr>
                  <td class="tdTitle">签约日期</td>
                  <td class="tdCoent">{{parseTime(form.signingTime, "{y}-{m}-{d}")}}</td>
                  <td class="tdTitle">{{form.type == '物流运输合同'?'运输单位':'服务单位'}}</td>
                  <td class="tdCoent">{{form.transportUnit}}</td>
                  <td class="tdTitle">运输方式</td>
                  <td class="tdCoent">{{form.transportType}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">运费单价(吨/元)</td>
                  <td class="tdCoent">{{form.transportPrice}}</td>
                  <td class="tdTitle">起运地</td>
                  <td class="tdCoent">{{form.transportStart}}</td>
                  <td class="tdTitle">目的地</td>
                  <td class="tdCoent">{{form.transportEnd}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">损耗率</td>
                  <td class="tdCoent">{{form.transportLoss}}</td>
                  <td class="tdTitle">备注</td>
                  <td class="tdCoent" colspan="3">{{form.node}}</td>
                </tr>
              </template>
              <template v-if="form.type == '其他合同'">
                <tr>
                  <td class="tdTitle">客户名称</td>
                  <td class="tdCoent">{{form.khName}}</td>
                  <td class="tdTitle">签约日期</td>
                  <td class="tdCoent">{{parseTime(form.signingTime, "{y}-{m}-{d}")}}</td>
                  <td class="tdTitle">备注</td>
                  <td class="tdCoent">{{form.node}}</td>
                </tr>
              </template>
            </table>
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
          <el-col :span="18" :offset="1">
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
    <div v-if="initData.approvalType == '4'">
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
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">业务类型</td>
                <td class="tdCoent">{{ changeBusinessType(form.businessType)}}</td>
                <td class="tdTitle">付款批次</td>
                <td class="tdCoent">{{form.away}}</td>
                <td class="tdTitle">预付方式</td>
                <td class="tdCoent">{{form.type}}</td>
              </tr>
              <tr>
                <td class="tdTitle">供应商账号</td>
                <td class="tdCoent">{{form.account}}</td>
                <td class="tdTitle">供应商开户行</td>
                <td class="tdCoent">{{form.openbank}}</td>
                <td class="tdTitle">供应商</td>
                <td class="tdCoent">{{form.supplierName}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="随车/到厂数质量信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-table ref="singleTable" :data="dataList" fit style="margin-bottom: 30px">
              <el-table-column property="name" label="货品名称" width="90">
              </el-table-column>
              <el-table-column v-if="form.away == '首次'" property="grnNumber" label="重量（吨）" width="120">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.grnNumber)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column v-if="form.away == '二次'" property="grnNumber" label="重量（吨）" width="120">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.grnNumber)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column v-if="form.away == '首次'" property="grnRz" label="热值（kcal）" width="120">
              </el-table-column>
              <el-table-column v-if="form.away == '二次'" property="gryRz" label="热值（kcal）" width="120">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式" width="90">
              </el-table-column>
              <el-table-column property="tpcName" label="物流公司" width="120">
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
        <el-row class="head-text">
          <el-col :span="4" :offset="1">
            <el-form-item label="合计重量(吨)：">
              <span style="color: red; line-height: 57px !important">{{
                $options.filters.weightFilter(form.totalWeight)
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="平均热值(kcal)：">
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
          <el-col :span="22" :offset="1">
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
        <el-row class="head-text">
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
        </el-row>
        <el-row class="head-text" style="margin-top: 30px">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle"> 预付总额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.totalPrice)}}</td>
                <td class="tdTitle">预付至</td>
                <td class="tdCoent">{{form.ato}}</td>
                <td class="tdTitle">已付金额</td>
                <td class="tdCoent" style="color: red">{{$options.filters.moneyFilter(form.prepaidPrice)}}</td>
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
                <td class="tdCoent">{{$options.filters.moneyFilter(form.kkNode)}}</td>
                <td class="tdTitle">运费金额</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.yfPrice)}}</td>
                <td class="tdTitle">付款总额</td>
                <td class="tdCoent" style="color: red">{{$options.filters.moneyFilter(form.payTprice)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">垫付保证金</td>
                <td class="tdCoent" style="color: red">{{$options.filters.moneyFilter(form.dfPrice)}}</td>
                <td class="tdTitle">实际付款金额</td>
                <td class="tdCoent" style="color: red">{{$options.filters.moneyFilter(form.actualPrice)}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
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
              <el-table-column property="" label="合同附件">
              </el-table-column>
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
      </el-form>
    </div>
    <div v-if="initData.approvalType == '5'">
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
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="应付款明细"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">最终应付款金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.yftotalPrice)}}</td>
                <td class="tdTitle">最终应付款税额(元)</td>
                <td class="tdCoent">{{ $options.filters.moneyFilter(form.yftotalPriceatx)}}</td>
                <td class="tdTitle">提单金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.yfPrice)}}</td>
              </tr>
              <tr>
                
                <td class="tdTitle">调整金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.je)}}</td>
                <td class="tdTitle">最终实际付款(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.sjPrice)}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
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
              <el-table-column property="" label="合同附件">
              </el-table-column>
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
      </el-form>
    </div>
    <div v-if="initData.approvalType == '6'">
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
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">收款类型</td>
                <td class="tdCoent">{{form.skType}}</td>
                <td class="tdTitle">收款方式</td>
                <td class="tdCoent">{{form.skWay}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="到厂数质量信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-table ref="singleTable" :data="gryList" fit style="margin-bottom: 30px">
              <el-table-column property="name" label="货品名称">
              </el-table-column>
              <el-table-column property="grnNumber" label="重量（吨）">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.grnNumber)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="gryRz" label="热值（kcal）">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式">
              </el-table-column>
              <el-table-column property="tpcName" label="物流公司">
              </el-table-column>
              <el-table-column property="carNumber" label="车数">
              </el-table-column>
              <el-table-column property="batch" label="批次">
              </el-table-column>
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
            <el-form-item label="合计重量(吨)：">
              <span style="color: red">{{
                $options.filters.weightFilter(form.tweight)
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="平均热值(kcal)：">
              <span style="color: red">{{ form.prz }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text" style="margin-top: 30px">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">收款总额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.skTprice)}}</td>
                <td class="tdTitle">税款(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.tax)}}</td>
                <td class="tdTitle">收款单价</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.skPrice)}}</td>
              </tr>
              <tr>
                <!-- <td class="tdTitle">收款日期</td>
                <td class="tdCoent">{{parseTime(form.skTime, "{y}-{m}-{d}")}}</td> -->
                <td class="tdTitle">承兑</td>
                <td class="tdCoent">{{form.accept}}</td>
                <td class="tdTitle">扣罚</td>
                <td class="tdCoent">{{form.punish}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
              <tr>
                <td class="tdTitle">其他扣罚</td>
                <td class="tdCoent">{{form.otherP}}</td>
                <td class="tdTitle">其他扣罚说明</td>
                <td class="tdCoent">{{form.otherN}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-text">
          <el-col :span="4" :offset="1">
            <el-form-item label="总计收款：">
              <span style="color: red">{{
                $options.filters.moneyFilter(form.yftotalPrice)
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="已预收金额：">
              <span style="color: red">{{
                $options.filters.moneyFilter(form.yfPrice)
                }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="实际应收金额：">
              <span style="color: red">{{
                $options.filters.moneyFilter(form.sjPrice)
                }}</span>
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
              <el-table-column property="" label="合同附件">
              </el-table-column>
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
      </el-form>
    </div>
    <div v-if="initData.approvalType == '7'">
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
              <template v-if="form.type == '上游'">
                <tr>
                  <td class="tdTitle">保证金对象</td>
                  <td class="tdCoent">{{form.type}}</td>
                  <td class="tdTitle">合同名称</td>
                  <td class="tdCoent">{{form.contractName}}</td>
                  <td class="tdTitle">供应商名称</td>
                  <td class="tdCoent">{{form.terminalName}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">保证金金额(元)</td>
                  <td class="tdCoent">{{$options.filters.moneyFilter(form.putPrice)}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </template>
              <template v-if="form.type == '下游'">
                <tr>
                  <td class="tdTitle">保证金对象</td>
                  <td class="tdCoent">{{form.type}}</td>
                  <td class="tdTitle">客户名称</td>
                  <td class="tdCoent">{{form.terminalName}}</td>
                  <td class="tdTitle">保证金金额(元)</td>
                  <td class="tdCoent">{{$options.filters.moneyFilter(form.putPrice)}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">年服务费率%</td>
                  <td class="tdCoent">{{form.stRate}}</td>
                  <td class="tdTitle">保底服务费期限(天)</td>
                  <td class="tdCoent">{{form.mfsp}}</td>
                  <td class="tdTitle">支付日期</td>
                  <td class="tdCoent">{{parseTime(form.putTime, "{y}-{m}-{d}")}}</td>
                </tr>
              </template>
            </table>
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
              <el-table-column property="" label="合同附件">
              </el-table-column>
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
          <el-col :span="18" :offset="1">
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
    <div v-if="initData.approvalType == '8'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">代办人</td>
                <td class="tdCoent">{{form.userName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">月份</td>
                <td class="tdCoent">{{form.month}}</td>
                <td class="tdTitle">数量(吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.number)}}</td>
                <td class="tdTitle">预计付款时间</td>
                <td class="tdCoent">{{parseTime(form.fkTime, "{y}-{m}-{d}")}}</td>
              </tr>
              <tr>
                <td class="tdTitle">预计付款总额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.fkPrice)}}</td>
                <td class="tdTitle">预计收款时间</td>
                <td class="tdCoent">{{parseTime(form.skTime, "{y}-{m}-{d}")}}</td>
                <td class="tdTitle">预计收款总额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.skPrice)}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="initData.approvalType == '9'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">第三方公司</td>
                <td class="tdCoent">{{form.tpcName}}</td>
                <td class="tdTitle">公司账号</td>
                <td class="tdCoent">{{form.account}}</td>
                <td class="tdTitle">公司开户行</td>
                <td class="tdCoent">{{form.openbank}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="基本信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">实付金额</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.tntPrice)}}</td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent">{{form.bz}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="服务费信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">是否产生服务费</td>
                <td class="tdCoent">{{form.serType}}</td>
                <td class="tdTitle">支付日期</td>
                <td class="tdCoent">{{parseTime(form.putTime, "{y}-{m}-{d}")}}</td>
                <td class="tdTitle">年服务费费率(%)</td>
                <td class="tdCoent">{{form.stRate}}</td>
              </tr>
              <tr>
                <td class="tdTitle">保底服务费期限(天)</td>
                <td class="tdCoent">{{form.mfsp}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
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
              <el-table-column property="" label="合同附件">
              </el-table-column>
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
    <div v-if="initData.approvalType == '10'">
      <el-form label-width="20px;" label-position="left">
        <!--    合同信息-->
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="随车数质量信息"></el-form-item>
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
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">货品名称</td>
                <td class="tdCoent">{{form.name}}</td>
                <td class="tdTitle">重量(吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.grnNumber)}}</td>
                <td class="tdTitle">发货日期</td>
                <td class="tdCoent">{{parseTime(form.deliveryTime, "{y}-{m}-{d}")}}</td>
              </tr>
              <tr>
                <td class="tdTitle">热值</td>
                <td class="tdCoent">{{form.grnRz}}</td>
                <td class="tdTitle">运输方式</td>
                <td class="tdCoent">{{form.transportType}}</td>
                <td class="tdTitle">车数</td>
                <td class="tdCoent">{{form.carNumber}}</td>
              </tr>
              <tr>
                <td class="tdTitle">物流公司</td>
                <td class="tdCoent">{{form.tpcName}}</td>
                <td class="tdTitle">批次</td>
                <td class="tdCoent">{{form.batch}}</td>
                <td class="tdTitle">基准单价(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.basePrice)}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px">
          <el-col :span="22" :offset="1">
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

        <el-row class="head-text">
          <el-col :span="5" :offset="1">
            货值单价(元)：<span v-text="$options.filters.moneyFilter(form.valuePrice)"></span>
          </el-col>
          <el-col :span="5">
            货值总价(元)：<span v-text="$options.filters.moneyFilter(form.valueTprice)"></span>
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
    <div v-if="initData.approvalType == '11'">
      <el-form label-width="20px;" label-position="left">
        <!--    出库信息-->
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="到厂数质量信息"></el-form-item>
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
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">到货日期</td>
                <td class="tdCoent">{{parseTime(form.okTime, "{y}-{m}-{d}")}}</td>
                <td class="tdTitle">热值(kcal/吨)</td>
                <td class="tdCoent">{{form.gryRz}}</td>
                <td class="tdTitle">货值单价(元)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.valuePrice)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">重量(吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.grnNumber)}}</td>
                <td class="tdTitle">货值总额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.valueTprice)}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px">
          <el-col :span="22" :offset="1">
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

        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="随车数质量信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-col :span="22" :offset="1">
            <el-table ref="singleTable" :data="grnList" fit style="margin-bottom: 30px">
              <el-table-column property="name" label="已选货品名称">
              </el-table-column>
              <el-table-column property="grnNumber" label="重量（吨）">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.grnNumber)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="grnRz" label="热值（kcal）">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式">
              </el-table-column>
              <el-table-column property="tpcName" label="物流公司">
              </el-table-column>
              <el-table-column property="carNumber" label="车数">
              </el-table-column>
              <el-table-column property="batch" label="批次">
              </el-table-column>
              <el-table-column property="deliveryTime" label="发货日期">
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
            <el-form-item label="重量差">
              <span style="color: red; line-height: 57px !important" v-text="$options.filters.weightFilter(zlc)"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="热值差" prop="averageRz">
              <span style="color: red; line-height: 57px !important" v-text="rzc"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单价差" prop="averageRz">
              <span style="color: red; line-height: 57px !important" v-text="$options.filters.moneyFilter(djc)"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="总额差" prop="averageRz">
              <span style="color: red; line-height: 57px !important" v-text="$options.filters.moneyFilter(zec)"></span>
            </el-form-item>
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
    <div v-if="initData.approvalType == '12'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">供应商名称</td>
                <td class="tdCoent">{{form.name}}</td>
                <td class="tdTitle">成立日期</td>
                <td class="tdCoent">{{form.clTime}}</td>
                <td class="tdTitle">年发运量(万吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.traffic)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">注册资本(万元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.capital)}}</td>
                <td class="tdTitle">发票面额</td>
                <td class="tdCoent">{{ form.invoiceType }}</td>
                <td class="tdTitle">企业性质</td>
                <td class="tdCoent">{{form.nature}}</td>
              </tr>
              <tr>
                <td class="tdTitle">评级</td>
                <td class="tdCoent">{{form.rating}}</td>
                <td class="tdTitle">评级说明</td>
                <td class="tdCoent">{{form.ratingDe}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="原资方信息"></el-form-item>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">原资方名称</td>
                <td class="tdCoent">{{form.sourcemName}}</td>
                <td class="tdTitle">原资方放款节点</td>
                <td class="tdCoent">{{form.sourcemLn}}</td>
                <td class="tdTitle">原资方费率</td>
                <td class="tdCoent">{{form.sourcemRate}}</td>
              </tr>
              <tr>
                <td class="tdTitle">原资方放款比例</td>
                <td class="tdCoent">{{form.sourcemLr}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-text">
          <el-col :span="18" :offset="1">
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
    <div v-if="initData.approvalType == '13'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">终端客户名称</td>
                <td class="tdCoent">{{form.name}}</td>
                <td class="tdTitle">成立日期</td>
                <td class="tdCoent">{{form.setupTime}}</td>
                <td class="tdTitle">企业性质</td>
                <td class="tdCoent">{{form.nature}}</td>
              </tr>
              <tr>
                <td class="tdTitle">年需求量(万吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.demand)}}</td>
                <td class="tdTitle">注册资本(万元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.capital)}}</td>
                <td class="tdTitle">开票结算方式</td>
                <td class="tdCoent">{{form.settlementType}}</td>
              </tr>
              <tr>
                <td class="tdTitle">结算规则</td>
                <td class="tdCoent">{{form.settlementGz}}</td>
                <td class="tdTitle">回款账期</td>
                <td class="tdCoent">{{form.paymentdays}}</td>
                <td class="tdTitle">付款方式</td>
                <td class="tdCoent">{{form.paymentType}}</td>
              </tr>
              <tr>
                <td class="tdTitle">评级</td>
                <td class="tdCoent">{{form.rating}}</td>
                <td class="tdTitle">评级说明</td>
                <td class="tdCoent">{{form.ratingDe}}</td>
                <td class="tdTitle">用户代码</td>
                <td class="tdCoent">{{form.customerCode}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>

        <el-row class="head-text">
          <el-col :span="18" :offset="1">
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
    <div v-if="initData.approvalType == '14'">
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
                <td class="tdTitle">数量(吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.number)}}</td>
                <td class="tdTitle">代办人</td>
                <td class="tdCoent">{{form.uName}}</td>
                <td class="tdTitle">终端用户</td>
                <td class="tdCoent">{{form.tName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">开票金额(元)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.price)}}</td>
                <td class="tdTitle">开票税额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.tax)}}</td>
                <td class="tdTitle">价税合计(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.totalPrice)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">收票类型</td>
                <td class="tdCoent">{{form.proportion}}</td>
              </tr>
            </table>
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
    <div v-if="initData.approvalType == '15'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">供应商</td>
                <td class="tdCoent">{{form.sName}}</td>
                <td class="tdTitle">结算金额</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.zzTprice)}}</td>
                <td class="tdTitle">验收重量(吨)</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.zzWeight)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">开票金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.kpPrice)}}</td>
                <td class="tdTitle">开票税额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.kpTax)}}</td>
                <td class="tdTitle">价税合计(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.kpTotal)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">货品单价(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.zzPrice)}}</td>
                <td class="tdTitle">货品名称</td>
                <td class="tdCoent">{{form.mc}}</td>
                <td class="tdTitle">货品型号</td>
                <td class="tdCoent">{{form.xh}}</td>
              </tr>
              <tr>
                <td class="tdTitle">代办人</td>
                <td class="tdCoent">{{form.uName}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <el-row class="head-text">
          <el-col :span="18" :offset="1">
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
    <div v-if="initData.approvalType == '16'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">申请人</td>
                <td class="tdCoent">{{form.sqName}}</td>
                <td class="tdTitle">客户经理</td>
                <td class="tdCoent">{{form.managerName}}</td>
              </tr>
              <tr>
                <td class="tdTitle">支出类型</td>
                <td class="tdCoent">{{form.type}}</td>
                <td class="tdTitle">金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.price)}}</td>
                <td class="tdTitle">支出时间</td>
                <td class="tdCoent">{{parseTime(form.payTime, "{y}-{m}-{d}")}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="initData.approvalType == '17'">
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
          <el-col class="newTable">
            <table width="90%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="tdTitle">项目名称</td>
                <td class="tdCoent">{{form.projectName}}</td>
                <td class="tdTitle">业务名称</td>
                <td class="tdCoent">{{form.stName}}</td>
                <td class="tdTitle">项目编号</td>
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">开票金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.kpPrice)}}</td>
                <td class="tdTitle">结算单价(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.jsDj)}}</td>
                <td class="tdTitle">结算煤量</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.jsMl)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">预估应收(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.ygPrice)}}</td>
                <td class="tdTitle">结算煤款(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.jsMk)}}</td>
                <td class="tdTitle">结算税款(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.jsTax)}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="initData.approvalType == '18'">
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
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">单价模式</td>
                <td class="tdCoent">{{form.unitPriceMode}}</td>
                <td class="tdTitle">单价（元/{{ priceLabel }}）</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.bidPrice)}}</td>
                <td class="tdTitle">投标数量（吨）</td>
                <td class="tdCoent">{{$options.filters.weightFilter(form.bidNumber)}}</td>
              </tr>
              <tr>
                <td class="tdTitle">投标保证金（元）</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.bidBond)}}</td>
                <td class="tdTitle">履约保证金（元）</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.performanceBond)}}</td>
                <td class="tdTitle">发站</td>
                <td class="tdCoent">{{form.sendStation}}</td>
              </tr>
              <tr>
                <td class="tdTitle">到站</td>
                <td class="tdCoent">{{form.arriveStation}}</td>
                <td class="tdTitle">投标平台</td>
                <td class="tdCoent">{{form.bidPlatform}}</td>
                <td class="tdTitle"></td>
                <td class="tdCoent"></td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <!-- <el-row class="head-text">
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
              单价（元/{{ priceLabel }}）：<span
                v-text="$options.filters.moneyFilter(form.bidPrice)"
              ></span>
            </el-col>
            <el-col :span="4" :offset="1">
              投标数量（吨）：<span
                v-text="$options.filters.weightFilter(form.bidNumber)"
              ></span>
            </el-col>
            <el-col :span="4" :offset="1">
              投标保证金（元）：<span
                v-text="$options.filters.moneyFilter(form.bidBond)"
              ></span>
            </el-col>
            <el-col :span="4" :offset="1">
              履约保证金（元）：<span
                v-text="$options.filters.moneyFilter(form.performanceBond)"
              ></span>
            </el-col>
          </el-row>

          <el-row class="head-text">
            <el-col :span="4" :offset="1">
              发站：<span v-text="form.sendStation"></span>
            </el-col>
            <el-col :span="4" :offset="1">
              到站：<span v-text="form.arriveStation"></span>
            </el-col>
          </el-row> -->

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
      </el-form>
    </div>

    <div v-if="initData.approvalType == '19'">
      <el-form label-width="20px;" label-position="left">
        <el-row class="head-title">
          <el-col :span="19">
            <el-form-item label="退款管理查看"></el-form-item>
          </el-col>
          <el-col :span="5">
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
                <td class="tdCoent">{{ form.serialNo }}</td>
              </tr>
              <tr>
                <td class="tdTitle">终端用户</td>
                <td class="tdCoent">{{form.tName}}</td>
                <td class="tdTitle">账号</td>
                <td class="tdCoent">{{form.account}}</td>
                <td class="tdTitle">开户行</td>
                <td class="tdCoent">{{form.bank}}</td>
              </tr>
              <tr>
                <td class="tdTitle">退款金额(元)</td>
                <td class="tdCoent">{{$options.filters.moneyFilter(form.moneyAmount)}}</td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent">{{form.remark}}</td>
                <td class="tdTitle">创建时间</td>
                <td class="tdCoent">{{form.createTime}}</td>
              </tr>
            </table>
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
        <!--      审批流程·-->
        <approval-process :typeId="initData.approvalType" :stId="initData.businessKey"></approval-process>
        <!--      审批信息-->
        <approval-record :typeId="initData.approvalType" :stId="initData.businessKey"></approval-record>
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
              <el-input type="textarea" autosize placeholder="请输入审批说明" :autosize="{ minRows: 5, maxRows: 8 }"
                v-model="queryParams.remark" style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button">
        <el-button type="primary" @click="pass" :disabled="isDisabled">审批通过</el-button>
        <el-button type="danger" @click="turnDown" :disabled="isDisabled">审批驳回</el-button>
      </div>
    </div>
    </el-form>
  </div>
</template>

<script>
import { getProcessData, submitTask } from "@/api/approve/index.js";
import { getToken } from "@/utils/auth";
import { getSupplier } from "@/api/project/supplier";
import { getStInfo, getStupdate, projectInfo } from "@/api/project/st";
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
import { getRefund } from "@/api/project/refund";
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
import businessDetailView from '@/views/project/st/look/businessDetailView'
export default {
  props: ["mode", "initData"],
  components: {
    businessDetailView
  },
  data() {
    return {
      queryParams: {},
      processData: [],
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
      isDisabled: false,
      projectInfo: {},
      stInfo: {},
      showBusinessDetail: false
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
      console.log(this.initData);
    },
    getList() {
      console.log("A1:" + this.queryParams.id);
      // getProcessData(this.initData.id).then((res) => {
      //   this.processData = res.data;
      // });
      let typeId = this.initData.approvalType;
      let stId = this.initData.businessKey;
      if (typeId == "20") {
        projectInfo(stId).then((res) => {
          this.projectInfo = res.data;
        });
      } else if (typeId == "1") {
        getStInfo(stId).then(res => {
          this.stInfo = res.data
          projectInfo(res.data.projectId).then(res => {
            this.projectId = res.data.projectId
            this.projectInfo = res.data
          })
        })
      } else if (typeId == "2") {
        getStupdate(stId).then((response) => {
          this.form = response.data
          this.fileList = response.data.fileList;
          this.xmNode = response.data.xmNode;
          this.showBusinessDetail = true
        });
      } else if (typeId == "3") {
        getContract(stId).then((response) => {
          this.form = response.data;
          this.fileList = response.data.fileList;
          this.bcfileList = response.data.filebcList;
          this.form.type = this.contractTypeFormat(this.form);
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
          this.fileList = response.data.fileList;
        });
      } else if (typeId == "11") {
        getGry(stId).then((response) => {
          this.form = response.data;
          console.log(this.form);
          this.grnList = response.data.grnList;
          this.fileList = response.data.fileList;
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
      } else if (typeId == "19") {
        getRefund(stId).then((response) => {
          this.form = response.data;
          this.fileList = this.form.fileList || [];
        });
      }
    },
    pass() {
      this.isDisabled = true;
      if (this.queryParams.remark == undefined) {
        this.queryParams.remark = "无";
      }
      submitTask({
        taskId: this.initData.taskId,
        opt: "pass",
        opinion: this.queryParams.remark,
      }).then(() => {
        this.$messageContent.message("S000003", ["审批"]);
        this.getList();
        this.$emit("popOk");
        this.isDisabled = false;
      });
    },
    turnDown() {
      this.isDisabled = true;
      if (this.queryParams.remark == undefined) {
        this.queryParams.remark = "无";
      }
      submitTask({
        taskId: this.initData.taskId,
        opt: "refuse",
        opinion: this.queryParams.remark,
      }).then((res) => {
        this.$messageContent.message("S000003", ["驳回"]);
        this.getList();
        // this.getMyUpcomings();
        this.$emit("popOk");
        this.isDisabled = false;
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
    changeBusinessType(e) {
      if (e == "cud") {
        return "储备业务垫付运费";
      } else if ((e == "cu")) {
        return "储备业务不垫付运费";
      } else if ((e == "dcd")) {
        return "到厂业务垫付运费";
      } else if ((e == "dc")) {
        return "到厂业务不垫付运费";
      } else if ((e == "cbd")) {
        return "车板业务垫付运费";
      } else if ((e == "cb")) {
        return "车板业务不垫付运费";
      }
    },
    changeTransType(e) {
      if (e == "qy") {
        return "汽运";
      } else if ((e == "hy")) {
        return "火运";
      } else if ((e == "ly")) {
        return "公铁联运";
      }
    },
      changeChargemType(e) {
        if (e == '1') {
          return '年息'
        } else if (e == '2') {
          return '固定差价'
        } else if (e == '3') {
          return '年息+固定差价'
        }
      },
    businessStateChange(xmState) {
      if (xmState == '0') {
        return "提交中";
      } else if (xmState == '1') {
        return "进行中";
      } else if (xmState == '2') {
        return "异常";
      } else if (xmState == '3') {
        return "结束";
      } else if (xmState == '4') {
        return "完成";
      }
    },
    moFormat(row, column) {
      if (row.moType == "1") {
        return "未开票";
      } else {
        return "已开票";
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
    parseSettlement(rate1, rate2, rate3) {
      let text = ''
      if (rate1) {
        text = text + rate1;
      }
      if (rate2) {
        text = text + '-' + rate2;
      }
      if (rate3) {
        text = text + '-' + rate3;
      }
      return text;
    }
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
