<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="项目" prop="stId">
        <el-select
          filterable
          v-model="queryParams.stId"
          placeholder="请选择项目"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in stOptions"
            :key="dict.stId"
            :label="dict.name"
            :value="dict.stId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="kpName">
        <el-input
          v-model="queryParams.kpName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="stNo">
        <el-input
          v-model="queryParams.stNo"
          placeholder="请输入项目编号"
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
          v-hasPermi="['project:kp:add']"
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
      <!--          v-hasPermi="['project:kp:edit']"-->
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
      <!--          v-hasPermi="['project:kp:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:kp:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="kpList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="stNo" />
      <el-table-column label="代办人" align="center" prop="uName" />
      <el-table-column label="供应商" align="center" prop="sName" />
      <el-table-column label="开票金额(元)" align="center" prop="kpPrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.kpPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="开票税额(元)" align="center" prop="kpTax">
        <template slot-scope="scope">
          {{
            Number(scope.row.kpTax)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="价税合计(元)" align="center" prop="kpTotal">
        <template slot-scope="scope">
          {{
            Number(scope.row.kpTotal)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
        prop="state"
        :formatter="stateFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:kp:edit']"-->
          <!--          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:kp:edit']"
            >查看</el-button
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
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:kp:remove']"-->
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

    <!-- 添加或修改开票对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <el-form-item >-->
        <!--              <span>最终付款总额(元)：<span style="color: red">{{ form.zzTprice }}</span></span>-->
        <!--              <span style="margin-left: 10%;">合计重量(吨)：<span style="color: red">{{form.zzWeight}}</span></span>-->
        <!--              <span style="margin-left: 10%;">货品单价(元)：<span style="color: red">{{ form.zzPrice }}</span></span>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="stId">
              <el-select
                filterable
                value-key="stId"
                @change="changeSt"
                v-model="form.stId"
                placeholder="请选择项目"
                style="width: 100%"
              >
                <el-option
                  v-for="obj in stOptions"
                  :key="obj.stId"
                  :label="obj.name"
                  :value="obj"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="name">
              {{ form.number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代办人" prop="kpPrice">
              <el-input v-model="form.uName" placeholder="请输入代办人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="kpTax">
              <el-input v-model="form.sName" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票金额(元)" prop="kpPrice">
              <el-input
                v-model="form.kpPrice"
                placeholder="请输入开票金额(元)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票税额(元)" prop="kpTax">
              <el-input v-model="form.kpTax" placeholder="请输入开票税额(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价税合计(元)" prop="kpTotal">
              <el-input
                @change="jsTax"
                v-model="form.kpTotal"
                placeholder="请输入价税合计(元)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电厂结算金额" prop="zzTprice">
              <el-input
                v-model="form.zzTprice"
                placeholder="请输入电厂结算金额(元)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合计重量" prop="zzWeight">
              <el-input
                v-model="form.zzWeight"
                placeholder="请输入合计重量(元)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货品单价" prop="zzPrice">
              <el-input
                v-model="form.zzPrice"
                placeholder="请输入货品单价(元)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品名称" prop="mc">
              <el-input v-model="form.mc" placeholder="请输入货品名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="货品单价" prop="kpPrice">-->
          <!--              <el-input v-model="form.dj" placeholder="请输入货品单价" />-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="货品型号" prop="kpTax">
              <el-input v-model="form.xh" placeholder="请输入货品型号" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="公司名称" prop="kpName">-->
        <!--              <el-input v-model="form.kpName" placeholder="请输入公司名称" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="税号" prop="kpNumber">-->
        <!--              <el-input v-model="form.kpNumber" placeholder="请输入税号" />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
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
                <el-button size="small" type="primary" v-if="isLook != 3"
                  >点击上传</el-button
                >
                <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="isLook != 3"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
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
          <div style="padding: 0 0 15px">
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
              <td class="title" colspan="6">基础信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">项目名称</td>
              <td class="table-td-content">
                {{ printData.stName }}
              </td>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                {{ printData.number }}
              </td>
              <td class="table-td-title detail">代办人</td>
              <td class="table-td-content">
                {{ printData.uName }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">供应商</td>
              <td class="table-td-content">
                {{ printData.sName }}
              </td>
              <td class="table-td-title detail">结算金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.zzTprice) }}
              </td>
              <td class="table-td-title detail">验收重量(吨)</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.zzWeight) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">开票金额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.kpPrice) }}
              </td>
              <td class="table-td-title detail">开票税额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.kpTax) }}
              </td>
              <td class="table-td-title detail">价税合计(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.kpTotal) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">货品单价(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.zzPrice) }}
              </td>
              <td class="table-td-title detail">货品名称</td>
              <td class="table-td-content">
                {{ printData.mc }}
              </td>
              <td class="table-td-title detail">货品型号</td>
              <td class="table-td-content">
                {{ printData.xh }}
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
  listKp,
  getKp,
  delKp,
  addKp,
  updateKp,
  getStList,
} from "@/api/project/kp";
import { getToken } from "@/utils/auth";
import { findInit } from "@/api/project/realsk";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";

