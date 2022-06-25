<template>
    <div style="padding: 20px">
        <el-descriptions title="项目信息" :column="2" border>
          <el-descriptions-item>
            <template slot="label">立项类型</template>{{ projectInfo.projectType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">立项编号</template>{{ projectInfo.projectNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目名称</template>{{ projectInfo.projectName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">项目编号</template>{{ projectInfo.serialNo }}
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
          <el-descriptions-item></el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">附件</template>
            <custom-upload :fileList="projectInfo.filesList"></custom-upload>
          </el-descriptions-item>
        </el-descriptions>
        <!--      审批流程·-->
      <approval-process v-if="stId" :typeId="20" :stId="stId"></approval-process>
      <!--      审批信息-->
      <approval-record v-if="stId" :typeId="20" :stId="stId"></approval-record>
      </div>
</template>
<script>
import {
  projectInfo,
} from "@/api/project/st";
export default {
    data(){
        return {
            projectInfo:{},
            stId:null
        }
    },
    mounted(){
        this.stId = this.$route.fullPath.match(/\d+/)[0]
        projectInfo(this.stId).then(res => {
            this.projectInfo = res.data
        })
    },
    methods:{
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
