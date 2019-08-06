import store from '@/stores/store'
import { API_HOST } from '@/utils/config'

function login () {
  wx.showToast({ title: '登陆中', icon: 'loading', duration: 10000, mask: 'true' })
  wx.login({
    success (res) {
      if (res.code) {
        // 发起网络请求
        wx.request({
          url: API_HOST + '/api/login',
          data: {
            code: res.code
          },
          // 登陆成功，存储返回的userId
          success (res) {
            // console.log(res)
            if (res.data.flag) {
              wx.hideToast()
              let data = res.data.data
              let userId = data.userId
              // 存储userId到全局变量
              store.commit('setUserId', userId)
              // 存储userId到缓存
              mpvue.setStorageSync('userId', userId)
              // 保存并展示文件列表
              store.state.files = data.files
              console.log('登陆成功 userId: ' + userId)
            } else {
              loginAfterError()
            }
          },
          fail () {
            loginAfterError()
          }
        })
      } else {
        loginAfterError()
      }
    }
  })
}

function loginAfterError () {
  wx.showToast({ title: '登陆失败', icon: 'none', duration: 2000 })
  // 重试登陆
  setTimeout(function () {
    loginAgain()
  }, 1000)
}

function loginAgain () {
  wx.showToast({ title: '登陆重试中', icon: 'loading', duration: 10000, mask: 'true' })
  wx.login({
    success (res) {
      if (res.code) {
        // 发起网络请求
        wx.request({
          url: API_HOST + '/api/login',
          data: {
            code: res.code
          },
          // 登陆成功，存储返回的userId
          success (res) {
            // console.log(res)
            if (res.data.flag) {
              wx.hideToast()
              let data = res.data.data
              let userId = data.userId
              // 存储userId到全局变量
              store.commit('setUserId', userId)
              // 存储userId到缓存
              mpvue.setStorageSync('userId', userId)
              // 保存并展示文件列表
              store.state.files = data.files
              console.log('登陆成功 userId: ' + userId)
            } else {
              wx.showToast({ title: '重试登陆失败,请退出小程序后重试或联系客服', icon: 'none', duration: 3000 })
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
        wx.showToast({ title: '重试登陆失败,请退出小程序后重试或联系客服', icon: 'none', duration: 3000 })
      }
    }
  })
}

function getFiles (callback) {
  wx.request({
    url: API_HOST + '/api/getFiles?userId=' + store.state.userId,
    success (res) {
      if (res.data.flag) {
        store.state.files = res.data.data
      }
      // 保存并展示文件列表
      // console.log(res.data.data)
    },
    complete () {
      // 完成后执行
      if (callback) {
        typeof callback === 'function' && callback()
      }
    }
  })
}

export { login, getFiles }
