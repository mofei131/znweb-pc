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
          <el-form-item label="项目信息"></el-form-item>
        </el-col>
        <!--        <el-col :span="4">-->
        <!--          <span style="color: #FF0000;">{{stateF(form.state)}}</span>-->
        <!--        </el-col>-->
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
              <td class="tdTitle">第三方公司</td>
              <td class="tdCoent">{{form.tpcName}}</td>
              <td class="tdTitle">收票日期</td>
              <td class="tdCoent">{{form.sticketTime}}</td>
            </tr>
          </table>
        </el-col>
        </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex"><div>项目名称：</div><span v-text="form.stName"></span></div>
          <div style="display:flex"><div>项目编号：</div><span v-text="form.projectNumber"></span></div>
        </el-col>
      </el-row> -->

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="基本信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">不含税金额合计(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.tntPrice)}}</td>
              <td class="tdTitle">补税金额(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.bsPrice)}}</td>
              <td class="tdTitle">价税合计(元)</td>
              <td class="tdCoent">{{$options.filters.moneyFilter(form.jstPrice)}}</td>
            </tr>
            <tr>
              <td class="tdTitle">收票状态</td>
              <td class="tdCoent">{{form.spState}}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
        </el-row>
      <!-- <el-row class="head-text">
        <el-col :span="7" :offset="1">
          <div style="display:flex"><div>不含税金额合计：</div><span
            v-text="$options.filters.moneyFilter(form.tntPrice)"
          ></span></div>
          <div style="display:flex"><div>补税金额：</div><span
            v-text="$options.filters.moneyFilter(form.bsPrice)"
          ></span></div>
          <div style="display:flex"><div>价税合计：</div><span
            v-text="$options.filters.moneyFilter(form.jstPrice)"
          ></span></div>
          <div style="display:flex"><div>收票状态：</div><span v-text="form.spState"></span></div>
        </el-col>
      </el-row> -->

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="追加费用"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table
            ref="wlsingleTable"
            :data="form.wldetailsList"
            style="width: 90%; margin-bottom: 30px"
          >
            <el-table-column property="number" label="发票号">
            </el-table-column>
            <el-table-column property="wlType" label="费用名称">
            </el-table-column>
            <el-table-column property="ntPrice" label="不含税金额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.ntPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="tax" label="税率(%)"> </el-table-column>
            <el-table-column property="taxPrice" label="税额(元)">
              <template slot-scope="scope">
                {{
                  Number(scope.row.ntPrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!--      合同信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table
            ref="singleTable"
            :data="contract"
            style="width: 90%; margin-bottom: 30px"
          >
            <el-table-column property="name" label="合同名称">
            </el-table-column>
            <el-table-column
              property="type"
              label="合同类型"
              :formatter="contractTypeFormat"
            >
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
            <el-table-column property="" label="合同附件"> </el-table-column>
            <el-table-column property="" label="补充合同附件">
            </el-table-column>
            <el-table-column property="" label="双章合同附件">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="toContract(scope.row.contractId)"
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="20" :offset="1">
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
    </el-form>
    <el-row>
      <el-col :offset="1" :span="20">
        <div
          slot=""
          class="dialog-footer"
          style="text-align: right; margin-bottom: 50px; margin-right: 50px"
        >
          <el-button size="small" type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getContract } from "@/api/project/contract";
import { getToken } from "@/utils/auth";
import { getApayment } from "@/api/project/apayment";
import { getSk } from "@/api/project/sk";
import { getLpayment } from "@/api/project/lpayment";
import { getProcessDataByStId } from "@/api/approve";
import { getContractList } from "@/api/project/all";
import { getWldetails } from "@/api/project/wldetails";

export default {
  name: "contractLook",
  data() {
    return {
      //审批集合
      stateList: [
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "没有问题，同意审批",
          state: "已通过",
        },
        {
          deptName: "风控部",
          roleName: "风控部经理",
          userName: "张三",
          content: "",
          state: "未审批",
        },
      ],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],

      //出库集合
      gryList: [],
      // 表单参数
      form: {},

      //合同集合
      contract: [],
    };
  },
  created() {
    const wldetailsId = this.$route.params && this.$route.params.wldetailsId;
    getWldetails(wldetailsId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
      this.form.wldetailsList = response.data.wldetailsList;

      let data = { stId: this.form.stId };
      //合同
      getContractList(data).then((response) => {
        this.contract = response.rows;
      });
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

    //跳转合同详情
    toContract(contractId) {
      this.$router.push("/contract/look/" + contractId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if (row.type == "1") {
        return "上游合同";
      } else if (row.type == "2") {
        return "下游合同";
      } else if (row.type == "3") {
        return "物流运输合同";
      } else if (row.type == "4") {
        return "物流服务合同";
      } else if (row.type == "5") {
        return "其他合同";
      }
    },
  },
};
</script>
