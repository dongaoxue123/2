<template>
  <div class="signin-page">
    <van-cell-group>
      <van-field size="large" required clearable label="用户名" placeholder="请输入用户名" @change="setUserName"/>
      <van-field size="large" required clearable label="密码" placeholder="请输入密码" @change="setPassWord"/>
    </van-cell-group>
     <van-cell-group>
      <van-field size="large" required clearable label="注册码" placeholder="请输入注册码" @change="setAuthCode"/>
    </van-cell-group>
    <van-button type="primary" size="large" @click="doSignin">注册</van-button>
  </div>
</template>

<script>
import { signin } from '@/utils/api'
import store from '@/stores/store'
let userName = ''
let passWord = ''
let authCode = ''
export default {
  data () {
    return {
    }
  },
  methods: {
    doSignin () {
      // console.log(userName)
      if (/[\u4e00-\u9f5a]/.test(userName) || !/^.{3,16}$/.test(userName) || userName === '') {
        wx.showToast({ title: '用户名只能是由3-16位非汉字组成的字符串!', icon: 'none', duration: 1500 })
      } else if (/[\u4e00-\u9f5a]/.test(passWord) || !/^.{3,16}$/.test(passWord) || passWord === '') {
        // console.log(userName)
        wx.showToast({ title: '密码只能是由3-16位非汉字组成的字符串!', icon: 'none', duration: 1500 })
      } else if (authCode === '') {
        wx.showToast({ title: '注册码不能为空!', icon: 'none', duration: 1500 })
      } else {
        wx.showToast({ title: '注册中', icon: 'loading', duration: 3000, mask: true })
        signin(userName, passWord, authCode).then(function (res) {
          if (res.flag) {
            wx.hideToast()
            console.log('注册成功')
            // adminId存入缓存
            mpvue.setStorageSync('adminId', res.data.adminId)
            // adminId存入全局变量
            store.state.adminId = res.data.adminId
            store.commit('saveDataAfter', res.data.adminType)
            wx.showToast({ title: '注册成功!', icon: 'success', duration: 1500 })
            // 跳转到设置页面
            // setTimeout(function () {
            wx.switchTab({url: '/pages/firstSetting/main'})
            // }, 1500)
          } else {
            console.log(res.data)
            wx.showToast({ title: '注册失败: ' + res.message, icon: 'none', duration: 1500 })
          }
        })
      }
    },
    setUserName (event) {
      userName = event.mp.detail
    },
    setPassWord (event) {
      passWord = event.mp.detail
    },
    setAuthCode (event) {
      authCode = event.mp.detail
    }
  }
}
</script>

<style>
  .signin-page {
    background: rgba(69,90,100,.6)
  }
</style>
