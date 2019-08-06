<template>
    <div class="page-wrapper" :class="isShow ? '' : 'hide'">
      <div class="hide_wrap" v-if="isShow">
        <div class="wxupload" @click="clickUploadWxFile">
            <div class="iconfont icon-weixin2"></div>
            <span class="textwx">微信文件上传<br><span class="style">支持 pdf word ppt</span></span>
        </div>
        <div class="otherupload">
            <div class="wps" @click="clickUploadLocalFile">
                <div class="iconfont1 icon-wps"></div>
                <span>WPS文件</span>
            </div>
            <div class="pic" @click="openPicUpload">
                <div class="iconfont1 icon-tupian2"></div>
                <span class="picupload">图片上传</span>
            </div>
        </div>
      </div>
        <van-action-sheet :show="show" :actions="actions" @close="onClose" @select="onSelect">
        </van-action-sheet>
        <van-dialog id="van-dialog" />
        <div class="uploadProgress">
          <div class="progress_margin">
            <div style="text-align:center;margin-top:20rpx;" v-if="!isShow">文件加密上传中</div>
             <div class="progress_wrap" v-for="(item, index) in progress" :key="index">
              <div class="fileName_cancel">
                <span style="font-size:30rpx;width:400rpx;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{index + 1}}. {{fileName[index]}}</span>
                <icon style="margin-left:10rpx;overflow:hidden" type="clear" size="15" v-if="state[index] ==='上传中'" @click="cancelUpload(index)"></icon>
              </div>
              <progress show-info class="custom-class" border-radius="10" stroke-width="8" font-size="30rpx" :percent="progress[index]" :activeColor="state[index] ==='已取消' || state[index] ==='失败' ? 'red' : '#09BB07'">
                <span class="progress_label" :class="[state[index] ==='已完成' ? 'green' : 'gray']" v-if="state[index] === '已完成' || state[index] ==='加密中' || state[index] === '上传中' ">{{state[index]}}</span>
                <span class="progress_fail" v-if="state[index] ==='失败'">{{state[index]}}</span>
                <span class="progress_fail" v-if="state[index] ==='已取消'">{{state[index]}}</span>
              </progress> 
            </div>
         </div>
      </div>
    </div>
