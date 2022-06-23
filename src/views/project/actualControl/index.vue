<template>
  <div class="app-container">
    <div class="text" style="display: flex">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <!-- <el-form-item label="实控人姓名" prop="actualControlPerson">
        <el-input
          v-model="queryParams.actualControlPerson"
          placeholder="请输入实控人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在单位" prop="org">
        <el-input
          v-model="queryParams.org"
          placeholder="请输入所在单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系手机" prop="contactMobile">
        <el-input
          v-model="queryParams.contactMobile"
          placeholder="请输入联系手机"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idMumber">
        <el-input
          v-model="queryParams.idMumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职务" prop="post">
        <el-input
          v-model="queryParams.post"
          placeholder="请输入职务"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
        <el-form-item prop="org">
          <el-input
            v-model="queryParams.org"
            placeholder="公司名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >查询</el-button
          >
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
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
            v-hasPermi="['project:actualControl:add']"
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
          v-hasPermi="['project:actualControl:edit']"
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
          v-hasPermi="['project:actualControl:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:actualControl:export']"
        >导出</el-button>
      </el-col> -->
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="actualControlList"
      @selection-change="handleSelectionChange"
      stripe
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column
        label="客户姓名"
        align="center"
        prop="actualControlPerson"
      />
      <el-table-column label="所在单位" align="center" prop="org" />
      <el-table-column label="职务" align="center" prop="post" />
      <el-table-column label="联系手机" align="center" prop="contactMobile" />
      <el-table-column label="身份证号" align="center" prop="idMumber" />
      <!-- <el-table-column label="办公电话" align="center" prop="officeTelephone" />
      <el-table-column label="删除标志" align="center" prop="delFlg" /> -->
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
            v-hasPermi="['project:actualControl:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:actualControl:remove']"
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

    <!-- 添加或修改实控人管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实控人姓名" prop="actualControlPerson">
          <el-input
            v-model="form.actualControlPerson"
            placeholder="请输入实控人姓名"
          />
        </el-form-item>
        <el-form-item label="所在单位" prop="org">
          <el-input v-model="form.org" placeholder="请输入所在单位" />
        </el-form-item>
        <el-form-item label="联系手机" prop="contactMobile">
          <el-input v-model="form.contactMobile" placeholder="请输入联系手机" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idMumber">
          <el-input v-model="form.idMumber" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-input v-model="form.post" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item label="办公电话" prop="officeTelephone">
          <el-input
            v-model="form.officeTelephone"
            placeholder="请输入办公电话"
          />
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
  listActualControl,
  getActualControl,
  delActualControl,
  addActualControl,
  updateActualControl,
} from "@/api/project/actualControl";

export default {
  name: "ActualControl",
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
      // 实控人管理表格数据
      actualControlList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        actualControlPerson: null,
        org: null,
        contactMobile: null,
        idMumber: null,
        post: null,
        officeTelephone: null,
        delFlg: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        delFlg: [
          { required: true, message: "删除标志不能为空", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询实控人管理列表 */
    getList() {
      this.loading = true;
      listActualControl(this.queryParams).then((response) => {
        this.actualControlList = response.rows;
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
        actualControlPerson: null,
        org: null,
        contactMobile: null,
        idMumber: null,
        post: null,
        officeTelephone: null,
        delFlg: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实控人管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getActualControl(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实控人管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateActualControl(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActualControl(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除实控人管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delActualControl(ids);
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
        "project/actualControl/export",
        {
          ...this.queryParams,
        },
        `project_actualControl.xlsx`
      );
    },
  },
};
</script>
<style>
.text {
  display: flex;
  justify-content: space-between;
}
</style>