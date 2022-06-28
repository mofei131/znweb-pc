<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <!-- 项目 -->
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
          <!-- 业务 -->
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
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="代办人" prop="proportion">
            <span>{{ form.uName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-left:20px" label="终端用户" prop="proportion">
            <span>{{ form.tName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="收票比例" prop="proportion">
            <el-radio-group v-model="form.proportion" @change="updateProportion">
              <el-radio label="95%">95%</el-radio>
              <el-radio label="5%">5%</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-left:20px" label="数量(吨)" prop="number">
            <el-input v-model="form.number" placeholder="请输入数量(吨)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开票金额(元)" prop="price">
            <el-input v-model="form.price" placeholder="请输入开票金额" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-left:20px" label="开票税额(元)" prop="tax">
            <el-input v-model="form.tax" placeholder="请输入开票税额" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="价税合计(元)" prop="totalPrice">
            <el-input @change="jsTax" v-model="form.totalPrice" placeholder="请输入价税合计" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="margin-left:20px" label="收票日期" prop="sticketTime">
            <el-date-picker clearable size="small" style="width: 100%" v-model="form.sticketTime" type="date"
              value-format="yyyy-MM-dd" placeholder="选择收票日期">
            </el-date-picker>
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
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" @click="submitForm" :disabled="isDisabled">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { addSticket, updateSticket, findInit, listForBus, listForPro, } from "@/api/project/sticket";
import { getToken } from "@/utils/auth";
import { listProjectForCombobox, listBusinessForCombobox } from "@/api/project/st";
export default {
  name: "aou",
  props: {
    "aouform":{
      type: Object
    },
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
      // 收票管理表格数据
      sticketList: [],
      // 项目集合
      projectOptions: [],
      //选择框状态
      visible: false,
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
      form: {},
      // 表单校验
      rules: {
        stId: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        projectId: [
          { required: true, message: "请选择业务名称", trigger: "blur" },
        ],
        price: [{ validator: validatePrice3, trigger: "blur" }],
        tax: [{ validator: validatePrice3, trigger: "blur" }],
        total: [{ validator: validatePrice3, trigger: "blur" }],
        sticketTime: [
          { required: true, message: "请选择收票日期", trigger: "blur" },
        ],
      },
      isDisabled: false,
      listForBusArr: [],
      listForProArr: [],
      apyamentId:'',//子组件id
    };
  },
  created() {
    this.loadProjectForCombobox();
  },
  methods: {
    init() {
      this.reset();
      this.form = this.aouform;
      if (this.aouform.proportion == "95%") {
        this.tableselData = this.aouform.apaymentList;
      } else {
        this.tableselData = this.aouform.fpaymentList;
      }
      this.ocrData = this.aouform.ocrList;
      this.isDisabled = false;
      if (this.isQuote) {
        this.form.projectId = this.projectIdd
        this.changeProject(this.projectIdd)
        this.form.stId = this.stIdd
      }
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
      this.$emit("cancel");
    },

    /** 提交按钮 */
    submitForm() {
      this.isDisabled = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.sticketId != null) {
            updateSticket(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("getList");
              this.$emit("cancel");
            });
          } else {
            addSticket(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("getList");
              this.$emit("cancel");
            });
          }
        } else {
          this.isDisabled = false;
        }
      });
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

    reset() {
      this.tableData = [];
      this.tableselData = [];
      this.ysPrice = "0.00";
      this.number = "0.00";
    },

    // 业务开始

    //选中数据
    grnSelectionChange(selection) {
      this.tableybData = [];
      this.tableybData = selection;
    },
    //溢出选中数据
    deleteRow(index, rows) {
      this.tableselData.splice(index, 1);
      let number = 0.0;
      let price = 0.0;
      for (let i = 0; i < this.tableselData.length; i++) {
        if (this.form.proportion == "95%") {
          let obj = this.tableselData[i];
          console.log(obj);
          number = number + obj.totalWeight;
          price = price + obj.totalPrice * 0.95;
        }
      }
      this.form.number = number.toFixed(2);
      this.form.ysPrice = price.toFixed(2);
    },
    //溢出选中数据
    deleteOccRow(index, rows) {
      this.form.ocrData.splice(index, 1);
      this.jsOcr();
    },
    //确认选择数据
    toggleSelection() {
      this.tableselData = this.tableybData;
      let number = 0.0;
      let price = 0.0;
      for (let i = 0; i < this.tableselData.length; i++) {
        if (this.form.proportion == "95%") {
          let obj = this.tableselData[i];
          console.log(obj);
          number = number + obj.totalWeight;
          price = price + obj.totalPrice * 0.95;
        }
      }
      this.form.number = number.toFixed(2);
      this.form.ysPrice = price.toFixed(2);
      this.visible = false;
    },
    changeProject(projectId) {
      this.listForBusArr = []
      this.form.stId = ''
      this.form.stName = ''
      this.form.serialNo = ''
      if (projectId){
        this.loadBusinessForCombobox(projectId);
      }
    },
    //选择项目
    changeSt(stId) {
      let businessFind = this.listForBusArr.filter(x => x.stId == stId);
      if (businessFind && businessFind.length > 0) {
        this.reset();
        let obj = businessFind[0];
        this.form.stName = obj.stName;
        this.form.serialNo = obj.serialNo;
        let projectFind = this.listForProArr.filter(x => x.projectId == obj.projectId);
        if (projectFind && projectFind.length > 0) {
          this.form.uName = projectFind[0].userName;
          this.form.tName = projectFind[0].terminalName;
        }
        let data = { stId: obj.stId, proportion: this.form.proportion };
        findInit(data).then((response) => {
          this.form.totalPrice = parseFloat(response.data.price).toFixed(2);
          this.form.number = parseFloat(response.data.number).toFixed(2);
          this.jsTax();
        });
      }
    },

    //计算ocr列表
    jsOcr() {
      let price = 0;
      let tax = 0;
      let totalPrice = 0;
      for (let i = 0; i < this.form.ocrData.length; i++) {
        let obj = this.form.ocrData[i];

        let ocrprice = 0;
        if (obj.price != null && obj.price != "") {
          ocrprice = obj.price;
        }
        price = parseFloat(price) + parseFloat(ocrprice);

        let ocrtax = 0;
        if (obj.tax != null && obj.tax != "") {
          ocrtax = obj.tax;
        }
        tax = parseFloat(tax) + parseFloat(ocrtax);

        let ocrtotal = 0;
        if (obj.total != null && obj.total != "") {
          ocrtotal = obj.total;
        }
        totalPrice = parseFloat(totalPrice) + parseFloat(ocrtotal);
      }
      this.form.price = price.toFixed(2);
      this.form.tax = tax.toFixed(2);
      this.form.totalPrice = totalPrice.toFixed(2);
    },

    //更改比例
    updateProportion() {
      if (this.form.stId == null || this.form.stId == "") {
        this.msgError("请选择项目");
        return;
      }
      this.reset();
      let data = { stId: this.form.stId, proportion: this.form.proportion };
      findInit(data).then((response) => {
        this.form.totalPrice = parseFloat(response.data.price).toFixed(2);
        this.form.number = parseFloat(response.data.number).toFixed(2);
        this.jsTax();
      });
    },
    jsTax() {
      // let price=0.00
      // if(this.form.price!=null && this.form.price!=''){
      //   price=this.form.price
      // }
      // this.form.tax=(parseFloat(price)/1.13*0.13).toFixed(2)
      // this.form.totalPrice=parseFloat(this.form.tax)+parseFloat(price);

      let totalPrice = 0.0;
      if (this.form.totalPrice != null && this.form.totalPrice != "") {
        totalPrice = this.form.totalPrice;
      }
      this.form.price = (parseFloat(totalPrice) / 1.13).toFixed(2);
      this.form.tax = (
        parseFloat(totalPrice) - parseFloat(this.form.price)
      ).toFixed(2);
    },
  },
};
</script>
