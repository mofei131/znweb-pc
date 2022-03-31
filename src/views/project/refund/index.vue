<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目编号" prop="stId">
        <el-input
          v-model="queryParams.stId"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="stName">
        <el-input
          v-model="queryParams.stName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:refund:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:refund:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:refund:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:refund:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="refundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="refundId" /> -->
      <el-table-column label="项目编号" align="center" prop="stId" />
      <el-table-column label="项目名称" align="center" prop="stName" />
      <!-- <el-table-column label="终端客户id" align="center" prop="terminalId" /> -->
      <el-table-column label="终端客户" align="center" prop="tName" />
      <!-- <el-table-column label="账号" align="center" prop="account" /> -->
      <el-table-column label="开户行" align="center" prop="bank" />
      <el-table-column label="退款金额" align="center" prop="moneyAmount" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="审批状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >查看</el-button>
          <el-button v-if="scope.row.state=='3' "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAddDetail(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >退款</el-button>
          <el-button v-if="scope.row.state=='3' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRefund(scope.row)"
            v-hasPermi="['project:refund:query']"
          >退款明细</el-button>
          <el-button v-if="scope.row.state=='3' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:refund:remove']"
          >打印</el-button>
          <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >编辑</el-button>
          <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:refund:remove']"
          >删除</el-button>
          <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRefer(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >提交</el-button>
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

    <!-- 添加或修改退款金额对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目ID" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目ID" />
        </el-form-item>
        <el-form-item label="项目名称" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="终端客户id" prop="terminalId">
          <el-input v-model="form.terminalId" placeholder="请输入终端客户id" />
        </el-form-item>
        <el-form-item label="终端客户名称" prop="tName">
          <el-input v-model="form.tName" placeholder="请输入终端客户名称" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="开户行" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="退款金额" prop="moneyAmount">
          <el-input v-model="form.moneyAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="审批状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入审批状态" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog :title="refundTitle" :visible.sync="refundOpen" width="600px" append-to-body>
      <el-form ref="refundForm" :model="refundForm" :rules="rules" label-width="120px">
        <el-form-item label="应退款金额" prop="moneyAmount" >
          <el-input v-model="refundForm.moneyAmount"  readonly />
        </el-form-item>
        <el-form-item label="已退款金额" prop="refunded">
          <el-input v-model="refunded"  readonly/>
        </el-form-item>
        <el-form-item label="剩余应退款金额" prop="refunding">
          <el-input v-model="refunding"  readonly/>
        </el-form-item>
        <el-form-item label="终端用户" prop="tName">
          <el-input v-model="refundForm.tName"  readonly/>
        </el-form-item>
        <el-form-item label="开户行" prop="bank">
          <el-input v-model="refundForm.bank"  readonly/>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="refundForm.account"  readonly/>
        </el-form-item>
        <el-form-item label="*退款金额" prop="detailAmount">
          <el-input v-model="queryParams.detailAmount" type="number" placeholder="请输入退款金额" :max="refunding"
           @input="numberChange(arguments[0],refunding)" @change="numberChange(arguments[0],refunding)"/>
        </el-form-item>
        <el-form-item label="*退款日期" prop="detailTime">
          <el-date-picker v-model="queryParams.detailTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择退款日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDetail">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退款明细 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="960px" append-to-body>
      <el-table v-loading="detailLoading" :data="detialList" >
        <el-table-column label="付款人" align="center" prop="stId" />
        <el-table-column label="财务退款金额" align="center" prop="stName" />
        <el-table-column label="退款时间" align="center" prop="tName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['project:refund:edit']"
            >查看</el-button>
            <el-button v-if="scope.row.state=='3' "
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['project:refund:edit']"
            >退款</el-button>
            <el-button v-if="scope.row.state=='3' "
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDetail(scope.row)"
              v-hasPermi="['project:refund:query']"
            >退款明细</el-button>
            <el-button v-if="scope.row.state=='3' "
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['project:refund:remove']"
            >打印</el-button>
            <el-button v-if="scope.row.state=='4' "
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['project:refund:edit']"
            >编辑</el-button>
            <el-button v-if="scope.row.state=='4' "
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['project:refund:remove']"
            >删除</el-button>
            <el-button v-if="scope.row.state=='4' "
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleRefer(scope.row)"
              v-hasPermi="['project:refund:edit']"
            >提交</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { listRefund, getRefund, delRefund, addRefund, updateRefund, getRefundDetail } from "@/api/project/refund";

export default {
  name: "Refund",
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
      // 退款金额表格数据
      refundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        stName: null,
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        state: null,
      },
      dateRange:[],
      detailTime: null,
      // 表单参数
      form: {},
      // 退款表单参数
      refundForm: {},
      stateOptions: [],
      refunded: null,
      refunding: null,
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then(response => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    /** 查询退款金额列表 */
    getList() {
      this.loading = true;
      listRefund(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.refundList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.refundOpen = false;
      this.detailOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        refundId: null,
        stId: null,
        stName: null,
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        remark: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.refundForm = {
        refundId: null,
        stId: null,
        stName: null,
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        remark: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        refunded: null,
        refunding: null
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
      this.dateRange = [];
      this.handleQuery();
    },
    numberChange (val,maxNum) {
         //转换数字类型
         this.queryParams.detailAmount = Number(val)
         //重新渲染
         this.$nextTick(()=>{
            //比较输入的值和最大值，返回小的
            let num = Math.min(Number(val),maxNum)
            //输入负值的情况下， = 0（可根据实际需求更该）
            if(num<0) {
                this.queryParams.detailAmount = 0
            }else {
                //反之
                this.queryParams.detailAmount = num
            }
         })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.refundId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加退款金额";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getRefund(refundId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改退款金额";
      });
    },
    /** 退款按钮操作 */
    handleAddDetail(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getRefund(refundId).then(response => {
        var data1 = response.data;
        // this.refundOpen = true;
        // this.refundTitle = "修改退款金额";

        getRefundDetail(refundId).then(response => {
          // console.log(response.data);

          this.refunded = response.data;
          this.refunding = data1.moneyAmount - response.data;

          this.refundForm = data1;
          this.refundOpen = true;
          this.refundTitle = "修改退款金额";
        });
      });
    },
    addDetail(){
      this.$refs["refundForm"].validate(valid => {
        if (valid) {
          var rd = {
            refundId: null,
            detailAmount: null,
            createTime: null
          };
          addRefundDetail(rd).then(response => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 退款明细按钮操作 */
    handleRefund(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getRefund(refundId).then(response => {
        this.refundForm = response.data;
        this.refundOpen = true;
        this.title = "财务退款";
      });
    },
    /** 提交按钮操作 */
    handleRefer(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getRefund(refundId).then(response => {
        response.data.state = 1;
        updateRefund(response.data).then(response => {
          this.msgSuccess("修改成功");
          // this.open = false;
          this.getList();
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.refundId != null) {
            updateRefund(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRefund(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 退款明细操作 */
    handleDetail(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getRefund(refundId).then(response => {
        this.detailLoad = response.data;
        this.detailOpen = true;
        this.detailTitle = "退款明细";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const refundIds = row.refundId || this.ids;
      this.$confirm('是否确认删除退款金额编号为"' + refundIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRefund(refundIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/refund/export', {
        ...this.queryParams
      }, `project_refund.xlsx`)
    }
  }
};
</script>
