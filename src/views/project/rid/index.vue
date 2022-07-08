<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectId">
                <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                  placeholder="请选择项目" style="width: 100%" :disabled="isQuote">
                  <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName"
                    :value="pro.projectId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="业务名称" prop="stId">
                <el-select
                  filterable
                  value-key="stId"
                  @change="changeSt"
                  v-model="form.stId"
                  placeholder="请选择业务"
                  style="width: 100%"
                  :disabled="isQuote"
                >
                  <el-option
                    v-for="obj in listForBusArr"
                    :key="obj.stId"
                    :label="obj.stName"
                    :value="obj.stId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
      <el-form-item label="业务经理" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入业务经理"
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
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['project:rid:add']"-->
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
<!--          v-hasPermi="['project:rid:edit']"-->
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
<!--          v-hasPermi="['project:rid:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:rid:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="!isQuote"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ridList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote"/>
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote"/>
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote"/>
      <el-table-column label="业务经理" align="center" prop="userName" />
      <el-table-column label="已开发票吨数(吨)" align="center" prop="kpNumber">
        <template slot-scope="scope">
                    {{
                      Number(scope.row.kpNumber)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="已开发票金额(元)" align="center" prop="kpPrice">
        <template slot-scope="scope">
                    {{
                      Number(scope.row.kpPrice)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="已开发票税额(元)" align="center" prop="kpTax" >
        <template slot-scope="scope">
                    {{
                      Number(scope.row.kpTax)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="发票吨数差额(元)" align="center" prop="cyNumber" >
        <template slot-scope="scope">
                    {{
                      Number(scope.row.cyNumber)
                        .toFixed(2)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column label="已开进项吨数(吨)" align="center" prop="sNumber">
        <template slot-scope="scope">
                  {{
                    Number(scope.row.sNumber)
                      .toFixed(3)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
      <el-table-column label="已开进项金额(元)" align="center" prop="sPrice">
        <template slot-scope="scope">
                  {{
                    Number(scope.row.sPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
      <el-table-column label="已开进项税额(元)" align="center" prop="sTax" >
        <template slot-scope="scope">
                  {{
                    Number(scope.row.sTax)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
      <el-table-column label="运费金额(元)" align="center" prop="yPrice" >
        <template slot-scope="scope">
                  {{
                    Number(scope.row.yPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
      <el-table-column label="物流税款(元)" align="center" prop="wPrice" >
        <template slot-scope="scope">
                  {{
                    Number(scope.row.wPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
      <el-table-column label="运费印花税(元)" align="center" prop="yhPrice">
        <template slot-scope="scope">
                  {{
                    Number(scope.row.yhPrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:rid:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:rid:remove']"-->
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

    <!-- 添加或修改收开票明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目id" prop="stId">
          <el-input v-model="form.stId" placeholder="请输入项目id" />
        </el-form-item>
        <el-form-item label="项目名" prop="stName">
          <el-input v-model="form.stName" placeholder="请输入项目名" />
        </el-form-item>
        <el-form-item label="业务经理id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入业务经理id" />
        </el-form-item>
        <el-form-item label="业务经理" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入业务经理" />
        </el-form-item>
        <el-form-item label="已开发票吨数" prop="kpNumber">
          <el-input v-model="form.kpNumber" placeholder="请输入已开发票吨数" />
        </el-form-item>
        <el-form-item label="已开发票金额" prop="kpPrice">
          <el-input v-model="form.kpPrice" placeholder="请输入已开发票金额" />
        </el-form-item>
        <el-form-item label="已开发票税额" prop="kpTax">
          <el-input v-model="form.kpTax" placeholder="请输入已开发票税额" />
        </el-form-item>
        <el-form-item label="发票吨数差额" prop="cyNumber">
          <el-input v-model="form.cyNumber" placeholder="请输入发票吨数差额" />
        </el-form-item>
        <el-form-item label="已开进项吨数" prop="sNumber">
          <el-input v-model="form.sNumber" placeholder="请输入已开进项吨数" />
        </el-form-item>
        <el-form-item label="已开进项金额" prop="sPrice">
          <el-input v-model="form.sPrice" placeholder="请输入已开进项金额" />
        </el-form-item>
        <el-form-item label="已开进项税额" prop="sTax">
          <el-input v-model="form.sTax" placeholder="请输入已开进项税额" />
        </el-form-item>
        <el-form-item label="运费金额" prop="yPrice">
          <el-input v-model="form.yPrice" placeholder="请输入运费金额" />
        </el-form-item>
        <el-form-item label="物流税款" prop="wPrice">
          <el-input v-model="form.wPrice" placeholder="请输入物流税款" />
        </el-form-item>
        <el-form-item label="运费印花税" prop="yhPrice">
          <el-input v-model="form.yhPrice" placeholder="请输入运费印花税" />
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
import { listRid, getRid, delRid, addRid, updateRid } from "@/api/project/rid";
import { getStList } from '@/api/project/cplan'
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";

export default {
  name: "Rid",
  props: {
    "stIdd": {
      type: String
    },
    "projectIdd": {
      type: String
    },
    "isQuote": {
      type: Boolean,
      default: false
    }
  },
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
      // 收开票明细表格数据
      ridList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        userName: null,
        stNumber: null,
        stName: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 项目集合
      stOptions: [],
      projectOptions: [],
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    if (this.isQuote){
      this.queryParams.stId = parseInt(this.stIdd)
      this.queryParams.projectId = parseInt(this.projectIdd)
    }
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
  },
  methods: {
    /** 查询收开票明细列表 */
    getList() {
      this.loading = true;
      listRid(this.queryParams).then(response => {
        this.ridList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
      });
      // 项目下拉
      this.loadProjectForCombobox();
    },
    loadProjectForCombobox() {
      this.listForProArr = []
      listProjectForCombobox().then((response) => {
        this.listForProArr = response.data
      })
    },
    loadBusinessForCombobox(projectId){
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
        if(this.isQuote){
          this.changeSt(this.queryParams.stId)
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ridId: null,
        stId: null,
        stName: null,
        userId: null,
        userName: null,
        kpNumber: null,
        kpPrice: null,
        kpTax: null,
        cyNumber: null,
        sNumber: null,
        sPrice: null,
        sTax: null,
        yPrice: null,
        wPrice: null,
        yhPrice: null,
        createBy: null,
        createTime: null,
        projectId: null,
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
      this.ids = selection.map(item => item.ridId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加收开票明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ridId = row.ridId || this.ids
      getRid(ridId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收开票明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ridId != null) {
            updateRid(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRid(this.form).then(response => {
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
      const ridIds = row.ridId || this.ids;
      this.$confirm('是否确认删除收开票明细编号为"' + ridIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRid(ridIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/rid/export', {
        ...this.queryParams
      }, `project_rid.xlsx`)
    },
     changeSt(stId) {
      let businessFind = this.listForBusArr.filter(x => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        this.form.stName = businessFind[0].stName;
        this.form.serialNo = businessFind[0].serialNo;
      }
    },
    changeProject(projectId) {
      this.listForBusArr = []
      this.form.stId = ''
      this.form.stName = ''
      this.form.serialNo = ''
      if (projectId){
        this.loadBusinessForCombobox(projectId);
      }
    },
  }
};
</script>
