<style scoped lang="scss">
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
.head-text span {
  display: block;
  width: 220px;
  line-height: 30px;
  margin-top: 0px;
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
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">项目名称</td>
              <td class="tdCoent">{{ form.projectName }}</td>
              <td class="tdTitle">业务名称</td>
              <td class="tdCoent">{{ form.stName }}</td>
              <td class="tdTitle">项目编号</td>
              <td class="tdCoent">{{ form.serialNo }}</td>
            </tr>
            <tr>
              <td class="tdTitle">合同名称</td>
              <td class="tdCoent">{{ form.name }}</td>
              <td class="tdTitle">合同类型</td>
              <td class="tdCoent">{{form.type}}</td>
            </tr>
            <tr>
              <!-- <td class="tdTitle" colspan="1">测试</td>
              <td class="tdCoent" colspan="5">123</td> -->
              <td class="tdTitle">合同编号</td>
              <td class="tdCoent">{{form.number}}</td>
              <td class="tdTitle">签约日期</td>
              <td class="tdCoent">{{parseTime(form.signingTime, "{y}-{m}-{d}")}}</td>
            </tr>
            <tr v-if="form.type == '上游合同'">
              <td class="tdTitle">供应商</td>
              <td class="tdCoent">{{form.supplierName}}</td>
              <td class="tdTitle">终端客户</td>
              <td class="tdCoent">{{form.terminalName}}</td>
              <td class="tdTitle">客户名称</td>
              <td class="tdCoent">{{form.khName}}</td>
            </tr>
            <tr v-if="form.type == '上游合同'">
              <td class="tdCoent">{{ form.type }}</td>
              <td class="tdTitle">合同立项编号</td>
              <td class="tdCoent">{{ form.productNo }}</td>
            </tr>
            <template v-if="form.type == '上游合同'">
              <tr>
                <td class="tdTitle">合同编号</td>
                <td class="tdCoent">{{ form.number }}</td>
                <td class="tdTitle">供应商</td>
                <td class="tdCoent">{{ form.supplierName }}</td>
                <td class="tdTitle">签约日期</td>
                <td class="tdCoent">
                  {{ parseTime(form.signingTime, "{y}-{m}-{d}") }}
                </td>
              </tr>
              <tr>
                <td class="tdTitle">货品名称</td>
                <td class="tdCoent">{{ form.goodsName }}</td>
                <td class="tdTitle">预计吨数</td>
                <td class="tdCoent">
                  {{ $options.filters.weightFilter(form.expectNumber) }}
                </td>
                <td class="tdTitle">保底服务费期限(天)</td>
                <td class="tdCoent">{{ form.mfsp }}</td>
              </tr>
              <tr>
                <td class="tdTitle">超时服务费期限(天)</td>
                <td class="tdCoent">{{ form.csmfsp }}</td>
                <td class="tdTitle">超时服务费费率(%)</td>
                <td class="tdCoent">{{ form.csrate }}</td>
                <td class="tdTitle">违约服务费期限(天)</td>
                <td class="tdCoent">{{ form.vymfsp }}</td>
              </tr>
              <tr>
                <td class="tdTitle">违约服务费费率(%)</td>
                <td class="tdCoent">{{ form.vyrate }}</td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent" colspan="3">{{ form.node }}</td>
              </tr>
            </template>
            <template v-if="form.type == '下游合同'">
              <tr>
                <td class="tdTitle">终端客户</td>
                <td class="tdCoent">{{ form.terminalName }}</td>
                <td class="tdTitle">签约日期</td>
                <td class="tdCoent">
                  {{ parseTime(form.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="tdTitle">货品名称</td>
                <td class="tdCoent">{{ form.goodsName }}</td>
              </tr>
              <tr>
                <td class="tdTitle">基准单价(元)</td>
                <td class="tdCoent">
                  {{ $options.filters.moneyFilter(form.price) }}
                </td>
                <td class="tdTitle">预计吨数</td>
                <td class="tdCoent">
                  {{ $options.filters.weightFilter(form.expectNumber) }}
                </td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent">{{ form.node }}</td>
              </tr>
            </template>
            <template v-if="form.type == '物流运输合同' || form.type == '物流服务合同'">
              <tr>
                <td class="tdTitle">签约日期</td>
                <td class="tdCoent">
                  {{ parseTime(form.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="tdTitle">运输单位</td>
                <td class="tdCoent">{{ form.transportUnit }}</td>
                <td class="tdTitle">运输方式</td>
                <td class="tdCoent">{{ form.transportType }}</td>
              </tr>
              <tr>
                <td class="tdTitle">运费单价(吨/元)</td>
                <td class="tdCoent">{{ form.transportPrice }}</td>
                <td class="tdTitle">起运地</td>
                <td class="tdCoent">{{ form.transportStart }}</td>
                <td class="tdTitle">目的地</td>
                <td class="tdCoent">{{ form.transportEnd }}</td>
              </tr>
              <tr>
                <td class="tdTitle">损耗率</td>
                <td class="tdCoent">{{ form.transportLoss }}</td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent" colspan="3">{{ form.node }}</td>
              </tr>
            </template>
            <template v-if="form.type == '其他合同'">
              <tr>
                <td class="tdTitle">客户名称</td>
                <td class="tdCoent">{{ form.khName }}</td>
                <td class="tdTitle">签约日期</td>
                <td class="tdCoent">
                  {{ parseTime(form.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="tdTitle">备注</td>
                <td class="tdCoent">{{ form.node }}</td>
              </tr>
            </template>
          </table>
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
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">补充说明</td>
              <td class="tdCoent">{{ form.content }}</td>
              <!-- <td class="tdTitle">补充说明</td>
              <td class="tdCoent">{{form.content}}</td> -->
            </tr>
          </table>
          <!-- 补充说明：<span v-text="form.content"></span> -->
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
      <approval-record :typeId="3" :stId="contractId"></approval-record>
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
import { getContract } from "@/api/project/contract";
import { getToken } from "@/utils/auth";
import { getProcessDataByStId } from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
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
