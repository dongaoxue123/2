<template>
    <div>
       <h4>支付金额</h4>
       <span class="mon">￥</span><span class="pri">{{pageContent.price}}</span>
       <div class="bol"></div>
       <div class="time"><span class="tim">交易时间</span><span>{{pageContent.createTime}}</span></div>
       <div class="num"><span class="ber">交易订单号</span><span>{{pageContent.orderNo}}</span></div>
       <div class="num" v-if="pageContent.isNew"><span class="ber">新用户奖励</span><span style="color:red;">+ {{pageContent.award}}</span></div>
       <div class="bol"></div>
       <div class="filelist">文件信息</div>
       <ul>
           <li v-for="(item,index) in orderContents" :key="index" :orderContent="item">
             <div><span class="file">文件名</span><span class="fileName">{{item.fileName}}</span></div>
             <div><span class="file">纸张</span><span class="fileName">{{item.paperSize}}</span></div>
             <div><span class="color">色彩</span><span>{{item.color === 0 ? "黑白" : "彩色"}}</span></div>
             <div><span class="tew">单双</span><span>{{item.duplexMode === 0 ? "单面" : "双面"}}</span></div>
             <div><span class="count">份数</span><span>{{item.copies}}</span></div>
             <div><span class="page">页码</span><span>{{item.startPage + " - " + (item.startPage+item.count-1)}}</span></div>
             <div><span class="sebg">缩印</span><span>{{scalingList[item.scaling]}}</span></div>
             <div><span class="sebg">金额</span><span>{{item.price}}</span></div>
             <h5 class="bov"></h5>
           </li>
       </ul>
    </div>
</template>
<script>
import store from '@/stores/store'
// import { getPrice } from '@/utils/api'
// import income from '@/components/income'
// function showScaling (scaling) {
//   let scalingList = ['一合一', '二合一', '四合一', '六合一']
//   return scalingList[scaling]
// }
export default {
  onShow () {
    // console.log(store.state.pageContent)
    this.pageContent = store.state.pageContent
    // this.pageContent.price = this.pageContent.price.toFixed(2)
    // this.updateUniqueKey(items)
    // this.orderContents = items
    this.orderContents = JSON.parse(store.state.pageContent.orderContent)
    // console.log(this.orderContents[0].paperSize)
    if (this.orderContents[0].paperSize === 0) {
      this.orderContents[0].paperSize = 'A4'
    } else if (this.orderContents[0].paperSize === 1) {
      this.orderContents[0].paperSize = 'A3'
    } else {
      this.orderContents[0].paperSize = 'B5'
    }
    // console.log(this.orderContents)
    // console.log(store.state.pageContent.orderContent)
    // console.log(this.pageContent.price)
  },
  data () {
    return {
      price: '',
      createTime: '',
      orderNo: '',
      paperSize: '',
      pageContent: '',
      orderContents: [],
      scalingList: ['一合一', '二合一', '四合一', '六合一']
    }
  },
  methods: {
  }
}
</script>
<style>
h4{
    margin-left: 320rpx;
    color: #000;
    font-size: 30rpx;
    font-weight: 500;
    margin-top: 30rpx;
    padding-bottom: 20px;
}
.mon{
    margin-left: 262rpx;
    color: #18a316;
    font-size: 60rpx;
}
.pri{
    color: #18a316;
    font-size: 80rpx;
    font-weight: 500;
}
.bol{
    height: 4rpx;
    width: 660rpx;
    background: #d6dad6;
    margin-top: 20rpx;
    margin-left: 44rpx;
}
.goods{
    display:flex;
    justify-content: space-between;
    padding: 20rpx;
    font-size: 30rpx;
    padding-left: 40rpx;
    padding-right: 46rpx;
}
.time{
    display:flex;
    justify-content: space-between;
    font-size: 30rpx;  
    padding-left: 40rpx;
    padding-right: 46rpx;
    padding-top: 40rpx;
    padding-bottom:20rpx; 
}
/* .time{
    display:flex;
    justify-content: space-between;
    padding: 20rpx;
    font-size: 30rpx;
    padding-left: 40rpx;
    padding-right: 46rpx;
} */
.sel{
    display:flex;
    justify-content: space-between;
    padding: 20rpx;
    font-size: 30rpx;
    padding-left: 40rpx;
    padding-right: 46rpx;
}
.num{
    display:flex;
    justify-content: space-between;
    padding: 20rpx;
    font-size: 30rpx;
    padding-left: 40rpx;
    padding-right: 46rpx;
}
.sta{
    color: #717171;
}
.tim{
    color: #717171;
}
.sale{
    color: #717171;
}
.ber{
    color: #717171;
}
.goo{
    color: #717171;
}
li div{
    display:flex;
    justify-content: space-between;
    font-size: 30rpx;  
    padding-left: 40rpx;
    padding-right: 46rpx;
    padding-top: 20rpx;
    padding-bottom:20rpx; 
}
.filelist{
    padding-left: 40rpx;
    font-size: 36rpx;
    color: #5f5b5b;
    font-weight: 600;
    padding-top: 35rpx;
}
.bov{
    height: 4rpx;
    width: 660rpx;
    background: #d6dad6;
    margin-top: 60rpx;
    margin-left: 40rpx;
}
.fileName{
    width: 70%;
    height: 40rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
}
</style>

