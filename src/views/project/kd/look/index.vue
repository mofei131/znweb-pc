<style scoped>
.head-title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  margin-top: 30px;
  margin-left: 20px;
}
.head-text{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
}
.head-text span{
  display: block;
  width:220px;
  margin-top:0px
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}


</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    快递信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="快递信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">名称</td>
              <td class="tdCoent">{{form.name}}</td>
              <td class="tdTitle">快递名称</td>
              <td class="tdCoent">{{form.kdName}}</td>
              <td class="tdTitle">快递单号</td>
              <td class="tdCoent">{{form.kdNumber}}</td>
            </tr>
            <tr>
              <td class="tdTitle">快递物品</td>
              <td class="tdCoent">{{form.kdWp}}</td>
              <td class="tdTitle">发出时间</td>
              <td class="tdCoent">{{parseTime(form.kdTime, '{y}-{m}-{d}')}}</td>
              <td class="tdTitle">备注说明</td>
              <td class="tdCoent">{{form.node}}</td>
            </tr>
          </table>
        </el-col>
        </el-row>
     <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex"><div>名称：</div><span v-text="form.name"></span></div>
          <div style="display:flex"><div>快递名称：</div><span v-text="form.kdName"></span></div>
          <div style="display:flex"><div>快递单号：</div><span v-text="form.kdNumber"></span></div>
          <div style="display:flex"><div>快递物品：</div><span v-text="form.kdWp"></span></div>
          <div style="display:flex"><div>发出时间：</div><span>{{parseTime(form.kdTime, '{y}-{m}-{d}') }}</span></div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex"><div>备注说明：</div><span v-text="form.node"></span></div>
        </el-col>
      </el-row> -->

    </el-form>
    <el-row style="margin-top: 20px;">
      <el-col :offset="1" :span="20">
        <div slot=""  class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getKd} from "@/api/project/kd";

export default {
  name: "contractLook",
  data() {
    return {
      // 表单参数
      form: {},
    };
  },
  created() {
    const kdId = this.$route.params && this.$route.params.kdId;
    getKd(kdId).then(response => {
      this.form=response.data
      this.fileList = this.form.fileList;
    })
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  }
};
</script>
