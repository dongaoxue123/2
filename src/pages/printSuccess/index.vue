<template>
  <div class="page">
    <div class="card">
    <div class="iconfont icon-dayinji1"></div>
    <span>打印成功! <br><br><br/><span class="nextline">请到以下打印机取走您的文件</span></span>
    <div v-if="getBlack" class="onlyone"><span v-if="bothHave">黑白:</span>&nbsp;{{bwcolor}}</div>
    <div v-if="getColor" class="onlyone" style="color:red"><span v-if="bothHave">彩色:</span>&nbsp;{{color}}</div>
    <!-- <div v-if="!getboth" class="onlyone">彩色：{{color}}</div> -->
    <!-- <button @click="tofile">返回首页</button> -->
    </div>
    <button @click="tofile">返回首页</button>
    <official-account style="margin-bottom:0px;"></official-account>
  </div>
</template>
<script>
import store from '@/stores/store'
export default {
  data () {
    return {
      getBlack: false,
      getBoth: false,
      getColor: false,
      bothHave: false,
      bwcolor: '',
      color: ''
    }
  },
  onUnload () {
    wx.switchTab({url: '/pages/file/main'})
  },
  onLoad () {
    console.log('打印成功页')
    this.getColor = false
    this.getBoth = false
    this.getBlack = false
    this.bwcolor = store.state.bwPrinter
    this.color = store.state.colorPrinter
    // this.bothHave = false
    // console.log(store.state.adminInfo.blackWhitePrinters)
    console.log(store.state.adminInfo.blackWhitePrinters)
    // console.log(this.bwcolor)
    // console.log(store.state.bothColor)
    store.state.bothColor.forEach(item => {
      console.log(item)
      if (item === 0) {
        this.getBlack = true
      } else {
        this.getColor = true
      }
    })
    if (this.getBlack && this.getColor) {
      this.bothHave = true
    }
    console.log(this.getBlack)
    store.state.bothColor = []
  },
  methods: {
    tofile () {
      wx.switchTab({url: '/pages/file/main'})
    }
    // bwcolor () {
    //   console.log(store.state.adminInfo.blackWhitePrinters)
    //   return store.state.adminInfo.blackWhitePrinters
    // }
  }
}
</script>
<style>
div{
  text-align: center;
  margin-top: 10px;
}
.page{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card{
  width: 300px;
  height: 240px;
  /* border: 1px solid #999; */
  box-shadow: 0px 0px 5px 1px rgb(210,203,198);
  margin: 0 auto;
  margin-top:80rpx;
}
official-account{
  position:absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
button{
  background: #fff;
  font-size: 18px;
  color: cornflowerblue;
  width: 300px;
  margin-top: 20px;
}
.color{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left:58rpx;
  padding-right:60rpx;
  font-size:18px;
  font-weight: 600;
}
.onlyone{
  text-align: center;
  font-size:18px;
  font-weight: 600;
  line-height:14px;
}
.nextline{
  margin-top:5px;
  line-height:40px;
 
}
.icon-dayinji1{font-size: 90px;color: cornflowerblue}
</style>
