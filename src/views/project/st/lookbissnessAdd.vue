<template>
    <div style="padding: 20px">
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
        <!--      审批流程·-->
        <approval-process v-if="stId" :typeId="1" :stId="stId"></approval-process>
        <!--      审批信息-->
        <approval-record v-if="stId" :typeId="1" :stId="stId"></approval-record>
    </div>
</template>
<script>
import {
    projectInfo,
    getStInfo
} from "@/api/project/st";
export default {
    data() {
        return {
            projectInfo: {},
            stId: null,
            stInfo: {}
        }
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
    },
    methods: {
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
    }
}
</script>
