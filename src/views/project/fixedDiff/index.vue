<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="业务id" prop="stId">
        <el-input
          v-model="queryParams.stId"
          placeholder="请输入业务id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input
          v-model="queryParams.stName"
          placeholder="请输入业务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库重量(吨)" prop="exWarehouseWeight">
        <el-input
          v-model="queryParams.exWarehouseWeight"
          placeholder="请输入出库重量(吨)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="固定差价" prop="fixedPriceDiff">
        <el-input
          v-model="queryParams.fixedPriceDiff"
          placeholder="请输入固定差价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="差价利润(元)" prop="diffProfit">
        <el-input
          v-model="queryParams.diffProfit"
          placeholder="请输入差价利润(元)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:fixedDiff:add']"
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
          v-hasPermi="['project:fixedDiff:edit']"
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
          v-hasPermi="['project:fixedDiff:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:fixedDiff:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="fixedDiffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="删除标志" align="center" prop="id" />
      <el-table-column label="业务id" align="center" prop="stId" />
      <el-table-column label="业务名称" align="center" prop="stName" /> -->
      <el-table-column label="出库重量(吨)" align="center" prop="exWarehouseWeight" />
      <el-table-column label="固定差价(元)" align="center" prop="fixedPriceDiff" />
      <el-table-column label="差价利润(元)" align="center" prop="diffProfit" />
      <!-- <el-table-column label="删除标志" align="center" prop="delFlg" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:fixedDiff:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:fixedDiff:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改固定差价明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="业务id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入业务id" />
        </el-form-item>
        <el-form-item label="业务名称" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入业务名称" />
        </el-form-item>
        <el-form-item label="出库重量(吨)" prop="exWarehouseWeight">
          <el-input v-model="form.exWarehouseWeight" placeholder="请输入出库重量(吨)" />
        </el-form-item>
        <el-form-item label="固定差价" prop="fixedPriceDiff">
          <el-input v-model="form.fixedPriceDiff" placeholder="请输入固定差价" />
        </el-form-item>
        <el-form-item label="差价利润(元)" prop="diffProfit">
          <el-input v-model="form.diffProfit" placeholder="请输入差价利润(元)" />
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
import { listFixedDiff, getFixedDiff, delFixedDiff, addFixedDiff, updateFixedDiff } from "@/api/project/fixedDiff";

export default {
  name: "FixedDiff",
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
      // 固定差价明细表格数据
      fixedDiffList: [],
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
        exWarehouseWeight: null,
        fixedPriceDiff: null,
        diffProfit: null,
        delFlg: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delFlg: [
          { required: true, message: "删除标志不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询固定差价明细列表 */
    getList() {
      this.loading = true;
      listFixedDiff(this.queryParams).then(response => {
        this.fixedDiffList = response.rows;
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
        id: null,
        stId: null,
        stName: null,
        exWarehouseWeight: null,
        fixedPriceDiff: null,
        diffProfit: null,
        delFlg: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加固定差价明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFixedDiff(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改固定差价明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFixedDiff(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFixedDiff(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除固定差价明细编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFixedDiff(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/fixedDiff/export', {
        ...this.queryParams
      }, `project_fixedDiff.xlsx`)
    }
  }
};
</script>