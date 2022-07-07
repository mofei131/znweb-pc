<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch && !isQuote" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="项目名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input v-model="queryParams.stName" placeholder="业务名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="项目编号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入项目编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="申请人" prop="sqId">
        <el-select filterable v-model="queryParams.sqId" placeholder="请选择申请人" clearable size="small">
          <el-option v-for="dict in userOptions" :key="dict.userId" :label="dict.nickName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="支出类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择支出类型" clearable size="small">
          <el-option label="差旅费" value="差旅费" />
          <el-option label="招待费" value="招待费" />
          <el-option label="加油费" value="加油费" />
          <el-option label="办公费" value="办公费" />
          <el-option label="预支" value="预支" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="支出时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:dp:add']" v-show="editable">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:dp:edit']"-->
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
      <!--          v-hasPermi="['project:dp:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:dp:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="!isQuote"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dpList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote" />
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote" />
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote" />
      <el-table-column label="申请人" align="center" prop="sqName" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
      <el-table-column label="支出类型" align="center" prop="type" />
      <el-table-column label="金额(元)" align="center" prop="price">
        <template slot-scope="scope">
          {{
          Number(scope.row.price)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="支出时间" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleLook(scope.row)"-->
          <!--            v-hasPermi="['project:dp:edit']"-->
          <!--          >查看</el-button>-->
          <el-button v-if="(scope.row.stId == null || scope.row.stId == '') && editable" size="mini" type="text"
            icon="el-icon-edit" @click="handleUpdataStId(scope.row)" v-hasPermi="['project:dp:edit']">绑定项目</el-button>
          <el-button v-if="scope.row.stId!=null && scope.row.stId!=''" size="mini" type="text" icon="el-icon-edit">已绑定项目
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:dp:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改期间费用对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectId">
              <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                placeholder="请选择项目" style="width: 100%" :disabled="isQuote">
                <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName"
                  :value="pro.projectId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="stId">
              <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                style="width: 100%" :disabled="isQuote">
                <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj.stId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="serialNo">
              {{ form.serialNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="isLook!=4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请人" prop="sqId">
                <el-select filterable value-key="userId" @change="changeSq" v-model="form.sqId" placeholder="请选择申请人"
                  style="width: 100%;">
                  <el-option v-for="obj in userOptions" :key="obj.userId" :label="obj.nickName" :value="obj.userId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户经理" prop="managerId">
                <el-select filterable value-key="userId" @change="changeManager" v-model="form.managerId"
                  placeholder="请选择客户经理" style="width: 100%;">
                  <el-option v-for="obj in user2Options" :key="obj.userId" :label="obj.nickName" :value="obj.userId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支出类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择支出类型" style="width: 100%;">
                  <el-option label="差旅费" value="差旅费" />
                  <el-option label="招待费" value="招待费" />
                  <el-option label="加油费" value="加油费" />
                  <el-option label="办公费" value="办公费" />
                  <el-option label="预支" value="预支" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="金额(元)" prop="price">
                <el-input v-model="form.price" placeholder="请输入金额(元)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支出时间" prop="payTime">
                <el-date-picker clearable size="small" style="width: 100%;" v-model="form.payTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择支出时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="isLook!=3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDp, getDp, delDp, addDp, updateDp } from "@/api/project/dp";
import {getStList, getUserList} from "@/api/project/cplan";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
import { getApprovalType } from "@/api/approve";
export default {
  name: "Dp",
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
    },
    "editable": {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 两位小数点验证
    const validatePrice = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(value!=0 && (value==null || value=="")){
        callback(new Error('不能为空'))
      }else if(!reg.test(value)){
        callback(new Error('请输入正确格式'))
      }else{
        callback();
      }
    };
    return {
      isLook:1,
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
      // 期间费用表格数据
      dpList: [],
      //申请人集合
      userOptions:[],
      //客户经理集合
      user2Options:[],
      // 日期范围
      dateRange: [],
      //审批集合
      stateOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        sqId: null,
        managerId: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sqId: [
          { required: true, message: "请选择申请人", trigger: "blur" }
        ],
        managerId: [
          { required: true, message: "请选择客户经理", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择支出类型", trigger: "blur" }
        ],
        price: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "请选择支付时间", trigger: "blur" }
        ],
      },
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    if (this.isQuote) {
      this.queryParams.stId = parseInt(this.stIdd)
      this.queryParams.projectId = parseInt(this.projectIdd)
    }
    this.getList();
    this.getDicts("project_approval_state").then(response => {
      this.stateOptions = response.data;
    });
    getUserList().then(response => {
      this.userOptions = response.rows;
      this.user2Options = response.rows;
    });
    if(this.$route.params.isEdit!=null && this.$route.params.isEdit=="true"){
      let dpId=this.$route.params.dpId
      let row={"dpId":dpId}
      this.handleUpdate(row)
    }
    if(this.$route.params.isAdd!=null && this.$route.params.isAdd=="true"){
      this.handleAdd()
    }
  },
  methods: {
    /** 查询期间费用列表 */
    getList() {
      this.loading = true;
      listDp(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.dpList = response.rows;
        this.total = response.total;
        this.loading = false;
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
    loadBusinessForCombobox(projectId) {
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
        if (this.isQuote) {
          this.changeSt(this.queryParams.stId)
        }
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
        dpId: null,
        stId: null,
        stName: null,
        sqId: null,
        sqName: null,
        managerId: null,
        managerName: null,
        type: null,
        price: null,
        payTime: null,
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
      this.ids = selection.map(item => item.dpId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType({ approvalType: '16' }).then((response) => {
        this.reset();
        if (this.isQuote) {
          this.form.projectId = this.queryParams.projectId
          this.changeProject(this.queryParams.projectId)
          this.form.stId = this.queryParams.stId
        }
        this.isLook = 1;
        this.open = true;
        this.title = "添加期间费用";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dpId = row.dpId || this.ids
      getDp(dpId).then(response => {
        this.form = response.data;
        this.isLook = 1;
        this.open = true;
        this.title = "修改期间费用";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const dpId = row.dpId || this.ids
      getDp(dpId).then(response => {
        this.form = response.data;
        this.isLook = 3;
        this.open = true;
        this.title = "查看期间费用";
      });
    },
    /** 绑定按钮操作 */
    handleUpdataStId(row) {
      this.reset();
      const dpId = row.dpId || this.ids
      getDp(dpId).then(response => {
        this.form = response.data;
        this.isLook = 4;
        this.open = true;
        this.title = "绑定项目";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dpId != null) {
            updateDp(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDp(this.form).then(response => {
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
      const dpIds = row.dpId || this.ids;
      this.$confirm('是否确认删除期间费用?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDp(dpIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/dp/export', {
        ...this.queryParams
      }, `project_dp.xlsx`)
    },


    //业务开始
    //选择项目
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
      if (projectId) {
        this.loadBusinessForCombobox(projectId);
      }
    },
    //选择申请人
    changeSq(sqId){
      let objFind = this.userOptions.filter(x => x.userId == sqId);
      if (objFind && objFind.length > 0) {
        this.form.sqName = objFind[0].nickName
      }
    },
    //选择客户经理
    changeManager(managerId){
      let objFind = this.user2Options.filter(x => x.userId == managerId);
      if (objFind && objFind.length > 0) {
        this.form.managerName = objFind[0].nickName
      }      
    },
  }
};
</script>
