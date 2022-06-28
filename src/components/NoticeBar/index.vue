<template>
  <div style="display: flex">
    <div
      style="
        width: 108px;
        padding-left: 17px;
        background-color: #EAF3FF;
        color: #333333;
        display: flex;
        align-items: center;
      "
    >
      <img
        style="width: 22px; height: 22px; margin-right: 6px"
        src="../../../public/img/tongzhi.png"
        alt=""
      />
      <span style="line-height: 22px">通知：</span>
    </div>
    <div id="tips">
      <span class="span1">{{ tongzhi }}</span>
      <span class="span2">{{ tongzhi }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "scroll",
  props: {
    tongzhi:{
      value:String
    }
  },
};
</script>

<style scoped>
#tips {
  position: relative;
  width: 100%;
  line-height: 40px;
  height: 40px;
  background: #EAF3FF;
  overflow: hidden;
  color: #333333;
}
#tips span {
  position: absolute;
  left: 0;
  margin: 0 10px;
  white-space: nowrap;
}
@keyframes around1 {
  from {
    left: 0;
  }
  to {
    left: -100%;
  }
}
@keyframes around2 {
  from {
    left: 100%;
  }
  to {
    left: 0;
  }
}
#tips .span1 {
  animation: around1 10s linear infinite;
}
#tips .span2 {
  animation: around2 10s linear infinite;
}
</style>