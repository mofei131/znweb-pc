<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递名称" prop="kdName">
        <el-input
          v-model="queryParams.kdName"
          placeholder="请输入快递名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递单号" prop="kdNumber">
        <el-input
          v-model="queryParams.kdNumber"
          placeholder="请输入快递单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['project:kd:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['project:kd:edit']"-->
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
<!--          v-hasPermi="['project:kd:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:kd:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kdList" @selection-change="handleSelectionChange">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="快递名称" align="center" prop="kdName" />
      <el-table-column label="快递单号" align="center" prop="kdNumber" />
      <el-table-column label="快递物品" align="center" prop="kdWp" />
      <el-table-column label="发出时间" align="center" prop="kdTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注说明" align="center" prop="node" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:kd:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:kd:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:kd:remove']"
          >删除</el-button>
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

    <!-- 添加或修改快递记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="快递名称" prop="kdName">
          <el-input v-model="form.kdName" placeholder="请输入快递名称" />
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
        <el-form-item label="快递单号" prop="kdNumber">
          <el-input v-model="form.kdNumber" placeholder="请输入快递单号" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="快递物品" prop="kdWp">
          <el-input v-model="form.kdWp" placeholder="请输入快递物品" />
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
        <el-form-item label="发出时间" prop="kdTime">
          <el-date-picker clearable size="small" style="width: 100%;"
            v-model="form.kdTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发出时间">
          </el-date-picker>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="备注说明" prop="node">
          <el-input v-model="form.node" placeholder="请输入备注说明" />
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listKd, getKd, delKd, addKd, updateKd } from "@/api/project/kd";

export default {
  name: "Kd",
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
      // 快递记录表格数据
      kdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        kdName: null,
        kdNumber: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        kdName: [
          { required: true, message: "请输入快递名称", trigger: "blur" }
        ],
        kdNumber: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ],
        kdWp: [
          { required: true, message: "请输入快递物品", trigger: "blur" }
        ],
        kdTime: [
          { required: true, message: "请选择发出时间", trigger: "blur" }
        ],
        node: [
          { required: true, message: "请输入备注说明", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询快递记录列表 */
    getList() {
      this.loading = true;
      listKd(this.queryParams).then(response => {
        this.kdList = response.rows;
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
        kdId: null,
        name: null,
        kdName: null,
        kdNumber: null,
        kdWp: null,
        kdTime: null,
        node: null,
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
      this.ids = selection.map(item => item.kdId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加快递记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const kdId = row.kdId || this.ids
      getKd(kdId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快递记录";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const kdId = row.kdId || this.ids
      this.$router.push("/kd/look/" + kdId);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.kdId != null) {
            updateKd(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKd(this.form).then(response => {
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
      const kdIds = row.kdId || this.ids;
      this.$confirm('是否确认删除快递记录?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delKd(kdIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/kd/export', {
        ...this.queryParams
      }, `project_kd.xlsx`)
    }
  }
};
</script>
