<template>
  <section class="page-wrapper">
    <div class="nearDistance" v-if="isDisplay" @click="lookShop">
      <div class="shopName" v-show="isShow">
        <span>{{shopName}}</span>
        <span style="color:#999;font-size:30rpx;">距您 {{shopDistance}}</span>
      </div>
      <div class="shopName" v-show="!isShow">
        <span style="color:#999;font-size:38rpx;margin:10px 0">授权后显示最近店铺</span>
      </div>
      <button @click.stop="toMap" v-show="isShow">查看更多</button>
      <button @click="toPosition" v-show="!isShow">授权定位</button>
    </div>
    <main>
      <!-- 重复代码 -->
      <!-- <div class="filelist-empty-toast" v-if="active">
        <div class="upload-from-wechat" @click="clickUploadWxFile">
          <span class="iconfont icon-weixin2"></span>
          <span class="icon-text">上传微信文件</span>
        </div>
        <div class="go-upload" @click="goToUpload">
          <span class="iconfont icon-bendishangchuan2"></span>
          <span class="icon-text">文件上传</span>
        </div>   
      </div> -->
      <scroll-view class="file-list"  scroll-y>
        <file v-for="(file, index) in fileList" :key="index" :file="file" :config="{isPrintStatus: false}"></file>
        <!-- <file v-for="file in fileList" :key="file.fileId" :file="file" :config="{isPrintStatus: false}"></file> -->
      </scroll-view>
    </main>
    <footer class="upload-file">
      <!-- 重复代码 -->
      <!-- 上传本地文件 -->
      <div class="upload-from-null"  @click="goDown">
        <span class="iconfont icon-bendishangchuan"></span>
        <span>远程下单</span>
      <!-- <span class="icon-saoma">扫码打印</span> -->
      </div>
      <div class="scan-print" @click="scanCode">
        <van-icon name="scan" size="30px" color="#fff"></van-icon>
        <span class="icon-saoma">&nbsp;扫码打印</span>
      </div>
      <div class="go-upload" @click="goToUpload">
        <span class="iconfont icon-bendishangchuan"></span>
        <span>文件上传</span>
      </div>
    </footer>
  </section>
</template>
<script>
// import { uploadWxFile } from '@/utils/upload'
import file from '@/components/file'
import { getFiles } from '@/utils/login'
import store from '@/stores/store'
import { scanQRCode, selfHelp } from '@/utils/index'
// import { scanQRCode } from '@/utils/index'
import { getRecentAdmin } from '@/utils/api'
// import Dialog from '../../../static/vant-weapp/dialog/dialog'

