<template>
  <div class="setting-page">
    <van-cell-group>
      <van-field input-align="right" size="large" clearable label="店铺名称" placeholder="请输入店铺名称" @change="setShopName" @click-icon="onClickIcon"/>
    </van-cell-group>
    <div v-if="!isAdvert">
      <div class="paper"><span>A4 (元/张)</span></div>
      <van-cell-group>
        <van-field value="0.15" input-align="right" size="large" label="黑白单面" @change="setBlackWhiteSinglePrice"/>
        <van-field value="0.2" input-align="right" size="large" label="黑白双面" @change="setBlackWhiteDuplexPrice"/>
        <van-field value="1" input-align="right" size="large" label="彩色单面" v-if="color" @change="setColorSinglePrice"/>
        <van-field value="2" input-align="right" size="large" label="彩色双面" v-if="color" @change="setColorDuplexPrice"/>
      </van-cell-group>
    </div>
     <!-- <div v-if="paperAthree">
        <div class="paper"><span>A3 (元/张)</span><van-icon @click="deleA" color="#aaa" name="clear" /></div>
    <van-cell-group>
      <van-field :value="0.0" input-align="right"  size="large" label="黑白单面" @change="setA3BlackWhiteSinglePrice"/>
      <van-field :value="0.0" input-align="right"   size="large" label="黑白双面" @change="setA3BlackWhiteDuplexPrice"/>
      <van-field :value="0.0" input-align="right"  size="large" label="彩色单面" v-if="color" @change="setA3ColorSinglePrice"/>
      <van-field :value="0.0" input-align="right"  size="large" label="彩色双面" v-if="color" @change="setA3ColorDuplexPrice"/>
    </van-cell-group>
     </div>
     <div v-if="paperBfive">
        <div class="paper"><span>B5 (元/张)</span><van-icon @click="deleB" color="#aaa" name="clear" /></div>
    <van-cell-group>
      <van-field :value="0.0" input-align="right"  size="large" label="黑白单面" @change="setB5BlackWhiteSinglePrice"/>
      <van-field :value="0.0" input-align="right"   size="large" label="黑白双面" @change="setB5BlackWhiteDuplexPrice"/>
      <van-field :value="0.0" input-align="right"   size="large" label="彩色单面" v-if="color" @change="setB5ColorSinglePrice"/>
      <van-field :value="0.0" input-align="right"  size="large" label="彩色双面" v-if="color" @change="setB5ColorDuplexPrice"/>
    </van-cell-group>
     </div> -->
    <van-cell-group v-if="!isAdvert">
      <van-switch-cell title="开启彩印" :checked="color" size="24px;" @change="checkIsColor"/>
    </van-cell-group>
    <van-cell title="地理位置" icon="location-o" is-link size="large" @click="chooseLocation"/>
    <van-button type="primary" size="large" @click="submitSetting">提交</van-button>
  </div>
</template>

<script>
// 是否已经设置了地理位置
import { setLocation, isPriceIllegal } from '@/utils/util'
import { firstSetting, advertAdminFirstSetting } from '@/utils/api'
import store from '@/stores/store'
let hasSetted = false
let setting = {
  blackWhiteSinglePrice: 0.15,
  blackWhiteDuplexPrice: 0.2,
  colorSinglePrice: 1,
  colorDuplexPrice: 2,
  shopName: '',
  isColor: 1,
  latitude: 0.0,
  longitude: 0.0
}
export default {
  data () {
    return {
      color: true,
      paperAthree: true,
      paperBfive: true,
      isAdvert: true
    }
  },
  onShow () {
    this.isAdvert = store.state.isAdvert
  },
  methods: {
    chooseLocation () {
      wx.showToast({ title: '加载中', icon: 'loading', duration: 3000, mask: true })
      setLocation().then(res => {
        // console.log(res)
        hasSetted = true
        setting.latitude = res.latitude
        setting.longitude = res.longitude
        // settingType.latitude = res.latitude
        // settingType.longitude = res.longitude
        wx.showToast({ title: '设置成功', icon: 'success', duration: 1000, mask: true })
      })
    },
    submitSetting () {
      let res = /^.{1,15}$/
      console.log(setting.shopName)
      if (!res.test(setting.shopName) || setting.shopName === '') {
        wx.showToast({ title: '请输入店铺名称，长度不超过15个字', icon: 'none', duration: 3000, mask: true })
        return
      } else if (!hasSetted) {
        // 判断是否选择了位置
        wx.showToast({ title: '请选择您的店铺位置', icon: 'none', duration: 2000, mask: true })
        return
      }
      if (store.state.isAdvert) {
        let advertSetting = {'adminId': store.state.adminId, 'shopName': setting.shopName, 'latitude': setting.latitude, 'longitude': setting.longitude}
        wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
        advertAdminFirstSetting(advertSetting).then(res => {
          wx.hideToast()
          if (res.flag) {
            // 跳转到账户首页
            wx.switchTab({url: '/pages/account/main'})
          } else {
            wx.showToast({ title: '设置失败，请重新尝试', icon: 'none', duration: 2000 })
          }
        })
      } else {
        if (isPriceIllegal(setting.blackWhiteSinglePrice) || isPriceIllegal(setting.blackWhiteDuplexPrice) || isPriceIllegal(setting.colorSinglePrice) || isPriceIllegal(setting.colorDuplexPrice)) {
          wx.showToast({ title: '请输入单价，两位小数以内', icon: 'none', duration: 3000, mask: true })
        } else {
          setting.adminId = store.state.adminId
          wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
          firstSetting(setting).then(res => {
            wx.hideToast()
            if (res.flag) {
              // 跳转到账户首页
              wx.switchTab({url: '/pages/account/main'})
            } else {
              wx.showToast({ title: '设置失败，请重新尝试', icon: 'none', duration: 2000 })
            }
          })
        }
      }
    },
    setShopName (event) {
      setting.shopName = event.mp.detail
    },
    setBlackWhiteSinglePrice (event) {
      setting.blackWhiteSinglePrice = event.mp.detail
    },
    setBlackWhiteDuplexPrice (event) {
      setting.blackWhiteDuplexPrice = event.mp.detail
    },
    setColorSinglePrice (event) {
      setting.colorSinglePrice = event.mp.detail
    },
    setColorDuplexPrice (event) {
      setting.colorDuplexPrice = event.mp.detail
    },
    checkIsColor (event) {
      // 需要手动对 checked 状态进行更新
      setting.isColor = event.mp.detail ? 1 : 0
      this.color = event.mp.detail
    }
  }
}
</script>

<style>
  .signin-page {
    background: rgba(69,90,100,.6)
  }
    .paper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #000;
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding: 10px;
  }
</style>
