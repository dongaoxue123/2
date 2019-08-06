<script>
import { login } from '@/utils/api'
import store from '@/stores/store'

export default {
  created () {
    const adminId = mpvue.getStorageSync('adminId')
    if (adminId) {
      console.log('自动登陆, id: ' + adminId)
      store.state.adminId = adminId
    } else {
      // 如果缓存中没有，则调用登陆方法
      login().then(function (res) {
        if (res.flag) {
          // 登陆成功
          let adminId = res.data.adminId
          // 存储admin信息到全局变量
          // store.state.adminType = res.data.adminType
          store.commit('saveDataAfter', res.data.adminType)
          store.commit('saveDataAfterLogin', {adminId: adminId, shopName: res.data.shopName, everyNewAward: res.data.everyNewAward, account: res.data.account, todayCount: res.data.todayCount})
          // 存储adminId到缓存
          mpvue.setStorageSync('adminId', adminId)
          console.log('登陆成功 adminId: ' + adminId)
        } else {
          // 登陆失败，说明不是商家，跳转到注册页面
          wx.switchTab({url: '/pages/signin/main'})
        }
      })
    }
  },
  onLaunch () {
    wx.hideTabBar({
      // 隐藏tabbar
      fail: function () {
        // 做了个延时重试，作为保底
        setTimeout(function () {
          wx.hideTabBar()
        }, 500)
      }
    })
  }
}
</script>
<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
