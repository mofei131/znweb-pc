<template>
  <div class="app-container" style="height: 100%;overflow: auto;margin: 0">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="图片" prop="img1">
        <el-input
          v-model="queryParams.img1"
          placeholder="请输入图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType">
        <el-select
          v-model="queryParams.jumpType"
          placeholder="请选择跳转类型"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转信息" prop="jumpPath">
        <el-input
          v-model="queryParams.jumpPath"
          placeholder="请输入跳转信息"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示位置" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择显示位置"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          v-hasPermi="['system:banner:edit']"
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
          v-hasPermi="['system:banner:remove']"
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
          v-hasPermi="['system:banner:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bannerList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="bannerId" /> -->
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="图片" align="center" prop="img1">
        <template slot-scope="scope">
          <img :src="scope.row.img1" alt="" width="100px" height="30px" />
        </template>
      </el-table-column>
      <el-table-column label="跳转类型" align="center" prop="jumpType">
        <template slot-scope="scope">
          {{ scope.row.jumpType == "1" ? "跳转" : "不跳转" }}
        </template>
      </el-table-column>
      <el-table-column label="跳转信息" align="center" prop="jumpPath" />
      <el-table-column
        label="显示位置"
        align="center"
        prop="type"
        :formatter="typeFormat"
      />
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

    <!-- 添加或修改banner对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :before-close="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <!-- <el-form-item label="图片" prop="img1">
          <el-input v-model="form.img1" placeholder="请输入图片" />
        </el-form-item> -->
        <el-form-item label="跳转类型" prop="jumpType">
          <!-- <el-input v-model="form.jumpType" placeholder="请输入跳转类型" /> -->
          <el-select v-model="form.jumpType" placeholder="请选择">
            <el-option
              v-for="dict in jumpTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转信息" prop="jumpPath">
          <el-input v-model="form.jumpPath" placeholder="请输入跳转信息" />
        </el-form-item>
        <el-form-item label="显示位置" prop="type">
          <el-select v-model="form.type" placeholder="请选择显示位置">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
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
  listBanner,
  getBanner,
  delBanner,
  addBanner,
  updateBanner,
} from "@/api/home/home";
import { getToken } from "@/utils/auth";
export default {
  name: "Banner",
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
      // banner表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        img1: null,
        jumpType: null,
        jumpPath: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      jumpTypeOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("banner_address").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("jump_type").then((response) => {
      this.jumpTypeOptions = response.data;
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
      console.log(this.filePath);
    },

    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    /** 查询banner列表 */
    getList() {
      this.loading = true;
      listBanner(this.queryParams).then((response) => {
        this.bannerList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
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
        bannerId: null,
        name: null,
        img1: null,
        jumpType: null,
        jumpPath: null,
        type: null,
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
      this.ids = selection.map((item) => item.bannerId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.open = true;
      this.title = "添加banner";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.open = true;
      this.title = "修改banner";
      this.fileList.push({ url: row.img1 });
      this.filePath.push(row.img1);
      // const bannerId = row.bannerId || this.ids;
      // getBanner(bannerId).then((response) => {

      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form.id);
          if (this.form.id != null) {
            if (this.filePath == null) {
              updateBanner(this.form).then((response) => {
                this.msgSuccess("修改成功");
                // this.open = false;
                // this.getList();
                this.cancel();
              });
            } else {
              this.filePath.forEach((item) => {
                this.form.img1 = item;
                updateBanner(this.form).then((response) => {
                  this.msgSuccess("修改成功");
                  // this.open = false;
                  // this.getList();
                  this.cancel();
                });
              });
            }
            // this.filePath.forEach((item) => {
            // debugger;
            // this.form.img1 = item;
            // updateBanner(this.form).then((response) => {
            //   this.msgSuccess("修改成功");
            //   // this.open = false;
            //   // this.getList();
            //   this.cancel();
            // });
            // });
          } else {
            this.filePath.forEach((item) => {
              this.form.img1 = item;
              addBanner(this.form).then((response) => {
                this.msgSuccess("新增成功");
                // this.open = false;
                // this.getList();
                this.cancel();
              });
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bannerIds = row.id || this.ids;
      this.$confirm('是否确认删除banner?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBanner(bannerIds);
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
        "system/banner/export",
        {
          ...this.queryParams,
        },
        `system_banner.xlsx`
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
