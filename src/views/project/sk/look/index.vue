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
.head-text span {
  display: block;
  width: 220px;
  line-height: 30px;
  margin-top: 0px;
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
          <el-form-item label="基础信息"></el-form-item>
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
              <td class="tdTitle">收款类型</td>
              <td class="tdTitle">{{ form.skType }}</td>
              <td class="tdTitle">收款方式</td>
              <td class="tdCoent">{{ form.skWay }}</td>
              <td class="tdTitle">终端客户</td>
              <td class="tdCoent">{{ form.tName }}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text">
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
            <div>收款类型：</div><span v-text="form.skType"></span>
          </div>
          <div style="display:flex">
            <div>收款方式：</div><span v-text="form.skWay"></span>
          </div>
          <div style="display:flex">
            <div>终端客户：</div><span v-text="form.tName"></span>
          </div>
        </el-col>
      </el-row> -->

      <el-row class="head-title">
        <el-col :span="19">
          <el-form-item label="到厂数质量"></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table
            ref="singleTable"
            :data="gryList"
            fit
            style="margin-bottom: 30px"
          >
            <el-table-column property="name" label="货品名称">
            </el-table-column>
            <el-table-column property="grnNumber" label="重量（吨）">
              <template slot-scope="scope">
                {{
                  Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="gryRz" label="热值（kcal）">
            </el-table-column>
            <el-table-column property="transportType" label="运输方式">
            </el-table-column>
            <el-table-column property="wlCompany" label="物流公司">
            </el-table-column>
            <el-table-column property="carNumber" label="车数">
            </el-table-column>
            <el-table-column property="batch" label="批次"> </el-table-column>
            <el-table-column property="deliveryTime" label="到货日期">
            </el-table-column>
            <el-table-column property="valuePrice" label="货值单价（元）">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valuePrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
            <el-table-column property="valueTprice" label="货值总额（元）">
              <template slot-scope="scope">
                {{
                  Number(scope.row.valueTprice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="head-text">
        <el-col :span="4" :offset="1">
          <el-form-item label="合计重量：">
            <span style="color: red">{{
              $options.filters.weightFilter(form.tweight)
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="平均热值：">
            <span style="color: red">{{ form.prz }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="head-text" style="margin-top: 30px">
        <el-col class="newTable">
          <table width="90%" cellpadding="0" cellspacing="0">
            <tr>
              <td class="tdTitle">收款总额(元)</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.skTprice) }}
              </td>
              <td class="tdTitle">税款(元)</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.tax) }}
              </td>
              <td class="tdTitle">收款单价</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.skPrice) }}
              </td>
            </tr>
            <tr>
              <!-- <td class="tdTitle">收款日期</td>
              <td class="tdCoent">
                {{ parseTime(form.skTime, "{y}-{m}-{d}") }}
              </td> -->
              <td class="tdTitle">承兑(元)</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.accept) }}
              </td>
              <td class="tdTitle">扣罚(元)</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.punish) }}
              </td>
            </tr>
            <tr>
              <td class="tdTitle">其他扣罚(元)</td>
              <td class="tdCoent">
                {{ $options.filters.moneyFilter(form.otherP) }}
              </td>
              <td class="tdTitle">其他扣罚说明</td>
              <td class="tdCoent">{{ form.otherN }}</td>
              <td class="tdTitle"></td>
              <td class="tdCoent"></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <!-- <el-row class="head-text" style="margin-top: 30px;">
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>收款总额(元)：</div><span v-text="$options.filters.moneyFilter(form.skTprice)"></span>
          </div>
          <div style="display:flex">
            <div>税款(元)：</div><span v-text="$options.filters.moneyFilter(form.tax)"></span>
          </div>
          <div style="display:flex">
            <div>收款单价：</div><span v-text="$options.filters.moneyFilter(form.skPrice)"></span>
          </div>
          <div style="display:flex">
            <div>收款日期：</div><span>{{ parseTime(form.skTime, '{y}-{m}-{d}') }}</span>
          </div>
          <div style="display:flex">
            <div>承兑：</div><span v-text="$options.filters.moneyFilter(form.accept)"></span>
          </div>
        </el-col>
        <el-col :span="7" :offset="1">
          <div style="display:flex">
            <div>扣罚：</div><span v-text="$options.filters.moneyFilter(form.punish)"></span>
          </div>
          <div style="display:flex">
            <div>其他扣罚：</div><span v-text="$options.filters.moneyFilter(form.otherP)"></span>
          </div>
          <div style="display:flex">
            <div>其他扣罚说明：</div><span v-text="form.otherN"></span>
          </div>
        </el-col>
      </el-row> -->

      <el-row class="head-text" style="margin-top: 30px">
        <el-col :span="4" :offset="1">
          <el-form-item label="总计收款(元)：">
            <span style="color: red">{{
              $options.filters.moneyFilter(form.yftotalPrice)
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="已预收金额(元)：">
            <span style="color: red">{{
              $options.filters.moneyFilter(form.yfPrice)
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="实际应收金额(元)：">
            <span style="color: red">{{
              $options.filters.moneyFilter(form.sjPrice)
            }}</span>
          </el-form-item>
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
      <approval-process :typeId="6" :stId="skId"></approval-process>

      <!--      审批信息-->
      <approval-record :typeId="6" :stId="skId"></approval-record>
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
import { getProcessDataByStId } from "@/api/approve";

export default {
  name: "contractLook",
  data() {
    return {
      //出库集合
      gryList: [],

      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //附件集合
      fileList: [],

      // 表单参数
      form: {},
      skId: "",
    };
  },
  created() {
    const skId = this.$route.params && this.$route.params.skId;
    this.skId = skId;
    getSk(skId).then((response) => {
      this.form = response.data;
      this.fileList = response.data.fileList;
      this.gryList = response.data.selnyList;
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
