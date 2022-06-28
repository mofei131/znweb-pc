<template>
  <div @scroll="a" style="display:flex;background-color: #F6F7FB;padding:10px;">
    <div style="width:85%;background-color: #ffffff;border-radius: 10px;margin-right:10px">
      <!-- <div style="display:flex;justify-content:end;margin-top:20px;margin-right:20px">
      <el-button @click="exportInfo" type="primary" size="small">导出</el-button>
    </div> -->
      <div style="padding:20px;">
        <el-descriptions title="项目信息" :column="3" border>
          <el-descriptions-item>
            <template slot="label">立项类型</template>{{ projectInfo.projectType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目编号</template>{{ projectInfo.serialNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目名称</template>{{ projectInfo.projectName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">立项编号</template>{{ projectInfo.projectNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">供应商</template>{{ projectInfo.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">代办人</template>{{ projectInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">终端客户</template>{{ projectInfo.terminalName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务经理</template>{{ projectInfo.serviceManagerName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务类型</template>{{ changeBusinessType(projectInfo.businessType) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务实控人</template>{{ projectInfo.actualControlName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">收费模式</template>{{ projectInfo.chargemType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">货运方式</template>{{ changeTransType(projectInfo.freightMode) }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">年服务费率(%)</template>{{ projectInfo.chargemNx }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">固定差价(元)</template>{{ projectInfo.chargemGd }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">备注说明</template>{{ projectInfo.node }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">附件</template>
            <custom-upload :fileList="projectInfo.filesList"></custom-upload>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions style="margin-top:20px" title="业务基础信息" :column="3" border>
          <el-descriptions-item>
            <template slot="label">业务名称</template>{{ stInfo.stName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">业务金额(万元)</template>{{ stInfo.stAmount }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">结算比例</template>{{ stInfo.settlementPA1 ? stInfo.settlementPA1 + '-' +
                stInfo.settlementPA2 + '-' +
                stInfo.settlementPA3 : ''
            }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">履约保证金</template>{{ stInfo.marginType == 1 ? '有' : '无' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">履约保证金金额(万元)</template>{{ stInfo.margin }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">服务周期</template>{{ stInfo.cycleStart + '-' + stInfo.cycleEnd }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">预计重量(吨)</template>{{ stInfo.expectWeight }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">预计单价(元)</template>{{ stInfo.expectPrice }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">成本年服务费率(%)</template>{{ stInfo.rateYear }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">预计利润</template>{{ stInfo.expectProfits }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions style="margin-top:20px" title="自融资金方" :column="3" border>
          <el-descriptions-item>
            <template slot="label">公司名称</template>{{ stInfo.shName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">性质</template>{{ stInfo.shXz }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">合作方式</template>{{ stInfo.shHztype }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">资金费率(%)</template>{{ stInfo.shHzrate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">下游渠道</template>{{ stInfo.shChanneltype == 1 ? '有' : '无' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">下游渠道年限</template>{{ stInfo.shChannelyear }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">结算比例</template>{{ stInfo.shSettlementA1 ? stInfo.shSettlementA1 + '-' +
                stInfo.shSettlementA2 + '-' +
                stInfo.shSettlementA3 : ''
            }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">履约保证金</template>{{ stInfo.shMargintype == 1 ? '有' : '无' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">保证金金额</template>{{ stInfo.shMargin }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">合同签署</template>{{ stInfo.shContracttype }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-for="(item, index) in stInfo.ztList" :key="index" style="margin-top:20px"
          :title="'站台' + (index + 1)" :column="3" border>
          <el-descriptions-item>
            <template slot="label">站台名称</template>{{ item.ztName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">站台费用</template>{{ item.ztFee }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">运费</template>{{ item.freight }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-if="stId && projectId">
        <div style="padding:20px">
          <div id="bid">投标申请</div>
          <bid-apply :stIdd="stId" :projectIdd="projectId"></bid-apply>
        </div>
        <div style="padding:20px">
          <div id="contract">合同信息</div>
          <contract :stIdd="stId" :projectIdd="projectId"></contract>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="rewardsp">奖惩设置</div>
          <rewardsp :stIdd="stId" :projectIdd="projectId"></rewardsp>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="grn">随车数质量</div>
          <grn :stIdd="stId" :projectIdd="projectId"></grn>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="gry">到厂数质量</div>
          <gry :stIdd="stId" :projectIdd="projectId"></gry>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="margin">保证金管理</div>
          <margin :stIdd="stId" :projectId="projectId"></margin>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="lpayment">物流付款</div>
          <lpayment :stId="stId" :projectIdd="projectId"></lpayment>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="wldetails">物流收票</div>
          <wldetails :stIdd="stId" :projectIdd="projectId"></wldetails>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="apayment">预付款信息</div>
          <apayment :stIdd="stId" :projectIdd="projectId"></apayment>
        </div>
        <div style="padding:20px">
          <div id="fpayment">最终付款</div>
          <fpayment :stIdd="stId" :projectIdd="projectId"></fpayment>
        </div>
        <div v-if="projectInfo.businessType != 'cu' && projectInfo.businessType != 'cud'" style="padding:20px">
          <div id="estimated">预估收款</div>
          <estimated-receipts :stIdd="stId" :projectIdd="projectId"></estimated-receipts>
        </div>
        <div style="padding:20px">
          <div id="realsk">实际收款</div>
          <realsk :stIdd="stId" :projectIdd="projectId"></realsk>
        </div>
        <div style="padding:20px">
          <div id="refund">退款管理</div>
          <refund :stIdd="stId" :projectIdd="projectId"></refund>
        </div>
        <div style="padding:20px">
          <div id="sp">收票管理</div>
          <sp :stIdd="stId" :projectIdd="projectId"></sp>
        </div>
        <div style="padding:20px">
          <div id="kp">开票管理</div>
          <kp :stIdd="stId" :projectIdd="projectId"></kp>
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
      <div class="maodian" style="position: fixed;top:94px;right:0;width:12.8%;height:588px;background-color: #ffffff;border-radius: 10px;text-align: center;line-height:30px;font-size: 13px">
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
import bidApply from '@/views/project/st/components/bidApply'
import contract from '@/views/project/st/components/contract'
import rewardsp from '@/views/project/st/components/rewardsp'
import margin from '@/views/project/st/components/margin'
import lpayment from '@/views/project/st/components/lpayment'
import wldetails from '@/views/project/st/components/wldetails'
import apayment from '@/views/project/st/components/apayment'
import fpayment from '@/views/project/st/components/fpayment'
import estimatedReceipts from '@/views/project/st/components/estimatedReceipts'
import realsk from '@/views/project/st/components/realsk'
import refund from '@/views/project/st/components/refund'
import sfdetails from '@/views/project/st/components/sfdetails'
import serviceDetails from '@/views/project/st/components/serviceDetails'
import grn from '@/views/project/st/components/grn'
import gry from '@/views/project/st/components/gry'
import sp from '@/views/project/st/components/sp'
import kp from '@/views/project/st/components/kp'
import { exportBusiness, getStInfo, projectInfo } from "@/api/project/st";
export default {
  name: "look",
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
    estimatedReceipts,
    realsk,
    refund,
    sfdetails,
    serviceDetails,
    grn,
    gry,
    kp,
    sp
  },
  mounted() {
    this.stId = this.$route.fullPath.match(/\d+/)[0]
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
    exportInfo() {
      exportBusiness({ stId: this.stId }).then(res => {

      })
    }
  }
}
</script>
