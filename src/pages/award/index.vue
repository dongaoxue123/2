<template>
  <div class="data-page">
    <main class="content">
      <div>
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
              <header><span class="iconfont icon-iconset0203"></span><h1>累计新用户数</h1></header>
              <span class="money">{{awardData.totalNewUserNumber}}</span>
            </div>
          </van-col>
          <van-col span="10" offset="2">
            <div class="card">
               <header><span class="iconfont icon-income-o monMoney"></span><h1>累计奖励金额</h1></header>
               <span class="money">￥ {{awardData.totalNewUserAward}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
      <div>
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
              <header><span class="iconfont icon-yonghuming"></span><h1>当月新用户数</h1></header>
              <span class="money">{{awardData.monthNewUserNumber}}</span>
            </div>
          </van-col>
          <van-col span="10" offset="2">
            <div class="card">
              <header><span class="iconfont icon-yly_qianzhuang monMoney"></span><h1>当月奖励金额</h1></header>
              <span class="money">￥ {{awardData.monthNewUserAward}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
      <div @click="showData">
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
              <header><span class="iconfont icon-yonghuming1"></span><h1>当日新用户数</h1></header>
              <span class="money">{{awardData.todayNewUserNumber}}</span>
            </div>
          </van-col>
          <van-col span="10" offset="2">
            <div class="card">
              <header><span class="iconfont icon-qian monMoney"></span><h1>当日奖励金额</h1></header>
              <span class="money">￥ {{awardData.todayNewUserAward}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </main>
  </div>
</template>


<script>
import store from '@/stores/store'
import { getNewUserAward } from '@/utils/api'
import '@/style/style.css'
export default {
  onShow () {
    // 这里回调函数处于其他函数内部，this绑定的不是vue实例，所以需要在外部定义
    let that = this
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    getNewUserAward(store.state.adminId).then((res) => {
      wx.hideToast()
      if (res.flag) {
        // console.log(res.data)
        that.awardData = res.data
      }
    })
  },
  data () {
    return {
      awardData: {
        todayNewUserNumber: 0,
        monthNewUserNumber: 0,
        totalNewUserNumber: 0,
        todayNewUserAward: 0.0,
        monthNewUserAward: 0.0,
        totalNewUserAward: 0.0
      }
    }
  },
  methods: {
    showData () {
    }
  },
  // 页面下拉刷新列表
  onPullDownRefresh () {
    getNewUserAward(store.state.adminId).then((res) => {
      wx.stopPullDownRefresh()
      wx.hideToast()
      if (res.flag) {
        // console.log(res.data)
        this.awardData = res.data
      }
    })
  }
}
</script>

<style>
  .data-page {
    height: 100vh;
    padding: 20rpx;
    background: #ededed;
    font-family:Arial, Helvetica, sans-serif;
  }
  .card {
    width: 100%;
  }
  .card {
    font-size: 50rpx;
    background: white;
    margin: 20rpx 0;
    display: flex;
    flex-direction: column;
     border-radius: 20rpx;
  }
  .card header {
    font-size: 30rpx;
    height: 80rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ededed;
    padding: 0 20rpx;
  }
</style>
