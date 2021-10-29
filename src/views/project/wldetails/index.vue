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
          v-hasPermi="['project:wldetails:add']"
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
<!--          v-hasPermi="['project:wldetails:edit']"-->
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
<!--          v-hasPermi="['project:wldetails:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['project:wldetails:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wldetailsList" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="stName" />
      <el-table-column label="不含税金额合计" align="center" prop="tntPrice" />
      <el-table-column label="补税金额" align="center" prop="bsPrice" />
      <el-table-column label="价税合计" align="center" prop="jstPrice" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收票状态" align="center" prop="spState" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleLook(scope.row)"
          >查看</el-button>
          <el-button
            v-if="scope.row.spState=='未收票'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:wldetails:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.spState=='未收票'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateOk(scope.row)"
            v-hasPermi="['project:wldetails:edit']"
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

    <!-- 添加或修改物流收票对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="运输类型" prop="type">-->
<!--              <el-radio-group v-model="form.type">-->
<!--                <el-radio label="汽运">汽运</el-radio>-->
<!--                <el-radio label="火运">火运</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <!--物流收票明细-->
        <el-row style="margin-top: 20px">
          <el-col :span="12">
            <el-button type="primary" @click="addTableData" style="margin-bottom: 30px;">追加费用</el-button>
          </el-col>
        </el-row>
        <div  style="margin-bottom: 30px">
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
        <el-row  >
          <el-col :span="5">
            <el-form-item label="不含税金额合计" prop="tntPrice" label-width="120px">
              <span v-text="form.tntPrice"></span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="补税金额" prop="bsPrice" label-width="120px">
              <span v-text="form.bsPrice"></span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="价税合计" prop="bsPrice" label-width="120px">
              <span v-text="form.jstPrice"></span>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWldetails, getWldetails, delWldetails, addWldetails, updateWldetails } from "@/api/project/wldetails";
import { getToken } from '@/utils/auth'
import { getStList } from '@/api/project/lpayment'
import { getContract, getGrnList } from '@/api/project/apayment'

export default {
  name: "Wldetails",
  data() {
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
      // 物流收票表格数据
      wldetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pid: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stId: [
          { required: true, message: "请选择项目名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择运输方式", trigger: "blur" }
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
      },
      tableUpdate:false,
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      // 项目集合
      stOptions: [],
    };
  },
  created() {
    this.getList();
    getStList().then(response => {
      this.stOptions = response.rows;
    });
  },
  methods: {
    /** 查询物流收票列表 */
    getList() {
      this.loading = true;
      listWldetails(this.queryParams).then(response => {
        this.wldetailsList = response.rows;
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
        wldetailsId: null,
        stId:null,
        stId2:null,
        stName:null,
        number: null,
        wlType: null,
        ntPrice: null,
        tax: null,
        taxPrice: null,
        pid: null,
        createBy: null,
        createTime: null,
        wldetailsList:[],
        tntPrice:null,
        bsPrice:null,
        jstPrice:null,
        fileList:[],
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
      this.ids = selection.map(item => item.wldetailsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.type="汽运";
      this.open = true;
      this.title = "添加物流收票";
    },
    /** 查看按钮操作 */
    handleLook(row) {
      this.reset();
      this.tableData=[];
      this.tablegryData=[];
      this.tableselData=[];
      const wldetailsId = row.wldetailsId || this.ids
      this.$router.push("/wldetails/look/" + wldetailsId);
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.wldetailsList=[];
      this.form.fileList=[];
      this.fileList=[];
      const wldetailsId = row.wldetailsId || this.ids
      getWldetails(wldetailsId).then(response => {
        this.form = response.data;
        this.fileList = this.form.fileList;
        this.form.stId2 = this.form.stId;
        this.form.stId = this.form.stName;
        this.open = true;
        this.title = "修改物流收票";
      });
    },
    /** 修改按钮操作 */
    handleUpdateOk(row) {
      this.loading = true;
      this.reset();
      const wldetailsId = row.wldetailsId || this.ids
      getWldetails(wldetailsId).then(response => {
        this.form = response.data;
        this.form.spState="已收票"
        updateWldetails(this.form).then(response => {
          this.loading = false;
          this.msgSuccess("收票成功");
          this.getList();
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.stId=this.form.stId2
          if (this.form.wldetailsId != null) {
            updateWldetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWldetails(this.form).then(response => {
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
      const wldetailsIds = row.wldetailsId || this.ids;
      this.$confirm('是否确认删除物流收票编号为"' + wldetailsIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWldetails(wldetailsIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/wldetails/export', {
        ...this.queryParams
      }, `project_wldetails.xlsx`)
    },
    //业务开始
    //选择项目
    changeSt(obj){
      this.form.stId2 = obj.stId
      this.form.stName = obj.name
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
      this.form.jstPrice=taxTotalPrice+tntPrice
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
