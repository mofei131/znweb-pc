<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch && !isQuote"
      label-width="68px"
    >
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="stName">
        <el-input
          v-model="queryParams.stName"
          placeholder="业务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
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
          v-hasPermi="['project:fpayment:add']"
          v-show="editable"
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
      <!--          v-hasPermi="['project:fpayment:edit']"-->
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
      <!--          v-hasPermi="['project:fpayment:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:fpayment:export']"-->
      <!--          >导出</el-button-->
      <!--        >-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        v-show="!isQuote"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="fpaymentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="项目名称"
        align="center"
        prop="projectName"
        v-if="!isQuote"
      />
      <el-table-column
        label="业务名称"
        align="center"
        prop="stName"
        v-if="!isQuote"
      />
      <el-table-column
        label="项目编号"
        align="center"
        prop="serialNo"
        v-if="!isQuote"
      />
      <el-table-column label="货品名称" align="center" prop="hpName" />
      <el-table-column label="合计重量(吨)" align="center" prop="tweight">
        <template slot-scope="scope">
          {{
            Number(scope.row.tweight)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="结算单价(元)" align="center" prop="price">
        <template slot-scope="scope">
          {{
            Number(scope.row.price)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="电厂结算金额(元)" align="center" prop="zzPrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.zzPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="扣除费用合计(元)"
        align="center"
        prop="otherPrice"
      >
        <template slot-scope="scope">
          {{
            Number(scope.row.otherPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="最终应付总额(元)"
        align="center"
        prop="yftotalPrice"
      >
        <template slot-scope="scope">
          {{
            Number(scope.row.yftotalPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="已付金额总额(元)" align="center" prop="yfPrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.yfPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="最终实际付款(元)" align="center" prop="sjPrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.sjPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="开票状态"
        align="center"
        prop="moType"
        :formatter="moFormat"
      />
      <el-table-column
        label="创建日期"
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
          <el-button
            v-if="scope.row.state == '3' && editable"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdatePayTime(scope.row)"
            >付款</el-button
          >
          <el-button
            v-if="scope.row.state == '3' && editable"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openPayDetailss(scope.row)"
            >付款明细</el-button
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

    <!-- 添加或修改最终付款对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="773px"
      append-to-body
      @opened="handleOpen"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <div v-if="isLook != '4'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectId">
                <el-select
                  filterable
                  value-key="projectId"
                  @change="changeProject"
                  v-model="form.projectId"
                  placeholder="请选择项目"
                  style="width: 100%"
                  :disabled="isQuote"
                >
                  <el-option
                    v-for="pro in listForProArr"
                    :key="pro.projectId"
                    :label="pro.projectName"
                    :value="pro.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务名称" prop="stId">
                <el-select
                  filterable
                  value-key="stId"
                  @change="changeSt"
                  v-model="form.stId"
                  placeholder="请选择业务"
                  style="width: 100%"
                  :disabled="isQuote"
                >
                  <el-option
                    v-for="obj in listForBusArr"
                    :key="obj.stId"
                    :label="obj.stName"
                    :value="obj.stId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编号" prop="serialNo">
                <span v-text="form.serialNo"></span>
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
              <el-form-item label="业务类型" prop="businessType">
                <span v-text="businessTypeFormat(form.businessType)"></span>
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
              <el-form-item label="供应商开户行" prop="openbank">
                <el-input
                  v-model="form.openbank"
                  placeholder="请输入供应商开户行"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!--        <el-row>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="预付方式" prop="payType">-->
          <!--              <el-select  v-model="form.payType" @change="jsdj"  placeholder="请选择预付方式" style="width: 100%">-->
          <!--                <el-option label="吨"  value="吨" >吨</el-option>-->
          <!--                <el-option label="热值" value="热值" >热值</el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--        </el-row>-->
          <!--        <div v-if="form.payType=='热值'">-->
          <!--          <el-row>-->
          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="热值单价(元/Kcal)" prop="rzValue">-->
          <!--                <el-input v-model="form.rzValue" @change="jsdj" placeholder="请输入热值单价(元/Kcal)" />-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--        </div>-->

          <!--已选择的出库单-->
          <!-- <div style="margin-bottom: 30px">
            <el-table ref="singleTable" :data="tableselData" style="width: 100%">
              <el-table-column property="name" label="货品名称" width="90">
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
              <el-table-column property="valuePrice" label="货值单价（元）" width="120">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.valuePrice)
                  .toFixed(2)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="valueTprice" label="货值总额（元）" width="120">
                <template slot-scope="scope">
                  {{
                  Number(scope.row.valueTprice)
                  .toFixed(3)
                  .toString()
                  .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>-->

          <!-- <el-row>
            <el-col :span="6">
              <el-form-item label="合计重量" prop="totalWeight">
                <span style="color: red">{{
                  $options.filters.weightFilter(form.tweight)
                  }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平均热值" prop="averageRz">
                <span style="color: red">{{ form.prz }}</span>
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row>
            <el-col :span="12">
              <el-form-item label="电厂结算金额(元)" prop="zzPrice">
                <el-input
                  @change="atochange"
                  v-model="form.jst"
                  placeholder="请输入电厂结算金额(元)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算税款" prop="tax">
                <el-input v-model="form.jstax" placeholder="请输入结算税款" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="结算单价(元)" prop="price">
                <el-input
                  v-model="form.price"
                  @change="toggleSelection"
                  placeholder="请输入结算单价(元)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="扣除费用明细:" style="color: black">
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运费(元)" prop="ttPrice">
                <el-input
                  v-model="form.ttPrice"
                  @change="atochange"
                  placeholder="请输入运费(元)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保证金(元)" prop="bzPrice">
                <el-input
                  v-model="form.bzPrice"
                  placeholder="请输入保证金(元)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="gdType != 1">
              <el-form-item label="固定差价总额(元)" prop="gdxPrice">
                <el-input
                  @change="atochange"
                  v-model="form.gdxPrice"
                  placeholder="请输入固定差价总额(元)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务费(元)" prop="servicePrice">
                <el-input v-model="form.servicePrice" @change="atochange" placeholder="请输入服务费" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="承兑贴息(元)" prop="cdtx">
                <el-input v-model="form.cdtx" @change="atochange" placeholder="请输入承兑贴息" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补税金额(元)" prop="bsPrice">
                <el-input v-model="form.bsPrice" @change="atochange" placeholder="请输入补税金额" style="width: 60%" />
                <el-button style="margin-left:10px" size="small" type="primary" @click="cxjs" v-if="isLook != 3"
                  :disabled="isCxjs != 1">重新计算</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="其他扣款(元)" prop="otherPrice">
                <el-input v-model="form.otherPrice" @change="atochange" placeholder="请输入其他扣款" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="增加费用明细:" style="color: black">
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="贴息(元)" prop="tx">
                <el-input v-model="form.tx" @change="atochange" placeholder="请输入贴息" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他费用(元)" prop="qt">
                <el-input v-model="form.qt" @change="atochange" placeholder="请输入其他" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="增加费用合计(元)" prop="tx">
                <span v-text="$options.filters.moneyFilter(form.zjt)"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="最终应付款金额(元)" prop="yftotalPrice">
                <el-input disabled v-model="form.yftotalPrice" placeholder="请输入最终应付款金额" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最终应付款税额(元)" prop="yftotalPrice">
                <el-input disabled v-model="form.yftotalPriceatx" placeholder="请输入最终应付款税额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="提单金额(元)" prop="yfPrice">
                <el-input disabled v-model="form.yfPrice" placeholder="请输入提单金额" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调整金额(元)" prop="je">
                <el-input @change="atochange" v-model="form.je" placeholder="请输入金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="最终实际付款(元)" prop="sjPrice">
                <el-input
                  v-model="form.sjPrice"
                  placeholder="请输入最终实际付款(元)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!--        图片上传-->
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
                  :limit="10"
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="实际支付(元)" prop="sjzf">
                <span v-text="form.sjzf"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div v-if="isLook == '4'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="应付金额：">
                <span
                  v-text="$options.filters.moneyFilter(form.sjPrice)"
                ></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已付金额：">
                <span
                  v-text="$options.filters.moneyFilter(form.ypayPrice)"
                ></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="剩余应付：">
                <span v-text="form.sjPrice - form.ypayPrice"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款金额(元)" prop="payPrice">
                <el-input
                  v-model="form.payPrice"
                  placeholder="请输入付款金额"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款日期" prop="payTime">
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 100%"
                  v-model="form.payTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择付款日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年息服务费率(%)" prop="rateYear">
                <el-input
                  v-model="form.rateYear"
                  placeholder="请输入年息服务费率"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保底服务费期限(天)" prop="mfsp">
                <el-input
                  v-model="form.mfsp"
                  placeholder="请输入保底服务费期限"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="isDisabled"
          v-if="isLook != 3"
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
                ></span>
              </el-col>
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
                {{ businessTypeFormat(printData.businessType) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">供应商</td>
              <td class="table-td-content">
                {{ printData.supplierName }}
              </td>
              <td class="table-td-title detail">供应商账号</td>
              <td class="table-td-content">
                {{ printData.account }}
              </td>
              <td class="table-td-title detail">供应商开户行</td>
              <td class="table-td-content">
                {{ printData.openbank }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="10">出入库信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">货品名称</td>
              <td class="table-td-title detail">出库重量(吨)</td>
              <td class="table-td-title detail">出库热值(Kcal)</td>
              <td class="table-td-title detail">运输方式</td>
              <td class="table-td-title detail">物流公司</td>
              <td class="table-td-title detail">车数</td>
              <td class="table-td-title detail">批次</td>
              <td class="table-td-title detail">到货日期</td>
              <td class="table-td-title detail">货值单价(元)</td>
              <td class="table-td-title detail">货值总额(元)</td>
            </tr>
            <tr v-for="(item, idx) in printData.gryList" :key="idx">
              <td class="table-td-content" style="text-align: center">
                {{ item.name }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.weightFilter(item.grnNumber) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.grnRz }}
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
                {{ item.deliveryTime }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.moneyFilter(item.valuePrice) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.moneyFilter(item.valueTprice) }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="table-td-title detail">合计重量</td>
              <td class="table-td-title detail">平均热值</td>
            </tr>
            <tr>
              <td class="table-td-content" style="text-align: center">
                {{ $options.filters.weightFilter(printData.tweight) }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.prz }}
              </td>
            </tr>
          </table>
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">基础信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">电厂结算金额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.jst) }}
              </td>
              <td class="table-td-title detail">税款</td>
              <td class="table-td-content">
                {{ printData.jstax }}
              </td>
              <td class="table-td-title detail">货品单价(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.price) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">运费(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.ttPrice) }}
              </td>
              <td class="table-td-title detail">保证金(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.bzPrice) }}
              </td>
              <td class="table-td-title detail">固定差价总额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.gdxPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">服务费</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.servicePrice) }}
              </td>
              <td class="table-td-title detail">承兑贴息</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.cdtx) }}
              </td>
              <td class="table-td-title detail">补税金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.bsPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">其他扣款</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.otherPrice) }}
              </td>
              <td class="table-td-title detail">贴息</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.tx) }}
              </td>
              <td class="table-td-title detail">其他费用</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.qt) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">最终应付款金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yftotalPrice) }}
              </td>
              <td class="table-td-title detail">最终应付款税额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yftotalPriceatx) }}
              </td>
              <td class="table-td-title detail">已付金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yfPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">调整金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.je) }}
              </td>
              <td class="table-td-title detail">最终实际付款(元)</td>
              <td class="table-td-content" colspan="3">
                {{ $options.filters.moneyFilter(printData.sjPrice) }}
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
          <approval-print :typeId="5" :stId="apyamentId"></approval-print>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFpayment,
  getFpayment,
  delFpayment,
  addFpayment,
  updateFpayment,
  getStList,
  getGryList,
  getContract,
  getHkState,
  listForBus,
  listForPro,
} from "@/api/project/fpayment";
import { getToken } from "@/utils/auth";
import { getSticketList, getContractList } from "@/api/project/all";
import print from "print-js";
import {
  getProcessDataByStId,
  getApprovalProcessList,
  getApprovalType,
} from "@/api/approve";
import {
  listProjectForCombobox,
  listBusinessForCombobox,
} from "@/api/project/st";
export default {
  name: "Fpayment",
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
      //选择出库单框显示状态
      visible: false,
      //加载后出库单集合
      tablegryData: [],
      //选中入库单集合
      tableselData: [],
      //预选中入库单集合
      tableybData: [],
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
      // 最终付款表格数据
      fpaymentList: [],
      //固定差价
      gd: 0,
      //固定差价类别
      gdType: 1,
      //补税金额
      bs: 0,
      //未结算服务费
      nfp: 0,
      //结算单价
      price: 0,
      // 项目集合
      projectOptions: [],
      //重新计算按钮
      isCxjs: 1,
      // 审批状态字典
      stateOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //
      kpopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        price: null,
        createTime: null,
        projectId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务名称", trigger: "blur" }],
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "blur" },
        ],
        payType: [
          { required: true, message: "请选择预付方式", trigger: "blur" },
        ],
        rzValue: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        zzPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        tax: [{ required: true, validator: validatePrice, trigger: "blur" }],
        price: [{ required: true, validator: validatePrice, trigger: "blur" }],
        payTime: [
          { required: true, message: "请选择付款日期", trigger: "blur" },
        ],
        ttPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        bzPrice: [{ validator: validatePrice3, trigger: "blur" }],
        gdxPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        servicePrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        cdtx: [{ validator: validatePrice3, trigger: "blur" }],
        bsPrice: [{ validator: validatePrice3, trigger: "blur" }],
        otherPrice: [{ validator: validatePrice3, trigger: "blur" }],
        yftotalPrice: [{ validator: validatePrice, trigger: "blur" }],
        yftotalPriceatx: [{ validator: validatePrice, trigger: "blur" }],
        yfPrice: [{ validator: validatePrice, trigger: "blur" }],
        sjPrice: [{ validator: validatePrice, trigger: "blur" }],
        kpPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        kpTax: [{ required: true, validator: validatePrice, trigger: "blur" }],
        kpTotal: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        kpName: [{ required: true, message: "请输入", trigger: "blur" }],
        kpNumber: [{ required: true, message: "请输入", trigger: "blur" }],
        tx: [{ validator: validatePrice3, trigger: "blur" }],
        qt: [{ validator: validatePrice3, trigger: "blur" }],
        je: [{ validator: validatePrice3, trigger: "blur" }],
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
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let fpaymentId = this.$route.params.fpaymentId;
      let row = { fpaymentId: fpaymentId };
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
    businessTypeFormat(businessType) {
      if (businessType == "cud") {
        return "储备业务垫付运费";
      } else if (businessType == "cu") {
        return "储备业务不垫付运费";
      } else if (businessType == "dcd") {
        return "到厂业务垫付运费";
      } else if (businessType == "dc") {
        return "到厂业务不垫付运费";
      } else if (businessType == "cbd") {
        return "车板业务垫付运费";
      } else if (businessType == "cb") {
        return "车板业务不垫付运费";
      }
    },
    /** 查询最终付款列表 */
    getList() {
      this.loading = true;
      listFpayment(this.queryParams).then((response) => {
        this.fpaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      // 项目下拉
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
    // 开票状态
    moFormat(row, column) {
      if (row.moType == "1") {
        return "未开票";
      } else {
        return "已开票";
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // kp取消按钮
    kpcancel() {
      this.kpopen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fpaymentId: null,
        stId: null,
        stName: null,
        payType: null,
        rzValue: null,
        tweight: null,
        prz: null,
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
        zzPrice: null,
        tax: null,
        price: null,
        payTime: null,
        ttPrice: null,
        bzPrice: null,
        gdxPrice: null,
        servicePrice: null,
        cdtx: null,
        bsPrice: null,
        otherPrice: null,
        yftotalPrice: null,
        yftotalPriceatx: null,
        yfPrice: null,
        sjPrice: null,
        state: null,
        createBy: null,
        createTime: null,
        hkState: null,
        gryList: [],
        fileList: [],
        tx: null,
        qt: null,
        zjt: null,
        jst: null,
        jstax: null,
        rateYear: null,
        mfsp: null,
        sjzf: null,
        supplierId: null,
        supplierName: null,
        account: null,
        openbank: null,
        projectId: null,
        serialNo: null,
        projectName: null,
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
      this.ids = selection.map((item) => item.fpaymentId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType({ approvalType: "5" }).then((response) => {
        this.reset();
        if (this.isQuote) {
          this.form.projectId = this.queryParams.projectId;
          this.changeProject(this.queryParams.projectId);
          this.form.stId = this.queryParams.stId;
        }
        this.form.payType = "吨";
        this.tableData = [];
        this.tableselData = [];
        this.fileList = [];
        this.form.tweight = 0;
        this.form.prz = 0;
        this.gdType = 1;
        this.form.isKp = 1;
        this.isLook = 1;
        this.open = true;
        this.title = "添加最终付款";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.gdType = 1;
      const fpaymentId = row.fpaymentId || this.ids;
      getFpayment(fpaymentId).then((response) => {
        this.form = response.data;
        this.fileList = this.form.fileList;
        this.tableselData = response.data.selnyList;
        this.form.isKp = 1;
        this.isLook = 1;
        this.open = true;
        this.title = "修改最终付款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.gdType = 1;
      const fpaymentId = row.fpaymentId || this.ids;
      this.$router.push("/fpayment/look/" + fpaymentId);
    },

    /** 修改按钮操作 */
    handleUpdatePayTime(row) {
      this.reset();
      const fpaymentId = row.fpaymentId || this.ids;
      getFpayment(fpaymentId).then((response) => {
        this.form = response.data;
        this.isLook = 4;
        this.open = true;
        this.title = "修改最终付款";
      });
    },

    /** 查看付款明细 */
    openPayDetailss(row) {
      this.$router.push({
        name: "paydetailsList",
        query: { type: "fpayment", pid: row.fpaymentId },
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isLook != 4) {
            if (this.tableselData.length < 1) {
              this.msgError("请选择出库单");
              return;
            }
            this.form.gryList = this.tableselData;
          }

          if (this.form.fpaymentId != null) {
            updateFpayment(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFpayment(this.form).then((response) => {
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
      const fpaymentIds = row.fpaymentId || this.ids;
      this.$confirm("是否确认删除最终付款?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delFpayment(fpaymentIds);
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
        "project/fpayment/export",
        {
          ...this.queryParams,
        },
        `project_fpayment.xlsx`
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
    uploadSuccess(res, file, filelist) {
      if (res.code == "200") {
        this.form.fileList = [];
        for (let i = 0; i < filelist.length; i++) {
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

    //业务开始
    //选择项目 加载数据
    changeProject(projectId) {
      let that = this;
      this.listForBusArr = [];
      this.form.stId = "";
      this.form.stName = "";
      this.form.serialNo = "";
      if (projectId) {
        this.loadBusinessForCombobox(projectId);
      }
      let businessType =
        this.listForProArr[
          that.listForProArr.findIndex((x) => x.projectId == projectId)
        ].businessType;
      this.form.businessType = businessType;
    },
    changeSt(stId) {
      let businessFind = this.listForBusArr.filter((x) => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        let obj = businessFind[0];
        console.log(obj);
        console.log(this.listForProArr);
        this.form.supplierId = "";
        // this.form.supplierName = null;
        this.form.supplierName = "";
        this.form.account = null;
        this.form.openbank = null;
        this.form.serialNo = obj.serialNo;
        this.tableselData = [];
        this.form.stName = obj.stName;
        //固定差价
        if (obj.chargemType == "2" || obj.chargemType == "3") {
          this.gd = obj.chargemGd;
          this.gdType = 2;
        } else {
          this.gd = 0;
          this.gdType = 1;
        }
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

        let gry = { stId: obj.stId, zzpayState: 1 };
        getGryList(gry).then((response) => {
          this.tableselData = response.rows;
          let tt = 0;
          if (this.gdType == 2) {
            for (let i = 0; i < response.rows.length; i++) {
              tt =
                parseFloat(tt) +
                parseFloat(response.rows[i].grnNumber * this.gd);
            }
            this.form.gdxPrice = tt.toFixed(2);
          }
          this.toggleSelection();
        });
        let stData = { stId: obj.stId };
        getHkState(stData).then((response) => {
          this.form.ttPrice = parseFloat(response.data.ttPrice).toFixed(2);
          this.form.bzPrice = parseFloat(response.data.bzPrice).toFixed(2);
          this.form.servicePrice = parseFloat(
            response.data.servicePrice
          ).toFixed(2);
          this.form.bsPrice = parseFloat(response.data.bsPrice).toFixed(2);
          this.form.yfPrice = parseFloat(response.data.yfPrice).toFixed(2);
          this.form.jst = parseFloat(response.data.jst).toFixed(2);
          this.form.jstax = parseFloat(response.data.jstax).toFixed(2);
          this.form.price = parseFloat(response.data.price).toFixed(2);
          this.bs = parseFloat(response.data.bsPrice).toFixed(2);
          this.price = parseFloat(response.data.price).toFixed(2);
          this.form.zzPrice = parseFloat(response.data.jst).toFixed(2);
          this.form.tax = (
            (parseFloat(response.data.jst) / 1.13) *
            0.13
          ).toFixed(2);
          this.form.sjzf = parseFloat(response.data.sjzf).toFixed(2);
          this.form.supplierId = response.data.supplierId;
          this.form.supplierName = response.data.supplierName;
          this.form.account = response.data.account;
          this.form.openbank = response.data.openbank;
          this.toggleSelection();
        });

        let sticketData = { stId: obj.stId };
        getSticketList(sticketData).then((response) => {
          let sticketList = response.rows;
          let a1 = false;
          let a2 = false;
          for (let i = 0; i < sticketList.length; i++) {
            if (
              sticketList[i].proportion != null &&
              sticketList[i].proportion != ""
            ) {
              if (sticketList[i].proportion == "5%") {
                a1 = true;
              }
              if (sticketList[i].proportion == "95%") {
                a2 = true;
              }
            }
          }
          if (!a1 && !a2) {
            this.$message.error("该项目没有5%和95%收票记录");
          } else {
            if (!a1) {
              this.$message.error("该项目没有5%收票记录");
            }
            if (!a2) {
              this.$message.error("该项目没有95%收票记录");
            }
          }
        });
      }
    },

    //计算重量
    toggleSelection() {
      let tgn = 0;
      let tgr = 0;
      for (let i = 0; i < this.tableselData.length; i++) {
        tgn += this.tableselData[i].grnNumber;
        tgr += this.tableselData[i].gryRz;
      }
      let ts = 0;
      if (this.tableselData != null && this.tableselData != "") {
        ts = this.tableselData.length;
      }
      this.form.tweight = tgn;
      if (tgr == 0 || ts == 0) {
        this.form.prz = 0;
      } else {
        this.form.prz = (parseFloat(tgr) / parseFloat(ts)).toFixed(2);
      }

      if (this.gd != null && this.gd != "") {
        this.form.gdxPrice = (parseFloat(tgn) * parseFloat(this.gd)).toFixed(2);
      } else {
        this.form.gdxPrice = 0;
      }

      this.atochange();
    },
    //计算单价
    jsdj() {},
    // 计算最终付款总额
    atochange() {
      let zzprice = 0;
      if (this.form.zzPrice != null && this.form.zzPrice != "") {
        zzprice = this.form.zzPrice;
      }

      let tx = 0;
      let qt = 0;
      if (this.form.tx != null && this.form.tx != "") {
        tx = this.form.tx;
      }
      if (this.form.qt != null && this.form.qt != "") {
        qt = this.form.qt;
      }
      this.form.zjt = parseFloat(tx) + parseFloat(qt);

      if (
        this.form.zzPrice != null &&
        this.form.zzPrice != "" &&
        this.form.zzPrice != 0
      ) {
        let zz = 0;
        let bz = 0;
        let tt = 0;
        let gdx = 0;
        let ser = 0;
        let cd = 0;
        let bs = 0;
        let ot = 0;

        if (this.form.zzPrice != null && this.form.zzPrice != "") {
          zz = this.form.zzPrice;
        }
        if (this.form.bzPrice != null && this.form.bzPrice != "") {
          bz = this.form.bzPrice;
        }
        if (this.form.ttPrice != null && this.form.ttPrice != "") {
          tt = this.form.ttPrice;
        }
        if (this.form.gdxPrice != null && this.form.gdxPrice != "") {
          gdx = this.form.gdxPrice;
        }
        if (this.form.servicePrice != null && this.form.servicePrice != "") {
          ser = this.form.servicePrice;
        }
        if (this.form.cdtx != null && this.form.cdtx != "") {
          cd = this.form.cdtx;
        }
        if (this.form.bsPrice != null && this.form.bsPrice != "") {
          bs = this.form.bsPrice;
        }
        if (this.form.otherPrice != null && this.form.otherPrice != "") {
          ot = this.form.otherPrice;
        }

        let je = 0;
        if (this.form.je != null && this.form.je != "") {
          je = this.form.je;
        }
        //最终应付款
        this.form.yftotalPrice = (
          zz -
          bz -
          tt -
          gdx -
          ser -
          cd -
          bs -
          ot +
          parseFloat(tx) +
          parseFloat(qt)
        ).toFixed(2);
        //最终应付税款
        this.form.yftotalPriceatx = (
          ((zz -
            bz -
            tt -
            gdx -
            ser -
            cd -
            bs -
            ot +
            parseFloat(tx) +
            parseFloat(qt)) /
            1.13) *
          0.13
        ).toFixed(2);
        //最终实际付款
        this.form.sjPrice = (
          this.form.yftotalPrice -
          this.form.yfPrice -
          parseFloat(je)
        ).toFixed(2);
      } else {
        //最终应付款
        this.form.yftotalPrice = 0;
        //最终应付税款
        this.form.yftotalPriceatx = 0;
        //最终实际付款
        this.form.sjPrice = 0;
      }
    },

    //重新计算
    cxjs() {
      let cd = 0;
      let bs = 0;
      if (this.form.cdtx != null && this.form.cdtx != "") {
        cd = this.form.cdtx;
      }
      if (this.bs != null && this.bs != "") {
        bs = this.bs;
      }
      this.form.bsPrice = (parseFloat(bs) + (cd / 1.13) * 0.13 * 1.12).toFixed(
        2
      );
      this.atochange();
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
      this.apyamentId = row.fpaymentId;
      this.printData = {};
      await getFpayment(row.fpaymentId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = this.form.fileList;
        this.printData.gryList = response.data.selnyList;
        this.printData.printType = "最终付款";
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
