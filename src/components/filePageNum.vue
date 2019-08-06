<template>
<section class="file-page-num">
  <van-row>
    <van-col span="6"><slot></slot></van-col>
    <van-col span="4">
      <input class="file-page-num-input" type="number" v-model="startNum" @blur="startPageBlur">
    </van-col>
    <van-col span="6">&nbsp;&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;&nbsp;</van-col>
    <van-col span="4">
      <input class="file-page-num-input" type="number" v-model="endNum" @blur="endPageBlur">
    </van-col>
  </van-row>
</section>
</template>

<script>
import { formatNum } from '@/utils/index'

export default {
  props: ['getPageNum', 'totalPage', 'count', 'startPage'],
  data () {
    // console.log('传入的页码：' + this.maxNum)
    // FIXME: 使用 proptype 容错
    return {
      startNum: 1,
      maxNum: 1,
      pageCount: 1,
      endNum: 1
    }
  },
  mounted () {
    // console.log('filepage组件')
    this.startNum = this.startPage
    this.maxNum = this.totalPage || 1
    this.pageCount = this.count
    this.endNum = this.startPage + this.count - 1
    // console.log(this.pageCount)
  },
  computed: {
  },
  watch: {
  },
  methods: {
    startPageBlur () {
      this.checkInput()
      typeof this.getPageNum === 'function' && this.getPageNum(formatNum(this.startNum), formatNum(this.endNum))
    },
    endPageBlur () {
      this.checkInput()
      typeof this.getPageNum === 'function' && this.getPageNum(formatNum(this.startNum), formatNum(this.endNum))
    },
    initMaxNum () {
      console.log('设置最大值')
      this.maxNum = this.maxNum || 1
    },
    checkInput () {
      if (parseInt(this.startNum) < 1) {
        this.startNum = 1
      }
      if (parseInt(this.endNum) > parseInt(this.maxNum)) {
        this.endNum = this.maxNum
      }
      if (parseInt(this.endNum) < 1) {
        this.endNum = 1
      }
      if (parseInt(this.startNum) > parseInt(this.endNum)) {
        this.startNum = this.endNum
      }
    }
  }
}
</script>

<style>
.file-page-num {
  margin: 20rpx 0;
  font-size: 30rpx;
}
.file-page-num-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 0rpx;
  display: flex;
  height: 39rpx;
  line-height: 39rpx;
  width: 68rpx;
  text-align: center;
  align-items: center;
}
</style>
