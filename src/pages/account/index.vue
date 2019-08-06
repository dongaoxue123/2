<template>
  <div class="account-page">
    <!-- <van-notice-bar
      left-icon="../../../static/image/tz.png"
      text="更新公告: 增加A3及B5纸张选择, 可前往 '店铺设置' -> '价格设置' 中添加纸张价格。"
      speed="40"
      v-if="isReadMsg"
    /> -->
    <header>
      <nav @click="checkToSetting">
        <h1 class="merchant-name">{{shopName}}</h1>
        <van-icon name="arrow" :custom-style="iconStyle"></van-icon>
      </nav>
      <div class="my-income">
        <span @click="checkToRecords">今日收入 {{todayCount.todayIncomeCount}} 笔 , 合计</span>
        <span class="my-income-number" @click="checkToRecords">¥ {{todayCount.todayMoney}}</span>
        <div style="margin-top: 25rpx;" class="income_bottom">
          <div style="border-right:1rpx solid #61c25b">
            <span>账户余额</span>
            <span>{{account.balance}} 元</span>
          </div>
          <div @click="checkToAward">
            <span>{{awardName}}</span>
            <span>{{awardData}} 元</span>
          </div>
        </div>
      </div>
    </header>
    <main>
      <section>
        <van-row>
          <van-col v-if="!isAdvert" span="8" @click="checkToRecords" custom-class="custom-class">
            <span class="iconfont icon-jiludanzilishijilu" info="9"></span>
            <text :class="isHover ? 'hover-card-class' : ''">收款记录</text>
          </van-col>
          <van-col span="8"  @click="checkToCashOut" custom-class="custom-class">
            <span class="iconfont icon-tixian1"></span>
            <text :class="isHover ? 'hover-card-class' : ''">余额提现</text>
          </van-col>
          <van-col v-if="!isAdvert" span="8" @click="checkToAward" custom-class="custom-class">
            <span class="iconfont icon-shouyi"></span>
            <text :class="isHover ? 'hover-card-class' : ''">活动奖励</text>
          </van-col>
        <!-- </van-row>
   
        <van-row> -->
          <van-col v-if="!isAdvert" span="8" @click="checkToStatistics" custom-class="custom-class">
            <span class="iconfont icon-tongji1"></span>
            <text :class="isHover ? 'hover-card-class' : ''">数据统计</text>
          </van-col>
          <van-col span="8" @click="checkToSetting" custom-class="custom-class">
            <span class="red_tag" v-if="isReadMsg"></span>
            <span class="iconfont icon-shezhi"></span>
            <text :class="isHover ? 'hover-card-class' : ''">店铺设置</text>
          </van-col>
          <!-- <van-col v-if="!isAdvert" span="8" @click="checkToFarList" custom-class="custom-class">
            <span class="red_tag" v-if="isReadMsg"></span>
            <span class="iconfont icon-jiludanzilishijilu"></span>
            <text :class="isHover ? 'hover-card-class' : ''">远程接单</text>
          </van-col> -->
        </van-row>
      </section>
    </main>
    <div class="hide" v-if="false">

    </div>
  </div>
</template>

