<template>
  <div class="app-container">
    <div>
      <div class="top">
        <el-form
          :model="doneListFrom"
          ref="ruleForm"
          :inline="true"
          label-width="80px"
        >
          <el-form-item label="流程名称">
            <el-input
              v-model="doneListFrom.processName"
              placeholder="请输入流程名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="流程类型" prop="processType">
            <el-select
              v-model="doneListFrom.processType"
              placeholder="请选择分类"
            >
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
              v-model="doneListFrom.sponsor"
              placeholder="请输入发起人"
            ></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList"
            >搜索</el-button
          >
        </el-form>
      </div>
      <el-table :data="doneList">
        <el-table-column label="流程名称" align="center" prop="processName" />
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
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="发起时间" align="center" prop="createTime" />
        <el-table-column label="发起人" align="center" prop="nickName" />
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
        :page.sync="doneListFrom.pageNum"
        :limit.sync="doneListFrom.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { myAlreadyDoneList } from "@/api/approve/index.js";
import {getStupdate} from "@/api/project/st";
export default {
  data() {
    return {
      total: 0,
      doneListFrom: {
        pageNum: 1,
        pageSize: 10,
      },
      doneList: [],
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
      myAlreadyDoneList(this.doneListFrom).then((res) => {
        this.total = res.data.total;
        this.doneList = res.data.records;
      });
    },
    handleSelectYiban(row){
      let typeId=row.processType;
      let stId=row.stId;
      if(typeId=='1'){
        this.$router.push("/st/lookAdd/" + stId);
      }else if(typeId=='2'){
        getStupdate(stId).then(response => {
          this.$router.push({name: 'lookUpdate', query:{stId:response.data.stId+"",stupdateId:stId}})
        })
      }else if(typeId=='3'){
        this.$router.push("/contract/look/" + stId);
      }else if(typeId=='4'){
        this.$router.push("/apayment/look/" + stId);
      }else if(typeId=='5'){
        this.$router.push("/fpayment/look/" + stId);
      }else if(typeId=='6'){
        this.$router.push("/sk/look/" + stId);
      }else if(typeId=='7'){
        this.$router.push("/margin/look/" + stId);
      }else if(typeId=='8'){
        this.$router.push("/cplan/look/" + stId);
      }else if(typeId=='9'){
        this.$router.push("/lpayment/look/" + stId);
      }else if(typeId=='10'){
        this.$router.push("/grn/look/" + stId);
      }else if(typeId=='11'){
        this.$router.push("/gry/look/" + stId);
      }else if(typeId=='12'){
        this.$router.push("/supplier/look/" + stId);
      }else if(typeId=='13'){
        this.$router.push("/terminal/look/" + stId);
      }else if(typeId=='14'){
        this.$router.push("/sticket/look/" + stId);
      }else if(typeId=='15'){
        this.$router.push("/kp/look/" + stId);
      }else if(typeId=='16'){
        this.$router.push("/dp/look/" + stId);
      }else if(typeId=='18'){
        this.$router.push("/bidApply/look/" + stId);
      }
    },
  },
};
</script>

<style>
</style>
