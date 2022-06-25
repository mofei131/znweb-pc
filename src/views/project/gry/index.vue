<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>
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
      <el-form-item label="项目名称" prop="projectId">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    
      <el-form-item label="批次" prop="batch">
        <el-input
          v-model="queryParams.batch"
          placeholder="请输入批次"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="业务名称" prop="stId">
            <el-input
          v-model="queryParams.stName"
          placeholder="请输入业务名称"
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
          v-hasPermi="['project:gry:add']"
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
      <!--          v-hasPermi="['project:gry:edit']"-->
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
      <!--          v-hasPermi="['project:gry:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:gry:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="gryList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="货品名称" align="center" prop="name" />
      <el-table-column label="出库重量(吨)" align="center" prop="grnNumber">
        <template slot-scope="scope">
          {{
            Number(scope.row.grnNumber)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="出库热值(Kcal)" align="center" prop="gryRz" />
      <el-table-column label="运输方式" align="center" prop="transportType" />
      <el-table-column label="物流公司" align="center" prop="wlCompany" />
      <el-table-column label="车数" align="center" prop="carNumber" />
      <el-table-column label="批次" align="center" prop="batch" />
      <el-table-column
        label="到货日期"
        align="center"
        prop="okTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.okTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货值单价(元)" align="center" prop="valuePrice">
        <template slot-scope="scope">
          {{
            Number(scope.row.valuePrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="货值总额(元)" align="center" prop="valueTprice">
        <template slot-scope="scope">
          {{
            Number(scope.row.valueTprice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
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
        label="付款状态"
        align="center"
        prop="zzpayState"
        :formatter="aapaystateFormat"
      />
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
            v-hasPermi="['project:gry:edit']"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.state == '4' && scope.row.yfState == '1'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:gry:edit']"
            >编辑</el-button
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
          <!--            v-hasPermi="['project:gry:remove']"-->
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

    <!-- 添加或修改出库单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="80%"
      append-to-body
      @opened="handleOpen"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectId">
              <el-select
                filterable
                value-key="projectId"
                @change="changeProject"
                v-model="form.projectId"
                placeholder="请选择项目名称"
                style="width: 100%"
              >
                <el-option
                  v-for="pro in listForProArr"
                  :key="pro.projectId"
                  :label="pro.projectName"
                  :value="pro"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 业务 -->
          <el-col :span="12">
            <el-form-item label="业务名称" prop="stId">
              <el-select
                filterable
                value-key="stId"
                @change="changeSt"
                v-model="form.stId"
                placeholder="请选择业务名称"
                style="width: 100%"
              >
                <el-option
                  v-for="obj in listForBusArr"
                  :key="obj.stId"
                  :label="obj.stName"
                  :value="obj"
                ></el-option>
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
            <el-form-item label="出库重量(吨)" prop="grnNumber">
              <el-input
                v-model="form.grnNumber"
                placeholder="请输入出库重量"
                @change="calculate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到货日期" prop="okTime">
              <el-date-picker
                clearable
                size="small"
                style="width: 100%"
                v-model="form.okTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择到货日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库热值(Kcal/吨)" prop="gryRz">
              <el-input v-model="form.gryRz" placeholder="请输入出库热值" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="chargemType != 1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="固定差价/吨(元)" prop="chargemGd">
                <el-input
                  v-model="form.chargemGd"
                  placeholder="请输入固定差价"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        选择入库单-->
        <div v-if="isLook != 3">
          <el-popover
            placement="bottom-start"
            width="100%"
            fit
            v-model="visible"
            popper-class="area_popper"
          >
            <el-button
              type="primary"
              slot="reference"
              style="margin-bottom: 30px"
              >选择入库单</el-button
            >
            <el-table
              ref="singleTable"
              :data="tableData"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%"
            >
              <el-table-column property="name" label="货品名称">
              </el-table-column>
              <el-table-column property="grnNumber" label="入库重量（吨）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.grnNumber)
                      .toFixed(3)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="grnRz" label="热值（kcal）">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式">
              </el-table-column>
              <el-table-column property="wlCompany" label="物流公司">
              </el-table-column>
              <el-table-column property="carNumber" label="车数">
              </el-table-column>
              <el-table-column property="batch" label="批次"> </el-table-column>
              <el-table-column property="deliveryTime" label="发货日期">
              </el-table-column>
              <el-table-column property="valuePrice" label="货值单价（元）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.valuePrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="valueTprice" label="货值总额（元）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.valueTprice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </div>
        <!--        已选择的入库单-->
        <el-row>
          <el-col :span="24">
            <el-table
              ref="singleTable"
              :data="tableselData"
              fit
              style="margin-bottom: 30px"
            >
              <el-table-column property="name" label="已选货品名称">
              </el-table-column>
              <el-table-column property="grnNumber" label="入库重量（吨）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.grnNumber)
                      .toFixed(3)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="grnRz" label="热值（kcal）">
              </el-table-column>
              <el-table-column property="transportType" label="运输方式">
              </el-table-column>
              <el-table-column property="wlCompany" label="物流公司">
              </el-table-column>
              <el-table-column property="carNumber" label="车数">
              </el-table-column>
              <el-table-column property="batch" label="批次"> </el-table-column>
              <el-table-column property="deliveryTime" label="发货日期">
              </el-table-column>
              <el-table-column property="valuePrice" label="货值单价（元）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.valuePrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
              <el-table-column property="valueTprice" label="货值总额（元）">
                <template slot-scope="scope">
                  {{
                    Number(scope.row.valueTprice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--        合计-->
        <div v-if="isLook != 3">
          <el-row>
            <el-col :span="6">
              <el-form-item label="合计重量" prop="totalWeight">
                <span style="color: red">{{
                  $options.filters.moneyFilter(form.totalWeight)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平均热值" prop="averageRz">
                <span style="color: red">{{ form.averageRz }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        差值-->
        <div v-if="isLook == 3">
          <el-row>
            <el-col :span="5">
              <el-form-item label="重量差">
                <span style="color: red">{{
                  $options.filters.weightFilter(zlc)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="热值差" prop="averageRz">
                <span style="color: red">{{ rzc }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="单价差" prop="averageRz">
                <span style="color: red">{{
                  $options.filters.moneyFilter(djc)
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="总额差" prop="averageRz">
                <span style="color: red">{{
                  $options.filters.moneyFilter(zec)
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--        煤炭质量-->
        <el-form-item label="煤炭质量"> </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-table :data="tabledatas" fit style="margin-bottom: 30px">
              <el-table-column label="水分(%)">
                <template slot-scope="scope" prop="coalSf">
                  <el-input v-model="form.coalSf" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="内水(%)">
                <template slot-scope="scope" prop="coalNs">
                  <el-input v-model="form.coalNs" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="灰份(%)">
                <el-table-column label="Aad">
                  <template slot-scope="scope" prop="coalAad">
                    <el-input v-model="form.coalAad" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column label="ad">
                  <template slot-scope="scope" prop="coalAd">
                    <el-input v-model="form.coalAd" placeholder="请输入" />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="挥发份(%)">
                <el-table-column label="Vda">
                  <template slot-scope="scope" prop="coalVda">
                    <el-input v-model="form.coalVda" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column label="Vdaf">
                  <template slot-scope="scope" prop="coalVdae">
                    <el-input v-model="form.coalVdae" placeholder="请输入" />
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="灰熔点(℃)">
                <template slot-scope="scope" prop="coalHrd">
                  <el-input v-model="form.coalHrd" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="固定碳(%)">
                <template slot-scope="scope" prop="coalGdt">
                  <el-input v-model="form.coalGdt" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="含硫量(%)">
                <template slot-scope="scope" prop="coalHll">
                  <el-input v-model="form.coalHll" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column label="热值(%)">
                <el-table-column label="Qgrad">
                  <template slot-scope="scope" prop="coalQgrad">
                    <el-input v-model="form.coalQgrad" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column label="Qntar">
                  <template slot-scope="scope" prop="coalQntar">
                    <el-input v-model="form.coalQntar" placeholder="请输入" />
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--        奖惩-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="奖惩(元)">
              <span
                >水分：<span style="color: red" v-text="form.jc1"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >内水：<span style="color: red" v-text="form.jc2"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >灰份Aad：<span style="color: red" v-text="form.jc3"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >灰份ad：<span style="color: red" v-text="form.jc10"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >挥发份Vda：<span style="color: red" v-text="form.jc4"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >挥发份Vdaf：<span style="color: red" v-text="form.jc11"
                  >0.00</span
                ></span
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="">
              <span
                >灰熔点：<span style="color: red" v-text="form.jc5"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >固定碳：<span style="color: red" v-text="form.jc6"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >含硫量：<span style="color: red" v-text="form.jc7"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >热值Qgr,ad：<span style="color: red" v-text="form.jc8"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >热值Qnt,ar：<span style="color: red" v-text="form.jc9"
                  >0.00</span
                ></span
              >
              <span style="margin-left: 20px"
                >热值Kcal：<span style="color: red" v-text="form.jc12"
                  >0.00</span
                ></span
              >
              <el-button
                style="margin-left: 20px"
                type="primary"
                @click="jsjc"
                v-if="isLook != 3"
                >奖惩计算</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="货值单价(元)" prop="valuePrice">
              <el-input
                type="number"
                v-model="form.valuePrice"
                placeholder="请输入货值单价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货值总价(元)" prop="valueTprice">
              <el-input
                type="number"
                v-model="form.valueTprice"
                placeholder="请输入货值总价"
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
        <el-button v-if="isLook != 3" type="primary" @click="submitForm"
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
              <td class="title" colspan="6">出库信息</td>
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
              <td class="table-td-title detail">出库重量</td>
              <td class="table-td-content">
                {{ $options.filters.weightFilter(printData.grnNumber) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">到货日期</td>
              <td class="table-td-content">
                {{ parseTime(printData.okTime, "{y}-{m}-{d}") }}
              </td>
              <td class="table-td-title detail">出库热值</td>
              <td class="table-td-content">
                {{ printData.gryRz }}
              </td>
              <td class="table-td-title detail">货值单价</td>
              <td class="table-td-content">
                {{ $options.filters.moneyFilter(printData.valuePrice) }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">货值总额</td>
              <td class="table-td-content" colspan="5">
                {{ $options.filters.moneyFilter(printData.valueTprice) }}
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
          <table border="1" width="100%">
            <tr>
              <td class="table-td-title detail" rowspan="2">水分(%)</td>
              <td class="table-td-title detail" rowspan="2">内水(%)</td>
              <td class="table-td-title detail" colspan="2">灰份(%)</td>
              <td class="table-td-title detail" colspan="2">挥发份(%)</td>
              <td class="table-td-title detail" rowspan="2">灰熔点(℃)</td>
              <td class="table-td-title detail" rowspan="2">固定碳(%)</td>
              <td class="table-td-title detail" rowspan="2">含硫量(%)</td>
              <td class="table-td-title detail" colspan="2">热值(%)</td>
            </tr>
            <tr>
              <td class="table-td-title detail">Aad</td>
              <td class="table-td-title detail">ad</td>
              <td class="table-td-title detail">Vda</td>
              <td class="table-td-title detail">Vdaf</td>
              <td class="table-td-title detail">Qgr,ad</td>
              <td class="table-td-title detail">Qnt,ar</td>
            </tr>
            <tr>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalSf }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalNs }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalAad }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalAd }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalVda }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalVdae }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalHrd }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalGdt }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalHll }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalQgrad }}
              </td>
              <td class="table-td-content" style="text-align: center">
                {{ printData.coalQntar }}
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
              <td class="title" colspan="10">入库单信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">已选货品名称</td>
              <td class="table-td-title detail">入库重量(吨)</td>
              <td class="table-td-title detail">热值(Kcal)</td>
              <td class="table-td-title detail">运输方式</td>
              <td class="table-td-title detail">物流公司</td>
              <td class="table-td-title detail">车数</td>
              <td class="table-td-title detail">批次</td>
              <td class="table-td-title detail">发货日期</td>
              <td class="table-td-title detail">货值单价(元)</td>
              <td class="table-td-title detail">货值总额(元)</td>
            </tr>
            <tr v-for="(item, idx) in printData.grnList" :key="idx">
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
            <tr>
              <td class="table-td-title detail" colspan="2">重量差</td>
              <td class="table-td-content" colspan="3">
                {{ $options.filters.weightFilter(printData.zlc) }}
              </td>
              <td class="table-td-title detail" colspan="2">热值差</td>
              <td class="table-td-content" colspan="3">
                {{ printData.rzc }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail" colspan="2">单价差</td>
              <td class="table-td-content" colspan="3">
                {{ $options.filters.moneyFilter(printData.djc) }}
              </td>
              <td class="table-td-title detail" colspan="2">总额差</td>
              <td class="table-td-content" colspan="3">
                {{ $options.filters.moneyFilter(printData.zec) }}
              </td>
            </tr>
          </table>
          <!--审批流程-->
          <approval-print :typeId="11" :stId="apyamentId" ></approval-print>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGry,
  getGry,
  delGry,
  addGry,
  updateGry,
  getStList,
  getGrnList,
  getContract,
  getJsjc,
  listForBus,
  listForPro,
} from "@/api/project/gry";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";

export default {
  name: "Gry",
  data() {
    const validatePrice = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!value && value != 0) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式"));
      } else {
        callback();
      }
    };
    const validatePrice2 = (rule, value, callback) => {
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/;
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!value) {
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
      //入库单集合
      tableData: [],
      //选中入库单集合
      tableselData: [],
      //煤炭质量
      tabledatas: [{ show: true }],
      //选择框状态
      visible: false,
      //固定差价状态
      chargemType: 1,
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
      // 出库单表格数据
      gryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核状态字典
      stateOptions: [],
      //项目集合
      stOptions: [],
      projectOptions: [],
      // 日期范围
      dateRange: [],
      zlc: 0,
      rzc: 0,
      djc: 0,
      zec: 0,
      //运输方式集合
      transportTypeOptions: [
        { key: "火运", label: "火运" },
        { key: "汽运", label: "汽运" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务名称", trigger: "blur" }],
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        grnNumber: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        okTime: [
          { required: true, message: "请选择到货日期", trigger: "blur" },
        ],
        gryRz: [{ required: true, validator: validatePrice, trigger: "blur" }],
        wlCompany: [
          { required: true, message: "物流公司不能为空", trigger: "blur" },
        ],
        transportType: [
          { required: true, message: "请选择运输方式", trigger: "blur" },
        ],
        carNumber: [
          { required: true, message: "车数不能为空", trigger: "blur" },
        ],
        batch: [{ required: true, message: "批次不能为空", trigger: "blur" }],
        valuePrice: [
          // { required: true, validator: validatePrice, trigger: "blur" }
        ],
        valueTprice: [
          { required: true, message: "请输入货值总价", trigger: "blur" },
        ],
        coalSf: [{ required: true, validator: validatePrice, trigger: "blur" }],
        coalNs: [{ required: true, validator: validatePrice, trigger: "blur" }],
        coalAad: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalAd: [{ required: true, validator: validatePrice, trigger: "blur" }],
        coalVda: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalVdae: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalHrd: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalHll: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalQgrad: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        coalQntar: [
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
      let gryId = this.$route.params.gryId;
      let row = { gryId: gryId };
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
    
    /** 查询出库单列表 */
    getList() {
      this.loading = true;
      listGry(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.gryList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
      getStList().then((response) => {
        this.stOptions = response.rows;
      });
      // 业务
      listForBus().then((response)=> {
        this.stOptions = response.data
        this.listForBusArr = response.data
      })
      // 项目
      listForPro().then((response) => {
        this.stOptions = response.data
        this.listForProArr = response.data
      })
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    aapaystateFormat(row, column) {
      if (row.zzpayState == "1") {
        if (row.yfState == "1") {
          return "未付款";
        } else {
          return "已经二次付款";
        }
      } else if (row.zzpayState == "2") {
        return "已最终付款";
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
        gryId: null,
        stId: null,
        stId2: null,
        projectId: null,
        stName: null,
        wlCompany: null,
        name: null,
        grnNumber: null,
        okTime: null,
        gryRz: null,
        transportType: null,
        carNumber: null,
        batch: null,
        basePrice: null,
        coalSf: 0,
        coalNs: 0,
        coalAad: 0,
        coalAd: 0,
        coalVda: 0,
        coalVdae: 0,
        coalHrd: 0,
        coalGdt: 0,
        coalHll: 0,
        coalQgrad: 0,
        coalQntar: 0,
        rewardp: 0,
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
        valuePrice: null,
        valueTprice: null,
        state: null,
        createBy: null,
        createTime: null,
        chargemGd: null,
        grnList: [],
        fileList: [],
        projectId: null,
        projectIdOld: null,
        projectName: null,
        serialNo: null
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
      this.ids = selection.map((item) => item.gryId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.totalWeight = 0;
      this.form.averageRz = 0;
      this.form.valuePrice = 0;
      this.form.coalSf = 0;
      this.form.coalNs = 0;
      this.form.coalAad = 0;
      this.form.coalAd = 0;
      this.form.coalVda = 0;
      this.form.coalVdae = 0;
      this.form.coalHrd = 0;
      this.form.coalGdt = 0;
      this.form.coalHll = 0;
      this.form.coalQgrad = 0;
      this.form.coalQntar = 0;
      this.form.rewardp = 0;

      this.tableData = [];
      this.tableselData = [];
      this.fileList = [];

      this.isLook = 1;
      this.open = true;
      this.title = "添加出库单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.tableData = [];
      this.tableselData = [];
      this.fileList = [];
      const gryId = row.gryId || this.ids;
      getGry(gryId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.fileList = this.form.fileList;
        this.tableselData = response.data.grnList;

        this.zlc = response.data.grnNumber - this.tableselData[0].grnNumber;
        this.rzc = response.data.gryRz - this.tableselData[0].grnRz;
        this.djc = response.data.valuePrice - this.tableselData[0].valuePrice;
        this.zec = response.data.valueTprice - this.tableselData[0].valueTprice;

        this.isLook = 1;
        this.open = true;
        this.title = "修改出库单";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tableData = [];
      this.tableselData = [];
      this.fileList = [];
      const gryId = row.gryId || this.ids;
      this.$router.push("/gry/look/" + gryId);
    },
    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.tableselData.length < 1) {
            this.msgError("请选择入库单");
            this.isDisabled = false;
            return;
          }
          this.form.stId = this.form.stId2;
          this.form.projectId = this.form.projectIdOld
          this.form.grnList = this.tableselData;
          if (this.form.gryId != null) {
            updateGry(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGry(this.form).then((response) => {
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
      const gryIds = row.gryId || this.ids;
      this.$confirm("是否确认删除出库单?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delGry(gryIds);
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
        "project/gry/export",
        {
          ...this.queryParams,
        },
        `project_gry.xlsx`
      );
    },

    // 图片上传
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

    // 业务开始
    // 选择项目
    changeProject(pro) {
      this.form.stName = pro.stName
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
      this.form.serialNo = obj.serialNo
      this.form.stId2 = obj.stId;
      this.form.stName = obj.stName;
      this.$set(this.form, "number", obj.number);
      //赋值固定差价
      if (obj.chargemType == "2" || obj.chargemType == "3") {
        this.chargemType = 2;
        this.form.chargemGd = obj.chargemGd;
      } else {
        this.chargemType = 1;
      }
      //赋值入库单集合
      this.selectGrn();
      //赋值基准单价
      getContract(obj.stId).then((response) => {
        if (response.data != null) {
          //基准单价
          this.form.basePrice = response.data.price;
          //货值单价  没有计算奖惩
          this.form.valuePrice = response.data.price;

          let vp = 0;
          if (this.form.valuePrice != null && this.form.valuePrice != "") {
            vp = this.form.valuePrice;
          }
          let gn = 0;
          if (this.form.totalWeight != null && this.form.totalWeight != "") {
            gn = this.form.totalWeight;
          }
          this.form.valueTprice = (gn * vp).toFixed(2);
        } else {
          this.form.basePrice = 0;
          this.form.valuePrice = 0;
          this.form.valueTprice = 0;
        }
      });
    },
    //加载入库单
    selectGrn() {
      this.tableData = [];
      if (this.form.stId2 != null) {
        const stid = this.form.stId2;
        getGrnList(stid).then((response) => {
          this.tableselData = [];
          this.form.totalWeight = 0;
          this.form.averageRz = 0;
          if (response.rows.length > 0) {
            this.tableData = response.rows;
          }
        });
      } else {
        this.msgError("请选择项目");
      }
    },
    //选择入库单
    handleCurrentChange(val) {
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
      this.tableselData = [];
      this.tableselData.push(val);

      let tgn = 0;
      let tgr = 0;

      if (val == null) {
        this.form.totalWeight = tgn;
        this.form.averageRz = tgr;
        return;
      }
      if (val.grnNumber != null) {
        tgn = val.grnNumber;
      }
      if (val.grnRz != null) {
        tgr = val.grnRz;
      }
      this.form.totalWeight = tgn;
      this.form.averageRz = tgr;

      this.form.name = val.name;
      this.form.wlCompany = val.wlCompany;
      this.form.carNumber = val.carNumber;
      this.form.batch = val.batch;
      this.form.transportType = val.transportType;
      this.calculate();
      this.visible = false;
    },

    // 计算奖惩
    jsjc() {
      if (this.form.stId2 == null || this.form.stId2 == "") {
        this.msgError("请选择项目");
        this.form.prepaidPrice = 0;
        return;
      }
      let data = {};
      data.stId = this.form.stId2;
      if (
        (this.form.gryRz != null && this.form.gryRz != "") ||
        this.form.gryRz == 0
      ) {
        let kcal = this.form.gryRz;
        data.kcal = kcal;
      }
      if (
        (this.form.coalQgrad != null && this.form.coalQgrad != "") ||
        this.form.coalQgrad == 0
      ) {
        let qgrad = this.form.coalQgrad;
        data.qgrad = qgrad;
      }
      if (
        (this.form.coalQntar != null && this.form.coalQntar != "") ||
        this.form.coalQntar == 0
      ) {
        let qntar = this.form.coalQntar;
        data.qntar = qntar;
      }
      if (
        (this.form.coalHll != null && this.form.coalHll != "") ||
        this.form.coalHll == 0
      ) {
        let hll = this.form.coalHll;
        data.hll = hll;
      }
      if (
        (this.form.coalGdt != null && this.form.coalGdt != "") ||
        this.form.coalGdt == 0
      ) {
        let gdt = this.form.coalGdt;
        data.gdt = gdt;
      }
      if (
        (this.form.coalHrd != null && this.form.coalHrd != "") ||
        this.form.coalHrd == 0
      ) {
        let hrd = this.form.coalHrd;
        data.hrd = hrd;
      }
      if (
        (this.form.coalVda != null && this.form.coalVda != "") ||
        this.form.coalVda == 0
      ) {
        let vda = this.form.coalVda;
        data.vda = vda;
      }
      if (
        (this.form.coalVdae != null && this.form.coalVdae != "") ||
        this.form.coalVdae == 0
      ) {
        let vdae = this.form.coalVdae;
        data.vdae = vdae;
      }
      if (
        (this.form.coalAd != null && this.form.coalAd != "") ||
        this.form.coalAd == 0
      ) {
        let ad = this.form.coalAd;
        data.ad = ad;
      }
      if (
        (this.form.coalAad != null && this.form.coalAad != "") ||
        this.form.coalAad == 0
      ) {
        let aad = this.form.coalAad;
        data.aad = aad;
      }
      if (
        (this.form.coalSf != null && this.form.coalSf != "") ||
        this.form.coalSf == 0
      ) {
        let sf = this.form.coalSf;
        data.sf = sf;
      }
      if (
        (this.form.coalNs != null && this.form.coalNs != "") ||
        this.form.coalNs == 0
      ) {
        let ns = this.form.coalNs;
        data.ns = ns;
      }
      //计算奖惩
      let rewardsp = 0;
      console.log(data);
      getJsjc(data).then((response) => {
        let obj = response.data;

        this.form.jc1 = obj.sf.toFixed(2);
        this.form.jc2 = obj.ns.toFixed(2);
        this.form.jc3 = obj.aad.toFixed(2);
        this.form.jc4 = obj.vda.toFixed(2);
        this.form.jc5 = obj.hrd.toFixed(2);
        this.form.jc6 = obj.gdt.toFixed(2);
        this.form.jc7 = obj.hll.toFixed(2);
        this.form.jc8 = obj.qgrad.toFixed(2);
        this.form.jc9 = obj.qntar.toFixed(2);
        this.form.jc10 = obj.ad.toFixed(2);
        this.form.jc11 = obj.vdae.toFixed(2);
        this.form.jc12 = obj.kcal.toFixed(2);
        if (obj.sf < 0) {
          rewardsp += obj.sf;
        }
        if (obj.ns < 0) {
          rewardsp += obj.ns;
        }
        if (obj.aad < 0) {
          rewardsp += obj.aad;
        }
        if (obj.ad < 0) {
          rewardsp += obj.ad;
        }
        if (obj.vda < 0) {
          rewardsp += obj.vda;
        }
        if (obj.vdae < 0) {
          rewardsp += obj.vdae;
        }
        if (obj.hrd < 0) {
          rewardsp += obj.hrd;
        }
        if (obj.gdt < 0) {
          rewardsp += obj.gdt;
        }
        if (obj.hll < 0) {
          rewardsp += obj.hll;
        }
        if (obj.qgrad < 0) {
          rewardsp += obj.qgrad;
        }
        if (obj.qntar < 0) {
          rewardsp += obj.qntar;
        }
        if (obj.kcal < 0) {
          rewardsp += obj.kcal;
        }

        this.form.rewardp = rewardsp;
        this.form.valuePrice = (
          parseFloat(this.form.basePrice) + parseFloat(rewardsp)
        ).toFixed(2);
        this.calculate();
      });
    },
    // 计算货值总价
    calculate() {
      let vp = 0;
      if (this.form.valuePrice != null && this.form.valuePrice != "") {
        vp = this.form.valuePrice;
      }
      let gn = 0;
      if (this.form.totalWeight != null && this.form.totalWeight != "") {
        gn = this.form.totalWeight;
      }
      this.form.valueTprice = (gn * vp).toFixed(2);
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
      this.apyamentId = row.gryId
      let _this = this;
      this.printData = {};
      await getGry(row.gryId).then((response) => {
        this.printData = response.data;
        this.printData.grnList = response.data.grnList;
        this.printData.zlc =
          response.data.grnNumber - response.data.grnList[0].grnNumber;
        this.printData.rzc =
          response.data.gryRz - response.data.grnList[0].grnRz;
        this.printData.djc =
          response.data.valuePrice - response.data.grnList[0].valuePrice;
        this.printData.zec =
          response.data.valueTprice - response.data.grnList[0].valueTprice;
        this.printData.printType = "出库管理";
      });
      this.printReviewVisible = true;
      this.$nextTick(() => {
        _this.printReviewVisible = false;
      });
    },
    onPrintReviewClose() {
      this.resolveImg();
    },
  },
};
</script>
