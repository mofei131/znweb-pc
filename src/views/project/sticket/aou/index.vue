<template>
  <div>
  <el-form ref="form" :model="form" :rules="rules" label-width="180px" label-position="left">
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目名称:" prop="stId">
          <el-select filterable value-key="stId" @change="changeSt" v-model="form.stId" placeholder="请选择项目名称" style="width: 100%;">
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
        <el-form-item label="代办人:" prop="proportion">
          <span>{{form.uName}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="终端用户:" prop="proportion">
          <span>{{form.tName}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="收票比例:" prop="proportion">
          <el-radio-group v-model="form.proportion" @change="updateProportion">
            <el-radio label="95%">95%</el-radio>
            <el-radio label="5%">5%</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
<!--    <div v-if="form.proportion=='95%'">-->
<!--    <el-row>-->
<!--    <el-popover-->
<!--      placement="bottom-start"-->
<!--      width="100%"-->
<!--      @selection-change="grnSelectionChange"-->
<!--      v-model="visible"-->
<!--      popper-class="area_popper">-->
<!--      <el-button size="small" type="primary"  slot="reference" style="margin-bottom: 30px;margin-top: 50px;">选择预付款</el-button>-->
<!--      <el-table-->
<!--        ref="singleTable"-->
<!--        :data="tableData"-->
<!--        fit-->
<!--        @selection-change="grnSelectionChange"-->
<!--        style="width: 100%;"-->
<!--      >-->
<!--        <el-table-column-->
<!--          type="selection"-->
<!--          width="55">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="stName"-->
<!--          label="项目名称"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="totalWeight"-->
<!--          label="验收重量（吨）"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="totalPrice"-->
<!--          label="预付总额(元)"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="expectPrice"-->
<!--          label="预付单价(元)"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="ato"-->
<!--          label="预付至">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="actualPrice"-->
<!--          label="实际付款(元)"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <div style="margin-top: 20px">-->
<!--        <el-button type="primary" size="small"  style="float: right"  @click="toggleSelection()">确认选择</el-button>-->
<!--      </div>-->
<!--    </el-popover>-->
<!--    </el-row>-->
<!--    </div>-->
<!--    <div v-if="form.proportion=='95%'">-->
<!--    <el-table-->
<!--      ref="singleTable"-->
<!--      :data="tableselData"-->
<!--      style="width: 100%;margin-bottom: 30px;">-->
<!--      <el-table-column-->
<!--        property="stName"-->
<!--        label="项目名称">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="totalWeight"-->
<!--        label="验收重量（吨）">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="totalPrice"-->
<!--        label="预付总额(元)">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="expectPrice"-->
<!--        label="预付单价(元)">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="ato"-->
<!--        label="预付至">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="actualPrice"-->
<!--        label="实际付款(元)">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        width="120">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            @click.native.prevent="deleteRow(scope.$index, tableselData)"-->
<!--            type="text"-->
<!--            size="small">-->
<!--            移除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    </div>-->
<!--    <div v-if="form.proportion=='5%'">-->
<!--      <el-table-->
<!--        ref="singleTable"-->
<!--        :data="tableselData"-->
<!--        style="width: 100%;margin-bottom: 30px;">-->
<!--        <el-table-column-->
<!--          property="hpName"-->
<!--          label="货品名称">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="tweight"-->
<!--          label="合计重量（吨）">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="price"-->
<!--          label="货品单价(元)">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="zzPrice"-->
<!--          label="最终付款总额(元)">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="otherPrice"-->
<!--          label="扣除费用合计">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="yftotalPrice"-->
<!--          label="最终应付总额(元)">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="yfPrice"-->
<!--          label="最终已付总额(元)">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          property="sjPrice"-->
<!--          label="最终实际付款(元)">-->
<!--        </el-table-column>-->
<!--&lt;!&ndash;        <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;          label="操作"&ndash;&gt;-->
<!--&lt;!&ndash;          width="120">&ndash;&gt;-->
<!--&lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-button&ndash;&gt;-->
<!--&lt;!&ndash;              @click.native.prevent="deleteRow(scope.$index, tableselData)"&ndash;&gt;-->
<!--&lt;!&ndash;              type="text"&ndash;&gt;-->
<!--&lt;!&ndash;              size="small">&ndash;&gt;-->
<!--&lt;!&ndash;              移除&ndash;&gt;-->
<!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          </template>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-table-column>&ndash;&gt;-->
<!--      </el-table>-->
<!--    </div>-->
<!--    <el-form-item label="应收票金额:" prop="totalWeight">-->
<!--      <span  style="color: red">{{form.ysPrice}}</span>-->
<!--    </el-form-item>-->
    <el-row>
      <el-col :span="12">
        <el-form-item label="数量(吨)" prop="number">
          <el-input   v-model="form.number" placeholder="请输入开票金额" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="开票金额(元)" prop="price">
          <el-input @change="jsTax"  v-model="form.price" placeholder="请输入开票金额" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="开票税额(元)" prop="tax">
          <el-input   v-model="form.tax" placeholder="请输入开票税额" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="价税合计(元)" prop="totalPrice">
          <el-input   v-model="form.totalPrice" placeholder="请输入价税合计" />
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
    <!--        图片上传-->
<!--    <el-row>-->
<!--      <el-col :span="12">-->
<!--        <el-form-item label="" prop="file" label-width="0px" style="margin-top: 50px;">-->
<!--          <el-upload-->
<!--            class="upload-demo"-->
<!--            ref="upload"-->
<!--            :action="url"-->
<!--            :headers="headers"-->
<!--            :on-preview="handlePreview"-->
<!--            :on-remove="handleRemove"-->
<!--            :on-success="uploadSuccess"-->
<!--            :on-error="uploadError"-->
<!--            :before-remove="beforeRemove"-->
<!--            multiple-->
<!--            :limit="99"-->
<!--            :on-exceed="handleExceed"-->
<!--            :file-list="fileList">-->
<!--            <el-button size="small" type="primary"  style="margin-left: 0px;">OCR图片上传</el-button>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
<!--    </el-row>-->




<!--    <el-table-->
<!--      ref="singleTable"-->
<!--      :data="form.ocrData"-->
<!--      fit-->
<!--      style="margin-bottom: 50px;width: 100%;">-->
<!--      <el-table-column-->
<!--        property="number"-->
<!--        label="发票号码">-->
<!--        <template slot-scope="scope">-->
<!--          <el-form-item label-width="0" style="margin-bottom: 0px;">-->
<!--            <el-input  v-model="scope.row.number" placeholder="请输入" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="date"-->
<!--        label="开票日期">-->
<!--        <template slot-scope="scope">-->
<!--          <el-form-item label-width="0" style="margin-bottom: 0px;">-->
<!--            <el-date-picker clearable size="small" style="width: 100%"-->
<!--                            v-model="scope.row.date"-->
<!--                            type="date"-->
<!--                            value-format="yyyy年MM月dd日"-->
<!--                            placeholder="选择开票日期">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="price"-->
<!--        label="开票金额(元)">-->
<!--        <template slot-scope="scope">-->
<!--        <el-form-item label-width="0" style="margin-bottom: 0px;" :prop="'ocrData.' + scope.$index + '.price'" :rules='rules.price'>-->
<!--          <el-input @change="jsOcr"  v-model="scope.row.price" placeholder="请输入" />-->
<!--        </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="tax"-->
<!--        label="开票税额(元)">-->
<!--        <template slot-scope="scope">-->
<!--        <el-form-item label-width="0" style="margin-bottom: 0px;" :prop="'ocrData.' + scope.$index + '.tax'" :rules='rules.tax'>-->
<!--          <el-input @change="jsOcr" v-model="scope.row.tax" placeholder="请输入" />-->
<!--        </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        property="total"-->
<!--        label="价税合计(元)">-->
<!--        <template slot-scope="scope">-->
<!--        <el-form-item label-width="0" style="margin-bottom: 0px;" :prop="'ocrData.' + scope.$index + '.total'" :rules='rules.total'>-->
<!--          <el-input @change="jsOcr" v-model="scope.row.total" placeholder="请输入" />-->
<!--        </el-form-item>-->
<!--        </template>>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        width="120">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            @click.native.prevent="deleteOccRow(scope.$index, form.ocrData)"-->
<!--            type="text"-->
<!--            size="small">-->
<!--            移除-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <el-form-item label="合计：" label-width="80px" >-->
<!--          <span>数量(吨)：<span style="color: red" v-text="form.number">0.00</span></span>-->
<!--          <span style="margin-left: 20px;">开票金额(元)：<span style="color: red" v-text="form.price">0.00</span></span>-->
<!--          <span style="margin-left: 20px;">开票税额(元)：<span style="color: red" v-text="form.tax">0.00</span></span>-->
<!--          <span style="margin-left: 20px;">价税合计(元)：<span style="color: red" v-text="form.totalPrice">0.00</span></span>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
<!--    </el-row>-->



  </el-form>
  <div slot="footer"  class="dialog-footer" style="text-align: right">
    <el-button type="primary" @click="submitForm">确 定</el-button>
    <el-button @click="cancel">取 消</el-button>
  </div>
  </div>
</template>
<script>
import {addSticket, updateSticket, getOcrData} from "@/api/project/sticket";
import {getToken} from "@/utils/auth";
import {getApaymentList, getFpaymentList} from "@/api/project/all";
export default {
  name: "aou",
  props: ["aouform","aoustOptions"],
  data() {
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
      // 收票管理表格数据
      sticketList: [],
      // 项目集合
      stOptions: [],
      //选择框状态
      visible:false,
      //选择框集合
      tableData: [],
      //二次预付款集合
      apaymentData: [],
      //最终付款集合
      fpaymentData: [],
      //选中集合
      tableselData: [],
      //预选中集合
      tableybData: [],
      //ocr集合
      ocrData: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        price: [
          {  validator:validatePrice3, trigger: "blur" }
        ],
        tax: [
          {  validator:validatePrice3, trigger: "blur" }
        ],
        total: [
          {  validator:validatePrice3, trigger: "blur" }
        ],
      }
    };
  },
  created() {
  },
  methods: {
    init(){
      this.reset();
      this.form=this.aouform
      this.form.stId2=this.aouform.style
      this.form.stId=this.aouform.stName
      if(this.aouform.proportion=='95%'){
        this.tableselData=this.aouform.apaymentList
      }else{
        this.tableselData=this.aouform.fpaymentList
      }
      this.ocrData=this.aouform.ocrList
      this.stOptions=this.aoustOptions
    },

    // 取消按钮
    cancel() {
      this.$emit("cancel");
    },


    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // if(this.form.proportion=='95%'){
          //   if(this.tableselData.length<1){
          //     this.msgError("请选择预付款");
          //     return
          //   }
          // }else if(this.form.proportion=='5%'){
          //   if(this.tableselData.length<1){
          //     this.msgError("暂无最终付款");
          //     return;
          //   }
          // }
          //
          // if(this.form.ocrData.length<1){
          //   this.msgError("请上传发票数据");
          //   return;
          // }
          // this.form.ocrList=this.form.ocrData;
          //
          // if(this.form.proportion=='95%') {
          //   this.form.apaymentList = this.tableselData
          // }
          // if(this.form.proportion=='5%') {
          //   this.form.fpaymentList = this.tableselData
          // }
          this.form.stId=this.form.stId2
          if (this.form.sticketId != null) {
            updateSticket(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.$emit("getList");
              this.$emit("cancel");
            });
          } else {
            addSticket(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.$emit("getList");
              this.$emit("cancel");
            });
          }
        }
      });
    },


    // //图片上传
    // //点击触发
    // handlePreview(file) {
    //   if(file.response==undefined){
    //     window.open(file.url)
    //   }else{
    //     window.open(file.response.data.url)
    //   }
    // },
    // handleRemove(file, filelist) {
    //   this.form.fileList=[];
    //   for(var i=0;i<filelist.length;i++){
    //     if (filelist[i].response != undefined) {
    //       var art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
    //       this.form.fileList.push(art);
    //     }else {
    //       var art = {"name": filelist[i].name, "url": filelist[i].url};
    //       this.form.fileList.push(art);
    //     }
    //   }
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
    // // res 表示请求响应体
    // uploadSuccess(res, file, filelist) {
    //   console.log(filelist)
    //   this.$refs.upload.clearFiles();
    //   if (res.code == '200') {
    //     this.form.fileList=[];
    //     for(let i=0;i<filelist.length;i++) {
    //       if (filelist[i].response != undefined) {
    //         let url = filelist[i].response.data.url;
    //         let data={"filePath":url}
    //         getOcrData(data).then(response => {
    //           if(response.rows.length>0){
    //             this.$message.success("识别成功");
    //             let obj=response.rows[0]
    //             if (this.form.ocrData == null || this.form.ocrData == undefined) {
    //               this.form.ocrData = new Array();
    //             }
    //             console.log(obj.date)
    //
    //             this.form.ocrData.push(obj);
    //
    //             this.jsOcr();
    //             // let ocrprice=0;
    //             // if(obj.price!=null && obj.price!=''){
    //             //   ocrprice=obj.price;
    //             // }
    //             // let price=0;
    //             // if(this.form.price!=null && this.form.price!=''){
    //             //   price=this.form.price;
    //             // }
    //             //
    //             // price=parseFloat(price)+parseFloat(ocrprice);
    //             // this.form.price=price;
    //             //
    //             // let ocrtax=0;
    //             // if(obj.tax!=null && obj.tax!=''){
    //             //   ocrtax=obj.tax;
    //             // }
    //             // let tax=0;
    //             // if(this.form.tax!=null && this.form.tax!=''){
    //             //   tax=this.form.tax;
    //             // }
    //             //
    //             // tax=parseFloat(tax)+parseFloat(ocrtax);
    //             // this.form.tax=tax;
    //             //
    //             // let ocrtotal=0;
    //             // if(obj.total!=null && obj.total!=''){
    //             //   ocrtotal=obj.total;
    //             // }
    //             // let totalPrice=0;
    //             // if(this.form.totalPrice!=null && this.form.totalPrice!=''){
    //             //   totalPrice=this.form.totalPrice;
    //             // }
    //             //
    //             // totalPrice=parseFloat(totalPrice)+parseFloat(ocrtotal);
    //             // this.form.totalPrice=totalPrice;
    //
    //
    //           }else{
    //             this.$message.success("识别失败");
    //           }
    //         })
    //       }
    //     }
    //
    //   } else {
    //     this.$message.error(res.msg);
    //     let index = filelist.indexOf(file);
    //     filelist.splice(index,1);
    //   }
    // },
    // uploadError(err, file, filelist) {
    //   this.$message.error("上传失败");
    // },
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







    reset() {
      this.tableData=[];
      this.tableselData=[];
      this.ysPrice="0.00";
      this.number="0.00";
    },

    // 业务开始

    //选中数据
    grnSelectionChange(selection) {
      this.tableybData=[];
      this.tableybData=selection;
    },
    //溢出选中数据
    deleteRow(index, rows) {
      this.tableselData.splice(index, 1);
      let number=0.00;
      let price=0.00
      for(let i=0;i<this.tableselData.length;i++){
        if(this.form.proportion=='95%'){
          let obj=this.tableselData[i];
          console.log(obj)
          number=number+obj.totalWeight
          price=price+obj.totalPrice*0.95
        }
      }
      this.form.number=number.toFixed(2);
      this.form.ysPrice=price.toFixed(2);
    },
    //溢出选中数据
    deleteOccRow(index, rows) {
      this.form.ocrData.splice(index, 1);
      this.jsOcr();
    },
    //确认选择数据
    toggleSelection() {
      this.tableselData=this.tableybData;
      let number=0.00;
      let price=0.00
      for(let i=0;i<this.tableselData.length;i++){
        if(this.form.proportion=='95%'){
            let obj=this.tableselData[i];
            console.log(obj)
            number=number+obj.totalWeight
            price=price+obj.totalPrice*0.95
        }
      }
      this.form.number=number.toFixed(2);
      this.form.ysPrice=price.toFixed(2);
      this.visible = false;
    },

    //选择项目
    changeSt(obj){
      this.form.stId2 = obj.stId
      this.form.stName = obj.name
      this.form.uName = obj.userName
      this.form.tName = obj.tName
      this.reset();
      //加载集合
      let data = {"stId": obj.stId, "away": "二次","state":"3"};

      getApaymentList(data).then(response => {
        this.apaymentData = response.rows;
        // 赋予集合
        if(this.form.proportion=='95%'){
          this.tableData=this.apaymentData;
        }
      });

      getFpaymentList(data).then(response => {
        this.fpaymentData = response.rows;
        if(this.form.proportion=='5%'){
          this.tableselData=this.fpaymentData;
          if(this.tableselData.length>0){
            let obj=this.tableselData[0];
            this.form.number=obj.tweight.toFixed(2)
            this.form.ysPrice=(obj.yftotalPrice*0.05).toFixed(2)
          }
        }
      });
    },

    //计算ocr列表
    jsOcr(){
      let price=0;
      let tax=0;
      let totalPrice=0;
      for(let i=0;i<this.form.ocrData.length;i++){
        let obj=this.form.ocrData[i];

        let ocrprice=0;
        if(obj.price!=null && obj.price!=''){
          ocrprice=obj.price;
        }
        price=parseFloat(price)+parseFloat(ocrprice);


        let ocrtax=0;
        if(obj.tax!=null && obj.tax!=''){
          ocrtax=obj.tax;
        }
        tax=parseFloat(tax)+parseFloat(ocrtax);

        let ocrtotal=0;
        if(obj.total!=null && obj.total!=''){
          ocrtotal=obj.total;
        }
        totalPrice=parseFloat(totalPrice)+parseFloat(ocrtotal);
      }
      this.form.price=price.toFixed(2);
      this.form.tax=tax.toFixed(2);
      this.form.totalPrice=totalPrice.toFixed(2);
    },

    //更改比例
    updateProportion(){
      if(this.form.stId2==null || this.form.stId2==''){
        this.msgError("请选择项目");
        return
      }
      this.reset();

      //加载集合
      let data = {"stId": this.form.stId2, "away": "二次","state":"3"};

      getApaymentList(data).then(response => {
        this.apaymentData = response.rows;
        // 赋予集合
        if(this.form.proportion=='95%'){
          this.tableData=this.apaymentData;
        }
      });

      getFpaymentList(data).then(response => {
        this.fpaymentData = response.rows;
        if(this.form.proportion=='5%'){
          this.tableselData=this.fpaymentData;
          if(this.tableselData.length>0){
            let obj=this.tableselData[0];
            this.form.number=obj.tweight.toFixed(2)
            this.form.ysPrice=(obj.yftotalPrice*0.05).toFixed(2)
          }
        }
      });
    },
    jsTax(){
      let price=0.00
      if(this.form.price!=null && this.form.price!=''){
        price=this.form.price
      }
      this.form.tax=(parseFloat(price)/1.13*0.13).toFixed(2)
      this.form.totalPrice=parseFloat(this.form.tax)+parseFloat(price);
    },

  }
};
</script>
