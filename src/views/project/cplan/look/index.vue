<style>
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
  line-height: 53px;
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}


</style>
<template>
  <div>

    <el-form label-width="20px;" label-position="left">
      <!--    合同信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="基本信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #FF0000;">{{stateF(form.state)}}</span>
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
              <td class="tdCoent">{{ form.serialNo }}</td>
            </tr>
            <tr>
              <td class="tdTitle">代办人</td>
              <td class="tdCoent">{{form.userName}}</td>
            </tr>
            <tr>
              <td class="tdTitle">月份</td>
              <td class="tdCoent">{{form.month}}</td>
              <td class="tdTitle">数量(吨)</td>
              <td class="tdCoent">{{$options.filters.weightFilter(form.number)}}</td>
              <td class="tdTitle">预计付款时间</td>
              <td class="tdCoent">{{parseTime(form.fkTime, '{y}-{m}-{d}')}}</td>
            </tr>
            <tr>
              <td class="tdTitle">预计付款总额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.fkPrice)}}</td>
              <td class="tdTitle">预计收款时间</td>
              <td class="tdCoent">{{parseTime(form.skTime, '{y}-{m}-{d}')}}</td>
              <td class="tdTitle">预计收款总额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.skPrice)}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4" :offset="1">
          项目编号：<span v-text="form.number"></span>
        </el-col>
        <el-col :span="4">
          代办人：<span v-text="form.userName"></span>
        </el-col>
        <el-col :span="4">
          月份：<span v-text="form.month"></span>
        </el-col>
        <el-col :span="4">
          数量(吨)：<span v-text="$options.filters.weightFilter(form.number)"></span>
        </el-col>
        <el-col :span="4">
          预计付款时间：<span>{{parseTime(form.fkTime, '{y}-{m}-{d}') }}</span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          预计付款总额(元)：<span v-text="$options.filters.moneyFilter(form.fkPrice)"></span>
        </el-col>
        <el-col :span="4">
          预计收款时间：<span>{{parseTime(form.skTime, '{y}-{m}-{d}') }}</span>
        </el-col>
        <el-col :span="4">
          预计收款总额(元)：<span v-text="$options.filters.moneyFilter(form.skPrice)"></span>
        </el-col>
      </el-row> -->


      <!--      审批流程·-->
      <approval-process :typeId="8" :stId="cplanId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="8" :stId="cplanId"></approval-record>

    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getContract} from "@/api/project/contract";
import {getToken} from "@/utils/auth";
import {getCplan} from "@/api/project/cplan";
import {getProcessDataByStId} from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //合同集合
      contract:[],

      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList:[],
      //补充附件集合
      bcfileList:[],

      // 表单参数
      form: {},
      cplanId:''
    };
  },
  created() {
    const cplanId = this.$route.params && this.$route.params.cplanId;
    this.cplanId=cplanId
    getCplan(cplanId).then(response => {
      this.form=response.data
    })
  },
  methods: {
    cancel(){
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },

    //点击触发
    handlePreview(file) {
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove(file, filelist) {
      this.form.fileList=[];
      for(let i=0;i<filelist.length;i++){
        if (filelist[i].response != undefined) {
          let art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
          this.form.fileList.push(art);
        }else {
          let art = {"name": filelist[i].name, "url": filelist[i].url};
          this.form.fileList.push(art);
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList=[];
        for(var i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index,1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },

  }
};
</script>
