<template>
  <el-dialog
    title="预览"
    :visible="true"
    :fullscreen="true"
    :show-close="false"
  >
    <base-excel
      v-if="previewFileType == 'excel'"
      :url="previewUrl"
    ></base-excel>
    <iframe-pdf
      v-else-if="previewFileType == 'other'"
      :url="previewUrl"
    ></iframe-pdf>
  </el-dialog>
</template>
<script>
import BaseExcel from "@/views/components/excel/base";
import IframePdf from "@/views/components/pdf/iframePdf";
import { Base64 } from "js-base64";
import { parseUrl, getFileInfo } from "@/api/project/st";
export default {
  name: "PreviewPage",
  components: {
    BaseExcel,
    IframePdf,
  },
  data() {
    return {
      previewUrl: "",
      previewFileType: "",
      supportPreview: false,
      fileId: "",
    };
  },
  props: {},
  mounted() {
    this.fileId = this.$route.query.fileId;
    this.loadFileData();
  },
  methods: {
    //加载附件数据
    loadFileData() {
      let _this = this;
      getFileInfo({ fileId: this.fileId }).then((response) => {
        console.log("返回", response);
        _this.handlePreview(response.data);
      });
    },
    //点击触发
    handlePreview(file) {
      this.previewFileType = "";
      this.supportPreview = false;
      let url = "";
      if (file.response == undefined) {
        url = file.url;
        //window.open(file.url)
      } else {
        url = file.response.data.url;
        //window.open(file.response.data.url)
      }
      parseUrl({ path: Base64.encode(encodeURIComponent(url)) }).then((response) => {
        let support = response.data.support;
        this.previewFileType = response.data.type;
        if (support) {
          // 支持在线预览
          this.previewUrl =
            `${process.env.VUE_APP_BASE_API}/file/urlResolve?path=` +
            Base64.encode(encodeURIComponent(url));
          this.supportPreview = true;
        } else {
          // 不支持在线预览
          this.supportPreview = false;
          window.open(`${process.env.VUE_APP_BASE_API}/file/download?path=`+Base64.encode(encodeURIComponent(url)));
        }
      });
    },
  },
};
</script>
<style></style>
