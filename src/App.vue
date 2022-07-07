<template>
  <div id="app" class="main-app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
}
</script>
<style>
 .el-dialog__header {
    background: #ECEDF4;
  }
  .el-dialog__footer {
    display: flex;
    margin-left:222px
  }
  .dv-scroll-board .header-item{
    background: #4E9AFD;
  }
  .dv-scroll-board .ceil{
    background:#ffffff;
    color:#333333;
    border-bottom:1px solid #ECEDF4
  }
</style>
