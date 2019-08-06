<template>
  <div class="cashout">
    <form report-submit="true" @submit="formSubmit">
      <header>
          <div class="header-left">到账账户</div>
          <div class="header-right">
            <div class="header-right-bank-name">
              <!--<van-icon name="question-o" :custom-style="iconStyle"></van-icon>-->
              <span class="bank-name">{{withdrawBankName}}</span>
            </div>
            <span class="header-right-toast">当日剩余次数: {{cashOutTime}}</span>
          </div>
      </header>
      <main>
      <div class="main_header">
        <span>提现金额</span>
        <span class="record" @click="withdrawalsRecords">提现记录</span>
      </div>
        <div class="withdraw-input">
          <span>￥</span>
          <!--<input type="number" focus>-->
          <input type="digit" v-model="inputValue">
        </div>
        <span class="surplus-change">可提现￥{{surplusChange}}, <span class="withdraw-all-action" @click="withDrawAll">全部提现</span></span>
        <button form-type="submit">提现</button>
      </main>
    </form>
  </div>
</template>
<script>
import store from '@/stores/store'
import { isPriceIllegal } from '@/utils/util'
import { cashOut } from '@/utils/api'
export default {
  // props: ['surplusChange'],
  onShow () {
    // 防止页面返回 组件未销毁，金额仍记忆
    this.inputValue = 0
    this.surplusChange = store.state.account.balance
    this.cashOutTime = store.state.account.cashOutTime
  },
  data () {
    return {
      withdrawBankName: '微信零钱',
      inputValue: 0,
      iconStyle: `display: flex;justify-content: center;align-items: center;`,
      surplusChange: store.state.account.balance,
      cashOutTime: store.state.account.cashOutTime
    }
  },
  methods: {
    withdrawalsRecords () {
      wx.navigateTo({'url': '/pages/withdrawalsRecord/main'})
    },
    withDrawAll () {
      this.inputValue = this.surplusChange
    },
    formSubmit (e) {
      if (this.inputValue === null || this.inputValue === '' || this.inputValue <= 0) {
        wx.showToast({ title: '请输入正确的金额!', icon: 'none', duration: 3000 })
        return
      } else if (isPriceIllegal(this.inputValue)) {
        wx.showToast({ title: '金额位数不能超过两位小数!', icon: 'none', duration: 3000 })
        return
      } else if (this.inputValue > this.surplusChange) {
        wx.showToast({ title: '余额不足, 请重新输入！', icon: 'none', duration: 3000 })
        return
      } else if (this.inputValue < 0.3) {
        wx.showToast({ title: '提现金额不能少于0.3元', icon: 'none', duration: 3000 })
        return
      } else if (this.inputValue > 5000) {
        wx.showToast({ title: '提现金额不能多于5000元', icon: 'none', duration: 3000 })
        return
      }
      // 发起提现请求
      // console.log(e.mp.detail)
      wx.showToast({ title: '提现中', icon: 'loading', duration: 10000, mask: true })
      cashOut(store.state.adminId, Number(this.inputValue), e.mp.detail.formId).then((res) => {
        if (res.flag) {
          wx.showToast({ title: '提现成功', icon: 'success', duration: 2000, mask: true })
          setTimeout(function () {
            // wx.navigateBack()
            wx.switchTab({url: '/pages/account/main'})
          }, 1500)
        } else {
          wx.showToast({ title: `提现失败: ${res.message}`, icon: 'none', duration: 2000 })
          // console.log(res.message)
        }
      })
    }
  }
}
</script>

<style>
.cashout {
  background: white;
  margin: 20rpx;
  font-size: 30rpx;
  color: black;
}
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20rpx 50rpx;
  background: #FBFBFB;
}
.header-right-bank-name {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding-bottom: 20rpx;
  padding-left:70rpx;
}
.bank-name {
  padding-left: 10rpx;
}
.bank-tail-number {
  padding-right: 6rpx;
}
main {
  padding: 20rpx 50rpx 40rpx;
}
main .main_header {
  padding-bottom: 40rpx;
}
.record{
  float: right;
  color: #5FB0E4;
}
.header-right-toast {
  color: #999;
  font-size: 26rpx;
  display: flex;
  justify-content: center;
}
.withdraw-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1rpx solid #999;
  font-size: 60rpx;
}
.withdraw-input span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.withdraw-input input{
  font-size: 100rpx;
  height: 120rpx;
}
.surplus-change {
  display: block;
  padding: 18rpx 0 50rpx;
}
.withdraw-all-action {
  color: #5FB0E4;
}
button {
  background: #06C05F;
  height: 110rpx;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
}
button.isWithdraw {
  background: #06C05F;
}
</style>
