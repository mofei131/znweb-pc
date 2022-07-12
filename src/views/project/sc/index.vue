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
      <el-form-item label="项目编号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="代办人" prop="sqId">
        <el-select filterable v-model="queryParams.userId" placeholder="请选择代办人" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务经理" prop="serviceManagerId">
        <el-select filterable v-model="queryParams.serviceManagerId" placeholder="请选择业务经理" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
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
      <!--          v-hasPermi="['project:sc:add']"-->
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
      <!--          v-hasPermi="['project:sc:edit']"-->
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
      <!--          v-hasPermi="['project:sc:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:sc:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote" />
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote" />
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote" />
      <el-table-column label="已开票吨数" align="center" prop="number">
        <template slot-scope="scope">
          {{
          Number(scope.row.number)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="已开票金额(元)" align="center" prop="kpPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.kpPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="应收金额(元)" align="center" prop="scPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.scPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="已收款(元)" align="center" prop="skPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.skPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="已付金额(元)" align="center" prop="payPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.payPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="结算应收(元)" align="center" prop="jsPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.jsPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="发运吨数" align="center" prop="fynumber">
        <template slot-scope="scope">
          {{
          Number(scope.row.fynumber)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="业务经理" align="center" prop="serviceManagerName" />
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--            v-hasPermi="['project:sc:edit']"-->
      <!--          >修改</el-button>-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--            v-hasPermi="['project:sc:remove']"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改应收管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="项目名字" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名字" />
        </el-form-item>
        <el-form-item label="已开票金额(元)" prop="kpPrice">
          <el-input v-model="form.kpPrice" placeholder="请输入已开票金额(元)" />
        </el-form-item>
        <el-form-item label="已收款(元)" prop="skPrice">
          <el-input v-model="form.skPrice" placeholder="请输入已收款(元)" />
        </el-form-item>
        <el-form-item label="应收金额(元)" prop="scPrice">
          <el-input v-model="form.scPrice" placeholder="请输入应收金额(元)" />
        </el-form-item>
        <el-form-item label="已付金额(元)" prop="payPrice">
          <el-input v-model="form.payPrice" placeholder="请输入已付金额(元)" />
        </el-form-item>
        <el-form-item label="结算应收(元)" prop="jsPrice">
          <el-input v-model="form.jsPrice" placeholder="请输入结算应收(元)" />
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
import { listSc, getSc, delSc, addSc, updateSc } from "@/api/project/sc";
import {getStList, getUserList} from "@/api/project/cplan";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "Sc",
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
      // 应收管理表格数据
      scList: [],
      // 项目集合
      stOptions: [],
      //代办人集合
      userOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
    getUserList().then(response => {
      this.userOptions = response.rows;
      this.user2Options = response.rows;
    });
  },
  methods: {
    /** 查询应收管理列表 */
    getList() {
      this.loading = true;
      listSc(this.queryParams).then(response => {
        this.scList = response.rows;
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
    loadBusinessForCombobox(projectId) {
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        scId: null,
        stId: null,
        stName: null,
        kpPrice: null,
        skPrice: null,
        scPrice: null,
        payPrice: null,
        jsPrice: null,
        state: null,
        createBy: null,
        createTime: null
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
      this.ids = selection.map(item => item.scId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加应收管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const scId = row.scId || this.ids
      getSc(scId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改应收管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.scId != null) {
            updateSc(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSc(this.form).then(response => {
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
      const scIds = row.scId || this.ids;
      this.$confirm('是否确认删除应收管理?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSc(scIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/sc/export', {
        ...this.queryParams
      }, `project_sc.xlsx`)
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
  }
};
</script>
