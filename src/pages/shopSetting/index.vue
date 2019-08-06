<template>
  <div class="setting-page">
    <van-cell-group custom-class="shopName">
      <van-cell :title="shopName" size="large" is-link @click-icon="onClickIcon" custom-class="custom-class" :value="isActive" :style="color" center url="../userSetting/main"/>
    </van-cell-group>
    <van-cell-group>
        <van-cell title="账户余额" size="large" is-link :value="balance" @click-icon="onClickIcon" custom-class="custom-class" center url="../balanceCashOut/main"/>
       <div v-if="!isAdvert" class="custom_wrap">
         <van-cell title="价格设置" size="large" is-link @click-icon="onClickIcon" custom-class="custom-class" center url="../priceSetting/main"/>
         <span class="red_tag" v-if="isReadMsg"></span>
       </div>
      <!--<van-cell title="密码管理" size="large" is-link @click-icon="onClickIcon"/> -->
      <van-cell v-if="!isAdvert" title="打印机管理" size="large" is-link @click-icon="onClickIcon" custom-class="custom-class" center url="../setPrinter/main"/>
      <van-cell title="地理位置" icon="location-o" is-link size="large" @click="chooseLocation" custom-class="custom-class" center/>
    </van-cell-group>
  </div>
</template>
<script>
// 是否已经设置了地理位置
import { setLocation } from '@/utils/util'
import { getAdminInfo, updateLocation, checkIsActive } from '@/utils/api'
import store from '@/stores/store'
export default {
  data () {
    return {
      shopName: '',
      adminInfo: {},
      isActive: '在线'
    }
  },
  computed: {
    balance () {
      return store.state.account.balance + '元'
    },
    isActive () {
      if (this.isActive !== 0) {
        return (this.isActive = '')
      }
    },
    isReadMsg () {
      return store.state.isReadMsg === 1
    },
    isAdvert () {
      return store.state.isAdvert
    }
  },
  onShow () {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    getAdminInfo(store.state.adminId).then((res) => {
      // console.log(res.data)
      wx.hideToast()
      store.state.adminInfo = res.data
      // console.log(store.state.adminInfo)
      this.shopName = res.data.shopName
    })
    checkIsActive(store.state.adminId).then((res) => {
      // console.log(res.data)
      this.isActive = res.data === 0 ? '离线' : '在线'
    })
  },
  methods: {
    chooseLocation () {
      wx.showToast({ title: '加载中', icon: 'loading', duration: 3000, mask: true })
      setLocation().then(res => {
        // console.log(res)
        updateLocation(store.state.adminId, res.latitude, res.longitude).then((res) => {
          if (res.flag) {
            // console.log('123')
            setTimeout(function () {
              wx.showToast({ title: '设置成功', icon: 'success', duration: 2000 })
            }, 200)
          } else {
            setTimeout(function () {
              wx.showToast({ title: '设置失败', icon: 'none', duration: 2000 })
            }, 200)
          }
        })
      })
    }
  }
}
</script>

<style>
.setting-page{
  height:100vh;
  background: #f7f7f7;
}
  .signin-page {
    height:100%;
    background: rgba(69,90,100,.6)
  }
  .state{
    padding: 0 50rpx;
  }
  .shopName{
    margin-bottom: 15rpx;
  }
  .custom-class{
    height:150rpx;
    background: #fff;
  }
  .custom_wrap{
    position: relative;
  }
  .red_tag{
    display: inline-block;
    width:20rpx;
    height:20rpx;
    border-radius: 20rpx;
    background: red;
    right:60rpx;
    z-index:100;
    position: absolute;
    top:50%;
    right:10%;
    margin-top:-10rpx;

  }
</style>
