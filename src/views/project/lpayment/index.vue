<style>
.ic .el-input__inner{
  color: red;
}
</style>
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
      <el-form-item label="运输方式" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择运输类型" clearable size="small">
          <el-option label="汽运" value="汽运" />
          <el-option label="火运" value="火运" />
        </el-select>
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
          v-hasPermi="['project:lpayment:add']"
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
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:lpayment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lpaymentList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="运输类型" align="center" prop="type" />
      <el-table-column label="实付金额(元)" align="center" prop="tntPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.tntPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="回款状态" align="center" prop="outPrice" :formatter="outFormat"/>
      <el-table-column label="回款金额" align="center" prop="outPrice" >
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
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:lpayment:edit']"
          >查看</el-button>
          <el-button
            v-if="scope.row.state=='3' && scope.row.outPrice < scope.row.tntPrice"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleHk(scope.row)"
            v-hasPermi="['project:lpayment:edit']"
          >回款</el-button>
          <el-button
            v-if="scope.row.state=='3' && scope.row.fkState=='未付款'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateFkState(scope.row)"
            v-hasPermi="['project:lpayment:edit']"
          >付款</el-button>
          <el-button
            v-if="scope.row.state=='3' && scope.row.putTime!=null && scope.row.fkState=='未付款'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateOk(scope.row)"
            v-hasPermi="['project:lpayment:edit']"
          >完成</el-button>
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

    <!-- 添加或修改物流付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook!=4 && isLook!=5">
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
          <el-col :span="12">
            <el-form-item label="项目编号" prop="name">
              {{ form.number }}
            </el-form-item>
          </el-col>
        </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="第三方公司" prop="tpcId">
                <el-select filterable value-key="stId" @change="changeTpc" v-model="form.tpcId" placeholder="请选择第三方公司" style="width: 100%;">
                  <el-option
                    v-for="obj in tpcOptions"
                    :key="obj.tpcId"
                    :label="obj.name"
                    :value="obj"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司账号" prop="account">
                <el-input v-model="form.account"  placeholder="请输入公司账号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司开户行" prop="openbank">
                <el-input v-model="form.openbank"  placeholder="请输入公司开户行" />
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

          <el-row v-if="isLook==1">
            <el-col :span="12">
              <el-form-item label="实付金额" prop="tntPrice" >
                <el-input   v-model="form.tntPrice"  placeholder="请输入实付金额" />
              </el-form-item>
            </el-col>
          </el-row>
        <el-row v-if="isLook==2">
          <el-col :span="12">
            <el-form-item label="实付金额" prop="tntPrice" >
              <span v-text="form.tntPrice"></span>
            </el-form-item>
          </el-col>
        </el-row>

        <!--        选择入库单-->
        <div v-if="false">
          <el-popover
            placement="bottom-start"
            width="100%"
            @selection-change="grnSelectionChange"
            v-model="visible"
            popper-class="area_popper">
            <el-button type="primary" slot="reference" style="margin-bottom: 30px;"  v-if="isLook!=3">选择入库单</el-button>
            <el-table
              ref="singleTable"
              :data="tableData"
              @selection-change="grnSelectionChange"
              style="width: 100%;"
            >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                property="name"
                label="货品名称"
                width="120">
              </el-table-column>
              <el-table-column
                property="grnNumber"
                label="入库重量（吨）"
                width="120">
              </el-table-column>
              <el-table-column
                property="grnRz"
                label="入库热值（kcal）"
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
                property="deliveryTime"
                label="发货日期（吨）"
                width="120">
              </el-table-column>

            </el-table>
            <div style="margin-top: 20px">
              <el-button type="primary"  style="float: right"  @click="toggleSelection()">确认选择</el-button>
            </div>
          </el-popover>
        </div>
        <!--        显示入库单-->
        <div  v-if="false" style="margin-bottom: 30px">
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
              property="grnRz"
              label="热值（kcal）"
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
              property="deliveryTime"
              label="发/到货日期（吨）"
              width="120">
            </el-table-column>
            <el-table-column
              property="valuePrice"
              label="货值单价（元）"
              width="90">
            </el-table-column>
            <el-table-column
              property="valueTprice"
              label="货值总额（吨）"
              width="90">
            </el-table-column>
            <el-table-column
              v-if="noedit!=2"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--物流收票明细-->
        <el-row v-if="false">
          <el-col :span="12">
            <el-button type="primary" @click="addTableData" style="margin-bottom: 30px;">追加费用</el-button>
          </el-col>
        </el-row>
        <div v-if="false" style="margin-bottom: 30px">
          <el-row>
            <el-col :span="24">
              <el-table
                ref="wlsingleTable"
                :data="form.wldetailsList"
                :key="tableUpdate"
                style="width: 100%">
                <el-table-column label="发票号">
                  <template slot-scope="scope">
                    <el-form-item label-width="0"  :prop="'wldetailsList.' + scope.$index + '.number'" :rules='rules.number'>
                      <el-input  v-model="scope.row.number" placeholder="请输入发票号" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="费用名称">
                  <template slot-scope="scope">
                    <el-form-item label-width="0"  :prop="'wldetailsList.' + scope.$index + '.wlType'" :rules='rules.wlType'>
                      <el-select v-model="scope.row.wlType">
                        <el-option label="运费金额" value="运费金额" />
                        <el-option label="装卸服务费"  value="装卸服务费" />
                        <el-option label="站台费"  value="站台费" />
                        <el-option label="保险费"  value="保险费" />
                        <el-option label="取送车费"  value="取送车费" />
                        <el-option label="印花税"  value="印花税" />
                        <el-option label="其他"  value="其他" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="不含税金额">
                  <template slot-scope="scope">
                    <el-form-item label-width="0"  :prop="'wldetailsList.' + scope.$index + '.ntPrice'" :rules='rules.ntPrice'>
                      <el-input @change="jsTaxPrice(scope.$index)" v-model="scope.row.ntPrice" placeholder="请输入不含税金额"/>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="税率">
                  <template slot-scope="scope">
                    <el-form-item label-width="0"  :prop="'wldetailsList.' + scope.$index + '.tax'" :rules='rules.tax'>
                      <el-select  @change="jsTaxPrice(scope.$index)" v-model="scope.row.tax">
                        <el-option label="1%" value="1" />
                        <el-option label="3%"  value="3" />
                        <el-option label="6%"  value="6" />
                        <el-option label="9%"  value="9" />
                        <el-option label="13%"  value="13" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="税额">
                  <template slot-scope="scope">
                    <el-form-item label-width="0"  :prop="'wldetailsList.' + scope.$index + '.taxPrice'" :rules='rules.taxPrice'>
                      <el-input disabled v-model="scope.row.taxPrice" placeholder="请输入税额"/>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteWlRow(scope.$index, form.wldetailsList)"
                      type="text"
                      size="small">
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
              <el-input   v-model="form.tntPrice"  placeholder="请输入不含税金额合计" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="false" class="ic">
          <el-col :span="12">
            <el-form-item label="补税金额" prop="bsPrice">
              <el-input   v-model="form.bsPrice"  placeholder="请输入补税金额" />
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
                  <el-button size="small" type="primary" v-if="isLook!=3">点击上传</el-button>
                  <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isLook==4">
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
                <el-date-picker clearable size="small" style="width: 100%;"
                                v-model="form.outTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择回款日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="isLook==5">
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

        <div v-if="form.serType=='是'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="支付日期" prop="putTime" >
                <el-date-picker clearable size="small" style="width: 100%;"
                                v-model="form.putTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择支付日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年服务费费率(%)" prop="stRate">
                <el-input v-model="form.stRate" placeholder="请输入年服务费费率(%)" />
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
        <el-button type="primary" @click="submitForm" v-if="isLook!=3">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLpayment, getLpayment, delLpayment, addLpayment, updateLpayment,getStList,getTpcList } from "@/api/project/lpayment";
