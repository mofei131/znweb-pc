<template>
  <div class="app-container">
    <!-- <createPrint @abcClick="printSomething"></createPrint>
     -->

    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="代办人" prop="sqId">
        <el-select
          filterable
          v-model="queryParams.userId"
          placeholder="请选择代办人"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in userOptions"
            :key="dict.userId"
            :label="dict.nickName"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
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
          v-hasPermi="['project:st:add']"
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
      <!--          v-hasPermi="['project:st:edit']"-->
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
      <!--          v-hasPermi="['project:st:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:st:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="stList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column label="项目id" align="center" prop="stId" />-->
      <el-table-column label="项目名称" align="center" prop="name" />
      <el-table-column label="项目编号" align="center" prop="number" />
      <el-table-column label="项目金额" align="center" prop="amount">
        <template slot-scope="scope">
          {{
            Number(scope.row.amount)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="预计利润" align="center" prop="expectProfits">
        <template slot-scope="scope">
          {{
            Number(scope.row.expectProfits)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="代办人" align="center" prop="userName" />
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
        label="审核状态"
        :formatter="statusFormat"
        align="center"
        prop="state"
      />
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
            v-hasPermi="['project:st:edit']"
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
          <!--            v-if="scope.row.xmState=='1'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdataState(scope.row,2)"-->
          <!--            v-hasPermi="['project:st:edit']"-->
          <!--          >异常</el-button>-->
          <!--          <el-button-->
          <!--            v-if="scope.row.xmState=='2'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdataState(scope.row,1)"-->
          <!--            v-hasPermi="['project:st:edit']"-->
          <!--          >继续</el-button>-->
          <!--          <el-button-->
          <!--            v-if="scope.row.xmState=='2'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdataState(scope.row,3)"-->
          <!--            v-hasPermi="['project:st:edit']"-->
          <!--          >结束</el-button>-->
          <!--          <el-button-->
          <!--            v-if="scope.row.xmState=='1'"-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdataState(scope.row,4)"-->
          <!--            v-hasPermi="['project:st:edit']"-->
          <!--          >完成</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:st:remove']"-->
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

    <!-- 添加或修改项目信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-steps :active="active" finish-status="success" v-if="isLook != 4">
        <el-step title="基本信息"></el-step>
        <el-step title="自融资金方"></el-step>
        <el-step title="终端客户"></el-step>
        <el-step title="站台情况"></el-step>
        <el-step title="其他内容"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div style="margin-top: 50px" v-if="active == '0' && isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目金额(万元)" prop="amount">
                <el-input v-model="form.amount" placeholder="请输入项目金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="立项编号" prop="productNo">
                <el-input
                  v-model="form.productNo"
                  placeholder="请输入立项编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代办人" prop="userId">
                <el-select
                  filterable
                  value-key="userId"
                  @change="changeUser"
                  v-model="form.userId"
                  placeholder="请选择代办人"
                  style="width: 100%"
                >
                  <el-option
                    v-for="user in userOptions"
                    :key="user.userId"
                    :label="user.nickName"
                    :value="user"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplierId">
                <el-select
                  filterable
                  value-key="supplierId"
                  @change="changeSupplier"
                  v-model="form.supplierId"
                  placeholder="请选择供应商"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in supplierOptions"
                    :key="obj.supplierId"
                    :label="obj.name"
                    :value="obj"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户经理" prop="managerName">
                <el-input
                  v-model="form.managerName"
                  placeholder="请输入客户经理"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="结算比例" prop="settlementP">
                <el-select
                  v-model="form.settlementP"
                  placeholder="请选择结算比例"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in settlementPOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="form.settlementP == '其他'">
              <el-col :span="3">
                <el-form-item label="" prop="settlementPA1" label-width="10px">
                  <span
                    ><el-input
                      v-model="form.settlementPA1"
                      placeholder=""
                      style="width: 80%" /></span
                  ><span>%</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="" prop="settlementPA2" label-width="10px">
                  <span
                    ><el-input
                      v-model="form.settlementPA2"
                      placeholder=""
                      style="width: 80%" /></span
                  ><span>%</span>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="" prop="settlementPA3" label-width="10px">
                  <span
                    ><el-input
                      v-model="form.settlementPA3"
                      placeholder=""
                      style="width: 80%" /></span
                  ><span>%</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="履约保证金" prop="marginType">
                <el-radio-group v-model="form.marginType">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div v-if="form.marginType == '1'">
                <el-form-item
                  label="履约保证金金额（万元）"
                  prop="margin"
                  :rules="
                    form.marginType == '1'
                      ? rules.margin
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="form.margin"
                    placeholder="请输入履约保证金"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式" prop="settlementWay">
                <el-select
                  v-model="form.settlementWay"
                  placeholder="请选择结算方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in settlementWayOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="服务周期开始" prop="cycleStart">
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 100%"
                  v-model="form.cycleStart"
                  @change="jsprice"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择服务周期开始"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务周期结束" prop="cycleEnd">
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 100%"
                  v-model="form.cycleEnd"
                  @change="jsprice"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择服务周期结束"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务费收取模式" prop="chargemType">
                <el-radio-group v-model="form.chargemType">
                  <el-radio label="1">年息</el-radio>
                  <el-radio label="2">固定差价</el-radio>
                  <el-radio label="3">年息+固定差价</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div v-if="form.chargemType == '1' || form.chargemType == '3'">
                <el-form-item label="年息服务费费率(%)" prop="chargemNx">
                  <el-input v-model="form.chargemNx" placeholder="请输入年息" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-if="form.chargemType == '2' || form.chargemType == '3'">
                <el-form-item label="固定差价(元)" prop="chargemGd">
                  <el-input
                    v-model="form.chargemGd"
                    placeholder="请输入固定差价"
                    @change="jsprice"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计单价(元)" prop="expectPrice">
                <el-input
                  v-model="form.expectPrice"
                  placeholder="请输入预计单价"
                  @change="jsprice"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计重量(吨)" prop="expectWeight">
                <el-input
                  v-model="form.expectWeight"
                  placeholder="请输入预计重量"
                  @change="jsprice"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="成本年服务费费率(%)" prop="rateYear">
                <el-input
                  v-model="form.rateYear"
                  placeholder="请输入成本年服务费费率"
                  @change="jsprice"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计利润" prop="expectProfits">
                <el-input
                  v-model="form.expectProfits"
                  placeholder="请输入预计利润"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 50px" v-if="active == '1' && isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="自融资金方" prop="shType">
                <el-radio-group v-model="form.shType">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.shType == '1'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="shName">
                  <el-input
                    v-model="form.shName"
                    placeholder="请输入公司名称"
                    :rules="
                      form.shType == '1' ? rules.shName : [{ required: false }]
                    "
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="性质" prop="shXz">
                  <el-select
                    v-model="form.shXz"
                    style="width: 100%"
                    placeholder="请选择性质"
                    :rules="
                      form.shType == '1' ? rules.shXz : [{ required: false }]
                    "
                  >
                    <el-option
                      v-for="obj in shXzOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合作方式" prop="shHztype">
                  <el-select
                    v-model="form.shHztype"
                    style="width: 100%"
                    placeholder="请选择合作方式"
                    :rules="
                      form.shType == '1'
                        ? rules.shHztype
                        : [{ required: false }]
                    "
                  >
                    <el-option
                      v-for="obj in shHztypeOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <div v-if="form.shHztype == '年息收取'">
                  <el-form-item label="资金费率%" prop="shHzrate">
                    <el-input
                      v-model="form.shHzrate"
                      placeholder="请输入资金费率"
                      :rules="
                        form.shType == '1'
                          ? rules.shHzrate
                          : [{ required: false }]
                      "
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="下游渠道" prop="shChanneltype">
                  <el-radio-group
                    v-model="form.shChanneltype"
                    :rules="
                      form.shType == '1'
                        ? rules.shChanneltype
                        : [{ required: false }]
                    "
                  >
                    <el-radio label="1">有</el-radio>
                    <el-radio label="2">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div v-if="form.shChanneltype == '1'">
                  <el-form-item label="下游渠道年限" prop="shChannelyear">
                    <el-select
                      v-model="form.shChannelyear"
                      style="width: 100%"
                      placeholder="请选择下游渠道年限"
                      :rules="
                        form.shType == '1'
                          ? rules.shChannelyear
                          : [{ required: false }]
                      "
                    >
                      <el-option
                        v-for="obj in shChannelyearOptions"
                        :key="obj.key"
                        :label="obj.label"
                        :value="obj.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="结算比例" prop="shSettlement">
                  <el-select
                    v-model="form.shSettlement"
                    style="width: 100%"
                    placeholder="请选择结算比例"
                    :rules="
                      form.shType == '1'
                        ? rules.shSettlement
                        : [{ required: false }]
                    "
                  >
                    <el-option
                      v-for="obj in shSettlementOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <div v-if="form.shSettlement == '其他'">
                <el-col :span="3">
                  <el-form-item
                    label=""
                    prop="shSettlementA1"
                    label-width="10px"
                  >
                    <span
                      ><el-input
                        v-model="form.shSettlementA1"
                        placeholder=""
                        style="width: 80%" /></span
                    ><span>%</span>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    label=""
                    prop="shSettlementA2"
                    label-width="10px"
                  >
                    <span
                      ><el-input
                        v-model="form.shSettlementA2"
                        placeholder=""
                        style="width: 80%" /></span
                    ><span>%</span>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item
                    label=""
                    prop="shSettlementA3"
                    label-width="10px"
                  >
                    <span
                      ><el-input
                        v-model="form.shSettlementA3"
                        placeholder=""
                        style="width: 80%" /></span
                    ><span>%</span>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="履约保证金" prop="shMargintype">
                  <el-radio-group
                    v-model="form.shMargintype"
                    :rules="
                      form.shType == '1'
                        ? rules.shMargintype
                        : [{ required: false }]
                    "
                  >
                    <el-radio label="1">有</el-radio>
                    <el-radio label="2">无</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <div v-if="form.shMargintype == '1'">
                <el-col :span="12">
                  <el-form-item label="履约保证金(元)" prop="shMargin">
                    <el-input
                      v-model="form.shMargin"
                      placeholder="请输入履约保证金"
                      :rules="
                        form.shType == '1'
                          ? rules.shMargin
                          : [{ required: false }]
                      "
                    />
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同签署" prop="shContracttype">
                  <el-select
                    v-model="form.shContracttype"
                    style="width: 100%"
                    placeholder="请选择合同签署"
                    :rules="
                      form.shType == '1'
                        ? rules.shContracttype
                        : [{ required: false }]
                    "
                  >
                    <el-option
                      v-for="obj in shContracttypeOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="margin-top: 50px" v-if="active == '2' && isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端客户名称" prop="terminalId">
                <el-select
                  filterable
                  value-key="terminalId"
                  style="width: 100%"
                  @change="changeTerinal"
                  v-model="form.terminalId"
                  placeholder="请选择终端客户"
                >
                  <el-option
                    v-for="te in terminalOptions"
                    :key="te.terminalId"
                    :label="te.name"
                    :value="te"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性质" prop="tXz">
                <el-select
                  v-model="form.tXz"
                  style="width: 100%"
                  placeholder="请选择性质"
                >
                  <el-option
                    v-for="obj in tXzOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="立户情况" prop="tAccount">
                <el-select
                  v-model="form.tAccount"
                  placeholder="请选择立户情况"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tAccountOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合作年限" prop="tCyear">
                <el-select
                  v-model="form.tCyear"
                  placeholder="请选择合作年限"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tCyearOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否投标" prop="tTendertype">
                <el-radio-group v-model="form.tTendertype">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="form.tTendertype == '1'">
                <el-form-item label="投标方式" prop="tTender">
                  <el-select
                    v-model="form.tTender"
                    placeholder="请选择投标方式"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="obj in tTenderOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="投标保证金" prop="tMargintype">
                <el-radio-group v-model="form.tMargintype">
                  <el-radio label="1">有</el-radio>
                  <el-radio label="2">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="form.tMargintype == '1'">
                <el-form-item label="投标保证金(万元)" prop="tMargin">
                  <el-input
                    v-model="form.tMargin"
                    placeholder="请输入投标保证金"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保证金缴纳时间" prop="tMargintime">
                <el-select
                  v-model="form.tMargintime"
                  placeholder="请选择保证金缴纳时间"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tMargintimeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.tMargintime == '其他'">
              <el-form-item label="备注" prop="tbz">
                <el-input v-model="form.tbz" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同签署" prop="tContracttype">
                <el-select
                  v-model="form.tContracttype"
                  placeholder="请选择合同签署"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tContracttypeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div v-if="form.tContracttype == '后置'">
                <el-form-item label="合同后置时间" prop="tContracttime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.tContracttime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择合同后置时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运输方式" prop="tTransporttype">
                <el-select
                  v-model="form.tTransporttype"
                  placeholder="请选择运输方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tTransporttypeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发站" prop="tTransportstart">
                <el-input
                  v-model="form.tTransportstart"
                  placeholder="请输入发站"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到站" prop="tTransportend">
                <el-input
                  v-model="form.tTransportend"
                  placeholder="请输入到站"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="到场数质确认时间" prop="tOktime">
                <el-select
                  v-model="form.tOktime"
                  placeholder="请选择到场数质确认时间"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tOktimeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到场数质确认方式" prop="tOktype">
                <el-select
                  v-model="form.tOktype"
                  placeholder="请选择到场数质确认方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tOktypeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票结算方式" prop="tSettlementtype">
                <el-select
                  v-model="form.tSettlementtype"
                  placeholder="请选择开票结算方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tSettlementtypeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算规则" prop="tSettlementgz">
                <el-select
                  v-model="form.tSettlementgz"
                  placeholder="请选择结算规则"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tSettlementgzOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款账期" prop="tPaymentdays">
                <el-input
                  v-model="form.tPaymentdays"
                  placeholder="请输入回款账期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式" prop="tPaymenttype">
                <el-select
                  v-model="form.tPaymenttype"
                  placeholder="请选择付款方式"
                  style="width: 100%"
                >
                  <el-option
                    v-for="obj in tPaymenttypeOptions"
                    :key="obj.key"
                    :label="obj.label"
                    :value="obj.key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 50px" v-if="active == '3' && isLook != 4">
          <el-form-item label="站台情况" prop="platformType">
            <el-radio-group v-model="form.platformType">
              <el-radio label="1">有</el-radio>
              <el-radio label="2">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.platformType == '1'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="站台名字" prop="pName">
                  <el-input v-model="form.pName" placeholder="请输入站台名字" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="站台经营方式" prop="pJymode">
                  <el-select
                    v-model="form.pJymode"
                    placeholder="请选择站台经营方式"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="obj in pJymodeOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="站台规模" prop="pSize">
                  <el-input v-model="form.pSize" placeholder="请输入站台规模" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="站台发运方式" prop="pFymode">
                  <el-select
                    v-model="form.pFymode"
                    placeholder="请选择站台发运方式"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="obj in pFymodeOptions"
                      :key="obj.key"
                      :label="obj.label"
                      :value="obj.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <div v-if="form.pFymode == '第三方代发'">
                  <el-form-item label="承运方发运名称" prop="pCname">
                    <el-input
                      v-model="form.pCname"
                      placeholder="请输入承运方发运名称"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <div v-if="form.pFymode != '独立立户'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="承运方性质" prop="pCxz">
                    <el-select
                      v-model="form.pCxz"
                      placeholder="请选择承运方性质"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="obj in pCxzOptions"
                        :key="obj.key"
                        :label="obj.label"
                        :value="obj.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="承运方发运年限" prop="pCyear">
                    <el-select
                      v-model="form.pCyear"
                      placeholder="请选择承运方发运年限"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="obj in pCyearOptions"
                        :key="obj.key"
                        :label="obj.label"
                        :value="obj.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="承运方发运规模（万吨/年）"
                    prop="pCnumber"
                  >
                    <el-input
                      v-model="form.pCnumber"
                      placeholder="请输入承运方发运规模"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div style="margin-top: 50px" v-if="active == '4' && isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注说明" prop="node">
                <el-input
                  type="textarea"
                  :rows="5"
                  v-model="form.node"
                  placeholder="请输入备注说明"
                />
              </el-form-item>
            </el-col>
          </el-row>
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
        </div>
        <div style="margin-top: 50px" v-if="isLook == 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="说明" prop="node">
                <el-input
                  type="textarea"
                  :rows="5"
                  v-model="form.xmNode"
                  placeholder="请输入操作说明"
                />
              </el-form-item>
            </el-col>
          </el-row>
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
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="active != '0' && isLook != 4" type="info" @click="on"
          >上一步</el-button
        >
        <el-button
          v-if="(active != '4') & (isLook != 4)"
          type="success"
          @click="next"
          >下一步</el-button
        >
        <el-button v-if="isLook == 4" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button
          v-if="active == '4' && isLook != 3"
          type="primary"
          @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      ref="printReviewAialog"
      title="打印预览"
      :visible.sync="printReviewVisible"
      @close="onPrintReviewClose"
      width="60%"
    >
      <div class="print-div" id="print_area">
        <div class="search-title-content">
          <div style="padding: 30px 0 15px">
            <el-row type="flex" justify="space-between">
              <el-col :span="4"
                ><span
                  style="font-weight: bold; font-size: 16px"
                  v-text="printData.type"
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
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">基本信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                <template>{{ printData.number }}</template>
              </td>
              <td class="table-td-title detail">项目名称</td>
              <td class="table-td-content">
                <template>{{ printData.name }}</template>
              </td>
              <td class="table-td-title detail">项目金额(万元)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.amount) }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">立项编号</td>
              <td class="table-td-content">
                <template>{{ printData.productNo }}</template>
              </td>
              <td class="table-td-title detail">结算比例</td>
              <td class="table-td-content">
                <template>{{ printData.settlementP }}</template>
              </td>
              <td class="table-td-title detail">客户经理</td>
              <td class="table-td-content">
                <template>{{ printData.managerName }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">代办人</td>
              <td class="table-td-content" colspan="5">
                <template>{{ printData.userName }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="4">履约保证金</td>
            </tr>
            <tr>
              <td class="table-td-title detail">履约保证金金额(万元)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.margin) }}</template>
              </td>
              <td class="table-td-title detail">服务周期开始</td>
              <td class="table-td-content">
                <template>{{ printData.cycleStart }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">结算方式</td>
              <td class="table-td-content">
                <template>{{ printData.settlementWay}}</template>
              </td>
              <td class="table-td-title detail">服务周期结束</td>
              <td class="table-td-content">
                <template>{{ printData.cycleEnd }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">服务费</td>
            </tr>
            <tr>
              <td class="table-td-title detail">年费收取模式</td>
              <td class="table-td-content">
                <template>{{ printData.chargemType }}</template>
              </td>
              <td class="table-td-title detail">年费服务费费率(%)</td>
              <td class="table-td-content">
                <template>{{ printData.chargemNx }}</template>
              </td>
              <td class="table-td-title detail">固定差价</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.chargemGd) }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">预计单价(元)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.expectPrice) }}</template>
              </td>
              <td class="table-td-title detail">预计重量(吨)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.weightFilter(printData.expectWeight) }}</template>
              </td>
              <td class="table-td-title detail">成本年服务费费率(%)</td>
              <td class="table-td-content">
                <template>{{ printData.rateYear }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">预计利润</td>
              <td class="table-td-content" colspan="5">
                <template>{{ printData.expectProfits }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">自助金融方</td>
            </tr>
            <tr>
              <td class="table-td-title detail">公司名称</td>
              <td class="table-td-content">
                <template>{{ printData.shName }}</template>
              </td>
              <td class="table-td-title detail">性质</td>
              <td class="table-td-content">
                <template>{{ printData.shXz }}</template>
              </td>
              <td class="table-td-title detail">合作方式</td>
              <td class="table-td-content">
                <template>{{ printData.shHztype }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">资金费率(%)</td>
              <td class="table-td-content">
                <template>{{ printData.shHzrate }}</template>
              </td>
              <td class="table-td-title detail">下游渠道年限</td>
              <td class="table-td-content">
                <template>{{ printData.shChannelyear }}</template>
              </td>
              <td class="table-td-title detail">结算比例</td>
              <td class="table-td-content">
                <template>{{ printData.shSettlement }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">履约保证金(元)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.shMargin) }}</template>
              </td>
              <td class="table-td-title detail">合同签署</td>
              <td class="table-td-content" colspan="5">
                <template>{{ printData.shContracttype }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">终端客户</td>
            </tr>
            <tr>
              <td class="table-td-title detail">终端客户名称</td>
              <td class="table-td-content">
                <template>{{ printData.tName }}</template>
              </td>
              <td class="table-td-title detail">性质</td>
              <td class="table-td-content">
                <template>{{ printData.tXz }}</template>
              </td>
              <td class="table-td-title detail">立户情况</td>
              <td class="table-td-content">
                <template>{{ printData.tAccount }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">合作年限</td>
              <td class="table-td-content">
                <template>{{ printData.tCyear }}</template>
              </td>
              <td class="table-td-title detail">投标方式</td>
              <td class="table-td-content">
                <template>{{ printData.tTender }}</template>
              </td>
              <td class="table-td-title detail">投标保证金</td>
              <td class="table-td-content">
                <template>{{ printData.tMargintype }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">投标保证金(万元)</td>
              <td class="table-td-content">
                <template>{{ $options.filters.moneyFilter(printData.tMargin) }}</template>
              </td>
              <td class="table-td-title detail">保证金缴纳时间</td>
              <td class="table-td-content">
                <template>{{ printData.tMargintime }}</template>
              </td>
              <td class="table-td-title detail">合同签署</td>
              <td class="table-td-content">
                <template>{{ printData.tContracttype }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">合同后置时间</td>
              <td class="table-td-content">
                <template>{{ printData.tContracttime }}</template>
              </td>
              <td class="table-td-title detail">运输方式</td>
              <td class="table-td-content">
                <template>{{ printData.tTransporttype }}</template>
              </td>
              <td class="table-td-title detail">发站</td>
              <td class="table-td-content">
                <template>{{ printData.tTransportstart }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">到站</td>
              <td class="table-td-content">
                <template>{{ printData.tTransportend }}</template>
              </td>
              <td class="table-td-title detail">到场数质确认时间</td>
              <td class="table-td-content">
                <template>{{ printData.tOktime }}</template>
              </td>
              <td class="table-td-title detail">到场数质确认方式</td>
              <td class="table-td-content">
                <template>{{ printData.tOktype }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">开票结算方式</td>
              <td class="table-td-content">
                <template>{{ printData.tSettlementtype }}</template>
              </td>
              <td class="table-td-title detail">结算规则</td>
              <td class="table-td-content">
                <template>{{ printData.tSettlementgz }}</template>
              </td>
              <td class="table-td-title detail">回款账期</td>
              <td class="table-td-content">
                <template>{{ printData.tPaymentdays }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">付款方式</td>
              <td class="table-td-content" colspan="5">
                <template>{{ printData.tPaymenttype }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">站台情况</td>
            </tr>
            <tr>
              <td class="table-td-title detail">站台名字</td>
              <td class="table-td-content">
                <template>{{ printData.pName }}</template>
              </td>
              <td class="table-td-title detail">站台经营方式</td>
              <td class="table-td-content">
                <template>{{ printData.pJymode }}</template>
              </td>
              <td class="table-td-title detail">站台规模</td>
              <td class="table-td-content">
                <template>{{ printData.pSize }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">站台发运方式</td>
              <td class="table-td-content">
                <template>{{ printData.pFymode }}</template>
              </td>
              <td class="table-td-title detail">承运方发运名称</td>
              <td class="table-td-content">
                <template>{{ printData.pCname }}</template>
              </td>
              <td class="table-td-title detail">承运方性质</td>
              <td class="table-td-content">
                <template>{{ printData.pCxz }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">程远方发运年限</td>
              <td class="table-td-content">
                <template>{{ printData.pCyear }}</template>
              </td>
              <td class="table-td-title detail">承运方发运规模(万吨/年)</td>
              <td class="table-td-content" colspan="5">
                <template>{{ $options.filters.weightFilter(printData.pCnumber) }}</template>
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">其他内容</td>
            </tr>
            <tr>
              <td class="table-td-title detail" style="width: 20%">备注</td>
              <td class="table-td-content" colspan="5">
                <template>{{ printData.node }}</template>
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail" style="width: 20%">附件</td>
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
            <tr v-for="(item, idx) in printData.nodeStateList" :key="'a' + idx">
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
  listSt,
  getSt,
  delSt,
  addSt,
  updateSt,
  getUserList,
  getSupplierList,
  getTerminalList,
  getApprovalProcessList,
} from "@/api/project/st";
import { getToken } from "@/utils/auth";
import look from "@/views/project/st/look/index";
import { getStList } from "@/api/project/gry";
import print from "print-js";
import { getProcessDataByStId } from "@/api/approve";
export default {
  name: "St",
  components: {
    look,
  },
  data() {
    const validatePrice = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
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
      //步骤条id
      active: 0,
      arr0: [
        "name",
        "productNo",
        "amount",
        "userId",
        "supplierId",
        "settlementP",
        "margin",
        "settlementWay",
        "cycleStart",
        "cycleEnd",
        "chargemNx",
        "chargemGd",
        "expectPrice",
        "expectWeight",
        "rateYear",
        "expectProfits",
      ],
      arr1: [
        "shName",
        "shXz",
        "shHzrate",
        "shChannelyear",
        "shSettlement",
        "shMargin",
        "shshContracttype",
      ],
      arr2: [
        "terminalId",
        "tXz",
        "tAccount",
        "tCyear",
        "tTender",
        "tMargin",
        "tMargintime",
        "tContracttype",
        "tContracttime",
        "tTransporttype",
        "tTransportstart",
        "tTransportend",
        "tOktime",
        "tOktype",
        "tSettlementtype",
        "tSettlementgz",
        "tPaymentdays",
        "tPaymenttype",
      ],
      arr3: [
        "pName",
        "pJymode",
        "pSize",
        "pFymode",
        "pCname",
        "pCxz",
        "pCyear",
        "pCnumber",
      ],
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
      // 项目信息表格数据
      stList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 代办人集合
      userOptions: [],
      // 终端客户集合
      terminalOptions: [],
      // 供应商集合
      supplierOptions: [],
      //结算比例集合
      settlementPOptions: [
        { key: "70%-20%-10%", label: "70%-20%-10%" },
        { key: "70%-10%-20%", label: "70%-10%-20%" },
        { key: "70%-15%-15%", label: "70%-15%-15%" },
        { key: "80%-10%-10%", label: "80%-10%-10%" },
        { key: "其他", label: "其他" },
      ],
      //性质
      shXzOptions: [
        { key: "国有企业", label: "国有企业" },
        { key: "外资企业", label: "外资企业" },
        { key: "上市企业", label: "上市企业" },
        { key: "私营企业", label: "私营企业" },
      ],
      //结算方式
      settlementWayOptions: [
        { key: "车板模式", label: "车板模式" },
        { key: "车板加运费模式", label: "车板加运费模式" },
        { key: "到厂模式", label: "到厂模式" },
        { key: "储备业务", label: "储备业务" },
        { key: "货权模式", label: "货权模式" },
        { key: "自营模式", label: "自营模式" },
      ],
      //合作方式
      shHztypeOptions: [
        { key: "固定差价买断", label: "固定差价买断" },
        {
          key: "固定差价买断+承兑贴息调整",
          label: "固定差价买断+承兑贴息调整",
        },
        { key: "年息收取", label: "年息收取" },
        { key: "其他", label: "其他" },
      ],
      //下游渠道年限
      shChannelyearOptions: [
        { key: "0年", label: "0年" },
        { key: "1年", label: "1年" },
        { key: "2年", label: "2年" },
        { key: "3年", label: "3年" },
        { key: "3年以上", label: "3年以上" },
        { key: "5年以上", label: "5年以上" },
      ],
      //结算比例
      shSettlementOptions: [
        { key: "70%-25%-5%", label: "70%-25%-5%" },
        { key: "95%-5%", label: "95%-5%" },
        { key: "其他", label: "其他" },
      ],
      //合同签署
      shContracttypeOptions: [
        { key: "前置", label: "前置" },
        { key: "后置", label: "后置" },
      ],
      //性质
      tXzOptions: [
        { key: "国有企业", label: "国有企业" },
        { key: "私营企业", label: "私营企业" },
        { key: "上市企业", label: "上市企业" },
      ],
      //立户情况
      tAccountOptions: [
        { key: "是", label: "是" },
        { key: "否", label: "否" },
      ],
      //合作年限
      tCyearOptions: [
        { key: "0 年", label: "0 年" },
        { key: "1 年", label: "1 年" },
        { key: "2 年", label: "2 年" },
        { key: "3 年", label: "3 年" },
        { key: "3 年以上", label: "3 年以上" },
        { key: "5 年以 上", label: "5 年以 上" },
      ],
      //投标方式
      tTenderOptions: [
        { key: "网上平台", label: "网上平台" },
        { key: "邮件", label: "邮件" },
        { key: "现场", label: "现场" },
        { key: "其他", label: "其他" },
      ],
      //保证金缴纳时间
      tMargintimeOptions: [
        { key: "投标前", label: "投标前" },
        { key: "中标后", label: "中标后" },
        { key: "其他", label: "其他" },
      ],
      //合同签署
      tContracttypeOptions: [
        { key: "前置", label: "前置" },
        { key: "后置", label: "后置" },
      ],
      //运输方式
      tTransporttypeOptions: [
        { key: "火运", label: "火运" },
        { key: "汽运", label: "汽运" },
        { key: "火运+汽运", label: "火运+汽运" },
        { key: "船运", label: "船运" },
      ],
      //到场数质量确认时间
      tOktimeOptions: [
        { key: "到场卸货后 1 天", label: "到场卸货后 1 天" },
        { key: "到场卸货后 3 天", label: "到场卸货后 3 天" },
        { key: "到场卸货后 5 天", label: "到场卸货后 5 天" },
        { key: "到场卸货后 7 天", label: "到场卸货后 7 天" },
        { key: "其他", label: "其他" },
      ],
      //到场数质量确认方式
      tOktypeOptions: [
        { key: "电厂系统截屏", label: "电厂系统截屏" },
        { key: "短信消息", label: "短信消息" },
        { key: "微信群消息", label: "微信群消息" },
        { key: "其他", label: "其他" },
      ],
      //开票结算方式
      tSettlementtypeOptions: [
        { key: "增值税一票", label: "增值税一票" },
        { key: "两票结算", label: "两票结算" },
      ],
      //结算规则
      tSettlementgzOptions: [
        { key: "按列", label: "按列" },
        { key: "全月加权", label: "全月加权" },
      ],
      //付款方式
      tPaymenttypeOptions: [
        { key: "现汇", label: "现汇" },
        { key: "承兑", label: "承兑" },
        { key: "现汇+承兑", label: "现汇+承兑" },
      ],
      //站台经营方式
      pJymodeOptions: [
        { key: "独家经营", label: "独家经营" },
        { key: "多家共享", label: "多家共享" },
      ],
      //发运方式
      pFymodeOptions: [
        { key: "独立立户", label: "独立立户" },
        { key: "第三方代发", label: "第三方代发" },
      ],
      //承运方性质
      pCxzOptions: [
        { key: "国有企业", label: "国有企业" },
        { key: "上市公司", label: "上市公司" },
        { key: "私营企业", label: "私营企业" },
      ],
      //承运方发运年限
      pCyearOptions: [
        { key: "0 年", label: "0 年" },
        { key: "1 年", label: "1 年" },
        { key: "2 年", label: "2 年" },
        { key: "3 年", label: "3 年" },
        { key: "3 年以上", label: "3 年以上" },
        { key: "5 年以上", label: "5 年以上" },
      ],
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        number: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        managerName: [
          { required: true, message: "客户经理不能为空", trigger: "blur" },
        ],
        amount: [{ required: true, validator: validatePrice, trigger: "blur" }],
        userId: [{ required: true, message: "请选择代办人", trigger: "blur" }],
        supplierId: [
          { required: true, message: "请选择供应商", trigger: "blur" },
        ],
        settlementP: [
          { required: true, message: "请选择结算比例", trigger: "blur" },
        ],
        margin: [{ required: true, validator: validatePrice, trigger: "blur" }],
        settlementWay: [
          { required: true, message: "请选择结算方式", trigger: "blur" },
        ],
        cycleStart: [
          { required: true, message: "请选择服务周期开始", trigger: "blur" },
        ],
        cycleEnd: [
          { required: true, message: "请选择服务周期结束", trigger: "blur" },
        ],
        chargemNx: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        chargemGd: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        expectPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        expectWeight: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        rateYear: [{ validator: validatePrice3, trigger: "blur" }],
        expectProfits: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        shName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
        ],
        shXz: [{ required: true, message: "请选择性质", trigger: "blur" }],
        shHzrate: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        shChannelyear: [
          { required: true, message: "请选择渠道年限", trigger: "blur" },
        ],
        shSettlement: [
          { required: true, message: "请选择结算比例", trigger: "blur" },
        ],
        shHztype: [
          { required: true, message: "请选择合作方式", trigger: "blur" },
        ],
        shMargin: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        shContracttype: [
          { required: true, message: "请选择合同签署", trigger: "blur" },
        ],
        terminalId: [
          { required: true, message: "请选择终端用户", trigger: "blur" },
        ],
        tXz: [{ required: true, message: "请选择性质", trigger: "blur" }],
        tAccount: [
          { required: true, message: "请选择立户情况", trigger: "blur" },
        ],
        tCyear: [
          { required: true, message: "请选择合作年限", trigger: "blur" },
        ],
        tTender: [
          { required: true, message: "请选择投标方式", trigger: "blur" },
        ],
        tMargin: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        tMargintime: [
          { required: true, message: "请选择保证金缴纳时间", trigger: "blur" },
        ],
        tContracttype: [
          { required: true, message: "请选择合同签署", trigger: "blur" },
        ],
        tContracttime: [],
        tTransporttype: [
          { required: true, message: "请选择运输方式", trigger: "blur" },
        ],
        tTransportstart: [
          { required: true, message: "发站不能为空", trigger: "blur" },
        ],
        tTransportend: [
          { required: true, message: "到站不能为空", trigger: "blur" },
        ],
        tOktime: [
          {
            required: true,
            message: "请选择到场数质确认时间",
            trigger: "blur",
          },
        ],
        tOktype: [
          {
            required: true,
            message: "请选择到场数质确认方式",
            trigger: "blur",
          },
        ],
        tSettlementtype: [
          { required: true, message: "请选择开票结算方式", trigger: "blur" },
        ],
        tSettlementgz: [
          { required: true, message: "请选择结算规则", trigger: "blur" },
        ],
        tPaymentdays: [
          { required: true, message: "回款账期不能为空", trigger: "blur" },
        ],
        tPaymenttype: [
          { required: true, message: "请选择付款方式", trigger: "blur" },
        ],
        pName: [
          { required: true, message: "站台名字不能为空", trigger: "blur" },
        ],
        pJymode: [
          { required: true, message: "请选择站台经营方式", trigger: "blur" },
        ],
        pSize: [
          { required: true, message: "站台规模不能为空", trigger: "blur" },
        ],
        pFymode: [
          { required: true, message: "请选择站台发运方式", trigger: "blur" },
        ],
        pCname: [
          // { required: true, message: "承运方发运名称不能为空", trigger: "blur" }
        ],
        pCxz: [
          // { required: true, message: "请选择承运方性质", trigger: "blur" }
        ],
        pCyear: [
          // { required: true, message: "请选择承运方发运年限", trigger: "blur" }
        ],
        pCnumber: [{ validator: validatePrice3, trigger: "blur" }],
      },
      printReviewVisible: false,
      printData: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.statusOptions = response.data;
    });
    getUserList().then((response) => {
      this.userOptions = response.rows;
    });
    getSupplierList().then((response) => {
      this.supplierOptions = response.rows;
    });
    getTerminalList().then((response) => {
      this.terminalOptions = response.rows;
    });
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let stId = this.$route.params.stId;
      let row = { stId: stId };
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
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listSt(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.stList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      getStList().then((response) => {
        this.stOptions = response.rows;
      });
      getUserList().then((response) => {
        this.userOptions = response.rows;
      });
      getSupplierList().then((response) => {
        this.supplierOptions = response.rows;
      });
      getTerminalList().then((response) => {
        this.terminalOptions = response.rows;
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
        stId: null,
        name: null,
        number: null,
        amount: null,
        userId: null,
        userId2: null,
        userName: null,
        managerName: null,
        supplierId: null,
        supplierId2: null,
        supplierName: null,
        settlementP: null,
        settlementPA1: null,
        settlementPA2: null,
        settlementPA3: null,
        marginType: null,
        margin: null,
        settlementWay: null,
        cycleStart: null,
        cycleEnd: null,
        chargemType: null,
        chargemNx: null,
        chargemGd: null,
        expectPrice: null,
        expectWeight: null,
        rateYear: null,
        expectProfits: null,
        shType: null,
        shName: null,
        shXz: null,
        shHztype: null,
        shHzrate: null,
        shChanneltype: null,
        shChannelyear: null,
        shSettlement: null,
        shSettlementA1: null,
        shSettlementA2: null,
        shSettlementA3: null,
        shMargin: null,
        shMargintype: null,
        shContracttype: null,
        terminalId: null,
        terminalId2: null,
        tName: null,
        tXz: null,
        tAccount: null,
        tCyear: null,
        tTendertype: null,
        tTender: null,
        tMargintype: null,
        tMargin: null,
        tMargintime: null,
        tbz: null,
        tContracttype: null,
        tContracttime: null,
        tTransporttype: null,
        tTransportstart: null,
        tTransportend: null,
        tOktime: null,
        tOktype: null,
        tSettlementtype: null,
        tSettlementgz: null,
        tPaymentdays: null,
        tPaymenttype: null,
        platformType: null,
        pName: null,
        pJymode: null,
        pSize: null,
        pFymode: null,
        pCname: null,
        pCxz: null,
        pCyear: null,
        pCnumber: null,
        node: null,
        file1: null,
        file2: null,
        file3: null,
        file4: null,
        file5: null,
        xmState: null,
        xmNode: null,
        state: null,
        createBy: null,
        createTime: null,
        fileList: [],
        productNo: null,
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
      this.ids = selection.map((item) => item.stId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.active = 0;
      this.form.marginType = "1";
      this.form.chargemType = "1";
      this.form.shType = "1";
      this.form.shChanneltype = "1";
      this.form.shMargintype = "1";
      this.form.tTendertype = "1";
      this.form.tMargintype = "1";
      this.form.tContracttype = "前置";
      this.form.platformType = "1";
      this.form.pFymode = "第三方代发";
      this.fileList = [];
      this.isLook = 1;
      this.open = true;
      this.title = "添加项目信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileList = [];
      this.active = 0;
      const stId = row.stId || this.ids;
      getSt(stId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;

        this.form.userId2 = response.data.userId;
        this.form.userId = response.data.userName;

        this.form.terminalId2 = response.data.terminalId;
        this.form.terminalId = response.data.tName;

        this.form.supplierId2 = response.data.supplierId;
        this.form.supplierId = response.data.supplierName;

        this.isLook = 1;
        this.open = true;
        this.title = "修改项目信息";
      });
    },

    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.fileList = [];
      this.active = 0;
      const stId = row.stId || this.ids;
      this.$router.push("/st/lookAdd/" + stId);
    },

    /** 其他按钮操作 */
    handleUpdataState(row, xms) {
      this.reset();
      this.fileList = [];
      this.active = 0;
      const stId = row.stId || this.ids;
      getSt(stId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.form.xmNode = "";
        this.form.xmState = xms;
        this.isLook = 4;
        this.open = true;
        this.title = "异常/结束/完成";
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.stId != null) {
            this.form.terminalId = this.form.terminalId2;
            this.form.userId = this.form.userId2;
            this.form.supplierId = this.form.supplierId2;
            updateSt(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.terminalId = this.form.terminalId2;
            this.form.userId = this.form.userId2;
            this.form.supplierId = this.form.supplierId2;
            addSt(this.form).then((response) => {
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
      const stIds = row.stId || this.ids;
      this.$confirm("是否确认删除项目信息?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSt(stIds);
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
        "project/st/export",
        {
          ...this.queryParams,
        },
        `project_st.xlsx`
      );
    },
    next() {
      let valida_all = true;
      let arr = [];
      if (this.active == "0") {
        arr = this.arr0;
      } else if (this.active == "1") {
        arr = this.arr1;
      } else if (this.active == "2") {
        arr = this.arr2;
      } else if (this.active == "3") {
        arr = this.arr3;
      } else if (this.active == "4") {
        return;
      }
      this.$refs["form"].validateField(arr, (valid) => {
        if (valid) {
          valida_all = valida_all && false;
        } else {
          valida_all = valida_all && true;
        }
      });
      if (valida_all) {
        if (this.active++ > 4) this.active = 4;
      }
    },
    on() {
      if (this.active-- < 0) this.active = 0;
    },
    changeTerinal(obj) {
      this.form.terminalId2 = obj.terminalId;
      this.form.tName = obj.name;
      this.form.tSettlementtype = obj.settlementType;
      this.form.tSettlementgz = obj.settlementGz;
      this.form.tPaymentdays = obj.paymentdays;
      this.form.tPaymenttype = obj.paymentType;
    },
    changeUser(obj) {
      this.form.userId2 = obj.userId;
      this.form.userName = obj.nickName;
    },
    changeSupplier(obj) {
      this.form.supplierId2 = obj.supplierId;
      this.form.supplierName = obj.name;
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
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = { name: name, url: url };
            this.form.fileList.push(art);
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
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },
    jsprice() {
      let arr = [
        "cycleStart",
        "cycleEnd",
        "expectPrice",
        "chargemNx",
        "chargemGd",
        "expectWeight",
      ];
      let valida_all = true;
      this.$refs["form"].validateField(arr, (valid) => {
        if (valid) {
          valida_all = valida_all && false;
        } else {
          valida_all = valida_all && true;
        }
      });
      if (valida_all) {
        let dateSpan, iDays;
        let sDate1 = Date.parse(this.form.cycleStart);
        let sDate2 = Date.parse(this.form.cycleEnd);
        dateSpan = sDate2 - sDate1;
        if (dateSpan < 0) {
          this.$message.error("服务周期结束时间不能小于开始时间");
          return;
        }
        dateSpan = Math.abs(dateSpan);
        //周期天数
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        //预计单价
        let a1 = this.form.expectPrice;
        //年服务费率
        let a2 = 0.0;
        if (this.form.chargemType == "1" || this.form.chargemType == "3") {
          a2 = parseFloat(this.form.chargemNx) / 100;
        }
        //固定差价
        let a3 = 0.0;
        if (this.form.chargemType == "2" || this.form.chargemType == "3") {
          a3 = parseFloat(this.form.chargemGd);
        }
        //预计吨数
        let a4 = this.form.expectWeight;
        //单吨收益
        let jx1 = ((a1 * 0.9 * a2) / 360) * iDays + a3;
        //资金成本
        let jx2 = ((a1 * 0.9 * 0.08) / 360) * iDays;
        // 增值税
        let jx3 = (jx1 * 0.13) / 1.13;

        let jx4 = jx3 * 0.12;
        //印花税
        let jx5 = (2 * a1 - ((a1 * 0.9 * 0.08) / 360) * iDays) * 0.0003;
        console.log(
          "jx1:" +
            jx1 +
            "-jx2:" +
            jx2 +
            "-jx3:" +
            jx3 +
            "-jx4:" +
            jx4 +
            "-jx5:" +
            jx5
        );
        console.log(jx1 - jx2 - jx3 - jx4 - jx5);
        let zzjx = (jx1 - jx2 - jx3 - jx4 - jx5) * a4;
        this.form.expectProfits = zzjx.toFixed(2);
      }
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.state);
    },
    printSomething() {
      // 此处的style即为打印时的样式
      const style =
        "@page {  } " +
        "@media print {table{text-align:center;border-collapse:collapse;border-spacing:0;border-collapse:separate;} table td{word-break: break-all;word-wrap:break-word;border:1px solid #B8B8B8} .title{background:red}}";
      print({
        printable: "print_area",
        type: "html",
        style: style, // 亦可使用引入的外部css;
        css: "./print.css",
        scanStyles: false,
      });
    },
    // 打印
    async resolveImg() {
      let imgBase64 = await this.getImage("print_area");
      this.printReviewVisible = false;
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
      await getSt(row.stId).then((response) => {
        this.printData = response.data;
        this.printData.type = "项目新增";
        this.printData.fileList = response.data.fileList;
      });
      await getProcessDataByStId("1", row.stId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("1", row.stId).then((res) => {
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
<style lang="scss" scoped></style>
