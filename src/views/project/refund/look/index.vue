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
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff; /* 设置背景颜色为黑色 */
}
</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="退款管理查看"></el-form-item>
        </el-col>
        <el-col :span="5">
          <span>{{ form.state }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">创建时间</td>
              <td class="tdCoent">{{form.createTime}}</td>
              <td class="tdTitle">业务名称</td>
              <td class="tdCoent">{{form.projectName}}</td>
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{form.stName}}</td>
            </tr>
            <tr>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.serialNo}}</td>
              <td class="tdTitle">终端用户</td>
              <td class="tdCoent">{{form.tName}}</td>
              <td class="tdTitle">账号</td>
              <td class="tdCoent">{{form.account}}</td>
            </tr>
            <tr>
              <td class="tdTitle">退款金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.moneyAmount)}}</td>
              <td class="tdTitle">备注</td>
              <td class="tdCoent">{{form.remark}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>创建时间：</div><span v-text="form.createTime"></span>
          </div>
          <div style="display:flex">
            <div>业务名称：</div><span v-text="form.projectName"></span>
          </div>
          <div style="display:flex">
            <div>项目名称：</div><span v-text="form.stName"></span>
          </div>
          <div style="display:flex">
            <div>项目编号：</div><span v-text="form.serialNo"></span>
          </div>
          <div style="display:flex">
            <div>终端用户：</div><span v-text="form.tName"></span>
          </div>
          <div style="display:flex">
            <div>账号：</div><span v-text="form.account"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>退款金额(元)：</div><span v-text="$options.filters.moneyFilter(form.moneyAmount)"></span>
          </div>
          <div style="display:flex">
            <div>备注：</div><span v-text="form.remark"></span>
          </div>
        </el-col>
      </el-row> -->
      <el-row class="head-text">
        <el-col :span="20" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file">
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      审批流程·-->
      <approval-process :typeId="19" :stId="refundId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="19" :stId="refundId"></approval-record>
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
import { getProcessDataByStId } from "@/api/approve";
import { getRefund } from "@/api/project/refund";
import CustomUpload from "@/views/components/customUpload";
export default {
  name: "bidApplyLook",
  components: {
    CustomUpload,
  },
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
      refundId: "",
    };
  },
  computed: {},
  created() {
    const refundId = this.$route.params && this.$route.params.refundId;
    this.refundId = refundId;
    getRefund(refundId).then((response) => {
      this.form = response.data;
      this.fileList = this.form.fileList || [];
    });
  },
  methods: {
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  },
};
</script>
