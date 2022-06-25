<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
          v-hasPermi="['project:refund:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:refund:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="refundList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="主键" align="center" prop="refundId" /> -->
      <!-- <el-table-column label="项目编号" align="center" prop="stId" /> -->
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <!-- <el-table-column label="终端客户id" align="center" prop="terminalId" /> -->
      <el-table-column label="终端客户" align="center" prop="tName" />
      <!-- <el-table-column label="账号" align="center" prop="account" /> -->
      <!-- <el-table-column label="开户行" align="center" prop="bank" /> -->
      <el-table-column label="退款金额" align="center" prop="moneyAmount">
        <template slot-scope="scope">
          {{
          Number(scope.row.moneyAmount)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)"
            v-hasPermi="['project:refund:edit']">查看</el-button>
          <el-button v-if="scope.row.state == '3'" size="mini" type="text" icon="el-icon-edit"
            @click="handleAddDetail(scope.row)" v-hasPermi="['project:refund:edit']">退款</el-button>
          <el-button v-if="scope.row.state == '3'" size="mini" type="text" icon="el-icon-edit"
            @click="handleRefund(scope.row)" v-hasPermi="['project:refund:query']">退款明细</el-button>
          <el-button v-if="scope.row.state == '3'" size="mini" type="text" icon="el-icon-printer"
            @click="handlePrint(scope.row)" v-hasPermi="['project:refund:remove']">打印</el-button>
          <!-- <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >编辑</el-button>
          <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:refund:remove']"
          >删除</el-button>
          <el-button v-if="scope.row.state=='4' "
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRefer(scope.row)"
            v-hasPermi="['project:refund:edit']"
          >提交</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改退款金额对话框 -->
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端用户" prop="terminalId">
              <el-select filterable value-key="terminalId" style="width: 100%" @change="changeTerinal"
                v-model="form.terminalId" placeholder="请选择终端用户">
                <el-option v-for="te in terminalOptions" :key="te.terminalId" :label="te.name" :value="te.terminalId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户行" prop="bank">
              <el-input v-model="form.bank" placeholder="请输入开户行" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款金额" prop="moneyAmount">
              <el-input v-model="form.moneyAmount" placeholder="请输入退款金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload :action="url" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove"
                :on-success="uploadSuccess" :on-error="uploadError" :before-remove="beforeRemove" multiple :limit="5"
                :on-exceed="handleExceed" :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="isDisabled">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog :title="refundTitle" :visible.sync="refundOpen" width="600px" append-to-body>
      <el-form ref="refundForm" :model="refundForm" :rules="rules" label-width="120px">
        <el-form-item label="应退款金额">
          {{ $options.filters.moneyFilter(refundForm.moneyAmount) }}
        </el-form-item>
        <el-form-item label="已退款金额">
          {{ $options.filters.moneyFilter(refundForm.ytPrice) }}
        </el-form-item>
        <el-form-item label="剩余应退款金额">
          {{ $options.filters.moneyFilter(refundForm.refunding) }}
        </el-form-item>
        <el-form-item label="终端用户">
          {{ refundForm.tName }}
        </el-form-item>
        <el-form-item label="开户行">
          {{ refundForm.bank }}
        </el-form-item>
        <el-form-item label="账号">
          {{ refundForm.account }}
        </el-form-item>
        <el-form-item label="退款金额(元)" prop="tkPrice">
          <el-input v-model="refundForm.tkPrice" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="退款日期" prop="tkTime">
          <el-date-picker clearable size="small" style="width: 100%" v-model="refundForm.tkTime" type="date"
            value-format="yyyy-MM-dd" placeholder="选择退款日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDetail">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退款修改对话框 -->
    <el-dialog :title="refundEditTitle" :visible.sync="refundEditOpen" width="600px" append-to-body>
      <el-form ref="refundEditForm" :model="refundEditForm" :rules="rules" label-width="120px">
        <el-form-item label="应退款金额:">
          <!-- <el-input v-model="refundEditForm.money_amount" readonly /> -->
          <span v-text="$options.filters.moneyFilter(refundEditForm.money_amount)"></span>
        </el-form-item>
        <el-form-item label="已退款金额:">
          <!-- <el-input v-model="refunded" readonly /> -->
          <span v-text="$options.filters.moneyFilter(refundEditForm.ytPrice)"></span>
        </el-form-item>
        <el-form-item label="剩余应退款金额:">
          <!-- <el-input v-model="refunding" readonly /> -->
          <span v-text="$options.filters.moneyFilter(refundEditForm.refunding)"></span>
        </el-form-item>
        <el-form-item label="终端用户:">
          <!-- <el-input v-model="refundEditForm.t_name" readonly /> -->
          <span v-text="refundEditForm.t_name"></span>
        </el-form-item>
        <el-form-item label="开户行:">
          <!-- <el-input v-model="refundEditForm.bank" readonly /> -->
          <span v-text="refundEditForm.bank"></span>
        </el-form-item>
        <el-form-item label="账号:">
          <!-- <el-input v-model="refundEditForm.account" readonly /> -->
          <span v-text="refundEditForm.account"></span>
        </el-form-item>
        <el-form-item label="*退款金额" prop="detailAmount">
          <el-input v-model="refundEditForm.tkPrice" type="number" placeholder="请输入退款金额" :max="refunding"
            @input="numberChange(arguments[0], refundEditForm.refunding)"
            @change="numberChange(arguments[0], refundEditForm.refunding)" />
        </el-form-item>
        <el-form-item label="*退款日期" prop="detailTime">
          <el-date-picker v-model="refundEditForm.create_time" value-format="yyyy-MM-dd" type="date"
            placeholder="选择退款日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDetail">确 定</el-button>
        <el-button @click="cancelEdit">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退款明细 -->
    <el-dialog :title="detailTitle" :visible.sync="detailOpen" width="960px" append-to-body>
      <el-row>
        <el-col :span="4">应退款金额：<span v-text="$options.filters.moneyFilter(totalRefund)"></span></el-col>
        <el-col :span="4">已退款金额：<span v-text="$options.filters.moneyFilter(unrefundDetail)"></span></el-col>
        <el-col :span="4">剩余退款金额：<span v-text="$options.filters.moneyFilter(refundDetailing)"></span></el-col>
      </el-row>

      <el-table v-loading="detailLoading" :data="detailList">
        <el-table-column label="付款人" align="center" prop="refundPersonName" />
        <el-table-column label="财务退款金额" align="center" prop="detailAmount">
          <template slot-scope="scope">
            {{
            Number(scope.row.detailAmount)
            .toFixed(2)
            .toString()
            .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
            }}
          </template>
        </el-table-column>
        <el-table-column label="退款时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state == '0'" size="mini" type="text" @click="getUpdateDetail(scope.row)"
              v-hasPermi="['project:refund:edit']">修改</el-button>
            <el-button v-if="scope.row.state == '0'" size="mini" type="text" @click="updateFinish(scope.row)"
              v-hasPermi="['project:refund:query']">完成</el-button>
            <el-button v-if="scope.row.state == '1'" size="mini" type="text">已完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--打印页-->
    <el-dialog title="打印预览" :visible.sync="printReviewVisible" @close="onPrintReviewClose" width="80%">
      <div class="print-div" id="print_area">
        <div class="search-title-content">
          <div style="padding: 0 0 15px">
            <el-row type="flex" justify="space-between">
              <el-col :span="4"><span style="font-weight: bold; font-size: 16px" v-text="printData.printType"></span>
              </el-col>
              <el-col :span="4"><span style="
                    color: red;
                    width: 100%;
                    display: inline-block;
                    text-align: end;
                    font-weight: bold;
                    font-size: 16px;
                  " v-text="selectDictLabel(stateOptions, printData.state)"></span></el-col>
            </el-row>
          </div>
          <!--基本信息-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">基础信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">创建时间</td>
              <td class="table-td-content">
                {{ printData.createTime }}
              </td>
              <td class="table-td-title detail">项目名称</td>
              <td class="table-td-content">
                {{ printData.stName }}
              </td>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                {{ printData.stNumber }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">终端用户</td>
              <td class="table-td-content">
                {{ printData.tName }}
              </td>
              <td class="table-td-title detail">账号</td>
              <td class="table-td-content">
                {{ printData.account }}
              </td>
              <td class="table-td-title detail">开户行</td>
              <td class="table-td-content">
                {{ printData.bank }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">退款金额</td>
              <td class="table-td-content" colspan="5">
                {{ $options.filters.moneyFilter(printData.moneyAmount) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">备注</td>
              <td class="table-td-textarea" colspan="5">
                {{ printData.remark }}
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
              <td class="table-td-content" style="max-width: 150px; text-align: center">
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
              <td class="table-td-content" style="max-width: 150px; text-align: center">
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
  listRefund,
  getRefund,
  delRefund,
  addRefund,
  updateRefund,
  getRefundDetail,
  addRefundDetail,
  getStList,
  getDetail,
  updateDetailState,
  getDetailById,
  listForBus,
  listForPro,
} from "@/api/project/refund";
import { getTerminalList } from "@/api/project/st";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";
import request from "@/utils/request";
import Moment from "moment";
// Vue.prototype.moment = Moment

export default {
  name: "Refund",
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
      // 退款金额表格数据
      refundList: [],
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
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        state: null,
        projectId: null,
        name: null
      },
      dateRange: [],
      detailTime: null,
      // 表单参数
      form: {},
      // 退款表单参数
      refundForm: {},
      stateOptions: [],
      refunded: null,
      refunding: null,
      refundTitle: null,
      detailList: [],
      detailOpen: false,
      detailLoading: false,
      detailTitle: null,
      refundOpen: false,
      totalRefund: null,
      unrefundDetail: 0,
      refundDetailing: 0,
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务名称", trigger: "blur" }],
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        terminalId: [
          { required: true, message: "请选择终端用户", trigger: "blur" },
        ],
        moneyAmount: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
        ],
        tkPrice: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
        ],
        tkTime: [
          { required: true, message: "请选择退款日期", trigger: "blur" },
        ],
      },
      // 项目集合
      projectOptions: [],
      // 终端客户集合
      terminalOptions: [],
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      // 打印
      printReviewVisible: false,
      printData: {},
      refundEditTitle: null,
      refundEditOpen: false,
      refundEditForm: {},
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
  },
  methods: {
    /** 查询退款金额列表 */
    getList() {
      this.loading = true;
      listRefund(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.refundList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      getTerminalList().then((response) => {
        this.terminalOptions = response.rows;
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
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.refundOpen = false;
      this.detailOpen = false;
      // this.refundEditOpen = false;
      this.reset();
    },
    cancelEdit() {
      // this.open = false;
      // this.refundOpen = false;
      // this.detailOpen = false;
      this.refundEditOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        refundId: null,
        stId: null,
        stName: null,
        name: null,
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        remark: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        fileList: [],
        projectId: null,
        projectIdOld: null,
        projectName: null,
        serialNo: null
      };
      this.refundForm = {
        refundId: null,
        stId: null,
        stName: null,
        terminalId: null,
        tName: null,
        account: null,
        bank: null,
        moneyAmount: null,
        remark: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        refunded: null,
        refunding: null,
      };
      this.refundEditForm = {
        account: null,
        bank: null,
        create_by: null,
        create_time: null,
        detail_amount: null,
        money_amount: null,
        rd_id: null,
        refund_id: null,
        state: null,
        t_name: null,
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
      this.dateRange = [];
      this.handleQuery();
    },
    numberChange(val, maxNum) {
      //转换数字类型
      this.queryParams.detailAmount = Number(val);
      //重新渲染
      this.$nextTick(() => {
        //比较输入的值和最大值，返回小的
        let num = Math.min(Number(val), maxNum);
        //输入负值的情况下， = 0（可根据实际需求更该）
        if (num < 0) {
          this.queryParams.detailAmount = 0;
        } else {
          //反之
          this.queryParams.detailAmount = num;
        }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.refundId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.open = true;
      this.title = "添加退款申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const refundId = row.refundId || this.ids;
      getRefund(refundId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改退款申请";
      });
    },
    /** 退款按钮操作 */
    handleAddDetail(row) {
      this.reset();
      const refundId = row.refundId || this.ids;
      getRefund(refundId).then((response) => {
        this.refundForm = response.data;
        this.refundForm.refunding = (
          this.refundForm.moneyAmount - this.refundForm.ytPrice
        ).toFixed(2);
        this.refundOpen = true;
        this.refundTitle = "财务退款";
      });
    },
    addDetail() {
      this.$refs["refundForm"].validate((valid) => {
        if (valid) {
          updateRefund(this.refundForm).then((response) => {
            this.msgSuccess("操作成功");
            this.refundOpen = false;
            this.getList();
          });
        }
      });
    },

    editDetail() {
      this.$refs["refundEditForm"].validate((valid) => {
        if (valid) {
          updateRefund(this.refundEditForm).then((response) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 退款明细按钮操作 */
    handleRefund(row) {
      this.$router.push({
        name: "paydetailsList",
        query: { type: "refund", pid: row.refundId },
      });
    },
    /** 提交按钮操作 */
    handleRefer(row) {
      this.reset();
      const refundId = row.refundId || this.ids;
      getRefund(refundId).then((response) => {
        response.data.state = 1;
        updateRefund(response.data).then((response) => {
          this.msgSuccess("修改成功");
          // this.open = false;
          this.getList();
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.stIdOld) {
            this.form.stId = this.form.stIdOld;
            this.form.projectId = this.form.projectIdOld
          }
          if (this.form.refundId != null) {
            updateRefund(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRefund(this.form).then((response) => {
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
    /** 退款明细操作 */
    handleDetail(row) {
      this.reset();
      const refundId = row.refundId || this.ids;
      getRefund(refundId).then((response) => {
        this.detailLoad = response.data;
        this.detailOpen = true;
        this.detailTitle = "退款明细";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const refundIds = row.refundId || this.ids;
      this.$confirm(
        '是否确认删除退款金额编号为"' + refundIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRefund(refundIds);
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
        "project/refund/export",
        {
          ...this.queryParams,
        },
        `project_refund.xlsx`
      );
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const refundId = row.refundId || this.ids;
      this.$router.push("/refund/look/" + refundId);
    },
    changeProject(pro) {
      this.form.projectIdOld = pro.projectId;
    },
    changeSt(obj) {
      this.form.stIdOld = obj.stId;
      this.form.stName = obj.stName;
      this.form.stNumber = obj.number;
      this.form.terminalId = obj.terminalId;
      this.form.serialNo = obj.serialNo;
      let terminalFind = this.terminalOptions.filter(
        (x) => x.terminalId == obj.terminalId
      );
      if (terminalFind) {
        this.form.tName = terminalFind[0].name;
      }
    },
    changeTerinal(terminalId) {
      let terminalFind = this.terminalOptions.filter(
        (x) => x.terminalId == terminalId
      );
      if (terminalFind) {
        this.form.tName = terminalFind[0].name;
      }
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
      for (let i = 0; i < filelist.length; i++) {
        if (filelist[i].response != undefined) {
          let art = {
            name: filelist[i].response.data.name,
            url: filelist[i].response.data.url,
          };
          this.form.fileList.push(art);
        } else {
          let art = { name: filelist[i].name, url: filelist[i].url };
          this.form.fileList.push(art);
        }
      }
    },
    updateFinish(row) {
      updateDetailState(row).then((response) => {
        this.msgSuccess("更新成功");
        // console.log(row.refundId)
        /* var refund = {
          refundId: row
        }; */
        getDetail(row.refundId).then((response) => {
          // this.totalRefund = row.moneyAmount;
          this.detailLoading = true;
          this.detailList = response.rows;
          this.unrefundDetail = 0;
          for (var r in response.rows) {
            // console.log(r)
            // if(response.rows[r].state == 0){
            this.unrefundDetail += response.rows[r].detailAmount;
            // }else if(response.rows[r].state == 1){
            // this.refundDetailing += response.rows[r].detailAmount;
            // }
          }
          this.unrefundDetail = this.unrefundDetail.toFixed(2);
          this.refundDetailing = this.totalRefund - this.unrefundDetail;
          this.refundDetailing = this.refundDetailing.toFixed(2);
          // this.detailOpen = true;
          // this.detailTitle = "退款明细";

          this.detailLoading = false;
        });
      });
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
      if (res.code == "200") {
        this.form.fileList = [];
        for (var i = 0; i < filelist.length; i++) {
          if (filelist[i].response != undefined) {
            if (filelist[i].response.code != 500) {
              let name = filelist[i].response.data.name;
              let url = filelist[i].response.data.url;
              let art = { name: name, url: url };
              this.form.fileList.push(art);
            }
          } else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = { name: name, url: url };
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index, 1);
      }
      console.log("看这里", this.form);
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },
    handleOpen() {
      this.isDisabled = false;
    },
    // 打印
    async resolveImg() {
      let imgBase64 = await this.getImage("print_area");
      printJS({
        printable: imgBase64,
        type: "image",
        header: null,
        targetStyles: ["*"],
        documentTitle: "",
        style: "@page {margin:15mm 10mm}",
      });
    },
    async handlePrint(row) {
      this.printData = {};
      await getRefund(row.refundId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList || [];
        this.printData.printType = "退款管理";
      });
      await getProcessDataByStId("19", row.refundId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("19", row.refundId).then((res) => {
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
    getUpdateDetail(row) {
      this.reset();
      const refundId = row.refundId;
      getDetailById(row.rdId).then((response) => {
        console.log(response);
        var data1 = response.data;
        data1.create_time = new Date(data1.create_time);
        getRefundDetail(refundId).then((response) => {
          this.refunded = response.data.toFixed(2);
          this.refunding = (data1.money_amount - response.data).toFixed(2);
          this.refundEditForm = data1;
          this.refundEditOpen = true;
          this.refundEditTitle = "修改";
        });
      });
      /* getRefund(refundId).then(response => {
        var data1 = response.data;
        // this.refundOpen = true;
        // this.refundTitle = "修改退款金额";

        getRefundDetail(refundId).then(response => {
          this.refunded = response.data;
          this.refunding = data1.moneyAmount - response.data;
          this.refundForm = data1;
          this.refundOpen = true;
          this.refundTitle = "财务退款";
        });
      }); */
    },
  },
};
</script>
