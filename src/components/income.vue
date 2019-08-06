<template>
  <div class="income">
    <main @click="checkToTodaydetails">
        <div class="left">
          <h1>+{{price}}</h1>
          <time>{{time}}</time>
        </div>
        <!--<span class="newUser"><span v-if="isShow">新用户</span> +{{everyNewAward}}</span>-->
        <div class="right">
          <van-icon name="arrow" color="#999"></van-icon>
        </div>
    </main>
  </div>
</template>
<script>
import store from '@/stores/store'
import { getTimeFormat } from '@/utils/util'
export default {
  props: ['pageContent', 'index'],
  data () {
    return {
      everyNewAward: store.state.everyNewAward
    }
  },
  computed: {
    price () {
      return this.pageContent.price.toFixed(2)
    },
    time () {
      return getTimeFormat(this.pageContent.createTime)
    },
    isShow () {
      // console.log(this.index)
      return this.index === 0
    }
  },
  methods: {
    checkToTodaydetails () {
      let pageContent = this.pageContent
      // console.log(pageContent)
      store.commit('getDataList', pageContent)
      wx.navigateTo({'url': '/pages/details/main'})
    }
  }
}
</script>

<style>
.income {
  /* background: #ededed; */
  background: white;
}
.income main {
    display: flex;
    justify-content: space-between;
    background: white;
    padding: 20rpx 20rpx 20rpx 25rpx;
    border-bottom: 1rpx solid #ededed;
    z-index: 1;
}
.left time {
    font-size: 30rpx;
    color: #999;
    padding-left: 8rpx;
}
.left {
    display: flex;
    flex-direction: column;
}
.left h1 {
    font-size: 40rpx;
    margin-bottom: 8rpx;
}
.left span {
    font-size: 30rpx;
    color: #666;
    margin-top: 20rpx;
}
.right {
    display: flex;
    align-items: center;
    justify-content: center;
}
.newUser{
  color:red;
  font-size: 30rpx;
  margin-right:20rpx;
  padding:10rpx 50rpx 0 0;
  flex: 1;
  text-align: right;
}
</style>
