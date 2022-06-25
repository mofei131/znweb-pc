<style>
.ic .el-input__inner {
  color: red;
}
</style>
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="项目" prop="stId">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:apayment:add']">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:apayment:edit']"-->
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
      <!--          v-hasPermi="['project:apayment:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:apayment:export']"-->
      <!--          >导出</el-button-->
      <!--        >-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="apaymentList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="付款批次" align="center" prop="away" />
      <el-table-column label="货品名称" align="center" prop="name" />
      <el-table-column label="入库总量(吨)" align="center" prop="grns">
        <template slot-scope="scope">
          {{
          Number(scope.row.grns)
          .toFixed(3)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="出库总量(吨)" align="center" prop="grys">
        <template slot-scope="scope">
          {{
          Number(scope.row.grys)
          .toFixed(3)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="预付总额(元)" align="center" prop="totalPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.totalPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="预付单价(元)" align="center" prop="expectPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.expectPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="预付至" align="center" prop="ato">
      </el-table-column>
      <el-table-column label="实际付款金额(元)" align="center" prop="actualPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.actualPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="state" :formatter="stateFormat" />
      <!--      <el-table-column label="付款状态" align="center" prop="fkState"  />-->
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)">查看</el-button>
          <el-button v-if="scope.row.state == '3' && scope.row.fkState == '未付款'" size="mini" type="text"
            icon="el-icon-edit" @click="handleUpdatePayTime(scope.row)">付款</el-button>
          <el-button v-if="scope.row.state == '3'" size="mini" type="text" icon="el-icon-edit"
            @click="openPayDetailss(scope.row)">付款明细</el-button>
          <el-button v-if="scope.row.state === '3'" size="mini" type="text" icon="el-icon-printer"
            @click="handlePrint(scope.row)">打印</el-button>

          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:apayment:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改预付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <div v-if="isLook != 4">
          <el-row>
            <el-col :span="12">
              <!-- 项目 -->
              <el-form-item label="项目名称" prop="projectId">
                <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                  placeholder="请选择项目" style="width: 100%">
                  <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 业务 -->
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
              <el-form-item label="供应商" prop="supplierName">
                <span v-text="form.supplierName"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式" prop="settlementWay">
                <span v-text="form.settlementWay"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商账号" prop="account">
                <el-input v-model="form.account" placeholder="请输入供应商账号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商开户行" prop="openbank">
                <el-input v-model="form.openbank" placeholder="请输入供应商开户行" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预付批次" prop="away">
                <el-select v-model="form.away" @change="changeAway" placeholder="请选择预付批次" style="width: 100%">
                  <el-option v-for="obj in awaysOptions" :key="obj.key" :label="obj.label" :value="obj.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="form.away != '提前付款'">
              <el-col :span="12">
                <el-form-item label="预付方式" prop="type">
                  <el-select v-model="form.type" @change="jsdj" placeholder="请选择预付方式" style="width: 100%">
                    <el-option v-for="obj in typesOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <div v-if="form.type == '热值'">
              <el-col :span="12">
                <el-form-item label="热值价格" prop="rzPrice">
                  <el-input v-model="form.rzPrice" @change="jsdj" placeholder="请输入热值价格" />
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <div v-if="
              (form.type == '吨' || form.type == '热值') &&
              form.away == '首次' &&
              isLook != 3
            ">
            <!--          选择入库单-->
            <el-popover placement="bottom-start" width="100%" @selection-change="grnSelectionChange" v-model="visible"
              popper-class="area_popper">
              <el-button size="small" type="primary" slot="reference" style="margin-bottom: 30px;margin-left:50px">选择入库单
              </el-button>
              <el-table ref="singleTable1" :data="tableData" @selection-change="grnSelectionChange"
                style="width: 632px">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column property="name" label="货品名称" width="120">
                </el-table-column>
                <el-table-column property="grnNumber" label="入库重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="grnRz" label="入库热值（kcal）" width="120">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式" width="90">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司" width="120">
                </el-table-column>
                <el-table-column property="carNumber" label="车数" width="90">
                </el-table-column>
                <el-table-column property="batch" label="批次" width="90">
                </el-table-column>
                <el-table-column property="deliveryTime" label="发货日期" width="120">
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button type="primary" style="float: right" @click="toggleSelection()">确认选择</el-button>
              </div>
            </el-popover>
          </div>
          <div v-if="
              (form.type == '吨' || form.type == '热值') &&
              form.away == '二次' &&
              isLook != 3
            ">
            <!--          选择出库单-->
            <el-popover placement="bottom-start" width="100%" @selection-change="grnSelectionChange" v-model="visible"
              popper-class="area_popper">
              <el-button size="small" type="primary" slot="reference" style="margin-bottom: 30px;margin-left:50px">选择出库单
              </el-button>
              <el-table ref="singleTable2" :data="tablegryData" @selection-change="grnSelectionChange"
                style="width: 632px">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column property="name" label="货品名称" width="120">
                </el-table-column>
                <el-table-column property="grnNumber" label="出库重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="gryRz" label="出库热值（kcal）" width="120">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式" width="90">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司" width="120">
                </el-table-column>
                <el-table-column property="carNumber" label="车数" width="90">
                </el-table-column>
                <el-table-column property="batch" label="批次" width="90">
                </el-table-column>
                <el-table-column property="okTime" label="到货日期" width="120">
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button type="primary" style="float: right" @click="toggleSelection()">确认选择</el-button>
              </div>
            </el-popover>
          </div>
          <div v-if="form.away != '提前付款'">
            <div style="margin-bottom: 30px">
              <el-table ref="singleTable" :data="tableselData" style="width: 100%">
                <el-table-column property="name" label="货品名称" width="90">
                </el-table-column>
                <el-table-column v-if="form.away == '首次'" property="grnNumber" label="入库重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column v-if="form.away == '二次'" property="grnNumber" label="出库重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column v-if="form.away == '首次'" property="grnRz" label="入库热值（kcal）" width="120">
                </el-table-column>
                <el-table-column v-if="form.away == '二次'" property="gryRz" label="出库热值（kcal）" width="120">
                </el-table-column>
                <el-table-column property="transportType" label="运输方式" width="90">
                </el-table-column>
                <el-table-column property="wlCompany" label="物流公司" width="120">
                </el-table-column>
                <el-table-column property="carNumber" label="车数" width="90">
                </el-table-column>
                <el-table-column property="batch" label="批次" width="90">
                </el-table-column>
                <el-table-column v-if="form.away == '首次'" property="deliveryTime" label="发货日期" width="120">
                </el-table-column>
                <el-table-column v-if="form.away == '二次' && isLook != 3" property="okTime" label="到货日期" width="120">
                </el-table-column>
                <el-table-column v-if="form.away == '二次' && isLook == 3" property="deliveryTime" label="到货日期"
                  width="120">
                </el-table-column>
                <el-table-column property="valuePrice" label="货值单价（元）" width="90">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.valuePrice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="valueTprice" label="货值总额（元）" width="90">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.valueTprice)
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column v-if="isLook != 3" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="
                        deleteRow(scope.$index, tableselData, scope)
                      " type="text" size="small">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!--          合计-->
            <el-row style="margin-bottom:10px">
              <el-col :span="6">
                <span style="font-weight:600">合计重量{{"\xa0\xa0"}}</span>
                <span style="color: red">{{
                  $options.filters.weightFilter(form.totalWeight)
                  }}</span>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:10px">
              <el-col :span="6">
                <span style="font-weight:600">平均热值{{"\xa0\xa0"}}</span>
                <span style="color: red">{{ form.averageRz }}</span>
              </el-col>
            </el-row>
            <!--          奖惩-->
            <el-row style="margin-bottom:20px">
              <el-col :span="24">
                <span style="font-weight:600">奖惩(元){{"\xa0\xa0"}}</span>
                <span>水分：<span style="color: red" v-text="form.jc1">0.00</span></span>
                <span style="margin-left: 20px">内水：<span style="color: red" v-text="form.jc2">0.00</span></span>
                <span style="margin-left: 20px">灰份Aad：<span style="color: red" v-text="form.jc3">0.00</span></span>
                <span style="margin-left: 20px">灰份ad：<span style="color: red" v-text="form.jc10">0.00</span></span>
                <span style="margin-left: 20px">挥发份Vda：<span style="color: red" v-text="form.jc4">0.00</span></span>
                <span style="margin-left: 20px">挥发份Vdaf：<span style="color: red" v-text="form.jc11">0.00</span></span>
              </el-col>
              <el-col :span="24" style="margin-top:10px;margin-left:60px">
                <span>灰熔点：<span style="color: red" v-text="form.jc5">0.00</span></span>
                <span style="margin-left: 20px">固定碳：<span style="color: red" v-text="form.jc6">0.00</span></span>
                <span style="margin-left: 20px">含硫量：<span style="color: red" v-text="form.jc7">0.00</span></span>
                <span style="margin-left: 20px">热值Qgr,ad：<span style="color: red" v-text="form.jc8">0.00</span></span>
                <span style="margin-left: 20px">热值Qnt,ar：<span style="color: red" v-text="form.jc9">0.00</span></span>
                <span style="margin-left: 20px">热值Kcal：<span style="color: red" v-text="form.jc12">0.00</span></span>
                <el-button size="small" style="margin-left: 10px" type="primary" @click="jsjc" v-if="isLook != 3">奖惩计算
                </el-button>
              </el-col>
            </el-row>

            <el-row style="margin-top:33px">
              <el-col :span="12">
                <el-form-item label="预付总额" prop="totalPrice">
                  <el-input @change="atochange" v-model="form.totalPrice" placeholder="请输入预付总额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="固定差价" prop="dPrice">
                  <el-input v-model="form.dPrice" placeholder="请输入固定差价" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="税款" prop="tax">
                  <el-input v-model="form.tax" placeholder="请输入税款" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预付至" prop="ato">
                  <el-select v-model="form.ato" @change="atochange" placeholder="请选择预付批次" style="width: 100%">
                    <el-option v-for="obj in atosOptions" :key="obj.key" :label="obj.label" :value="obj.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--            <el-col :span="12">-->
              <!--              <el-form-item label="付款日期" prop="payTime">-->
              <!--                <el-date-picker clearable size="small" style="width: 100%;"-->
              <!--                                v-model="form.payTime"-->
              <!--                                type="date"-->
              <!--                                value-format="yyyy-MM-dd"-->
              <!--                                placeholder="选择付款日期">-->
              <!--                </el-date-picker>-->
              <!--              </el-form-item>-->
              <!--            </el-col>-->
              <el-col :span="12">
                <el-form-item label="预付单价" prop="expectPrice">
                  <el-input @change="jsdj" v-model="form.expectPrice" placeholder="请输入预计单价" />
                </el-form-item>
              </el-col>
              <!--          <el-row>-->
              <!--            <el-col :span="12">-->
              <!--              <el-form-item label="保底服务费期限(天)" prop="mfsp">-->
              <!--                <el-input v-model="form.mfsp" placeholder="请输入保底服务费期限" />-->
              <!--              </el-form-item>-->
              <!--            </el-col>-->
              <!--            <el-col :span="12">-->
              <!--              <el-form-item label="成本年服务费率(%)" prop="rateYear">-->
              <!--                <el-input  v-model="form.rateYear" placeholder="请输入成本年服务费率" />-->
              <!--              </el-form-item>-->
              <!--            </el-col>-->
              <!--          </el-row>-->
              <el-col :span="12">
                <el-form-item label="扣款金额" prop="kkPrice">
                  <el-input @change="atochange" v-model="form.kkPrice" placeholder="请输入扣款金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="扣款备注" prop="kkNode">
                  <el-input v-model="form.kkNode" placeholder="请输入扣款备注" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付款总额" prop="payTprice">
                  <el-input v-model="form.payTprice" placeholder="请输入付款总额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运费金额" prop="yfPrice">
                  <el-input @change="atochange" v-model="form.yfPrice" placeholder="请输入运费金额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="垫付保证金" prop="dfPrice">
                  <el-input @change="atochange" v-model="form.dfPrice" placeholder="请输入垫付保证金" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="ic">
              <el-col :span="12">
                <el-form-item label="提单金额" prop="prepaidPrice">
                  <el-input disabled v-model="form.prepaidPrice" placeholder="请输入提单金额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际付款金额" prop="actualPrice">
                  <el-input v-model="form.actualPrice" placeholder="请输入实际付款金额" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.away == '提前付款'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="预付总额(元)" prop="totalPrice">
                  <el-input @change="jspay1" v-model="form.totalPrice" placeholder="请输入预计总额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运费金额" prop="yfPrice">
                  <el-input @change="jspay1" v-model="form.yfPrice" placeholder="请输入运费金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="垫付保证金" prop="dfPrice">
                  <el-input @change="jspay1" v-model="form.dfPrice" placeholder="请输入垫付保证金" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际付款金额" prop="actualPrice">
                  <el-input v-model="form.actualPrice" placeholder="请输入实际付款金额" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="附件" prop="file">
                <el-upload class="upload-demo" :action="url" :headers="headers" :on-preview="handlePreview"
                  :on-remove="handleRemove" :on-success="uploadSuccess" :on-error="uploadError"
                  :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed" :file-list="fileList">
                  <el-button size="small" type="primary" v-if="isLook != 3">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-if="isLook == '4'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="应付金额：">
                <span v-text="$options.filters.moneyFilter(form.actualPrice)"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已付金额：">
                <span v-text="$options.filters.moneyFilter(form.ypayPrice)"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="剩余应付：">
                <span v-text="
                    $options.filters.moneyFilter(
                      form.actualPrice - form.ypayPrice
                    )
                  "></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额(元)" prop="payPrice">
                <el-input v-model="form.payPrice" placeholder="请输入付款金额" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款日期" prop="payTime">
                <el-date-picker clearable size="small" style="width: 100%" v-model="form.payTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择付款日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年息服务费率(%)" prop="rateYear">
                <el-input v-model="form.rateYear" placeholder="请输入年息服务费率" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保底服务费期限(天)" prop="mfsp">
                <el-input v-model="form.mfsp" placeholder="请输入保底服务费期限" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="isDisabled" v-if="isLook != 3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
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
              <td class="title" colspan="6">基本信息</td>
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
              <td class="table-td-title detail">结算方式</td>
              <td class="table-td-content">
                {{ printData.settlementWay }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">付款批次</td>
              <td class="table-td-content">
                {{ printData.away }}
              </td>
              <td class="table-td-title detail">预付方式</td>
              <td class="table-td-content">
                {{ printData.type }}
              </td>
              <td class="table-td-title detail">供应商</td>
              <td class="table-td-content">
                {{ printData.supplierName }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">供应商账号</td>
              <td class="table-td-content">
                {{ printData.account }}
              </td>
              <td class="table-td-title detail">供应商开户行</td>
              <td class="table-td-content" colspan="3">
                {{ printData.openbank }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%" v-if="printData.away != '提前付款'">
            <tr>
              <td class="title" colspan="10">出入库信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">货品名称</td>
              <td class="table-td-title detail">运输方式</td>
              <td class="table-td-title detail">物流公司</td>
              <td class="table-td-title detail">车数</td>
              <td class="table-td-title detail">批次</td>
              <td class="table-td-title detail">货值单价(元)</td>
              <td class="table-td-title detail">货值总额(元)</td>
              <td class="table-td-title detail" v-if="printData.away == '首次'">
                入库重量(吨)
              </td>
              <td class="table-td-title detail" v-if="printData.away == '首次'">
                入库热值(kcal)
              </td>
              <td class="table-td-title detail" v-if="printData.away == '首次'">
                发货日期
              </td>
              <td class="table-td-title detail" v-if="printData.away == '二次'">
                出库重量(吨)
              </td>
              <td class="table-td-title detail" v-if="printData.away == '二次'">
                出库热值(kcal)
              </td>
              <td class="table-td-title detail" v-if="printData.away == '二次'">
                到货日期
              </td>
            </tr>
            <tr v-for="(item, idx) in printData.dataList" :key="idx">
              <td class="table-td-content" style="text-align: center">
                {{ item.name }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.transportType }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.wlCompany }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.carNumber }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.batch }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.moneyFilter(item.valuePrice) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.moneyFilter(item.valueTprice) }}
              </td>
              <td class="table-td-content" style="text-align: center" v-if="printData.away == '首次'">
                {{ $options.filters.weightFilter(item.grnNumber) }}
              </td>
              <td class="table-td-content" style="text-align: center" v-if="printData.away == '首次'">
                {{ item.grnRz }}
              </td>
              <td class="table-td-content" style="text-align: center" v-if="printData.away == '首次'">
                {{ item.deliveryTime }}
              </td>

              <td class="table-td-content" style="text-align: center" v-if="printData.away == '二次'">
                {{ $options.filters.weightFilter(item.grnNumber) }}
              </td>
              <td class="table-td-content" style="text-align: center" v-if="printData.away == '二次'">
                {{ item.gryRz }}
              </td>
              <td class="table-td-content" style="text-align: center" v-if="printData.away == '二次'">
                {{ item.deliveryTime }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%" v-if="printData.away != '提前付款'">
            <tr>
              <td class="table-td-title detail">合计重量</td>
              <td class="table-td-title detail">平均热值</td>
            </tr>
            <tr>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.weightFilter(printData.totalWeight) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.averageRz }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">奖惩</td>
            </tr>
            <tr>
              <td class="table-td-title detail">水分</td>
              <td class="table-td-title detail">内水</td>
              <td class="table-td-title detail">灰份Aad</td>
              <td class="table-td-title detail">灰份ad</td>
              <td class="table-td-title detail">挥发份Vda</td>
              <td class="table-td-title detail">挥发份Vdaf</td>
            </tr>
            <tr>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc1 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc2 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc3 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc10 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc4 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc11 }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">灰熔点</td>
              <td class="table-td-title detail">固定碳</td>
              <td class="table-td-title detail">含硫量</td>
              <td class="table-td-title detail">热值Qgr,ad</td>
              <td class="table-td-title detail">热值Qnt,ar</td>
              <td class="table-td-title detail">热值Kcal</td>
            </tr>
            <tr>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc5 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc6 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc7 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc8 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc9 }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.jc12 }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">付款信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">预付总额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.totalPrice) }}
              </td>
              <td class="table-td-title detail">固定差价</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.dPrice) }}
              </td>
              <td class="table-td-title detail">预付至</td>
              <td class="table-td-content">
                {{ printData.ato }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">税款(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.tax) }}
              </td>
              <td class="table-td-title detail">预付单价(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.expectPrice) }}
              </td>
              <td class="table-td-title detail">扣款金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.kkPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">扣款备注</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.kkNode) }}
              </td>
              <td class="table-td-title detail">运费金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yfPrice) }}
              </td>
              <td class="table-td-title detail">付款总额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.payTprice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">已付金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.prepaidPrice) }}
              </td>
              <td class="table-td-title detail">垫付保证金</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.dfPrice) }}
              </td>
              <td class="table-td-title detail">实际付款金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.actualPrice) }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="3">合同信息</td>
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
                {{ $options.filters.weightFilter(item.expectNumber) }}
              </td>
            </tr>
            <tr v-if="!printData.contract || printData.contract.length == 0">
              <td class="table-td-content" style="text-align: center"></td>
              <td class="table-td-content" style="text-align: center"></td>
              <td class="table-td-content" style="text-align: center"></td>
            </tr>
            <tr>
              <td class="table-td-title detail">附件</td>
              <td class="table-td-content" colspan="2">
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
                {{
                item.status == 0
                ? "驳回"
                : item.status == 1
                ? "通过"
                : item.status == 5
                ? "撤回"
                : ""
                }}
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
  listApayment,
  getApayment,
  delApayment,
  addApayment,
  updateApayment,
  getStList,
  getGrnList,
  getGryList,
  getContract,
  getApaymentbydata,
  findInit,
  listForBus,
  listForPro,
} from "@/api/project/apayment";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList, getApprovalType } from "@/api/approve";
import { getContractList } from "@/api/project/all";

