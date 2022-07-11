<template>
  <div style="padding: 20px">
    <el-form label-width="20px;" label-position="left">
      <!-- <el-descriptions title="项目信息" :column="2" border>
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
        <template slot="label">收费模式</template>{{ changeChargemType(projectInfo.chargemType) }}
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
    </el-descriptions> -->
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
      <!--      审批流程·-->
      <approval-process v-if="stId" :typeId="20" :stId="stId"></approval-process>
      <!--      审批信息-->
      <approval-record v-if="stId" :typeId="20" :stId="stId"></approval-record>
    </el-form>
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
        console.log('看这里', e)
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
