<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="代办人" prop="sqId">
        <el-select filterable v-model="queryParams.userId" placeholder="请选择代办人" clearable size="small">
          <el-option
            v-for="dict in userOptions"
            :key="dict.userId"
            :label="dict.nickName"
            :value="dict.userId"
          />
        </el-select>
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
      <el-col :span="3" style="margin-left:12px;">
        <span>期初占用(万元)：</span> <span v-text="$options.filters.moneyFilter(tqc)">0.00</span>
      </el-col>
      <el-col :span="3" >
        <span>期末占用(万元)：</span><span v-text="$options.filters.moneyFilter(tqm)">0.00</span>
      </el-col>
      <el-col :span="3" >
        <span>平均占用(万元)：</span><span v-text="$options.filters.moneyFilter(tpj)">0.00</span>
      </el-col>
      <el-col :span="3" >
        <span>收入金额(万元)：</span><span v-text="$options.filters.moneyFilter(tsr)">0.00</span>
      </el-col>
      <el-col :span="3" >
        <span>资金周转率：</span><span v-text="tzz">0.00</span>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['project:atakeup:add']"-->
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
<!--          v-hasPermi="['project:atakeup:edit']"-->
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
<!--          v-hasPermi="['project:atakeup:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:atakeup:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="atakeupList" @selection-change="handleSelectionChange">
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="期初占用(万元)" align="center" prop="starPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.starPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="期末占用(万元)" align="center" prop="endPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.endPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="平均占用(万元)" align="center" prop="pjPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.pjPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="收入金额(万元)" align="center" prop="profitsPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.profitsPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="资金周转率" align="center" prop="ct" />
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:atakeup:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:atakeup:remove']"-->
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

    <!-- 添加或修改资金占用情况对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="代办人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入代办人id" />
        </el-form-item>
        <el-form-item label="代办人" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入代办人" />
        </el-form-item>
        <el-form-item label="期初占用(万元)" prop="starPrice">
          <el-input v-model="form.starPrice" placeholder="请输入期初占用(万元)" />
        </el-form-item>
        <el-form-item label="期末占用(万元)" prop="endPrice">
          <el-input v-model="form.endPrice" placeholder="请输入期末占用(万元)" />
        </el-form-item>
        <el-form-item label="平均占用(万元)" prop="pjPrice">
          <el-input v-model="form.pjPrice" placeholder="请输入平均占用(万元)" />
        </el-form-item>
        <el-form-item label="收入金额(万元)" prop="profitsPrice">
          <el-input v-model="form.profitsPrice" placeholder="请输入收入金额(万元)" />
        </el-form-item>
        <el-form-item label="资金周转率" prop="ct">
          <el-input v-model="form.ct" placeholder="请输入资金周转率" />
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
import { listAtakeup, getAtakeup, delAtakeup, addAtakeup, updateAtakeup, listAtakeupAll } from "@/api/project/atakeup";
import {getUserList} from "@/api/project/cplan";
import {getStList} from "@/api/project/gry";

export default {
  name: "Atakeup",
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
      // 资金占用情况表格数据
      atakeupList: [],
      //代办人集合
      userOptions:[],
      // 日期范围
      dateRange: [],
      //期初合计
      tqc:null,
      //期末合计
      tqm:null,
      //平均合计
      tpj:null,
      //收入合计
      tsr:null,
      //周转率合计
      tzz:null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    getUserList().then(response => {
      this.userOptions = response.rows;
      this.user2Options = response.rows;
    });
  },
  methods: {
    /** 查询资金占用情况列表 */
    getList() {
      this.loading = true;
      listAtakeup(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.atakeupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listAtakeupAll(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.tqc = parseFloat(response.data.tqm).toFixed(2);
        this.tqm = parseFloat(response.data.tqc).toFixed(2);
        this.tpj = parseFloat(response.data.tpj).toFixed(2);
        this.tsr = parseFloat(response.data.tsr).toFixed(2);
        this.tzz = parseFloat(response.data.tzz).toFixed(2);
      });
      getStList().then(response => {
        this.stOptions = response.rows;
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
        atakeupId: null,
        deptId: null,
        deptName: null,
        userId: null,
        userName: null,
        starPrice: null,
        endPrice: null,
        pjPrice: null,
        profitsPrice: null,
        ct: null,
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
      this.ids = selection.map(item => item.atakeupId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资金占用情况";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const atakeupId = row.atakeupId || this.ids
      getAtakeup(atakeupId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资金占用情况";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.atakeupId != null) {
            updateAtakeup(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAtakeup(this.form).then(response => {
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
      const atakeupIds = row.atakeupId || this.ids;
      this.$confirm('是否确认删除资金占用情况?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAtakeup(atakeupIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/atakeup/export', {
        ...this.queryParams
      }, `project_atakeup.xlsx`)
    }
  }
};
</script>
