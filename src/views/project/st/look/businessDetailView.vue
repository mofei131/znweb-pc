<template>
  <div @scroll="a" style="display:flex;background-color: #F6F7FB;padding:10px;">
    <div style="width:85%;background-color: #ffffff;border-radius: 10px;margin-right:10px">
      <div style="padding:20px;">
        <el-form>
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
                <tr>
                  <td class="tdTitle">年服务费率(%)</td>
                  <td class="tdCoent">{{projectInfo.chargemNx}}</td>
                  <td class="tdTitle">固定差价(元)</td>
                  <td class="tdCoent">{{projectInfo.chargemGd}}</td>
                  <td class="tdTitle">备注说明</td>
                  <td class="tdCoent">{{projectInfo.node}}</td>
                </tr>
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
                  <td class="tdCoent">{{stInfo.stName}}</td>
                  <td class="tdTitle">业务金额(万元)</td>
                  <td class="tdCoent">{{stInfo.stAmount}}</td>
                  <td class="tdTitle">结算比例(%)</td>
                  <td class="tdCoent">{{stInfo.settlementPA1 ? stInfo.settlementPA1 + '-' +
                    stInfo.settlementPA2 + '-' +
                    stInfo.settlementPA3 : ''}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">履约保证金</td>
                  <td class="tdCoent">{{stInfo.marginType == 1 ? '有' : '无'}}</td>
                  <td class="tdTitle">履约保证金金额(万元)</td>
                  <td class="tdCoent">{{stInfo.margin}}</td>
                  <td class="tdTitle">服务周期</td>
                  <td class="tdCoent">{{stInfo.cycleStart + '-' + stInfo.cycleEnd}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">预计重量(吨)</td>
                  <td class="tdCoent">{{stInfo.expectWeight}}</td>
                  <td class="tdTitle">预计单价(元)</td>
                  <td class="tdCoent">{{stInfo.expectPrice}}</td>
                  <td class="tdTitle">成本年服务费率(%)</td>
                  <td class="tdCoent">{{stInfo.rateYear}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">预计利润</td>
                  <td class="tdCoent">{{stInfo.expectProfits}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </table>
            </el-col>
          </el-row>
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
                  <td class="tdCoent">{{stInfo.shName}}</td>
                  <td class="tdTitle">性质</td>
                  <td class="tdCoent">{{stInfo.shXz}}</td>
                  <td class="tdTitle">合作方式</td>
                  <td class="tdCoent">{{stInfo.shHztype}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">资金费率(%)</td>
                  <td class="tdCoent">{{stInfo.shHzrate}}</td>
                  <td class="tdTitle">下游渠道</td>
                  <td class="tdCoent">{{stInfo.shChanneltype == 1 ? '有' : '无'}}</td>
                  <td class="tdTitle">下游渠道年限</td>
                  <td class="tdCoent">{{stInfo.shChannelyear}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">结算比例(%)</td>
                  <td class="tdCoent">{{stInfo.shSettlementA1 ? stInfo.shSettlementA1 + '-' +
                    stInfo.shSettlementA2 + '-' +
                    stInfo.shSettlementA3 : ''}}</td>
                  <td class="tdTitle">履约保证金</td>
                  <td class="tdCoent">{{stInfo.shMargintype == 1 ? '有' : '无'}}</td>
                  <td class="tdTitle">保证金金额</td>
                  <td class="tdCoent">{{stInfo.shMargin}}</td>
                </tr>
                <tr>
                  <td class="tdTitle">合同签署</td>
                  <td class="tdCoent">{{stInfo.shContracttype}}</td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                  <td class="tdTitle"></td>
                  <td class="tdCoent"></td>
                </tr>
              </table>
            </el-col>
          </el-row>
          <div v-for="(item, index) in stInfo.ztList" :key="index" style="margin-top:20px">
            <el-row class="head-title">
              <el-col :span="12">
                <el-form-item :label="'站台' + (index + 1)"></el-form-item>
              </el-col>
            </el-row>
            <el-row class="head-text">
              <el-col class="newTable">
                <table width="80%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="tdTitle">站台名称</td>
                    <td class="tdCoent">{{item.ztName}}</td>
                    <td class="tdTitle">站台费用</td>
                    <td class="tdCoent">{{item.ztFee}}</td>
                    <td class="tdTitle">运费</td>
                    <td class="tdCoent">{{item.freight}}</td>
                  </tr>
                </table>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div v-if="stId && projectId" class="chilSty">
        <div style="padding:20px">
          <div id="bid">投标申请</div>
          <bid-apply :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></bid-apply>
        </div>
        <div style="padding:20px">
          <div id="contract">合同信息</div>
          <contract :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></contract>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="rewardsp">奖惩设置</div>
          <rewardsp :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></rewardsp>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="grn">随车数质量</div>
          <grn :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></grn>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="gry">到厂数质量</div>
          <gry :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></gry>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="margin">保证金管理</div>
          <margin :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></margin>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="lpayment">物流付款</div>
          <lpayment :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></lpayment>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="wldetails">物流收票</div>
          <wldetails :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></wldetails>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="apayment">预付款信息</div>
          <apayment :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></apayment>
        </div>
        <div style="padding:20px">
          <div id="fpayment">最终付款</div>
          <fpayment :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></fpayment>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="estimated">预估收款</div>
          <sk :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></sk>
        </div>
        <div style="padding:20px">
          <div id="realsk">实际收款</div>
          <realsk :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></realsk>
        </div>
        <div style="padding:20px">
          <div id="refund">退款管理</div>
          <refund :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></refund>
        </div>
        <div style="padding:20px">
          <div id="sp">收票管理</div>
          <sticket :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></sticket>
        </div>
        <div style="padding:20px">
          <div id="kp">开票管理</div>
          <kp :stIdd="stId" :projectIdd="projectId" :isQuote="true" :editable="false"></kp>
        </div>
        <div style="padding:20px">
          <div id="sfdetails">财务收付款明细</div>
          <sfdetails :stIdd="stId" :projectIdd="projectId"></sfdetails>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="service">服务费明细</div>
          <service-details :stIdd="stId" :projectIdd="projectId"></service-details>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div>固定差价明细</div>
        </div>
      </div>
    </div>
    <div class="maodian"
      style="position: fixed;top:94px;right:0;width:12.8%;height:588px;background-color: #ffffff;border-radius: 10px;text-align: center;line-height:30px;font-size: 13px">
      <div ref="bid" @click="jump('bid')">投标申请</div>
      <div ref="contract" @click="jump('contract')">合同管理</div>
      <div ref="rewardsp" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('rewardsp')">奖惩设置</div>
      <div ref="grn" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" @click="jump('grn')">
        随车数质量</div>
      <div ref="gry" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" @click="jump('gry')">
        到厂数质量</div>
      <div ref="margin" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('margin')">保证金管理</div>
      <div ref="lpayment" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('lpayment')">物流付款</div>
      <div ref="wldetails" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('wldetails')">物流收票</div>
      <div ref="apayment" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('apayment')">预付款管理</div>
      <div ref="fpayment" @click="jump('fpayment')">最终付款</div>
      <div ref="estimated" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('estimated')">预估收款</div>
      <div ref="realsk" @click="jump('realsk')">实际收款</div>
      <div ref="refund" @click="jump('refund')">退款管理</div>
      <div ref="sp" @click="jump('sp')">收票管理</div>
      <div ref="kp" @click="jump('kp')">开票管理</div>
      <div ref="sfdetails" @click="jump('sfdetails')">财务收付款明细</div>
      <div ref="service" v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'"
        @click="jump('service')">服务费明细</div>
      <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'">固定差价明细</div>
    </div>
  </div>
</template>

<script>
import bidApply from '@/views/project/bidApply'
import contract from '@/views/project/contract'
import rewardsp from '@/views/project/rewardsp'
import margin from '@/views/project/margin'
import lpayment from '@/views/project/lpayment'
import wldetails from '@/views/project/wldetails'
import apayment from '@/views/project/apayment'
import fpayment from '@/views/project/fpayment'
import sk from '@/views/project/sk'
import realsk from '@/views/project/realsk'
import refund from '@/views/project/refund'
import sfdetails from '@/views/project/st/components/sfdetails'
import serviceDetails from '@/views/project/st/components/serviceDetails'
import grn from '@/views/project/grn'
import gry from '@/views/project/gry'
import sticket from '@/views/project/sticket'
import kp from '@/views/project/kp'
import { exportBusiness, getStInfo, projectInfo } from "@/api/project/st";
export default {
  name: "BusinessDetailView",
  props: {
    "stIdd": {
      type: String
    }
  },
  data() {
    return {
      stId: null,
      stInfo: null,
      projectInfo: null
    }
  },
  components: {
    bidApply,
    contract,
    rewardsp,
    margin,
    lpayment,
    wldetails,
    apayment,
    fpayment,
    sk,
    realsk,
    refund,
    sfdetails,
    serviceDetails,
    grn,
    gry,
    kp,
    sticket
  },
  mounted() {
    this.stId = this.$route.fullPath.match(/\d+/)[0] || this.stIdd
    getStInfo(this.stId).then(res => {
      this.stInfo = res.data
      projectInfo(res.data.projectId).then(res => {
        this.projectId = res.data.projectId
        this.projectInfo = res.data
      })
    })
    window.addEventListener("scroll", this.handleScroll,true);
  },
  methods: {
    a(e){
      console.log(e)
    },
    handleScroll(){
      let top=document.documentElement.scrollTop-83
      if(top>document.querySelector("#bid").offsetTop&&top<document.querySelector("#contract").offsetTop){
        this.changeColor('bid')
      }else if(top>document.querySelector("#contract").offsetTop&&top<document.querySelector("#rewardsp").offsetTop){
        this.changeColor('contract')
      }else if(top>document.querySelector("#rewardsp").offsetTop&&top<document.querySelector("#grn").offsetTop){
        this.changeColor('rewardsp')
      }
      else if(top>document.querySelector("#grn").offsetTop&&top<document.querySelector("#gry").offsetTop){
        this.changeColor('grn')
      }
      else if(top>document.querySelector("#gry").offsetTop&&top<document.querySelector("#margin").offsetTop){
        this.changeColor('gry')
      }
      else if(top>document.querySelector("#margin").offsetTop&&top<document.querySelector("#lpayment").offsetTop){
        this.changeColor('margin')
      }
      else if(top>document.querySelector("#lpayment").offsetTop&&top<document.querySelector("#wldetails").offsetTop){
        this.changeColor('lpayment')
      }
      else if(top>document.querySelector("#wldetails").offsetTop&&top<document.querySelector("#apayment").offsetTop){
        this.changeColor('wldetails')
      }
      else if(top>document.querySelector("#apayment").offsetTop&&top<document.querySelector("#fpayment").offsetTop){
        this.changeColor('apayment')
      }
      else if(top>document.querySelector("#fpayment").offsetTop&&top<document.querySelector("#estimated").offsetTop){
        this.changeColor('fpayment')
      }
      else if(top>document.querySelector("#estimated").offsetTop&&top<document.querySelector("#realsk").offsetTop){
        this.changeColor('estimated')
      }
      else if(top>document.querySelector("#realsk").offsetTop&&top<document.querySelector("#refund").offsetTop){
        this.changeColor('realsk')
      }
      else if(top>document.querySelector("#refund").offsetTop&&top<document.querySelector("#sp").offsetTop){
        this.changeColor('refund')
      }
      else if(top>document.querySelector("#sp").offsetTop&&top<document.querySelector("#kp").offsetTop){
        this.changeColor('sp')
      }
      else if(top>document.querySelector("#kp").offsetTop&&top<document.querySelector("#sfdetails").offsetTop){
        this.changeColor('kp')
      }
      else if(top>document.querySelector("#sfdetails").offsetTop&&top>document.querySelector("#service").offsetTop){
        this.changeColor('sfdetails')
      }
      else if(top>document.querySelector("#service").offsetTop){
        this.changeColor('service')
      }
    },
    jump(e) {
      document.querySelector("#" + e).scrollIntoView(true)
      this.$refs.bid.style.color = "#333333";
      this.$refs.contract.style.color = "#333333";
      this.$refs.rewardsp.style.color = "#333333";
      this.$refs.margin.style.color = "#333333";
      this.$refs.lpayment.style.color = "#333333";
      this.$refs.wldetails.style.color = "#333333";
      this.$refs.apayment.style.color = "#333333";
      this.$refs.fpayment.style.color = "#333333";
      this.$refs.estimated.style.color = "#333333";
      this.$refs.realsk.style.color = "#333333";
      this.$refs.refund.style.color = "#333333";
      this.$refs.sfdetails.style.color = "#333333";
      this.$refs.service.style.color = "#333333";
      this.$refs.grn.style.color = "#333333";
      this.$refs.gry.style.color = "#333333";
      this.$refs.kp.style.color = "#333333";
      this.$refs.sp.style.color = "#333333";
      this.$refs[e].style.color = "#406BFF";
    },
    changeColor(e){
      this.$refs.bid.style.color = "#333333";
      this.$refs.contract.style.color = "#333333";
      this.$refs.rewardsp.style.color = "#333333";
      this.$refs.margin.style.color = "#333333";
      this.$refs.lpayment.style.color = "#333333";
      this.$refs.wldetails.style.color = "#333333";
      this.$refs.apayment.style.color = "#333333";
      this.$refs.fpayment.style.color = "#333333";
      this.$refs.estimated.style.color = "#333333";
      this.$refs.realsk.style.color = "#333333";
      this.$refs.refund.style.color = "#333333";
      this.$refs.sfdetails.style.color = "#333333";
      this.$refs.service.style.color = "#333333";
      this.$refs.grn.style.color = "#333333";
      this.$refs.gry.style.color = "#333333";
      this.$refs.kp.style.color = "#333333";
      this.$refs.sp.style.color = "#333333";
      this.$refs[e].style.color = "#406BFF";
    },
    changeBusinessType(e) {
      if (e == 'cud') {
        return '储备业务垫付运费'
      } else if (e = 'cu') {
        return '储备业务不垫付运费'
      } else if (e = 'dcd') {
        return '到厂业务垫付运费'
      } else if (e = 'dc') {
        return '到厂业务不垫付运费'
      } else if (e = 'cbd') {
        return '车板业务垫付运费'
      } else if (e = 'cb') {
        return '车板业务不垫付运费'
      }
    },
    changeTransType(e) {
      if (e == 'qy') {
        return '汽运'
      } else if (e = 'hy') {
        return '火运'
      } else if (e = 'dcd') {
        return '公铁联运'
      }
    },
    changeChargemType(e) {
      if (e == '1') {
        return '年息'
      } else if (e = '2') {
        return '固定差价'
      } else if (e = '3') {
        return '年息+固定差价'
      }
    },
    exportInfo() {
      exportBusiness({ stId: this.stId }).then(res => {

      })
    }
  }
}
</script>
