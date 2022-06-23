<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站台名称" prop="carrier">
        <el-input
          v-model="queryParams.ztName"
          placeholder="请输入站台名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="公司名称" prop="ztName">
        <el-input
          v-model="queryParams.ztName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发运方式" prop="shipVia">
        <el-input
          v-model="queryParams.shipVia"
          placeholder="请输入发运方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="承运单位" prop="carrier">
        <el-input
          v-model="queryParams.carrier"
          placeholder="请输入承运单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="承运方性质" prop="nature">
        <el-input
          v-model="queryParams.nature"
          placeholder="请输入承运方性质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['project:platform:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['project:platform:edit']"
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
          v-hasPermi="['project:platform:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:platform:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="platformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="站台名称" align="center" prop="ztName" />
      <el-table-column label="站台发运方式" align="center" prop="shipVia" />
      <el-table-column label="承运单位" align="center" prop="carrier" />
      <el-table-column label="承运方性质" align="center" prop="nature" />
 <!--     <el-table-column label="备注说明" align="center" prop="node" />
      <el-table-column label="删除标志" align="center" prop="delFlg" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:platform:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:platform:remove']"
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

    <!-- 添加或修改站台管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
        <el-col :span="12">
        <el-form-item label="站台名称" prop="ztName">
          <el-input v-model="form.ztName" placeholder="请输入站台名称" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="发运方式" prop="shipVia">
          <!-- <el-input v-model="form.shipVia" placeholder="请输入发运方式" /> -->
          <el-select
            v-model="form.shipVia"
            placeholder="请选择发运方式"
            style="width: 100%"
          >
            <el-option label="独立立户" value="独立立户" />
            <el-option label="第三方代发" value="第三方代发" />
          </el-select>
        </el-form-item>
        </el-col>
        </el-row>
        <el-row v-if="form.shipVia == '第三方代发'">
        <el-col :span="12">
        <el-form-item label="承运单位" prop="carrier">
          <el-input v-model="form.carrier" placeholder="请输入承运单位" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <!-- <el-form-item label="承运方性质" prop="nature">
          <el-input v-model="form.nature" placeholder="请输入承运方性质" />
        </el-form-item> -->
        <el-form-item label="承运方性质" prop="nature">
          <el-select
            v-model="form.nature"
            placeholder="请选择承运方性质"
            style="width: 100%"
          >
            <el-option label="国有企业" value="国有企业" />
            <el-option label="上市公司" value="上市公司" />
            <el-option label="私营企业" value="私营企业" />
          </el-select>
        </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="备注说明" prop="node">
          <el-input v-model="form.node" type="textarea" placeholder="请输入内容" />
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
import { listPlatform, getPlatform, delPlatform, addPlatform, updatePlatform } from "@/api/project/platform";

export default {
  name: "Platform",
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
      // 站台管理表格数据
      platformList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ztName: null,
        shipVia: null,
        carrier: null,
        nature: null,
        node: null,
        delFlg: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ztName: [
          { required: true, message: "站台名称不能为空", trigger: "blur" }
        ],
        shipVia: [
          { required: true, message: "发运方式不能为空", trigger: "blur" }
        ],
        carrier: [
          { required: true, message: "承运单位不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询站台管理列表 */
    getList() {
      this.loading = true;
      listPlatform(this.queryParams).then(response => {
        this.platformList = response.rows;
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
        ztName: null,
        shipVia: null,
        carrier: null,
        nature: null,
        node: null,
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
      this.isLook = 1;
      this.editForm = false;
      this.reset();
      this.open = true;
      this.title = "添加站台管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlatform(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改站台管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlatform(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlatform(this.form).then(response => {
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
      this.$confirm('是否确认删除站台管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPlatform(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/platform/export', {
        ...this.queryParams
      }, `project_platform.xlsx`)
    }
  }
};
</script>
