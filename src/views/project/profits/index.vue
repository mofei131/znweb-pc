<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch && !isQuote" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="项目名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input v-model="queryParams.stName" placeholder="业务名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目编号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="代办人" prop="userId">
        <el-select filterable v-model="queryParams.userId" placeholder="请选择代办人" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务经理" prop="serviceManagerId">
        <el-select filterable v-model="queryParams.serviceManagerId" placeholder="请选择业务经理" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="统计时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          plain-->
      <!--          icon="el-icon-plus"-->
      <!--          size="mini"-->
      <!--          @click="handleAdd"-->
      <!--          v-hasPermi="['project:profits:add']"-->
      <!--        >新增</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:profits:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['project:profits:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:profits:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="!isQuote"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="profitsList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote" />
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote" />
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote" />
      <el-table-column label="代办人" align="center" prop="userName" v-if="!isQuote" />
      <el-table-column label="业务经理" align="center" prop="serviceManagerName" />
      <el-table-column label="营业利润(元)" align="center" prop="businessProfits">
        <template slot-scope="scope">
          {{
          Number(scope.row.businessProfits)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="成本服务费(元)" align="center" prop="cbPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.cbPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="印花税(元)" align="center" prop="printingTax">
        <template slot-scope="scope">
          {{
          Number(scope.row.printingTax)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="增值税(元)" align="center" prop="zzTax">
        <template slot-scope="scope">
          {{
          Number(scope.row.zzTax)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="附加税(元)" align="center" prop="additionalTax">
        <template slot-scope="scope">
          {{
          Number(scope.row.additionalTax)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="期间费用总额(元)" align="center" prop="dpTotal">
        <template slot-scope="scope">
          {{
          Number(scope.row.dpTotal)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="不含税利润总额(元)" align="center" prop="notaxTotal">
        <template slot-scope="scope">
          {{
          Number(scope.row.notaxTotal)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="所得税(元)" align="center" prop="sdTax">
        <template slot-scope="scope">
          {{
          Number(scope.row.sdTax)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="净利润(元)" align="center" prop="profitsPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.profitsPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" prop="okTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.okTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" align="center" prop="stState" :formatter="stateFormat" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改统计利润对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="项目编号" prop="stNumber">
          <el-input v-model="form.stNumber" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="营业利润" prop="businessProfits">
          <el-input v-model="form.businessProfits" placeholder="请输入营业利润" />
        </el-form-item>
        <el-form-item label="印花税" prop="printingTax">
          <el-input v-model="form.printingTax" placeholder="请输入印花税" />
        </el-form-item>
        <el-form-item label="附加税" prop="additionalTax">
          <el-input v-model="form.additionalTax" placeholder="请输入附加税" />
        </el-form-item>
        <el-form-item label="期间费用总额" prop="dpTotal">
          <el-input v-model="form.dpTotal" placeholder="请输入期间费用总额" />
        </el-form-item>
        <el-form-item label="不含税利润总额" prop="notaxTotal">
          <el-input v-model="form.notaxTotal" placeholder="请输入不含税利润总额" />
        </el-form-item>
        <el-form-item label="所得税" prop="sdTax">
          <el-input v-model="form.sdTax" placeholder="请输入所得税" />
        </el-form-item>
        <el-form-item label="净利润" prop="profitsPrice">
          <el-input v-model="form.profitsPrice" placeholder="请输入净利润" />
        </el-form-item>
        <el-form-item label="完成时间" prop="okTime">
          <el-date-picker clearable size="small" v-model="form.okTime" type="date" value-format="yyyy-MM-dd"
            placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目状态" prop="stState">
          <el-input v-model="form.stState" placeholder="请输入项目状态" />
        </el-form-item>
        <el-form-item label="审核状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入审核状态" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProfits, getProfits, delProfits, addProfits, updateProfits } from "@/api/project/profits";
import {getStList, getUserList} from "@/api/project/cplan";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "Profits",
  props: {
    "stIdd": {
      type: String
    },
    "projectIdd": {
      type: String
    },
    "isQuote": {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 统计利润表格数据
      profitsList: [],
      // 项目集合
      stOptions: [],
      projectOptions: [],
      //代办人集合
      userOptions:[],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        stNumber: null,
        stName: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 打印
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    if (this.isQuote){
      this.queryParams.stId = parseInt(this.stIdd)
      this.queryParams.projectId = parseInt(this.projectIdd)
    }
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
    getUserList().then(response => {
      this.userOptions = response.rows;
    });
  },
  methods: {
    /** 查询统计利润列表 */
    getList() {
      this.loading = true;
      listProfits(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.profitsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
      });
       // 项目下拉
      this.loadProjectForCombobox();
    },
    loadProjectForCombobox() {
      this.listForProArr = []
      listProjectForCombobox().then((response) => {
        this.listForProArr = response.data
      })
    },
    loadBusinessForCombobox(projectId){
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
        if(this.isQuote){
          this.changeSt(this.queryParams.stId)
        }
      })
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      if(row.stState=='1'){
        return "进行中"
      }else if(row.stState=='2'){
        return "异常"
      }
      else if(row.stState=='3'){
        return "已结束"
      }
      else if(row.stState=='4'){
        return "已完成"
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        profitsId: null,
        stId: null,
        stNumber: null,
        stName: null,
        businessProfits: null,
        printingTax: null,
        additionalTax: null,
        dpTotal: null,
        notaxTotal: null,
        sdTax: null,
        profitsPrice: null,
        okTime: null,
        stState: null,
        state: null,
        createBy: null,
        createTime: null,
        projectId: null,
        projectName: null,
        serialNo: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.profitsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加统计利润";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const profitsId = row.profitsId || this.ids
      getProfits(profitsId).then(response => {
        this.form = response.data;
        this.form.stId = response.data.stId;
        this.open = true;
        this.title = "修改统计利润";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.profitsId != null) {
            updateProfits(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProfits(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const profitsIds = row.profitsId || this.ids;
      this.$confirm('是否确认删除统计利润?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProfits(profitsIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/profits/export', {
        ...this.queryParams
      }, `project_profits.xlsx`)
    },
     changeSt(stId) {
      let businessFind = this.listForBusArr.filter(x => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        this.form.stName = businessFind[0].stName;
        this.form.serialNo = businessFind[0].serialNo;
      }
    },
    changeProject(projectId) {
      this.listForBusArr = []
      this.form.stId = ''
      this.form.stName = ''
      this.form.serialNo = ''
      if (projectId){
        this.loadBusinessForCombobox(projectId);
      }
    },
  }
};
</script>
