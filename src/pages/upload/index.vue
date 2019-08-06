<template>
  <!-- <div>测试</div> -->
  <web-view :src="'https://www.morningxy.com/applet/uploadLocalFile?userId='+userId" @message="msgHandler" />
</template>
<script>
  import store from '@/stores/store'
  export default {
    // 这里如果使用data()则userId一直为0，url得不到更新
    computed: {
      userId: function () {
        return store.state.userId
      }
    },
    methods: {
      // 监听webview页面传回的数据
      msgHandler (e) {
        console.log(e)
        let fileInfo = e.target.data[0]
        if (fileInfo) {
          if (store.state.isPrintStatus) {
            // 订单页面 新上传直接选中文件
            fileInfo.checked = true
            // 订单页面从后追加入列表
          //   store.state.files.push(fileInfo)
          // } else {
          //   store.state.files.unshift(fileInfo)
          }
          store.state.files.unshift(fileInfo)
          if (store.state.isPrintStatus) {
            wx.navigateBack({delta: 1})
          } else {
            wx.switchTab({url: '/pages/file/main'})
          }
        } else {
          wx.showToast({ title: '上传失败, 请重新尝试或联系客服', icon: 'none', duration: 2000 })
        }
      }
    }
  }
</script>
<style>
</style>
