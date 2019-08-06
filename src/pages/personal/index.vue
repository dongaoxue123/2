<template>
  <div>
    <div class="userinfo">
      <div class="userinfo-avatar" v-if="showButton">
        <image src="/static/images/morentouxiang.png" mode="aspectFit"></image>
      </div>
      <div class="userinfo-avatar" v-if="showName">
        <open-data type="userAvatarUrl" class="opendata"></open-data>
      </div>
      <div class="user-nickName">
        <open-data type="userNickName" v-if="showName"></open-data>
      </div>
      <div class="user-auth">
        <button class="btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-if="showButton">一键登录</button>
      </div>
    </div>
    <van-cell-group class="other-feature">
      
      <van-cell icon="records" title="打印记录" class="print-history" is-link size="large" url="/pages/printHistory/main" />
      <van-cell icon="friends-o" title="联系我们" class="about-me" is-link size="large" @click="getContact" />
      <!-- <van-cell icon="coupon-o" title="我的卡劵" class="about-me" is-link size="large" @click="getCoupon" /> -->
      <van-dialog id="van-dialog" />
      <!-- <van-cell is-link size="large" class="btn"><button open-type="contact">京致客服</button></van-cell> -->
    </van-cell-group>
    <div class="can"><button class="contact" open-type="contact"><van-icon color="#000" size="20px" name="service" /><span class="online">&nbsp;&nbsp;在线客服</span></button><van-icon size="16px" color="#999" name="arrow"/></div>
  </div>
</template>
<script>
  import store from '@/stores/store'
  import { doAuth, getClipboardData } from '@/utils/api'
  import Dialog from '../../../static/vant-weapp/dialog/dialog'
  export default {
    computed: {
      showName: function () {
        return store.state.authored
      },
      showButton: function () {
        return !store.state.authored
      }
    },
    onLoad () {
      // 第一次进入该页面，从缓存中读取是否已经授权过
      store.state.authored = (mpvue.getStorageSync('authored') === 1)
    },
    methods: {
      getContact () {
        Dialog.alert({
          title: '京致客服',
          message: `联系方式：17600999967
          微信手机同步`,
          confirmButtonText: '复制联系方式',
          showCancelButton: true,
          cancelButtonText: '知道了',
          closeOnClickOverlay: true
        }).then(() => { getClipboardData('17600999967') }).catch((e) => { console.log(e) })
      },
      getCoupon () {
        wx.navigateTo({url: '../coupon/main'})
        // console.log('点击')
      },
      bindGetUserInfo (e) {
        if (e.target.userInfo) {
          // 用户点击确认, 成功授权
          // 打开加载框
          wx.showLoading({title: '授权中', mask: true})
          // 获取code
          wx.login({
            success (res) {
              if (res.code) {
                let requestData = {
                  userId: store.state.userId,
                  code: res.code,
                  encryptedData: e.target.encryptedData,
                  iv: e.target.iv
                }
                // 调用后台授权接口
                doAuth(requestData, function (res) {
                  // 关闭加载框
                  wx.hideLoading()
                  if (res.flag) {
                    // 授权成功的操作
                    console.log('授权成功')
                    // 标记已经授权，只要该缓存不过期，用户无须再次授权
                    mpvue.setStorageSync('authored', 1)
                    // 更新到store中
                    store.state.authored = true
                  } else {
                    // 授权失败的操作
                    console.log('授权失败')
                    wx.showToast({ title: '授权失败, 请重试', icon: 'none', duration: 2000 })
                  }
                })
              } else {
                wx.hideLoading()
                console.log('获取code失败')
              }
            }
          })
        } else {
          // 用户点击取消
          console.log('拒绝授权')
        }
      }
    },
    // 页面转发处理逻辑
    onShareAppMessage () {
      console.log('转发')
    }
  }
</script>

<style>
.userinfo {
  position: relative;
  width: 750rpx;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
 
.userinfo-avatar {
  overflow:hidden;
  display: block;
  width: 160rpx;
  height: 160rpx;
  margin: 20rpx;
  margin-top: 50rpx;
  margin-bottom: 35rpx;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.opendata {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}
.userinfo text {
  /* color: #fff; */
  font-size: 14px;
  background-color: #c0c0c0;
  border-radius:40%;
}

.user-auth {
  width: 100%;
}
.btn {
  margin: 0 40rpx;
  height: 84rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  background-color: #3cb035;
  border: 1px solid #3cb035;
  color: white; 
}
.other-feature {
  display: block;
  margin-top: 20rpx;
}
.contact{
  background: #fff;
  border: 1px solid #fff;
  width: 300px;
  border-radius: 50%;
  margin-left:-218rpx;
  margin-top: -4px;
}
.can{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid #eee
}
.online{
  font-size: 14px;
  color: #333;
}
.other-feature .van-icon-records,
.other-feature .van-icon-coupon-o,
.other-feature .van-icon-friends-o {
  font-size: 40rpx;
  color: #000;
}
.icon-youhuijuan{font-size: 20px;}
</style>