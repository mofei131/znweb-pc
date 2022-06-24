<template>
  <div class="app-container">
    <div>
      <div class="top">
        <el-form :model="from" ref="ruleForm" :inline="true" label-width="80px">
          <el-form-item label="流程名称">
            <el-input
              v-model="from.taskName"
              placeholder="请输入流程名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="流程类型">
            <el-select v-model="from.approvalType" placeholder="请选择分类">
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
              v-model="from.initiatorUserName"
              placeholder="请输入发起人"
            ></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList"
            >搜索</el-button
          >
        </el-form>
      </div>
      <el-table :data="fromData">
            <el-table-column
              label="流程名称"
              align="center"
              prop="taskName"
            />
            <el-table-column label="流程类型" align="center" prop="processTypeLabel">
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="initiatorTime"
            />
            <el-table-column label="发起人" align="center" prop="initiatorUserName" />
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
            :page.sync="from.page"
            :limit.sync="from.limit"
            @pagination="getList"
          />
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
  taskTodo,
  submitTask,
} from "@/api/approve/index.js";
import approves from "@/views/approve/approves/index";
export default {
  components: { approves },
  data() {
    return {
      activeName: "first",
      from: {
        page: 1,
        limit: 10,
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
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
      this.getList();
    });
  },
  methods: {
    getList() {
      let that = this
      taskTodo(this.from).then((res) => {
        this.total = res.total;
        let list = res.rows
        list.forEach(function(item,index){
          item.processTypeLabel = that.processTypeList[that.processTypeList.findIndex((it) => it.dictValue == item.approvalType)].dictLabel
        })
        this.fromData = list
      });
    },
    // getMyUpcomings() {
    //   getMyUpcomingDept(this.from).then((res) => {
    //     this.total = res.data.total;
    //     this.fromDataDept = res.data.records;
    //   });
    // },
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
