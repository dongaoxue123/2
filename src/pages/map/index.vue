<template>
  <div>
  <map id="myMap" :longitude="longitude" :latitude="latitude" show-location  :markers="markers" scale="16" :controls="controls" @markertap="bindmarkertap" @controltap="bindcontroltap" @tap="tap">
    <cover-view class="play" @tap="clickUploadLocalFile">
      <cover-image class="img" src="/static/images/pic.png" />
    </cover-view>
    <cover-view class="allClass" :animation="animationData" @click="lookShop">
      <cover-image class="pic" src="/static/images/yellow.jpg"></cover-image>
      <cover-view class="mainInformation">
        <cover-view style="color:#333;font-size:38rpx;">{{shopName}}</cover-view>
        <cover-view style="margin-top:20rpx" :class="isActived === '离线' ? 'gray' : ''">{{isActived}}</cover-view>
      </cover-view>
      <cover-image class="icon" src="/static/images/icon.png"></cover-image>
      <!-- <button @click="lookShop">查看商家</button> -->
    </cover-view>
  </map>
  </div>
</template>
<script>
import { setLocation } from '@/utils/util'
import store from '@/stores/store'
// import { getNearByAdmin } from '@/utils/api'
import { scanQRCode } from '@/utils/index'
var systemInfo = wx.getSystemInfoSync()
export default {
  methods: {
    tap () {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'linear',
        delay: 0
      })
      animation.translateY(180 / 750 * systemInfo.windowWidth).step()
      this.animationData = animation.export()
    },
    bindmarkertap (e) {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'linear',
        delay: 0
      })
      animation.translateY(-180 / 750 * systemInfo.windowWidth).step()
      this.animationData = animation.export()
      this.markers.forEach((element, index) => {
        // console.log(element)
        if (element.id === e.mp.markerId) {
          this.shopName = element.callout.content
          this.isActived = this.isActive[index] ? '在线' : '离线'
          console.log(e.mp.markerId)
          store.commit('setShopInformation', {shopName: this.shopName, distance: this.distance[index], isActive: this.isActived, adminId: this.adminId[index], longitude: element.longitude, latitude: element.latitude})
        }
      })
    },
    bindcontroltap () {
      this.mapCtx = wx.createMapContext('myMap')
      this.mapCtx.moveToLocation()
    },
    lookShop () {
      wx.navigateTo({url: '/pages/shopInformation/main'})
    },
    clickUploadLocalFile () {
      scanQRCode()
    }
  },
  // 页面转发处理逻辑
  onShareAppMessage () {
    console.log('转发')
  },
  onShow () {
    var that = this
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success (res) {
              setLocation().then(res => {
                that.markers = res.markers
                that.longitude = res.longitude
                that.latitude = res.latitude
                that.isActive = res.isActive
                that.distance = res.distance
                that.adminId = res.adminId
              })
            },
            fail () {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success (res) {
                        setLocation().then(res => {
                          that.markers = res.markers
                          that.longitude = res.longitude
                          that.latitude = res.latitude
                          that.isActive = res.isActive
                          that.distance = res.distance
                          that.adminId = res.adminId
                        })
                      }
                    })
                  }
                },
                fail () {
                  console.log('fail')
                }
              })
            }
          })
        } else {
          setLocation().then(res => {
            console.log(res)
            that.markers = res.markers
            that.longitude = res.longitude
            that.latitude = res.latitude
            console.log(that.latitude)
            that.isActive = res.isActive
            that.distance = res.distance
            that.adminId = res.adminId
          })
        }
      // console.log(res.authSetting['scope.userLocation'])
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.controls[1].position.top = (res.windowHeight - 20) / 2
        that.controls[0].position.top = res.windowHeight - 65
        that.controls[1].position.left = (res.windowWidth - 20) / 2
      }
    })
  },
  data () {
    return {
      markers: [],
      controls: [{
        iconPath: '/static/images/black.png',
        id: 0,
        clickable: true,
        position: {
          top: 0,
          left: 10,
          width: 60,
          height: 60
        }
      },
      {
        iconPath: '/static/images/red.png',
        id: 1,
        clickable: false,
        position: {
          top: 0,
          left: 0,
          width: 55,
          height: 50
        }
      }],
      longitude: 0,
      latitude: 0,
      isClass: true,
      animationData: null,
      shopName: '',
      isActive: [],
      isActived: '',
      distance: [],
      adminId: []
    }
  }
}
</script>
<style>
  map{
    width:100%;
    height:100vh;
  }
  div{
    display: block;
    z-index: 100;
  }
  .play{
     height: 160rpx;
     width: 380rpx;
     position: absolute;
     bottom:0;
     left:0;
     right:0;
     margin:0 auto;
  }
.allClass{
    border-radius: 10px;
    width:700rpx;
    height:160rpx;
    background: #fff;
    transition: 0.3s;
    position: absolute;
    bottom:-160rpx;
    left:0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 25rpx ;
  }
  .allClass button{
    padding:0 15rpx;
    margin:0;
    font-size: 28rpx;
    color:#999;
    margin-right:20rpx;
  }
  .pic{
    width:50px;
    height:50px;
    margin-left: 20rpx;
  }
  .icon{
    width:45px;
    height:40px;
    margin-right:20rpx;
  }
  .mainInformation{
    color: #3cb035;
    flex:1;
    padding-left:40rpx;
    font-size:25rpx;
  }
  .gray{
    color:#888;
  }
</style>