<template>
  <div class="card">
    <time>{{dateShow}}</time>
    <main @click="checkToTodayIncomes">
        <div class="left">
          <h1>￥{{incomeInfo.price}}</h1>
          <span class="record-num">收款{{incomeInfo.recordNumber}}笔</span>
        </div>
        <div class="right">
          <van-icon name="arrow" color="#999"></van-icon>
        </div>
    </main>
  </div>
</template>
<script>
import store from '@/stores/store'
import { getDateFormat } from '@/utils/util'
export default {
  props: ['incomeInfo', 'index'],
  data () {
    return {
      // dateShow: this.index === 0 ? '今天' : getDateFormat(this.incomeInfo.incomeDate)
    }
  },
  mounted () {
    if (this.index === 0) {
      console.log('record组件刷新了')
      // console.log(this.incomeInfo)
    }
  },
  computed: {
    // record () {
    //   if (this.index === 0) {
    //     console.log('computed')
    //     console.log(this.incomeInfo)
    //   }
    //   return this.incomeInfo
    // },
    dateShow () {
      return this.index === 0 ? '今天' : getDateFormat(this.incomeInfo.incomeDate)
    }
  },
  methods: {
    checkToTodayIncomes () {
      let incomeInfo = this.incomeInfo
      if (incomeInfo.recordNumber === 0) {
        wx.showToast({ title: '当天没有记录', icon: 'none', duration: 2000 })
      } else {
        // 增加显示的时间属性
        incomeInfo.dateShow = this.dateShow
        store.commit('setDataPrice', incomeInfo)
        wx.navigateTo({'url': '/pages/incomes/main'})
      }
    }
  }
}
</script>
<style>
.card {
  padding: 5rpx 5rpx 25rpx 5rpx;
  background: #f8f8f8;
}
.card main {
    display: flex;
    justify-content: space-between;
    background: white;
    padding: 30rpx 33rpx 35rpx 33rpx;
    border-radius: 10rpx;
}
.card time {
    font-size: 30rpx;
    color: #999;
    margin-bottom: 13rpx;
    padding-left: 5rpx;
    overflow: hidden;
    width: 180rpx;
    height: 40rpx;
}
.left {
    display: flex;
    flex-direction: column;

}
.left h1 {
    font-size: 50rpx;
    font-family: inherit;
}
.left span {
    font-size: 30rpx;
    color: #666;
    margin-top: 12rpx;
}
.right {
    display: flex;
    align-items: center;
    justify-content: center;
}
.record-num {
  padding-left: 8rpx;
}
</style>
