<style>
.color-black .el-form-item__label {
  color: black !important;
}
</style>
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="终端客户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入终端客户名称"
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
          v-hasPermi="['project:terminal:add']"
          >新增</el-button
        >
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:terminal:edit']"-->
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
      <!--          v-hasPermi="['project:terminal:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:terminal:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="terminalList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="终端客户名称" align="center" prop="name" />
      <el-table-column label="企业性质" align="center" prop="nature" />
      <el-table-column
        label="成立日期"
        align="center"
        prop="setupTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.setupTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年需求量(吨)" align="center" prop="demand">
        <template slot-scope="scope">
          {{
            Number(scope.row.demand)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="注册资本(万元)" align="center" prop="capital">
        <template slot-scope="scope">
          {{
            Number(scope.row.capital)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
        prop="state"
        :formatter="stateFormat"
      />
      <el-table-column label="评级" align="center" prop="rating" />
      <el-table-column
        label="操作"
        width="160"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:terminal:edit']"
            >查看</el-button
          >
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:terminal:edit']"-->
          <!--          >修改</el-button>-->
          <el-button
            v-if="scope.row.state == '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateRating(scope.row)"
            v-hasPermi="['project:terminal:edit']"
            >评级</el-button
          >
          <el-button
            v-if="scope.row.state === '3'"
            size="mini"
            type="text"
            icon="el-icon-printer"
            @click="handlePrint(scope.row)"
            >打印</el-button
          >
          <!--          <el-button-->
          <!--            v-if="scope.row.state=='1' || scope.row.state=='4'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:terminal:remove']"-->
          <!--          >删除</el-button>-->
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

    <!-- 添加或修改终端用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook != 4">
          <el-row v-if="editForm">
            <el-col :span="12">
              <el-form-item label="发起人:" prop="createBy" class="color-black">
                <span style="color: black" v-text="form.createBy"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端客户名称:" prop="name">
                <el-input
                  v-model="form.name"
                  v-if="!editForm"
                  placeholder="请输入终端客户名称"
                />
                <span v-if="editForm" v-text="form.name"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成立日期:" prop="setupTime">
                <el-date-picker
                  clearable
                  size="small"
                  v-if="!editForm"
                  style="width: 100%"
                  v-model="form.setupTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择成立日期"
                >
                </el-date-picker>
                <span v-if="editForm" v-text="form.setupTime"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业性质:" prop="nature">
                <el-select
                  v-model="form.nature"
                  placeholder="请选择企业性质"
                  v-if="!editForm"
                  style="width: 100%"
                >
                  <el-option label="国有企业" value="国有企业" />
                  <el-option label="私有企业" value="私有企业" />
                  <el-option label="上市企业" value="上市企业" />
                </el-select>
                <span v-if="editForm" v-text="form.nature"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年需求量(万吨):" prop="demand">
                <el-input
                  v-model="form.demand"
                  placeholder="请输入年需求量"
                  v-if="!editForm"
                />
                <span v-if="editForm" v-text="form.demand"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="注册资本(万元):" prop="capital">
                <el-input
                  v-model="form.capital"
                  placeholder="请输入注册资本"
                  v-if="!editForm"
                />
                <span v-if="editForm" v-text="form.capital"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评级:" prop="rating">
                <el-select
                  v-model="form.rating"
                  placeholder="请选择评级"
                  v-if="!editForm"
                  style="width: 100%"
                >
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                  <el-option label="D" value="D" />
                  <el-option label="E" value="E" />
                </el-select>
                <span v-if="editForm" v-text="form.rating"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票结算方式:" prop="settlementType">
                <el-select
                  v-model="form.settlementType"
                  placeholder="请选择开票结算方式"
                  v-if="!editForm"
                  style="width: 100%"
                >
                  <el-option label="增值税一票" value="增值税一票" />
                  <el-option label="两票结算" value="两票结算" />
                </el-select>
                <span v-if="editForm" v-text="form.settlementType"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算规则:" prop="settlementGz">
                <el-select
                  v-model="form.settlementGz"
                  placeholder="请选择结算规则"
                  v-if="!editForm"
                  style="width: 100%"
                >
                  <el-option label="按列" value="按列" />
                  <el-option label="全月加权" value="全月加权" />
                </el-select>
                <span v-if="editForm" v-text="form.settlementGz"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款账期:" prop="paymentdays">
                <el-input
                  v-model="form.paymentdays"
                  placeholder="请输入回款账期"
                  v-if="!editForm"
                />
                <span v-if="editForm" v-text="form.paymentdays"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式:" prop="paymentType">
                <el-select
                  v-model="form.paymentType"
                  placeholder="请选择付款方式"
                  v-if="!editForm"
                  style="width: 100%"
                >
                  <el-option label="现汇" value="现汇" />
                  <el-option label="承兑" value="承兑" />
                  <el-option label="现汇+承兑" value="现汇+承兑" />
                </el-select>
                <span v-if="editForm" v-text="form.paymentType"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isLook == 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="评级" prop="rating">
                <el-select
                  v-model="form.rating"
                  placeholder="请选择评级"
                  style="width: 100%"
                >
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                  <el-option label="D" value="D" />
                  <el-option label="E" value="E" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="评级说明：" prop="node">
                <el-input
                  type="textarea"
                  :rows="5"
                  v-model="form.ratingDe"
                  placeholder="请输入评级说明"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件" prop="file">
              <el-upload
                class="upload-demo"
                :action="url"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-remove="beforeRemove"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.once="submitForm" v-if="isLook != 3"
          >确 定</el-button
        >
        <el-button @click="cancel" v-if="isLook != 3">取 消</el-button>
        <el-button @click="cancel" v-if="isLook == 3">关 闭</el-button>
      </div>
    </el-dialog>
    <!--打印页-->
    <el-dialog
      title="打印预览"
      :visible.sync="printReviewVisible"
      @close="onPrintReviewClose"
      width="80%"
    >
      <div class="print-div" id="print_area">
        <div class="search-title-content">
          <div style="padding: 30px 0 15px">
            <el-row type="flex" justify="space-between">
              <el-col :span="4"
                ><span
                  style="font-weight: bold; font-size: 16px"
                  v-text="printData.printType"
                ></span
              ></el-col>
              <el-col :span="4"
                ><span
                  style="
                    color: red;
                    width: 100%;
                    display: inline-block;
                    text-align: end;
                    font-weight: bold;
                    font-size: 16px;
                  "
                  v-text="selectDictLabel(stateOptions, printData.state)"
                ></span
              ></el-col>
            </el-row>
          </div>
          <!--基本信息-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">终端客户信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">终端客户名称</td>
              <td class="table-td-content">
                {{ printData.name }}
              </td>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                {{ printData.number }}
              </td>
              <td class="table-td-title detail">成立日期</td>
              <td class="table-td-content">
                {{ printData.setupTime }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">企业性质</td>
              <td class="table-td-content">
                {{ printData.nature }}
              </td>
              <td class="table-td-title detail">年需求量(万吨)</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.demand) }}
              </td>
              <td class="table-td-title detail">注册资本(万元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.capital) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">开票结算方式</td>
              <td class="table-td-content">
                {{ printData.settlementType }}
              </td>
              <td class="table-td-title detail">结算规则</td>
              <td class="table-td-content">
                {{ printData.settlementGz }}
              </td>
              <td class="table-td-title detail">回款账期</td>
              <td class="table-td-content">
                {{ printData.paymentdays }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">付款方式</td>
              <td class="table-td-content">
                {{ printData.paymentType }}
              </td>
              <td class="table-td-title detail">评级</td>
              <td class="table-td-content">
                {{ printData.rating }}
              </td>
              <td class="table-td-title detail">评级说明</td>
              <td class="table-td-content">
                {{ printData.ratingDe }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">附件</td>
              <td class="table-td-content" colspan="5">
                <div v-for="(item, idx) in printData.fileList" :key="idx">
                  {{ item.name }}
                </div>
              </td>
            </tr>
          </table>
          <!--审批流程-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">审批流程</td>
            </tr>
            <tr>
              <td class="table-td-title detail">发起人</td>
              <td class="table-td-content" colspan="2">
                <template>{{ printData.sponsor }}</template>
              </td>
              <td class="table-td-title detail">发起时间</td>
              <td class="table-td-content" colspan="2">
                <template>{{ printData.initiateTime }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">部门</td>
              <td class="table-td-title detail">应审批人</td>
              <td class="table-td-title detail">审批人</td>
              <td class="table-td-title detail">审批时间</td>
              <td class="table-td-title detail">审批说明</td>
              <td class="table-td-title detail">审批状态</td>
            </tr>
            <tr v-for="(item, idx) in printData.nodeStateList" :key="idx">
              <td class="table-td-content" style="text-align: center">
                {{ item.deptName }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.shouldApprovePerson }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.nickName }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.approveTime }}
              </td>
              <td
                class="table-td-content"
                style="max-width: 150px; text-align: center"
              >
                {{ item.processValue }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{
                  item.status == 0 || item.status == 1
                    ? "已审批"
                    : item.status == -1
                    ? "待审批"
                    : "未审批"
                }}
              </td>
            </tr>
          </table>
          <!--审批流程-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">审批记录</td>
            </tr>
            <tr>
              <td class="table-td-title detail">部门</td>
              <td class="table-td-title detail">审批人</td>
              <td class="table-td-title detail">审批时间</td>
              <td class="table-td-title detail">审批说明</td>
              <td class="table-td-title detail">审批状态</td>
            </tr>
            <tr v-for="(item, idx) in printData.approveHisList" :key="idx">
              <td class="table-td-content" style="text-align: center">
                {{ item.deptName }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.nickName }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.approveTime }}
              </td>
              <td
                class="table-td-content"
                style="max-width: 150px; text-align: center"
              >
                {{ item.processValue }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.status == 0 ? "驳回" : item.status == 1 ? "通过" : "" }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTerminal,
  getTerminal,
  delTerminal,
  addTerminal,
  updateTerminal,
} from "@/api/project/terminal";
import { getToken } from "@/utils/auth";
import { getStList } from "@/api/project/gry";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";

