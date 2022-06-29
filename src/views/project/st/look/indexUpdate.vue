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
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff; /* 设置背景颜色为黑色 */
}
</style>
<template>
  <div>
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

      <!--    基础信息-->
      <business-detail-view :stIdd="stId"></business-detail-view>
      <div style="width:88%">
        <!--      审批流程·-->
        <approval-process :typeId="2" :stId="stupdateId"></approval-process>
        <!--      审批信息-->
        <approval-record :typeId="2" :stId="stupdateId"></approval-record>
      </div>
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right; margin-bottom: 50px; margin-right: 50px">
          <el-button type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSt, getStupdate } from "@/api/project/st";
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
import { getToken } from "@/utils/auth";
import { getProcessDataByStId } from "@/api/approve";
import businessDetailView from '@/views/project/st/look/businessDetailView'

export default {
  name: "look",
  components: {
    businessDetailView
  },
  data() {
    return {
      // 集合
      xxList: [
        { stName: "项目A" },
        { stName: "项目B" },
        { stName: "项目C" },
        { stName: "项目D" },
      ],
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

      //审批集合
      stateList: [],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],
      //说明
      xmNode: "",
      // 表单参数
      form: {},
      gryLr: 0.0,
      gryNumber: 0,
      stId: '',
      stupdateId:''
    };
  },
  created() {
    const stId = this.$route.query && this.$route.query.stId;
    const stupdateId = this.$route.query && this.$route.query.stupdateId;
    this.stId = stId;
    this.stupdateId = stupdateId;
    getStupdate(stupdateId).then((response) => {
      // this.form=response.data
      this.form.state = response.data.state;
      this.form.xmState = response.data.xmState;
      this.fileList = response.data.fileList;
      this.xmNode = response.data.xmNode;
    });
  },
  methods: {
    // 取消按钮
    // cancel() {
    //   this.$emit("cancel")
    // },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    //跳转合同详情
    toContract(contractId) {
      this.$router.push("/contract/look/" + contractId);
    },
    //跳转入库详情
    toGrn(grnId) {
      this.$router.push("/grn/look/" + grnId);
    },
    //跳转出库详情
    toGry(gryId) {
      this.$router.push("/gry/look/" + gryId);
    },
    //跳转出库编辑
    toGryAou(gryId) {
      this.$router.push("/gry/aou/" + gryId);
    },
    //跳转预付款详情
    toApayment(apyamentId) {
      this.$router.push("/apayment/look/" + apyamentId);
    },
    //跳转收款详情
    toSk(skId) {
      this.$router.push("/sk/look/" + skId);
    },
    //跳转物流付款详情
    toLpayment(lpaymentId) {
      this.$router.push("/lpayment/look/" + lpaymentId);
    },
    //跳转物流付款详情
    toFpayment(fpaymentId) {
      this.$router.push("/fpayment/look/" + fpaymentId);
    },
    //跳转发票详情
    toSticket(sticketId) {
      this.$router.push("/sticket/look/" + sticketId);
    },
    //跳转发票详情
    toKp(kpId) {
      this.$router.push("/kp/look/" + kpId);
    },

    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if (row.type == "1") {
        return "委托销售合同";
      } else if (row.type == "2") {
        return "煤炭采购合同";
      } else if (row.type == "3") {
        return "物流运输合同";
      } else if (row.type == "4") {
        return "物流服务合同";
      } else if (row.type == "5") {
        return "其他合同";
      }
    },
    // 开票状态字典翻译
    moFormat(row, column) {
      if (row.moType == "1") {
        return "未开票";
      } else {
        return "已开票";
      }
    },

    //点击触发
    handlePreview(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove(file, filelist) {
      this.form.fileList = [];
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          let art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form.fileList.push(art);
        } else {
          let art = { name: filelist[i].name, url: filelist[i].url };
          this.form.fileList.push(art);
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      if (res.code == "200") {
        this.form.fileList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = { name: name, url: url };
            this.form.fileList.push(art);
          } else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = { name: name, url: url };
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
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
  },
};
</script>
