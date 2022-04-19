<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
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
      <div v-if="this.queryParams.type == 'realsk'">
        <el-col :span="3" style="margin-left: 12px">
          <span>应收金额：</span> <span v-text="$options.filters.moneyFilter(yf)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>已收金额：</span><span v-text="$options.filters.moneyFilter(ypay)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>剩余应收：</span><span v-text="$options.filters.moneyFilter(yf - ypay)">0.00</span>
        </el-col>
      </div>
      <div v-else-if="this.queryParams.type == 'refund'">
        <el-col :span="3" style="margin-left: 12px">
          <span>应退款金额：</span> <span v-text="$options.filters.moneyFilter(yf)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>已退款金额：</span><span v-text="$options.filters.moneyFilter(ypay)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>剩余退款金额：</span><span v-text="$options.filters.moneyFilter(yf - ypay)">0.00</span>
        </el-col>
      </div>
      <div v-else>
        <el-col :span="3" style="margin-left: 12px">
          <span>应付金额：</span> <span v-text="$options.filters.moneyFilter(yf)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>已付金额：</span><span v-text="$options.filters.moneyFilter(ypay)">0.00</span>
        </el-col>
        <el-col :span="3">
          <span>剩余应付：</span
          ><span v-text="(yf - ypay).toFixed(2)">0.00</span>
        </el-col>
      </div>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="paydetailsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="付款人"
        align="center"
        prop="userName"
        v-if="
          this.queryParams.type != 'realsk' && this.queryParams.type != 'refund'
        "
      />
      <el-table-column
        label="付款金额"
        align="center"
        prop="payPrice"
        v-if="
          this.queryParams.type != 'realsk' && this.queryParams.type != 'refund'
        "
      >
      <template slot-scope="scope">
          {{
            Number(scope.row.payPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="付款时间"
        align="center"
        prop="payTime"
        width="180"
        v-if="
          this.queryParams.type != 'realsk' && this.queryParams.type != 'refund'
        "
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="保底服务费期限"
        align="center"
        prop="msfp"
        v-if="
          this.queryParams.type != 'realsk' && this.queryParams.type != 'refund'
        "
      />
      <el-table-column
        label="年息服务费费率"
        align="center"
        prop="rate"
        v-if="
          this.queryParams.type != 'realsk' && this.queryParams.type != 'refund'
        "
      />
      <el-table-column
        label="收款人"
        align="center"
        prop="userName"
        v-if="this.queryParams.type == 'realsk'"
      />
      <el-table-column
        label="收款金额"
        align="center"
        prop="payPrice"
        v-if="this.queryParams.type == 'realsk'"
      >
      <template slot-scope="scope">
          {{
            Number(scope.row.payPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="收款时间"
        align="center"
        prop="payTime"
        v-if="this.queryParams.type == 'realsk'"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="付款人"
        align="center"
        prop="userName"
        v-if="this.queryParams.type == 'refund'"
      />
      <el-table-column
        label="财务退款金额"
        align="center"
        prop="payPrice"
        v-if="this.queryParams.type == 'refund'"
      >
      <template slot-scope="scope">
          {{
            Number(scope.row.payPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="退款时间"
        align="center"
        prop="payTime"
        v-if="this.queryParams.type == 'refund'"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.createTime == null"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.createTime == null"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateOk(scope.row)"
            >完成</el-button
          >
          <el-button
            v-if="scope.row.createTime != null"
            size="mini"
            type="text"
            icon="el-icon-edit"
            >已完成</el-button
          >
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

    <!-- 添加或修改付款明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item
          label="付款金额"
          prop="payPrice"
          v-if="
            this.queryParams.type != 'realsk' &&
            this.queryParams.type != 'refund'
          "
        >
          <el-input v-model="form.payPrice" placeholder="请输入付款金额" />
        </el-form-item>
        <el-form-item
          label="付款时间"
          prop="payTime"
          v-if="
            this.queryParams.type != 'realsk' &&
            this.queryParams.type != 'refund'
          "
        >
          <el-date-picker
            clearable
            size="small"
            v-model="form.payTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择付款时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="收款金额"
          prop="payPrice"
          v-if="this.queryParams.type == 'realsk'"
        >
          <el-input v-model="form.payPrice" placeholder="请输入付款金额" />
        </el-form-item>
        <el-form-item
          label="收款时间"
          prop="payTime"
          v-if="this.queryParams.type == 'realsk'"
        >
          <el-date-picker
            clearable
            size="small"
            v-model="form.payTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择付款时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="退款金额"
          prop="payPrice"
          v-if="this.queryParams.type == 'refund'"
        >
          <el-input v-model="form.payPrice" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item
          label="退款时间"
          prop="payTime"
          v-if="this.queryParams.type == 'refund'"
        >
          <el-date-picker
            clearable
            size="small"
            v-model="form.payTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择退款时间"
          >
          </el-date-picker>
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
import {
  listPaydetails,
  getPaydetails,
  delPaydetails,
  addPaydetails,
  updatePaydetails,
} from "@/api/project/paydetails";
import { getApayment } from "@/api/project/apayment";
import { getFpayment } from "@/api/project/fpayment";
import { getRealsk } from "@/api/project/realsk";
import { getRefund } from "@/api/project/refund";

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
      rules: {},
      ypay: 0.0,
      yf: 0.0,
    };
  },
  created() {
    const type = this.$route.query && this.$route.query.type;
    const pid = this.$route.query && this.$route.query.pid;
    this.queryParams.type = type;
    this.queryParams.pid = pid;
    this.getList();
  },
  methods: {
    /** 查询付款明细列表 */
    getList() {
      this.loading = true;
      listPaydetails(this.queryParams).then((response) => {
        this.paydetailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      if (this.queryParams.type == "apayment") {
        getApayment(this.queryParams.pid).then((response) => {
          this.yf = response.data.actualPrice;
          this.ypay = response.data.ypayPrice;
        });
      }
      if (this.queryParams.type == "fpayment") {
        getFpayment(this.queryParams.pid).then((response) => {
          this.yf = response.data.sjPrice;
          this.ypay = response.data.ypayPrice;
        });
      }
      if (this.queryParams.type == "realsk") {
        getRealsk(this.queryParams.pid).then((response) => {
          this.yf = response.data.jstPrice;
          this.ypay = response.data.ysPrice;
        });
      }
      if (this.queryParams.type == "refund") {
        getRefund(this.queryParams.pid).then((response) => {
          this.yf = response.data.moneyAmount;
          this.ypay = response.data.ytPrice;
        });
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
        createTime: null,
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
      this.ids = selection.map((item) => item.paydetailsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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
      const paydetailsId = row.paydetailsId || this.ids;
      getPaydetails(paydetailsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改付款明细";
      });
    },
    /** 完成按钮操作 */
    handleUpdateOk(row) {
      this.reset();
      const paydetailsId = row.paydetailsId || this.ids;
      getPaydetails(paydetailsId).then((response) => {
        this.form = response.data;
        this.form.isok = "1";
        updatePaydetails(this.form).then((response) => {
          this.msgSuccess("操作成功");
          this.getList();
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.paydetailsId != null) {
            updatePaydetails(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPaydetails(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除付款明细编号为"' + paydetailsIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPaydetails(paydetailsIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "project/paydetails/export",
        {
          ...this.queryParams,
        },
        `project_paydetails.xlsx`
      );
    },
  },
};
</script>
