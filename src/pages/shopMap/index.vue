<template>
  <div>
    <div class="map">
    <map :longitude="longitude" :latitude="latitude" show-location :polyline="polyline" :markers="markers" style="width:100%;height:700px;" id="shopMap" @markertap="bindmarkertap" >
      <div v-if="showlocasion" class="mapwall">
        <div class="mapapi">
          <span class="nametext"><img class="pic" src="/static/images/yellow.jpg"><span>&nbsp;&nbsp;&nbsp;{{shopName}}</span></span>
          <span @click="mapPop"><van-icon style="color:green" name="map-marked" /></span>
        </div>
      </div>
    </map>
    </div>
  </div>
</template>
<script>
import store from '@/stores/store'
export default {
  data () {
    return {
      shopMap: 0,
      showlocasion: false,
      longitude: 116.29845,
      latitude: 39.95933,
      markers: [{
        iconPath: '/static/images/logo.png',
        id: 0,
        latitude: 39.963924,
        longitude: 116.309135,
        width: 30,
        height: 30,
        Index: 1000
      }],
      polyline: [{
        points: [{
          longitude: 116.29845,
          latitude: 39.95933
        }, {
          longitude: 116.309135,
          latitude: 39.963924
        }],
        strokeColor: 'green',
        fillColor: 'green',
        color: '#FF0000DD',
        width: 2,
        dottedLine: true
        // width: 2,
        // dottedLine: true
      }]
      // controls: [{
      //   iconPath: '/static/images/red.png',
      //   id: 1,
      //   clickable: false,
      //   position: {
      //     top: 0,
      //     left: 0,
      //     width: 55,
      //     height: 50
      //   }
      // }]
      // longitude: 39.95933,
      // latitude: 116.29845,
      // markers: []
    }
  },
  onLoad () {
    this.showlocasion = false
    console.log(store.state.shopInformation.latitude)
    this.latitude = store.state.shopInformation.latitude
    this.longitude = store.state.shopInformation.longitude
    this.polyline[0].points[0].longitude = store.state.shopInformation.longitude
    this.polyline[0].points[0].latitude = store.state.shopInformation.latitude
  },
  methods: {
    bindmarkertap () {
      console.log(123)
      this.showlocasion = true
    },
    mapPop () {
      wx.openLocation({
        latitude: 39.95933,
        longitude: 116.29845,
        name: store.state.shopInformation.shopName,
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        }
      })
      // wx.openLocation({
      //   latitude: 39.95933,
      //   longitude: 116.29845,
      //   scale: 18
      // })
    }
  },
  computed: {
    shopName () {
      return store.state.shopInformation.shopName
    }
  }
}
</script>
<style>
/* .ss{
  height: ;
} */
.map{
  height: 100%;
  width: 100%;
}
.mapwall{
  width: 100%;
  height: 120px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
}
.pic{
    width:50px;
    height:50px;
    /* margin-left: 20rpx; */
}
.mapapi{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
}
.nametext{
  /* line-height: 0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
