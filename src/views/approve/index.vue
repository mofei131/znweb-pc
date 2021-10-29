<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的发起" name="first">
        <div class="top">
          <el-form
            :model="queryParams"
            ref="ruleForm"
            :inline="true"
            label-width="80px"
          >
            <el-form-item label="流程名称">
              <el-input
                v-model="queryParams.processName"
                placeholder="请输入流程名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="流程类型" prop="processType">
              <el-select
                v-model="queryParams.processType"
                placeholder="请选择分类"
              >
                <el-option
                  v-for="dict in processTypeList"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发起人">
              <el-input
                v-model="queryParams.sponsor"
                placeholder="请输入发起人"
              ></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >搜索</el-button
            >
            <el-button type="warning" icon="el-icon-plus" @click="create"
              >创建流程</el-button
            >
          </el-form>
        </div>
        <div>
          <el-table :data="initiateData">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "项目操作"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "收款管理"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="审批人" align="center" prop="nickName" />
            <el-table-column label="状态" align="center" prop="status">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.status == '0'
                      ? 'info'
                      : scope.row.status == '1'
                      ? 'warning'
                      : scope.row.status == '2'
                      ? 'success'
                      : scope.row.status == '3'
                      ? 'danger'
                      : ''
                  "
                >
                  {{
                    scope.row.status == "0"
                      ? "未审批"
                      : scope.row.status == "1"
                      ? "审批中"
                      : scope.row.status == "2"
                      ? "已完成"
                      : scope.row.status == "3"
                      ? "驳回"
                      : ""
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button type="text" @click="handleSelect(scope.row)" circle
                  >查看详情</el-button
                >
                <el-button
                  v-if="scope.row.status == '3'"
                  type="text"
                  @click="reInitiate(scope.row)"
                  circle
                  >重新发起</el-button
                >
                <!-- </el-tooltip> -->
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的待办" name="second">
        <div>
          <div class="top">
            <el-form
              :model="from"
              ref="ruleForm"
              :inline="true"
              label-width="80px"
            >
              <el-form-item label="流程名称">
                <el-input
                  v-model="from.processName"
                  placeholder="请输入流程名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="流程类型" prop="processType">
                <el-select v-model="from.processType" placeholder="请选择分类">
                  <el-option
                    v-for="dict in processTypeList"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发起人">
                <el-input
                  v-model="from.sponsor"
                  placeholder="请输入发起人"
                ></el-input>
              </el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchDaiban"
                >搜索</el-button
              >
            </el-form>
          </div>
          <el-table :data="fromData">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "操作项目"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "收款管理"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="审批人" align="center" prop="nickName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button type="text" @click="handleApprove(scope.row)" circle
                  >审批</el-button
                >
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="from.pageNum"
            :limit.sync="from.pageSize"
            @pagination="daiban"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的已办" name="third">
        <div>
          <div class="top">
            <el-form
              :model="doneListFrom"
              ref="ruleForm"
              :inline="true"
              label-width="80px"
            >
              <el-form-item label="流程名称">
                <el-input
                  v-model="doneListFrom.processName"
                  placeholder="请输入流程名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="流程类型" prop="processType">
                <el-select
                  v-model="doneListFrom.processType"
                  placeholder="请选择分类"
                >
                  <el-option
                    v-for="dict in processTypeList"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发起人">
                <el-input
                  v-model="doneListFrom.sponsor"
                  placeholder="请输入发起人"
                ></el-input>
              </el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="yiban"
                >搜索</el-button
              >
            </el-form>
          </div>
          <el-table :data="doneList">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "操作项目"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "收款管理"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="发起人" align="center" prop="nickName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button
                  type="text"
                  @click="handleSelectYiban(scope.row)"
                  circle
                  >查看详情</el-button
                >
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="doneListFrom.pageNum"
            :limit.sync="doneListFrom.pageSize"
            @pagination="yiban"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="抄送我的" name="fourth">
        <!-- <div> -->
        <div class="top">
          <el-form
            :model="fromCc"
            ref="ruleForm"
            :inline="true"
            label-width="80px"
          >
            <el-form-item label="流程名称">
              <el-input
                v-model="fromCc.processName"
                placeholder="请输入流程名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="流程类型" prop="processType">
              <el-select v-model="fromCc.processType" placeholder="请选择分类">
                <el-option
                  v-for="dict in processTypeList"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发起人">
              <el-input
                v-model="fromCc.sponsor"
                placeholder="请输入发起人"
              ></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="chaosong"
              >搜索</el-button
            >
          </el-form>
        </div>
        <div>
          <el-table :data="fromCcData">
            <el-table-column
              label="流程名称"
              align="center"
              prop="processName"
            />
            <el-table-column label="流程类型" align="center" prop="processType">
              <template slot-scope="scope">
                {{
                  scope.row.processType == "1"
                    ? "新增项目"
                    : scope.row.processType == "2"
                    ? "操作项目"
                    : scope.row.processType == "3"
                    ? "合同管理"
                    : scope.row.processType == "4"
                    ? "预付款管理"
                    : scope.row.processType == "5"
                    ? "最终付款管理"
                    : scope.row.processType == "6"
                    ? "收款管理"
                    : scope.row.processType == "7"
                    ? "保证金管理"
                    : scope.row.processType == "8"
                    ? "资金计划"
                    : scope.row.processType == "9"
                    ? "物流付款"
                    : scope.row.processType == "10"
                    ? "入库"
                    : scope.row.processType == "11"
                    ? "出库"
                    : scope.row.processType == "12"
                    ? "供应商管理"
                    : scope.row.processType == "13"
                    ? "用煤单位"
                    : scope.row.processType == "14"
                    ? "收票记录"
                    : scope.row.processType == "15"
                    ? "开票申请"
                    : scope.row.processType == "16"
                    ? "期间费用"
                    : scope.row.processType == "17"
                    ? "实际收款"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="发起时间"
              align="center"
              prop="createTime"
            />
            <el-table-column label="发起人" align="center" prop="userName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-tooltip content="查看详情" id="view" placement="bottom"> -->
                <el-button
                  type="text"
                  @click="handleSelectYiban(scope.row)"
                  circle
                  >查看详情</el-button
                >
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="fromCc.pageNum"
            :limit.sync="fromCc.pageSize"
            @pagination="chaosong"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="textMap[popMode]"
      :close-on-click-modal="popMode == 'view'"
      v-if="insertDialog"
      :visible.sync="insertDialog"
      width="800px"
    >
      <insert
        :mode="popMode"
        :initData="popData"
        @popCancle="popCancle"
        @popOk="popOk"
      ></insert>
    </el-dialog>
    <el-dialog
      :title="textMap[popMode]"
      :close-on-click-modal="popMode == 'view'"
      v-if="approveDialog"
      :visible.sync="approveDialog"
      width="800px"
    >
      <approve
        :mode="popMode"
        :initData="popData"
        @popCancle="popCancle"
        @popOk="popOk"
      ></approve>
    </el-dialog>
  </div>
</template>

<script>
import {
  myInitiate,
  getMyUpcoming,
  myAlreadyDoneList,
  myCcList,
  view,
} from "@/api/approve/index.js";
import insert from "@/views/approve/add/index";
import approve from "@/views/approve/approves/index";
export default {
  components: { insert, approve },
  data() {
    return {
      activeName: "first",
      total: 0,
      processTypeList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      from: {
        pageNum: 1,
        pageSize: 10,
      },
      doneListFrom: {
        pageNum: 1,
        pageSize: 10,
      },
      doneList: [],
      fromData: [],
      fromCc: {
        pageNum: 1,
        pageSize: 10,
      },
      fromCcData: [],
      approveDialog: false,
      initiateData: [],
      insertDialog: false,
      popMode: "",
      popData: {},
      textMap: {
        create: "创建流程",
        approve: "流程审批",
        view: "查看详情",
        reInitiate: "重新发起",
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("process_type").then((response) => {
      this.processTypeList = response.data;
    });
  },
  methods: {
    typeFormat(row, column) {
      return this.selectDictLabel(this.processTypeList, row.type);
    },
    // 页面初始化
    getList() {
      myInitiate(this.queryParams).then((res) => {
        this.total = res.data.total;
        this.initiateData = res.data.records;
      });
    },
    // 搜索按钮
    search() {
      this.getList();
    },
    // 我的待办搜索
    searchDaiban() {
      this.daiban();
    },
    // 创建流程按钮
    create() {
      this.popMode = "create";
      this.insertDialog = true;
    },
    // 我的已办查看详情
    handleSelectYiban(val) {
      let data = { id: val.id, pageNum: 1, pageSize: 10 };
      let row = [];
      view(data).then((res) => {
        row = res.data;
        this.popMode = "view";
        this.popData = row[0];
        this.insertDialog = true;
      });
    },
    // 查看详情
    handleSelect(val) {
      this.popMode = "view";
      this.popData = val;
      this.insertDialog = true;
    },
    // 重新发起
    reInitiate(val) {
      this.popMode = "reInitiate";
      this.popData = val;
      this.insertDialog = true;
    },
    daiban() {
      // 我的待办
      getMyUpcoming(this.from).then((res) => {
        this.total = res.data.total;
        this.fromData = res.data.records;
      });
    },
    yiban() {
      myAlreadyDoneList(this.doneListFrom).then((res) => {
        this.total = res.data.total;
        this.doneList = res.data.records;
      });
    },
    chaosong() {
      myCcList(this.fromCc).then((res) => {
        this.total = res.total;
        this.fromCcData = res.rows;
      });
    },
    // tab页点击事件
    handleClick(tab, event) {
      if (tab.name == "first") {
        this.getList();
      }
      if (tab.name == "second") {
        this.daiban();
      }
      if (tab.name == "third") {
        this.yiban();
      }
      if (tab.name == "fourth") {
        this.chaosong();
      }
    },
    // 点击审批按钮
    handleApprove(row) {
      this.popMode = "approve";
      this.popData = row;
      this.approveDialog = true;
    },
    popCancle() {},
    popOk() {
      this.insertDialog = false;
      this.approveDialog = false;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: flex-end;
}
</style>>
