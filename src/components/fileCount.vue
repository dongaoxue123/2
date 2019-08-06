<template>
<section class="file-count-wrapper">
  <van-row>
    <van-col span="6"><slot></slot></van-col>
    <van-col span="5">
      <span class="file-count-down file-count-icon" @click="decrement">-</span>
    </van-col>
    <van-col span="5">
      <input class="ile-count" type="number" v-model="pageCount" @blur="PageNumberBlur">
    </van-col>
    <van-col span="5">
      <span class="file-count-up file-count-icon" @click="increment">+</span>
    </van-col>
  </van-row>
</section>
</template>

<script>
import { formatNum } from '@/utils/index'
export default {
  props: [ 'getCount', 'minCount', 'count' ],
  data () {
    this.formatCount()
    return {
      minCount: 1,
      pageCount: 1
    }
  },
  mounted () {
    this.pageCount = this.count
  },
  methods: {
    PageNumberBlur () {
      if (this.pageCount > 0) {
        typeof this.getCount === 'function' && this.getCount(formatNum(this.pageCount))
      } else {
        this.pageCount = this.count
      }
    },
    formatCount () {
      this.count = Number(this.count) || 1
    },
    decrement () {
      if (this.pageCount > this.minCount) this.pageCount--
      typeof this.getCount === 'function' && this.getCount(formatNum(this.pageCount))
    },
    increment () {
      this.pageCount++
      typeof this.getCount === 'function' && this.getCount(formatNum(this.pageCount))
    }
  }
}
</script>

<style>
.file-count-wrapper {
  font-size: 14px;
  height: 50rpx;
  line-height: 50rpx;
  margin: 20rpx 0;
  font-size: 30rpx;
}
.file-count-icon {
  display: inline-block;
  width: 39rpx;
  height: 39rpx;
  line-height: 39rpx;
  text-align: center;
  border: 1rpx solid #ccc;
  border-radius: 50%;
}
input{
  width:50rpx;
  border:2rpx solid #ccc;
  border-radius:8rpx;
  min-height:0rpx;
  display:flex;
  height:39rpx;
  line-height:39rpx;
  text-align:center;
  align-items:center;

}
.file-count-down {
  margin-right: 20rpx;
}
.file-count-up {
  margin-left: 20rpx;
}
</style>
