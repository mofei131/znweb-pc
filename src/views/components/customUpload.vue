<template>
<div>
  <el-upload :action="url" :headers="headers" class="upload-hidden" :disabled="disabled"
                list-type="text" :file-list="fileList">
         	<div slot="file" slot-scope="{file}">
        		<ul :class="['el-upload-list','el-upload-list--text',disabled?'is-disabled':'is-success']">
       			<li tabindex="0" :class="['el-upload-list__item',disabled?'is-disabled':'is-success']">
       				<span class="el-upload-list__item-name">
                  <a @click="handlePreview(file)">
                   <i class="el-icon-document"></i>
       					  {{file.name}}
                  </a>
                 <el-button size="mini" icon="el-icon-download" style="margin-left:15px" @click="handleDownload(file)">下载</el-button>
        				</span>
       				<label class="el-upload-list__item-status-label">
       					<i class="el-icon-upload-success el-icon-circle-check"></i>
       				</label>
       				<!-- <i class="el-icon-close" @click="handleRemove(file)"></i>
       				<i class="el-icon-close-tip">
       					按 delete 键可删除
       				</i> -->
       			</li>
       		</ul>
       	</div>
       </el-upload>
        <el-dialog
      title="预览"
      :visible.sync="previewDialogVisible"
      :fullscreen="true">
     <base-excel v-if="previewFileType == 'excel'" :url="previewUrl"></base-excel>
     <iframe-pdf v-else-if="previewFileType == 'other'" :url="previewUrl"></iframe-pdf>
    </el-dialog>
</div>
</template>
<script>
import {getToken} from "@/utils/auth";
import BaseExcel from '@/views/components/excel/base'
import IframePdf from '@/views/components/pdf/iframePdf'
import {Base64} from 'js-base64'
import { parseUrl } from "@/api/project/st";
export default {
  name:'CustomUpload',
  components: {
    BaseExcel,IframePdf
  },
  data(){
      return {
        //上传路径
        url:process.env.VUE_APP_BASE_API + "/file/upload",
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        previewDialogVisible: false,
        previewUrl:'',
        previewFileType:'',
        supportPreview:false
      }
  },
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  mounted(){},
  methods: {
    //点击触发
    handlePreview(file) {
      this.previewFileType = ''
      this.supportPreview = false
      let url = ''
      if(file.response==undefined){
        url = file.url
        //window.open(file.url)
      }else{
        url = file.response.data.url
        //window.open(file.response.data.url)
      }
      parseUrl({path:Base64.encode(url)}).then(response => {
        let support = response.data.support
        this.previewFileType = response.data.type
        if(support){
          // 支持在线预览
          this.previewUrl = `${process.env.VUE_APP_BASE_API}/file/urlResolve?path=`+Base64.encode(url);
          this.supportPreview = true;
          this.previewDialogVisible = true;
        }else{
          // 不支持在线预览
          this.supportPreview = false
          window.open(url)
        }
      });
    },
    handleDownload(file){
      if(file.response==undefined){
        window.open(file.url)
      }else{
        window.open(file.response.data.url)
      }
    },
    handleRemove(file){
      this.$emit('on-remove',file)
    }
  }
}
</script>
<style>
.upload-hidden .el-upload--picture-card{
  display:none;   /* 上传按钮隐藏 */
}
</style>
