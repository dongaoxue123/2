<template>
  <div class="data-page">
    <!--<div @click="test1">测试</div>-->
    <record  v-for="(incomeInfo, index) in dayIncomes" :key="index" :incomeInfo="incomeInfo" :index="index"></record>
    <div class="footer">支持查看最近一个月收款情况，<a>更多记录请使用电脑访问morningxy.com/admin</a></div>
  </div>
</template>
<script>
import record from '@/components/record'
import { getCollectionRecords } from '@/utils/api'
import store from '@/stores/store'
// import cashout from '@/components/cashout'
export default {
  data () {
    return {
      dayIncomes: []
    }
  },
  // computed: {
  //   incomeInfos: function () {
  //     return store.state.incomeInfos
  //   }
  // },
  onShow () {
    // 每次进入该页面都发送请求获取30天记录
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    getCollectionRecords(store.state.adminId).then((res) => {
      wx.hideToast()
      if (res.flag) {
        // console.log(res.data)
        let items = res.data
        // this.updateUniqueKey(items)
        this.dayIncomes = items
        // store.state.incomeInfos = items
      }
    })
  },
  components: {
    record
  },
  // onReachBottom: function () {
  //   console.log('bottom')
  // },
  methods: {
    // 更新每日数据的key：格式为 index_recordNumber
    // 当交易笔数增加时才重画组件(节约性能)，当有组件增加(新的一天)时，index改变，所有组件重画
    updateUniqueKey (items) {
      items.forEach((item, index) => {
        item.key = index + '_' + item.incomeDate + '_' + item.recordNumber
      })
    },
    test1 () {
      // 注意顺序，要先根更新key，再同步数据到data
      getCollectionRecords(store.state.adminId).then((res) => {
        if (res.flag) {
          // console.log(res.data)
          let items = res.data
          let newItem = {price: '55.55', recordNumber: 23, incomeDate: '2019-05-12 12:00:32'}
          // this.updateUniqueKey(items)
          items.unshift(newItem)
          this.dayIncomes = items
          // store.state.incomeInfos = items
        }
      })
      // let items = res.data
      // this.updateUniqueKey(items)
      // this.dayIncomes = newItem
      // let items = []
      // store.state.incomeInfos = newItem
    },
    test2 () {
      getCollectionRecords(store.state.adminId).then((res) => {
        if (res.flag) {
          // console.log(res.data)
          let items = res.data
          // this.updateUniqueKey(items)
          items[0] = {price: '66.55', recordNumber: 18, incomeDate: '2019-05-12 11:00:32'}
          this.dayIncomes = items
          // store.state.incomeInfos = items
        }
      })
    }
  },
  // 页面下拉刷新列表
  onPullDownRefresh () {
    getCollectionRecords(store.state.adminId).then((res) => {
      wx.stopPullDownRefresh()
      if (res.flag) {
        // console.log(res.data)
        // let items = res.data
        // this.updateUniqueKey(items)
        this.dayIncomes = res.data
        // store.state.incomeInfos = items
      }
    })
  }
}
</script>

<style>
page{
  background: #f8f8f8;
}
  .data-page {
    height: 100vh;
    padding: 20rpx;
    background: #f8f8f8;
  }
  .footer{
    width: 100%;
    color: #999;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    padding: 8px 0 25px 0;
  }
</style>
