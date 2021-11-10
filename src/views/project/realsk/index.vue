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
          v-hasPermi="['project:realsk:add']"
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
<!--          v-hasPermi="['project:realsk:edit']"-->
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
<!--          v-hasPermi="['project:realsk:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:realsk:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="realskList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="预估应收" align="center" prop="ygPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.ygPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="开票金额" align="center" prop="kpPrice" >
        <template slot-scope="scope">
          {{
            Number(scope.row.kpPrice)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="结算单价" align="center" prop="jsDj" >
        <template slot-scope="scope">
          {{
            Number(scope.row.jsDj)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="结算煤量" align="center" prop="jsMl" />
      <el-table-column label="结算煤款" align="center" prop="jsMk" >
        <template slot-scope="scope">
          {{
            Number(scope.row.jsMk)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="结算税款" align="center" prop="jsTax" >
        <template slot-scope="scope">
          {{
            Number(scope.row.jsTax)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, "$1,")
          }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
          >查看</el-button>
          <el-button
            v-if="scope.row.state=='3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateSk(scope.row)"
          >收款</el-button>
          <el-button
            v-if="scope.row.state=='3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openPayDetailss(scope.row)"
          >收款明细</el-button>
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

    <!-- 添加或修改实际收款对话框 -->
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
            <el-form-item label="预估应收" prop="ygPrice">
              <span v-text="form.ygPrice"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票金额" prop="kpPrice">
              <span v-text="form.kpPrice"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票吨数" prop="kpNumber">
              <span v-text="form.kpNumber"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算单总金额(元)" prop="jstPrice">
              <el-input v-model="form.jstPrice" placeholder="请输入结算单总金额(元)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="热值(Kcal/吨)" prop="rz">
              <el-input v-model="form.rz" placeholder="请输入热值(Kcal/吨)" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--        煤炭质量-->
        <el-form-item label="煤炭质量" >
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-table :data="coalTable" fit style="margin-bottom: 22px;">
              <el-table-column   label="水分(%)">
                <template slot-scope="scope"   >
                  <el-form-item label-width="0"  prop="coalSf" >
                    <el-input v-model="form.coalSf" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column  label="内水(%)">
                <template slot-scope="scope"  >
                  <el-form-item label-width="0"  prop="coalNs" >
                   <el-input v-model="form.coalNs" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column  label="灰份(%)">
                <el-table-column  label="Aad">
                  <template slot-scope="scope"  >
                    <el-form-item label-width="0"  prop="coalAad" >
                      <el-input v-model="form.coalAad" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column  label="ad">
                  <template slot-scope="scope"  >
                    <el-form-item label-width="0"  prop="coalAd" >
                     <el-input v-model="form.coalAd" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="挥发份(%)">
                <el-table-column  label="Vda">
                  <template slot-scope="scope"  >
                    <el-form-item label-width="0"  prop="coalVda" >
                      <el-input v-model="form.coalVda" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column  label="Vdaf">
                  <template slot-scope="scope"  >
                    <el-form-item label-width="0"  prop="coalVdae" >
                     <el-input v-model="form.coalVdae" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column  label="灰熔点(℃)">
                <template slot-scope="scope"  >
                  <el-form-item label-width="0"  prop="coalHrd" >
                    <el-input v-model="form.coalHrd" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column   label="固定碳(%)">
                <template slot-scope="scope"  >
                  <el-form-item label-width="0"  prop="coalGdt" >
                    <el-input v-model="form.coalGdt" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column  label="含硫量(%)">
                <template slot-scope="scope"  >
                  <el-form-item label-width="0"  prop="coalHll" >
                   <el-input v-model="form.coalHll" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="热值(%)">
                <el-table-column  label="Qgr,ad">
                  <template slot-scope="scope"   >
                    <el-form-item label-width="0"  prop="coalQgrad" >
                     <el-input v-model="form.coalQgrad" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column  label="Qnt,ar">
                  <template slot-scope="scope"   >
                    <el-form-item label-width="0"  prop="coalQntar" >
                     <el-input v-model="form.coalQntar" placeholder="请输入" />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算单价" prop="jsDj">
              <el-input v-model="form.jsDj" placeholder="请输入结算单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算煤量" prop="jsMl">
              <el-input v-model="form.jsMl" placeholder="请输入结算煤量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算煤款" prop="jsMk">
              <el-input v-model="form.jsMk" placeholder="请输入结算煤款" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算税款" prop="jsTax">
              <el-input v-model="form.jsTax" placeholder="请输入结算税款" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="node">
              <el-input type="textarea" :rows="5" v-model="form.node" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <el-form-item label="附件" prop="file" label-width="50px">
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
        </div>


        <div v-if="isLook=='4'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="应收金额：" >
                <span v-text="form.jstPrice"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="已收金额：" >
                <span v-text="form.ysPrice"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="剩余应收：" >
                <span v-text="form.jstPrice-form.ysPrice"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收款金额(元)" prop="payPrice">
                <el-input v-model="form.skPrice" placeholder="请输入付款金额" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款日期" prop="payTime">
                <el-date-picker clearable size="small" style="width: 100%;"
                                v-model="form.skTime"
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRealsk, getRealsk, delRealsk, addRealsk, updateRealsk, findInit } from "@/api/project/realsk";
import { getStList } from '@/api/project/cplan'
import { getToken } from '@/utils/auth'
import { getContract } from '@/api/project/apayment'

export default {
  name: "Realsk",
  data() {
    // 可空两位小数点
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
      // 实际收款表格数据
      realskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
        coalSf: [
        ],
        coalNs: [
        ],
        coalAad: [
        ],
        coalAd: [
        ],
        coalVda: [
        ],
        coalVdae: [
        ],
        coalHrd: [
        ],
        coalHll: [
        ],
        coalGdt: [
        ],
        coalQgrad: [
        ],
        coalQntar: [
        ],
        jstPrice: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
        rz: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
        jsDj: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
        jsMl: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
        jsMk: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
        jsTax: [
          {  validator: validatePrice3, trigger: "blur" }
        ],
      },
      // 项目集合
      stOptions: [],
      //审批
      stateOptions:[],
      coalTable: [
        {show:true}
      ],
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      isLook:1,
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

    if(this.$route.params.isEdit!=null && this.$route.params.isEdit!=undefined && this.$route.params.isEdit=="true"){
      let realskId=this.$route.params.realskId
      let row={"realskId":realskId}
      this.handleUpdate(row)
    }
    if(this.$route.params.isAdd!=null && this.$route.params.isAdd!=undefined  && this.$route.params.isAdd=="true"){
      this.handleAdd()
    }
  },
  methods: {
    /** 查询实际收款列表 */
    getList() {
      this.loading = true;
      listRealsk(this.queryParams).then(response => {
        this.realskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      getStList().then(response => {
        this.stOptions = response.rows;
      });
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
        realskId: null,
        stId: null,
        stId2:null,
        stName: null,
        ygPrice: null,
        kpPrice: null,
        kpNumber: null,
        jstPrice: null,
        rz: null,
        coalSf: null,
        coalNs: null,
        coalAad: null,
        coalAd: null,
        coalVda: null,
        coalVdae: null,
        coalHrd: null,
        coalGdt: null,
        coalHll: null,
        coalQgrad: null,
        coalQntar: null,
        jsDj: null,
        jsMl: null,
        jsMk: null,
        jsTax: null,
        node: null,
        createBy: null,
        createTime: null,
        fileList:[],
        rate:null,
        msfp:null,
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
      this.ids = selection.map(item => item.realskId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList=[];
      this.form.fileList=[];
      this.isLook=1;
      this.open = true;
      this.title = "添加实际收款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const realskId = row.realskId || this.ids
      getRealsk(realskId).then(response => {
        this.form = response.data;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.fileList = this.form.fileList;
        this.isLook=2;
        this.open = true;
        this.title = "修改实际收款";
      });
    },
    /** 修改按钮操作 */
    handleUpdateSk(row) {
      this.reset();
      const realskId = row.realskId || this.ids
      getRealsk(realskId).then(response => {
        this.form = response.data;
        this.isLook = 4;
        this.open = true;
        this.title = "收款";
      });
    },

    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      const realskId = row.realskId || this.ids
      this.$router.push("/realsk/look/" + realskId);
    },

    /** 查看付款明细 */
    openPayDetailss(row) {
      this.$router.push({name: 'paydetailsList', query:{type:'realsk',pid:row.realskId}})
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.stId=this.form.stId2
          if (this.form.realskId != null) {
            updateRealsk(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRealsk(this.form).then(response => {
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
      const realskIds = row.realskId || this.ids;
      this.$confirm('是否确认删除实际收款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRealsk(realskIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/realsk/export', {
        ...this.queryParams
      }, `project_realsk.xlsx`)
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

    //业务开始
    //选择项目
    changeSt(obj){
      this.form.stId2 = obj.stId
      this.form.stName = obj.name

      let data={stId:obj.stId}
      findInit(data).then(response => {
        this.form.ygPrice=response.data.ygPrice
        this.form.kpPrice=response.data.kpPrice
        this.form.kpNumber=response.data.kpNumber
      })

      //成本年服务费率
      if(obj.chargemType=='1' || obj.chargemType=='3'){
        this.form.rate=obj.chargemNx
      }else{
        this.form.rate=0
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
  }
};
</script>