export default {
  name: "Apayment",
  data() {
    // 两位小数点验证
    const validatePrice = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (value != 0 && (value == null || value == "")) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
      } else {
        callback();
      }
    };
    // 无两位小数点
    const validatePrice2 = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
      } else {
        callback();
      }
    };
    // 可空两位小数点
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
    // 可空无两位小数点
    const validatePrice4 = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/;
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
    //全局变量
    return {
      isLook: 1,
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //选择框状态
      visible: false,
      //入库单集合
      tableData: [],
      //入库单集合
      tablegryData: [],
      //选中入库单集合
      tableselData: [],
      //预选中入库单集合
      tableybData: [],
      //煤炭质量
      tabledatas: [{ show: true }],
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
      // 预付款表格数据
      apaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审批状态字典
      stateOptions: [],
      //项目集合
      projectOptions: [],
      //预付方式
      awaysOptions: [
        { key: "首次", label: "首次" },
        { key: "二次", label: "二次" },
        { key: "提前付款", label: "提前付款" },
      ],
      //预付批次
      typesOptions: [
        { key: "吨", label: "吨" },
        { key: "热值", label: "热值" },
      ],
      atosOptions: [
        { key: "50%", label: "50%" },
        { key: "55%", label: "55%" },
        { key: "60%", label: "60%" },
        { key: "65%", label: "65%" },
        { key: "70%", label: "70%" },
        { key: "75%", label: "75%" },
        { key: "80%", label: "80%" },
        { key: "85%", label: "85%" },
        { key: "90%", label: "90%" },
      ],
      multipleSelection: [],
      //提前付款
      tqpay: 0,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择预付方式", trigger: "blur" }],
        away: [{ required: true, message: "请选择预付批次", trigger: "blur" }],
        rzPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        totalPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        dPrice: [{ required: true, validator: validatePrice, trigger: "blur" }],
        tax: [{ required: true, validator: validatePrice, trigger: "blur" }],
        ato: [{ required: true, message: "请选择预付至", trigger: "blur" }],
        payTime: [
          { required: true, message: "请选择付款时间", trigger: "blur" },
        ],
        expectPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        mfsp: [{ validator: validatePrice4, trigger: "blur" }],
        rateYear: [{ validator: validatePrice3, trigger: "blur" }],
        prepaidPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        actualPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        yfPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        kkPrice: [{ validator: validatePrice3, trigger: "blur" }],
        payPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
      },
      // 打印
      printReviewVisible: false,
      printData: {},
      isDisabled: false,
      listForBusArr: [],
      listForProArr: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
      this.stateOptions.push({
        dictValue: "5",
        dictLabel: "已撤回",
      });
    });

    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let apaymentId = this.$route.params.apaymentId;
      let row = { apyamentId: apaymentId };
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
    /** 查询预付款列表 */
    getList() {
      this.loading = true;
      listApayment(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.apaymentList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      // 业务
      listForBus().then((response) => {
        this.listForBusArr = response.data
      })
      // 项目
      listForPro().then((response) => {
        this.listForProArr = response.data
      })
    },
    // 审批状态字典翻译
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
        apyamentId: null,
        stId: null,
        stName: null,
        type: null,
        away: null,
        grns: null,
        totalWeight: null,
        averageRz: null,
        jc1: 0,
        jc2: 0,
        jc3: 0,
        jc4: 0,
        jc5: 0,
        jc6: 0,
        jc7: 0,
        jc8: 0,
        jc9: 0,
        jc10: 0,
        jc11: 0,
        jc12: 0,
        rewardp: null,
        totalPrice: null,
        payTprice: null,
        dPrice: null,
        ato: null,
        tax: null,
        expectPrice: null,
        payTime: null,
        rateYear: null,
        mfsp: null,
        prepaidPrice: null,
        actualPrice: null,
        rzPrice: null,
        grys: null,
        state: null,
        fkState: null,
        createBy: null,
        createTime: null,
        grnList: [],
        gryList: [],
        fileList: [],
        yfPrice: null,
        kkPrice: null,
        kkNode: null,
        ypayPrice: null,
        dfPrice: null,
        supplierId: null,
        supplierName: null,
        account: null,
        openbank: null,
        projectId: null,
        projectIdOld: null
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
      this.ids = selection.map((item) => item.apyamentId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType((approvalType) => {
        if(approvalType.code == 500) {
          return this.$message.error('没有提交权限，请联系管理员')
        }else {
          this.reset();
      this.form.type = "吨";
      this.form.away = "首次";
      this.form.totalWeight = 0;
      this.form.averageRz = 0;
      this.fileList = [];
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];

      this.isLook = 1;
      this.open = true;
      this.title = "添加预付款";
        }
      })
      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];
      this.fileList = [];
      const apyamentId = row.apyamentId || this.ids;
      getApayment(apyamentId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.tableselData = response.data.selnyList;
        this.fileList = this.form.fileList;

        getGrnList({ stId: this.form.stId2, yfState: "1" }).then((response) => {
          this.tableData = response.rows;
        });
        getGryList({ stId: this.form.stId2, yfState: "1" }).then((response) => {
          this.tablegryData = response.rows;
        });

        this.isLook = 1;
        this.open = true;
        this.title = "修改预付款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];
      this.fileList = [];
      const apyamentId = row.apyamentId || this.ids;
      this.$router.push("/apayment/look/" + apyamentId);
    },

    /** 修改按钮操作 */
    handleUpdatePayTime(row) {
      this.reset();
      const apyamentId = row.apyamentId || this.ids;
      getApayment(apyamentId).then((response) => {
        this.form = response.data;
        this.isLook = 4;
        this.open = true;
        this.title = "修改预付款";
      });
    },

    /** 查看付款明细 */
    openPayDetailss(row) {
      this.$router.push({
        name: "paydetailsList",
        query: { type: "apayment", pid: row.apyamentId },
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isLook != 4) {
            if (
              (this.form.type == "吨" && this.form.away == "首次") ||
              (this.form.type == "热值" && this.form.away == "首次")
            ) {
              if (this.tableselData.length < 1) {
                this.msgError("请选择入库单");
                return;
              }
              this.form.grnList = this.tableselData;
            } else if (
              (this.form.type == "吨" && this.form.away == "二次") ||
              (this.form.type == "热值" && this.form.away == "二次")
            ) {
              if (this.tableselData.length < 1) {
                this.msgError("请选择出库单");
                return;
              }
              this.form.gryList = this.tableselData;
            }
            this.form.stId = this.form.stId2;
            this.form.projectId = this.form.projectIdOld
          } else {
            this.form.type = null;
          }
          if (this.form.apyamentId != null) {
            updateApayment(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addApayment(this.form).then((response) => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const apyamentIds = row.apyamentId || this.ids;
      this.$confirm("是否确认删除预付款?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delApayment(apyamentIds);
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
        "project/apayment/export",
        {
          ...this.queryParams,
        },
        `project_apayment.xlsx`
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
        `当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
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
    changeProject(pro) {
      this.form.projectIdOld = pro.projectId;
      this.form.projectNo = pro.projectNo
    },
    changeSt(obj) {
      this.form.jc1 = 0;
      this.form.jc2 = 0;
      this.form.jc3 = 0;
      this.form.jc4 = 0;
      this.form.jc5 = 0;
      this.form.jc6 = 0;
      this.form.jc7 = 0;
      this.form.jc8 = 0;
      this.form.jc9 = 0;
      this.form.jc10 = 0;
      this.form.jc11 = 0;
      this.form.jc12 = 0;
      this.form.rewardp = 0;
      this.form.stId2 = obj.stId;
      this.form.stName = obj.stName;
      this.tableybData = [];
      this.form.supplierId = null;
      this.form.supplierName = null;
      this.form.account = null;
      this.form.openbank = null;
      this.form.serialNo = obj.serialNo;
      this.$set(this.form, "number", obj.number);
      this.$set(this.form, "settlementWay", obj.settlementWay);

      let dataInit = { stId: obj.stId };
      findInit(dataInit).then((response) => {
        this.form.yfPrice = response.data.yfPrice;
        this.form.dfPrice = response.data.dfPrice;
        this.form.supplierId = response.data.supplierId;
        this.form.supplierName = response.data.supplierName;
        this.form.account = response.data.account;
        this.form.openbank = response.data.openbank;
      });

      if (this.form.type == "提前付款") {
        //成本年服务费率
        if (obj.chargemType == "1" || obj.chargemType == "3") {
          this.form.rateYear = obj.chargemNx;
        } else {
          this.form.rateYear = 0;
        }

        //查询委托销售合同
        let c1 = { stId: obj.stId, type: "1" };
        getContract(c1).then((response) => {
          if (response.data != null) {
            //保底服务费期限
            this.form.mfsp = response.data.mfsp;
          } else {
            this.form.mfsp = 0;
          }
        });
        this.jspay1();
      } else {
        //获取提前付款+首付款
        if (this.form.away == "首次") {
          let data2 = { stId: obj.stId, away: "二次", state: "3" };
          getApaymentbydata(data2).then((response) => {
            if (response.rows.length > 0) {
              this.form.prepaidPrice = 0.0;
              this.tqpay = 0;
            } else {
              this.form.prepaidPrice = obj.tqpay.toFixed(2);
              this.tqpay = obj.tqpay;
            }
          });
        } else {
          let data = { stId: obj.stId, away: "首次", ist: "1", state: "3" };
          getApaymentbydata(data).then((response) => {
            console.log(response);
            let ap = 0;
            for (let i = 0; i < response.rows.length; i++) {
              ap += response.rows[i].payTprice;
            }
            let data2 = { stId: obj.stId, away: "二次" };
            getApaymentbydata(data2).then((response) => {
              if (response.rows.length > 0) {
                this.form.prepaidPrice = ap.toFixed(2);
                this.tqpay = 0.0;
              } else {
                this.form.prepaidPrice = (
                  parseFloat(obj.tqpay) + parseFloat(ap)
                ).toFixed(2);
                this.tqpay = obj.tqpay;
              }
            });
          });
        }
        this.tableselData = [];

        let data = { stId: obj.stId, yfState: "1" };
        getGrnList(data).then((response) => {
          this.tableData = response.rows;
        });
        getGryList(data).then((response) => {
          this.tablegryData = response.rows;
        });
        //固定差价
        if (obj.chargemType == "2" || obj.chargemType == "3") {
          this.form.dPrice = obj.chargemGd;
        } else {
          this.form.dPrice = 0;
        }
        //年服务费率
        if (obj.chargemType == "1" || obj.chargemType == "3") {
          this.form.rateYear = obj.chargemNx;
        } else {
          this.form.rateYear = 0;
        }

        //查询委托销售合同
        let c1 = { stId: obj.stId, type: "1" };
        getContract(c1).then((response) => {
          if (response.data != null) {
            //保底服务费期限
            this.form.mfsp = response.data.mfsp;
          } else {
            this.form.mfsp = 0;
          }
        });
        this.jsdj();
        this.atochange();
      }
    },
    //选择批次
    changeAway() {
      if (this.form.type == "提前付款") {
        if (this.form.stId2 == null || this.form.stId2 == "") {
          this.msgError("请选择项目");
          this.form.prepaidPrice = 0.0;
          return;
        }
        this.jspay1();
      } else {
        this.form.jc1 = 0;
        this.form.jc2 = 0;
        this.form.jc3 = 0;
        this.form.jc4 = 0;
        this.form.jc5 = 0;
        this.form.jc6 = 0;
        this.form.jc7 = 0;
        this.form.jc8 = 0;
        this.form.jc9 = 0;
        this.form.jc10 = 0;
        this.form.jc11 = 0;
        this.form.jc12 = 0;
        this.form.rewardp = 0;
        this.jsdj();
        this.tableybData = [];
        if (this.form.stId2 == null || this.form.stId2 == "") {
          this.msgError("请选择项目");
          this.form.prepaidPrice = 0.0;
          return;
        }
        //获取提前付款+首付款
        if (this.form.away == "首次") {
          let data2 = { stId: this.form.stId2, away: "二次" };
          getApaymentbydata(data2).then((response) => {
            if (response.rows.length > 0) {
              this.form.prepaidPrice = 0.0;
            } else {
              this.form.prepaidPrice = this.tqpay.toFixed(2);
            }
          });
        } else {
          let data = { stId: this.form.stId2, away: "首次", ist: "1" };
          getApaymentbydata(data).then((response) => {
            let ap = 0;
            for (let i = 0; i < response.rows.length; i++) {
              ap += response.rows[i].payTprice;
            }
            let data2 = { stId: this.form.stId2, away: "二次" };
            getApaymentbydata(data2).then((response) => {
              if (response.rows.length > 0) {
                this.form.prepaidPrice = ap.toFixed(2);
              } else {
                this.form.prepaidPrice = (
                  parseFloat(this.tqpay) + parseFloat(ap)
                ).toFixed(2);
              }
            });
          });
        }
        this.toggleSelection();
      }
    },

    //选中数据
    grnSelectionChange(selection) {
      this.tableybData = [];
      this.tableybData = selection;
    },
    //溢出选中数据
    deleteRow(index, rows, obj) {
      this.form.jc1 = 0;
      this.form.jc2 = 0;
      this.form.jc3 = 0;
      this.form.jc4 = 0;
      this.form.jc5 = 0;
      this.form.jc6 = 0;
      this.form.jc7 = 0;
      this.form.jc8 = 0;
      this.form.jc9 = 0;
      this.form.jc10 = 0;
      this.form.jc11 = 0;
      this.form.jc12 = 0;
      this.form.rewardp = 0;
      this.tableselData.splice(index, 1);

      if (this.form.away == "首次") {
        this.tableData.map((item) => {
          if (item.grnId === obj.row.grnId) {
            this.$refs.singleTable1.toggleRowSelection(item, false);
          }
        });
      } else if (this.form.away == "二次") {
        this.tablegryData.map((item) => {
          if (item.gryId === obj.row.gryId) {
            this.$refs.singleTable2.toggleRowSelection(item, false);
          }
        });
      }
      this.jsta();
      this.jste();
      this.atochange();
    },
    //确认选择数据
    toggleSelection() {
      this.form.jc1 = 0;
      this.form.jc2 = 0;
      this.form.jc3 = 0;
      this.form.jc4 = 0;
      this.form.jc5 = 0;
      this.form.jc6 = 0;
      this.form.jc7 = 0;
      this.form.jc8 = 0;
      this.form.jc9 = 0;
      this.form.jc10 = 0;
      this.form.jc11 = 0;
      this.form.jc12 = 0;
      this.form.rewardp = 0;
      this.tableselData = this.tableybData;
      this.visible = false;
      this.jsta();
      this.jste();
      this.atochange();
    },
    // 计算总额
    jste() {
      let tw = 0;
      let ep = 0;
      if (this.form.totalWeight != null && this.form.totalWeight != "") {
        tw = this.form.totalWeight;
      }
      if (this.form.expectPrice != null && this.form.expectPrice != "") {
        ep = this.form.expectPrice;
      }
      //预付总额 单价*重量
      this.form.totalPrice = (tw * ep).toFixed(2);
      //计算税款
      this.form.tax = (((tw * ep) / 1.13) * 0.13).toFixed(2);
    },
    //计算合计重量平均热值
    jsta() {
      let tgn = 0;
      let tgr = 0;
      if (this.tableybData.length > 0) {
        for (let i = 0; i < this.tableybData.length; i++) {
          tgn += this.tableybData[i].grnNumber;
          if (this.form.away == "首次") {
            tgr += this.tableybData[i].grnRz;
          } else if (this.form.away == "二次") {
            tgr += this.tableybData[i].gryRz;
          }
        }
        this.form.totalWeight = tgn;
        this.form.averageRz = (tgr / this.tableybData.length).toFixed(2);
      } else {
        this.form.totalWeight = tgn.toFixed(2);
        this.form.averageRz = tgr.toFixed(2);
      }
      this.jsdj();
    },
    //计算单价
    jsdj() {
      let re = 0;
      if (this.form.rewardp != null && this.form.rewardp != "") {
        re = this.form.rewardp;
      }
      if (this.form.type == "吨") {
        if (this.form.stId2 == null || this.form.stId2 == "") {
          this.msgError("请选择项目");
          return;
        }

        if (this.form.expectPrice != null && this.form.expectPrice != "") {
          this.form.expectPrice = (
            parseFloat(this.form.expectPrice) + parseFloat(re)
          ).toFixed(2);
          this.jste();
        } else {
          //查询煤炭销售合同
          let c2 = { stId: this.form.stId2, type: "2" };
          getContract(c2).then((response) => {
            if (response.data != null) {
              //预付单价 吨的预付单价
              this.form.expectPrice = (
                parseFloat(response.data.price) + parseFloat(re)
              ).toFixed(2);
            } else {
              this.form.expectPrice = 0;
            }
            this.jste();
          });
        }
      } else if (this.form.type == "热值") {
        if (
          this.form.rzPrice != null &&
          this.form.rzPrice != "" &&
          this.form.averageRz != null &&
          this.form.averageRz != ""
        ) {
          this.form.expectPrice = (
            this.form.rzPrice * this.form.averageRz +
            parseFloat(re)
          ).toFixed(2);
        } else {
          this.form.expectPrice = 0;
        }
        this.jste();
      } else {
        this.form.expectPrice = 0;
        this.jste();
      }
    },
    //计算奖惩
    jsjc() {
      let jc1 = 0;
      let jc2 = 0;
      let jc3 = 0;
      let jc4 = 0;
      let jc5 = 0;
      let jc6 = 0;
      let jc7 = 0;
      let jc8 = 0;
      let jc9 = 0;
      let jc10 = 0;
      let jc11 = 0;
      let jc12 = 0;
      let re = 0;

      let size = this.tableselData.length;
      for (let i = 0; i < this.tableselData.length; i++) {
        let obj = this.tableselData[i];
        jc1 += obj.jc1;
        jc2 += obj.jc2;
        jc3 += obj.jc3;
        jc4 += obj.jc4;
        jc5 += obj.jc5;
        jc6 += obj.jc6;
        jc7 += obj.jc7;
        jc8 += obj.jc8;
        jc9 += obj.jc9;
        jc10 += obj.jc10;
        jc11 += obj.jc11;
        jc12 += obj.jc12;
        re += obj.rewardp;
      }
      this.form.jc1 = (jc1 / size).toFixed(2);
      this.form.jc2 = (jc2 / size).toFixed(2);
      this.form.jc3 = (jc3 / size).toFixed(2);
      this.form.jc4 = (jc4 / size).toFixed(2);
      this.form.jc5 = (jc5 / size).toFixed(2);
      this.form.jc6 = (jc6 / size).toFixed(2);
      this.form.jc7 = (jc7 / size).toFixed(2);
      this.form.jc8 = (jc8 / size).toFixed(2);
      this.form.jc9 = (jc9 / size).toFixed(2);
      this.form.jc10 = (jc10 / size).toFixed(2);
      this.form.jc11 = (jc11 / size).toFixed(2);
      this.form.jc12 = (jc12 / size).toFixed(2);
      this.form.rewardp = (re / size).toFixed(2);
      this.jsdj();
      this.jspay();
    },
    // 选择预付至
    atochange() {
      //计算付款总额
      let tp = 0;
      let ato = 0;
      if (this.form.totalPrice != null && this.form.totalPrice != "") {
        tp = this.form.totalPrice;
      }
      let kk = 0;
      if (this.form.kkPrice != null && this.form.kkPrice != "") {
        kk = this.form.kkPrice;
      }

      if (this.form.ato != null && this.form.ato != "") {
        if (this.form.ato == "50%") {
          ato = 0.5;
        } else if (this.form.ato == "55%") {
          ato = 0.55;
        } else if (this.form.ato == "60%") {
          ato = 0.6;
        } else if (this.form.ato == "65%") {
          ato = 0.65;
        } else if (this.form.ato == "70%") {
          ato = 0.7;
        } else if (this.form.ato == "75%") {
          ato = 0.75;
        } else if (this.form.ato == "80%") {
          ato = 0.8;
        } else if (this.form.ato == "85%") {
          ato = 0.85;
        } else if (this.form.ato == "90%") {
          ato = 0.9;
        }
      }

      this.form.payTprice = (ato * tp - kk).toFixed(2);
      this.jspay();
    },
    //计算实际付款
    jspay() {
      let totalPrice = 0;
      if (this.form.totalPrice != null && this.form.totalPrice != "") {
        totalPrice = this.form.totalPrice;
      }
      //计算税款
      this.form.tax = ((totalPrice / 1.13) * 0.13).toFixed(2);

      let pt = 0;
      let pp = 0;
      let yp = 0;
      let df = 0;
      if (this.form.payTprice != null && this.form.payTprice != "") {
        pt = this.form.payTprice;
      }
      if (this.form.prepaidPrice != null && this.form.prepaidPrice != "") {
        pp = this.form.prepaidPrice;
      }
      if (this.form.yfPrice != null && this.form.yfPrice != "") {
        yp = this.form.yfPrice;
      }
      if (this.form.dfPrice != null && this.form.dfPrice != "") {
        df = this.form.dfPrice;
      }

      let sp = pt - pp - yp - df;
      if (sp >= 0) {
        this.form.actualPrice = sp.toFixed(2);
      } else {
        this.form.actualPrice = 0.0;
      }
    },
    jspay1() {
      let totalPrice = 0;
      if (this.form.totalPrice != null && this.form.totalPrice != "") {
        totalPrice = this.form.totalPrice;
      }
      let yp = 0;
      if (this.form.yfPrice != null && this.form.ypPrice != "") {
        yp = this.form.yfPrice;
      }
      let df = 0;
      if (this.form.dfPrice != null && this.form.dfPrice != "") {
        df = this.form.dfPrice;
      }
      let sp = totalPrice - yp - df;
      if (sp >= 0) {
        this.form.actualPrice = sp.toFixed(2);
      } else {
        this.form.actualPrice = 0.0;
      }
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
      await getApayment(row.apyamentId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.dataList = response.data.selnyList;
        this.printData.printType = "预付款";
        let data = { stId: row.stId };
        //合同
        getContractList(data).then((response) => {
          this.printData.contract = response.rows;
        });
      });
      await getProcessDataByStId("4", row.apyamentId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("4", row.apyamentId).then((res) => {
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
