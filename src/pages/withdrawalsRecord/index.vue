<template>
<div>
  <div class="card" v-for="(item,index) in pageContents" :key="index">
    <span class="time">{{item.createTime}}</span>
    <main>
        <div class="left">
          <span style="margin-bottom:30rpx">提现前 ￥{{(item.balance * 100 + item.amount * 100) / 100}}</span>
          <span>提现后 ￥{{item.balance}}</span>
        </div>
        <div class="right">
          <span style="margin-bottom:30rpx"> -{{item.amount}}</span>
          <span :class="item.status === 0 ? 'red' : 'green'">{{item.status === 0? '提现中':'已完成'}}</span>
        </div>
    </main>
  </div>
  <van-button v-if="isShow" size="large" :loading="isLoading" loading-text="加载中..." @click="loadingMore">加载更多</van-button>
  <div v-if="!isShow" style="text-align:center; color:#999; font-size:32rpx; padding:20rpx;">没有更多记录了~</div>
</div>
</template>
<script>
import store from '@/stores/store'
import { getTxLogs } from '@/utils/api'
let adminId
export default {
  onShow () {
    adminId = store.state.adminId
    this.currentPage = 0
    this.isShow = true
    getTxLogs(adminId, this.currentPage, this.pageSize).then((res) => {
      this.pageContents = res.data.pageContents
      if (this.currentPage + 1 >= res.data.totalPage) {
        this.isShow = false
      }
    })
  },
  data () {
    return {
      pageContents: [],
      currentPage: 0,
      pageSize: 30,
      isLoading: false,
      isShow: false
    }
  },
  methods: {
    loadingMore () {
      this.isLoading = !this.isLoading
      getTxLogs(adminId, ++this.currentPage, this.pageSize).then((res) => {
        let pageContents = res.data.pageContents
        this.pageContents = this.pageContents.concat(pageContents)
        if (res.flag) {
          if (this.currentPage + 1 >= res.data.totalPage) {
            this.isShow = false
          }
          this.isLoading = !this.isLoading
        }
      })
    }
  }
}
</script>
<style>
.card {
  padding: 10rpx 15rpx 10rpx 15rpx;
  background: #f8f8f8;
}
.card main {
    display: flex;
    justify-content: space-between;
    background: white;
    padding: 30rpx 33rpx 35rpx 33rpx;
    border-radius: 10rpx;
}
.card .time {
    font-size: 35rpx;
    color: #999;
    margin-bottom: 13rpx;
    padding-left: 20rpx;
    overflow: hidden;
    width: 180rpx;
    height: 40rpx;
}
.left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

}
.left h1 {
    font-size: 50rpx;
    font-family: inherit;
}
span {
    font-size: 33rpx;
    color: #666;
    margin-top: 12rpx;
}
.right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.record-num {
  padding-left: 8rpx;
}
.right .red{
    color:red;
}
.right .green{
    color:#18a316;
}
</style>