</template>
<script>
import { uploadFile } from '@/utils/upload'
import Dialog from '../../../static/vant-weapp/dialog/dialog'
export default {
  onShow () {
  },
  data () {
    return {
      show: false,
      actions: [{
        name: '微信聊天图片'
      },
      {
        name: '本地相册图片'
      }],
      progress: [],
      fileName: [],
      isShow: true,
      state: [],
      uploadTask: []
    }
  },
  methods: {
    callback () {
      this.fileName = []
      this.progress = []
      this.state = []
      this.isShow = true
      this.uploadTask = []
      setTimeout(function () {
        wx.switchTab({url: '/pages/file/main'})
      }, 1500)
    },
    clickUploadWxFile () {
      let that = this
      // console.log('上传微信文件')
      try {
        uploadFile('wxDoc', this.callback, function (progress, i, fileName, uploadTask) {
          that.isShow = false
          that.$set(that.fileName, i, fileName)
          that.$set(that.uploadTask, i, uploadTask)
          that.$set(that.progress, i, progress)
          that.$set(that.state, i, '上传中')
          if (that.progress[i] === 100) {
            that.$set(that.state, i, '加密中')
          }
        }, function (state, i) {
          that.$set(that.state, i, state ? '已完成' : '失败')
        })
      } catch (e) {
        Dialog.alert({
          title: '微信版本过低',
          message: '您的微信版本不支持\n上传微信中文件，请更新后使用'
        }).then(() => {
          // on close
        })
      }
    },
    clickUploadLocalFile () {
      wx.navigateTo({'url': '../upload/main'})
    },
    onClose () {
      // console.log('close')
      this.show = false
    },
    onSelect (event) {
      let that = this
      if (event.mp.detail.name === '微信聊天图片') {
        try {
          uploadFile('wxImg', this.callback, function (progress, i, fileName, uploadTask) {
            that.isShow = false
            that.$set(that.fileName, i, fileName)
            that.$set(that.uploadTask, i, uploadTask)
            that.$set(that.progress, i, progress)
            that.$set(that.state, i, '上传中')
            if (that.progress[i] === 100) {
              that.$set(that.state, i, '加密中')
            }
          }, function (state, i) {
            that.$set(that.state, i, state ? '已完成' : '失败')
          })
        } catch (e) {
          Dialog.alert({
            title: '微信版本过低',
            message: '您的微信版本不支持\n上传微信中图片，请更新后使用'
          }).then(() => {
            // on close
          })
        }
      } else {
        uploadFile('localImg', this.callback, function (progress, i, fileName, uploadTask) {
          that.isShow = false
          that.$set(that.fileName, i, fileName)
          that.$set(that.uploadTask, i, uploadTask)
          that.$set(that.progress, i, progress)
          that.$set(that.state, i, '上传中')
          if (that.progress[i] === 100) {
            that.$set(that.state, i, '加密中')
          }
        }, function (state, i) {
          that.$set(that.state, i, state ? '已完成' : '失败')
        })
      }
      this.show = false
    },
    openPicUpload () {
      // console.log('open')
      this.show = true
    },
    cancelUpload (index) {
      var that = this
      wx.showModal({
        title: '确认取消上传？',
        icon: 'none',
        duration: 3000,
        success (res) {
          if (res.confirm) {
            that.$set(that.state, index, '已取消')
            try {
              that.uploadTask[index].abort()
            } catch (e) {
              console.log(e.message)
            }
          }
        }
      })
    }
  }
}
</script>
<style>
.page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.wxupload{
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background: rgb(226,221,227); */
    width: 280px;
    height: 120px;
    border-radius: 10px 10px 10px 10px;
    margin: 60px auto;
    border: 1px solid #999;
    /* border: 1px solid #3cb035; */
    /* background: linear-gradient(to right, rgb(235,232,228) , rgb(226,221,227)); */
    /* box-shadow:  0px 0px 20px #3cb035 inset; */
    /* box-shadow: 10px 5px rgb(248,247,245) inset; */
    box-shadow: 0px 0px 5px 1px rgb(210,203,198);
    margin-top:100px; 
}
.wxupload .textwx .style{
    font-size: 14px;
    /* text-indent: 28px; */
    color: rgb(61, 61, 61);
}
.wxupload .textwx{
    margin-left:30px; 
    color: #000;
    font-size: 20px
}
.otherupload{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    width: 280px;
    height: 100px;
    margin: 0 auto;
}
.otherupload span{
    text-align: center;
}
/* .img{
    margin-left: 5px;
    width: 90px;
    height: 68px;
} */
.wxupload .iconfont icon-weixin2{
    /* font-size: 30px; */
    margin-left: 10px;
}
.wxupload span{
    margin-right: 20px;
    /* color: #333; */
    /* text-shadow: #333; */
}
.wps{
    width: 120px;
    height: 120px;
    /* border: 1px solid #333; */
    border-radius: 5px 5px 5px 5px;
    text-align: center;
    background: #fff;
    border: 1px solid #fff;
    /* box-shadow: 0px 0px 10px rgb(83,163,234) inset; */
    border: 1px solid #999;
    box-shadow: 0px 0px 5px 1px rgb(210,203,198)
}
.wps span{
    font-size: 18px;
    color: #333;
    text-align: center;
}
.pic span{
    font-size: 16px;
    color: #333;    
}
.pic{
    width: 120px;
    height: 120px;
    /* box-shadow: 0px 0px 10px rgb(1,2,120) inset; */
    /* border: 1px solid rgb(1,2,120); */
    border-radius: 5px 5px 5px 5px;
    box-shadow: 0px 0px 5px 1px rgb(210,203,198);
    border: 1px solid #999;
    text-align: center;
    lighting-color: 90px;
}
.pic .picupload{
    font-size: 18px;
}
.icon-wps{font-size: 46px;margin-top: 20px;color: rgb(232,60,84);text-align: center;}
/* .icon-xiangce{font-size: 40px;margin-top: 30px;text-align: center;color:rgb(83,163,234);} */
.icon-tupian2{font-size: 46px;margin-top: 20px;text-align: center;color:rgb(36,112,222);}
.icon-weixin2 {color: #3cb035;font-size: 55px;margin-left: 30px;}
.custom-class{
  width:600rpx;
  margin: 10rpx auto;
}
.uploadProgress{
  max-height: 700rpx;
  /* position: absolute; */
  margin:auto;
  border-radius: 70rpx;
  background: #f5f5f5;
  width:700rpx;
  overflow: auto;
}
.hide{
   background: rgba(0,0,0,.3);
}
.progress_wrap{
  margin-top: 20rpx;
}
.progress_wrap:first-child{
  margin-top: 30rpx;
}
.progress_wrap:last-child{
  margin-bottom: 30rpx;
}
.progress_label{
  font-size:20rpx;
  display:inline-block;
  width:70rpx;
  height:40rpx;
  border-radius:5rpx;
  text-align:center;
  line-height:40rpx;
  background: #ccc;
  color:#3cb035;
  margin-left:20rpx;
  overflow: hidden;
}
.progress_fail{
  font-size:20rpx;
  display:inline-block;
  width:70rpx;
  height:40rpx;
  border-radius:5rpx;
  text-align:center;
  line-height:40rpx;
  background: red;
  color:#fff;
  margin-bottom:12rpx;
  margin-left:20rpx;
}
.gray{
  background: #ccc;
  color:#fff;
}
.green{
 background:#3cb035;
 color:#fff;
}
.fileName_cancel{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding: 0 65rpx 0 100rpx;
}
</style>

