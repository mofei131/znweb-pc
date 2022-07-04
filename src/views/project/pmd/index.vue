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
      <el-form-item label="公司名称" prop="cname">
        <el-input
          v-model="queryParams.cname"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统计时间">
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
      <el-col :span="21" style="margin-left:12px;font-size: 14px;">
        <span>应付金额(元)：</span> <span v-text="$options.filters.moneyFilter(yfp)">0.00</span>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['project:pmd:add']"-->
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
<!--          v-hasPermi="['project:pmd:edit']"-->
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
<!--          v-hasPermi="['project:pmd:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:pmd:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pmdList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="对象" align="center" prop="obj" />
      <el-table-column label="公司名称" align="center" prop="cname" />
      <el-table-column label="时间" align="center" prop="time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="已收票吨数(吨)" align="center" prop="number" >
        <template slot-scope="scope">
                    {{
                      Number(scope.row.number)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="发生金额(元)" align="center" prop="price" >
        <template slot-scope="scope">
          {{
            Number(scope.row.price)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>

    </el-table>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:pmd:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:pmd:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->



    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改应付管理明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="项目名称" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="对象" prop="obj">
          <el-input v-model="form.obj" placeholder="请输入对象" />
        </el-form-item>
        <el-form-item label="公司名称" prop="cname">
          <el-input v-model="form.cname" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker clearable size="small"
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="已收票吨数" prop="number">
          <el-input v-model="form.number" placeholder="请输入已收票吨数" />
        </el-form-item>
        <el-form-item label="发生金额(元)" prop="price">
          <el-input v-model="form.price" placeholder="请输入发生金额(元)" />
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
import { listPmd, getPmd, delPmd, addPmd, updatePmd, listPmdAll } from '@/api/project/pmd'
import { getStList } from '@/api/project/cplan'

export default {
  name: "Pmd",
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
      // 应付管理明细表格数据
      pmdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        cname: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 项目集合
      stOptions: [],
      // 日期范围
      dateRange: [],
      //应付金额
      yfp:0.00,
    };
  },
  created() {
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
  },
  methods: {
    /** 查询应付管理明细列表 */
    getList() {
      this.loading = true;
      listPmd(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.pmdList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listPmdAll(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.yfp = parseFloat(response.data.yfp).toFixed(2);
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
        pmdId: null,
        stId: null,
        stName: null,
        obj: null,
        cname: null,
        time: null,
        type: null,
        number: null,
        price: null,
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
      this.ids = selection.map(item => item.pmdId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加应付管理明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pmdId = row.pmdId || this.ids
      getPmd(pmdId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改应付管理明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pmdId != null) {
            updatePmd(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPmd(this.form).then(response => {
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
      const pmdIds = row.pmdId || this.ids;
      this.$confirm('是否确认删除应付管理明细编号为"' + pmdIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPmd(pmdIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/pmd/export', {
        ...this.queryParams
      }, `project_pmd.xlsx`)
    }
  }
};
</script>
