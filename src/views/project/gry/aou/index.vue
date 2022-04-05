<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="20">
        <el-form ref="form" :model="form" :rules="rules" label-width="180px" style="margin-top: 30px;">
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
              <el-form-item label="出库重量(吨)" prop="grnNumber">
                <el-input v-model="form.grnNumber" placeholder="请输入出库重量" @change="calculate"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="到货日期" prop="okTime">
                <el-date-picker clearable size="small" style="width: 100%;"
                                v-model="form.okTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择到货日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出库热值(Kcal/吨)" prop="gryRz">
                <el-input v-model="form.gryRz" placeholder="请输入出库热值" />
              </el-form-item>
            </el-col>
          </el-row>

          <div v-if="chargemType!=1">
            <el-row>
              <el-col :span="12">
                <el-form-item label="固定差价/吨(元)" prop="gryRz">
                  <el-input v-model="form.chargemGd" placeholder="请输入固定差价" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--        选择入库单-->
          <div>
            <el-popover
              placement="bottom-start"
              width="100%"
              v-model="visible"
              popper-class="area_popper">
              <el-button type="primary" slot="reference" style="margin-bottom: 30px;">选择入库单</el-button>
              <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column
                  property="name"
                  label="货品名称"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="grnNumber"
                  label="入库重量（吨）"
                  width="90">
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.grnNumber)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  property="grnRz"
                  label="热值（kcal）"
                  width="90">
                </el-table-column>
                <el-table-column
                  property="transportType"
                  label="运输方式"
                  width="90">
                </el-table-column>
                <el-table-column
                  property="wlCompany"
                  label="物流公司"
                  width="90">
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
                  label="发货日期"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="valuePrice"
                  label="货值单价（元）"
                  width="90">
                  <template slot-scope="scope">
                  {{
                    Number(scope.row.valuePrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
                </el-table-column>
                <el-table-column
                  property="valueTprice"
                  label="货值总额（元）"
                  width="90">
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
                style="margin-bottom: 30px;">
                <el-table-column
                  property="name"
                  label="已选货品名称"
                >
                </el-table-column>
                <el-table-column
                  property="grnNumber"
                  label="入库重量（吨）"
                  width="120">
                  <template slot-scope="scope">
                    {{
                      Number(scope.row.grnNumber)
                        .toFixed(3)
                        .toString()
                        .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                    }}
                  </template>
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
                  label="发货日期"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="valuePrice"
                  label="货值单价（元）"
                  width="120">
                  <template slot-scope="scope">
                  {{
                    Number(scope.row.valuePrice)
                      .toFixed(2)
                      .toString()
                      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
                  }}
                </template>
                </el-table-column>
                <el-table-column
                  property="valueTprice"
                  label="货值总额（元）"
                  width="120">
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
          <div>
            <el-row>
              <el-col :span="6">
                <el-form-item label="合计重量" prop="totalWeight">
                  <span  style="color: red">{{$options.filters.moneyFilter(form.totalWeight)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="平均热值" prop="averageRz">
                  <span  style="color: red">{{form.averageRz}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--        差值-->
          <div>
            <el-row>
              <el-col :span="5">
                <el-form-item label="重量差" >
                  <span  style="color: red">{{zlc}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="热值差" prop="averageRz">
                  <span  style="color: red">{{rzc}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="单价差" prop="averageRz">
                  <span  style="color: red">{{$options.filters.moneyFilter(djc)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="总额差" prop="averageRz">
                  <span  style="color: red">{{$options.filters.moneyFilter(zec)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--        煤炭质量-->
          <el-form-item label="煤炭质量" >
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-table :data="tabledatas" fit style="margin-bottom: 30px;">
                <el-table-column   label="水分(%)">
                  <template slot-scope="scope"  prop="coalSf">
                    <el-input v-model="form.coalSf" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column  label="内水(%)">
                  <template slot-scope="scope"  prop="coalNs">
                    <el-input v-model="form.coalNs" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column  label="灰份(%)">
                  <el-table-column  label="Aad">
                    <template slot-scope="scope"  prop="coalAad">
                      <el-input v-model="form.coalAad" placeholder="请输入" />
                    </template>
                  </el-table-column>
                  <el-table-column  label="ad">
                    <template slot-scope="scope"  prop="coalAd">
                      <el-input v-model="form.coalAd" placeholder="请输入" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="挥发份(%)">
                  <el-table-column  label="Vda">
                    <template slot-scope="scope"  prop="coalVda">
                      <el-input v-model="form.coalVda" placeholder="请输入" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Vdaf">
                    <template slot-scope="scope"  prop="coalVdae">
                      <el-input v-model="form.coalVdae" placeholder="请输入" />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column  label="灰熔点(℃)">
                  <template slot-scope="scope"  prop="coalHrd">
                    <el-input v-model="form.coalHrd" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column  label="固定碳(%)">
                  <template slot-scope="scope"  prop="coalGdt">
                    <el-input v-model="form.coalGdt" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column  label="含硫量(%)">
                  <template slot-scope="scope"  prop="coalHll">
                    <el-input v-model="form.coalHll" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column label="热值(%)">
                  <el-table-column label="Qgrad">
                    <template slot-scope="scope"   prop="coalQgrad">
                      <el-input v-model="form.coalQgrad" placeholder="请输入" />
                    </template>
                  </el-table-column>
                  <el-table-column  label="Qntar">
                    <template slot-scope="scope"   prop="coalQntar">
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
              <el-form-item label="货值单价(元)" prop="valuePrice">
                <el-input v-model="form.valuePrice" placeholder="请输入货值单价" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货值总价(元)" prop="valueTprice">
                <el-input v-model="form.valueTprice" placeholder="请输入货值总价" disabled/>
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
                  <el-button size="small" type="primary" >点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot=""  class="dialog-footer" style="text-align: right;margin-bottom: 50px;">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { listGry, getGry, delGry, addGry, updateGry,getStList,getGrnList,getContract,getJsjc } from "@/api/project/gry";
import {getToken} from "@/utils/auth";


export default {
  name: "Gry",
  data() {
    const validatePrice = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(!value && value!=0){
        callback(new Error('不能为空'))
      }else if(!reg.test(value)){
        callback(new Error('请输入正确格式'))
      }else if(value.length > 10){
        callback(new Error('最多可输入10个字符'))
      }else{
        callback();
      }
    };
    const validatePrice2 = (rule,value,callback) =>{
      let reg = /^(\-|\+)?(([1-9]{1}\d*)|(0{1}))$/
      // let reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if(!value){
        callback(new Error('不能为空'))
      }else if(!reg.test(value)){
        callback(new Error('请输入正确格式'))
      }else if(value.length > 10){
        callback(new Error('最多可输入10个字符'))
      }else{
        callback();
      }
    };
    return {
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      //入库单集合
      tableData: [],
      //选中入库单集合
      tableselData: [],
      //煤炭质量
      tabledatas: [
        {show:true}
      ],
      //选择框状态
      visible:false,
      //固定差价状态
      chargemType:1,
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
      stOptions:[],
      zlc:0,
      rzc:0,
      djc:0,
      zec:0,
      //运输方式集合
      transportTypeOptions:
        [{"key":"火运","label":"火运"},
          {"key":"汽运","label":"汽运"}],
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
        stId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        grnNumber: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        okTime: [
          { required: true, message: "请选择到货日期", trigger: "blur" }
        ],
        gryRz: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        wlCompany: [
          { required: true, message: "物流公司不能为空", trigger: "blur" }
        ],
        transportType: [
          { required: true, message: "请选择运输方式", trigger: "blur" }
        ],
        carNumber: [
          { required: true, message: "车数不能为空", trigger: "blur" }
        ],
        batch: [
          { required: true, message: "批次不能为空", trigger: "blur" }
        ],
        valuePrice: [
          // { required: true, validator: validatePrice, trigger: "blur" }
        ],
        valueTprice: [
          { required: true,validator: validatePrice, trigger: "blur" }
        ],
        coalSf: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalNs: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalAad: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalAd: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalVda: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalVdae: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalHrd: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalHll: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalQgrad: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
        coalQntar: [
          { required: true, validator: validatePrice, trigger: "blur" }
        ],
      }
    };
  },
  created() {
    getStList().then(response => {
      this.stOptions = response.rows;
    });
    this.handleUpdate();
  },
  methods: {
    // 取消按钮
    cancel() {
      this.reset();
      this.$router.go(-1)
    },
    // 表单重置
    reset() {
      this.form = {
        gryId: null,
        stId: null,
        stId2: null,
        stName: null,
        wlCompany: null,
        name: null,
        grnNumber: null,
        okTime: null,
        gryRz: null,
        transportType: null,
        carNumber: null,
        batch: null,
        basePrice:null,
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
        valuePrice: null,
        valueTprice: null,
        state: null,
        createBy: null,
        createTime: null,
        chargemGd:null,
        grnList:[],
        fileList:[]
      };
      this.resetForm("form");
    },

    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      this.tableData=[]
      this.tableselData=[]
      this.fileList=[];
      const gryId = this.$route.params && this.$route.params.gryId;
      getGry(gryId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;;
        this.fileList = this.form.fileList;
        this.tableselData = response.data.grnList;
        this.zlc=response.data.grnNumber-this.tableselData[0].grnNumber;
        this.rzc=response.data.gryRz-this.tableselData[0].grnRz;
        this.djc=response.data.valuePrice-this.tableselData[0].valuePrice;
        this.zec=response.data.valueTprice-this.tableselData[0].valueTprice;
        getGrnList(this.form.stId2).then(response => {
            this.tableData = response.rows;
        });
      });

    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.tableselData.length<1) {
            this.msgError("请选择入库单")
            return
          }
          this.form.stId=this.form.stId2
          this.form.grnList=this.tableselData
          if (this.form.gryId != null) {
            updateGry(this.form).then(response => {
              this.msgSuccess("修改成功");
              setTimeout(() => {
                this.$router.go(-1)
              },2)

            });
          } else {
            addGry(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },


    // 图片上传
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

    // 业务开始
    // 选择项目
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
      //赋值固定差价
      if(obj.chargemType=='2' || obj.chargemType=='3'){
        this.chargemType=2;
        this.form.chargemGd=obj.chargemGd;
      }else{
        this.chargemType=1;
      }
      //赋值入库单集合
      this.selectGrn();
      //赋值基准单价
      getContract(obj.stId).then(response => {
        if(response.data!=null){
          //基准单价
          this.form.basePrice = response.data.price;
          //货值单价  没有计算奖惩
          this.form.valuePrice = response.data.price;

          let vp=0
          if(this.form.valuePrice!=null && this.form.valuePrice!=''){
            vp=this.form.valuePrice;
          }
          let gn=0
          if(this.form.totalWeight!=null && this.form.totalWeight!=''){
            gn=this.form.totalWeight
          }
          this.form.valueTprice = (gn * vp).toFixed(2);
        }else{
          this.form.basePrice = 0;
          this.form.valuePrice = 0;
          this.form.valueTprice = 0;
        }
      });
    },
    //加载入库单
    selectGrn(){
      this.tableData=[];
      if(this.form.stId2!=null){
        const stid=this.form.stId2
        getGrnList(stid).then(response => {
          this.tableselData=[];
          this.form.totalWeight=0;
          this.form.averageRz=0;
          if(response.rows.length>0){
            this.tableData = response.rows;
          }
        });
      }else {
        this.msgError("请选择项目");
      }
    },
    //选择入库单
    handleCurrentChange(val) {
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
      console.log(val)
      this.tableselData=[];
      this.tableselData.push(val);

      let tgn=0;
      let tgr=0;

      if(val==null){
        this.form.totalWeight=tgn;
        this.form.averageRz=tgr;
        return
      }
      if(val.grnNumber!=null){
        tgn=val.grnNumber
      }
      if(val.grnRz!=null)
      {
        tgr = val.grnRz
      }
      this.form.totalWeight=tgn;
      this.form.averageRz=tgr;

      this.form.name = val.name;
      this.form.wlCompany = val.wlCompany;
      this.form.carNumber = val.carNumber;
      this.form.batch = val.batch;
      this.form.transportType = val.transportType;
      this.calculate()
      this.visible = false;
    },

    // 计算奖惩
    jsjc(){

      if(this.form.stId2==null || this.form.stId2==''){
        this.msgError("请选择项目");
        this.form.prepaidPrice = 0;
        return
      }
      let data={}
      data.stId=this.form.stId2
      if(this.form.coalQgrad!=null && this.form.coalQgrad!='' || this.form.coalQgrad==0){
        let qgrad=this.form.coalQgrad
        data.qgrad=qgrad
      }
      if(this.form.coalQntar!=null && this.form.coalQntar!=''){
        let qntar=this.form.coalQntar
        data.qntar=qntar
      }
      if(this.form.coalHll!=null && this.form.coalHll!=''){
        let  hll=this.form.coalHll
        data.hll=hll
      }
      if(this.form.coalGdt!=null && this.form.coalGdt!=''){
        let gdt=this.form.coalGdt
        data.gdt=gdt
      }
      if(this.form.coalHrd!=null && this.form.coalHrd!=''){
        let  hrd=this.form.coalHrd
        data.hrd=hrd
      }
      if(this.form.coalVda!=null && this.form.coalVda!=''){
        let vda=this.form.coalVda
        data.vda=vda
      }
      if(this.form.coalVdae!=null && this.form.coalVdae!=''){
        let vdae=this.form.coalVdae
        data.vdae=vdae
      }
      if(this.form.coalAd!=null && this.form.coalAd!=''){
        let ad=this.form.coalAd
        data.ad=ad
      }
      if(this.form.coalAad!=null && this.form.coalAad!=''){
        let  aad=this.form.coalAad
        data.aad=aad
      }
      if(this.form.coalSf!=null && this.form.coalSf!=''){
        let sf=this.form.coalSf
        data.sf=sf
      }
      if(this.form.coalNs!=null && this.form.coalNs!=''){
        let ns=this.form.coalNs
        data.ns=ns
      }
      //计算奖惩
      let rewardsp=0
      console.log(data)
      getJsjc(data).then(response => {
        console.log(response)
        let obj=response.data

        this.form.jc1=(obj.sf).toFixed(2)
        this.form.jc2=(obj.ns).toFixed(2)
        this.form.jc3=(obj.aad).toFixed(2)
        this.form.jc4=(obj.vda).toFixed(2)
        this.form.jc5=(obj.hrd).toFixed(2)
        this.form.jc6=(obj.gdt).toFixed(2)
        this.form.jc7=(obj.hll).toFixed(2)
        this.form.jc8=(obj.qgrad).toFixed(2)
        this.form.jc9=(obj.qntar).toFixed(2)
        this.form.jc10=(obj.ad).toFixed(2)
        this.form.jc11=(obj.vdae).toFixed(2)
        this.form.jc12=(obj.kcal).toFixed(2)
        if(obj.sf<0){
          rewardsp+=obj.sf
        }
        if(obj.ns<0){
          rewardsp+=obj.ns
        }
        if(obj.aad<0){
          rewardsp+=obj.aad
        }
        if(obj.ad<0){
          rewardsp+=obj.ad
        }
        if(obj.vda<0){
          rewardsp+=obj.vda
        }
        if(obj.vdae<0){
          rewardsp+=obj.vdae
        }
        if(obj.hrd<0){
          rewardsp+=obj.hrd
        }
        if(obj.gdt<0){
          rewardsp+=obj.gdt
        }
        if(obj.hll<0){
          rewardsp+=obj.hll
        }
        if(obj.qgrad<0){
          rewardsp+=obj.qgrad
        }
        if(obj.qntar<0){
          rewardsp+=obj.qntar
        }
        if(obj.kcal<0){
          rewardsp+=obj.kcal
        }

        this.form.rewardp=rewardsp
        this.form.valuePrice=parseFloat(this.form.basePrice)+parseFloat(rewardsp)
        this.calculate()
      })

    },
    // 计算货值总价
    calculate(){
      let vp=0
      if(this.form.valuePrice!=null && this.form.valuePrice!=''){
        vp=this.form.valuePrice;
      }
      let gn=0
      if(this.form.totalWeight!=null && this.form.totalWeight!=''){
        gn=this.form.totalWeight
      }
      this.form.valueTprice = (gn * vp).toFixed(2);
    }
  }
};
</script>
