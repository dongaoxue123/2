<template>
    <div>
    <van-cell-group>
      <van-field :value="shopName" input-align="left" size="large" label="店铺名称" :disabled="isShopName" :focus="!isShopName" @change="changeShopName" use-button-slot>
         <van-button slot="button" size="small" type="default"  @click="editShopName" v-if="isShopName">编辑</van-button>
         <van-button slot="button" size="small" type="primary"  @click="saveShopName" v-if="!isShopName">保存</van-button>
      </van-field>
      <van-field :value="userName" input-align="left" size="large" label="用户名" disabled input-class="input-class"/>
      <van-field :value="passWord" input-align="left" size="large" label="密码" :disabled="isPassword" :type="passwordType" :focus="!isPassword" @change="changePassword" use-button-slot>
        <!--<van-button slot="button" size="small" type="default" @click="showPassword" v-if="isPassword">查看</van-button>-->
      </van-field>
    </van-cell-group>
    </div>
</template>
<script>
import store from '@/stores/store'
import { updateShopName } from '@/utils/api'
let res = /^.{1,15}$/
let shopName = ''
// let passWord = ''
export default {
  onShow () {
    this.shopName = store.state.adminInfo.shopName
    this.userName = store.state.adminInfo.adminUsername
    this.passWord = store.state.adminInfo.adminPassword
    // passWord = this.passWord
    shopName = this.shopName
    // this.passwordType = 'password'
  },
  data () {
    return {
      shopName: '',
      userName: '',
      passWord: '',
      isPassword: true,
      isShopName: true,
      passwordType: 'text'
    }
  },
  methods: {
    changeShopName (event) {
      shopName = event.mp.detail
      console.log(this.shopName)
    },
    // changePassword (event) {
    //   passWord = event.mp.detail
    // },
    editShopName () {
      this.isShopName = !this.isShopName
    },
    saveShopName () {
      this.isShopName = !this.isShopName
      if (!res.test(shopName) || shopName === '') {
        wx.showToast({ title: '请输入店铺名称，长度不超过15个字', icon: 'none', duration: 3000 })
      } else {
        wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
        updateShopName(store.state.adminId, shopName).then((res) => {
          wx.hideToast()
          if (res.flag) {
            wx.showToast({ title: '修改成功！', icon: 'none', duration: 3000 })
          } else {
            wx.showToast({ title: '修改失败！', icon: 'none', duration: 3000 })
          }
        })
      }
    },
    // showPassword () {
    //   this.passwordType = 'text'
    // },
    editPassword () {
      this.isPassword = !this.isPassword
    }
    // savePassword () {
    //   this.isPassword = !this.isPassword
    //   if (/[\u4e00-\u9f5a]/.test(passWord) || !/^.{3,16}$/.test(passWord) || passWord === '') {
    //     wx.showToast({ title: '密码只能是由3-16位非汉字组成的字符串!', icon: 'none', duration: 3000 })
    //   } else {
    //     wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
    //     console.log(passWord)
    //     updatePassWord(adminId, passWord).then(res => {
    //       wx.hideToast()
    //       if (res.flag) {
    //         wx.showToast({ title: '修改成功！', icon: 'none', duration: 3000 })
    //       } else {
    //         wx.showToast({ title: '修改失败！', icon: 'none', duration: 3000 })
    //       }
    //     })
    //   }
    // }
  }
}
</script>
<style>
.input-class {
  line-height:40px;
}
</style>