export default {
  name: "Kp",
  data() {
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
      // 开票表格数据
      kpList: [],
      // 项目集合
      stOptions: [],
      //审核状态集合
      stateOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        kpName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        kpPrice: [{ validator: validatePrice3, trigger: "blur" }],
        kpTax: [{ validator: validatePrice3, trigger: "blur" }],
        kpTotal: [{ validator: validatePrice3, trigger: "blur" }],
        // zzTprice: [{ validator: validatePrice3, trigger: "blur" }],
        // zzPrice: [{ validator: validatePrice3, trigger: "blur" }],
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
    getStList().then((response) => {
      this.stOptions = response.rows;
    });
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let kpId = this.$route.params.kpId;
      let row = { kpId: kpId };
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
    /** 查询开票列表 */
    getList() {
      this.loading = true;
      listKp(this.queryParams).then((response) => {
        this.kpList = response.rows;
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
        kpId: null,
        stId: null,
        stId2: null,
        stName: null,
        zzTprice: null,
        zzWeight: null,
        zzPrice: null,
        kpName: null,
        kpNumber: null,
        kpPrice: null,
        kpTax: null,
        kpTotal: null,
        kpState: null,
        state: null,
        createBy: null,
        createTime: null,
        mc: null,
        dj: null,
        xh: null,
        uName: null,
        uId: null,
        sName: null,
        sId: null,
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
      this.ids = selection.map((item) => item.kpId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // this.form.zzTprice=0;
      // this.form.zzWeight=0;
      // this.form.zzPrice=0;
      this.isLook = 1;
      this.open = true;
      this.title = "添加开票";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const kpId = row.kpId || this.ids;
      getKp(kpId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.fileList = response.data.fileList;
        this.isLook = 1;
        this.open = true;
        this.title = "修改开票";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const kpId = row.kpId || this.ids;
      this.$router.push("/kp/look/" + kpId);
    },
    /** 提交按钮 */
    submitForm() {
      this.form.kpPrice = parseFloat(this.form.kpPrice).toFixed(2)
      this.form.kpTax = parseFloat(this.form.kpTax).toFixed(2)
      this.form.kpTotal = parseFloat(this.form.kpTotal).toFixed(2)
      this.form.zzTprice = parseFloat(this.form.zzTprice).toFixed(2)
      this.form.zzPrice = parseFloat(this.form.zzPrice).toFixed(2)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.stId = this.form.stId2;
          if (this.form.kpId != null) {
            updateKp(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKp(this.form).then((response) => {
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
      const kpIds = row.kpId || this.ids;
      this.$confirm("是否确认删除开票?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delKp(kpIds);
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
        "project/kp/export",
        {
          ...this.queryParams,
        },
        `project_kp.xlsx`
      );
    },
    //上传图片
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

    //业务开始
    //选择项目
    changeSt(obj) {
      this.form.stId2 = obj.stId;
      this.form.stName = obj.name;
      this.form.uName = obj.userName;
      this.form.uId = obj.userId;
      this.form.sName = obj.supplierName;
      this.form.sId = obj.supplierId;
      this.$set(this.form, "number", obj.number);
    },

    jsTax() {
      // let price=0.00
      // if(this.form.kpPrice!=null && this.form.kpPrice!=''){
      //   price=this.form.kpPrice
      // }
      // this.form.kpTax=(parseFloat(price)/1.13*0.13).toFixed(2)
      // this.form.kpTotal=parseFloat(this.form.kpTax)+parseFloat(price);

      let kpTotal = 0.0;
      if (this.form.kpTotal != null && this.form.kpTotal != "") {
        kpTotal = this.form.kpTotal;
      }
      this.form.kpPrice = (parseFloat(kpTotal) / 1.13).toFixed(2);
      this.form.kpTax = (
        parseFloat(this.form.kpTotal) - parseFloat(this.form.kpPrice)
      ).toFixed(2);
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
      await getKp(row.kpId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList || [];
        this.printData.printType = "开票管理";
      });
      await getProcessDataByStId("15", row.kpId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("15", row.kpId).then((res) => {
        this.printData.nodeStateList = res.data;
        if (
          this.printData.nodeStateList &&
          this.printData.nodeStateList.length > 0
        ) {
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
