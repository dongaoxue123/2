<template>
  <div class="data-page">
    <main class="content">
      <div>
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
               <header><span class="iconfont icon-zongshouru"></span><h1>总订单数</h1></header>
               <span class="money">{{countData.totalRecordNumber}}</span>
              </div>
            </van-col>
            <van-col span="10" offset="2">
              <div class="card">
                <header><span class="iconfont icon-income-o monMoney"></span><h1>总收入数</h1></header>
                <span class="money">￥ {{countData.totalMoney}}</span>
              </div>
            </van-col>
          </van-row>
      </div>
      <div>
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
              <header><span class="iconfont icon-wodezhangdan"></span><h1>当月订单数</h1></header>
              <span class="money">{{countData.monthRecordNumber}}</span>
            </div>
          </van-col>
          <van-col span="10" offset="2">
            <div class="card">
              <header><span class="iconfont icon-yly_qianzhuang monMoney"></span><h1>当月收入</h1></header>
              <span class="money">￥ {{countData.monthMoney}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
      <div @click="showData">
        <van-row>
          <van-col span="10" offset="1">
            <div class="card">
              <header><span class="iconfont icon-dingdan"></span><h1>当日订单数</h1></header>
              <span class="money">{{countData.todayRecordNumber}}</span>
            </div>
          </van-col>
          <van-col span="10" offset="2">
            <div class="card">
              <header><span class="iconfont icon-qian monMoney"></span><h1>当日收入</h1></header>
              <span class="money">￥ {{countData.todayMoney}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </main>
  </div>
</template>

<script>
import store from '@/stores/store'
import { getCurrentCount } from '@/utils/api'
import '@/style/style.css'
export default {
  onShow () {
    // 这里回调函数处于其他函数内部，this绑定的不是vue实例，所以需要在外部定义
    let that = this
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    getCurrentCount(store.state.adminId).then((res) => {
      wx.hideToast()
      if (res.flag) {
        // console.log(res.data)
        that.countData = res.data
      }
    })
  },
  data () {
    return {
      countData: {
        todayMoney: 0.0,
        monthMoney: 0.0,
        totalMoney: 0.0,
        todayRecordNumber: 0,
        monthRecordNumber: 0,
        totalRecordNumber: 0
      }
    }
  },
  methods: {
    showData () {
      console.log(this.$data)
    }
  },
  onPullDownRefresh () {
    getCurrentCount(store.state.adminId).then((res) => {
      wx.stopPullDownRefresh()
      if (res.flag) {
        this.countData = res.data
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
