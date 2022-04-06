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
      <el-form-item label="项目编号" prop="name">
               
        <el-input
          v-model="queryParams.number"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
             
      </el-form-item>
           
      <el-form-item label="立项编号" prop="name">
               
        <el-input
          v-model="queryParams.productNo"
          placeholder="请输入立项编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
             
      </el-form-item>
      <el-form-item label="合同名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入合同名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="name">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入合同编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择合同类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['project:contract:add']"
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
      <!--          v-hasPermi="['project:contract:edit']"-->
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
      <!--          v-hasPermi="['project:contract:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['project:contract:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="contractList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="立项编号" align="center" prop="productNo" />
      <el-table-column label="项目编号" align="center" prop="number" />
      <el-table-column label="合同名称" align="center" prop="name" />
      <el-table-column label="合同编号" align="center" prop="number" />
      <el-table-column
        label="合同类型"
        align="center"
        prop="type"
        :formatter="typeFormat"
      />
      <el-table-column label="货品名称" align="center" prop="goodsName" />
      <el-table-column label="预计吨数" align="center" prop="expectNumber">
        <template slot-scope="scope">
          {{
            Number(scope.row.expectNumber)
              .toFixed(3)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="审批状态"
        align="center"
        prop="state"
        :formatter="stateFormat"
      />
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
        label="合同模板"
        width="160"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            style="color: red"
            v-if="scope.row.state === '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateFile(scope.row)"
            v-hasPermi="['project:contract:edit']"
            >重新上传</el-button
          >
          <el-button
            v-if="scope.row.state != '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateFile(scope.row)"
            v-hasPermi="['project:contract:edit']"
            >上传</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state === '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdatebc(scope.row)"
            v-hasPermi="['project:contract:edit']"
            >补充</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:contract:edit']"
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

    <!-- 添加或修改项目合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="bc == 1 || bc == 3">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目" prop="stId">
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
              <el-form-item label="项目编号" prop="name">
                {{ form.number }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入合同名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="立项编号" prop="productNo">
                <el-input
                  v-model="form.productNo"
                  placeholder="请输入立项编号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同类型" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择合同类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同编号" prop="name">
                <el-input v-model="form.number" placeholder="请输入合同编号" />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.type == '1'">
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
                <el-form-item label="签约时间" prop="signingTime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.signingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择签约时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="货品名称" prop="goodsName">
                  <el-input
                    v-model="form.goodsName"
                    placeholder="请输入货品名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计吨数(吨)" prop="expectNumber">
                  <el-input
                    v-model="form.expectNumber"
                    placeholder="请输入预计吨数"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保底服务费期限" prop="mfsp">
                  <el-input
                    v-model="form.mfsp"
                    placeholder="请输入保底服务费期限"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="超时服务费期限" prop="csmfsp">
                  <el-input
                    v-model="form.csmfsp"
                    placeholder="请输入超时服务费期限"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="超时服务费费率" prop="csmfsp">
                  <el-input
                    v-model="form.csrate"
                    placeholder="请输入超时服务费费率"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="违约服务费期限" prop="vymfsp">
                  <el-input
                    v-model="form.vymfsp"
                    placeholder="请输入违约服务费期限"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="违约服务费费率" prop="vymfsp">
                  <el-input
                    v-model="form.vyrate"
                    placeholder="请输入违约服务费费率"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '2'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="终端客户" prop="terminalId">
                  <el-select
                    filterable
                    value-key="terminalId"
                    @change="changeTerinal"
                    v-model="form.terminalId"
                    placeholder="请选择终端客户"
                    style="width: 100%"
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
                <el-form-item label="签约时间" prop="signingTime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.signingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择签约时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="基准价格(元)" prop="price">
                  <el-input v-model="form.price" placeholder="请输入基准价格" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品名称" prop="goodsName">
                  <el-input
                    v-model="form.goodsName"
                    placeholder="请输入货品名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预计吨数" prop="expectNumber">
                  <el-input
                    v-model="form.expectNumber"
                    placeholder="请输入预计吨数"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '3'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输单位" prop="transportUnit">
                  <el-input
                    v-model="form.transportUnit"
                    placeholder="请输入运输单位/服务单位"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约时间" prop="signingTime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.signingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择签约时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输方式" prop="transportType">
                  <el-select
                    v-model="form.transportType"
                    placeholder="请选择运输方式"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="obj in transportTypeOptions"
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
                <el-form-item label="起运地" prop="transportStart">
                  <el-input
                    v-model="form.transportStart"
                    placeholder="请输入起运地"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目的地" prop="transportEnd">
                  <el-input
                    v-model="form.transportEnd"
                    placeholder="请输入目的地"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运费单价(元/吨)" prop="transportPrice">
                  <el-input
                    v-model="form.transportPrice"
                    placeholder="请输入运费单价(吨/元)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="损耗率" prop="transportLoss">
                  <el-input
                    v-model="form.transportLoss"
                    placeholder="请输入损耗率"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '4'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输单位" prop="transportUnit">
                  <el-input
                    v-model="form.transportUnit"
                    placeholder="请输入运输单位/服务单位"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约时间" prop="signingTime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.signingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择签约时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运输方式" prop="transportType">
                  <el-select
                    v-model="form.transportType"
                    placeholder="请选择运输方式"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="obj in transportTypeOptions"
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
                <el-form-item label="起运地" prop="transportStart">
                  <el-input
                    v-model="form.transportStart"
                    placeholder="请输入起运地"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目的地" prop="transportEnd">
                  <el-input
                    v-model="form.transportEnd"
                    placeholder="请输入目的地"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="运费单价(吨/元)" prop="transportPrice">
                  <el-input
                    v-model="form.transportPrice"
                    placeholder="请输入运费单价(吨/元)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="损耗率" prop="transportLoss">
                  <el-input
                    v-model="form.transportLoss"
                    placeholder="请输入损耗率"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '5'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户名称" prop="khName">
                  <el-input
                    v-model="form.khName"
                    placeholder="请输入客户名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约时间" prop="signingTime">
                  <el-date-picker
                    clearable
                    size="small"
                    style="width: 100%"
                    v-model="form.signingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择签约时间"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注" prop="node">
                  <el-input
                    type="textarea"
                    :rows="5"
                    v-model="form.node"
                    placeholder="请输入备注"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row v-if="bc == 3">
            <el-col :span="12">
              <el-form-item label="合同模板" prop="file">
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
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="bc == 1">
            <el-col :span="12">
              <el-form-item label="合同模板" prop="file">
                <el-upload
                  disabled
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
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="bc == 1 && form.issc == '2'">
          <el-row>
            <el-col :span="24">
              <el-form-item label="补充说明" prop="content">
                <el-input v-model="form.content" placeholder="请输入补充说明" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="补充附件" prop="file">
                <el-upload
                  disabled
                  class="upload-demo"
                  :action="url"
                  :headers="headers"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccess"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="5"
                  :on-exceed="handleExceed"
                  :file-list="filebcList"
                >
                  <!--                  <el-button size="small" type="primary">点击上传</el-button>-->
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="bc == 2">
          <el-row>
            <el-col :span="24">
              <el-form-item label="补充说明" prop="content">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="form.content"
                  placeholder="请输入补充说明"
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
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="bc == 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同模板" prop="file">
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
                  <el-button size="small" type="primary">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.once="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--打印页-->
    <el-dialog
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
                  v-text="selectDictLabel(stateOptions, printData.state)"
                ></span
              ></el-col>
            </el-row>
          </div>
          <!--基本信息-->
          <table border="1" width="100%">
            <tr>
              <td class="title" colspan="6">合同信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">项目名称</td>
              <td class="table-td-content">
                {{ printData.stName }}
              </td>
              <td class="table-td-title detail">立项编号</td>
              <td class="table-td-content">
                {{ printData.productNo }}
              </td>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                {{ printData.projectNumber }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">合同名称</td>
              <td class="table-td-content">
                {{ printData.name }}
              </td>
              <td class="table-td-title detail">合同类型</td>
              <td class="table-td-content">
                {{ printData.type }}
              </td>
              <td class="table-td-title detail">合同编号</td>
              <td class="table-td-content">
                {{ printData.number }}
              </td>
            </tr>
            <template v-if="printData.type == '上游合同'">
              <tr>
                <td class="table-td-title detail">签约日期</td>
                <td class="table-td-content">
                  {{ parseTime(printData.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="table-td-title detail">供应商</td>
                <td class="table-td-content">
                  {{ printData.supplierName }}
                </td>
                <td class="table-td-title detail">货品名称</td>
                <td class="table-td-content">
                  {{ printData.goodsName }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">保底服务费期限</td>
                <td class="table-td-content">
                  {{ printData.mfsp }}
                </td>
                <td class="table-td-title detail">超时服务费期限</td>
                <td class="table-td-content">
                  {{ printData.csmfsp }}
                </td>
                <td class="table-td-title detail">违约服务费期限</td>
                <td class="table-td-content">
                  {{ printData.vymfsp }}
                </td>
              </tr>
            </template>
            <template v-else-if="printData.type == '下游合同'">
              <tr>
                <td class="table-td-title detail">签约日期</td>
                <td class="table-td-content">
                  {{ parseTime(printData.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="table-td-title detail">终端客户</td>
                <td class="table-td-content">
                  {{ printData.terminalName }}
                </td>
                <td class="table-td-title detail">货品名称</td>
                <td class="table-td-content">
                  {{ printData.goodsName }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">预计吨数</td>
                <td class="table-td-content">
                  {{ $options.filters.weightFilter(printData.expectNumber) }}
                </td>
                <td class="table-td-title detail">基准单价</td>
                <td class="table-td-content" colspan="3">
                  {{ $options.filters.moneyFilter(printData.price) }}
                </td>
              </tr>
            </template>
            <template v-else-if="printData.type == '其他合同'">
              <tr>
                <td class="table-td-title detail">签约日期</td>
                <td class="table-td-content">
                  {{ parseTime(printData.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="table-td-title detail">客户名称</td>
                <td class="table-td-content">
                  {{ printData.khName }}
                </td>
                <td class="table-td-title detail">货品名称</td>
                <td class="table-td-content">
                  {{ printData.goodsName }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">备注</td>
                <td class="table-td-content" colspan="5">
                  {{ printData.node }}
                </td>
              </tr>
            </template>
            <template v-else-if="printData.type == '物流服务合同'">
              <tr>
                <td class="table-td-title detail">签约日期</td>
                <td class="table-td-content">
                  {{ parseTime(printData.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="table-td-title detail">货品名称</td>
                <td class="table-td-content">
                  {{ printData.goodsName }}
                </td>
                <td class="table-td-title detail">运输单位</td>
                <td class="table-td-content">
                  {{ printData.transportUnit }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">运输方式</td>
                <td class="table-td-content">
                  {{ printData.transportType }}
                </td>
                <td class="table-td-title detail">起运地</td>
                <td class="table-td-content">
                  {{ printData.transportStart }}
                </td>
                <td class="table-td-title detail">目的地</td>
                <td class="table-td-content">
                  {{ printData.transportEnd }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">运输单价(吨/元)</td>
                <td class="table-td-content">
                  {{ $options.filters.moneyFilter(printData.transportPrice) }}
                </td>
                <td class="table-td-title detail">损耗率</td>
                <td class="table-td-content" colspan="3">
                  {{ printData.transportLoss }}
                </td>
              </tr>
            </template>
            <template v-else-if="printData.type == '物流运输合同'">
              <tr>
                <td class="table-td-title detail">签约日期</td>
                <td class="table-td-content">
                  {{ parseTime(printData.signingTime, "{y}-{m}-{d}") }}
                </td>
                <td class="table-td-title detail">货品名称</td>
                <td class="table-td-content">
                  {{ printData.goodsName }}
                </td>
                <td class="table-td-title detail">运输单位</td>
                <td class="table-td-content">
                  {{ printData.transportUnit }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">运输方式</td>
                <td class="table-td-content">
                  {{ printData.transportType }}
                </td>
                <td class="table-td-title detail">起运地</td>
                <td class="table-td-content">
                  {{ printData.transportStart }}
                </td>
                <td class="table-td-title detail">目的地</td>
                <td class="table-td-content">
                  {{ printData.transportEnd }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">运输单价(吨/元)</td>
                <td class="table-td-content">
                  {{ $options.filters.moneyFilter(printData.transportPrice) }}
                </td>
                <td class="table-td-title detail">损耗率</td>
                <td class="table-td-content" colspan="3">
                  {{ printData.transportLoss }}
                </td>
              </tr>
            </template>
            <tr>
              <td class="table-td-title detail">附件</td>
              <td class="table-td-content" colspan="5">
                <div v-for="(item, idx) in printData.fileList" :key="idx">
                  {{ item.name }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="title" colspan="6">补充合同</td>
            </tr>
            <tr>
              <td class="table-td-title detail">补充说明</td>
              <td class="table-td-textarea" colspan="5">
                {{ printData.content }}
              </td>
            </tr>
            <tr>
              <td class="table-td-title detail">附件</td>
              <td class="table-td-content" colspan="5">
                <div v-for="(item, idx) in printData.bcfileList" :key="idx">
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
  listContract,
  getContract,
  delContract,
  addContract,
  updateContract,
  getStList,
  getSupplierList,
  getTerminalList,
} from "@/api/project/contract";
import { getToken } from "@/utils/auth";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList } from "@/api/approve";

export default {
  name: "Contract",
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
    const validatePrice2 = (rule, value, callback) => {
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
      bc: 1,
      //上传路径
      url: process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //补充合同集合
      filebcList: [],
      //备份文件集合
      fileListbf: [],
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
      // 项目合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      openbc: false,
      // 合同类型字典
      typeOptions: [],
      // 审批状态字典
      stateOptions: [],
      // 项目集合
      stOptions: [],
      // 供应商集合
      supplierOptions: [],
      // 终端客户集合
      terminalOptions: [],
      //运输方式
      transportTypeOptions: [
        { key: "火运", label: "火运" },
        { key: "汽运", label: "汽运" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stId: null,
        stName: null,
        name: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        name: [
          { required: true, message: "合同名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "情选择合同类型", trigger: "blur" }],
        signingTime: [
          { required: true, message: "请选择签约时间", trigger: "blur" },
        ],
        supplierId: [
          { required: true, message: "请选择供应商", trigger: "blur" },
        ],
        goodsName: [
          { required: true, message: "货品名称不能为空", trigger: "blur" },
        ],
        expectNumber: [{ validator: validatePrice3, trigger: "blur" }],
        mfsp: [{ validator: validatePrice2, trigger: "blur" }],
        csmfsp: [{ validator: validatePrice2, trigger: "blur" }],
        csrate: [{ validator: validatePrice3, trigger: "blur" }],
        vymfsp: [{ validator: validatePrice2, trigger: "blur" }],
        vyrate: [{ validator: validatePrice3, trigger: "blur" }],
        terminalId: [
          { required: true, message: "请选择终端用户", trigger: "blur" },
        ],
        price: [{ required: true, validator: validatePrice, trigger: "blur" }],
        transportUnit: [
          {
            required: true,
            message: "运输单位/服务单位不能为空",
            trigger: "blur",
          },
        ],
        transportType: [
          { required: true, message: "请选择运输方式", trigger: "blur" },
        ],
        // transportStart: [
        //   { required: true, message: "起运地不能为空", trigger: "blur" }
        // ],
        // transportEnd: [
        //   { required: true, message: "目的地不能为空", trigger: "blur" }
        // ],
        transportPrice: [{ validator: validatePrice3, trigger: "blur" }],
        // transportLoss: [
        //   { required: true, message: "损耗率不能为空", trigger: "blur" }
        // ],
        content: [
          { required: true, message: "补充说明不能为空", trigger: "blur" },
        ],
      },
      // 打印
      printReviewVisible: false,
      printData: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("project_contract_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("project_approval_state").then((response) => {
      this.stateOptions = response.data;
    });
    getStList().then((response) => {
      this.stOptions = response.rows;
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
      let contractId = this.$route.params.contractId;
      let row = { contractId: contractId };
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
    /** 查询项目合同列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then((response) => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then((response) => {
        this.stOptions = response.rows;
      });
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
    // 合同类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
        contractId: null,
        stId: null,
        stId2: null,
        stName: null,
        name: null,
        type: null,
        supplierId: null,
        supplierId2: null,
        supplierName: null,
        terminalId: null,
        terminalId2: null,
        terminalName: null,
        signingTime: null,
        goodsName: null,
        expectNumber: null,
        mfsp: null,
        csmfsp: null,
        csrate: null,
        vymfsp: null,
        vyrate: null,
        price: null,
        transportUnit: null,
        transportType: null,
        transportStart: null,
        transportEnd: null,
        transportPrice: null,
        transportLoss: null,
        issc: null,
        state: null,
        createBy: null,
        createTime: null,
        fileList: [],
        content: null,
        filebcList: [],
        khName: null,
        node: null,
        number: null,
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
      this.ids = selection.map((item) => item.contractId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.type = "1";
      this.fileList = [];
      this.bc = 3;
      this.open = true;
      this.title = "添加项目合同";
    },
    /** 补充修改按钮操作 */
    handleUpdatebc(row) {
      this.reset();
      this.fileList = [];
      const contractId = row.contractId || this.ids;
      getContract(contractId).then((response) => {
        this.form = response.data;
        //展示补充合同
        this.fileList = response.data.filebcList;
        //备份本身合同
        this.fileListbf = response.data.fileList;

        this.form.stId2 = response.data.stId;
        this.form.stId = response.data.stName;

        this.form.terminalId2 = response.data.terminalId;
        this.form.terminalId = response.data.terminalName;

        this.form.supplierId2 = response.data.supplierId;
        this.form.supplierId = response.data.supplierName;

        this.bc = 2;
        this.open = true;
        this.title = "补充项目合同";
      });
    },

    /** 修改双章合同 */
    handleUpdateFile(row) {
      this.reset();
      const contractId = row.contractId || this.ids;
      getContract(contractId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.filebcList = response.data.filebcList;
        this.form.stId2 = response.data.stId;
        this.form.stId = response.data.stName;

        this.form.terminalId2 = response.data.terminalId;
        this.form.terminalId = response.data.terminalName;

        this.form.supplierId2 = response.data.supplierId;
        this.form.supplierId = response.data.supplierName;

        this.bc = 4;
        this.open = true;
        this.title = "补充合同模板";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const contractId = row.contractId || this.ids;
      getContract(contractId).then((response) => {
        this.form = response.data;
        this.fileList = response.data.fileList;
        this.filebcList = response.data.filebcList;
        this.form.stId2 = response.data.stId;
        this.form.stId = response.data.stName;

        this.form.terminalId2 = response.data.terminalId;
        this.form.terminalId = response.data.terminalName;

        this.form.supplierId2 = response.data.supplierId;
        this.form.supplierId = response.data.supplierName;

        this.bc = 1;
        this.open = true;
        this.title = "修改项目合同";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const contractId = row.contractId || this.ids;
      this.$router.push("/contract/look/" + contractId);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.stId = this.form.stId2;
          this.form.supplierId = this.form.supplierId2;
          this.form.terminalId = this.form.terminalId2;
          if (this.bc == 2) {
            //图片数据存在补充集合中
            this.form.filebcList = this.form.fileList;
            //备份图片拿出来
            this.form.fileList = this.fileListbf;

            this.form.bc = 2;
          }
          if (this.form.contractId != null) {
            updateContract(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(this.form).then((response) => {
              if (response.code == 1) {
                this.msgError(response.msg);
                this.open = false;
                this.getList();
              } else {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const contractIds = row.contractId || this.ids;
      this.$confirm("是否确认删除项目合同?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delContract(contractIds);
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
        "project/contract/export",
        {
          ...this.queryParams,
        },
        `project_contract.xlsx`
      );
    },
    changeSt(obj) {
      this.form.stId2 = obj.stId;
      this.form.stName = obj.name;
      this.$set(this.form, "number", obj.number);

      this.form.supplierId = obj.supplierName;
      this.form.supplierId2 = obj.supplierId;
      this.form.supplierName = obj.supplierName;

      this.form.terminalId = obj.tName;
      this.form.terminalId2 = obj.terminalId;
      this.form.terminalName = obj.tName;
    },
    changeSupplier(obj) {
      this.form.supplierId2 = obj.supplierId;
      this.form.supplierName = obj.name;
    },
    changeTerinal(obj) {
      this.form.terminalId2 = obj.terminalId;
      this.form.terminalName = obj.name;
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
    },
    uploadError(err, file, filelist) {
      this.$message.error("上传失败");
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
      await getContract(row.contractId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.bcfileList = response.data.filebcList;
        if (this.printData.type == "1") {
          this.printData.type = "上游合同";
        } else if (this.printData.type == "2") {
          this.printData.type = "下游合同";
        } else if (this.printData.type == "3") {
          this.printData.type = "物流运输合同";
        } else if (this.printData.type == "4") {
          this.printData.type = "物流服务合同";
        } else if (this.printData.type == "5") {
          this.printData.type = "其他合同";
        }
      });
      await getProcessDataByStId("3", row.contractId).then((res) => {
        this.printData.approveHisList = res.data;
      });
      await getApprovalProcessList("3", row.contractId).then((res) => {
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
