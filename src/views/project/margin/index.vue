<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <!-- <el-form-item label="保证金对象" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择保证金对象"
          clearable
          size="small"
        >
          <el-option label="上游" value="上游" />
          <el-option label="下游" value="下游" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="保证金类型" prop="type">
        <el-select v-model="queryParams.obj" placeholder="请选择保证金类型" clearable size="small">
          <el-option label="履约保证金" value="履约保证金" />
          <el-option label="投标保证金" value="投标保证金" />
        </el-select>
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['project:margin:add']">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['project:margin:edit']"-->
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
      <!--          v-hasPermi="['project:margin:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['project:margin:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="marginList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="业务名称" align="center" prop="stName" />
      <el-table-column label="项目编号" align="center" prop="serialNo" />
      <el-table-column label="保证金对象" align="center" prop="type" />
      <el-table-column label="保证金类型" align="center" prop="obj" />
      <el-table-column label="客户名称" align="center" prop="terminalName" />
      <el-table-column label="保证金金额" align="center" prop="putPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.putPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="退还/回收金额(元)" align="center" prop="outPrice">
        <template slot-scope="scope">
          {{
          Number(scope.row.outPrice)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="资金状态" align="center" prop="zjState" :formatter="zjStateFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleLook(scope.row)"
            v-hasPermi="['project:margin:edit']">查看</el-button>
          <el-button v-if="scope.row.zjState == '1' && scope.row.type == '上游'" size="mini" type="text"
            icon="el-icon-edit" @click="handleBack(scope.row)" v-hasPermi="['project:margin:edit']">退还</el-button>
          <el-button v-if="scope.row.zjState == '1' && scope.row.type == '下游'" size="mini" type="text"
            icon="el-icon-edit" @click="handleBack(scope.row)" v-hasPermi="['project:margin:edit']">回收</el-button>
          <el-button v-if="scope.row.state === '3'" size="mini" type="text" icon="el-icon-printer"
            @click="handlePrint(scope.row)">打印</el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['project:margin:edit']"-->
          <!--          >修改</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['project:margin:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改保证金对话框 -->
    <el-dialog v-if="title=='退还/回收保证金'" :title="title" :visible.sync="open" width="500px" append-to-body
      @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="保证金对象" prop="type">
                <el-radio-group v-model="form.type" @change="typchange">
                  <el-radio label="上游">上游</el-radio>
                  <el-radio label="下游">下游</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保证金类型" prop="obj">
                <el-select filterable clearable v-model="form.obj" placeholder="请选择" style="width: 100%">
                  <el-option label="履约保证金" value="履约保证金"></el-option>
                  <el-option label="投标保证金" value="投标保证金"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.type == '上游'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectId">
                  <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                    placeholder="请选择项目" style="width: 100%">
                    <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务名称" prop="stId">
                  <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                    style="width: 100%">
                    <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj">
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
                <el-form-item label="合同名称" prop="contractName">
                  <el-select filterable v-model="form.contractName" placeholder="请选择合同" style="width: 100%">
                    <el-option v-for="obj in contractNameOptions" :key="obj.stName + obj.name"
                      :label="obj.stName + obj.name" :value="obj.stName + obj.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商名称" prop="terminalName">
                  <el-select filterable v-model="form.terminalName" placeholder="请选择供应商" style="width: 100%">
                    <el-option v-for="obj in supplierNameOptions" :key="obj.name" :label="obj.name" :value="obj.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保证金金额(元)" prop="putPrice">
                  <el-input v-model="form.putPrice" placeholder="请输入保证金金额" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '下游'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectId">
                  <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                    placeholder="请选择项目" style="width: 100%">
                    <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务名称" prop="stId">
                  <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                    style="width: 100%">
                    <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj">
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
                <el-form-item label="合同名称" prop="contractName">
                  <el-select filterable v-model="form.contractName" placeholder="请选择合同" style="width: 100%">
                    <el-option v-for="obj in contractNameOptions" :key="obj.stName + obj.name"
                      :label="obj.stName + obj.name" :value="obj.stName + obj.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户名称" prop="terminalName">
                  <el-select filterable v-model="form.terminalName" placeholder="请选择客户" style="width: 100%">
                    <el-option v-for="obj in terminalNameOptions" :key="obj.name" :label="obj.name" :value="obj.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保证金金额(元)" prop="putPrice">
                  <el-input v-model="form.putPrice" placeholder="请输入保证金金额" />
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
            <div v-if="form.serType == '是'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保底服务费期限(天)" prop="mfsp">
                    <el-input v-model="form.mfsp" placeholder="请输入保底服务费期限" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年服务费率(%)" prop="rateYear">
                    <el-input v-model="form.stRate" placeholder="请输入年服务费率" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付日期" prop="putTime">
                  <el-date-picker clearable size="small" style="width: 100%" v-model="form.putTime" type="date"
                    value-format="yyyy-MM-dd" placeholder="选择支付日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="isLook == 4 || (isLook == 3 && this.form.zjState == '2')">
          <el-row>
            <el-col :span="12">
              <el-form-item label="退还/回收保证金金额" prop="outPrice">
                <el-input style="width:250px" v-model="form.outPrice" placeholder="请输入退还/回收保证金金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回收/退还日期" prop="outTime">
                <el-date-picker clearable size="small" style="width: 250px" v-model="form.outTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择回收日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="isDisabled" v-if="isLook != 3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="title!='退还/回收保证金'" :title="title" :visible.sync="open" width="773px" append-to-body
      @opened="handleOpen">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div v-if="isLook != 4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="保证金对象" prop="type">
                <el-radio-group v-model="form.type" @change="typchange">
                  <el-radio label="上游">上游</el-radio>
                  <el-radio label="下游">下游</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保证金类型" prop="obj">
                <el-select filterable clearable v-model="form.obj" placeholder="请选择" style="width: 100%">
                  <el-option label="履约保证金" value="履约保证金"></el-option>
                  <el-option label="投标保证金" value="投标保证金"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.type == '上游'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectId">
                  <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                    placeholder="请选择项目" style="width: 100%">
                    <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务名称" prop="stId">
                  <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                    style="width: 100%">
                    <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj">
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
                <el-form-item label="合同名称" prop="contractName">
                  <el-select filterable v-model="form.contractName" placeholder="请选择合同" style="width: 100%">
                    <el-option v-for="obj in contractNameOptions" :key="obj.stName + obj.name"
                      :label="obj.stName + obj.name" :value="obj.stName + obj.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商名称" prop="terminalName">
                  <el-select filterable v-model="form.terminalName" placeholder="请选择供应商" style="width: 100%">
                    <el-option v-for="obj in supplierNameOptions" :key="obj.name" :label="obj.name" :value="obj.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保证金金额(元)" prop="putPrice">
                  <el-input v-model="form.putPrice" placeholder="请输入保证金金额" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="form.type == '下游'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectId">
                  <el-select filterable value-key="projectId" @change="changeProject" v-model="form.projectId"
                    placeholder="请选择项目" style="width: 100%">
                    <el-option v-for="pro in listForProArr" :key="pro.projectId" :label="pro.projectName" :value="pro">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="业务名称" prop="stId">
                  <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择业务"
                    style="width: 100%">
                    <el-option v-for="obj in listForBusArr" :key="obj.stId" :label="obj.stName" :value="obj">
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
                <el-form-item label="客户名称" prop="terminalName">
                  <el-select filterable v-model="form.terminalName" placeholder="请选择客户" style="width: 100%">
                    <el-option v-for="obj in terminalNameOptions" :key="obj.name" :label="obj.name" :value="obj.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保证金金额(元)" prop="putPrice">
                  <el-input v-model="form.putPrice" placeholder="请输入保证金金额" />
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
            <div v-if="form.serType == '是'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="保底服务费期限(天)" prop="mfsp">
                    <el-input v-model="form.mfsp" placeholder="请输入保底服务费期限" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年服务费率(%)" prop="rateYear">
                    <el-input v-model="form.stRate" placeholder="请输入年服务费率" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付日期" prop="putTime">
                  <el-date-picker clearable size="small" style="width: 100%" v-model="form.putTime" type="date"
                    value-format="yyyy-MM-dd" placeholder="选择支付日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="isLook == 4 || (isLook == 3 && this.form.zjState == '2')">
          <el-row>
            <el-col :span="12">
              <el-form-item label="退还/回收保证金金额" prop="outPrice">
                <el-input v-model="form.outPrice" placeholder="请输入退还/回收保证金金额" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回收/退还日期" prop="outTime">
                <el-date-picker clearable size="small" style="width: 100%" v-model="form.outTime" type="date"
                  value-format="yyyy-MM-dd" placeholder="选择回收日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

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
              <td class="title" colspan="6">保证金信息</td>
            </tr>
            <tr>
              <td class="table-td-title detail">保证金对象</td>
              <td class="table-td-content">
                {{ printData.type }}
              </td>
              <td class="table-td-title detail">项目编号</td>
              <td class="table-td-content">
                {{ printData.number }}
              </td>
              <td class="table-td-title detail">保证金类型</td>
              <td class="table-td-content">
                {{ printData.obj }}
              </td>
            </tr>
            <template v-if="printData.type == '上游'">
              <tr>
                <td class="table-td-title detail">合同名称</td>
                <td class="table-td-content">
                  {{ printData.contractName }}
                </td>
                <td class="table-td-title detail">供应商名称</td>
                <td class="table-td-content">
                  {{ printData.terminalName }}
                </td>
                <td class="table-td-title detail">保证金金额(元)</td>
                <td class="table-td-content">
                  {{ $options.filters.moneyFilter(printData.putPrice) }}
                </td>
              </tr>
            </template>
            <template v-if="printData.type == '下游'">
              <tr>
                <td class="table-td-title detail">项目名称</td>
                <td class="table-td-content">
                  {{ printData.stName }}
                </td>
                <td class="table-td-title detail">合同名称</td>
                <td class="table-td-content">
                  {{ printData.contractName }}
                </td>
                <td class="table-td-title detail">客户名称</td>
                <td class="table-td-content">
                  {{ printData.terminalName }}
                </td>
              </tr>
              <tr>
                <td class="table-td-title detail">保证金金额(元)</td>
                <td class="table-td-content" colspan="5">
                  {{ $options.filters.moneyFilter(printData.putPrice) }}
                </td>
              </tr>
            </template>
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
          <approval-print :typeId="7" :stId="apyamentId" ></approval-print>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMargin,
  getMargin,
  delMargin,
  addMargin,
  updateMargin,
  getStList,
  getContractListAll,
  getTerminalListAll,
  getSupplierListAll,
  listForBus,
  listForPro,
} from "@/api/project/margin";
import { getToken } from "@/utils/auth";
import { getContract } from "@/api/project/apayment";
import print from "print-js";
import { getProcessDataByStId, getApprovalProcessList, getApprovalType } from "@/api/approve";
import { getContractList } from "@/api/project/all";

export default {
  name: "Margin",
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
      isLook: 1,
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
      // 保证金表格数据
      marginList: [],
      // 项目集合
      projectOptions: [],
      //合同集合
      contractNameOptions: [],
      //客户集合
      supplierNameOptions: [],
      //终端客户集合
      terminalNameOptions: [],
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
        type: null,
        stId: null,
        projectId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择业务名称", trigger: "blur" }],
        projectId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        contractName: [
          { required: true, message: "请选择合同", trigger: "blur" },
        ],
        terminalName: [
          { required: true, message: "请选择供应商/客户名称", trigger: "blur" },
        ],
        putPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        serPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        putTime: [
          { required: true, message: "请选择支付时间", trigger: "blur" },
        ],
        outPrice: [
          { required: true, validator: validatePrice, trigger: "blur" },
        ],
        outTime: [
          { required: true, message: "请选择回收/退还时间", trigger: "blur" },
        ],
        mfsp: [{ required: true, validator: validatePrice4, trigger: "blur" }],
        stRate: [{ required: true, validator: validatePrice, trigger: "blur" }],
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
    let data = {};
    getContractListAll(data).then((response) => {
      this.contractNameOptions = response.rows;
    });
    getTerminalListAll(data).then((response) => {
      this.terminalNameOptions = response.rows;
    });
    getSupplierListAll(data).then((response) => {
      this.supplierNameOptions = response.rows;
    });

    if (
      this.$route.params.isEdit != null &&
      this.$route.params.isEdit == "true"
    ) {
      let marginId = this.$route.params.marginId;
      let row = { marginId: marginId };
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
    /** 查询保证金列表 */
    getList() {
      this.loading = true;
      listMargin(this.queryParams).then((response) => {
        this.marginList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      // 业务
      listForBus().then((response) => {
        this.listForBusArr = response.data
      })
      // 项目
      listForPro().then((response) => {
        this.listForProArr = response.data
      })
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    zjStateFormat(row, column) {
      if (row.type == "上游") {
        if (row.zjState == "1") {
          return "未退还";
        } else {
          return "已退还";
        }
      } else {
        if (row.zjState == "1") {
          return "未回收";
        } else {
          return "已回收";
        }
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
        marginId: null,
        obj: null,
        type: null,
        stId: null,
        stId2: null,
        stName: null,
        contractName: null,
        terminalName: null,
        putPrice: null,
        serType: null,
        serPrice: null,
        putTime: null,
        outPrice: null,
        outTime: null,
        zjState: null,
        state: null,
        createBy: null,
        createTime: null,
        hkState: null,
        stRate: null,
        mfsp: null,
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
      this.ids = selection.map((item) => item.marginId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      getApprovalType({ approvalType: '7' }).then((response) => {
        this.reset();
        this.fileList = [];
        this.form.type = "上游";
        this.form.serType = "是";
        this.form.hkState = 1;
        (this.isLook = 1), (this.open = true);
        this.title = "添加保证金";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileList = [];
      const marginId = row.marginId || this.ids;
      getMargin(marginId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.fileList = this.form.fileList;
        this.form.hkState = 1;
        (this.isLook = 1), (this.open = true);
        this.title = "修改保证金";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.fileList = [];
      const marginId = row.marginId || this.ids;
      this.$router.push("/margin/look/" + marginId);
    },
    /** 退还/回收按钮操作 */
    handleBack(row) {
      this.reset();
      this.fileList = [];
      const marginId = row.marginId || this.ids;
      getMargin(marginId).then((response) => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.fileList = this.form.fileList;
        this.form.outPrice = null;
        this.form.outTime = null;
        this.form.hkState = 2;
        (this.isLook = 4), (this.open = true);
        this.title = "退还/回收保证金";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.stId = this.form.stId2;
          this.form.projectId = this.form.projectIdOld
          if (this.form.marginId != null) {
            updateMargin(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMargin(this.form).then((response) => {
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
      const marginIds = row.marginId || this.ids;
      this.$confirm("是否确认删除保证金?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMargin(marginIds);
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
        "project/margin/export",
        {
          ...this.queryParams,
        },
        `project_margin.xlsx`
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
    //选择项目
    changeProject(pro) {
      this.form.projectIdOld = pro.projectId;
    },
    changeSt(obj) {
      this.contractNameOptions = [];
      this.form.stId2 = obj.stId;
      this.form.stName = obj.stName;
      this.form.serialNo = obj.serialNo;
      this.$set(this.form, "number", obj.number);
      let data = { stId: obj.stId };
      getContractListAll(data).then((response) => {
        this.contractNameOptions = response.rows;
      });

      //成本年服务费率
      if (obj.chargemType == "1" || obj.chargemType == "3") {
        this.form.stRate = obj.chargemNx;
      } else {
        this.form.stRate = 0;
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
    },
    //选择类型
    typchange() {
      this.form.contractName = null;
      this.form.terminalName = null;
      this.contractNameOptions = [];
      let data = {};
      if (this.form.type != null && this.form.type == "下游") {
        if (this.form.stId2 != null && this.form.stId2 != "") {
          data = { stId: this.form.stId2 };
          getContractListAll(data).then((response) => {
            this.contractNameOptions = response.rows;
          });
        } else {
        }
      } else {
        getContractListAll(data).then((response) => {
          this.contractNameOptions = response.rows;
        });
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
      this.apyamentId = row.marginId
      this.printData = {};
      await getMargin(row.marginId).then((response) => {
        this.printData = response.data;
        this.printData.fileList = response.data.fileList;
        this.printData.printType = "保证金";
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
  },
};
</script>
