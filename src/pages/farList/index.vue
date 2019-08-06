<template>
  <div class="page">
    <van-tabs color="rgb(57,145,53)" :active="active" @change="onChange">
      <van-tab title="待打印">
        <div class="setting">
          <!-- <button @click="toSetting" class="settext">设置</button> -->
          <van-icon v-if="checkedFarPrint" @click="toSetting" class="seticon" name="setting" />
        <van-switch-cell
          title="开启远程打印"
          :checked="isFarList"
          @change="onChangeSwitch"
          active-color="rgb(57,145,53)"
          class="cellclass"
        />
        </div>
        <div class="list" v-for="(index, item) in remoteOrders" :key="item">
          <div class="order">
            <div>订单号 : {{index.orderNo}}
            </div>
            <div class="print"><span class="priceprint">￥{{index.price}}</span>
            <button @click="toPrint(index.orderNo)" style="background:rgb(57,145,53);color:#eee" class="butt">打印
            </button>
            </div>
          </div>
          <div v-for="(file, i) in index.orderContent" :key="i">
          <div class="name">
            <div class="listname">{{file.fileName}}
            </div>
            <div>￥{{file.price}}
            </div>
          </div>
          <div class="information">
            <span>{{file.color === 1 ? '彩色' : '黑白'}}</span>
            <span>{{file.copies === 0 ? '单面' : '双面' }}</span>
            <span>{{file.startPage}} - {{file.startPage + file.count - 1}}</span>
            <span>{{file.count}}份</span>
            <span>{{scalingTxt[file.scaling]}}</span>
            <span>{{paperSize[file.paperSize]}}</span>
          </div>
          </div>
          <div class="time"><van-icon name="clock" />{{index.createTime}}     
          </div>
        </div>
      </van-tab>
      <van-tab title="已打印">
        <div>
          <div class="list" v-for="(index, item) in records" :key="item">
            <div class="order">
              <div>订单号 : {{index.orderNo}}
              </div>
              <div class="print"><span class="priceprint">￥{{index.price}}</span>
              </div>
            </div>
            <div v-for="(file, i) in index.orderContent" :key="i">
            <div class="name">
              <div class="listname">{{file.fileName}}
              </div>
              <div>￥{{file.price}}
              </div>
            </div>
            <div class="information">
              <span>{{file.color === 1 ? '彩色' : '黑白'}}</span>
              <span>{{file.copies === 0 ? '单面' : '双面' }}</span>
              <span>{{file.startPage}} - {{file.startPage + file.count - 1}}</span>
              <span>{{file.count}}份</span>
              <span>{{scalingTxt[file.scaling]}}</span>
              <span>{{paperSize[file.paperSize]}}</span>
            </div>
            </div>
            <div class="time"><van-icon name="clock" />{{index.createTime}}
            </div>
          </div>
        </div>
        <div v-if="isFinished"><van-button size="large" :loading="isRefreshing" @click="refreshList">加载更多</van-button></div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getRemoteOrders, getPrint, setOpenRemote, getAdminComlateRemoteOrder, getRemoteStatus } from '@/utils/api'