export default {
  components: {
    file
  },
  onShow () {
    // 设置标志为文件页
    store.commit('setPrintStatus', false)
    var that = this
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success (res) {
              wx.getLocation({
                type: 'gcj02',
                success (res) {
                  that.longitude = res.longitude
                  that.latitude = res.latitude
                  getRecentAdmin(that.latitude, that.longitude).then(res => {
                    // console.log(res)
                    if (res.flag) {
                      if (res.data.shop_name) {
                        that.adminId = res.data.admin_id
                        that.shopName = res.data.shop_name
                        that.shopDistance = res.data.distance > 9999 ? `${Math.round(res.data.distance / 1000) / 10}km` : `${res.data.distance}m`
                        that.isDisplay = true
                        that.isActive = res.data.isActive ? '在线' : '离线'
                        store.commit('setShopInformation', {shopName: that.shopName, distance: that.shopDistance, isActive: that.isActive, adminId: that.adminId})
                      } else {
                        console.log('附近没有店铺')
                        that.isDisplay = false
                      }
                    } else {
                      console.log('获取店铺失败')
                      that.isDisplay = false
                    }
                  })
                }
              })
            },
            fail () {
              that.isShow = false
            }
          })
        } else {
          wx.getLocation({
            type: 'gcj02',
            success (res) {
              // console.log(res)
              that.longitude = res.longitude
              that.latitude = res.latitude
              getRecentAdmin(that.latitude, that.longitude).then(res => {
                if (res.flag) {
                  if (res.data.shop_name) {
                    that.adminId = res.data.admin_id
                    that.shopName = res.data.shop_name
                    that.shopDistance = res.data.distance > 9999 ? `${Math.round(res.data.distance / 1000) / 10}km` : `${res.data.distance}m`
                    that.isShow = true
                    that.isDisplay = true
                    that.isActive = res.data.isActive ? '在线' : '离线'
                    store.commit('setShopInformation', {shopName: that.shopName, distance: that.shopDistance, isActive: that.isActive, adminId: that.adminId})
                  } else {
                    wx.showToast({ title: '附近没有店铺', icon: 'none', duration: 2000 })
                    that.isDisplay = false
                  }
                } else {
                  wx.showToast({ title: '授权失败，请重试！', icon: 'none', duration: 2000 })
                  that.isDisplay = false
                }
              })
            }
          })
        }
      },
      fail () {
      }
    })
  },
  // mounted: function () {
  //   let that = this
  //   setTimeout(function () {
  //     if (!that.fileList || that.fileList.length === 0) {
  //       wx.switchTab({url: '/pages/fileUpload/main'})
  //     }
  //   }, 1000)
  // },
  data () {
    return {
      adminId: 0,
      longitude: 0,
      latitude: 0,
      shopName: '',
      shopDistance: 0,
      isShow: true,
      isDisplay: true,
      isActive: ''
    }
  },
  computed: {
    fileList: function () {
      return store.state.files
    }
    // active: function () {
    //   return (this.fileList && this.fileList.length === 0)
    // }
  },
  methods: {
    goDown () {
      if (!this.isShow) {
        wx.showToast({ title: '请先定位您的位置', icon: 'none', duration: 2000 })
      } else {
        // 存储最近商家信息
        store.commit('setNearShop', {shopName: this.shopName, shopDistance: this.shopDistance, adminId: this.adminId})
        // 存储用户位置
        store.commit('setLocation', {longitude: this.longitude, latitude: this.latitude})
        store.commit('setAdminId', this.adminId)
        selfHelp(1, this.adminId)
        // wx.navigateTo({url: '../shopList/main?shop=shop'})
      }
    },
    lookShop () {
      if (this.isShow) {
        wx.navigateTo({url: '/pages/shopInformation/main'})
      }
    },
    toMap () {
      wx.switchTab({url: '/pages/map/main'})
    },
    toPosition () {
      let that = this
      wx.showModal({
        title: '是否授权当前位置',
        content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
        success (res) {
          if (res.confirm) {
            wx.openSetting({
              success (res) {
                wx.getLocation({
                  type: 'gcj02',
                  success (res) {
                    that.longitude = res.longitude
                    that.latitude = res.latitude
                    getRecentAdmin(that.latitude, that.longitude).then(res => {
                      if (res.flag) {
                        if (res.data.shop_name) {
                          that.adminId = res.data.admin_id
                          that.shopName = res.data.shop_name
                          that.shopDistance = res.data.distance > 9999 ? `${Math.round(res.data.distance / 1000) / 10}km` : `${res.data.distance}m`
                          that.isShow = true
                          store.commit('setShopInformation', {shopName: that.shopName, distance: that.shopDistance, isActive: '在线', adminId: that.adminId})
                        } else {
                          wx.showToast({ title: '附近没有店铺', icon: 'none', duration: 2000 })
                          that.isDisplay = false
                        }
                      } else {
                        console.log('附近没有店铺')
                        that.isDisplay = false
                      }
                    })
                  }
                })
              }
            })
          }
        },
        fail () {
          console.log('fail')
        }
      })
    },
    scanCode () {
      scanQRCode()
    },
    goToUpload () {
      wx.switchTab({url: '/pages/fileUpload/main'})
    }
  },
  // 页面下拉刷新文件列表
  onPullDownRefresh () {
    wx.showToast({ title: '文件加载中', icon: 'loading', duration: 20000 })
    // wx.showNavigationBarLoading()
    // console.log('下拉')
    getFiles(function () {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
      wx.hideToast()
    })
  },
  // 页面转发处理逻辑
  onShareAppMessage () {
    console.log('转发')
  }
}
</script>

