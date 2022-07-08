<template>
    <div style="padding: 20px">
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
                            <td class="tdCoent">{{ stInfo.stName }}</td>
                            <td class="tdTitle">项目编号</td>
                            <td class="tdCoent">{{ stInfo.serialNo }}</td>
                            <td class="tdTitle">业务金额(万元)</td>
                            <td class="tdCoent">{{ stInfo.stAmount }}</td>
                        </tr>
                        <tr>
                            <td class="tdTitle">结算比例</td>
                            <td class="tdCoent">{{ stInfo.settlementPA1 ? stInfo.settlementPA1 + '-' +
                                stInfo.settlementPA2 + '-' +
                                stInfo.settlementPA3 : '' }}</td>
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
                                <td class="tdCoent">{{ stInfo.shSettlementA1 ? stInfo.shSettlementA1 + '-' +
                                    stInfo.shSettlementA2 + '-' +
                                    stInfo.shSettlementA3 : '' }}</td>
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
            <!--      审批流程·-->
            <approval-process v-if="stId" :typeId="1" :stId="stId"></approval-process>
            <!--      审批信息-->
            <approval-record v-if="stId" :typeId="1" :stId="stId"></approval-record>
        </el-form>
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
            } else if (e == 'cu') {
                return '储备业务不垫付运费'
            } else if (e == 'dcd') {
                return '到厂业务垫付运费'
            } else if (e == 'dc') {
                return '到厂业务不垫付运费'
            } else if (e == 'cbd') {
                return '车板业务垫付运费'
            } else if (e == 'cb') {
                return '车板业务不垫付运费'
            }
        },
        changeTransType(e) {
            if (e == 'qy') {
                return '汽运'
            } else if (e == 'hy') {
                return '火运'
            } else if (e == 'ly') {
                return '公铁联运'
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
    }
}
</script>