import store from '@/stores/store'
export default {
  data () {
    return {
      active: 0,
      isFarList: true,
      orderNo: 0,
      remoteOrders: [],
      price: 0,
      checkedFarPrint: true,
      // isFinished: false,
      currentPage: 0,
      createTime: '',
      orderContent: [],
      pageContents: [],
      scalingTxt: ['一合一', '二合一', '四合一', '六合一'],
      paperSize: ['A4', 'A3', 'B5']
    }
  },
  onLoad () {
    getRemoteOrders(store.state.adminId).then((res) => {
      if (res.flag) {
        this.remoteOrders = res.data
        this.remoteOrders.forEach(item => {
          item.orderContent = JSON.parse(item.orderContent)
        })
      }
    })
    getAdminComlateRemoteOrder(store.state.adminId, 0, 10).then((res) => {
      store.state.records = res.data
      // if (res.flag) {
      //   this.pageContents = res.data.pageContents
      //   this.pageContents.forEach(item => {
      //     item.orderContent = JSON.parse(item.orderContent)
      //   })
      // }
    })
    getRemoteStatus(store.state.adminId).then((res) => {
      if (res.flag) {
        if (res.data === 1) {
          this.isFarList = true
          this.checkedFarPrint = true
        } else {
          this.isFarList = false
          this.checkedFarPrint = false
        }
      }
    })
  },
  methods: {
    refreshList () {
      if (this.currentPage + 1 >= store.state.records.totalPage || store.state.printHistoryIsRefreshing) return false
      // console.log(store.state.records.totalPage)
      store.state.printHistoryIsRefreshing = true
      getAdminComlateRemoteOrder(store.state.adminId, ++this.currentPage, 10).then(res => {
        // console.log(res.data)
        let { pageContents, currentPage } = res.data
        if (res.flag) {
          // console.log(store.state.records.pageContents)
          pageContents = store.state.records.pageContents.concat(pageContents)
          // console.log(111)
          store.state.records = { ...store.state.records, pageContents, currentPage }
          // console.log(store.state.records)
        }
        store.state.printHistoryIsRefreshing = false
      })
    },
    clearRecords (records) {
      if (!records) return {}
      records.forEach(record => {
        if (typeof record.orderContent === 'object') return false
        record.orderContent = JSON.parse(record.orderContent)
      })
      return records
    },
    toSetting () {
      console.log(123)
      wx.navigateTo({url: '/pages/farListSetting/main'})
    },
    onChange (event) {
    },
    setFarList (openRemote) {
      setOpenRemote(store.state.adminId, openRemote).then((res) => {
        if (res.flag) {
          console.log(res)
        }
      })
    },
    onChangeSwitch (event) {
    // 需要手动对 checked 状态进行更新
      this.isFarList = event.mp.detail
      this.isFarList === true ? this.checkedFarPrint = true : this.checkedFarPrint = false
      let that = this
      if (that.isFarList === true) {
        wx.showModal({
          title: '提示',
          content: '确认开启远程打印？',
          success (res) {
            if (res.confirm) {
              that.setFarList(1)
            } else if (res.cancel) {
              console.log('用户点击取消')
              that.isFarList = false
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '确认取消远程打印？',
          success (res) {
            if (res.confirm) {
              that.setFarList(0)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    toPrint (orderNo) {
      getPrint(orderNo).then((res) => {
        // wx.hideToast()
        if (res.flag) {
          // console.log(res.data)
        }
      })
    }
  },
  computed: {
    records: function () {
      return this.clearRecords(store.state.records.pageContents)
    },
    isRefreshing: function () {
      return store.state.printHistoryIsRefreshing
    },
    isFinished: function () {
      return (store.state.records.currentPage + 1 < store.state.records.totalPage)
    }
  }
}
</script>
<style>
.page{
  background: #eee;
  padding: 32rpx;
 } 
.list{
  background: #fff;
  width: 690rpx;
  /* height: 320rpx; */
  font-size: 14px;
  border-radius: 5px;
  margin-top: 14px;
}
.order{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.butt{
  width:100rpx;
  height:50rpx;
  font-size:12px;
  padding:0;
  line-height: 50rpx;
  margin-right:6px;
}
.name{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  font-size: 16px;
  font-weight:500;
  color: #000;
}
.information{
  padding: 16px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  border-bottom: 1px solid #eee
}
.time{
  padding: 10px 10px;
  margin-bottom: 5px;
  color: #999;
}
.listname{
  width: 200px;
  text-overflow:ellipsis;
   white-space: nowrap;
  overflow:hidden;
}
.print{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.priceprint{
  font-size: 16px;
  font-weight: 500;
  color: #000;
  margin-right: 20rpx;
}
.cellclass{
  width: 90%;
}
.setting{
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  background: #fff;
  margin-top: 8px;
}
.settext{
  font-size: 14px;
  height: 25px;
  line-height: 25px;
  color: #333;
  margin: 10rpx;
}
.seticon{
  color: #333;
  margin-left: 14rpx;
}
page{
background: #eee;
}
</style>

