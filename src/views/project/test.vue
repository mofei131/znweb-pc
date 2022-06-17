<template>
  <div class="faterBox app-container">
      <div
        class="scroll-content"
        @scroll="onScroll"
        :style="
          'overflow-x: hidden; overflow-y: auto;height:' + contentStyleObj.height
        "
      >
        <!-- 用户管理 -->
        <div :ref="tabs[0].refName" class="scroll-item">
          <div class="line-name">
            <h2>{{ tabs[0].name }}</h2>
          </div>
          <div>
            <p
              style="height: 40px"
              v-for="item in [
                0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
              ]"
              :key="item"
            >
              待发货符合规范化如故
            </p>
          </div>
        </div>
        <!-- 配置管理 -->
        <div :ref="tabs[1].refName" class="scroll-item">
            <div class="line-name">
            <h2>{{ tabs[1].name }}</h2>
          </div>
          <div>
            <p
              style="height: 40px"
              v-for="item in [
                0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
              ]"
              :key="item"
            >
              新能说出的基本功发到你DNF不得发布
            </p>
          </div>
        </div>
        <!-- 角色管理 -->
        <div
          :ref="tabs[2].refName"
          class="scroll-item"
          style="padding-top: 1rem; top: 5px"
        >
        <div class="line-name">
            <h2>{{ tabs[2].name }}</h2>
          </div>
          <div>
            <p
              v-for="item in [
                0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
              ]"
              :key="item"
            >
              新水泥厂剧场版
            </p>
          </div>
        </div>
        <!-- 角色管理2 -->
        <div
          :ref="tabs[3].refName"
          class="scroll-item"
          style="padding-top: 1rem; top: 5px"
        >
        <div class="line-name">
            <h2>{{ tabs[3].name }}</h2>
          </div>
          <div>
            <p
              v-for="item in [
                0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
              ]"
              :key="item"
            >
              新水泥厂剧场版
            </p>
          </div>
        </div>
      </div>
      <el-tabs
            class="customer-tab"
            type="card"
            tab-position="right"
            @tab-click="jump"
            v-model="tabName"
          >
            <el-tab-pane
              v-for="(tab, index) in tabs"
              :name="tab.refName"
              :key="index"
              :label="tab.name"
            ></el-tab-pane>
          </el-tabs>
      </div>
</template>
<script>
export default {
  name: 'index',
  props: {},
  components: {},
  data() {
    return {
      tabIndex: '0',
      contentStyleObj: {
        height: '100px',
      },
      tabName: 'setOneRef',
      tabs: [
        {
          name: '用户管理',
          refName: 'setOneRef',
        },
        {
          name: '配置管理',
          refName: 'setTwoRef',
        },
        {
          name: '角色管理',
          refName: 'setThreeRef',
        },
        {
          name: '角色管理2',
          refName: 'setFourRef',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getHight()
    window.addEventListener('resize', this.getHight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getHight)
  },
  methods: {
    // tab click
    jump(tab, event) {
      let target = document.querySelector('.scroll-content')
      let scrollItems = document.querySelectorAll('.scroll-item')
      // 判断滚动条是否滚动到底部
      if (target.scrollHeight <= target.scrollTop + target.clientHeight) {
        this.tabIndex = tab.index.toString()
      }
      let totalY = scrollItems[tab.index].offsetTop - scrollItems[0].offsetTop // 锚点元素距离其offsetParent(这里是body)顶部的距离(待滚动的距离)
      let distance = document.querySelector('.scroll-content').scrollTop // 滚动条距离滚动区域顶部的距离
      // let distance = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset // 滚动条距离滚动区域顶部的距离(滚动区域为窗口)
      // 滚动动画实现, 使用setTimeout的递归实现平滑滚动，将距离细分为50小段，10ms滚动一次
      // 计算每一小段的距离
      let step = totalY / 50
      if (totalY > distance) {
        smoothDown(document.querySelector('.scroll-content'))
      } else {
        let newTotal = distance - totalY
        step = newTotal / 50
        smoothUp(document.querySelector('.scroll-content'))
      }

      // 参数element为滚动区域
      function smoothDown(element) {
        if (distance < totalY) {
          distance += step
          element.scrollTop = distance
          setTimeout(smoothDown.bind(this, element), 10)
        } else {
          element.scrollTop = totalY
        }
      }

      // 参数element为滚动区域
      function smoothUp(element) {
        if (distance > totalY) {
          distance -= step
          element.scrollTop = distance
          setTimeout(smoothUp.bind(this, element), 10)
        } else {
          element.scrollTop = totalY
        }
      }
    },
    // 滚动条滚动
    onScroll(e) {
      let scrollItems = document.querySelectorAll('.scroll-item')
      for (let i = scrollItems.length - 1; i >= 0; i--) {
        // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
        let judge =
          e.target.scrollTop >=
          scrollItems[i].offsetTop - scrollItems[0].offsetTop - 400
        if (judge) {
          this.tabIndex = i.toString()
          // 找对应的tab-name值
          this.tabName = this.tabs[this.tabIndex].refName
          break
        }
      }
    },
    getHight() {
      this.contentStyleObj.height = window.innerHeight - 190 + 'px'
    },
  },
}
</script>
<style scoped rel="stylesheet/scss" lang="scss">
.faterBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
