<template>
  <div class="app-container">
    <div class="top">
      <el-form
        :model="queryParams"
        ref="ruleForm"
        :inline="true"
        label-width="100px"
      >
        <!-- <el-form-item label="流程名称">
          <el-input
            v-model="queryParams.processName"
            placeholder="请输入流程名称"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="流程类型" prop="processTypeList">
          <el-select v-model="queryParams.approvalType" placeholder="请选择分类">
            <el-option
              v-for="dict in processTypeList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
     <!--   <el-form-item label="一级审批人">
          <el-input
            v-model="queryParams.levelOneApproval"
            placeholder="请输入一级审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="二级审批人">
          <el-input
            v-model="queryParams.levelTowApproval"
            placeholder="请输入二级审批人"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="发起人">
          <el-input
            v-model="queryParams.sponsor"
            placeholder="请输入发起人"
          ></el-input>
        </el-form-item> -->
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
        <el-button type="warning" icon="el-icon-plus" @click="create"
          >创建流程</el-button
        >
      </el-form>
    </div>
    <div>
      <el-table :data="initiateData">
        <!-- <el-table-column label="流程名称" align="center" prop="processName" /> -->
        <el-table-column
          label="流程类型"
          align="center"
          prop="approvalType"
        />
        <!-- <el-table-column label="流程类型" align="center" prop="processType">
          <template slot-scope="scope">
            {{
              scope.row.processType == "1"
                ? "新增项目"
                : scope.row.processType == "2"
                ? "项目操作"
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
        </el-table-column> -->
        <!-- <el-table-column
          label="一级审批"
          align="center"
          prop="levelOneApproval"
        />
        <el-table-column
          label="多级审批"
          align="center"
          prop="levelTowApprove"
        />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status == "0" ? "启用" : "禁用" }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="handleSelect(scope.row)" circle
              >查看</el-button
            > -->
            <el-button type="text" @click="handleUpdate(scope.row)" circle
              >编辑</el-button
            >
            <!-- <el-button type="text" @click="status(scope.row)" circle>{{
              scope.row.status == "0" ? "禁用" : "启用"
            }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :title="textMap[popMode]"
      :close-on-click-modal="popMode == 'view'"
      v-if="insertDialog"
      :visible.sync="insertDialog"
      width="1000px"
    >
      <insert
        :mode="popMode"
        :initData="popData"
        @popCancle="popCancle"
        @popOk="popOk"
      ></insert>
    </el-dialog>
  </div>
</template>

<script>
import { list, updateStatus } from "@/api/approve/index.js";
import insert from "@/views/approve/add/index";
export default {
  components: { insert },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      processTypeList: [],
      initiateData: [],
      total: 0,
      insertDialog: false,
      popMode: "",
      popData: {},
      textMap: {
        create: "创建流程",
        approve: "流程审批",
        view: "查看详情",
        reInitiate: "编辑",
      },
    };
  },
  created() {
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
    });
    this.getList();
  },
  methods: {
    getList() {
      let that = this
      list(this.queryParams).then((res) => {
        // this.initiateData = res.data.records;
        // console.log(res.rows)
        let list = res.rows
        list.forEach(function(item,index){
          list[index].approvalType = that.processTypeList[that.processTypeList.findIndex((it) => it.dictValue == item.approvalType)].dictLabel
        })
        // console.log(list)
        this.initiateData = list
        this.total = res.total;
      });
    },
    // 搜索按钮
    search() {
      this.getList();
    },
    status(row) {
      let status = "";
      if (row.status == "0") {
        status = "1";
      } else {
        status = "0";
      }
      updateStatus(row.id, status).then(() => {
        if (row.status == "0") {
          this.$messageContent.message("S000003", ["禁用"]);
        } else {
          this.$messageContent.message("S000003", ["启用"]);
        }
        this.getList();
      });
    },
    // 创建流程
    create() {
      this.popMode = "create";
      this.insertDialog = true;
    },
    // 查看详情按钮
    handleSelect(row) {
      this.popMode = "view";
      this.popData = row;
      this.insertDialog = true;
    },
    handleUpdate(row) {
      this.popMode = "reInitiate";
      this.popData = row;
      this.insertDialog = true;
    },
    popCancle() {},
    popOk() {
      this.insertDialog = false;
      this.getList();
    },
  },
};
</script>

<style></style>
