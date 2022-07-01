<style scoped>
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
  line-height: 30px;
}
.head-text span{
  display: block;
  width:220px;
  line-height:30px;
  margin-top:0px
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
              <td class="tdCoent">{{form.serialNo}}</td>
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
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>项目名称：</div><span v-text="form.stName"></span>
          </div>
          <div style="display:flex">
            <div>项目编号：</div><span v-text="form.number"></span>
          </div>
          <div style="display:flex">
            <div>代办人：</div><span v-text="form.uName"></span>
          </div>
          <div style="display:flex">
            <div>供应商：</div><span v-text="form.sName"></span>
          </div>
          <div style="display:flex">
            <div>结算金额：</div><span v-text="$options.filters.moneyFilter(form.zzTprice)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>验收重量(吨)：</div><span v-text="$options.filters.weightFilter(form.zzWeight)"></span>
          </div>
          <div style="display:flex">
            <div>开票金额(元)：</div><span v-text="$options.filters.moneyFilter(form.kpPrice)"></span>
          </div>
          <div style="display:flex">
            <div>开票税额(元)：</div><span v-text="$options.filters.moneyFilter(form.kpTax)"></span>
          </div>
          <div style="display:flex">
            <div>价税合计(元)：</div><span v-text="$options.filters.moneyFilter(form.kpTotal)"></span>
          </div>
          <div style="display:flex">
            <div>货品单价(元)：</div><span v-text="$options.filters.moneyFilter(form.zzPrice)"></span>
          </div>
        </el-col>
        <el-col :span="4" :offset="1">
          <div style="display:flex">
            <div style="width:100px">货品名称：</div><span v-text="form.mc"></span>
          </div>
          <div style="display:flex">
            <div style="width:100px">货品型号：</div><span v-text="form.xh"></span>
          </div>
        </el-col>
      </el-row> -->
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

      <!--      审批流程·-->
      <approval-process :typeId="15" :stId="kpId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="15" :stId="kpId"></approval-record>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right; margin-bottom: 50px; margin-right: 50px">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getSupplier } from "@/api/project/supplier";
import { getTerminal } from "@/api/project/terminal";
import { getKp } from "@/api/project/kp";
import { getProcessDataByStId } from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],

      // 表单参数
      form: {},
      kpId: "",
    };
  },
  created() {
    const kpId = this.$route.params && this.$route.params.kpId;
    this.kpId = kpId;
    getKp(kpId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
    });
  },
  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
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
  },
};
</script>
