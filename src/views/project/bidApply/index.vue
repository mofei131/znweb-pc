<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审批状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="审批状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="stName">
        <el-input
          v-model="queryParams.stName"
          placeholder="项目名称"
          clearable
          size="small"
          @keyup.enter.native="stName"
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
          v-hasPermi="['project:bidApply:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="bidApplyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="投标平台" align="center" prop="bidPlatform" />
      <el-table-column label="投标保证金（元）" align="center" prop="bidBond">
        <template slot-scope="scope">
          {{
            Number(scope.row.bidBond)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="履约保证金（元）"
        align="center"
        prop="performanceBond"
      >
        <template slot-scope="scope">
          {{
            Number(scope.row.performanceBond)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="投标数量（吨）" align="center" prop="bidNumber">
        <template slot-scope="scope">
                    {{
                      Number(scope.row.bidNumber)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
      </el-table-column>
      <el-table-column
        label="项目状态"
        :formatter="statusFormat"
        align="center"
        prop="state"
      />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.state || scope.row.state == '4'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:bidApply:edit']"
            >修改</el-button
          >
          <!-- <el-button v-if="scope.row.state == '4'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:bidApply:remove']"
          >删除</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:bidApply:edit']"
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

    <!-- 添加或修改投标申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="stId">
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
            <el-form-item label="项目编号" prop="stNumber">
              {{ form.stNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价模式" prop="unitPriceMode">
              <el-radio-group v-model="form.unitPriceMode">
                <el-radio
                  v-for="(item, index) in unitPriceModeOptions"
                  :key="index"
                  :label="item.key"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`单价(元/${priceLabel})`" prop="bidPrice">
              <el-input v-model="form.bidPrice" placeholder="请输入单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投标平台" prop="bidPlatform">
              <el-input
                v-model="form.bidPlatform"
                placeholder="请输入投标平台"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投标保证金(元)" prop="bidBond">
              <el-input v-model="form.bidBond" placeholder="请输入投标保证金" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="履约保证金(元)" prop="performanceBond">
              <el-input
                v-model="form.performanceBond"
                placeholder="请输入履约保证金"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`投标数量(吨)`" prop="bidNumber">
              <el-input v-model="form.bidNumber" placeholder="请输入投标数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发站" prop="sendStation">
              <el-input v-model="form.sendStation" placeholder="请输入发站" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到站" prop="arriveStation">
              <el-input v-model="form.arriveStation" placeholder="请输入到站" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload
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
                <div slot="tip" class="el-upload__tip">
                  支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
                  v-text="selectDictLabel(statusOptions, printData.state)"
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
              <td class="table-td-title detail">投标平台</td>
              <td class="table-td-content">
                {{ printData.bidPlatform }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">投标保证金(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.bidBond) }}
              </td>
              <td class="table-td-title detail">投标数量(吨)</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.bidNumber) }}
              </td>
              <td class="table-td-title detail">单价(元/吨)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.bidPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">发站</td>
              <td class="table-td-content">
                {{ printData.sendStation }}
              </td>
              <td class="table-td-title detail">到站</td>
              <td class="table-td-content" colspan="3">
                {{ printData.arriveStation }}
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
  listBidApply,
  getBidApply,
  delBidApply,
  addBidApply,
  updateBidApply,
  getStList,
} from "@/api/project/bidApply";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";
export default {
  name: "BidApply",
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
      // 投标申请表格数据
      bidApplyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stName: null,
        unitPriceMode: null,
        state: null,
        beginTime: "",
        endTime: "",
      },
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        unitPriceMode: [
          { required: true, message: "请选单价模式", trigger: "blur" },
        ],
        bidPrice: [{ required: true, message: "请输入单价", trigger: "blur" }],
        bidPlatform: [
          { required: true, message: "请输入投标平台", trigger: "blur" },
        ],
        bidBond: [
          { required: true, message: "请输入投标保证金", trigger: "blur" },
        ],
        performanceBond: [
          { required: true, message: "请输入履约保证金", trigger: "blur" },
        ],
        bidNumber: [
          { required: true, message: "请输入投标数量", trigger: "blur" },
        ],
      },
      statusOptions: [],
      // 单价模式
      unitPriceModeOptions: [
        { key: "吨", label: "吨" },
        { key: "热值", label: "热值" },
      ],
      // 项目集合
      stOptions: [],
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      // 打印
      printReviewVisible: false,
      printData: {},
    };
  },
  computed: {
    priceLabel() {
      if (this.form.unitPriceMode === "吨") {
        return "吨";
      } else if (this.form.unitPriceMode === "热值") {
        return "kcal";
      }
    },
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.statusOptions = response.data;
    });
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let bidId = this.$route.params.bidId;
      let row = { bidId: bidId };
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
    /** 查询投标申请列表 */
    getList() {
      this.loading = true;
      listBidApply(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.bidApplyList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      getStList().then((response) => {
        this.stOptions = response.rows;
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
        bidId: null,
        stId: null,
        stName: null,
        unitPriceMode: null,
        bidPlatform: null,
        bidPrice: null,
        bidBond: null,
        performanceBond: null,
        sendStation: null,
        bidNumber: null,
        arriveStation: null,
        remark: null,
        state: null,
        stIdOld: null,
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
      this.ids = selection.map((item) => item.bidId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.form.unitPriceMode = "吨";
      this.open = true;
      this.title = "添加投标申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bidId = row.bidId || this.ids;
      getBidApply(bidId).then((response) => {
        this.form = response.data;
        this.fileList = this.form.fileList || [];
        this.open = true;
        this.title = "修改投标申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.stIdOld) {
            this.form.stId = this.form.stIdOld;
          }
          if (this.form.bidId != null) {
            updateBidApply(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBidApply(this.form).then((response) => {
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
      const bidIds = row.bidId || this.ids;
      this.$confirm(
        '是否确认删除投标申请编号为"' + bidIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBidApply(bidIds);
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
        "project/bidApply/export",
        {
          ...this.queryParams,
        },
        `project_bidApply.xlsx`
      );
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.state);
    },
    changeSt(obj) {
      this.form.stIdOld = obj.stId;
      this.form.stName = obj.name;
      this.form.stNumber = obj.number;
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
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const bidId = row.bidId || this.ids;
      this.$router.push("/bidApply/look/" + bidId);
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
      await getBidApply(row.bidId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = this.form.fileList || [];
        this.printData.printType = "投标申请";
      });
      await getProcessDataByStId("18", row.bidId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("18", row.bidId).then((res) => {
        this.printData.nodeStateList = res.data;
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