export default {
  name: "Terminal",
  data() {
    const validatePrice = (rule, value, callback) => {
      let reg = /^(([1-9]{1}\d*)|(0{1}))$/;
      if (!value) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
      } else if (value.length > 10) {
        callback(new Error("最多可输入10个字符"));
      } else {
        callback();
      }
    };
    return {
      isLook: 1,
      editForm: false,
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
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
      // 终端用户表格数据
      terminalList: [],
      //审核状态集合
      stateOptions: [],
      //审核信息
      tableselData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "终端客户名称不能为空", trigger: "blur" },
        ],
        setupTime: [
          { required: true, message: "选择成立日期", trigger: "blur" },
        ],
        nature: [
          { required: true, message: "请选择企业性质", trigger: "blur" },
        ],
        demand: [{ required: true, validator: validatePrice, trigger: "blur" }],
        capital: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        // settlementType: [
        //   { required: true, message: "请选择开票结算方式", trigger: "blur" }
        // ],
        // settlementGz: [
        //   { required: true, message: "请选择结算规则", trigger: "blur" }
        // ],
        // paymentdays: [
        //   { required: true, message: "回款账期不能为空", trigger: "blur" }
        // ],
        // paymentType: [
        //   { required: true, message: "请选择付款方式", trigger: "blur" }
        // ]
      },
      // 打印
      printReviewVisible: false,
      printData: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
    });

    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let terminalId = this.$route.params.terminalId;
      let row = { terminalId: terminalId };
      this.handleUpdate(row);
    }
    if (
      this.$route.params.isAdd != null &&
      this.$route.params.isAdd == "true"
    ) {
      this.handleAdd();
    }
  },
  methods: {
    /** 查询终端用户列表 */
    getList() {
      this.loading = true;
      listTerminal(this.queryParams).then((response) => {
        this.terminalList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then((response) => {
        this.stOptions = response.rows;
      });
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
        terminalId: null,
        name: null,
        setupTime: null,
        nature: null,
        demand: null,
        capital: null,
        rating: null,
        ratingDe: null,
        ratingImg: null,
        settlementType: null,
        settlementGz: null,
        paymentdays: null,
        paymentType: null,
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        img5: null,
        state: null,
        createBy: null,
        createTime: null,
        fileList: [],
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
      this.ids = selection.map((item) => item.terminalId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.isLook = 1;
      this.editForm = false;
      this.open = true;
      this.title = "添加终端用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileList = [];
      this.editForm = false;
      const terminalId = row.terminalId || this.ids;
      getTerminal(terminalId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.isLook = 2;
        this.open = true;
        this.title = "修改终端用户";
      });
    },
    /** 评级按钮操作 */
    handleUpdateRating(row) {
      this.reset();
      this.fileList = [];
      this.editForm = false;
      const terminalId = row.terminalId || this.ids;
      getTerminal(terminalId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.isLook = 4;
        this.open = true;
        this.title = "评级终端用户";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.fileList = [];
      this.editForm = true;
      const terminalId = row.terminalId || this.ids;
      this.$router.push("/terminal/look/" + terminalId);
      // getTerminal(terminalId).then(response => {
      //   this.form = response.data;
      //   this.fileList = response.data.fileList
      //   this.isLook=3;
      //   this.open = true;
      //   this.title = "查看终端用户";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.terminalId != null) {
            updateTerminal(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTerminal(this.form).then((response) => {
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
      const terminalIds = row.terminalId || this.ids;
      this.$confirm("是否确认删除终端用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTerminal(terminalIds);
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
        "project/terminal/export",
        {
          ...this.queryParams,
        },
        `project_terminal.xlsx`
      );
    },
    //点击触发
    handlePreview(file) {
      if (file.response == undefined) {
        window.open(file.url);
      } else {
        window.open(file.response.data.url);
      }
    },
    handleRemove(file, filelist) {
      this.form.fileList = [];
      for (var i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          var art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form.fileList.push(art);
        } else {
          var art = { name: filelist[i].name, url: filelist[i].url };
          this.form.fileList.push(art);
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      console.log(filelist);
      if (res.code == "200") {
        this.form.fileList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            var name = filelist[i].response.data.name;
            var url = filelist[i].response.data.url;
            var art = { name: name, url: url };
            this.form.fileList.push(art);
          } else {
            var name = filelist[i].name;
            var url = filelist[i].url;
            var art = { name: name, url: url };
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },
    // 打印
    async resolveImg() {
      let imgBase64 = await this.getImage("print_area");
      printJS({
        printable: imgBase64,
        type: "image",
        header: null,
        targetStyles: ["*"],
        style: "@page {margin:0 10mm}",
      });
    },
    async handlePrint(row) {
      this.printData = {};
      await getTerminal(row.terminalId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.printType = "终端用户管理";
      });
      await getProcessDataByStId("13", row.terminalId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("13", row.terminalId).then((res) => {
        this.printData.nodeStateList = res.data;
        if (this.printData.nodeStateList) {
          this.printData.sponsor = this.printData.nodeStateList[0].sponsor;
          this.printData.initiateTime =
            this.printData.nodeStateList[0].initiateTime;
        }
      });
      this.printReviewVisible = true;
      this.$nextTick(() => {
        this.printReviewVisible = false;
      });
    },
    onPrintReviewClose() {
      this.resolveImg();
    },
  },
};
</script>
