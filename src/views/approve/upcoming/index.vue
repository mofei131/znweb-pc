<template>
  <div class="app-container" style="height: 100%;overflow: auto;margin: 0">
    <div>
      <div class="top">
        <el-form :model="from" ref="ruleForm" :inline="true" label-width="80px">
          <el-form-item label="流程名称">
            <el-input
              v-model="from.processName"
              placeholder="请输入流程名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="流程类型" prop="processType">
            <el-select v-model="from.processType" placeholder="请选择分类">
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
              v-model="from.sponsor"
              placeholder="请输入发起人"
            ></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList"
            >搜索</el-button
          >
        </el-form>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的待办" name="first">
          <el-table :data="fromData">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "操作项目"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "预估收款"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : scope.row.processType == "18"
                    ? "投标申请"
                    : scope.row.processType == "19"
                    ? "退款管理"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="发起人" align="center" prop="nickName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button type="text" @click="handleApprove(scope.row)" circle
                  >审批</el-button
                >
                <!-- <el-button type="text" @click="handleReInitiate(scope.row)" circle
                  >驳回</el-button
                > -->
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="from.pageNum"
            :limit.sync="from.pageSize"
            @pagination="getList"
          />
        </el-tab-pane>
        <el-tab-pane label="部门待办" name="second">
          <el-table :data="fromDataDept">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "操作项目"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "预估收款"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : scope.row.processType == "18"
                    ? "投标申请"
                    : scope.row.processType == "19"
                    ? "退款管理"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="发起人" align="center" prop="nickName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button type="text" @click="handleApprove(scope.row)" circle
                  >审批</el-button
                >
                <!-- <el-button type="text" @click="handleReInitiate(scope.row)" circle
                  >驳回</el-button
                > -->
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="from.pageNum"
            :limit.sync="from.pageSize"
            @pagination="getMyUpcomings"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="textMap[popMode]"
      :close-on-click-modal="popMode == 'view'"
      v-if="insertDialog"
      :visible.sync="insertDialog"
      width="80%"
    >
      <approves
        :mode="popMode"
        :initData="popData"
        @popCancle="popCancle"
        @popOk="popOk"
      ></approves>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMyUpcoming,
  getMyUpcomingDept,
  passed,
  turnDownByProcessId,
} from "@/api/approve/index.js";
import approves from "@/views/approve/approves/index";
export default {
  components: { approves },
  data() {
    return {
      activeName: "first",
      from: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      fromData: [],
      fromDataDept: [],
      processTypeList: [],
      insertDialog: false,
      popMode: "",
      popData: {},
      textMap: {
        approve: "审批",
      },
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
      getMyUpcoming(this.from).then((res) => {
        this.total = res.data.total;
        this.fromData = res.data.records;
      });
    },
    getMyUpcomings() {
      getMyUpcomingDept(this.from).then((res) => {
        this.total = res.data.total;
        this.fromDataDept = res.data.records;
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "first") {
        this.getList();
      }
      if (tab.name == "second") {
        this.getMyUpcomings();
      }
    },
    // 搜索按钮
    searchDaiban() {},
    // 审批
    handleApprove(row) {
      this.popMode = "approve";
      this.popData = row;
      this.insertDialog = true;
      // passed(row.processId, row.id, row.level).then(() => {
      //   this.$messageContent.message("S000003", ["审批"]);
      //   this.getList();
      //   this.getMyUpcomings();
      // });
    },
    // 驳回
    handleReInitiate(row) {
      turnDownByProcessId(row.processId, row.id).then((res) => {
        this.$messageContent.message("S000003", ["驳回"]);
        this.getList();
        this.getMyUpcomings();
      });
    },
    popOk() {
      this.insertDialog = false;
      this.getMyUpcomings();
      this.getList();
    },
    popCancle() {},
  },
};
</script>

<style></style>
