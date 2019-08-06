<script>
import { login, getFiles } from '@/utils/login'
import store from '@/stores/store'

export default {
  created () {
    // 设置服务器ip地址
    // store.commit('setURL', 'https://www.morningxy.com')
    store.commit('setURL', 'http://192.168.2.116:8080')
    // store.commit('setURL', 'http://127.0.0.1')
    // 小程序启动时用户登陆
    // wx.checkSession({
    //   success () {
    //     // session_key 未过期，并且在本生命周期一直有效
    //     // 获取缓存中的用户id
    try {
      const userId = mpvue.getStorageSync('userId')
      if (userId && userId > 0) {
        // 将userId存储为全局变量
        store.commit('setUserId', userId)
        // console.log('userId存在于缓存, userId:' + userId)
        // 获取用户文件并保存于全局存储中
        getFiles()
      } else {
        console.log('userId未找到, 重新登录')
        // 重新登陆
        login()
      }
    } catch (e) {
      console.log(e)
      login()
    }
    // }
    //   fail () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     // 重新登录
    //     login()
    //   }
    // })
  }
}
</script>

<style>
@import './assets/styles/iconfont.css';
@import './assets/styles/iconfont1.css';
/* @import './assets/styles/iconfont2.css'; */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
page {
  height: 100%;
}

.flex {
  display: flex;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
