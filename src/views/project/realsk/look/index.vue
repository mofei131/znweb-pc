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
  line-height:30px;
  margin-top:0px
}

.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
.el-textarea.is-disabled .el-textarea__inner{
  background-color:#FFF; /* 设置背景颜色为黑色 */
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
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>项目名称：</div><span v-text="form.projectName"></span>
          </div>
          <div style="display:flex">
            <div>业务名称：</div><span v-text="form.stName"></span>
          </div>
          <div style="display:flex">
            <div>项目编号：</div><span v-text="form.serialNo"></span>
          </div>
          <div style="display:flex">
            <div>开票金额（价税合计）：</div><span v-text="$options.filters.moneyFilter(form.kpPrice)"></span>
          </div>
          <div style="display:flex">
            <div>开票吨数：</div><span v-text="$options.filters.weightFilter(form.kpNumber)"></span>
          </div>
          <div style="display:flex">
            <div>结算单总金额：</div><span v-text="$options.filters.moneyFilter(form.jstPrice)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>终端客户：</div><span v-text="form.tName"></span>
          </div>
          <div style="display:flex">
            <div>热值(Kcal/吨)：</div><span v-text="form.rz"></span>
          </div>
          <div style="display:flex">
            <div>结算单价：</div><span v-text="$options.filters.moneyFilter(form.jsDj)"></span>
          </div>
          <div style="display:flex">
            <div>结算煤量：</div><span v-text="$options.filters.weightFilter(form.jsMl)"></span>
          </div>
          <div style="display:flex">
            <div>结算煤款：</div><span v-text="$options.filters.moneyFilter(form.jsMk)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>结算税款(元)：</div><span v-text="$options.filters.moneyFilter(form.jsTax)"></span>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px;">
        <el-col :span="20" :offset="1">
          <el-table :data="tabledatas" fit style="margin-bottom: 22px;">
            <el-table-column label="水分(%)">
              <template slot-scope="scope">
                <span v-text="form.coalSf"></span>
              </template>
            </el-table-column>
            <el-table-column label="内水(%)">
              <template>
                <span v-text="form.coalNs" />
              </template>
            </el-table-column>
            <el-table-column label="灰份(%)">
              <el-table-column label="Aad">
                <template prop="coalAad">
                  <span v-text="form.coalAad" />
                </template>
              </el-table-column>
              <el-table-column label="ad">
                <template prop="coalAd">
                  <span v-text="form.coalAd" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="挥发份(%)">
              <el-table-column label="Vda">
                <template prop="coalVda">
                  <span v-text="form.coalVda" />
                </template>
              </el-table-column>
              <el-table-column label="Vdaf">
                <template prop="coalVdae">
                  <span v-text="form.coalVdae" />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="灰熔点(℃)">
              <template prop="coalHrd">
                <span v-text="form.coalHrd" />
              </template>
            </el-table-column>
            <el-table-column label="固定碳(%)">
              <template prop="coalGdt">
                <span v-text="form.coalGdt" />
              </template>
            </el-table-column>
            <el-table-column label="含硫量(%)">
              <template prop="coalHll">
                <span v-text="form.coalHll" />
              </template>
            </el-table-column>
            <el-table-column label="热值(%)">
              <el-table-column label="Qgr,ad">
                <template prop="coalQgrad">
                  <span v-text="form.coalQgrad" />
                </template>
              </el-table-column>
              <el-table-column label="Qnt,ar">
                <template prop="coalQntar">
                  <span v-text="form.coalQntar" />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="10" :offset="1">
          备注：
          <el-input disabled type="textarea" :rows="5" v-model="form.node" placeholder="" />
        </el-col>
      </el-row>

      <!--      审批流程·-->
      <approval-process :typeId="17" :stId="realskId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="17" :stId="realskId"></approval-record>

    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div slot="" class="dialog-footer" style="text-align: right;margin-bottom: 50px;margin-right: 50px;">
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {getContract} from "@/api/project/contract";
import {getToken} from "@/utils/auth";
import {getCplan} from "@/api/project/cplan";
import {getDp} from "@/api/project/dp";
import {getProcessDataByStId} from "@/api/approve";
import { getRealsk } from '@/api/project/realsk'

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
      tabledatas: [
        {show:true}
      ],
      // 表单参数
      form: {},
      realskId:''
    };
  },
  created() {
    const realskId = this.$route.params && this.$route.params.realskId;
    this.realskId=realskId
    getRealsk(realskId).then(response => {
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
