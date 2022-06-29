<template>
  <div class="app-container">
    <div class="top">
      <el-form :model="fromCc" ref="ruleForm" :inline="true" label-width="80px">
        <el-form-item label="流程名称">
          <el-input
            v-model="fromCc.taskName"
            placeholder="请输入流程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select v-model="fromCc.approvalType" placeholder="请选择分类">
            <el-option
              v-for="dict in processTypeList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input
            v-model="fromCc.initiatorUserName"
            placeholder="请输入发起人"
          ></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >搜索</el-button
        >
      </el-form>
    </div>
    <div>
      <el-table :data="fromCcData">
        <el-table-column label="流程名称" align="center" prop="taskName" />
        <el-table-column label="流程类型" align="center" prop="approvalType">
          <template slot-scope="scope">
            {{
              scope.row.approvalType == "1"
                ? "新增业务"
                : scope.row.approvalType == "2"
                ? "操作业务"
                : scope.row.approvalType == "3"
                ? "合同管理"
                : scope.row.approvalType == "4"
                ? "预付款管理"
                : scope.row.approvalType == "5"
                ? "最终付款管理"
                : scope.row.approvalType == "6"
                ? "预估收款"
                : scope.row.approvalType == "7"
                ? "保证金管理"
                : scope.row.approvalType == "8"
                ? "资金计划"
                : scope.row.approvalType == "9"
                ? "物流付款"
                : scope.row.approvalType == "10"
                ? "入库"
                : scope.row.approvalType == "11"
                ? "出库"
                : scope.row.approvalType == "12"
                ? "供应商管理"
                : scope.row.approvalType == "13"
                ? "用煤单位"
                : scope.row.approvalType == "14"
                ? "收票记录"
                : scope.row.approvalType == "15"
                ? "开票申请"
                : scope.row.approvalType == "16"
                ? "期间费用"
                : scope.row.approvalType == "17"
                ? "实际收款"
                : scope.row.approvalType == "18"
                ? "投标申请"
                : scope.row.approvalType == "19"
                ? "退款管理"
                : scope.row.approvalType == "20"
                ? "项目立项"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="发起时间" align="center" prop="initiatorTime" />
        <el-table-column label="发起人" align="center" prop="initiatorUserName" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
            <el-button type="text" @click="handleSelectYiban(scope.row)" circle
              >查看</el-button
            >
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="fromCc.page"
        :limit.sync="fromCc.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { taskCc } from "@/api/approve/index.js";
import { getStupdate } from "@/api/project/st";
export default {
  data() {
    return {
      fromCc: {
        page: 1,
        limit: 10,
      },
      total: 0,
      fromCcData: [],
      processTypeList: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
    });
  },
  methods: {
    getList() {
      taskCc(this.fromCc).then((res) => {
        this.total = res.total;
        this.fromCcData = res.rows;
      });
    },
    handleSelectYiban(row) {
      console.log(row)
      let typeId = row.approvalType;
      let stId = row.businessKey;
      if (typeId == "20") {
        this.$router.push("/st/lookAddP/" + stId);
      }
      else if (typeId == "1") {
        this.$router.push("/st/lookAddB/" + stId);
      } else if (typeId == "2") {
        getStupdate(stId).then((response) => {
          this.$router.push({
            name: "lookUpdate",
            query: { stId: response.data.stId + "", stupdateId: stId },
          });
        });
      } else if (typeId == "3") {
        this.$router.push("/contract/look/" + stId);
      } else if (typeId == "4") {
        this.$router.push("/apayment/look/" + stId);
      } else if (typeId == "5") {
        this.$router.push("/fpayment/look/" + stId);
      } else if (typeId == "6") {
        this.$router.push("/sk/look/" + stId);
      } else if (typeId == "7") {
        this.$router.push("/margin/look/" + stId);
      } else if (typeId == "8") {
        this.$router.push("/cplan/look/" + stId);
      } else if (typeId == "9") {
        this.$router.push("/lpayment/look/" + stId);
      } else if (typeId == "10") {
        this.$router.push("/grn/look/" + stId);
      } else if (typeId == "11") {
        this.$router.push("/gry/look/" + stId);
      } else if (typeId == "12") {
        this.$router.push("/supplier/look/" + stId);
      } else if (typeId == "13") {
        this.$router.push("/terminal/look/" + stId);
      } else if (typeId == "14") {
        this.$router.push("/sticket/look/" + stId);
      } else if (typeId == "15") {
        this.$router.push("/kp/look/" + stId);
      } else if (typeId == "16") {
        this.$router.push("/dp/look/" + stId);
      } else if (typeId == "18") {
        this.$router.push("/bidApply/look/" + stId);
      } else if (typeId == "19") {
        this.$router.push("/refund/look/" + stId);
      }
    },
  },
};
</script>

<style></style>
