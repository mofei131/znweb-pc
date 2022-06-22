<template>
  <div>
    <div style="display:flex;justify-content:end;margin-top:20px;margin-right:20px">
      <el-button @click="exportInfo" type="primary" size="small">导出</el-button>
    </div>
    <div style="padding:20px">
      <el-descriptions title="项目信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">立项类型</template>{{ projectInfo.projectType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">项目编号</template>{{ projectInfo.projectNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">项目名称</template>{{ projectInfo.projectName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">立项编号</template>{{ projectInfo.serialNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">供应商</template>{{ projectInfo.supplierName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">代办人</template>{{ projectInfo.userName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">终端客户</template>{{ projectInfo.tName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务经理</template>{{ projectInfo.serviceManagerName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务类型</template>{{ projectInfo.businessType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务实控人</template>{{ projectInfo.actualControlName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">收费模式</template>{{ projectInfo.chargemType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">货运方式</template>{{ projectInfo.freightMode }}
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
          <template slot="label">结算比例</template>{{ stInfo.settlementPA1 + '-' + stInfo.settlementPA2 + '-' +
              stInfo.settlementPA3
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
          <template slot="label">结算比例</template>{{ stInfo.shSettlementA1 + '-' + stInfo.shSettlementA2 + '-' +
              stInfo.shSettlementA3
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
      <el-descriptions v-for="(item, index) in stInfo.ztList" :key="index" style="margin-top:20px" :title="'站台' + (index+1)"
        :column="3" border>
        <el-descriptions-item>
          <template slot="label">站台名称</template>{{ item.ztId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">站台费用</template>{{ item.ztFee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">运费</template>{{ item.freight }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="padding:20px">
      <div>投标申请</div>
      <bid-apply :stId="stId" :projectId="projectId"></bid-apply>
    </div>
    <div style="padding:20px">
      <div>合同信息</div>
      <contract :stId="stId" :projectId="projectId"></contract>
    </div>
    <div style="padding:20px">
      <div>奖惩设置</div>
      <rewardsp :stId="stId" :projectId="projectId"></rewardsp>
    </div>
    <div style="padding:20px">
      <div>随车数质量</div>
      <grn :stId="stId" :projectId="projectId"></grn>
    </div>
    <div style="padding:20px">
      <div>到厂数质量</div>
      <gry :stId="stId" :projectId="projectId"></gry>
    </div>
    <div style="padding:20px">
      <div>保证金管理</div>
      <margin :stId="stId" :projectId="projectId"></margin>
    </div>
    <div style="padding:20px">
      <div>物流付款</div>
      <lpayment :stId="stId" :projectId="projectId"></lpayment>
    </div>
    <div style="padding:20px">
      <div>物流收票</div>
      <wldetails :stId="stId" :projectId="projectId"></wldetails>
    </div>
    <div style="padding:20px">
      <div>预付款信息</div>
      <apayment :stId="stId" :projectId="projectId"></apayment>
    </div>
    <div style="padding:20px">
      <div>最终付款</div>
      <fpayment :stId="stId" :projectId="projectId"></fpayment>
    </div>
    <div style="padding:20px">
      <div>预估收款</div>
      <estimated-receipts :stId="stId" :projectId="projectId"></estimated-receipts>
    </div>
    <div style="padding:20px">
      <div>实际收款</div>
      <realsk :stId="stId" :projectId="projectId"></realsk>
    </div>
    <div style="padding:20px">
      <div>退款管理</div>
      <refund :stId="stId" :projectId="projectId"></refund>
    </div>
    <div style="padding:20px">
      <div>财务收付款明细</div>
      <sfdetails :stId="stId" :projectId="projectId"></sfdetails>
    </div>
    <div style="padding:20px">
      <div>收票管理</div>
      <sp :stId="stId" :projectId="projectId"></sp>
    </div>
    <div style="padding:20px">
      <div>开票管理</div>
      <kp :stId="stId" :projectId="projectId"></kp>
    </div>
    <div style="padding:20px">
      <div>服务费明细</div>
      <service-details :stId="stId" :projectId="projectId"></service-details>
    </div>
    <div style="padding:20px">
      <div>固定差价明细</div>
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
import estimatedReceipts from '@/views/project/st/components/fpayment'
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
      stId: '',
      stInfo: '',
      projectInfo: ''
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
        this.projectId=res.data.projectId
        this.projectInfo = res.data
      })
    })
  },
  methods: {
    exportInfo() {
      exportBusiness({ stId: this.stId }).then(res => {

      })
    }
  }
}
</script>
