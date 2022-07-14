<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="业务状态">
        <el-select filterable v-model="queryParams.xmState" placeholder="请选择代办人" clearable>
          <el-option v-for="item in businessStateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select filterable v-model="queryParams.state" placeholder="请选择代办人" clearable>
          <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="用煤单位" align="center" prop="terminalName" />
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="业务状态" align="center">
        <template slot-scope="scope">
          <div :style="'color:' + scope.row.bcolor">
            {{ businessStateChange(scope.row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center" prop="xmNode" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <div :style="'color:' + scope.row.scolor">
            {{ stateChange(scope.row) }}
          </div>
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
import { stupdateList } from "@/api/project/st";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "StUpdate",
  data() {
    return {
      stateOptions: [
        {
          value: 1,
          label: "未审批",
        },
        {
          value: 2,
          label: "审批中",
        },
        {
          value: 3,
          label: "已通过",
        },
        {
          value: 4,
          label: "已打回",
        },
      ],
      businessStateOptions: [
        {
          value: 0,
          label: "提交中",
        },
        {
          value: 1,
          label: "进行中",
        },
        {
          value: 2,
          label: "异常",
        },
        {
          value: 3,
          label: "结束",
        },
        {
          value: 4,
          label: "完成",
        },
      ],
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
        projectId: null,
        stId: null
      },
      queryParamsback: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        stId: null
      },
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleLook(row) {
      this.$router.push({
        name: "lookUpdate",
        query: { stId: row.stId + "", stupdateId: row.stupdateId },
      });
    },
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      stupdateList(this.queryParams).then((response) => {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = this.queryParamsback;
      this.handleQuery();
    },
    stateChange(e) {
      if (e.state == 1) {
        return "未审批";
      } else if (e.state == 2) {
        e.scolor = "#09CC9D";
        return "审批中";
      } else if (e.state == 3) {
        e.scolor = "#007AFF";
        return "已通过";
      } else if (e.state == 4) {
        e.scolor = "#F12801";
        return "已打回";
      }
    },
    businessStateChange(e) {
      if (e.xmState == 0) {
        return "提交中";
      } else if (e.xmState == 1) {
        e.bcolor = "#09CC9D";
        return "进行中";
      } else if (e.xmState == 2) {
        e.bcolor = "#FFAC00";
        return "异常";
      } else if (e.xmState == 3) {
        e.bcolor = "#F12801";
        return "结束";
      } else if (e.xmState == 4) {
        e.bcolor = "#007AFF";
        return "完成";
      }
    },
  },
};
</script>
