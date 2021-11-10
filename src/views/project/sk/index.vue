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
          v-hasPermi="['project:sk:add']"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="skList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="收款类型" align="center" prop="skType" />
      <el-table-column label="合计重量(吨)" align="center" prop="tweight" />
      <el-table-column label="收款单价" align="center" prop="skPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.skPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="收款总额(元)" align="center" prop="skTprice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.skTprice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="实际应收金额" align="center" prop="sjPrice" >
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
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat"/>
<!--      <el-table-column label="收款状态" align="center" prop="skState" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
            v-hasPermi="['project:sk:edit']"
          >查看</el-button>
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

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改收款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <div v-if="isLook!=4">
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
            <el-form-item label="收款类型" prop="skType">
              <el-select v-model="form.skType"  placeholder="请选择收款类型" style="width: 100%">
                <el-option label="收款"  value="收款" >收款</el-option>
                <el-option label="预收款" value="预收款" >预收款</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="this.form.skType=='收款'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="收款方式" prop="skWay">
              <el-select v-model="form.skWay" @change="toggleSelection" placeholder="请选择收款方式" style="width: 100%">
                <el-option label="吨"  value="吨" >吨</el-option>
                <el-option label="热值" value="热值" >热值</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.skWay=='热值'">
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
          <el-popover
            placement="bottom-start"
            width="100%"
            @selection-change="grnSelectionChange"
            v-model="visible"
            popper-class="area_popper">
            <el-button type="primary" slot="reference" style="margin-bottom: 30px;" v-if="isLook!=3">选择出库单</el-button>
            <el-table
              ref="singleTable1"
              :data="tablegryData"
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
                label="出库重量（吨）"
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
                label="到货日期"
                width="120">
              </el-table-column>

            </el-table>
            <div style="margin-top: 20px">
              <el-button type="primary"  style="float: right"  @click="toggleSelection()">确认选择</el-button>
            </div>
          </el-popover>
        </div>
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
              label="出库重量（吨）"
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
              label="到货日期"
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
            <el-table-column
              v-if="isLook!=3"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableselData,scope)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
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
                <span style="margin-left: 20px;">挥发份Vdaf：<span style="color: red" v-text="form.jc11">0.00</span></span>
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
            <el-form-item label="收款总额(元)" prop="skTprice">
              <el-input @change="jspay" v-model="form.skTprice" placeholder="请输入收款总额(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收款单价" prop="skPrice">
              <el-input @change="jsdj"  v-model="form.skPrice" placeholder="请输入收款单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税款" prop="tax">
              <el-input  v-model="form.tax" placeholder="请输入税款(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际应收金额" prop="sjPrice">
              <el-input v-model="form.sjPrice" placeholder="请输入实际应收金额" />
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
        <div v-if="this.form.skType=='预收款'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预收金额(元)" prop="yfPrice">
              <el-input  v-model="form.yfPrice" placeholder="请输入预收金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收款日期" prop="skTime">
              <el-date-picker clearable size="small" style="width: 100%"
                              v-model="form.skTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择收款日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
        </div>
        <div v-if="isLook==4">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款日期" prop="skTime">
                <el-date-picker clearable size="small" style="width: 100%"
                                v-model="form.skTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择收款日期">
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
  </div>
</template>

<script>
import { listSk, getSk, delSk, addSk, updateSk,getStList,getGryList,getContract } from "@/api/project/sk";
import {getToken} from "@/utils/auth";