<script>
import store from '@/stores/store'
import { getAccount, getNewUserAward, getUnreadMsg } from '@/utils/api'
import '@/style/style.css'
export default {
  data () {
    return {
      isHover: false,
      text: 1,
      awardData: '0',
      iconStyle: `display: flex;justify-content: center;align-items: center;padding-top: 6rpx;font-size: 40rpx;`
    }
  },
  onLoad () {
    wx.hideTabBar()
    let adminId = store.state.adminId
    getUnreadMsg(adminId).then(function (res) {
      if (res.flag) {
        store.commit('setReadMsg', res.data)
        console.log(store.state.isReadMsg)
      }
    })
  },
  onShow () {
    let adminId = store.state.adminId
    if (adminId > 0) {
      getAccount(adminId).then(res => {
        if (res.flag) {
          // 保存账户信息
          // console.log(adminId)
          store.commit('saveDataAfter', res.data.adminType)
          store.commit('saveDataAfterLogin', {adminId: adminId, shopName: res.data.shopName, everyNewAward: res.data.everyNewAward, account: res.data.account, todayCount: res.data.todayCount})
        } else {
          // 登陆失败
          console.log('登录失败')
          wx.switchTab({url: '/pages/signin/main'})
        }
      })
      getNewUserAward(adminId).then((res) => {
        // wx.hideToast()
        if (res.flag) {
          // console.log(res.data)
          this.awardData = res.data.totalNewUserAward
        }
      })
    } else {
      let that = this
      setTimeout(function () {
        getNewUserAward(store.state.adminId).then((res) => {
          // wx.hideToast()
          if (res.flag) {
            // console.log(res.data)
            that.awardData = res.data.totalNewUserAward
          }
        })
      }, 1000)
    }
  },
  computed: {
    shopName () {
      return store.state.shopName
    },
    account () {
      return store.state.account
    },
    todayCount () {
      return store.state.todayCount
    },
    isReadMsg () {
      return store.state.isReadMsg === 1
    },
    isAdvert () {
      return store.state.isAdvert
    },
    awardName () {
      return store.state.isAdvert ? '广告收益' : '累计奖励'
    }
  },
  methods: {
    checkToRecords () {
      // 切换到收款记录页面
      if (!store.state.isAdvert) {
        wx.navigateTo({'url': '/pages/records/main'})
      }
    },
    checkToFarList () {
      wx.navigateTo({'url': '/pages/farList/main'})
    },
    checkToStatistics () {
      wx.navigateTo({'url': '/pages/statistics/main'})
    },
    checkToAward () {
      if (!store.state.isAdvert) {
        wx.navigateTo({'url': '/pages/award/main'})
      }
    },
    checkToSetting () {
      wx.navigateTo({'url': '/pages/shopSetting/main'})
    },
    checkToCashOut () {
      wx.navigateTo({'url': '/pages/balanceCashOut/main'})
    }
  },
  // 页面下拉刷新文件列表
  onPullDownRefresh () {
    // wx.showToast({ title: '加载中', icon: 'loading', duration: 2000 })
    // wx.showNavigationBarLoading()
    // console.log('下拉')
    let adminId = store.state.adminId
    getAccount(adminId).then(function (res) {
      wx.stopPullDownRefresh()
      // wx.hideToast()
      if (res.flag) {
        // 保存账户信息
        // console.log(adminId)
        store.commit('saveDataAfterLogin', {adminId: adminId, adminType: res.data.adminType, shopName: res.data.shopName, everyNewAward: res.data.everyNewAward, account: res.data.account, todayCount: res.data.todayCount})
      }
    })
    getNewUserAward(adminId).then((res) => {
      // wx.hideToast()
      if (res.flag) {
        // console.log(res.data)
        this.awardData = res.data.totalNewUserAward
      }
    })
  }
}
</script>

<style>
.iconfont{
  font-size:50rpx;
  color: #44AD3F;
}
.account-page {
  background: #f7f7f7;
  width: 100%;
  height: 100vh;
  font-family:Arial, Helvetica, sans-serif;
}
section{
  background: #fff;
}
section span{
  display: flex;
  align-items: center;
  justify-content: center;
}
  header {
    background: #44AD3F;
    color: white;
    height:50vh;
  }
  header nav {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10rpx 0;
  }
  header .my-income {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 32rpx;
    padding: 50rpx 0;
  }
  .my-income span {
    padding: 20rpx;
  }
  .my-income-number {
    font-size: 90rpx;
    /* margin-top: 20rpx; */
  }
  header .merchant-name {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40rpx;
    font-weight: 400;
  }
  main{
    background: #fff;
    margin-top: 20rpx;
  }
  main section {
     border-bottom:1rpx solid #f7f7ff;
  }
  main section h1 {
    font-size: 38rpx;
    padding: 20rpx 0;
    margin-bottom: 20rpx;
  }
  section text {
    display: flex;
    height: 100rpx;
    justify-content: center;
    align-items: center;
     font-size: 30rpx;
  }
  .hover-card-class {
    color: green;
    opacity: 0.9;
  }
 main section .custom-class{
    border-right: 1rpx solid #f7f7f7;
    padding: 40rpx 0;
    position: relative;
  }
  .income_bottom{
    display:flex;
    justify-content: space-between;
  }
  .income_bottom div {
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:0 70rpx;
  }
  .red_tag{
    width:20rpx;
    height:20rpx;
    border-radius: 20rpx;
    background: red;
    position: absolute;
    right:60rpx;
  }
  .hide{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height: 100%;
    background:rgba(0,0,0,.7);
    /* z-index:100; */
  }
</style>
