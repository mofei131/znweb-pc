<style>

.disUoloadSty .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
.el-input.is-disabled .el-input__inner {
  border: 0px;
  background-color:#FFF; /* 设置背景颜色为黑色 */
}
</style>
<template>
  <div class="app-container">
    <!-- 添加或修改前段管理对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="12" :offset="1">
          <span>
            手机端系统配置
          </span>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="primary"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate1()"-->
<!--            style="margin-left: 10px;"-->
<!--          >修改</el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="公司" prop="gsName">
            <el-input :disabled="edit1" v-model="form.gsName" placeholder="请输入公司" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="联系人" prop="userName">
            <el-input :disabled="edit1" v-model="form.userName" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="电话" prop="phone">
            <el-input :disabled="edit1" v-model="form.phone" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="地址" prop="adress">
            <el-input :disabled="edit1" v-model="form.adress" placeholder="请输入地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="免责声明" prop="statement">
            <el-input :disabled="edit1" v-model="form.statement" placeholder="请输入免责声明" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;">
        <el-col :span="12" :offset="1">
          <span>
            官网端系统配置
          </span>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="primary"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate2()"-->
<!--            style="margin-left: 10px;"-->
<!--          >修改</el-button>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="公众号" prop="file">
                <el-upload
                  :disabled="edit2"
                  :class="{uoloadSty:showBtnImg,disUoloadSty:noneBtnImg}"
                  class="upload-demo"
                  :action="url"
                  :headers="headers"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :before-remove="beforeRemove"
                  :on-change="imgChange"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  list-type="picture-card"
                  :file-list="fileList">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8" >
          <el-row>
            <el-col :span="12">
              <el-form-item label="App" prop="file">
                <el-upload
                  :disabled="edit2"
                  :class="{uoloadSty:showBtnImg2,disUoloadSty:noneBtnImg2}"
                  class="upload-demo"
                  :action="url"
                  :headers="headers"
                  :on-preview="handlePreview2"
                  :on-remove="handleRemove2"
                  :on-success="uploadSuccess2"
                  :on-error="uploadError2"
                  :before-remove="beforeRemove2"
                  :on-change="imgChange2"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed2"
                  list-type="picture-card"
                  :file-list="fileList2">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="edit1==false || edit2==false" type="primary" @click.once="submitForm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { listQdm, getQdm, delQdm, addQdm, updateQdm } from "@/api/project/qdm";
import {getToken} from "@/utils/auth";

export default {
  name: "Qdm",
  data() {
    return {
      //上传路径
      url:process.env.VUE_APP_BASE_API + "/file/upload",
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      //文件集合
      fileList: [],
      fileList2: [],
      edit1:false,
      edit2:false,
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
      // 前段管理表格数据
      qdmList: [],
      showBtnImg:true,
      noneBtnImg:false,

      showBtnImg2:true,
      noneBtnImg2:false,

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询前段管理列表 */
    getList() {
      this.loading = true;
      // listQdm(this.queryParams).then(response => {
      //   this.qdmList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
      this.reset();
      const qdmId = 1
      getQdm(qdmId).then(response => {
        this.form = response.data;
        console.log(response.data)
        this.fileList = response.data.fileList
        this.noneBtnImg = this.fileList.length >= 1;
        this.fileList2 = response.data.fileList2
        this.noneBtnImg2 = this.fileList2.length >= 1;
        this.loading = true;
      });
    },
    // 取消按钮
    cancel() {
      this.edit1 = true;
      this.edit2 = true;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        qdmId: null,
        gsName: null,
        userName: null,
        phone: null,
        adress: null,
        statement: null,
        img1: null,
        img2: null,
        createBy: null,
        createTime: null,
        fileList:[],
        fileList2:[],
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
      this.ids = selection.map(item => item.qdmId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加前段管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const qdmId = row.qdmId || this.ids
      getQdm(qdmId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改前段管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.qdmId != null) {
            updateQdm(this.form).then(response => {
              this.msgSuccess("修改成功");
              // this.open = false;
              this.getList();
            });
          } else {
            addQdm(this.form).then(response => {
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
      const qdmIds = row.qdmId || this.ids;
      this.$confirm('是否确认删除前段管理编号为"' + qdmIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delQdm(qdmIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('project/qdm/export', {
        ...this.queryParams
      }, `project_qdm.xlsx`)
    },
//点击触发
    handlePreview(file) {
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove(file, filelist) {
      this.noneBtnImg = filelist.length >= 1;
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
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // res 表示请求响应体
    uploadSuccess(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList=[];
        for(var i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined ) {
            if(filelist[i].response.code != 500){
              let name = filelist[i].response.data.name;
              let url = filelist[i].response.data.url;
              let art = {"name": name, "url": url};
              this.form.fileList.push(art);
            }
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

    imgChange(file, fileList){
      this.noneBtnImg = fileList.length >= 1;
    },





    //点击触发
    handlePreview2(file) {
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove2(file, filelist) {
      this.noneBtnImg2 = filelist.length >= 1;
      this.form.fileList2=[];
      for(let i=0;i<filelist.length;i++){
        if (filelist[i].response != undefined) {
          let art = {"name": filelist[i].response.data.name, "url": filelist[i].response.data.url};
          this.form.fileList2.push(art);
        }else {
          let art = {"name": filelist[i].name, "url": filelist[i].url};
          this.form.fileList2.push(art);
        }
      }
    },
    handleExceed2(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // res 表示请求响应体
    uploadSuccess2(res, file, filelist) {
      if (res.code == '200') {
        this.form.fileList2=[];
        for(var i=0;i<filelist.length;i++) {
          if (filelist[i].response != undefined ) {
            if(filelist[i].response.code != 500){
              let name = filelist[i].response.data.name;
              let url = filelist[i].response.data.url;
              let art = {"name": name, "url": url};
              this.form.fileList2.push(art);
            }
          }else {
            let name = filelist[i].name;
            let url = filelist[i].url;
            let art = {"name": name, "url": url};
            this.form.fileList2.push(art);
          }
        }
        this.$message.success("上传成功");

      } else {
        this.$message.error(res.msg);
        let index = filelist.indexOf(file);
        filelist.splice(index,1);
      }
    },
    uploadError2(err, file, filelist) {
      this.$message.error("上传失败");
    },

    imgChange2(file, fileList){
      this.noneBtnImg2 = fileList.length >= 1;
    },

    handleUpdate1(){
      this.edit1=false;
    },
    handleUpdate2(){
      this.edit2=false;
    },

  }
};
</script>
