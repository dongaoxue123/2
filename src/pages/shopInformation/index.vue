<template>
  <div>
    <div class="logo">
      <img src="/static/images/jingzhi.jpg" alt="">
    </div>
    <div class="allInformation">
      <div class="mainInformation">
        <span>{{shopName}}</span>
        <span style="margin-top:20rpx;font-size:28rpx;" :class="isActive === '离线' ? 'gray' : 'green'">{{isActive}}</span>
      </div>
      <div class="total">
        <img src="/static/images/yellow.jpg" alt="">
      </div>
    </div>
    <div class="allInformation">
      <div class="adressShop">
        <span class="adress">{{location}}</span>
        <span style="display:flex;color:rgb(38,108,220);" @click="toMapShop">
          <van-icon size="20px" name="map-marked"/>
          <span style="width:100rpx;">{{distance}}</span>
        </span>
      </div>
    </div>
    <div class="allInformation">
      <div class="serve">
        <span>营业时间: 8:00 - 22:00</span>
      </div>
    </div>
    <!-- <map style="width:100%;margin-top:10rpx;" id="mapShop" ></map> -->
    <!-- <div class="allInformation">
      <div class="serve">
        <span>打印范围:</span>
      </div>
    </div> -->
    <button @click="clickUploadLocalFile">扫码打印</button>
  </div>
</template>
<script>
import { scanQRCode } from '@/utils/index'
import store from '@/stores/store'
import { getAdminDetailedInfo } from '@/utils/api'
export default {
  onLoad () {
    var that = this
    getAdminDetailedInfo(that.adminId).then(res => {
      if (res.flag) {
        console.log(res.data)
        that.location = res.data.location
        that.openTime = res.data.openTime
      }
    })
  },
  data () {
    return {
      name: '',
      location: '',
      openTime: '',
      // longitude: 23.099994,
      // latitude: 113.324520,
      id: 0,
      markers: []
    }
  },
  methods: {
    clickUploadLocalFile () {
      scanQRCode()
    },
    toMapShop () {
      // wx.navigateTo({url: '/pages/shopMap/main'})
      wx.openLocation({
        latitude: store.state.shopInformation.latitude,
        longitude: store.state.shopInformation.longitude,
        name: store.state.shopInformation.shopName,
        address: store.state.shopInformation.distance,
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  computed: {
    shopName () {
      return store.state.shopInformation.shopName
    },
    isActive () {
      return store.state.shopInformation.isActive
    },
    distance () {
      return store.state.shopInformation.distance
    },
    adminId () {
      return store.state.shopInformation.adminId
    }
  }
}
</script>
<style>
.logo{
  width:100%;
  height:300rpx;
}
.logo img{
  width:100%;
  height:100%;
}
  .allInformation{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:30rpx;
    border-bottom: 1px solid #ddd;
    font-size: 38rpx;
    color:#000;
    
  }
  .mainInformation{
    display: flex;
    flex-direction: column;
  }
  .total{
    width:100rpx;
    height:100rpx;
  }
  .total img{
    width:100rpx;
    height:100rpx;
  }
  .adressShop{
    display:flex;
    justify-content: space-between;
    align-items: center;
    color:#888;
    font-size: 32rpx
  }
  .adress{
    padding-right:20rpx;
    flex:1;
    overflow:hidden;
    text-overflow: ellipsis;
    margin-right: 10rpx;
    border-right:1px solid #ddd;
    width:530rpx;
    max-height:85rpx;
  }
  .serve{
    font-size: 32rpx;
    color:#333;
  }
  button{
    position: absolute;
    bottom:50rpx;
    border-radius: 50rpx;
    width:620rpx;
    left:0;
    right:0;
    margin: 0 auto;
    background: rgb(4,158,244);
    color:#fff;
  }
  .gray {
    color:#888;
  }
  .green {
    color:#3cb035;
  }
</style>