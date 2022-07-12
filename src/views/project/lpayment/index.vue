<style>
.ic .el-input__inner {
  color: red;
}
</style>
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch && !isQuote" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="物流类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择物流类型" clearable size="small">
          <el-option label="汽运" value="汽运" />
          <el-option label="火运" value="火运" />
        </el-select>
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
          v-hasPermi="['project:lpayment:add']" v-show="editable">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:lpayment:edit']"-->
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
      <!--          v-hasPermi="['project:lpayment:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:lpayment:export']" v-show="editable">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="!isQuote"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lpaymentList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote" />
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote" />
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote" />
      <el-table-column label="运输类型" align="center" prop="type" />
      <el-table-column label="实付金额(元)" align="center" prop="tntPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.tntPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="回款状态" align="center" prop="outPrice" :formatter="outFormat" />
      <el-table-column label="回款金额(元)" align="center" prop="outPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.outPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)"
            v-hasPermi="['project:lpayment:edit']">查看</el-button>
          <el-button v-if="
            scope.row.state == '3' &&
            scope.row.outPrice < scope.row.tntPrice &&
            editable
          " size="mini" type="text" icon="el-icon-edit" @click="handleHk(scope.row)"
            v-hasPermi="['project:lpayment:edit']">回款</el-button>
          <el-button v-if="
            scope.row.state == '3' &&
            scope.row.fkState == '未付款' &&
            editable
          " size="mini" type="text" icon="el-icon-edit" @click="handleUpdateFkState(scope.row)"
            v-hasPermi="['project:lpayment:edit']">付款
          </el-button>
          <el-button v-if="
            scope.row.state == '3' &&
            scope.row.putTime != null &&
            scope.row.fkState == '未付款' &&
            editable
          " size="mini" type="text" icon="el-icon-edit" @click="handleUpdateOk(scope.row)"
            v-hasPermi="['project:lpayment:edit']">完成</el-button>
          <el-button v-if="scope.row.state === '3'" size="mini" type="text" icon="el-icon-printer"
            @click="handlePrint(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改物流付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook != 4 && isLook != 5">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectId">
                <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                  placeholder="请选择项目" style="width: 100%" :disabled="isQuote">
                  <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName"
                    :value="pro.projectId"></el-option>
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="第三方公司" prop="tpcId">
                <el-select filterable value-key="stId" @change="changeTpc" v-model="form.tpcId" placeholder="请选择第三方公司"
                  style="width: 100%">
                  <el-option v-for="obj in tpcOptions" :key="obj.tpcId" :label="obj.name" :value="obj.tpcId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司账号" prop="account">
                <el-input v-model="form.account" placeholder="请输入公司账号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司开户行" prop="openbank">
                <el-input v-model="form.openbank" placeholder="请输入公司开户行" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运输类型" prop="type">
                <el-radio-group v-model="form.type">
                  <el-radio label="汽运">汽运</el-radio>
                  <el-radio label="火运">火运</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="是否产生服务费" prop="serType">
                <el-radio-group v-model="form.serType">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="isLook == 1">
            <el-col :span="12">

              <el-form-item label="实付金额(元)" prop="tntPrice">
                <el-input v-model="form.tntPrice" placeholder="请输入实付金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isLook == 2">
            <el-col :span="12">
              <el-form-item label="实付金额" prop="tntPrice">
                <span v-text="$options.filters.moneyFilter(form.tntPrice)"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="bz">
                <el-input v-model="form.bz" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--        选择入库单-->
          <div v-if="false">
            <el-popover placement="bottom-start" width="100%" @selection-change="grnSelectionChange" v-model="visible"
              popper-class="area_popper">
              <el-button type="primary" slot="reference" style="margin-bottom: 30px" v-if="isLook != 3">选择随车数质量
              </el-button>
              <el-table ref="singleTable" :data="tableData" @selection-change="grnSelectionChange" style="width: 100%">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column property="name" label="货品名称" width="120">
                </el-table-column>
                <el-table-column property="grnNumber" label="重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column property="grnRz" label="热值（kcal）" width="120">
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
          <!--        显示入库单-->
          <div v-if="false" style="margin-bottom: 30px">
            <el-table ref="singleTable" :data="tableselData" style="width: 100%">
              <el-table-column property="name" label="货品名称" width="90">
              </el-table-column>
              <el-table-column property="grnNumber" label="重量（吨）" width="120">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.grnNumber)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="grnRz" label="热值（kcal）" width="120">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式" width="90">
              </el-table-column>
              <el-table-column property="wlCompany" label="物流公司" width="120">
              </el-table-column>
              <el-table-column property="carNumber" label="车数" width="90">
              </el-table-column>
              <el-table-column property="batch" label="批次" width="90">
              </el-table-column>
              <el-table-column property="deliveryTime" label="发/到货日期" width="120">
              </el-table-column>
              <el-table-column property="valuePrice" label="货值单价（元）" width="90">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.valuePrice)
                  .toFixed(2)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="valueTprice" label="货值总额（元）" width="90">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.valueTprice)
                  .toFixed(2)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column v-if="noedit != 2" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--物流收票明细-->
          <el-row v-if="false">
            <el-col :span="12">
              <el-button type="primary" @click="addTableData" style="margin-bottom: 30px">追加费用</el-button>
            </el-col>
          </el-row>
          <div v-if="false" style="margin-bottom: 30px">
            <el-row>
              <el-col :span="24">
                <el-table ref="wlsingleTable" :data="form.wldetailsList" :key="tableUpdate" style="width: 100%">
                  <el-table-column label="发票号">
                    <template slot-scope="scope">
                      <el-form-item label-width="0" :prop="'wldetailsList.' + scope.$index + '.number'"
                        :rules="rules.number">
                        <el-input v-model="scope.row.number" placeholder="请输入发票号" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="费用名称">
                    <template slot-scope="scope">
                      <el-form-item label-width="0" :prop="'wldetailsList.' + scope.$index + '.wlType'"
                        :rules="rules.wlType">
                        <el-select v-model="scope.row.wlType">
                          <el-option label="运费金额" value="运费金额" />
                          <el-option label="装卸服务费" value="装卸服务费" />
                          <el-option label="站台费" value="站台费" />
                          <el-option label="保险费" value="保险费" />
                          <el-option label="取送车费" value="取送车费" />
                          <el-option label="印花税" value="印花税" />
                          <el-option label="其他" value="其他" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="不含税金额">
                    <template slot-scope="scope">
                      <el-form-item label-width="0" :prop="'wldetailsList.' + scope.$index + '.ntPrice'"
                        :rules="rules.ntPrice">
                        <el-input @change="jsTaxPrice(scope.$index)" v-model="scope.row.ntPrice"
                          placeholder="请输入不含税金额" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="税率">
                    <template slot-scope="scope">
                      <el-form-item label-width="0" :prop="'wldetailsList.' + scope.$index + '.tax'" :rules="rules.tax">
                        <el-select @change="jsTaxPrice(scope.$index)" v-model="scope.row.tax">
                          <el-option label="1%" value="1" />
                          <el-option label="3%" value="3" />
                          <el-option label="6%" value="6" />
                          <el-option label="9%" value="9" />
                          <el-option label="13%" value="13" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="税额">
                    <template slot-scope="scope">
                      <el-form-item label-width="0" :prop="'wldetailsList.' + scope.$index + '.taxPrice'"
                        :rules="rules.taxPrice">
                        <el-input disabled v-model="scope.row.taxPrice" placeholder="请输入税额" />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="
                        deleteWlRow(scope.$index, form.wldetailsList)
                      " type="text" size="small">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
          <el-row v-if="false" class="ic">
            <el-col :span="12">
              <el-form-item label="不含税金额合计" prop="tntPrice">
                <el-input v-model="form.tntPrice" placeholder="请输入不含税金额合计" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false" class="ic">
            <el-col :span="12">
              <el-form-item label="补税金额" prop="bsPrice">
                <el-input v-model="form.bsPrice" placeholder="请输入补税金额" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="附件" prop="file">
                <el-upload class="upload-demo" :action="url" :headers="headers" :on-preview="handlePreview"
                  :on-remove="handleRemove" :on-success="uploadSuccess" :on-error="uploadError"
                  :before-remove="beforeRemove" multiple :limit="5" :on-exceed="handleExceed" :file-list="fileList">
                  <el-button size="small" type="primary" v-if="isLook != 3">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isLook == 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款金额" prop="outPrice">
                <el-input v-model="form.outPrice" placeholder="请输入回款金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回款日期" prop="outTime">
                <el-date-picker clearable size="small" style="width: 100%" v-model="form.outTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择回款日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isLook == 5">
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否产生服务费" prop="serType">
                <el-radio-group v-model="form.serType">
                  <el-radio label="是">是</el-radio>
                  <el-radio label="否">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <div v-if="form.serType == '是'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付日期" prop="putTime">
                  <el-date-picker clearable size="small" style="width: 100%" v-model="form.putTime" type="date"
                    value-format="yyyy-MM-dd" placeholder="选择支付日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="年服务费费率(%)" prop="stRate">
                  <el-input-number v-model="form.stRate" controls-position="right" :precision="2" :step="0.01" :min="0"
                    :max="100" placeholder="请输入年服务费费率(%)" style="width:100%">
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保底服务费期限(天)" prop="mfsp">
                  <el-input v-model="form.mfsp" placeholder="请输入保底服务费期限(天)" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
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
              <td class="title" colspan="6">项目信息</td>
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
              <td class="table-td-title detail">第三方公司</td>
              <td class="table-td-content">
                {{ printData.tpcName }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">公司账号</td>
              <td class="table-td-content">
                {{ printData.account }}
              </td>
              <td class="table-td-title detail">公司开户行</td>
              <td class="table-td-content" colspan="3">
                {{ printData.openbank }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="4">基本信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail" width="20%">实付金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.tntPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail" width="20%">备注</td>
              <td class="table-td-textarea">
                {{ printData.bz }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">服务费信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">是否产生服务费</td>
              <td class="table-td-content">
                {{ printData.serType }}
              </td>
              <td class="table-td-title detail">支付日期</td>
              <td class="table-td-content">
                {{ parseTime(printData.putTime, "{y}-{m}-{d}") }}
              </td>
              <td class="table-td-title detail">年服务费费率(%)</td>
              <td class="table-td-content">
                {{ printData.stRate }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">保底服务费期限(天)</td>
              <td class="table-td-content" colspan="5">
                {{ printData.mfsp }}
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
                {{ contractTypeFormat1(item.type) }}
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
          <approval-print :typeId="9" :stId="apyamentId"></approval-print>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLpayment,
  getLpayment,
  delLpayment,
  addLpayment,
  updateLpayment,
  getStList,
  getTpcList,
  listForBus,
  listForPro,
} from "@/api/project/lpayment";
import { getContract, getGrnList } from "@/api/project/apayment";
import { getToken } from "@/utils/auth";
import print from "print-js";
import {
  getProcessDataByStId,
  getApprovalProcessList,
  getApprovalType,
} from "@/api/approve";
import { getContractList } from "@/api/project/all";
import {
  listProjectForCombobox,
  listBusinessForCombobox,
} from "@/api/project/st";

export default {
  name: "Lpayment",
  props: {
    stIdd: {
      type: String,
    },
    projectIdd: {
      type: String,
    },
    isQuote: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
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
    return {
      tableUpdate: false,
      isLook: 1,
      noedit: 1,
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //选择框状态
      visible: false,
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
      // 物流付款表格数据
      lpaymentList: [],
      //合同集合
      contractNameOptions: [],
      // 项目集合
      projectOptions: [],
      // 第三方公司集合
      tpcOptions: [],
      //入库单集合
      tableData: [],
      //选中入库单集合
      tableselData: [],
      //预选中入库单集合
      tableybData: [],
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
        type: null,
        projectId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "blur" },
        ],
        tpcId: [
          { required: true, message: "请选择第三方公司", trigger: "blur" },
        ],
        account: [
          { required: true, message: "请输入公司账号", trigger: "blur" },
        ],
        openbank: [
          { required: true, message: "请输入公司开户行", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择运输方式", trigger: "blur" }],
        yPrice: [{ required: true, validator: validatePrice, trigger: "blur" }],
        yRate: [{ required: true, validator: validatePrice, trigger: "blur" }],
        ztType: [{ required: true, message: "请选择站台费", trigger: "blur" }],
        ztPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        ztRate: [{ required: true, validator: validatePrice, trigger: "blur" }],
        otherType: [
          { required: true, message: "请选择其他费用", trigger: "blur" },
        ],
        otherPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        otherRate: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        serType: [{ required: true, message: "请选择服务费", trigger: "blur" }],
        putTime: [
          { required: true, message: "请选择支付日期", trigger: "blur" },
        ],
        stRate: [{ required: true, validator: validatePrice, trigger: "blur" }],
        mfsp: [{ required: true, validator: validatePrice4, trigger: "blur" }],
        outPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        outTime: [
          { required: true, message: "请选择回款时间", trigger: "blur" },
        ],
        number: [{ required: true, message: "请输入发票号", trigger: "blur" }],
        wlType: [
          { required: true, message: "请选择费用名称", trigger: "blur" },
        ],
        ntPrice: [
          { required: true, message: "请输入不含税金额", trigger: "blur" },
        ],
        tax: [{ required: true, message: "请选择税率", trigger: "blur" }],
        taxPrice: [{ required: true, message: "请输入税额", trigger: "blur" }],
        tntPrice: [
          { required: true, message: "请输入实付金额", trigger: "blur" },
          { max: 16, message: '不能超过16位', trigger: 'blur'}
        ]
      },
      // 打印
      printReviewVisible: false,
      printData: {},
      isDisabled: false,
      listForBusArr: [],
      listForProArr: [],
      apyamentId: "", //子组件id
    };
  },
  created() {
    if (this.isQuote) {
      this.queryParams.stId = parseInt(this.stIdd);
      this.queryParams.projectId = parseInt(this.projectIdd);
    }
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
    });
    getTpcList().then((response) => {
      this.tpcOptions = response.rows;
    });
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let lpaymentId = this.$route.params.lpaymentId;
      let row = { lpaymentId: lpaymentId };
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
    contractTypeFormat1(type) {
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
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      if (row.type == "1") {
        return "上游合同";
      } else if (row.type == "2") {
        return "下游合同";
      } else if (row.type == "3") {
        return "物流运输合同";
      } else if (row.type == "4") {
        return "物流服务合同";
      } else if (row.type == "5") {
        return "其他合同";
      }
    },
    /** 查询物流付款列表 */
    getList() {
      this.loading = true;
      listLpayment(this.queryParams).then((response) => {
        this.lpaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getTpcList().then((response) => {
        this.tpcOptions = response.rows;
      });
      this.loadProjectForCombobox();
    },
    loadProjectForCombobox() {
      this.listForProArr = [];
      listProjectForCombobox().then((response) => {
        this.listForProArr = response.data;
      });
    },
    loadBusinessForCombobox(projectId) {
      this.listForBusArr = [];
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data;
        if (this.isQuote) {
          this.changeSt(this.queryParams.stId);
        }
      });
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 回款状态
    outFormat(row, column) {
      if (
        row.outPrice != null &&
        row.outPrice != "" &&
        parseFloat(row.outPrice) >= parseFloat(row.tntPrice)
      ) {
        return "已回款";
      } else {
        return "未回款";
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        lpaymentId: null,
        stId: null,
        stName: null,
        tpcId: null,
        tpcName: null,
        account: null,
        openbank: null,
        type: null,
        yPrice: null,
        yRate: null,
        yTax: null,
        yTprice: null,
        ztType: null,
        ztPrice: null,
        ztRate: null,
        ztTax: null,
        ztTprice: null,
        otherType: null,
        otherPrice: null,
        otherRate: null,
        otherTax: null,
        otherTprice: null,
        serType: null,
        putTime: null,
        stRate: undefined,
        mfsp: null,
        outPrice: null,
        outTime: null,
        state: null,
        createBy: null,
        createTime: null,
        hkState: null,
        grnList: [],
        fileList: [],
        contractId: null,
        contractName: null,
        wldetailsList: [],
        taxTotalPrice: null,
        bz: null,
        projectId: null,
        projectIdOld: null,
        projectName: null,
        serialNo: null,
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
      this.ids = selection.map((item) => item.lpaymentId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType({ approvalType: "9" }).then((response) => {
        this.reset();
        if (this.isQuote) {
          this.form.projectId = this.queryParams.projectId;
          this.changeProject(this.queryParams.projectId);
          this.form.stId = this.queryParams.stId;
        }
        this.wldetailsList = [];
        this.fileList = [];
        this.tableData = [];
        this.form.type = "汽运";
        this.form.ztType = "有";
        this.form.otherType = "有";
        this.form.serType = "是";
        this.tableData = [];
        this.tablegryData = [];
        this.tableselData = [];
        this.noedit = 1;
        this.isLook = 1;
        this.form.hkState = 1;
        this.open = true;
        this.title = "添加物流付款";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.wldetailsList = [];
      this.fileList = [];
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];
      const lpaymentId = row.lpaymentId || this.ids;
      getLpayment(lpaymentId).then((response) => {
        this.form = response.data;
        this.fileList = this.form.fileList;
        this.form.tpcId2 = this.form.tpcId;
        this.form.tpcId = this.form.tpcName;
        this.tableselData = response.data.selnyList;
        this.isLook = 2;
        this.form.hkState = 1;
        this.open = true;
        this.title = "修改物流付款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];
      const lpaymentId = row.lpaymentId || this.ids;
      this.$router.push("/lpayment/look/" + lpaymentId);
    },
    /** 回款按钮操作 */
    handleHk(row) {
      this.reset();
      this.tableData = [];
      this.tablegryData = [];
      this.tableselData = [];
      const lpaymentId = row.lpaymentId || this.ids;
      getLpayment(lpaymentId).then((response) => {
        this.form = response.data;
        this.form.tpcId2 = this.form.tpcId;
        this.form.tpcId = this.form.tpcName;
        this.form.outPrice = null;
        this.form.outTime = null;
        this.isLook = 4;
        this.form.hkState = 2;
        this.open = true;
        this.title = "回款物流付款";
      });
    },

    /** 付款按钮操作 */
    handleUpdateFkState(row) {
      this.reset();
      const lpaymentId = row.lpaymentId || this.ids;
      getLpayment(lpaymentId).then((response) => {
        this.form = response.data;
        this.isLook = 5;
        this.form.hkState = 1;
        this.open = true;
        this.title = "修改物流付款";
      });
    },

    /** 完成按钮操作 */
    handleUpdateOk(row) {
      this.reset();
      const lpaymentId = row.lpaymentId || this.ids;
      getLpayment(lpaymentId).then((response) => {
        this.form = response.data;
        this.form.fkState = "已付款";
        updateLpayment(this.form).then((response) => {
          this.msgSuccess("付款成功");
          this.open = false;
          this.getList();
        });
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.tpcId = this.form.tpcId2;
          if (this.noedit != 2) {
            this.form.grnList = this.tableselData;
          } else {
            this.form.grnList = [];
          }

          if (this.form.lpaymentId != null) {
            updateLpayment(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLpayment(this.form).then((response) => {
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
      const lpaymentIds = row.lpaymentId || this.ids;
      this.$confirm("是否确认删除物流付款?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delLpayment(lpaymentIds);
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
        "project/lpayment/export",
        {
          ...this.queryParams,
        },
        `project_lpayment.xlsx`
      );
    },

    //业务开始
    //选择项目
    changeProject(projectId) {
      this.listForBusArr = [];
      this.form.stId = "";
      this.form.stName = "";
      this.form.serialNo = "";
      if (projectId) {
        let projectFind = this.listForProArr.filter(
          (x) => x.projectId == projectId
        );
        if (projectFind && projectFind.length > 0) {
          let obj = projectFind[0];
          //成本年服务费率
          if (obj.chargemType == "1" || obj.chargemType == "3") {
            this.form.stRate = obj.chargemNx;
          } else {
            this.form.stRate = 0;
          }
        }
        this.loadBusinessForCombobox(projectId);
      }
    },
    changeSt(stId) {
      let businessFind = this.listForBusArr.filter((x) => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        let obj = businessFind[0];
        this.tableData = [];
        this.form.stName = obj.stName;
        this.form.serialNo = obj.serialNo;
        let data = { stId: obj.stId, wlState: "1" };
        getGrnList(data).then((response) => {
          this.tableData = response.rows;
        });

        // getContractListAll(data).then(response => {
        //   this.contractNameOptions = response.rows;
        // });

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
      }
    },

    //选择第三方公司
    changeTpc(obj) {
      this.tpcOptions.forEach((e) => {
        if (e.tpcId == obj) {
          this.form.tpcId2 = e.tpcId;
          this.form.tpcName = e.name;
          this.form.account = e.account;
          this.form.openbank = e.openbank;
        }
      });
    },

    //选中数据
    grnSelectionChange(selection) {
      this.tableybData = [];
      this.tableybData = selection;
    },
    //移除选中数据
    deleteRow(index, rows) {
      this.tableselData.splice(index, 1);
    },
    //确认选择数据
    toggleSelection() {
      this.tableselData = this.tableybData;
      this.visible = false;
    },
    //计算运费
    jsy() {
      let yp = 0;
      let yr = 0;
      if (this.form.yPrice != null && this.form.yPrice != "") {
        yp = this.form.yPrice;
      }
      if (this.form.yRate != null && this.form.yRate != "") {
        yr = this.form.yRate;
      }
      this.form.yTax = ((yp * yr) / 100).toFixed(2);
      this.form.yTprice = parseFloat(yp) + parseFloat(this.form.yTax);
    },
    //计算站台
    jszt() {
      let ztp = 0;
      let ztr = 0;
      if (this.form.ztPrice != null && this.form.ztPrice != "") {
        ztp = this.form.ztPrice;
      }
      if (this.form.ztRate != null && this.form.ztRate != "") {
        ztr = this.form.ztRate;
      }
      this.form.ztTax = ((ztp * ztr) / 100).toFixed(2);
      this.form.ztTprice = parseFloat(ztp) + parseFloat(this.form.ztTax);
    },
    //计算其他
    jsother() {
      let otherp = 0;
      let otherr = 0;
      if (this.form.otherPrice != null && this.form.otherPrice != "") {
        otherp = this.form.otherPrice;
      }
      if (this.form.otherRate != null && this.form.otherRate != "") {
        otherr = this.form.otherRate;
      }
      this.form.otherTax = ((otherp * otherr) / 100).toFixed(2);
      this.form.otherTprice =
        parseFloat(otherp) + parseFloat(this.form.otherTax);
    },

    //溢出选中数据
    deleteWlRow(index, rows) {
      this.form.wldetailsList.splice(index, 1);
    },
    //追加费用
    addTableData() {
      if (this.form.wldetailsList == undefined) {
        this.form.wldetailsList = new Array();
      }
      let obj = {};
      this.form.wldetailsList.push(obj);
    },
    jsTaxPrice(index) {
      let obj = this.form.wldetailsList[index];
      if (
        obj.ntPrice != null &&
        obj.ntPrice != "" &&
        obj.tax != null &&
        obj.tax != ""
      ) {
        this.form.wldetailsList[index].taxPrice = (
          parseFloat(obj.ntPrice) *
          (parseFloat(obj.tax) / 100)
        ).toFixed(2);
      }
      this.jsTotal();
    },
    jsTotal() {
      let tntPrice = 0.0;
      let bsPrice = 0.0;
      let taxTotalPrice = 0.0;
      for (let i = 0; i < this.form.wldetailsList.length; i++) {
        let obj = this.form.wldetailsList[i];
        if (
          obj.taxPrice != null &&
          obj.taxPrice != "" &&
          obj.ntPrice != null &&
          obj.ntPrice != ""
        ) {
          tntPrice = parseFloat(tntPrice) + parseFloat(obj.ntPrice);
          // bsPrice=parseFloat(bsPrice)+parseFloat(obj.taxPrice)
          // 不含税金额*（0.13-税率）*1.12
          bsPrice = (
            parseFloat(bsPrice) +
            parseFloat(obj.ntPrice) * (0.13 - parseFloat(obj.tax) / 100) * 1.12
          ).toFixed(2);

          taxTotalPrice = parseFloat(taxTotalPrice) + parseFloat(obj.taxPrice);
        }
      }

      this.form.tntPrice = tntPrice;
      this.form.bsPrice = bsPrice;
      this.form.taxTotalPrice = taxTotalPrice;
      if (this.tableUpdate) {
        this.tableUpdate = false;
      } else {
        this.tableUpdate = true;
      }
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
      this.apyamentId = row.lpaymentId;
      this.printData = {};
      await getLpayment(row.lpaymentId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.gryList = response.data.selnyList;
        this.printData.wldetailsList = response.data.wldetailsList;
        this.printData.printType = "物流付款";
        let data = { stId: row.stId };
        //合同
        getContractList(data).then((response) => {
          this.printData.contract = response.rows;
        });
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
