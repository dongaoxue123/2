<template>
  <div class="data-page">
    <!--<div @click="test">测试</div>-->
    <header>
      <time>{{incomeInfo.dateShow}}</time>
      <h1><span>￥</span> <span class="incomeNumber">{{incomeInfo.price}}</span></h1>
      <span>收款{{incomeInfo.recordNumber}}笔</span>
    </header>
    <main>
      <scroll-view>
        <income v-for="(item, index) in pageContents" :key="index" :index="index" :pageContent="item"></income>  
      </scroll-view>
      <div v-if="isFinished" @click="refreshList" class="show-if"><van-button v-if="clickShow" class="show-if" size="large" :loading="isRefreshing" loading-text="加载中...">加载更多</van-button></div>
      <div v-if="!isFinished" class="nothing">没有更多记录了~</div>
    </main>
  </div>
</template>
<script>
import store from '@/stores/store'
import { getDayRecords } from '@/utils/api'
import income from '@/components/income'
// let pageSize = 10
export default {
  onLoad () {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    this.incomeInfo = store.state.incomeInfo
    this.currentPage = 0
    getDayRecords(store.state.adminId, this.currentPage, 10, store.state.incomeInfo.incomeDate).then((res) => {
      if (res.flag) {
        wx.hideToast()
        this.pageContents = res.data.pageContents
        this.totalPage = res.data.totalPage
      }
    })
  },
  data () {
    return {
      pageContents: [],
      // 日期，当天的金额，收款笔数
      incomeInfo: {},
      totalPage: 1,
      currentPage: '',
      printHistoryIsRefreshing: false,
      isRefreshing: false,
      clickShow: true
    }
  },
  components: {
    income
  },
  methods: {
    test () {
      this.pageContents.unshift({'price': 22.6, 'createTime': '2019-03-22 04:47:18'})
      // console.log(this.pageContents)
      // this.updateUniqueKey()
    },
    // 生成唯一的key: index + '_' + recordId
    updateUniqueKey (items) {
      items.forEach((pageContent, index) => {
        pageContent.key = index + '_' + pageContent.recordId
      })
    },
    refreshList () {
      if (this.currentPage + 1 >= this.totalPage) return false
      // if (this.currentPage = 0) return false
      this.printHistoryIsRefreshing = true
      this.isRefreshing = false
      this.clickShow = true
      getDayRecords(store.state.adminId, ++this.currentPage, 10, store.state.incomeInfo.incomeDate).then((res) => {
        // console.log(this.currentPage)
        if (res.flag) {
          this.isRefreshing = false
          // console.log(this.isRefreshing)
          let pageContents = res.data.pageContents
          this.pageContents = this.pageContents.concat(pageContents)
        } else {
        }
      })
    }
  },
  computed: {
    isRefreshing: function () {
      return this.printHistoryIsRefreshing
    },
    isFinished: function () {
      // console.log(this.totalPage)
      return (this.currentPage + 1 < this.totalPage)
    }
  },
  // 页面下拉刷新列表
  onPullDownRefresh () {
    this.currentPage = 0
    getDayRecords(store.state.adminId, this.currentPage, 10, this.incomeInfo.incomeDate).then((res) => {
      wx.stopPullDownRefresh()
      if (res.flag) {
        // console.log(res.data.totalPage)
        this.pageContents = res.data.pageContents
        this.totalPage = res.data.totalPage
      }
    })
  }
}
</script>
<style>
  .data-page {
    height: 100%;
    padding: 20rpx;
    /* background: white; */
    background: #ffffff;
    z-index: 1;
  }
  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1rpx solid #ededed;
    z-index: 1;
  }
  header time {
    color: #333;
    font-size: 30rpx;
    padding: 10rpx 0 15rpx 0;
    z-index: 1;
  }
  header > span {
    font-size: 28rpx;
    color: #999;
    padding-bottom: 22rpx; 
    z-index: 1;
  }
  header .incomeNumber {
    font-size: 65rpx;
  }
  header h1 {
    display: flex;
    flex-direction: row;
    padding-bottom: 18rpx;
    z-index: 1;
  }
  header h1 span {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .show-if {
    color:#333;
    margin-top:10rpx;
    font-size:34rpx;
    
}
   .van-button--large {
    height:40px;
    line-height:40px;
    z-index: 2;
    margin-top: -6px;
}
.nothing{
  text-align: center;
  color: #999;
  font-size: 28rpx;
  margin-top: 28rpx;
}

</style>