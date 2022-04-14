<template>
<el-card class="box-card">
  <iframe id="iframe_document" style="background-color: #f3f5f7;border: 1px dashed #cc9797;border-radius: 6px;" width="100%" height="545"  frameborder="no" :src="url"></iframe>
</el-card>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      let loadingInstance = this.$loading({
        lock: true,
        text: '加载中'
      });
      document.getElementById('iframe_document').height = document.documentElement.clientHeight-document.getElementById('iframe_document').offsetTop-80;
      document.getElementById('iframe_document').onload=function(){ 
        loadingInstance.close();
      }
    })
  },
  methods: {}
}
</script>

<style></style>