<style scoped>
.icon-saoma{
  display: block;
  float: left;
}
.page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
main {
  width: 100%;
  height: 100%;
  flex-basis: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
footer {
   width:100%;
  position: relative;
  bottom:0;
  background: #fff;
  height: 170rpx;
}
.file-list {
  width: 100%;
  height: 100%;
}
.file-wrapper {
  display: inline-block;
}
.upload-file {
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  justify-items: center;
  padding-top: 30rpx;
}
.scan-print .icon-saoma{
  font-size: 34rpx; 
  line-height: 0px;
  margin-bottom:10rpx;

}
.scan-print {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center; 
  /* padding: 0 30rpx; */
  /* width: 40px;
  height: 30px; */
  z-index: 100;
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  /* background: rgb(68,167,223); */
  border-radius: 25px 25px 25px 25px;
  height: 45px;
  width: 150px;
  /* margin-left: 65rpx; */
  padding-top: 10rpx;
  background: linear-gradient(to left, rgb(38,108,220) , rgb(4,158,244));
  box-shadow: 10px 10px 10px #eee;
}
.upload-from-null{
  height: 50px;
  width: 50px;
  background: #fff;
  font-size:24rpx;
  padding: 0 30rpx;
  margin-top: -10rpx;
  text-align: center;
}
.local-hidden{
  visibility: hidden;
}
.upload-from-wechat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
  
}
span {
  font-size: 24rpx;
}
main .filelist-empty-toast {
  font-size: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  flex-direction: column;
  height: 100%;
}
main .filelist-empty-toast .go-upload {
  border: 4rpx solid #07C160;
  margin-bottom: 140rpx;
  width: 260rpx;
  height: 260rpx;
  border-radius: 4px;
  box-shadow: inset 0px 0px 18px -4px rgba(7,193,96,1);
  font-size: 50rpx;
  z-index: 101;
}
main .filelist-empty-toast .upload-from-wechat:hover {
  border: 4rpx solid #07C160;
}
main .filelist-empty-toast .upload-from-local {
  /* border: 4rpx solid #07C160;
  width: 260rpx;
  height: 260rpx;
  border-radius: 4px;
  box-shadow: inset 0px 0px 18px -4px rgba(7,193,96,1); */
  font-size: 12px;
}
.go-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
  margin-top:-25rpx;
}
main .filelist-empty-toast .icon-text{
  font-size: 34rpx;
}
main saoma{
/* font-size: 10px; */
margin-left: 5rpx;

}
main .filelist-empty-toast .icon-bendishangchuan2 {
  font-size: 90rpx;
  color:#799fff;
}
main .filelist-empty-toast .icon-wenjianshangchuan_zhengse {
  font-size: 90rpx;
  color: #3cb035;
}
.nearDistance{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:20rpx 20rpx 20rpx 50rpx;
  border-bottom: 1rpx solid rgb(241, 241, 241); 
  background:#f9f9f9;
}
.nearDistance button{
  width:150rpx;
  height:70rpx;
  margin: 0;
  font-size: 30rpx;
  padding:0;
  line-height: 70rpx;
  color:rgb(38,108,220);
  background: #fefefe;
}
.nearDistance .shopName span{
  display: flex;
  font-size: 38rpx;
  color:#333;
  padding:10rpx 0;
}
/* 引入icon样式 */
.iconfont {font-size: 80rpx;}
.icon-bendishangchuan {color:#799fff;z-index: 101;}
/* .icon-weixin {color: #3cb035;} */
.icon-wenjianshangchuan_zhengse{color: #3cb035;font-size: 30px;}
</style>
