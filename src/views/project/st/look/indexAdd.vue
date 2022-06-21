<template>
  <div>
    <div style="padding:20px">
      <el-descriptions title="项目信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">立项类型</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">项目编号</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">项目名称</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">立项编号</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">供应商</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">代办人</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">终端客户</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务经理</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务类型</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务实控人</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">收费模式</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">货运方式</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">年服务费率(%)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">固定差价(元)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">备注说明</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">附件</template>kooriookami
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top:20px" title="业务基础信息" :column="3" border>
        <el-descriptions-item>
          <template slot="label">业务名称</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">业务金额(万元)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">结算比例</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">履约保证金</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">履约保证金金额(万元)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">服务周期</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">预计重量(吨)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">预计单价(元)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">成本年服务费率(%)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">预计利润</template>kooriookami
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top:20px" title="自融资金方" :column="3" border>
        <el-descriptions-item>
          <template slot="label">公司名称</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">性质</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">合作方式</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">资金费率(%)</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">下游渠道</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">下游渠道年限</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">结算比例</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">履约保证金</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">保证金金额</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">合同签署</template>kooriookami
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top:20px" title="站台情况" :column="3" border>
        <el-descriptions-item>
          <template slot="label">站台名称</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">站台费用</template>kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">运费</template>kooriookami
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="padding:20px">
      <div>投标申请</div>
      <bid-apply></bid-apply>
    </div>
    <div style="padding:20px">
      <div>合同信息</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>奖惩设置</div>
      <rewardsp></rewardsp>
    </div>
    <div style="padding:20px">
      <div>随车数质量</div>
    </div>
    <div style="padding:20px">
      <div>到厂数质量</div>
    </div>
    <div style="padding:20px">
      <div>保证金管理</div>
      <margin></margin>
    </div>
    <div style="padding:20px">
      <div>物流付款</div>
      <lpayment></lpayment>
    </div>
    <div style="padding:20px">
      <div>物流收票</div>
      <wldetails></wldetails>
    </div>
    <div style="padding:20px">
      <div>预付款信息</div>
      <apayment></apayment>
    </div>
    <div style="padding:20px">
      <div>最终付款</div>
      <fpayment></fpayment>
    </div>
    <div style="padding:20px">
      <div>预估收款</div>
      <estimated-receipts></estimated-receipts>
    </div>
    <div style="padding:20px">
      <div>实际收款</div>
      <realsk></realsk>
    </div>
    <div style="padding:20px">
      <div>退款管理</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>财务首付款明细</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>收票管理</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>开票管理</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>服务费明细</div>
      <contract></contract>
    </div>
    <div style="padding:20px">
      <div>固定差价明细</div>
      <contract></contract>
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
export default {
  name: "look",
  data() {
    return {
    }
  },
  components:{
    bidApply,
    contract,
    rewardsp,
    margin,
    lpayment,
    wldetails,
    apayment,
    fpayment,
    estimatedReceipts,
    realsk
  }
}
</script>
