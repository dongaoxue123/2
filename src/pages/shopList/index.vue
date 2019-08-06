<template>
  <div class="item_wrap">
    <div class="list_page" v-for="(item, index) in shopList" :key="index">
      <div class="list_item" @click="toOrder(item)">
        <div class="shop_logo">
          <img src="../../../static/images/yellow.jpg" alt=""/>
        </div>
        <div class="shop_item">
          <span class="item_margin" style="font-weight:600">{{item.shop_name}}</span>
          <span class="icon_wrap">
            <van-icon name="location-o" size="15px"/>
            <span style="font-size:25rpx;color:#777;-webkit-line-clamp:2;margin-left:5rpx;" class="item_margin">{{item.location}}</span>
          </span>
          <span class="icon_wrap">
            <van-icon name="clock-o" size="14px"/>
            <span style="font-size:25rpx;color:#777;margin-left:5rpx;" class="item_margin">营业时间 10:00 - 22:00</span>
          </span>
        </div>
        <div class="shop_distance">
          <!-- <span class="distance_margin" style="text-align:right">{{item.distance > 9999 ? Math.round(item.distance / 1000) / 10 + 'km' : item.distance + 'm'}}</span> -->
          <span class="distance_margin" style="text-align:right">{{item.distance}}</span>
          <span style="text-align:center;color:rgb(38,108,220);height:50rpx;width:80rpx;line-height:50rpx" @click.stop="toDetails(item)">详情</span>
          <!-- <span style="text-align:right">立即下单</span> -->
        </div>
      </div>
      <!-- <div class="do">
        <span style="color:rgb(38,108,220)">查看详情</span>
        <span style="">立即下单</span>
      </div> -->
    </div>
  </div>
</template>
<script>
import { noLink } from '@/utils/index'
import { getNearByAdmin } from '@/utils/api'
import store from '@/stores/store'
export default {
  onLoad (options) {
    this.shop = false
    if (options.shop === 'shop') {
      this.shop = true
    }
    this.longitude = store.state.location.longitude
    this.latitude = store.state.location.latitude
    getNearByAdmin(this.latitude, this.longitude).then(res => {
      if (res.flag) {
        this.shopList = res.data
        this.shopList.forEach(element => {
          if (element.distance > 9999) {
            element.distance = `${Math.round(element.distance / 1000) / 10}km`
          } else {
            element.distance = `${element.distance}m`
          }
        })
      }
    })
  },
  data () {
    return {
      latitude: 0,
      longitude: 0,
      shopList: [],
      shop: false
    }
  },
  computed: {
    adminId: function () {
      return store.state.nearShop.adminId
    }
  },
  methods: {
    toOrder (nearShop) {
      store.commit('setNearShop', {shopName: nearShop.shop_name, shopDistance: nearShop.distance, adminId: nearShop.admin_id})
      store.commit('setAdminId', this.adminId)
      if (this.shop) {
        noLink(1, this.adminId)
      } else {
        wx.navigateBack({ delta: 1 })
      }
    },
    toDetails (nearShop) {
      store.commit('setShopInformation', {shopName: nearShop.shop_name, distance: nearShop.distance, isActive: '在线', adminId: nearShop.admin_id})
      wx.navigateTo({url: '../shopInformation/main'})
    }
  }
}
</script>
<style>
.list_page{
  background:#fafafa;
  padding:15rpx;
  font-size: 30rpx;
  color:#333;
}
.list_item{
  display: flex;
  /* align-items: center; */
  justify-content: space-between;
  background:#fff;
  border-radius: 15rpx;
  padding:20rpx 30rpx;
}
.shop_logo{
  align-items: center;
  display: flex;
}
.shop_logo img{
  width:100rpx;
  height:100rpx;
}
.shop_item{
  display: flex;
  flex-direction: column;
  flex:1;
  padding: 0 20rpx;
  margin-left: 20rpx;
}
.shop_distance{
  width:150rpx;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  /* height:100%; */
  /* justify-content: space-between; */
  /* align-items: center; */
  align-items: flex-end;
  font-size: 25rpx;
}
.icon_wrap{
  display: flex;
  justify-content: space-between;
}
.item_margin{
  margin-bottom:15rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;
  flex:1;
}
.distance_margin{
  margin-bottom: 50rpx;
  font-weight:600;
}
.do{
  display: flex;
  justify-content: space-between;
  border-top:1rpx solid #eee;
  padding:10rpx 100rpx;
}
</style>