export default {
  name: "Sk",
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
    // 无两位小数点
    const validatePrice2 = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(!reg.test(value)){
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
    // 四位小数点验证
    const validatePrice5 = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,4})?$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(value!=0 && (value==null || value=="")){
        callback(new Error('不能为空'))
      }else if(!reg.test(value)){
        callback(new Error('请输入正确格式'))
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
      stOptions: [],
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
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        skType: [
          { required: true, message: "请选择收款类型", trigger: "blur" }
        ],
        skWay: [
          { required: true, message: "请选择收款方式", trigger: "blur" }
        ],
        rzPrice: [
          { required: true, validator:validatePrice5, trigger: "blur" }
        ],
        skTprice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        skPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        tax: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        skTime: [
          { required: true, message: "请选择收款日期", trigger: "blur" }
        ],
        accept: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        punish: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        otherP: [
          { validator:validatePrice3, trigger: "blur" }
        ],
        otherN: [
          {  message: "其他扣罚说明", trigger: "blur" }
        ],
        yftotalPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        yfPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ],
        sjPrice: [
          { required: true, validator:validatePrice, trigger: "blur" }
        ]
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
      let skId=this.$route.params.skId
      let row={"skId":skId}
      this.handleUpdate(row)
    }
    if(this.$route.params.isAdd!=null && this.$route.params.isAdd=="true"){
      this.handleAdd()
    }
  },
  methods: {
    /** 查询收款列表 */
    getList() {
      this.loading = true;
      listSk(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.skList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
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
        skId: null,
        stId: null,
        stName: null,
        skType: null,
        skWay: null,
        rzPrice: null,
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
        gryList:[],
        fileList:[]
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
      this.ids = selection.map(item => item.skId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.tablegryData=[],
      this.tableselData=[],
      this.tableybData=[],
      this.fileList=[];
      this.form.skType='收款';
      this.form.skWay='吨';
      this.form.skTprice=0;
      this.form.yftotalPrice=0;
      this.form.tax=0;
      this.form.tweight=0;
      this.form.prz=0;
      this.form.skPrice=0;
      this.form.yfPrice=0;
      this.isLook = 1
      this.open = true;
      this.title = "添加收款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const skId = row.skId || this.ids
      getSk(skId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.tableselData = response.data.selnyList;
        this.fileList = this.form.fileList;
        this.isLook = 1
        this.open = true;
        this.title = "修改收款";
      });
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tablegryData=[],
      this.ableselData=[],
      this.tableybData=[],
      this.fileList=[];
      const skId = row.skId || this.ids
      this.$router.push("/sk/look/" + skId);
    },
    /** 修改按钮操作 */
    handleUpdateSkTime(row) {
      this.reset();
      const skId = row.skId || this.ids
      getSk(skId).then(response => {
        this.form = response.data;
        this.isLook = 4
        this.open = true;
        this.title = "修改收款";
      });
    },
    /** 修改按钮操作 */
    handleUpdateSkState(row) {
      this.reset();
      const skIds = row.skId || this.ids;
      let self = this
      this.$confirm('是否确定完成收款?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        self.submitFormSk(skIds);
      })
    },
    submitFormSk(id) {
      getSk(id).then(response => {
        this.form = response.data;
        this.form.skState = '已收款';
        updateSk(this.form).then(response => {
          this.msgSuccess("已款成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.isLook!=4){
            this.form.stId=this.form.stId2
            if(this.form.skType=='收款'){
              if(this.tableselData.length<1){
                this.msgError("请选择出库单")
                return
              }
              this.form.gryList=this.tableselData
            }
          }else{

          }
          if (this.form.skId != null) {
            updateSk(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSk(this.form).then(response => {
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
      const skIds = row.skId || this.ids;
      this.$confirm('是否确认删除收款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSk(skIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/sk/export', {
        ...this.queryParams
      }, `project_sk.xlsx`)
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
      for(var i=0;i<filelist.length;i++){
        if (filelist[i].response != undefined) {
          var art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
          this.form.fileList.push(art);
        }else {
          var art = {"name": filelist[i].name, "url": filelist[i].url};
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
      console.log(filelist)
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
      this.tableybData=[];
      this.form.stId2 = obj.stId
      this.form.stName = obj.name

      //查询煤炭销售合同
      let c2 = {"stId": this.form.stId2, "type": "2"};
      getContract(c2).then(response => {
        if (response.data != null) {
          //预付单价 吨的预付单价
          this.form.skPrice = parseFloat(response.data.price).toFixed(2)
        }
      });

      //获取预收款
      if(this.form.skType=='收款'){
        this.form.yfPrice = obj.tqsk
      }
      this.tableselData=[];
      let data = {"stId": obj.stId, "skState": "1"};
      getGryList(data).then(response => {
        this.tablegryData = response.rows;
      });


      this.toggleSelection()
    },
    //选中数据
    grnSelectionChange(selection) {
      this.tableybData=[];
      this.tableybData=selection;
    },
    //溢出选中数据
    deleteRow(index, rows, obj) {
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
      this.tablegryData.map(item => {
        if (item.gryId === obj.row.gryId) {
          this.$refs.singleTable1.toggleRowSelection(item, false)
        }
      })
      this.jsta()
      this.jsdj()
      this.jspay()
    },
    //确认数据
    toggleSelection() {
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
      this.tableselData=this.tableybData;
      this.visible = false;
      this.jsta()
      this.jsdj()
      this.jspay()
    },

    //计算合计重量平均热值
    jsta(){
      let tgn=0;
      let tgr=0;
      if(this.tableybData.length>0){
        for(let i=0;i<this.tableybData.length;i++){
          tgn+=this.tableybData[i].grnNumber
          tgr+=this.tableybData[i].gryRz
        }
        this.form.tweight=tgn;
        this.form.prz=(tgr/this.tableybData.length).toFixed(2);
      }else{
        this.form.tweight=tgn.toFixed(2);
        this.form.prz=tgr.toFixed(2);
      }
    },
    //计算单价
    jsdj(){
      let re=0
      if(this.form.rewardp!=null && this.form.rewardp!=''){
        re=this.form.rewardp
      }
      if(this.form.skWay=='吨'){
        this.form.skPrice = (parseFloat(this.form.skPrice)+parseFloat(re)).toFixed(2)

        let tw=0;
        let ep=0
        if(this.form.tweight!=null && this.form.tweight!=''){
          tw=this.form.tweight;
        }
        if(this.form.skPrice!=null && this.form.skPrice!='') {
          ep = this.form.skPrice;
        }
        //收款总额 单价*重量
        this.form.skTprice=(tw*ep).toFixed(2);
        //计算税款
        this.form.tax=(tw*ep/1.13*0.13).toFixed(2);

        this.jspay()

      }else if(this.form.skWay=='热值'){
        console.log(this.form.rzPrice+"--"+this.form.averageRz)
        if(this.form.rzPrice!=null && this.form.rzPrice!='' && this.form.prz!=null && this.form.prz!=''){
          this.form.skPrice = (this.form.rzPrice*this.form.prz+parseFloat(re)).toFixed(2);

          let tw=0;
          let ep=0
          if(this.form.tweight!=null && this.form.tweight!=''){
            tw=this.form.tweight;
          }
          if(this.form.skPrice!=null && this.form.skPrice!='') {
            ep = this.form.skPrice;
          }
          //收款总额 单价*重量
          this.form.skTprice=(tw*ep).toFixed(2);
          //计算税款
          this.form.tax=(tw*ep/1.13*0.13).toFixed(2);
        }else {
          this.form.skPrice = 0

          let tw=0;
          let ep=0
          if(this.form.tweight!=null && this.form.tweight!=''){
            tw=this.form.tweight;
          }
          if(this.form.skPrice!=null && this.form.skPrice!='') {
            ep = this.form.skPrice;
          }
          //收款总额 单价*重量
          this.form.skTprice=(tw*ep).toFixed(2);
          //计算税款
          this.form.tax=(tw*ep/1.13*0.13).toFixed(2);
        }
        this.jspay()
      }else {
        this.form.skPrice = 0
        this.jspay()
      }


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
        re+=obj.rewardp
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
      // this.form.skPrice=this.form.skPrice+this.form.rewardp;
      this.jsdj()
      this.jspay()
    },

    //计算实际收款
    jspay(){
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

      let sktprice=0
      if(this.form.skTprice!=null && this.form.accept!=''){
        sktprice=this.form.skTprice
      }
      //计算税款
      this.form.tax=(sktprice/1.13*0.13).toFixed(2);

      //总计收款
      let ac=0
      let pu=0
      let ot=0
      if(this.form.accept!=null && this.form.accept!=''){
        ac=this.form.accept
      }
      if(this.form.punish!=null && this.form.punish!=''){
        pu=this.form.punish
      }
      if(this.form.otherP!=null && this.form.otherP!=''){
        ot=this.form.otherP
      }
      this.form.yftotalPrice=(this.form.skTprice-ac-pu-ot).toFixed(2);
      let pt=0
      let pp=0
      if(this.form.yftotalPrice!=null && this.form.yftotalPrice!=''){
        pt = this.form.yftotalPrice
      }
      if(this.form.yfPrice!=null && this.form.yfPrice!=''){
        pp = this.form.yfPrice
      }
      let sp = pt-pp;
      if(sp>=0){
        this.form.sjPrice=sp.toFixed(2)
      }else{
        this.form.sjPrice=0
      }
    }

  }
};
</script>
