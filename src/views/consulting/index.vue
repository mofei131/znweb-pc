<template>
  <div class="app-container" style="height: 100%;overflow: auto;margin: 0">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="标题" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="文章来源" prop="source">
        <el-input
          v-model="queryParams.source"
          placeholder="请输入文章来源"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片" prop="img1">
        <el-input
          v-model="queryParams.img1"
          placeholder="请输入图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:consulting:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:consulting:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:consulting:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="consultingList">
      <!-- <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="咨询id" align="center" prop="consultingId" /> -->
      <el-table-column label="标题" align="center" prop="name" />
      <el-table-column label="文章来源" align="center" prop="source" />
      <el-table-column label="图片" align="center" prop="img1">
        <template slot-scope="scope">
          <img :src="scope.row.img1" alt="" width="100px" height="30px" />
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          {{
            scope.row.state == "0"
              ? "显示"
              : scope.row.state == "1"
              ? "不显示"
              : ""
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容" align="center" prop="content" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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

    <!-- 添加或修改咨询对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :before-close="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="文章来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入文章来源" />
        </el-form-item>
        <el-form-item label="图片" prop="img1">
          <!-- <el-input v-model="form.img1" placeholder="请输入图片" /> -->
          <el-upload
            :action="action"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :headers="headers"
            :file-list="fileList"
            :on-success="handleUploadSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option
              v-for="dict in stateOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192" />
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
  listConsulting,
  getConsulting,
  delConsulting,
  addConsulting,
  updateConsulting,
} from "@/api/home/consulting";
import { getToken } from "@/utils/auth";
export default {
  name: "Consulting",
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + "/central/home/uploadImg",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      dialogVisible: false,
      fileList: [],
      dialogImageUrl: "",
      filePath: [],
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
      // 咨询表格数据
      consultingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      typeOptions: [],
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        source: null,
        img1: null,
        type: null,
        state: null,
        content: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("consulting_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("consulting_state").then((response) => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
      console.log(file);
    },

    handleUploadSuccess(file) {
      console.log(file);
      this.filePath.push(file.data.value);
    },

    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.type);
    },
    /** 查询咨询列表 */
    getList() {
      this.loading = true;
      listConsulting(this.queryParams).then((response) => {
        this.consultingList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
        console.log(response);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
      this.filePath = [];
      this.fileList = [];
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        source: null,
        img1: null,
        type: null,
        state: null,
        content: null,
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
      this.ids = selection.map((item) => item.consultingId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加咨询";
      this.fileList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改咨询";
      this.filePath.push(row.img1);
      this.fileList.push({ url: row.img1 });
      // const consultingId = row.consultingId || this.ids;
      // getConsulting(consultingId).then((response) => {

      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            if (this.filePath == null) {
              updateConsulting(this.form).then((response) => {
                this.msgSuccess("修改成功");
                // this.open = false;
                // location.reload();
                this.cancel();
              });
            } else {
              this.filePath.forEach((item) => {
                this.form.img1 = item;
                updateConsulting(this.form).then((response) => {
                  this.msgSuccess("修改成功");
                  // this.open = false;
                  // location.reload();
                  this.cancel();
                });
              });
            }
          } else {
            let code = 0;

            this.filePath.forEach((item) => {
              debugger;
              this.form.img1 = item;
              console.log(this.form);
              addConsulting(this.form).then((response) => {
                code = response.code;
                this.msgSuccess("新增成功");
                // this.form = {};
                // this.open = false;
                // location.reload();
                this.cancel();
              });
            });
            if (code == 200) {
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const consultingIds = row.id || this.ids;
      this.$confirm('是否确认删除咨询?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delConsulting(consultingIds);
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
        "system/consulting/export",
        {
          ...this.queryParams,
        },
        `system_consulting.xlsx`
      );
    },
    closeDialog(done) {
      done();
      // location.reload();
      this.cancel();
      // console.log(this.filePath);
      //   this.getList();
    },
  },
};
</script>
