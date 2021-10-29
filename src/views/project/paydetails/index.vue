<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="付款类别" prop="type">-->
<!--        <el-select v-model="queryParams.type" placeholder="请选择付款类别" clearable size="small">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="付款id" prop="pid">-->
<!--        <el-input-->
<!--          v-model="queryParams.pid"-->
<!--          placeholder="请输入付款id"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['project:paydetails:add']"-->
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
<!--          v-hasPermi="['project:paydetails:edit']"-->
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
<!--          v-hasPermi="['project:paydetails:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:paydetails:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"  :data="paydetailsList" @selection-change="handleSelectionChange">
      <el-table-column label="付款人" align="center" prop="userName" v-if="this.queryParams.type!='realsk'"/>
      <el-table-column label="付款金额" align="center" prop="payPrice"  v-if="this.queryParams.type!='realsk'"/>
      <el-table-column label="付款时间" align="center" prop="payTime" width="180"  v-if="this.queryParams.type!='realsk'">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保底服务费期限" align="center" prop="msfp" v-if="this.queryParams.type!='realsk'"/>
      <el-table-column label="年息服务费费率" align="center" prop="rate" v-if="this.queryParams.type!='realsk'"/>
      <el-table-column label="收款人" align="center" prop="userName" v-if="this.queryParams.type=='realsk'"/>
      <el-table-column label="收款金额" align="center" prop="payPrice" v-if="this.queryParams.type=='realsk'"/>
      <el-table-column label="收款时间" align="center" prop="payTime"  v-if="this.queryParams.type=='realsk'">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>



<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:paydetails:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:paydetails:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改付款明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="付款类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择付款类别">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入付款id" />
        </el-form-item>
        <el-form-item label="付款人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入付款人id" />
        </el-form-item>
        <el-form-item label="付款人" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入付款人" />
        </el-form-item>
        <el-form-item label="付款金额" prop="payPrice">
          <el-input v-model="form.payPrice" placeholder="请输入付款金额" />
        </el-form-item>
        <el-form-item label="付款时间" prop="payTime">
          <el-date-picker clearable size="small"
            v-model="form.payTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择付款时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="保底服务费期限" prop="msfp">
          <el-input v-model="form.msfp" placeholder="请输入保底服务费期限" />
        </el-form-item>
        <el-form-item label="年息服务费费率" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入年息服务费费率" />
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
import { listPaydetails, getPaydetails, delPaydetails, addPaydetails, updatePaydetails } from "@/api/project/paydetails";

export default {
  name: "Paydetails",
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
      // 付款明细表格数据
      paydetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        pid: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    const type = this.$route.query && this.$route.query.type;
    const pid = this.$route.query && this.$route.query.pid;
    this.queryParams.type=type
    this.queryParams.pid=pid
    this.getList();
  },
  methods: {
    /** 查询付款明细列表 */
    getList() {
      this.loading = true;
      listPaydetails(this.queryParams).then(response => {
        this.paydetailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        paydetailsId: null,
        type: null,
        pid: null,
        userId: null,
        userName: null,
        payPrice: null,
        payTime: null,
        msfp: null,
        rate: null,
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
      this.ids = selection.map(item => item.paydetailsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加付款明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const paydetailsId = row.paydetailsId || this.ids
      getPaydetails(paydetailsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改付款明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.paydetailsId != null) {
            updatePaydetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPaydetails(this.form).then(response => {
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
      const paydetailsIds = row.paydetailsId || this.ids;
      this.$confirm('是否确认删除付款明细编号为"' + paydetailsIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPaydetails(paydetailsIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/paydetails/export', {
        ...this.queryParams
      }, `project_paydetails.xlsx`)
    }
  }
};
</script>
