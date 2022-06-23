<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="业务名称" prop="stName">
        <el-input
          v-model="queryParams.stName"
          placeholder="请输入业务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="立项编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          placeholder="请输入立项编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stList">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="立项编号" align="center" prop="stNumber" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="用煤单位" align="center" prop="terminalName" />
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务状态" align="center" prop="businessState" />
      <el-table-column label="审核状态" align="center" prop="state" />
      <el-table-column label="操作"   width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:st:edit']"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  stupdateList
} from "@/api/project/st";
export default {
  name: "StUpdate",
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目信息表格数据
      stList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParamsback: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleLook(row){

    },
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      stupdateList(this.queryParams).then(response => {
        this.stList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams=this.queryParamsback
      this.handleQuery();
    },
    // 菜单状态字典翻译
    xmStateFormat(row, column){
      if(row.xmState=='1'){
        return "进行中"
      }else if(row.xmState=='2'){
        return "异常"
      }else if(row.xmState=='3'){
        return "结束"
      }else if(row.xmState=='4'){
        return "完成"
      }
    }
  }
};
</script>
