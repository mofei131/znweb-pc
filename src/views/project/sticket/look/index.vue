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


</style>
<template>
  <div>
    <el-form label-width="20px;" label-position="left">
      <!--    出库信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="项目信息"></el-form-item>
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
              <td class="tdCoent">{{form.stName}}</td>
              <td class="tdTitle">收票类型</td>
              <td class="tdCoent">{{form.proportion}}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{form.projectNumber}}</td>
            </tr>
            <tr>
              <td class="tdTitle">数量（吨）</td>
              <td class="tdCoent">{{$options.filters.weightFilter(form.number)}}</td>
              <td class="tdTitle">代办人</td>
              <td class="tdCoent">{{form.uName}}</td>
              <td class="tdTitle">终端用户</td>
              <td class="tdCoent">{{form.tName}}</td>
            </tr>
            <tr>
              <td class="tdTitle">开票金额(元)</td>
              <td class="tdCoent">{{$options.filters.weightFilter(form.tax)}}</td>
              <td class="tdTitle">开票税额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.tax)}}</td>
              <td class="tdTitle">价税合计(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.totalPrice)}}</td>
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
            <div>项目编号：</div><span v-text="form.projectNumber"></span>
          </div>
          <div style="display:flex">
            <div>收票类型：</div><span v-text="form.proportion"></span>
          </div>
          <div style="display:flex">
            <div>数量（吨）：</div><span v-text="$options.filters.weightFilter(form.number)"></span>
          </div>
          <div style="display:flex">
            <div>代办人：</div><span v-text="form.uName"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>终端用户：</div><span v-text="form.tName"></span>
          </div>
          <div style="display:flex">
            <div>数量(吨)：</div><span v-text="$options.filters.weightFilter(form.number)"></span>
          </div>
          <div style="display:flex">
            <div>开票金额(元)：</div><span v-text="$options.filters.moneyFilter(form.price)"></span>
          </div>
          <div style="display:flex">
            <div>开票税额(元)：</div><span v-text="$options.filters.moneyFilter(form.tax)"></span>
          </div>
          <div style="display:flex">
            <div>价税合计(元)：</div><span v-text="$options.filters.moneyFilter(form.totalPrice)"></span>
          </div>
        </el-col>
      </el-row> -->

      <!--      合同信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table ref="singleTable" :data="contract" style="width: 90%;margin-bottom: 30px;">
            <el-table-column property="name" label="合同名称">
            </el-table-column>
            <el-table-column property="type" label="合同类型" :formatter="contractTypeFormat">
            </el-table-column>
            <el-table-column property="expectNumber" label="货品重量(吨)">
              <template slot-scope="scope">
                {{
                Number(scope.row.expectNumber)
                .toFixed(3)
                .toString()
                .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="" label="合同附件">
            </el-table-column>
            <el-table-column property="" label="补充合同附件">
            </el-table-column>
            <el-table-column property="" label="双章合同附件">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="toContract(scope.row.contractId)" type="text" size="small">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="12" :offset="1">
          <el-form-item class="head-text" label="附件：" prop="file">
            <!-- <el-upload
              disabled
              :action="url"
              :headers="headers"
              class="upload-hidden"
              :on-preview="handlePreview"
              list-type="text"
              :file-list="fileList">
            </el-upload> -->
            <custom-upload :fileList="fileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>


      <!--      审批流程·-->
      <approval-process :typeId="14" :stId="sticketId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="14" :stId="sticketId"></approval-record>

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

import {getSticket} from "@/api/project/sticket";
import {getProcessDataByStId} from "@/api/approve";
import {getToken} from "@/utils/auth";
import {getContractList} from "@/api/project/all";

export default {
  name: "contractLook",
  data() {
    return {
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList:[],

      //合同集合
      contract:[],

      //ocr集合
      ocrList:[],
      // 表单参数
      form: {},
      sticketId:''
    };
  },
  created() {
    const sticketId = this.$route.params && this.$route.params.sticketId;
    this.sticketId=sticketId
    getSticket(sticketId).then(response => {
      this.form=response.data
      this.fileList = this.form.fileList;
      this.ocrList=this.form.ocrList
      this.form.sy=this.form.ysPrice-this.form.totalPrice

      let data={"stId": this.form.stId}
      //合同
      getContractList(data).then(response =>{
        this.contract=response.rows
      })
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
    },
    handleExceed(files, fileList) {
    },
    beforeRemove(file, fileList) {
    },
    uploadSuccess(res, file, filelist) {
    },
    uploadError(err, file, filelist) {
    },

    //跳转合同详情
    toContract(contractId){
      this.$router.push("/contract/look/" + contractId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if(row.type=='1'){
        return "上游合同"
      }else if(row.type=='2'){
        return "下游合同"
      }else if(row.type=='3'){
        return "物流运输合同"
      }else if(row.type=='4'){
        return "物流服务合同"
      }else if(row.type=='5'){
        return "其他合同"
      }
    },
  }
};
</script>
