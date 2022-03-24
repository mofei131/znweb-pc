<template>
<el-card class="box-card">
  <iframe style="background-color: #f3f5f7;border: 1px dashed #cc9797;border-radius: 6px;" width="100%" height="635" scrolling="no" frameborder="no" :src="url"></iframe>
</el-card>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style></style>
