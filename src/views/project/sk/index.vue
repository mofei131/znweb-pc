<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch && !isQuote" label-width="68px">
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
          v-hasPermi="['project:sk:add']">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:sk:edit']"-->
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
      <!--          v-hasPermi="['project:sk:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:sk:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" v-show="!isQuote"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="skList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" v-if="!isQuote" />
      <el-table-column label="业务名称" align="center" prop="stName" v-if="!isQuote" />
      <el-table-column label="项目编号" align="center" prop="serialNo" v-if="!isQuote" />
      <el-table-column label="收款类型" align="center" prop="skType" />
      <el-table-column label="合计重量(吨)" align="center" prop="tweight">
        <template slot-scope="scope">
          {{
          Number(scope.row.tweight)
          .toFixed(3)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="收款单价" align="center" prop="skPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.skPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="收款总额(元)" align="center" prop="skTprice">
        <template slot-scope="scope">
          {{
          Number(scope.row.skTprice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="实际应收金额" align="center" prop="sjPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.sjPrice)
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
      <!--      <el-table-column label="收款状态" align="center" prop="skState" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)"
            v-hasPermi="['project:sk:edit']">查看</el-button>
          <el-button v-if="scope.row.state === '3'" size="mini" type="text" icon="el-icon-printer"
            @click="handlePrint(scope.row)">打印</el-button>
          <!--          <el-button v-if="scope.row.state=='3' && scope.row.skState=='未收款'"-->
          <!--                     size="mini"-->
          <!--                     type="text"-->
          <!--                     icon="el-icon-edit"-->
          <!--                     @click="handleUpdateSkTime(scope.row)"-->
          <!--                     v-hasPermi="['project:apayment:edit']"-->
          <!--          >收款</el-button>-->
          <!--          <el-button v-if="scope.row.state=='3' && scope.row.skState=='未收款'  && scope.row.skTime!=null"-->
          <!--                     size="mini"-->
          <!--                     type="text"-->
          <!--                     icon="el-icon-edit"-->
          <!--                     @click="handleUpdateSkState(scope.row)"-->
          <!--                     v-hasPermi="['project:apayment:edit']"-->
          <!--          >完成</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:sk:edit']"-->
          <!--          >修改</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:sk:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改收款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="773px" append-to-body @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <div v-if="isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectId">
                <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                  placeholder="请选择项目" style="width: 100%" :disabled="isQuote">
                  <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName"
                    :value="pro.projectId">
                  </el-option>
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
            <el-col :span="12">
              <el-form-item label="终端客户" prop="tName">
                <span v-text="form.tName"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款类型" prop="skType">
                <el-select v-model="form.skType" placeholder="请选择收款类型" style="width: 100%">
                  <el-option label="收款" value="收款">收款</el-option>
                  <el-option label="预收款" value="预收款">预收款</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="this.form.skType == '收款'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="收款方式" prop="skWay">
                  <el-select v-model="form.skWay" @change="toggleSelection" placeholder="请选择收款方式" style="width: 100%">
                    <el-option label="吨" value="吨">吨</el-option>
                    <el-option label="热值" value="热值">热值</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="form.skWay == '热值'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="热值单价(元/Kcal)" prop="rzPrice">
                    <el-input v-model="form.rzPrice" @change="toggleSelection" placeholder="请输入热值单价(元/Kcal)" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!--选择出库单-->
            <div>
              <el-popover placement="bottom-start" width="100%" @selection-change="grnSelectionChange" v-model="visible"
                popper-class="area_popper">
                <el-button size="small" type="primary" slot="reference" style="margin-bottom: 30px" v-if="isLook != 3">
                  选择出库单</el-button>
                <el-table ref="singleTable1" :data="tablegryData" @selection-change="grnSelectionChange"
                  style="width: 100%">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column property="name" label="货品名称" width="120">
                  </el-table-column>
                  <el-table-column property="grnNumber" label="出库重量（吨）" width="120">
                    <template slot-scope="scope">
                      {{
                      Number(scope.row.grnNumber)
                      .toFixed(3)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
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
            <!--已选择的出库单-->
            <div style="margin-bottom: 30px">
              <el-table ref="singleTable" :data="tableselData" style="width: 100%">
                <el-table-column property="name" label="货品名称" width="90">
                </el-table-column>
                <el-table-column property="grnNumber" label="出库重量（吨）" width="120">
                  <template slot-scope="scope">
                    {{
                    Number(scope.row.grnNumber)
                    .toFixed(3)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
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
                    .toFixed(2)
                    .toString()
                    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
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

            <el-row style="margin-bottom:10px">
              <el-col :span="6">
                <span style="font-weight:600">合计重量{{"\xa0\xa0"}}</span>
                <span style="color: red">{{
                  $options.filters.weightFilter(form.tweight)
                  }}</span>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:10px">
              <el-col :span="6">
                <span style="font-weight:600">平均热值{{"\xa0\xa0"}}</span>
                <span style="color: red">{{ form.prz }}</span>
              </el-col>
            </el-row>

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
                <el-button size="small" style="margin-left: 20px" type="primary" @click="jsjc" v-if="isLook != 3">奖惩计算
                </el-button>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="收款总额(元)" prop="skTprice">
                  <el-input @change="jspay" v-model="form.skTprice" placeholder="请输入收款总额(元)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收款单价" prop="skPrice">
                  <el-input @change="jsdj" v-model="form.skPrice" placeholder="请输入收款单价" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="税款" prop="tax">
                  <el-input v-model="form.tax" placeholder="请输入税款(元)" />
                </el-form-item>
              </el-col>
              <!--          <el-col :span="12">-->
              <!--            <el-form-item label="收款日期" prop="skTime">-->
              <!--              <el-date-picker clearable size="small" style="width: 100%"-->
              <!--                              v-model="form.skTime"-->
              <!--                              type="date"-->
              <!--                              value-format="yyyy-MM-dd"-->
              <!--                              placeholder="选择收款日期">-->
              <!--              </el-date-picker>-->
              <!--            </el-form-item>-->
              <!--          </el-col>-->
              <el-col :span="12">
                <el-form-item label="承兑" prop="accept">
                  <el-input v-model="form.accept" @change="toggleSelection" placeholder="请输入承兑" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="扣罚" prop="punish">
                  <el-input v-model="form.punish" @change="toggleSelection" placeholder="请输入扣罚" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="其他扣罚" prop="otherP">
                  <el-input v-model="form.otherP" @change="toggleSelection" placeholder="请输入其他扣罚" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="扣罚说明" prop="otherN">
                  <el-input type="textarea" v-model="form.otherN" placeholder="请输入扣罚说明" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总计收款(元)" prop="yftotalPrice">
                  <el-input disabled v-model="form.yftotalPrice" placeholder="请输入总计收款" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="已预收金额" prop="yfPrice">
                  <el-input disabled v-model="form.yfPrice" placeholder="请输入已预收金额" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际应收金额" prop="sjPrice">
                  <el-input v-model="form.sjPrice" placeholder="请输入实际应收金额" />
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
          <div v-if="this.form.skType == '预收款'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="预收金额(元)" prop="yfPrice">
                  <el-input v-model="form.yfPrice" placeholder="请输入预收金额" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收款日期" prop="skTime">
                  <el-date-picker clearable size="small" style="width: 100%" v-model="form.skTime" type="date"
                    value-format="yyyy-MM-dd" placeholder="选择收款日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="isLook == 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款日期" prop="skTime">
                <el-date-picker clearable size="small" style="width: 100%" v-model="form.skTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择收款日期">
                </el-date-picker>
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
              <td class="table-td-title detail">收款类型</td>
              <td class="table-td-content">
                {{ printData.skType }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">收款方式</td>
              <td class="table-td-content">
                {{ printData.skWay }}
              </td>
              <td class="table-td-title detail">终端客户</td>
              <td class="table-td-content" colspan="3">
                {{ printData.tName }}
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
                {{ item.grnNumber }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ item.gryRz }}
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
              <td class="title" colspan="6">收款信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">收款总额(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.skTprice) }}
              </td>
              <td class="table-td-title detail">税款(元)</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.tax) }}
              </td>
              <td class="table-td-title detail">收款单价</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.skPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">收款日期</td>
              <td class="table-td-content">
                {{ parseTime(printData.skTime, "{y}-{m}-{d}") }}
              </td>
              <td class="table-td-title detail">承兑</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.accept) }}
              </td>
              <td class="table-td-title detail">扣罚</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.punish) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">其他扣罚</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.otherP) }}
              </td>
              <td class="table-td-title detail">其他扣罚说明</td>
              <td class="table-td-content">
                {{ printData.otherN }}
              </td>
              <td class="table-td-title detail">总计收款</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yftotalPrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">已收取金额</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.yfPrice) }}
              </td>
              <td class="table-td-title detail">实际应收金额</td>
              <td class="table-td-content" colspan="3">
                {{ $options.filters.moneyFilter(printData.sjPrice) }}
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
          <approval-print :typeId="6" :stId="apyamentId"></approval-print>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSk,
  getSk,
  delSk,
  addSk,
  updateSk,
  getStList,
  getGryList,
  getContract,
  listForBus,
  listForPro,
} from "@/api/project/sk";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList, getApprovalType } from "@/api/approve";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "Sk",
  props: {
    "stIdd": {
      type: String
    },
    "projectIdd": {
      type: String
    },
    "isQuote": {
      type: Boolean,
      default: false
    }
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
    // 四位小数点验证
    const validatePrice5 = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,4})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (value != 0 && (value == null || value == "")) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
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
      // 审批状态字典
      stateOptions: [],
      // 日期范围
      dateRange: [],
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
      // 收款表格数据
      skList: [],
      // 项目集合
      projectOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        skType: null,
        createTime: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务名称", trigger: "blur" }],
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        skType: [
          { required: true, message: "请选择收款类型", trigger: "blur" },
        ],
        skWay: [{ required: true, message: "请选择收款方式", trigger: "blur" }],
        rzPrice: [
          { required: true, validator: validatePrice5, trigger: "blur" },
        ],
        skTprice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        skPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        tax: [{ required: true, validator: validatePrice, trigger: "blur" }],
        skTime: [
          { required: true, message: "请选择收款日期", trigger: "blur" },
        ],
        accept: [{ validator: validatePrice3, trigger: "blur" }],
        punish: [{ validator: validatePrice3, trigger: "blur" }],
        otherP: [{ validator: validatePrice3, trigger: "blur" }],
        otherN: [{ message: "其他扣罚说明", trigger: "blur" }],
        yftotalPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        yfPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        sjPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
      },
      // 打印
      printReviewVisible: false,
      printData: {},
      isDisabled: false,
      listForBusArr: [],
      listForProArr: [],
      apyamentId:'',//子组件id
      approvalType: {}
    };
  },
  created() {
    if (this.isQuote) {
      this.queryParams.stId = parseInt(this.stIdd)
      this.queryParams.projectId = parseInt(this.projectIdd)
    }
    this.getList();
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
    });
    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let skId = this.$route.params.skId;
      let row = { skId: skId };
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
    /** 查询收款列表 */
    getList() {
      this.loading = true;
      listSk(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.skList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      this.loadProjectForCombobox();
    },
     loadProjectForCombobox() {
      this.listForProArr = []
      listProjectForCombobox().then((response) => {
        this.listForProArr = response.data
      })
    },
    loadBusinessForCombobox(projectId) {
      this.listForBusArr = []
      listBusinessForCombobox({ projectId }).then((response) => {
        this.listForBusArr = response.data
        if (this.isQuote) {
          this.changeSt(this.queryParams.stId)
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        skId: null,
        stId: null,
        stName: null,
        skType: null,
        skWay: null,
        rzPrice: null,
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
        skTprice: null,
        skPrice: null,
        tax: null,
        skTime: null,
        accept: null,
        punish: null,
        otherP: null,
        otherN: null,
        yftotalPrice: null,
        yfPrice: null,
        sjPrice: null,
        state: null,
        createBy: null,
        createTime: null,
        gryList: [],
        fileList: [],
        projectId: null,
        projectName: null,
        serialNo: null
      };
      this.resetForm("form");
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
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
      this.ids = selection.map((item) => item.skId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType({ approvalType: '6' }).then((response) => {
        this.reset();
        if (this.isQuote) {
          this.form.projectId = this.queryParams.projectId
          this.changeProject(this.queryParams.projectId)
          this.form.stId = this.queryParams.stId
        }
        (this.tablegryData = []),
          (this.tableselData = []),
          (this.tableybData = []),
          (this.fileList = []);
        this.form.skType = "收款";
        this.form.skWay = "吨";
        this.form.skTprice = 0;
        this.form.yftotalPrice = 0;
        this.form.tax = 0;
        this.form.tweight = 0;
        this.form.prz = 0;
        this.form.skPrice = 0;
        this.form.yfPrice = 0;
        this.isLook = 1;
        this.open = true;
        this.title = "添加收款";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const skId = row.skId || this.ids;
      getSk(skId).then((response) => {
        this.form = response.data;
        this.tableselData = response.data.selnyList;
        this.fileList = this.form.fileList;
        this.isLook = 1;
        this.open = true;
        this.title = "修改收款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      (this.tablegryData = []),
        (this.ableselData = []),
        (this.tableybData = []),
        (this.fileList = []);
      const skId = row.skId || this.ids;
      this.$router.push("/sk/look/" + skId);
    },
    /** 修改按钮操作 */
    handleUpdateSkTime(row) {
      this.reset();
      const skId = row.skId || this.ids;
      getSk(skId).then((response) => {
        this.form = response.data;
        this.isLook = 4;
        this.open = true;
        this.title = "修改收款";
      });
    },
    /** 修改按钮操作 */
    handleUpdateSkState(row) {
      this.reset();
      const skIds = row.skId || this.ids;
      let self = this;
      this.$confirm("是否确定完成收款?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        self.submitFormSk(skIds);
      });
    },
    submitFormSk(id) {
      getSk(id).then((response) => {
        this.form = response.data;
        this.form.skState = "已收款";
        updateSk(this.form).then((response) => {
          this.msgSuccess("已款成功");
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
          if (this.isLook != 4) {
            if (this.form.skType == "收款") {
              if (this.tableselData.length < 1) {
                this.msgError("请选择出库单");
                this.isDisabled = false;
                return;
              }
              this.form.gryList = this.tableselData;
            }
          } else {
          }
          if (this.form.skId != null) {
            updateSk(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSk(this.form).then((response) => {
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
      const skIds = row.skId || this.ids;
      this.$confirm("是否确认删除收款?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSk(skIds);
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
        "project/sk/export",
        {
          ...this.queryParams,
        },
        `project_sk.xlsx`
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
      this.listForBusArr = []
      this.form.stId = ''
      this.form.stName = ''
      this.form.serialNo = ''
      if (projectId) {
        this.loadBusinessForCombobox(projectId);
      }
    },
    changeSt(stId) {
      let businessFind = this.listForBusArr.filter(x => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        let obj = businessFind[0];
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
        this.tableybData = [];
        this.form.stName = obj.stName;
        this.form.serialNo = obj.serialNo;
        this.form.tId = null;
        this.form.tName = null;
        this.$set(this.form, "number", obj.number);
        //查询煤炭销售合同
        let c2 = { stId: this.form.stId, type: "2" };
        getContract(c2).then((response) => {
          if (response.data != null) {
            //预付单价 吨的预付单价
            this.form.skPrice = parseFloat(response.data.price).toFixed(2);
          }
        });

        this.form.tId = obj.terminalId;
        this.form.tName = obj.tName;

        //获取预收款
        if (this.form.skType == "收款") {
          this.form.yfPrice = obj.tqsk;
        }
        this.tableselData = [];
        let data = { stId: obj.stId, skState: "1" };
        getGryList(data).then((response) => {
          this.tablegryData = response.rows;
        });

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
      this.tablegryData.map((item) => {
        if (item.gryId === obj.row.gryId) {
          this.$refs.singleTable1.toggleRowSelection(item, false);
        }
      });
      this.jsta();
      this.jsdj();
      this.jspay();
    },
    //确认数据
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
      this.jsdj();
      this.jspay();
    },

    //计算合计重量平均热值
    jsta() {
      let tgn = 0;
      let tgr = 0;
      if (this.tableybData.length > 0) {
        for (let i = 0; i < this.tableybData.length; i++) {
          tgn += this.tableybData[i].grnNumber;
          tgr += this.tableybData[i].gryRz;
        }
        this.form.tweight = tgn;
        this.form.prz = (tgr / this.tableybData.length).toFixed(2);
      } else {
        this.form.tweight = tgn.toFixed(2);
        this.form.prz = tgr.toFixed(2);
      }
    },
    //计算单价
    jsdj() {
      let re = 0;
      if (this.form.rewardp != null && this.form.rewardp != "") {
        re = this.form.rewardp;
      }
      if (this.form.skWay == "吨") {
        this.form.skPrice = (
          parseFloat(this.form.skPrice) + parseFloat(re)
        ).toFixed(2);

        let tw = 0;
        let ep = 0;
        if (this.form.tweight != null && this.form.tweight != "") {
          tw = this.form.tweight;
        }
        if (this.form.skPrice != null && this.form.skPrice != "") {
          ep = this.form.skPrice;
        }
        //收款总额 单价*重量
        this.form.skTprice = (tw * ep).toFixed(2);
        //计算税款
        this.form.tax = (((tw * ep) / 1.13) * 0.13).toFixed(2);

        this.jspay();
      } else if (this.form.skWay == "热值") {
        console.log(this.form.rzPrice + "--" + this.form.averageRz);
        if (
          this.form.rzPrice != null &&
          this.form.rzPrice != "" &&
          this.form.prz != null &&
          this.form.prz != ""
        ) {
          this.form.skPrice = (
            this.form.rzPrice * this.form.prz +
            parseFloat(re)
          ).toFixed(2);

          let tw = 0;
          let ep = 0;
          if (this.form.tweight != null && this.form.tweight != "") {
            tw = this.form.tweight;
          }
          if (this.form.skPrice != null && this.form.skPrice != "") {
            ep = this.form.skPrice;
          }
          //收款总额 单价*重量
          this.form.skTprice = (tw * ep).toFixed(2);
          //计算税款
          this.form.tax = (((tw * ep) / 1.13) * 0.13).toFixed(2);
        } else {
          this.form.skPrice = 0;

          let tw = 0;
          let ep = 0;
          if (this.form.tweight != null && this.form.tweight != "") {
            tw = this.form.tweight;
          }
          if (this.form.skPrice != null && this.form.skPrice != "") {
            ep = this.form.skPrice;
          }
          //收款总额 单价*重量
          this.form.skTprice = (tw * ep).toFixed(2);
          //计算税款
          this.form.tax = (((tw * ep) / 1.13) * 0.13).toFixed(2);
        }
        this.jspay();
      } else {
        this.form.skPrice = 0;
        this.jspay();
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
      // this.form.skPrice=this.form.skPrice+this.form.rewardp;
      this.jsdj();
      this.jspay();
    },

    //计算实际收款
    jspay() {
      // let tw=0;
      // let ep=0
      // if(this.form.tweight!=null && this.form.tweight!=''){
      //   tw=this.form.tweight;
      // }
      // if(this.form.skPrice!=null && this.form.skPrice!='') {
      //   ep = this.form.skPrice;
      // }
      // //收款总额 单价*重量
      // this.form.skTprice=(tw*ep).toFixed(2);
      // //计算税款
      // this.form.tax=(tw*ep/1.13*0.13).toFixed(2);

      let sktprice = 0;
      if (this.form.skTprice != null && this.form.accept != "") {
        sktprice = this.form.skTprice;
      }
      //计算税款
      this.form.tax = ((sktprice / 1.13) * 0.13).toFixed(2);

      //总计收款
      let ac = 0;
      let pu = 0;
      let ot = 0;
      if (this.form.accept != null && this.form.accept != "") {
        ac = this.form.accept;
      }
      if (this.form.punish != null && this.form.punish != "") {
        pu = this.form.punish;
      }
      if (this.form.otherP != null && this.form.otherP != "") {
        ot = this.form.otherP;
      }
      this.form.yftotalPrice = (this.form.skTprice - ac - pu - ot).toFixed(2);
      let pt = 0;
      let pp = 0;
      if (this.form.yftotalPrice != null && this.form.yftotalPrice != "") {
        pt = this.form.yftotalPrice;
      }
      if (this.form.yfPrice != null && this.form.yfPrice != "") {
        pp = this.form.yfPrice;
      }
      let sp = pt - pp;
      if (sp >= 0) {
        this.form.sjPrice = sp.toFixed(2);
      } else {
        this.form.sjPrice = 0;
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
      this.apyamentId = row.skId
      this.printData = {};
      await getSk(row.skId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.gryList = response.data.selnyList;
        this.printData.printType = "预估收款";
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
