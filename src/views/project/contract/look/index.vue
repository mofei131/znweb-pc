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
      <!--    合同信息-->
      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="合同信息"></el-form-item>
        </el-col>
        <el-col :span="4">
          <span style="color: #ff0000">{{ stateF(form.state) }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          项目名称：<span v-text="form.stName"></span>
        </el-col>
        <el-col :span="4"> 合同名称：<span v-text="form.name"></span> </el-col>
        <el-col :span="4"> 合同类型：<span v-text="form.type"></span> </el-col>
        <el-col :span="4">
          合同编号：<span v-text="form.number"></span>
        </el-col>
        <el-col :span="4">
          签约日期：<span>{{
            parseTime(form.signingTime, "{y}-{m}-{d}")
          }}</span>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1" v-if="form.type == '上游合同'">
          供应商：<span v-text="form.supplierName"></span>
        </el-col>
        <el-col :span="4" :offset="1" v-if="form.type == '下游合同'">
          终端客户：<span v-text="form.terminalName"></span>
        </el-col>
        <el-col :span="4" :offset="1" v-if="form.type == '其他合同'">
          客户名称：<span v-text="form.khName"></span>
        </el-col>
        <el-col :span="4">
          立项编号：<span v-text="form.productNo"></span>
        </el-col>
        <el-col :span="4">
          项目编号：<span v-text="form.projectNumber"></span>
        </el-col>
      </el-row>

      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          货品名称：<span v-text="form.goodsName"></span>
        </el-col>
        <el-col :span="4" v-if="form.type == '下游合同'">
          预计吨数：<span
            v-text="$options.filters.weightFilter(form.expectNumber)"
          ></span>
        </el-col>
        <el-col :span="4" v-if="form.type == '下游合同'">
          基准单价：<span
            v-text="$options.filters.moneyFilter(form.price)"
          ></span>
        </el-col>
        <el-col :span="4" v-if="form.type == '上游合同'">
          保底服务费期限：<span v-text="form.mfsp"></span>
        </el-col>
      </el-row>

      <el-row class="head-text" v-if="form.type == '上游合同'">
        <el-col :span="4" :offset="1">
          超时服务费期限：<span v-text="form.csmfsp"></span>
        </el-col>
        <el-col :span="4">
          超时服务费费率：<span v-text="form.csrate"></span>
        </el-col>
        <el-col :span="4">
          违约服务费期限：<span v-text="form.vymfsp"></span>
        </el-col>
        <el-col :span="4">
          违约服务费费率：<span v-text="form.vyrate"></span>
        </el-col>
      </el-row>

      <el-row
        class="head-text"
        v-if="form.type == '物流运输合同' || form.type == '物流服务合同'"
      >
        <el-col :span="4" :offset="1">
          运输单位：<span v-text="form.transportUnit"></span>
        </el-col>
        <el-col :span="4">
          运输方式：<span v-text="form.transportType"></span>
        </el-col>
        <el-col :span="4">
          起运地：<span v-text="form.transportStart"></span>
        </el-col>
        <el-col :span="4">
          目的地：<span v-text="form.transportEnd"></span>
        </el-col>
      </el-row>
      <el-row
        class="head-text"
        v-if="form.type == '物流运输合同' || form.type == '物流服务合同'"
      >
        <el-col :span="4" :offset="1">
          运费单价(吨/元)：<span
            v-text="$options.filters.moneyFilter(form.transportPrice)"
          ></span>
        </el-col>
        <el-col :span="4">
          损耗率：<span v-text="form.transportLoss"></span>
        </el-col>
      </el-row>

      <el-row class="head-text" v-if="form.type == '其他合同'">
        <el-col :span="4" :offset="1">
          备注：<el-input
            disabled
            type="textarea"
            :rows="5"
            v-model="form.node"
            placeholder=""
          />
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

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="补充合同"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="6" :offset="1">
          补充说明：<span v-text="form.content"></span>
        </el-col>
      </el-row>
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
              :file-list="bcfileList">
            </el-upload> -->
            <custom-upload :fileList="bcfileList"></custom-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row class="head-text">-->
      <!--        <el-col :span="12">-->
      <!--          <el-form-item label="附件" prop="file">-->
      <!--            <el-upload-->
      <!--              class="upload-demo"-->
      <!--              :action="url"-->
      <!--              :headers="headers"-->
      <!--              multiple-->
      <!--              :limit="5"-->
      <!--              :file-list="fileList">-->
      <!--              <el-button size="small" type="primary" v-if="isLook!=3">点击上传</el-button>-->
      <!--              &lt;!&ndash;                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>&ndash;&gt;-->
      <!--            </el-upload>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <!--      审批流程·-->
      <approval-process :typeId="3" :stId="contractId"></approval-process>

      <!--      审批信息-->
      <el-row class="head-title">
        <el-col :span="12">
          <el-form-item label="审批记录"></el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :offset="1">
          <el-table
            ref="singleTable"
            :data="stateList"
            style="width: 80%; margin-bottom: 30px"
          >
            <el-table-column property="deptName" label="部门">
            </el-table-column>
            <el-table-column property="nickName" label="审批人">
            </el-table-column>
            <el-table-column property="approveTime" label="审批时间">
            </el-table-column>
            <el-table-column property="processValue" label="审批说明">
            </el-table-column>
            <el-table-column property="status" label="审批状态">
              <template slot-scope="scope">
                {{ scope.row.status == 0 ? "驳回" : "通过" }}
              </template>
            </el-table-column>
          </el-table>
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
          <el-button type="info" @click="cancel">关 闭</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getContract } from "@/api/project/contract";
import { getToken } from "@/utils/auth";
import { getProcessDataByStId } from "@/api/approve";

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
      //合同集合
      contract: [],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],
      //补充附件集合
      bcfileList: [],

      // 表单参数
      form: {},
      contractId: "",
    };
  },
  created() {
    const contractId = this.$route.params && this.$route.params.contractId;
    this.contractId = contractId;
    getContract(contractId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
      this.bcfileList = response.data.filebcList;
      if (this.form.type == "1") {
        this.form.type = "上游合同";
      } else if (this.form.type == "2") {
        this.form.type = "下游合同";
      } else if (this.form.type == "3") {
        this.form.type = "物流运输合同";
      } else if (this.form.type == "4") {
        this.form.type = "物流服务合同";
      } else if (this.form.type == "5") {
        this.form.type = "其他合同";
      }
    });
    getProcessDataByStId("3", contractId).then((res) => {
      this.stateList = res.data;
    });
  },
  methods: {
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
  },
};
</script>