import {getContract, getGrnList} from "@/api/project/apayment";
import {getToken} from "@/utils/auth";

export default {
  name: "Lpayment",
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
    const validatePrice4 = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/
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
      tableUpdate:false,
      isLook:1,
      noedit:1,
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //选择框状态
      visible:false,
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
      contractNameOptions:[],
      // 项目集合
      stOptions: [],
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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        tpcId: [
          { required: true, message: "请选择第三方公司", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入公司账号", trigger: "blur" }
        ],
        openbank: [
          { required: true, message: "请输入公司开户行", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择运输方式", trigger: "blur" }
        ],
        yPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        yRate: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        ztType: [
          { required: true, message: "请选择站台费", trigger: "blur" }
        ],
        ztPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        ztRate: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        otherType: [
          { required: true, message: "请选择其他费用", trigger: "blur" }
        ],
        otherPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        otherRate: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        serType: [
          { required: true, message: "请选择服务费", trigger: "blur" }
        ],
        putTime: [
          { required: true, message: "请选择支付日期", trigger: "blur" }
        ],
        stRate: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        mfsp: [
          { required: true, validator:validatePrice4, trigger: "blur" }
        ],
        outPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        outTime: [
          { required: true, message: "请选择回款时间", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入发票号", trigger: "blur" }
        ],
        wlType: [
          { required: true, message: "请选择费用名称", trigger: "blur" }
        ],
        ntPrice: [
          { required: true, message: "请输入不含税金额", trigger: "blur" }
        ],
        tax: [
          { required: true, message: "请选择税率", trigger: "blur" }
        ],
        taxPrice: [
          { required: true, message: "请输入税额", trigger: "blur" }
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
    getTpcList().then(response => {
      this.tpcOptions = response.rows;
    });
    if(this.$route.params.isEdit!=null && this.$route.params.isEdit=="true"){
      let lpaymentId=this.$route.params.lpaymentId
      let row={"lpaymentId":lpaymentId}
      this.handleUpdate(row)
    }
    if(this.$route.params.isAdd!=null && this.$route.params.isAdd=="true"){
      this.handleAdd()
    }
  },
  methods: {
    /** 查询物流付款列表 */
    getList() {
      this.loading = true;
      listLpayment(this.queryParams).then(response => {
        this.lpaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
      });
      getTpcList().then(response => {
        this.tpcOptions = response.rows;
      });
    },
    // 审核状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 回款状态
    outFormat(row, column) {
      if(row.outPrice!=null && row.outPrice!='' && parseFloat(row.outPrice)>=parseFloat(row.tntPrice)){
        return "已回款"
      }else {
        return "未回款"
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
        stRate: null,
        mfsp: null,
        outPrice: null,
        outTime: null,
        state: null,
        createBy: null,
        createTime: null,
        hkState:null,
        grnList:[],
        fileList:[],
        contractId:null,
        contractName:null,
        wldetailsList:[],
        taxTotalPrice:null,
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
      this.ids = selection.map(item => item.lpaymentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.wldetailsList=[];
      this.fileList=[];
      this.tableData=[];
      this.form.type="汽运";
      this.form.ztType="有";
      this.form.otherType="有";
      this.form.serType="是";
      this.tableData=[];
      this.tablegryData=[];
      this.tableselData=[];
      this.noedit=1;
      this.isLook=1;
      this.form.hkState=1;
      this.open = true;
      this.title = "添加物流付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.wldetailsList=[];
      this.fileList=[];
      this.tableData=[];
      this.tablegryData=[];
      this.tableselData=[];
      const lpaymentId = row.lpaymentId || this.ids
      getLpayment(lpaymentId).then(response => {
        this.form = response.data;
        this.fileList = this.form.fileList;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.tpcId2 = this.form.tpcId;
        this.form.tpcId = this.form.tpcName;
        this.tableselData = response.data.selnyList;
        this.isLook=2;
        this.form.hkState=1;
        this.open = true;
        this.title = "修改物流付款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tableData=[];
      this.tablegryData=[];
      this.tableselData=[];
      const lpaymentId = row.lpaymentId || this.ids
      this.$router.push("/lpayment/look/" + lpaymentId);
    },
    /** 回款按钮操作 */
    handleHk(row) {
      this.reset();
      this.tableData=[];
      this.tablegryData=[];
      this.tableselData=[];
      const lpaymentId = row.lpaymentId || this.ids
      getLpayment(lpaymentId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.form.tpcId2 = this.form.tpcId;
        this.form.tpcId = this.form.tpcName;
        this.form.outPrice=null;
        this.form.outTime=null;
        this.isLook=4;
        this.form.hkState=2;
        this.open = true;
        this.title = "回款物流付款";
      });
    },

    /** 付款按钮操作 */
    handleUpdateFkState(row) {
      this.reset();
      const lpaymentId = row.lpaymentId || this.ids
      getLpayment(lpaymentId).then(response => {
        this.form = response.data;
        this.isLook=5;
        this.form.hkState=1;
        this.open = true;
        this.title = "修改物流付款";
      });
    },

    /** 完成按钮操作 */
    handleUpdateOk(row) {
      this.reset();
      const lpaymentId = row.lpaymentId || this.ids
      getLpayment(lpaymentId).then(response => {
        this.form = response.data;
        this.form.fkState='已付款'
        updateLpayment(this.form).then(response => {
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
          this.form.stId=this.form.stId2
          this.form.tpcId=this.form.tpcId2
          if(this.noedit!=2){
            this.form.grnList=this.tableselData
          }else{
            this.form.grnList=[]
          }

          if (this.form.lpaymentId != null) {
            updateLpayment(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLpayment(this.form).then(response => {
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
      const lpaymentIds = row.lpaymentId || this.ids;
      this.$confirm('是否确认删除物流付款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLpayment(lpaymentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/lpayment/export', {
        ...this.queryParams
      }, `project_lpayment.xlsx`)
    },

    //业务开始
    //选择项目
    changeSt(obj){
      this.tableData=[];
      this.form.stId2 = obj.stId
      this.form.stName = obj.name
      this.$set(this.form,'number',obj.number)
      let data = {"stId": obj.stId, "wlState": "1"};
      getGrnList(data).then(response => {
        this.tableData = response.rows;
      });

      // getContractListAll(data).then(response => {
      //   this.contractNameOptions = response.rows;
      // });

      //成本年服务费率
      if(obj.chargemType=='1' || obj.chargemType=='3'){
        console.log(obj)
        this.form.stRate=obj.chargemNx
      }else{
        this.form.stRate=0
      }


      //查询委托销售合同
      let c1 = {"stId": obj.stId, "type": "1"};
      getContract(c1).then(response => {
        if(response.data!=null){
          //保底服务费期限
          this.form.mfsp = response.data.mfsp
        }else{
          this.form.mfsp = 0
        }
      });
    },

    //选择第三方公司
    changeTpc(obj) {
      this.form.tpcId2 = obj.tpcId
      this.form.tpcName = obj.name
      this.form.account = obj.account
      this.form.openbank = obj.openbank
    },

    //选中数据
    grnSelectionChange(selection) {
      this.tableybData=[];
      this.tableybData=selection;
    },
    //移除选中数据
    deleteRow(index, rows) {
      this.tableselData.splice(index, 1);
    },
    //确认选择数据
    toggleSelection() {
      this.tableselData=this.tableybData;
      this.visible = false;
    },
    //计算运费
    jsy(){
      let yp=0
      let yr=0
      if(this.form.yPrice!=null && this.form.yPrice!=''){
        yp=this.form.yPrice
      }
      if(this.form.yRate!=null && this.form.yRate!=''){
        yr=this.form.yRate
      }
      this.form.yTax=(yp*yr/100).toFixed(2)
      this.form.yTprice=parseFloat(yp)+parseFloat(this.form.yTax)
    },
    //计算站台
    jszt(){
      let ztp=0
      let ztr=0
      if(this.form.ztPrice!=null && this.form.ztPrice!=''){
        ztp=this.form.ztPrice
      }
      if(this.form.ztRate!=null && this.form.ztRate!=''){
        ztr=this.form.ztRate
      }
      this.form.ztTax=(ztp*ztr/100).toFixed(2)
      this.form.ztTprice=parseFloat(ztp)+parseFloat(this.form.ztTax)
    },
    //计算其他
    jsother(){
      let otherp=0
      let otherr=0
      if(this.form.otherPrice!=null && this.form.otherPrice!=''){
        otherp=this.form.otherPrice
      }
      if(this.form.otherRate!=null && this.form.otherRate!=''){
        otherr=this.form.otherRate
      }
      this.form.otherTax=(otherp*otherr/100).toFixed(2)
      this.form.otherTprice=parseFloat(otherp)+parseFloat(this.form.otherTax)
    },

    //溢出选中数据
    deleteWlRow(index, rows) {
      this.form.wldetailsList.splice(index, 1);
    },
    //追加费用
    addTableData(){
      if (this.form.wldetailsList == undefined) {
        this.form.wldetailsList = new Array();
      }
      let obj = {};
      this.form.wldetailsList.push(obj);
    },
    jsTaxPrice(index){
      let obj=this.form.wldetailsList[index]
      if(obj.ntPrice!=null && obj.ntPrice!='' && obj.tax!=null && obj.tax!=''){
        this.form.wldetailsList[index].taxPrice=(parseFloat(obj.ntPrice)* (parseFloat(obj.tax)/100)).toFixed(2)

      }
      this.jsTotal();
    },
    jsTotal(){
      let tntPrice=0.00
      let bsPrice=0.00
      let taxTotalPrice=0.00
      for(let i=0;i<this.form.wldetailsList.length;i++){
        let obj=this.form.wldetailsList[i]
        if(obj.taxPrice!=null && obj.taxPrice!='' && obj.ntPrice!=null && obj.ntPrice!=''){
          tntPrice=parseFloat(tntPrice)+parseFloat(obj.ntPrice)
          // bsPrice=parseFloat(bsPrice)+parseFloat(obj.taxPrice)
          // 不含税金额*（0.13-税率）*1.12
          bsPrice=(parseFloat(bsPrice)+parseFloat(obj.ntPrice)*(0.13-(parseFloat(obj.tax)/100))*1.12).toFixed(2)

          taxTotalPrice=parseFloat(taxTotalPrice)+parseFloat(obj.taxPrice)
        }
      }

      this.form.tntPrice=tntPrice
      this.form.bsPrice=bsPrice
      this.form.taxTotalPrice=taxTotalPrice
      if(this.tableUpdate){
        this.tableUpdate=false
      }else{
        this.tableUpdate=true
      }
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
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList=[];
        for(var i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined) {
            var name = filelist[i].response.data.name;
            var url = filelist[i].response.data.url;
            var art = {"name": name, "url": url};
            this.form.fileList.push(art);
          }else {
            var name = filelist[i].name;
            var url = filelist[i].url;
            var art = {"name": name, "url": url};
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
  }
};
</script>
