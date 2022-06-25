<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-select v-model="queryParams.month" placeholder="请选择月份" clearable size="small">
          <el-option label="1月" value="1月" />
          <el-option label="2月" value="2月" />
          <el-option label="3月" value="3月" />
          <el-option label="4月" value="4月" />
          <el-option label="5月" value="5月" />
          <el-option label="6月" value="6月" />
          <el-option label="7月" value="7月" />
          <el-option label="8月" value="8月" />
          <el-option label="9月" value="9月" />
          <el-option label="10月" value="10月" />
          <el-option label="11月" value="11月" />
          <el-option label="12月" value="12月" />
        </el-select>
      </el-form-item>
      <el-form-item label="代办人" prop="userId">
        <el-select filterable v-model="queryParams.userId" placeholder="请选择代办人" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input v-model="queryParams.stName" placeholder="请输入业务名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目编号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:cplan:add']">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:cplan:edit']"-->
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
      <!--          v-hasPermi="['project:cplan:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:cplan:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cplanList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="代办人" align="center" prop="userName" />
      <el-table-column label="月份" align="center" prop="month" />
      <el-table-column label="数量(吨)" align="center" prop="number">
        <template slot-scope="scope">
          {{
          Number(scope.row.number)
          .toFixed(3)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="预计付款时间" align="center" prop="fkTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fkTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计付款金额(元)" align="center" prop="fkPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.fkPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="预计收款时间" align="center" prop="skTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.skTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计收款金额(元)" align="center" prop="skPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.skPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleLook(scope.row)"-->
      <!--            v-hasPermi="['project:cplan:edit']"-->
      <!--          >查看</el-button>-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--            v-hasPermi="['project:cplan:edit']"-->
      <!--          >修改</el-button>-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--            v-hasPermi="['project:cplan:remove']"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改资金计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectId">
              <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                placeholder="请选择项目" style="width: 100%">
                <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="stId">
              <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                style="width: 100%">
                <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="serialNo">
              {{ form.serialNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代办人" prop="userId">
              <el-select filterable value-key="userId" @change="changeUser" v-model="form.userId" placeholder="请选择代办人"
                style="width: 100%">
                <el-option v-for="obj in userOptions" :key="obj.userId" :label="obj.nickName" :value="obj"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button size="small" type="primary" @click="addTableData" style="margin-bottom: 30px" v-if="isLook != 3">
              添加计划</el-button>
          </el-col>
        </el-row>
        <!--资金计划-->
        <div>
          <el-row>
            <el-col :span="24">
              <el-table ref="singleTable" :data="form.tableData" style="width: 100%">
                <el-table-column label="月份" width="110px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.month'" :rules="rules.month">
                      <el-select v-model="scope.row.month" size="small">
                        <el-option label="1月" value="1月" />
                        <el-option label="2月" value="2月" />
                        <el-option label="3月" value="3月" />
                        <el-option label="4月" value="4月" />
                        <el-option label="5月" value="5月" />
                        <el-option label="6月" value="6月" />
                        <el-option label="7月" value="7月" />
                        <el-option label="8月" value="8月" />
                        <el-option label="9月" value="9月" />
                        <el-option label="10月" value="10月" />
                        <el-option label="11月" value="11月" />
                        <el-option label="12月" value="12月" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="数量(吨)" width="120px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.number'" :rules="rules.number">
                      <el-input size="small" v-model="scope.row.number" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="预计付款时间" width="150px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.fkTime'" :rules="rules.fkTime">
                      <el-date-picker clearable size="small" style="width: 100%" v-model="scope.row.fkTime" type="date"
                        value-format="yyyy-MM-dd" placeholder="请选择">
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="预计付款总额(元)" width="120px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.fkPrice'"
                      :rules="rules.fkPrice">
                      <el-input size="small" v-model="scope.row.fkPrice" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="预计收款时间" width="150px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.skTime'" :rules="rules.skTime">
                      <el-date-picker clearable size="small" style="width: 100%" v-model="scope.row.skTime" type="date"
                        value-format="yyyy-MM-dd" placeholder="请选择">
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="预计收款总额(元)" width="120px">
                  <template slot-scope="scope">
                    <el-form-item label-width="0" :prop="'tableData.' + scope.$index + '.skPrice'"
                      :rules="rules.skPrice">
                      <el-input size="small" v-model="scope.row.skPrice" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="isLook != 3">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="
                      deleteRow(scope.$index, form.tableData)
                    " type="text" size="small">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="isDisabled" v-if="isLook != 3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCplan,
  getCplan,
  delCplan,
  addCplan,
  updateCplan,
  getStList,
  getUserList,
  listForBus,
  listForPro,
} from "@/api/project/cplan";

export default {
  name: "Cplan",
  data() {
    // 两位小数点验证
    const validatePrice = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (value != 0 && (value == null || value == "")) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
      } else {
        callback();
      }
    };
    // 可空无两位小数点
    const validatePrice3 = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (value != null && value != "") {
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      isLook: 1,
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
      // 资金计划表格数据
      cplanList: [],
      // 项目集合
      stOptions: [],
      projectOptions: [],
      //代办人集合
      userOptions: [],
      //资金计划集合
      // tableData: [],
      //审核状态集合
      stateOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        userId: null,
        month: null,
        createTime: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务", trigger: "blur" }],
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        userId: [{ required: true, message: "请选择代办人", trigger: "blur" }],
        // month: [
        //   { required: true, message: "请选择月份", trigger: "blur" }
        // ],
        // number: [
        //   { required: true, message: "数量不能为空", trigger: "blur" }
        // ],
        // fkTime: [
        //   { required: true, message: "请选择预计付款时间", trigger: "blur" }
        // ],
        number: [{ validator: validatePrice3, trigger: "blur" }],
        fkPrice: [{ validator: validatePrice3, trigger: "blur" }],
        // skTime: [
        //   { required: true, message: "请选择预计收款时间", trigger: "blur" }
        // ],
        skPrice: [{ validator: validatePrice3, trigger: "blur" }],
      },
      isDisabled: false,
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
    });
    getStList().then((response) => {
      this.stOptions = response.rows;
    });
    getUserList().then((response) => {
      this.userOptions = response.rows;
    });
  },
  methods: {
    /** 查询资金计划列表 */
    getList() {
      this.loading = true;
      listCplan(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.cplanList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      getStList().then((response) => {
        this.stOptions = response.rows;
      });
      // 业务
      listForBus().then((response) => {
        this.listForBusArr = response.data
      })
      // 项目
      listForPro().then((response) => {
        this.listForProArr = response.data
      })
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
        cplanId: null,
        stId: null,
        stId2: null,
        stName: null,
        userId: null,
        userId2: null,
        userName: null,
        month: null,
        number: null,
        fkTime: null,
        fkPrice: null,
        skTime: null,
        skPrice: null,
        state: null,
        createBy: null,
        createTime: null,
        tableData: [],
        projectId: null,
        projectIdOld: null,
        projectName: null,
        serialNo: null
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
      this.ids = selection.map((item) => item.cplanId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isLook = 1;
      this.open = true;
      this.title = "添加资金计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cplanId = row.cplanId || this.ids;
      getCplan(cplanId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.userId2 = this.form.userId;
        this.form.userId = this.form.userName;
        this.isLook = 2;
        this.open = true;
        this.title = "修改资金计划";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const cplanId = row.cplanId || this.ids;
      getCplan(cplanId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.userId2 = this.form.userId;
        this.form.userId = this.form.userName;
        this.isLook = 3;
        this.open = true;
        this.title = "修改资金计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.stId = this.form.stId2;
          this.form.projectId = this.form.projectIdOld
          this.form.userId = this.form.userId2;
          if (this.form.cplanId != null) {
            updateCplan(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCplan(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        } else {
          this.isDisabled = false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const cplanIds = row.cplanId || this.ids;
      this.$confirm("是否确认删除资金计划?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCplan(cplanIds);
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
        "project/cplan/export",
        {
          ...this.queryParams,
        },
        `project_cplan.xlsx`
      );
    },

    //业务开始
    //选择项目
    changeProject(pro) {
      this.form.projectIdOld = pro.projectId;
    },
    changeSt(obj) {
      this.form.stId2 = obj.stId;
      this.form.stName = obj.stName;
      this.form.serialNo = obj.serialNo;
      this.$set(this.form, "number", obj.number);
    },
    //选择代办人
    changeUser(obj) {
      this.form.userId2 = obj.userId;
      this.form.userName = obj.nickName;
    },
    //溢出选中数据
    deleteRow(index, rows) {
      this.form.tableData.splice(index, 1);
    },
    //添加计划
    addTableData() {
      if (this.form.tableData == undefined) {
        this.form.tableData = new Array();
      }
      let obj = {};

      this.form.tableData.push(obj);
    },
    handleOpen() {
      this.isDisabled = false;
    },
  },
};
</script>
