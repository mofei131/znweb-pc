<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="供应商名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评级" prop="rating">
        <el-select
          filterable
          v-model="queryParams.rating"
          placeholder="请选择评级"
          clearable
          size="small"
        >
          <el-option label="A" value="A" />
          <el-option label="B" value="B" />
          <el-option label="C" value="C" />
          <el-option label="D" value="D" />
          <el-option label="E" value="E" />
        </el-select>
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
          v-hasPermi="['project:supplier:add']"
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
      <!--          v-hasPermi="['project:supplier:edit']"-->
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
      <!--          v-hasPermi="['project:supplier:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:supplier:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="supplierList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="供应商名称" align="center" prop="name" />
      <el-table-column
        label="成立日期"
        align="center"
        prop="clTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.clTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年发运量(万吨)" align="center" prop="traffic">
        <template slot-scope="scope">
          {{
            Number(scope.row.traffic)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="发票面额" align="center" prop="invoiceType" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
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
            >查看</el-button
          >
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:supplier:edit']"-->
          <!--          >修改</el-button>-->
          <el-button
            v-if="scope.row.state == '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateRating(scope.row)"
            v-hasPermi="['project:supplier:edit']"
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
          <!--            v-hasPermi="['project:supplier:remove']"-->
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

    <!-- 添加或修改供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入供应商名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成立日期" prop="clTime">
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 100%"
                  v-model="form.clTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择成立日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年发运量(万吨)" prop="traffic">
                <el-input v-model="form.traffic" placeholder="请输入年发运量" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册资本(万元)" prop="capital">
                <el-input v-model="form.capital" placeholder="请输入注册资本" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商账号" prop="account">
                <el-input
                  v-model="form.account"
                  placeholder="请输入供应商账号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行" prop="openbank">
                <el-input v-model="form.openbank" placeholder="请输入开户行" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票面额" prop="invoiceType">
                <el-select
                  v-model="form.invoiceType"
                  placeholder="请选择发票面额"
                  style="width: 100%"
                >
                  <el-option label="十万元版" value="十万元版" />
                  <el-option label="百万元版" value="百万元版" />
                  <el-option label="千万元版" value="千万元版" />
                </el-select>
              </el-form-item>
            </el-col>
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
            <el-col :span="12">
              <el-form-item label="企业性质" prop="nature">
                <el-select
                  v-model="form.nature"
                  placeholder="请选择企业性质"
                  style="width: 100%"
                >
                  <el-option label="国有企业" value="国有企业" />
                  <el-option label="上市企业" value="上市企业" />
                  <el-option label="私营企业" value="私营企业" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!--        <el-form-item label="评级说明" prop="ratingDe">-->
          <!--          <el-input v-model="form.ratingDe" placeholder="请输入评级说明" />-->
          <!--        </el-form-item>-->
          <!--        <el-form-item label="评级附件" prop="ratingImg">-->
          <!--          <el-input v-model="form.ratingImg" placeholder="请输入评级附件" />-->
          <!--        </el-form-item>-->
          <el-form-item label="原资方">
            <el-radio-group v-model="form.sourcemType">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
              <!--            <el-radio-->
              <!--              v-for="st in sourcemTypes"-->
              <!--              :key="st.key"-->
              <!--              :label="st.value"-->
              <!--            >{{st.value}}</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <div v-if="form.sourcemType == '1'">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="原资方名称"
                  prop="sourcemName"
                  :rules="
                    form.sourcemType == '1'
                      ? rules.sourcemName
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="form.sourcemName"
                    placeholder="请输入原资方名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="原资方放款节点"
                  prop="sourcemLn"
                  :rules="
                    form.sourcemType == '1'
                      ? rules.sourcemLn
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="form.sourcemLn"
                    placeholder="请输入原资方放款节点"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="原资方费率"
                  prop="sourcemRate"
                  :rules="
                    form.sourcemType == '1'
                      ? rules.sourcemRate
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="form.sourcemRate"
                    placeholder="请输入原资方费率"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="原资方放款比例"
                  prop="sourcemLr"
                  :rules="
                    form.sourcemType == '1'
                      ? rules.sourcemLr
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="form.sourcemLr"
                    placeholder="请输入原资方放款比例"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
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
        <el-button type="primary" @click.once="submitForm" v-if="isLook != 3"
          >确 定</el-button
        >
        <el-button @click="cancel" v-if="isLook != 3">取 消</el-button>
        <!--        <el-button @click="cancel" v-if="isLook==3">关 闭</el-button>-->
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
              <td class="title" colspan="6">供应商信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">供应商名称</td>
              <td class="table-td-content">
                {{ printData.name }}
              </td>
              <td class="table-td-title detail">成立日期</td>
              <td class="table-td-content">
                {{ printData.clTime }}
              </td>
              <td class="table-td-title detail">年发运量(万吨)</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.traffic) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">注册资本(万元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.capital) }}
              </td>
              <td class="table-td-title detail">供应商账号</td>
              <td class="table-td-content">
                {{ printData.account }}
              </td>
              <td class="table-td-title detail">开户行</td>
              <td class="table-td-content">
                {{ printData.openbank }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">发票面额</td>
              <td class="table-td-content">
                {{ printData.invoiceType }}
              </td>
              <td class="table-td-title detail">企业性质</td>
              <td class="table-td-content">
                {{ printData.nature }}
              </td>
              <td class="table-td-title detail">评级</td>
              <td class="table-td-content">
                {{ printData.rating }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">评级说明</td>
              <td class="table-td-content" colspan="5">
                {{ printData.ratingDe }}
              </td>
            </tr>
            <tr>
              <td class="title" colspan="6">供应商信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">原资方名称</td>
              <td class="table-td-content">
                {{ printData.sourcemName }}
              </td>
              <td class="table-td-title detail">原资方放款节点</td>
              <td class="table-td-content">
                {{ printData.sourcemLn }}
              </td>
              <td class="table-td-title detail">原资方费率</td>
              <td class="table-td-content">
                {{ printData.sourcemRate }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">原资方放款比例</td>
              <td class="table-td-content" colspan="5">
                {{ printData.sourcemLr }}
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
  listSupplier,
  getSupplier,
  delSupplier,
  addSupplier,
  updateSupplier,
} from "@/api/project/supplier";
import { getToken } from "@/utils/auth";
import { getStList } from "@/api/project/gry";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";

export default {
  name: "Supplier",
  data() {
    const validatePrice = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!value && value != 0) {
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
      // 供应商
      supplierList: [],
      // 供应商
      sourcemTypes: [
        { key: 1, value: "是" },
        { key: 2, value: "否" },
      ],
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
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" },
        ],
        clTime: [
          { required: true, message: "成立时间不能为空", trigger: "blur" },
        ],
        traffic: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        capital: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        invoiceType: [
          { required: true, message: "请选择发票面额", trigger: "blur" },
        ],
        nature: [
          { required: true, message: "请选择企业性质", trigger: "blur" },
        ],
        sourcemName: [
          { required: true, message: "原资方不能为空", trigger: "blur" },
        ],
        sourcemLn: [
          {
            required: true,
            message: "原资方放款节点不能为空",
            trigger: "blur",
          },
        ],
        sourcemRate: [
          { required: true, message: "原资方费率不能为空", trigger: "blur" },
        ],
        sourcemLr: [
          {
            required: true,
            message: "原资方放款比例不能为空",
            trigger: "blur",
          },
        ],
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
      let supplierId = this.$route.params.supplierId;
      let row = { supplierId: supplierId };
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
    /** 查询供应商列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then((response) => {
        this.supplierList = response.rows;
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
        supplierId: null,
        name: null,
        clTime: null,
        traffic: null,
        capital: null,
        invoiceType: null,
        account: null,
        openbank: null,
        nature: null,
        rating: null,
        ratingDe: null,
        ratingImg: null,
        sourcemType: "1",
        sourcemName: null,
        sourcemLn: null,
        sourcemRate: null,
        sourcemLr: null,
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
      this.ids = selection.map((item) => item.supplierId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.isLook = 1;
      this.open = true;
      this.title = "添加供应商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileList = [];
      const supplierId = row.supplierId || this.ids;
      getSupplier(supplierId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.isLook = 2;
        this.open = true;
        this.title = "修改供应商";
      });
    },

    /** 评级按钮操作 */
    handleUpdateRating(row) {
      this.reset();
      this.fileList = [];
      const supplierId = row.supplierId || this.ids;
      getSupplier(supplierId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.isLook = 4;
        this.open = true;
        this.title = "评级供应商";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.fileList = [];
      const supplierId = row.supplierId || this.ids;
      this.$router.push("/supplier/look/" + supplierId);
      // getSupplier(supplierId).then(response => {
      //   this.form = response.data;
      //   this.fileList = response.data.fileList
      //   this.isLook=3;
      //   this.open = true;
      //   this.title = "查看供应商";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.supplierId != null) {
            updateSupplier(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSupplier(this.form).then((response) => {
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
      const supplierIds = row.supplierId || this.ids;
      this.$confirm("是否确认删除供应商?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSupplier(supplierIds);
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
        "project/supplier/export",
        {
          ...this.queryParams,
        },
        `project_supplier.xlsx`
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
        documentTitle: "",
        style: "@page {margin:15mm 10mm}",
      });
    },
    async handlePrint(row) {
      this.printData = {};
      await getSupplier(row.supplierId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList || [];
        this.printData.gryList = response.data.selnyList || [];
        this.printData.printType = "供应商管理";
      });
      await getProcessDataByStId("12", row.supplierId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("12", row.supplierId).then((res) => {
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
