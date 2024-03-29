<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="项目名称" prop="projectId">
        <el-select filterable value-key="projectId" @change="changeProjectQuery" v-model="queryParams.projectId"
          placeholder="请选择项目" style="width: 100%" clearable>
          <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro.projectId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务名称" prop="stId">
        <el-select filterable value-key="stId" @change="changeStQuery" v-model="queryParams.stId" placeholder="请选择业务"
          style="width: 100%" clearable>
          <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj.stId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dataValue" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div style="display:flex;font-size:14px;font-weight:600">
        <div>业务总量：{{ countTotalInfo.total }}</div>
        <div style="margin-left:15px">进行中项目：{{ countTotalInfo.progress }}</div>
        <div style="margin-left:15px">异常项目：{{ countTotalInfo.abnormal }}</div>
        <div style="margin-left:15px">已结束项目：{{ countTotalInfo.end }}</div>
        <div style="margin-left:15px">已完成项目：{{ countTotalInfo.finish }}</div>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="stList">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="用煤单位" align="center" prop="terminalName" />
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结项时间" align="center" prop="finishTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务状态" align="center">
        <template slot-scope="scope">
          <div :style="'color:' + scope.row.bcolor">
            {{ businessStateChange(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)"
            v-hasPermi="['project:st:edit']">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { businessList, countTotal } from "@/api/project/st";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "StDetails",
  data() {
    return {
      dataValue:[],
      total: 0,
      stList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        stId: null
      },
      queryParamsback: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        stId: null
      },
      countTotalInfo: {},
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    this.getList();
    this.loadStatistic()
  },
  methods: {
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      // 只展示审批通过的
      this.queryParams.state = '3'
      businessList(this.queryParams).then(response => {
        this.stList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.loadProjectForCombobox();
    },
    loadProjectForCombobox() {
      this.listForProArr = []
      listProjectForCombobox().then((response) => {
        this.listForProArr = response.data
      })
    },
    loadBusinessForCombobox(projectId) {
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
      })
    },
    changeStQuery(stId) {
    },
    changeProjectQuery(projectId) {
      this.listForBusArr = []
      this.queryParams.stId = ''
      if (projectId) {
        this.loadBusinessForCombobox(projectId);
      }
    },
    loadStatistic(){
      countTotal(this.queryParams).then(res => {
        this.countTotalInfo = res.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.beginTime=this.dataValue[0]
      this.queryParams.endTime=this.dataValue[1]
      this.queryParams.pageNum = 1;
      this.getList();
      this.loadStatistic()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = this.queryParamsback;
      this.dataValue = []
      this.handleQuery();
    },

    /** 查看按钮操作 */
    handleLook(row) {
      this.$router.push('/st/businessDetailView/' + row.stId)
    },
    businessStateChange(e) {
      if (e.businessState == 0) {
        return '提交中'
      } else if (e.businessState == 1) {
        e.bcolor = '#09CC9D'
        return '进行中'
      } else if (e.businessState == 2) {
        e.bcolor = '#FFAC00'
        return '异常'
      } else if (e.businessState == 3) {
        e.bcolor = '#F12801'
        return '结束'
      } else if (e.businessState == 4) {
        e.bcolor = '#007AFF'
        return '完成'
      }
    },
  }
};
</script>
