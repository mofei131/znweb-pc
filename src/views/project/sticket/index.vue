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
          v-hasPermi="['project:sticket:add']"
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
      <!--          v-hasPermi="['project:sticket:edit']"-->
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
      <!--          v-hasPermi="['project:sticket:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:sticket:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="sticketList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目名字" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="stNo" />
      <el-table-column label="收票比例" align="center" prop="proportion" />
      <!--      <el-table-column label="应收票金额" align="center" prop="ysPrice" >-->
      <!--        <template slot-scope="scope">-->
      <!--          {{-->
      <!--            Number(scope.row.ysPrice)-->
      <!--              .toFixed(2)-->
      <!--              .toString()-->
      <!--              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")-->
      <!--          }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="数量(吨)" align="center" prop="number">
        <template slot-scope="scope">
          {{
            Number(scope.row.number)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="开票金额(元)" align="center" prop="price">
        <template slot-scope="scope">
          {{
            Number(scope.row.price)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="开票税额(元)" align="center" prop="tax">
        <template slot-scope="scope">
          {{
            Number(scope.row.tax)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="价税合计(元)" align="center" prop="totalPrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.totalPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:sticket:edit']"
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
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:sticket:edit']"-->
          <!--          >修改</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:sticket:remove']"-->
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

    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body>
      <aou
        ref="aou"
        :aouform="form"
        :aoustOptions="stOptions"
        @cancel="cancel"
        @getList="getList"
      ></aou>
    </el-dialog>

    <!-- 添加或修改收票管理对话框 -->
    <!--    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>-->
    <!--      <el-form ref="form" :model="form" :rules="rules" label-width="180px">-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--        <el-form-item label="项目" prop="stId">-->
    <!--          <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择项目" style="width: 100%;">-->
    <!--            <el-option-->
    <!--              v-for="obj in stOptions"-->
    <!--              :key="obj.stId"-->
    <!--              :label="obj.name"-->
    <!--              :value="obj"-->
    <!--            ></el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--        <el-form-item label="收票比例" prop="proportion">-->
    <!--          <el-radio-group v-model="form.proportion" >-->
    <!--            <el-radio label="95%">95%</el-radio>-->
    <!--            <el-radio label="5%">5%</el-radio>-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->

    <!--        <el-popover-->
    <!--          placement="bottom-start"-->
    <!--          width="100%"-->
    <!--          @selection-change="grnSelectionChange"-->
    <!--          v-model="visible"-->
    <!--          popper-class="area_popper">-->
    <!--          <el-button type="primary" slot="reference" style="margin-bottom: 30px;">选择预付款</el-button>-->
    <!--          <el-table-->
    <!--            ref="singleTable"-->
    <!--            :data="tableData"-->
    <!--            fit-->
    <!--            @selection-change="grnSelectionChange"-->
    <!--            style="width: 100%;"-->
    <!--          >-->
    <!--            <el-table-column-->
    <!--              type="selection"-->
    <!--              width="55">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="stName"-->
    <!--              label="项目名称">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="totalWeight"-->
    <!--              label="验收重量（吨）">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="totalPrice"-->
    <!--              label="预付总额(元)">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="expectPrice"-->
    <!--              label="预付单价(元)">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="ato"-->
    <!--              label="预付至">-->
    <!--            </el-table-column>-->
    <!--            <el-table-column-->
    <!--              property="actualPrice"-->
    <!--              label="实际付款(元)">-->
    <!--            </el-table-column>-->
    <!--          </el-table>-->
    <!--          <div style="margin-top: 20px">-->
    <!--            <el-button type="primary"  style="float: right"  @click="toggleSelection()">确认选择</el-button>-->
    <!--          </div>-->
    <!--        </el-popover>-->

    <!--        <el-table-->
    <!--          ref="singleTable"-->
    <!--          :data="tableselData"-->
    <!--          style="width: 100%">-->
    <!--          <el-table-column-->
    <!--            property="stName"-->
    <!--            label="项目名称">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            property="totalWeight"-->
    <!--            label="验收重量（吨）">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            property="totalPrice"-->
    <!--            label="预付总额(元)">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            property="expectPrice"-->
    <!--            label="预付单价(元)">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            property="ato"-->
    <!--            label="预付至">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            property="actualPrice"-->
    <!--            label="实际付款(元)">-->
    <!--          </el-table-column>-->
    <!--          <el-table-column-->
    <!--            v-if="isLook!=3"-->
    <!--            label="操作"-->
    <!--            width="120">-->
    <!--            <template slot-scope="scope">-->
    <!--              <el-button-->
    <!--                @click.native.prevent="deleteRow(scope.$index, tableselData)"-->
    <!--                type="text"-->
    <!--                size="small">-->
    <!--                移除-->
    <!--              </el-button>-->
    <!--            </template>-->
    <!--          </el-table-column>-->
    <!--        </el-table>-->

    <!--        <el-form-item label="应收票金额" prop="totalWeight">-->
    <!--          <span  style="color: red">{{form.ysPrice}}</span>-->
    <!--        </el-form-item>-->

    <!--        &lt;!&ndash;        图片上传&ndash;&gt;-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="OCR图片上传" prop="file">-->
    <!--              <el-upload-->
    <!--                class="upload-demo"-->
    <!--                :action="url"-->
    <!--                :headers="headers"-->
    <!--                :on-preview="handlePreview"-->
    <!--                :on-remove="handleRemove"-->
    <!--                :on-success="uploadSuccess"-->
    <!--                :on-error="uploadError"-->
    <!--                :before-remove="beforeRemove"-->
    <!--                multiple-->
    <!--                :limit="5"-->
    <!--                :on-exceed="handleExceed"-->
    <!--                :file-list="fileList">-->
    <!--                <el-button size="small" type="primary" v-if="isLook!=3">点击上传</el-button>-->
    <!--              </el-upload>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->

    <!--            <el-table-->
    <!--              ref="singleTable"-->
    <!--              :data="ocrData"-->
    <!--              fit-->
    <!--              style="margin-bottom: 30px;width: 90%;margin-left: 5%;">-->
    <!--              <el-table-column-->
    <!--                property="hm"-->
    <!--                label="发票号码"-->
    <!--              >-->
    <!--              </el-table-column>-->
    <!--              <el-table-column-->
    <!--                property="createTime"-->
    <!--                label="开票日期">-->
    <!--              </el-table-column>-->
    <!--              <el-table-column-->
    <!--                property="price"-->
    <!--                label="开票金额(元)">-->
    <!--              </el-table-column>-->
    <!--              <el-table-column-->
    <!--                property="tax"-->
    <!--                label="开票税额(元)">-->
    <!--              </el-table-column>-->
    <!--              <el-table-column-->
    <!--                property="totalPrice"-->
    <!--                label="价税合计(元)">-->
    <!--              </el-table-column>-->
    <!--            </el-table>-->

    <!--        <el-form-item label="数量(吨)" prop="totalWeight">-->
    <!--          <span  style="color: red">{{form.number}}</span>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="开票金额(元)" prop="totalWeight">-->
    <!--          <span  style="color: red">{{form.price}}</span>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="开票税额(元)" prop="totalWeight">-->
    <!--          <span  style="color: red">{{form.tax}}</span>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="价税合计(元)" prop="totalWeight">-->
    <!--          <span  style="color: red">{{form.totalPrice}}</span>-->
    <!--        </el-form-item>-->

    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
    <!--        <el-button @click="cancel">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
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
                {{ printData.projectNumber }}
              </td>
              <td class="table-td-title detail">收票类型</td>
              <td class="table-td-content">
                {{ printData.proportion }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">数量(吨)</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.number) }}
              </td>
              <td class="table-td-title detail">代办人</td>
              <td class="table-td-content">
                {{ printData.uName }}
              </td>
              <td class="table-td-title detail">终端用户</td>
              <td class="table-td-content">
                {{ printData.tName }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">开票金额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.price) }}
              </td>
              <td class="table-td-title detail">开票税额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.tax) }}
              </td>
              <td class="table-td-title detail">价税合计(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.totalPrice) }}
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
          <!--合同信息-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">合同信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">合同名称</td>
              <td class="table-td-title detail">合同类型</td>
              <td class="table-td-title detail">货品重量(吨)</td>
            </tr>
            <tr v-for="(item, idx) in printData.contract" :key="idx">
              <td class="table-td-content" style="text-align: center">
                {{ item.name }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ contractTypeFormat(item.type) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{
                  Number(item.expectNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                }}
              </td>
            </tr>
            <tr v-if="!printData.contract || printData.contract.length == 0">
              <td class="table-td-content" style="text-align: center"></td>
              <td class="table-td-content" style="text-align: center"></td>
              <td class="table-td-content" style="text-align: center"></td>
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
  listSticket,
  getSticket,
  delSticket,
  addSticket,
  updateSticket,
} from "@/api/project/sticket";
import { getStList } from "@/api/project/cplan";
import { getToken } from "@/utils/auth";
import aou from "@/views/project/sticket/aou/index";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";
import { getContractList } from "@/api/project/all";
export default {
  name: "Sticket",
  components: { aou },
  data() {
    return {
      isLook: 1,
      //图片上传
      isUpload: 1,
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
      // 收票管理表格数据
      sticketList: [],
      // 项目集合
      stOptions: [],
      //入库单集合
      tableData: [],
      //选中入库单集合
      tableselData: [],
      //预选中入库单集合
      tableybData: [],
      //ocr集合
      ocrData: [],
      // 审批状态字典
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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
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
      let sticketId = this.$route.params.sticketId;
      let row = { sticketId: sticketId };
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
    /** 查询收票管理列表 */
    getList() {
      this.loading = true;
      listSticket(this.queryParams).then((response) => {
        this.sticketList = response.rows;
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
        sticketId: null,
        stId: null,
        stId2: null,
        stName: null,
        proportion: "95%",
        ysPrice: "0.00",
        number: "0.00",
        price: "0.00",
        tax: "0.00",
        totalPrice: "0.00",
        state: 1,
        createBy: null,
        createTime: null,
        ocrData: [],
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
      this.ids = selection.map((item) => item.sticketId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      setTimeout(() => {
        this.$refs.aou.init();
      }, 0);
      this.title = "添加收票管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sticketId = row.sticketId || this.ids;
      getSticket(sticketId).then((response) => {
        this.form = response.data;
        this.open = true;
        setTimeout(() => {
          this.$refs.aou.init();
        }, 0);
        this.title = "修改收票管理";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const sticketId = row.sticketId || this.ids;
      this.$router.push("/sticket/look/" + sticketId);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const sticketIds = row.sticketId || this.ids;
      this.$confirm("是否确认删除收票管理?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSticket(sticketIds);
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
        "project/sticket/export",
        {
          ...this.queryParams,
        },
        `project_sticket.xlsx`
      );
    },
    // 合同类型字典翻译
    contractTypeFormat(type) {
      if (type == "1") {
        return "上游合同";
      } else if (type == "2") {
        return "下游合同";
      } else if (type == "3") {
        return "物流运输合同";
      } else if (type == "4") {
        return "物流服务合同";
      } else if (type == "5") {
        return "其他合同";
      }
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
      await getSticket(row.sticketId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = this.printData.fileList;
        this.printData.ocrList = this.printData.ocrList;
        this.printData.sy = this.printData.ysPrice - this.printData.totalPrice;
        this.printData.printType = "收票管理";
        let data = { stId: row.stId };
        //合同
        getContractList(data).then((response) => {
          this.printData.contract = response.rows;
        });
      });
      await getProcessDataByStId("14", row.sticketId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("14", row.sticketId).then((res) => {
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
