<template>
  <section class="page-print-history">
    <ul class="print-history-list">
      <li class="print-history-item" v-for="item in records" :key="item.orderNo">
        <van-panel use-header-slot use-footer-slot>
          <view class="print-item-header" slot="header">
            <view class="print-item-header-order-number pull-left">订单号: <text selectable="true">{{item.orderNo}}</text></view>
            <view @click="copyOrderNumber(String(item.orderNo))"><button size="mini" class="print-item-header-button">复制</button></view>
          </view>
          <view class="print-item-content" v-for="(file, i) in item.orderContent" :key="i">
            <view class="print-history-file-name-price">
              <view class="print-history-file-name">{{file.fileName}}</view>
              <view class="print-history-file-price">¥{{file.price}}</view>
            </view>
            <view class="print-history-file-other-item">
              <view class="print-history-file-item">{{colorTxt[file.color]}}</view>
              <view class="print-history-file-item">{{duplexModeTxt[file.duplexMode]}}</view>
              <view class="print-history-file-item">{{file.startPage}} - {{file.startPage + file.count - 1}}</view>
              <view class="print-history-file-item">{{file.copies}}份</view>
              <view class="print-history-file-item">{{scalingTxt[file.scaling]}}</view>
              <view class="print-history-file-item">{{paperSize[file.paperSize]}}</view>
              <view class="print-history-file-item" v-if="file.paperSize === undefined">A4</view>
            </view>
          </view>
          <view class="print-item-footer" slot="footer">
            <view class="print-item-footer-time pull-right">时间: {{item.createTime}}</view>
          </view>
        </van-panel>
      </li>
      <li v-if="isFinished" class="print-history-refresh"><van-button size="large" :loading="isRefreshing" @click="refreshList">加载更多</van-button></li>
    </ul>
  </section>
</template>

<script>
import { getRecords, getClipboardData } from '@/utils/api'
import store from '@/stores/store'
export default {
  components: {
  },
  onShow () {
    getRecords(0).then(res => {
      store.state.records = res.data
      console.log('打印记录', store.state.records)
    })
  },
  data () {
    return {
      colorTxt: ['黑白', '彩印'],
      duplexModeTxt: ['单面', '双面'],
      scalingTxt: ['一合一', '二合一', '四合一', '六合一'],
      orientationTxt: ['纵向', '横向'],
      currentPage: 0,
      paperSize: ['A4', 'A3', 'B5']
    }
  },
  methods: {
    copyOrderNumber (number) {
      console.log('成功')
      getClipboardData(number)
    },
    clearRecords (records) {
      if (!records) return {}
      records.forEach(record => {
        if (typeof record.orderContent === 'object') return false
        record.orderContent = JSON.parse(record.orderContent)
      })
      return records
    },
    refreshList () {
      if (this.currentPage + 1 >= store.state.records.totalPage || store.state.printHistoryIsRefreshing) return false
      store.state.printHistoryIsRefreshing = true
      getRecords(++this.currentPage).then(res => {
        // console.log(res.data)
        let { pageContents, currentPage } = res.data
        if (res.flag) {
          pageContents = store.state.records.pageContents.concat(pageContents)
          store.state.records = { ...store.state.records, pageContents, currentPage }
        }

        store.state.printHistoryIsRefreshing = false
      })
    },
    onClickLeft () {
      wx.switchTab({
        url: '/pages/personal/main'
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

<style scoped>
.page-print-history {
    height: 100%;
    background-color: #ededed;
    padding-top: 30rpx;
}
.print-history-list {
  background-color: #ededed;
}
.print-history-item {
  margin: 0 30rpx 30rpx;
  border-radius: 32rpx;
}
/* .page-print-loading {

} */
.print-item-header {
  font-size: 30rpx;
  color: #999;
  padding: 15px 20px;
  border-bottom: 2rpx solid rgba(199,197,199,0.8);
  font-size: 32rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.print-item-header-button {
  padding: 0;
  margin: 0;
  color: red;
  font-size: 32rpx;
  height: 53rpx;
  line-height: 53rpx;
  width: 110rpx;
}
.print-item-footer {
  margin: 0;
  font-size: 32rpx;
}
.print-item-footer-time {
  color: #999;
}
.print-item-content {
  padding: 15px 20px;
  border-bottom: 1rpx solid rgba(199,197,199,0.8);
}
.print-history-file-name {
  width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 30rpx;
}
.print-history-file-name-price {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 32rpx;
  color: black;
}
.print-history-file-other-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 26rpx;
  color: #999;
}
</style>
