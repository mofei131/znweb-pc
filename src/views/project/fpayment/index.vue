<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目" prop="stId">
        <el-select filterable v-model="queryParams.stId" placeholder="请选择项目" clearable size="small">
          <el-option
            v-for="dict in stOptions"
            :key="dict.stId"
            :label="dict.name"
            :value="dict.stId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
        >新增</el-button>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:fpayment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fpaymentList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="货品名称" align="center" prop="hpName" />
      <el-table-column label="合计重量(吨)" align="center" prop="tweight" />
      <el-table-column label="货品单价(元)" align="center" prop="price" >
        <template slot-scope="scope">
          {{
            Number(scope.row.price)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="电厂结算金额(元)" align="center" prop="zzPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.zzPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="扣除费用合计(元)" align="center" prop="otherPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.otherPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="最终应付总额(元)" align="center" prop="yftotalPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.yftotalPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="已付金额总额(元)" align="center" prop="yfPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.yfPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="最终实际付款(元)" align="center" prop="sjPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.sjPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center" prop="moType" :formatter="moFormat" />
      <el-table-column label="创建日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="付款状态" align="center" prop="fkState"  />
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:fpayment:edit']"
          >查看</el-button>
          <el-button v-if="scope.row.state=='3' && scope.row.fkState=='未付款'"
                     size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdatePayTime(scope.row)"
                     v-hasPermi="['project:apayment:edit']"
          >付款</el-button>
          <el-button v-if="scope.row.state=='3' && scope.row.fkState=='未付款' && scope.row.payTime!=null"
                     size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdateFkState(scope.row)"
                     v-hasPermi="['project:apayment:edit']"
          >完成</el-button>
<!--          <el-button-->
<!--            v-if="scope.row.moType=='1'"-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleKp(scope.row)"-->
<!--            v-hasPermi="['project:fpayment:edit']"-->
<!--          >开票</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['project:fpayment:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['project:fpayment:remove']"-->
<!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改最终付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook!='4'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="stId">
              <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择项目" style="width: 100%;">
                <el-option
                  v-for="obj in stOptions"
                  :key="obj.stId"
                  :label="obj.name"
                  :value="obj"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预付方式" prop="payType">
              <el-select  v-model="form.payType" @change="jsdj"  placeholder="请选择预付方式" style="width: 100%">
                <el-option label="吨"  value="吨" >吨</el-option>
                <el-option label="热值" value="热值" >热值</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.payType=='热值'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="热值单价(元/Kcal)" prop="rzValue">
                <el-input v-model="form.rzValue" @change="jsdj" placeholder="请输入热值单价(元/Kcal)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!--选择出库单-->
<!--        <div v-if="isLook!=3">-->
<!--          <el-popover-->
<!--            placement="bottom-start"-->
<!--            width="100%"-->
<!--            @selection-change="grnSelectionChange"-->
<!--            v-model="visible"-->
<!--            popper-class="area_popper">-->
<!--            <el-button type="primary" slot="reference" style="margin-bottom: 30px;">选择出库单</el-button>-->
<!--            <el-table-->
<!--              ref="singleTable"-->
<!--              :data="tablegryData"-->
<!--              @selection-change="grnSelectionChange"-->
<!--              style="width: 100%;"-->
<!--            >-->
<!--              <el-table-column-->
<!--                type="selection"-->
<!--                width="55">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="name"-->
<!--                label="货品名称"-->
<!--                width="120">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="grnNumber"-->
<!--                label="出库重量（吨）"-->
<!--                width="120">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="gryRz"-->
<!--                label="出库热值（kcal）"-->
<!--                width="120">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="transportType"-->
<!--                label="运输方式"-->
<!--                width="90">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="wlCompany"-->
<!--                label="物流公司"-->
<!--                width="120">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="carNumber"-->
<!--                label="车数"-->
<!--                width="90">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="batch"-->
<!--                label="批次"-->
<!--                width="90">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                property="okTime"-->
<!--                label="发货日期（吨）"-->
<!--                width="120">-->
<!--              </el-table-column>-->

<!--            </el-table>-->
<!--            <div style="margin-top: 20px">-->
<!--              <el-button type="primary"  style="float: right"  @click="toggleSelection()">确认选择</el-button>-->
<!--            </div>-->
<!--          </el-popover>-->
<!--        </div>-->
        <!--已选择的出库单-->
        <div  style="margin-bottom: 30px">
          <el-table
            ref="singleTable"
            :data="tableselData"
            style="width: 100%">
            <el-table-column
              property="name"
              label="货品名称"
              width="90">
            </el-table-column>
            <el-table-column
              property="grnNumber"
              label="入库重量（吨）"
              width="120">
            </el-table-column>
            <el-table-column
              property="gryRz"
              label="出库热值（kcal）"
              width="120">
            </el-table-column>
            <el-table-column
              property="transportType"
              label="运输方式"
              width="90">
            </el-table-column>
            <el-table-column
              property="wlCompany"
              label="物流公司"
              width="120">
            </el-table-column>
            <el-table-column
              property="carNumber"
              label="车数"
              width="90">
            </el-table-column>
            <el-table-column
              property="batch"
              label="批次"
              width="90">
            </el-table-column>
            <el-table-column
              property="okTime"
              label="到货日期（吨）"
              width="120">
            </el-table-column>
            <el-table-column
              property="valuePrice"
              label="货值单价（元）"
              width="120">
            </el-table-column>
            <el-table-column
              property="valueTprice"
              label="货值总额（吨）"
              width="120">
            </el-table-column>
<!--            <el-table-column-->
<!--              v-if="isLook!=3"-->
<!--              label="操作"-->
<!--              width="120">-->
<!--              <template slot-scope="scope">-->
<!--                <el-button-->
<!--                  @click.native.prevent="deleteRow(scope.$index, tableselData)"-->
<!--                  type="text"-->
<!--                  size="small">-->
<!--                  移除-->
<!--                </el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </div>

        <el-row>
          <el-col :span="6">
            <el-form-item label="合计重量" prop="totalWeight">
              <span  style="color: red">{{form.tweight}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平均热值" prop="averageRz">
              <span  style="color: red">{{form.prz}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="奖惩(元)">
              <span>水分：<span style="color: red" v-text="form.jc1">0.00</span></span>
              <span style="margin-left: 20px;">内水：<span style="color: red" v-text="form.jc2">0.00</span></span>
              <span style="margin-left: 20px;">灰份Aad：<span style="color: red" v-text="form.jc3">0.00</span></span>
              <span style="margin-left: 20px;">灰份ad：<span style="color: red" v-text="form.jc10">0.00</span></span>
              <span style="margin-left: 20px;">挥发份Vda：<span style="color: red" v-text="form.jc4">0.00</span></span>
              <span style="margin-left: 20px;">挥发份Vdae：<span style="color: red" v-text="form.jc11">0.00</span></span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="">
              <span >灰熔点：<span style="color: red" v-text="form.jc5">0.00</span></span>
              <span style="margin-left: 20px;">固定碳：<span style="color: red" v-text="form.jc6">0.00</span></span>
              <span style="margin-left: 20px;">含硫量：<span style="color: red" v-text="form.jc7">0.00</span></span>
              <span style="margin-left: 20px;">热值Qgr,ad：<span style="color: red" v-text="form.jc8">0.00</span></span>
              <span style="margin-left: 20px;">热值Qnt,ar：<span style="color: red" v-text="form.jc9">0.00</span></span>
              <span style="margin-left: 20px;">热值Kcal：<span style="color: red" v-text="form.jc12">0.00</span></span>
              <el-button style="margin-left: 20px;" type="primary" @click="jsjc" v-if="isLook!=3">奖惩计算</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电厂结算金额(元)" prop="zzPrice">
              <el-input @change="atochange" v-model="form.zzPrice"  placeholder="请输入电厂结算金额(元)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税款" prop="tax">
              <el-input v-model="form.tax"  placeholder="请输入税款" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货品单价(元)" prop="price">
              <el-input v-model="form.price" @change="toggleSelection" placeholder="请输入货品单价(元)" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="付款日期" prop="payTime">-->
<!--              <el-date-picker clearable size="small" style="width: 60%"-->
<!--                              v-model="form.payTime"-->
<!--                              type="date"-->
<!--                              value-format="yyyy-MM-dd"-->
<!--                              placeholder="选择付款日期">-->
<!--              </el-date-picker>-->
<!--              <el-button type="primary" :disabled="this.form.hkState!=2" v-if="isLook!=3"   @click="qzjs">强制结算</el-button>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-form-item label="扣除费用明细:"  style="color: black">
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="运费(元)" prop="ttPrice">
              <el-input v-model="form.ttPrice" @change="atochange" placeholder="请输入运费(元)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保证金(元)" prop="bzPrice">
              <el-input v-model="form.bzPrice"  placeholder="请输入保证金(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="gdType!=1">
            <el-form-item label="固定差价总额(元)" prop="gdxPrice">
              <el-input v-model="form.gdxPrice"  placeholder="请输入固定差价总额(元)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务费" prop="servicePrice">
              <el-input v-model="form.servicePrice"  @change="atochange" placeholder="请输入服务费" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承兑贴息" prop="cdtx">
              <el-input v-model="form.cdtx" @change="atochange" placeholder="请输入承兑贴息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补税金额" prop="bsPrice">
              <el-input v-model="form.bsPrice" @change="atochange" placeholder="请输入补税金额" style="width: 60%"/>
              <el-button type="primary" @click="cxjs"  v-if="isLook!=3" :disabled="isCxjs!=1">重新计算</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="其他扣款" prop="otherPrice">
              <el-input v-model="form.otherPrice" @change="atochange" placeholder="请输入其他扣款" />
            </el-form-item>
          </el-col>
        </el-row>

          <el-form-item label="增加费用明细:"  style="color: black">
          </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="贴息" prop="tx">
              <el-input v-model="form.tx" @change="atochange" placeholder="请输入贴息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他" prop="qt">
              <el-input v-model="form.qt" @change="atochange" placeholder="请输入其他" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最终应付款金额" prop="yftotalPrice">
              <el-input disabled v-model="form.yftotalPrice"  placeholder="请输入最终应付款金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最终应付款税额" prop="yftotalPrice">
              <el-input disabled v-model="form.yftotalPriceatx"  placeholder="请输入最终应付款税额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="已付金额" prop="yfPrice">
              <el-input disabled v-model="form.yfPrice"  placeholder="请输入已付金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额" prop="je">
              <el-input @change="atochange" v-model="form.je"  placeholder="请输入金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最终实际付款(元)" prop="sjPrice">
              <el-input disabled v-model="form.sjPrice"  placeholder="请输入最终实际付款(元)" />
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
                :file-list="fileList">
                <el-button size="small" type="primary" v-if="isLook!=3">点击上传</el-button>
                <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        </div>

        <div v-if="isLook=='4'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款日期" prop="payTime">
                <el-date-picker clearable size="small" style="width: 100%;"
                                v-model="form.payTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择付款日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="isLook!=3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    开票-->
    <!-- 添加或修改开票对话框 -->
    <el-dialog :title="title" :visible.sync="kpopen" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-form-item >
              <span>电厂结算金额(元)：<span style="color: red">{{ form.kpzzTprice }}</span></span>
              <span style="margin-left: 10%;">合计重量(吨)：<span style="color: red">{{form.kpzzWeight}}</span></span>
              <span style="margin-left: 10%;">货品单价(元)：<span style="color: red">{{ form.kpzzPrice }}</span></span>
              <span style="margin-left: 10%;">代办人：<span style="color: red">{{ form.uName }}</span></span>
              <span style="margin-left: 10%;">供应商：<span style="color: red">{{ form.sName }}</span></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票金额(元)" prop="kpPrice">
              <el-input v-model="form.kpPrice" placeholder="请输入开票金额(元)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票税额(元)" prop="kpTax">
              <el-input v-model="form.kpTax" placeholder="请输入开票税额(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价税合计(元)" prop="kpTotal">
              <el-input v-model="form.kpTotal" placeholder="请输入价税合计(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="kpName">
              <el-input v-model="form.kpName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号" prop="kpNumber">
              <el-input v-model="form.kpNumber" placeholder="请输入税号" />
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
                :file-list="fileList">
                <el-button size="small" type="primary" >点击上传</el-button>
                <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="kpcancel">取 消</el-button>
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
  getHkState, jsSp,
} from "@/api/project/fpayment";
import {getToken} from "@/utils/auth";
import {getApayment, updateApayment} from "@/api/project/apayment";
import {getSticketList} from "@/api/project/all";

export default {
  name: "Fpayment",
  data() {
    // 两位小数点验证
    const validatePrice = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(value!=0 && (value==null || value=="")){
        callback(new Error('不能为空'))
      }else if(!reg.test(value)){
        callback(new Error('请输入正确格式'))
      }else{
        callback();
      }
    };
    // 可空无两位小数点
    const validatePrice3 = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(value!=null && value!=''){
        if(!reg.test(value)){
          callback(new Error('请输入正确格式'))
        }else{
          callback();
        }
      }else{
        callback();
      }
    };
    return {
      isLook:1,
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //选择出库单框显示状态
      visible:false,
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
      gd:0,
      //固定差价类别
      gdType:1,
      //补税金额
      bs:0,
      //未结算服务费
      nfp:0,
      // 项目集合
      stOptions: [],
      //重新计算按钮
      isCxjs:1,
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
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "请选择预付方式", trigger: "blur" }
        ],
        rzValue: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        zzPrice: [
          { required: true,validator:validatePrice, trigger: "blur" }
        ],
        tax: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        price: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "请选择付款日期", trigger: "blur" }
        ],
        ttPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        bzPrice: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        gdxPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        servicePrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        cdtx: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        bsPrice: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        otherPrice: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        yftotalPrice: [
          { validator:validatePrice, trigger: "blur" }
        ],
        yftotalPriceatx: [
          { validator:validatePrice, trigger: "blur" }
        ],
        yfPrice: [
          { validator:validatePrice, trigger: "blur" }
        ],
        sjPrice: [
          { validator:validatePrice, trigger: "blur" }
        ],
        kpPrice: [
          { required: true,validator:validatePrice, trigger: "blur" }
        ],
        kpTax: [
          { required: true,validator:validatePrice, trigger: "blur" }
        ],
        kpTotal: [
          { required: true,validator:validatePrice, trigger: "blur" }
        ],
        kpName: [
          { required: true,message: "请输入", trigger: "blur" }
        ],
        kpNumber: [
          { required: true,message: "请输入", trigger: "blur" }
        ],
        tx: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        qt: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        je: [
          { validator:validatePrice3, trigger: "blur" }
        ],

      }
    };
  },
  created() {
    this.getList();
    this.getDicts("project_approval_state").then(response => {
      this.stateOptions = response.data;
    });
    getStList().then(response => {
      this.stOptions = response.rows;
    });
    if(this.$route.params.isEdit!=null && this.$route.params.isEdit=="true"){
      let fpaymentId=this.$route.params.fpaymentId
      let row={"fpaymentId":fpaymentId}
      this.handleUpdate(row)
    }
    if(this.$route.params.isAdd!=null && this.$route.params.isAdd=="true"){
      this.handleAdd()
    }
  },
  methods: {
    /** 查询最终付款列表 */
    getList() {
      this.loading = true;
      listFpayment(this.queryParams).then(response => {
        this.fpaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
      });
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 开票状态
    moFormat(row, column) {
      if(row.moType=='1'){
        return "未开票"
      }else {
        return "已开票"
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
        jc1:0,
        jc2:0,
        jc3:0,
        jc4:0,
        jc5:0,
        jc6:0,
        jc7:0,
        jc8:0,
        jc9:0,
        jc10:0,
        jc11:0,
        jc12:0,
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
        yftotalPriceatx:null,
        yfPrice: null,
        sjPrice: null,
        moType: null,
        moId: null,
        state: null,
        createBy: null,
        createTime: null,
        hkState:null,
        gryList:[],
        fileList:[],
        isKp:null,
        kpzzTprice:null,
        kpzzWeight:null,
        kpzzPrice:null,
        kpName:null,
        kpNumber:null,
        kpPrice:null,
        kpTax:null,
        kpTotal:null,
        uName:null,
        tx:null,
        qt:null,
        sName:null
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
      this.ids = selection.map(item => item.fpaymentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.payType='吨';
      this.tableData=[]
      this.tableselData=[]
      this.fileList=[];
      this.form.tweight=0
      this.form.prz=0
      this.gdType=1
      this.form.isKp = 1;
      this.isLook = 1;
      this.open = true;
      this.title = "添加最终付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.gdType=1
      const fpaymentId = row.fpaymentId || this.ids
      getFpayment(fpaymentId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
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
      this.gdType=1
      const fpaymentId = row.fpaymentId || this.ids
      this.$router.push("/fpayment/look/" + fpaymentId);
    },
    /** 开票按钮操作 */
    handleKp(row) {
      this.reset();
      this.gdType=1
      const fpaymentId = row.fpaymentId || this.ids
      getFpayment(fpaymentId).then(response => {
        this.form = response.data;
        this.form.kpzzTprice=this.form.zzPrice
        this.form.kpzzWeight=this.form.tweight
        this.form.kpzzPrice=this.form.price
        this.form.kpPrice=this.form.zzPrice-this.form.tax;
        this.form.kpTax=this.form.tax;
        this.form.kpTotal=this.form.zzPrice;
        this.fileList = this.form.fileList;
        this.form.isKp = 2;
        this.kpopen = true;
        this.title = "开票申请";
      });
    },

    /** 修改按钮操作 */
    handleUpdatePayTime(row) {
      this.reset();
      const fpaymentId = row.fpaymentId || this.ids
      getFpayment(fpaymentId).then(response => {
        this.form = response.data;
        this.isLook=4;
        this.open = true;
        this.title = "修改最终付款";
      });
    },

    /** 修改按钮操作 */
    handleUpdateFkState(row) {
      this.reset();
      const fpaymentId = row.fpaymentId || this.ids
      let self = this
      this.$confirm('是否确定完成付款?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        self.submitFormFk(fpaymentId);
      })
    },
    submitFormFk(id) {
      getFpayment(id).then(response => {
        this.form = response.data;
        this.form.fkState = '已付款';
        updateFpayment(this.form).then(response => {

          this.msgSuccess("付款成功");
          this.open = false;
          this.getList();
        });
      });
    },



    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if(this.form.isKp==2){
            updateFpayment(this.form).then(response => {
              this.msgSuccess("开票成功");
              this.kpopen = false;
              this.getList();
            });
          }else{
            if(this.isLook!=4){
              if(this.tableselData.length<1) {
                this.msgError("请选择出库单")
                return
              }
              this.form.stId=this.form.stId2
              this.form.gryList=this.tableselData
            }

            if (this.form.fpaymentId != null) {
              updateFpayment(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addFpayment(this.form).then(response => {

                let data={"payTime":this.form.payTime,"nfp":this.nfp,"stId":this.form.stId2,"hkState":this.form.hkState};
                //这里计算把运费，保证金的服务费结算一下，再加个状态提交的时候实际结算一下运费保证金服务费
                // jsSp(data).then(response => {
                //   let nfp=response.data.nfp
                //   this.msgSuccess("新增成功");
                //   this.open = false;
                //   this.getList();
                // })
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fpaymentIds = row.fpaymentId || this.ids;
      this.$confirm('是否确认删除最终付款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFpayment(fpaymentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/fpayment/export', {
        ...this.queryParams
      }, `project_fpayment.xlsx`)
    },


    //上传图片
    //点击触发
    handlePreview(file) {
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove(file, filelist) {
      this.form.fileList=[];
      for(let i=0;i<filelist.length;i++){
        if (filelist[i].response != undefined) {
          let art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
          this.form.fileList.push(art);
        }else {
          let art = {"name": filelist[i].name, "url": filelist[i].url};
          this.form.fileList.push(art);
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    uploadSuccess(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList=[];
        for(let i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined) {
            let name = filelist[i].response.data.name;
            let url = filelist[i].response.data.url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }
        }
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index,1);
      }
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
    },


    //业务开始
    //选择项目 加载数据
    changeSt(obj){
      this.form.jc1=0
      this.form.jc2=0
      this.form.jc3=0
      this.form.jc4=0
      this.form.jc5=0
      this.form.jc6=0
      this.form.jc7=0
      this.form.jc8=0
      this.form.jc9=0
      this.form.jc10=0
      this.form.jc11=0
      this.form.jc12=0
      this.form.rewardp=0
      this.form.stId2 = obj.stId
      this.form.stName = obj.name
      this.tableselData=[];
      //固定差价
      if(obj.chargemType=='2' || obj.chargemType=='3'){
        this.gd=obj.chargemGd
        this.gdType=2
      }else{
        this.gd=0
        this.gdType=1
      }
      let gry = {"stId": obj.stId,"zzpayState":1}
      getGryList(gry).then(response => {
        this.tableselData = response.rows;
        let tt=0
        if(this.gdType==2){
          for(let i=0;i<response.rows.length;i++){
            tt=parseFloat(tt)+parseFloat(response.rows[i].grnNumber*this.gd)
          }
          this.form.gdxPrice=tt.toFixed(2)
        }
        this.jsdj()
      });
      let stData = {"stId": obj.stId}
      getHkState(stData).then(response => {
        this.form.hkState = response.data.hkState;
        this.form.ttPrice =  parseFloat(response.data.ttPrice).toFixed(2);
        this.form.bzPrice =  parseFloat(response.data.bzPrice).toFixed(2);
        this.form.servicePrice =  parseFloat(response.data.servicePrice).toFixed(2);
        this.form.bsPrice = parseFloat(response.data.bsPrice).toFixed(2);
        this.form.yfPrice = parseFloat(response.data.yfPrice).toFixed(2);
        this.bs = response.data.bsPrice;
        this.nfp = response.data.nfp
        this.atochange();
      });

      //成本年服务费率
      if(obj.chargemType=='1' || obj.chargemType=='3'){
        this.form.rateYear=obj.chargemNx
      }else{
        this.form.rateYear=0
      }

      let sticketData = {"stId": obj.stId}
      getSticketList(sticketData).then(response => {
        let sticketList = response.rows;
        let a1=false
        let a2=false
        for(let i=0;i<sticketList.length;i++){
          if(sticketList[i].proportion!=null && sticketList[i].proportion!=''){
            if(sticketList[i].proportion=='5%'){
                a1=true
            }
            if(sticketList[i].proportion=='95%'){
                a2=true
            }
          }
        }
        if(!a1 && !a2){
          this.$message.error("该项目没有5%和95%收票记录");
        }else{
          if(!a1){
            this.$message.error("该项目没有5%收票记录");
          }
          if(!a2){
            this.$message.error("该项目没有95%收票记录");
          }
        }
      })
    },
    //选中数据
    grnSelectionChange(selection) {
      this.tableybData=[];
      this.tableybData=selection;
    },
    //溢出选中数据
    deleteRow(index, rows) {
      this.form.jc1=0
      this.form.jc2=0
      this.form.jc3=0
      this.form.jc4=0
      this.form.jc5=0
      this.form.jc6=0
      this.form.jc7=0
      this.form.jc8=0
      this.form.jc9=0
      this.form.jc10=0
      this.form.jc11=0
      this.form.jc12=0
      this.form.rewardp=0
      this.tableselData.splice(index, 1);
      let tgn=0;
      let tgr=0;
      for(let i=0;i<this.tableybData.length;i++){
        tgn+=this.tableybData[i].grnNumber
        tgr+=this.tableybData[i].gryRz
      }
      let ts=0
      if(this.tableybData!=null && this.tableybData!=''){
        ts=this.tableybData.length;
      }
      this.form.tweight=tgn;
      if(tgr==0 || ts==0){
        this.form.prz=0
      }else{
       this.form.prz=(parseFloat(tgr)/parseFloat(ts)).toFixed(2);
      }

      if(this.gd!=null && this.gd!=''){
        this.form.gdxPrice = (parseFloat(tgn)*parseFloat(this.gd)).toFixed(2);
      }else {
        this.form.gdxPrice = 0;
      }

      this.visible = false;
      this.jsdj()
    },
    //计算重量
    toggleSelection() {
      // this.tableselData=this.tableybData;
      let tgn=0;
      let tgr=0;
      for(let i=0;i<this.tableselData.length;i++){
        tgn+=this.tableselData[i].grnNumber
        tgr+=this.tableselData[i].gryRz
      }
      let ts=0
      if(this.tableselData!=null && this.tableselData!=''){
        ts=this.tableselData.length;
      }
      this.form.tweight=tgn;
      if(tgr==0 || ts==0){
        this.form.prz=0
      }else{
        this.form.prz=(parseFloat(tgr)/parseFloat(ts)).toFixed(2);
      }

      if(this.gd!=null && this.gd!=''){
        this.form.gdxPrice = (parseFloat(tgn)*parseFloat(this.gd)).toFixed(2);
      }else {
        this.form.gdxPrice = 0;
      }

      //计算付款总额
      let tw=0
      let pr=0
      if(this.form.tweight!=null && this.form.tweight!=""){
        tw = this.form.tweight;
      }
      if(this.form.price!=null && this.form.price!=""){
        pr = this.form.price;
      }

      this.form.zzPrice = (tw*pr).toFixed(2);
      //税款
      this.form.tax = ((tw*pr)/1.13*0.13).toFixed(2);
      this.atochange()
    },
    //计算单价
    jsdj(){
      let re=0
      if(this.form.rewardp!=null && this.form.rewardp!=''){
        re=this.form.rewardp
      }
      if(this.form.payType=='吨'){
        if(this.form.stId2==null || this.form.stId2==''){
          this.msgError("请选择项目")
          return
        }
        //查询煤炭销售合同
        let c2 = {"stId": this.form.stId2, "type": "2"};
        getContract(c2).then(response => {
          if(response.data!=null){
            //预付单价 吨的预付单价
            this.form.price = (parseFloat(response.data.price)+parseFloat(re)).toFixed(2)

            //计算付款总额
            let tw=0
            let pr=0
            if(this.form.tweight!=null && this.form.tweight!=""){
              tw = this.form.tweight;
            }
            if(this.form.price!=null && this.form.price!=""){
              pr = this.form.price;
            }

            this.form.zzPrice = (tw*pr).toFixed(2);
            //税款
            this.form.tax = ((tw*pr)/1.13*0.13).toFixed(2);

            this.toggleSelection()
          }else {
            this.form.price = 0

            //计算付款总额
            let tw=0
            let pr=0
            if(this.form.tweight!=null && this.form.tweight!=""){
              tw = this.form.tweight;
            }
            if(this.form.price!=null && this.form.price!=""){
              pr = this.form.price;
            }

            this.form.zzPrice = (tw*pr).toFixed(2);
            //税款
            this.form.tax = ((tw*pr)/1.13*0.13).toFixed(2);
            this.toggleSelection()
          }
        });
      }else if(this.form.payType=='热值'){
        if(this.form.rzValue!=null && this.form.rzValue!='' && this.form.prz!=null && this.form.prz!=''){
          this.form.price = (this.form.rzValue*this.form.prz+parseFloat(re)).toFixed(2)
          this.toggleSelection()
        }else {
          this.form.price = 0
          this.toggleSelection()
        }
      }else {
        this.form.price = 0
        this.toggleSelection()
      }

    },
    // 计算最终付款总额
    atochange(){

      let zzprice=0
      if(this.form.zzPrice!=null && this.form.zzPrice!=""){
        zzprice = this.form.zzPrice;
      }
      //税款
      this.form.tax = ((zzprice)/1.13*0.13).toFixed(2);

      // //计算付款总额
      // let tw=0
      // let pr=0
      // if(this.form.tweight!=null && this.form.tweight!=""){
      //   tw = this.form.tweight;
      // }
      // if(this.form.price!=null && this.form.price!=""){
      //   pr = this.form.price;
      // }
      //
      // this.form.zzPrice = (tw*pr).toFixed(2);
      // //税款
      // this.form.tax = ((tw*pr)/1.13*0.13).toFixed(2);

      if(this.form.zzPrice!=null && this.form.zzPrice!='' && this.form.zzPrice!=0){

      let zz=0
      let bz=0
      let tt=0
      let gdx=0
      let ser=0
      let cd=0
      let bs=0
      let ot=0

      if(this.form.zzPrice!=null && this.form.zzPrice!=''){
          zz=this.form.zzPrice
      }
      if(this.form.bzPrice!=null && this.form.bzPrice!=''){
         bz=this.form.bzPrice
      }
      if(this.form.ttPrice!=null && this.form.ttPrice!=''){
         tt=this.form.ttPrice
      }
      if(this.form.gdxPrice!=null && this.form.gdxPrice!=''){
        gdx=this.form.gdxPrice
      }
      if(this.form.servicePrice!=null && this.form.servicePrice!=''){
        ser=this.form.servicePrice
      }
      if(this.form.cdtx!=null && this.form.cdtx!=''){
        cd=this.form.cdtx
      }
      if(this.form.bsPrice!=null && this.form.bsPrice!=''){
        bs=this.form.bsPrice
      }
      if(this.form.otherPrice!=null && this.form.otherPrice!=''){
        ot=this.form.otherPrice
      }
      let tx=0
      let qt=0
      if(this.form.tx!=null && this.form.tx!=''){
        tx=this.form.tx
      }
      if(this.form.qt!=null && this.form.qt!=''){
        qt=this.form.qt
      }
      let je=0
      if(this.form.je!=null && this.form.je!=''){
        je=this.form.je
      }
       //最终应付款
       this.form.yftotalPrice =  (zz-bz-tt-gdx-ser-cd-bs-ot+parseFloat(tx)+parseFloat(qt)).toFixed(2)
       //最终应付税款
       this.form.yftotalPriceatx=((zz-bz-tt-gdx-ser-cd-bs-ot+parseFloat(tx)+parseFloat(qt))/1.13*0.13).toFixed(2)
       //最终实际付款
       this.form.sjPrice=(this.form.yftotalPrice-this.form.yfPrice-parseFloat(je)).toFixed(2)
      }else {
        //最终应付款
        this.form.yftotalPrice =  0
        //最终应付税款
        this.form.yftotalPriceatx= 0
        //最终实际付款
        this.form.sjPrice= 0
      }
    },
    //强制结算
    qzjs(){
      if(this.form.stId2==null || this.form.stId2==''){
        this.msgError("请选择项目");
        return
      }
      if(this.form.payTime==null || this.form.payTime==''){
        this.msgError("请选择付款时间");
        return
      }
      let data={"payTime":this.form.payTime,"nfp":this.nfp,"stId":this.form.stId2,"hkState":this.form.hkState};
      //这里计算把运费，保证金的服务费结算一下，再加个状态提交的时候实际结算一下运费保证金服务费
      jsSp(data).then(response => {
        console.log(response)
        let nfp=response.data.nfp
        this.form.servicePrice=(parseFloat(this.form.servicePrice)+parseFloat(nfp)).toFixed(2)
        this.msgSuccess("强制结算成功");
        this.form.hkState='1';
      })

    },
    //重新计算
    cxjs(){
      let cd=0
      let bs=0
      if( this.form.cdtx!=null &&  this.form.cdtx!=''){
        cd =  this.form.cdtx
      }
      if( this.bs!=null &&  this.bs!=''){
        bs =  this.bs
      }
      this.form.bsPrice=(parseFloat(bs)+(cd/1.13*0.13*1.12)).toFixed(2)
      this.atochange()
    },
    //计算奖惩
    jsjc(){
      let jc1=0
      let jc2=0
      let jc3=0
      let jc4=0
      let jc5=0
      let jc6=0
      let jc7=0
      let jc8=0
      let jc9=0
      let jc10=0
      let jc11=0
      let jc12=0
      let re=0

      let size=this.tableselData.length;

      for(let i=0;i<this.tableselData.length;i++){
        let obj=this.tableselData[i]
        jc1+=obj.jc1
        jc2+=obj.jc2
        jc3+=obj.jc3
        jc4+=obj.jc4
        jc5+=obj.jc5
        jc6+=obj.jc6
        jc7+=obj.jc7
        jc8+=obj.jc8
        jc9+=obj.jc9
        jc10+=obj.jc10
        jc11+=obj.jc11
        jc12+=obj.jc12
        re+=obj.jc1+obj.jc2+obj.jc3+obj.jc4+obj.jc5+obj.jc6+obj.jc7+obj.jc8+obj.jc9+obj.jc10+obj.jc11+obj.jc12
      }
      this.form.jc1=(jc1/size).toFixed(2)
      this.form.jc2=(jc2/size).toFixed(2)
      this.form.jc3=(jc3/size).toFixed(2)
      this.form.jc4=(jc4/size).toFixed(2)
      this.form.jc5=(jc5/size).toFixed(2)
      this.form.jc6=(jc6/size).toFixed(2)
      this.form.jc7=(jc7/size).toFixed(2)
      this.form.jc8=(jc8/size).toFixed(2)
      this.form.jc9=(jc9/size).toFixed(2)
      this.form.jc10=(jc10/size).toFixed(2)
      this.form.jc11=(jc11/size).toFixed(2)
      this.form.jc12=(jc12/size).toFixed(2)
      this.form.rewardp=(re/size).toFixed(2)

      this.jsdj()
    },
  }
};
</script>
