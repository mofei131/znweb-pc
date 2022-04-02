<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="stId">
        <el-select filterable v-model="queryParams.stId" placeholder="请选择项目" clearable size="small">
          <el-option
            v-for="dict in stOptions"
            :key="dict.stId"
            :label="dict.name"
            :value="dict.stId"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="客户经理" prop="name">
        <el-input
          v-model="queryParams.managerName"
          placeholder="请输入客户经理"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统计时间" prop="createTime">
        <el-date-picker clearable size="small"
                        v-model="queryParams.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择统计时间">
        </el-date-picker>
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
        <span>资金周转率：</span><span v-text="$options.filters.moneyFilter(tzz)">0.00</span>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['project:ptakeup:add']"-->
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
<!--          v-hasPermi="['project:ptakeup:edit']"-->
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
<!--          v-hasPermi="['project:ptakeup:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:ptakeup:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ptakeupList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="立项时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
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
<!--      <el-table-column label="资金占用情况(万元)" align="center" prop="takeupPrice" >-->
<!--        <template slot-scope="scope">-->
<!--          {{-->
<!--            Number(scope.row.takeupPrice)-->
<!--              .toFixed(2)-->
<!--              .toString()-->
<!--              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="收入金额(万元)" align="center" prop="profitsPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.profitsPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="资金周转率" align="center" prop="ct" />
<!--      <el-table-column label="项目审核状态" align="center" prop="stState" :formatter="stateFormat"/>-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:ptakeup:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:ptakeup:remove']"-->
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

    <!-- 添加或修改项目资金占用情况对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="项目名称" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="资金占用情况(万元)" prop="takeupPrice">
          <el-input v-model="form.takeupPrice" placeholder="请输入资金占用情况(万元)" />
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
import { listPtakeup, getPtakeup, delPtakeup, addPtakeup, updatePtakeup, listPtakeupAll } from "@/api/project/ptakeup";
import {getStList, getUserList} from "@/api/project/cplan";

export default {
  name: "Ptakeup",
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
      // 项目资金占用情况表格数据
      ptakeupList: [],
      // 项目集合
      stOptions: [],
      //代办人集合
      userOptions:[],
      //审核状态集合
      stateOptions:[],
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
        stId: null,
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
    getStList().then(response => {
      this.stOptions = response.rows;
    });
    getUserList().then(response => {
      this.userOptions = response.rows;
      this.user2Options = response.rows;
    });
    this.getDicts("project_approval_state").then(response => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    /** 查询项目资金占用情况列表 */
    getList() {
      this.loading = true;
      listPtakeup(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.ptakeupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listPtakeupAll(this.queryParams).then(response => {
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
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ptakeupId: null,
        stId: null,
        stName: null,
        takeupPrice: null,
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
      this.ids = selection.map(item => item.ptakeupId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目资金占用情况";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ptakeupId = row.ptakeupId || this.ids
      getPtakeup(ptakeupId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目资金占用情况";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ptakeupId != null) {
            updatePtakeup(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPtakeup(this.form).then(response => {
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
      const ptakeupIds = row.ptakeupId || this.ids;
      this.$confirm('是否确认删除项目资金占用情况?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPtakeup(ptakeupIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/ptakeup/export', {
        ...this.queryParams
      }, `project_ptakeup.xlsx`)
    }
  }
};
</script>
