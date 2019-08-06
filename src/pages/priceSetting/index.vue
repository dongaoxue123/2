<template>
<van-tabs color="#06C05F" active="active" :change="onChange">
  <van-tab title="纸张价格选择">
  <div class="setting-page">
    <div class="paper"><span>A4 (元/张)</span><span><button v-if="clickFalse" @click="changePrice" class="setprice">修&nbsp;改</button>
           <span @click="alertPaper" v-if="addPaper"><span class="iconfont icon-jiahao"></span><div class="text">添加纸张&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></span></span></div>
    <van-cell-group>
      <!-- <van-cell size="large" label="" @click="onChenge"/> -->
      <van-field :value="price.blackWhiteSinglePrice" input-align="right" :disabled="disable" size="large" label="黑白单面" @change="setBlackWhiteSinglePrice"/>
      <van-field :value="price.blackWhiteDuplexPrice" input-align="right" :disabled="disable"  size="large" label="黑白双面" @change="setBlackWhiteDuplexPrice"/>
      <van-field :value="price.colorSinglePrice" input-align="right" :disabled="disable"  size="large" label="彩色单面" v-if="color" @change="setColorSinglePrice"/>
      <van-field :value="price.colorDuplexPrice" input-align="right" :disabled="disable"  size="large" label="彩色双面" v-if="color" @change="setColorDuplexPrice"/>
    </van-cell-group>
    <div v-if="paperAthree">
    <div class="paper"><span>A3</span><van-icon @click="showdelePop" v-if="deleShow" color="#aaa" name="clear" /></div>
    <van-cell-group>
      <!-- <van-cell size="large" label="" @click="onChenge"/> -->
      <van-field :value="price.a3BlackWhiteSinglePrice" input-align="right" :disabled="disable" size="large" label="黑白单面" @change="setA3BlackWhiteSinglePrice"/>
      <van-field :value="price.a3BlackWhiteDuplexPrice" input-align="right" :disabled="disable"  size="large" label="黑白双面" @change="setA3BlackWhiteDuplexPrice"/>
      <van-field :value="price.a3ColorSinglePrice" input-align="right" :disabled="disable"  size="large" label="彩色单面" v-if="color" @change="setA3ColorSinglePrice"/>
      <van-field :value="price.a3ColorDuplexPrice" input-align="right" :disabled="disable"  size="large" label="彩色双面" v-if="color" @change="setA3ColorDuplexPrice"/>
    </van-cell-group>
    </div>
    <div v-if="paperBfive">
        <div class="paper"><span>B5</span><van-icon @click="deleB" v-if="deleShow" color="#aaa" name="clear" /></div>
    <van-cell-group> 
      <!-- <van-cell size="large" label="" @click="onChenge"/> -->
      <van-field :value="price.b5BlackWhiteSinglePrice" input-align="right" :disabled="disable" size="large" label="黑白单面" @change="setB5BlackWhiteSinglePrice"/>
      <van-field :value="price.b5BlackWhiteDuplexPrice" input-align="right" :disabled="disable"  size="large" label="黑白双面" @change="setB5BlackWhiteDuplexPrice"/>
      <van-field :value="price.b5ColorSinglePrice" input-align="right" :disabled="disable"  size="large" label="彩色单面" v-if="color" @change="setB5ColorSinglePrice"/>
      <van-field :value="price.b5ColorDuplexPrice" input-align="right" :disabled="disable"  size="large" label="彩色双面" v-if="color" @change="setB5ColorDuplexPrice"/>
    </van-cell-group>
    </div>
    <div class="iscolor">
     <van-cell-group>
      <van-switch-cell :disabled="disable" title="开启彩印" :checked="color" size="24px;" @change="checkIsColor"/>
    </van-cell-group>
    </div>
    <div class="save">
      <van-button v-if="showGet" type="default"  @click="onCancel"><span style="padding:0 35px;">取消</span></van-button>
      <van-button v-if="showGet" type="primary" @click="submitSetting"><span style="padding:0 35px;">提交</span></van-button>
    </div>
     <van-popup position="bottom" :show="show" @close="onClose">
       <div class="popupaper">
         <div class="papera" v-if="athreeNone" @click="clickA"><van-button plain hairline type="primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</van-button></div>
         <div class="paperb" v-if="bfiveNone" @click="clickB"><van-button plain hairline type="primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</van-button></div>
       </div>
     </van-popup>
  </div>
  </van-tab>
  <van-tab title="价格折扣设置">
    <van-switch-cell
      title="开启价格折扣"
      :checked="checkedtwo"
      active-color="#06C05F"
      @change="onChangetwo"
    />
    <div class="price" v-if="addPriceSale">
      <div class="groupo"><div class="textsale"><span class="textm">数量(张)</span><span class="saleset">折扣</span></div>
      <span class="change_tier" v-if="changTier"><span style="font-size:14px">修改</span><van-icon  size="22px" class="addinput" @click="changePriceTier" name="edit"/></span>
      <van-icon name="add" size="22px" class="addinput" type="button" @click="addInput" v-if="addTier" style="color:green"/></div>
      <div class="hrs"></div>
      <div v-for="(index, item) in gradients" :key="item">
      <div class="group">
      <div class="textinput">
        <input :disabled="inputTier" :value="index.threshold" class="inputset" type="text" @change="changeTier($event, item)">
        <input :disabled="inputTiertwo" :value="index.discount" class="inputset"  type="text" @change="changeTiertwo($event, item)">
      </div>
      <!-- <div class="delet" v-if="deleTier" @click="deleInput(item)" type="button" style="color:red">删除</div> -->
      <van-icon class="delet" v-if="deleTier" @click="deleInput(item)" type="button" size="20px" name="delete"/>
      </div>
      </div>
    </div>
    <input class="saveo" v-if="savePriceTier" @click="save" type="button" style="color:green" value="保存">
  </van-tab>
  </van-tabs>
</template>
<script>
import { isNotPrice, isPriceTier, isPriceTiertext } from '@/utils/util'
import { markAsRead, updatePricetow, getPrice, setPriceGradient, getPriceGradient, updateHasGradient } from '@/utils/api'
import '@/style/styles.css'
import store from '@/stores/store'
let setting = {
  blackWhiteSinglePrice: 0.0,
  blackWhiteDuplexPrice: 0.0,
  colorSinglePrice: 0.0,
  colorDuplexPrice: 0.0,
  a3BlackWhiteSinglePrice: 0.0,
  a3BlackWhiteDuplexPrice: 0.0,
  a3ColorSinglePrice: 0.0,
  a3ColorDuplexPrice: 0.0,
  b5BlackWhiteSinglePrice: 0.0,
  b5BlackWhiteDuplexPrice: 0.0,
  b5ColorSinglePrice: 0.0,
  b5ColorDuplexPrice: 0.0,
  isColor: 1,
  isA3: 0,
  isB5: 0
}
let revise = {
  adminId: store.state.adminId,
  gradients: [{threshold: 0.0, discount: 0.0}]
}
let adminId = store.state.adminId
export default {
  data () {
    return {
      price: {
        blackWhiteSinglePrice: 0.0,
        blackWhiteDuplexPrice: 0.0,
        colorSinglePrice: 0.0,
        colorDuplexPrice: 0.0,
        a3BlackWhiteSinglePrice: 0.0,
        a3BlackWhiteDuplexPrice: 0.0,
        a3ColorSinglePrice: 0.0,
        a3ColorDuplexPrice: 0.0,
        b5BlackWhiteSinglePrice: 0.0,
        b5BlackWhiteDuplexPrice: 0.0,
        b5ColorSinglePrice: 0.0,
        b5ColorDuplexPrice: 0.0,
        isColor: 1,
        isA3: 0,
        isB5: 0
      },
      gradients: [],
      color: true,
      hasGradient: 0,
      active: 1,
      clickFalse: true, // 纸张修改按钮
      disable: true, // 开启彩印
      paperAthree: false, // a3
      paperBfive: false, // b5
      showGet: false, // 纸张提交 确认取消
      addPaper: false, // 添加纸张
      show: false, // 添加纸张的弹出层
      showdele: false,
      athreeNone: true, // 弹出框里的a3
      bfiveNone: true, // 弹出框里的b5
      deleShow: false, // 删除a3或b5的按钮
      checkedtwo: false, // 开启价格折扣按钮
      addPriceSale: false, // 价格折扣参数（全部）
      savePriceTier: false, // 价格设置保存按钮
      addTier: false, // 增加一列input按钮
      value: 0.0,
      text: 0.0,
      changTier: true, // 价格折扣修改按钮
      deleTier: false, // 价格折扣删除按钮
      inputTier: true, // 价格折扣input框点击
      inputTiertwo: true // 价格折扣input框点击
    }
  },
  onLoad () {
    wx.showToast({ title: '加载中', icon: 'loading', duration: 2000, mask: true })
    // 设置消息已读
    if (store.state.isReadMsg === 1) {
      markAsRead(adminId).then(function (res) {
        if (res.flag) {
          store.commit('setReadMsg', 0)
        }
      })
    }
    this.color = store.state.adminInfo.isColor === 1
    setting = this.price
    this.inputTier = true
    this.athreeNone = true
    this.bfiveNone = true
    this.savePriceTier = false
    this.inputTiertwo = true
    this.addTier = false
    this.deleTier = false
    this.changTier = true
    this.disable = true
    this.addPaper = false
    this.deleShow = false
    this.showGet = false
    this.clickFalse = true
    if (store.state.adminInfo.isA3 === 1) {
      this.paperAthree = true
    } else {
      this.paperAthree = false
    }
    if (store.state.adminInfo.isB5 === 1) {
      this.paperBfive = true
    } else {
      this.paperBfive = false
    }
    getPrice(store.state.adminId).then((res) => {
      if (res.flag) {
        wx.hideToast()
        // A4的价格
        this.price.blackWhiteSinglePrice = res.data.blackWhiteSinglePrice
        this.price.blackWhiteDuplexPrice = res.data.blackWhiteDuplexPrice
        this.price.colorSinglePrice = res.data.colorSinglePrice
        this.price.colorDuplexPrice = res.data.colorDuplexPrice
        // A3价格，默认价格为A4的两倍
        this.price.a3BlackWhiteSinglePrice = !res.data.a3BlackWhiteSinglePrice ? res.data.blackWhiteSinglePrice * 2 : res.data.a3BlackWhiteSinglePrice
        this.price.a3BlackWhiteDuplexPrice = !res.data.a3BlackWhiteDuplexPrice ? res.data.blackWhiteDuplexPrice * 2 : res.data.a3BlackWhiteDuplexPrice
        this.price.a3ColorSinglePrice = !res.data.a3ColorSinglePrice ? res.data.colorSinglePrice * 2 : res.data.a3ColorSinglePrice
        this.price.a3ColorDuplexPrice = !res.data.a3ColorDuplexPrice ? res.data.colorDuplexPrice * 2 : res.data.a3ColorDuplexPrice
        // B5价格，默认价格为A4的两倍
        this.price.b5BlackWhiteSinglePrice = res.data.b5BlackWhiteSinglePrice === null ? res.data.blackWhiteSinglePrice * 2 : res.data.b5BlackWhiteSinglePrice
        this.price.b5BlackWhiteDuplexPrice = res.data.b5BlackWhiteDuplexPrice === null ? res.data.blackWhiteDuplexPrice * 2 : res.data.b5BlackWhiteDuplexPrice
        this.price.b5ColorSinglePrice = res.data.b5ColorSinglePrice === null ? res.data.colorSinglePrice * 2 : res.data.b5ColorSinglePrice
        this.price.b5ColorDuplexPrice = res.data.b5ColorDuplexPrice === null ? res.data.colorDuplexPrice * 2 : res.data.b5ColorDuplexPrice
        // 是否支持A3，B5，彩印
        this.price.isA3 = res.data.isA3
        this.price.isB5 = res.data.isB5
        this.price.isColor = res.data.isColor
      }
    })
    getPriceGradient(store.state.adminId).then((res) => {
      if (res.flag) {
        if (res.data.gradients === null) {
          this.gradients = []
          this.addTier = true
          this.inputTier = false
          this.inputTiertwo = false
          this.deleTier = true
          this.changTier = false
        } else if (res.data.gradients.length === 0) {
          this.changTier = false
          this.addTier = true
        } else {
          this.gradients = res.data.gradients
          this.addTier = false
          this.inputTier = true
          this.inputTiertwo = true
          this.deleTier = false
          this.changTier = true
        }
        if (res.data.hasGradient === 0) {
          this.checkedtwo = false
          this.addPriceSale = false
        } else {
          this.checkedtwo = true
          this.addPriceSale = true
        }
      }
    })
  },
  methods: {
    changePrice () { // 修改纸张点击事件
      this.disable = false
      this.showGet = true
      this.clickFalse = false
      this.addPaper = true
      this.deleShow = true
      if (this.paperAthree && this.paperBfive) {
        this.addPaper = false
      } else {
        this.addPaper = true
      }
    },
    alertPaper () { // 添加纸张按钮
      if (this.paperAthree) {
        this.athreeNone = false
      } else {
        this.athreeNone = true
      }
      if (this.paperBfive) {
        this.bfiveNone = false
      } else {
        this.bfiveNone = true
      }
      this.show = true
      this.showGet = true
    },
    onClose () {
      this.show = false
    },
    clickA () { // 点击弹出层a3
      this.show = false
      this.paperAthree = true
      this.athreeNone = false
      this.price.isA3 = 1
      if (this.paperAthree && this.paperBfive) {
        this.addPaper = false
      }
    },
    clickB () { // 点击弹出层b5
      this.show = false
      this.paperBfive = true
      this.bfiveNone = false
      this.price.isB5 = 1
      if (this.paperAthree && this.paperBfive) {
        this.addPaper = false
      }
    },
    deleB () { // 删除b5
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        success (res) {
          if (res.confirm) {
            that.paperBfive = false
            that.addPaper = true
            that.bfiveNone = true
            that.price.isB5 = 0
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onCancel () {
      wx.navigateBack()
    },
    showdelePop () { // 删除a3
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        success (res) {
          if (res.confirm) {
            that.showdele = false
            that.paperAthree = false
            that.addPaper = true
            that.athreeNone = true
            that.price.isA3 = 0
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    onChange (event) {
      wx.showToast({
        title: `切换到标签 ${event.detail.index + 1}`,
        icon: 'none'
      })
    },
    onClosedele () {
      this.showdele = false
    },
    addInput () { // 价格折扣点击添加
      this.deleTier = true
      this.inputTier = false
      this.inputTiertwo = false
      this.savePriceTier = true
      this.gradients.push({threshold: 0.0, discount: 0.0})
    },
    deleInput (item) { // 价格折扣删除
      let that = this
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        success (res) {
          if (res.confirm) {
            that.gradients.splice(item, 1)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    changePriceTier () { // 价格折扣点击修改
      this.inputTiertwo = false
      this.savePriceTier = true
      this.inputTier = false
      this.deleTier = true
      this.changTier = false
      this.addTier = true
    },
    save () { // 价格折扣保存
      let flags = true
      this.checkedtwo === false ? revise.gradients = [] : revise.gradients = this.gradients
      console.log(revise.gradients)
      for (let key in revise.gradients) {
        if (isPriceTier(revise.gradients[key].threshold)) {
          wx.showToast({ title: '请输入大于0的整数', icon: 'none', duration: 3000 })
          flags = false
          break
        } else if (isPriceTiertext(revise.gradients[key].discount)) {
          wx.showToast({ title: '折扣需为0-1间的小数', icon: 'none', duration: 3000 })
          flags = false
          break
        }
      }
      if (flags === true) {
        setPriceGradient(revise).then((res) => {
          if (res.flag) {
            wx.showToast({ title: '设置成功', icon: 'success', duration: 2000 })
            this.savePriceTier = false
            this.addTier = false
            this.inputTier = true
            this.inputTiertwo = true
            this.deleTier = false
            this.changTier = true
            // setTimeout(function () {
            //   wx.navigateBack()
            // }, 1000)
          }
        })
      }
    },
    submitSetting () {
      let isValid = true
      if (isNotPrice(setting.blackWhiteSinglePrice) || isNotPrice(setting.blackWhiteDuplexPrice)) {
        isValid = false
      }
      if (setting.isColor === 1) {
        if (isNotPrice(setting.colorSinglePrice) || isNotPrice(setting.colorDuplexPrice)) {
          isValid = false
        }
      }
      if (setting.isA3 === 1) {
        if (isNotPrice(setting.a3BlackWhiteSinglePrice) || isNotPrice(setting.a3BlackWhiteDuplexPrice)) {
          isValid = false
        }
        if (setting.isColor === 1) {
          if (isNotPrice(setting.a3ColorSinglePrice) || isNotPrice(setting.a3ColorDuplexPrice)) {
            isValid = false
          }
        }
      }
      if (setting.isB5 === 1) {
        if (isNotPrice(setting.b5BlackWhiteSinglePrice) || isNotPrice(setting.b5BlackWhiteDuplexPrice)) {
          isValid = false
        }
        if (setting.isColor === 1) {
          if (isNotPrice(setting.b5ColorSinglePrice) || isNotPrice(setting.b5ColorDuplexPrice)) {
            isValid = false
          }
        }
      }
      if (isValid) {
        console.log('提交设置')
        setting.adminId = store.state.adminId
        wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
        updatePricetow(setting).then(res => {
          // console.log(res)
          wx.hideToast()
          if (res.flag) {
            // 跳转到账户首页
            wx.showToast({ title: '设置成功', icon: 'success', duration: 2000 })
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          } else {
            wx.showToast({ title: '设置失败，请重新尝试', icon: 'none', duration: 2000 })
          }
        })
      } else {
        wx.showToast({ title: '请输入正确格式的单价，应大于0且在两位小数内', icon: 'none', duration: 3000 })
      }
    },
    changeTier (event, index) {
      this.gradients[index].threshold = Number(event.mp.detail.value)
    },
    changeTiertwo (event, index) {
      this.gradients[index].discount = Number(event.mp.detail.value)
    },
    setBlackWhiteSinglePrice (event) {
      setting.blackWhiteSinglePrice = event.mp.detail
    },
    setBlackWhiteDuplexPrice (event) {
      setting.blackWhiteDuplexPrice = event.mp.detail
    },
    setColorSinglePrice (event) {
      setting.colorSinglePrice = event.mp.detail
    },
    setColorDuplexPrice (event) {
      setting.colorDuplexPrice = event.mp.detail
    },
    setA3BlackWhiteSinglePrice (event) {
      setting.a3BlackWhiteSinglePrice = event.mp.detail
    },
    setA3BlackWhiteDuplexPrice (event) {
      setting.a3BlackWhiteDuplexPrice = event.mp.detail
    },
    setA3ColorSinglePrice (event) {
      setting.a3ColorSinglePrice = event.mp.detail
    },
    setA3ColorDuplexPrice (event) {
      setting.a3ColorDuplexPrice = event.mp.detail
    },
    setB5BlackWhiteSinglePrice (event) {
      setting.b5BlackWhiteSinglePrice = event.mp.detail
    },
    setB5BlackWhiteDuplexPrice (event) {
      setting.b5BlackWhiteDuplexPrice = event.mp.detail
    },
    setB5ColorSinglePrice (event) {
      setting.b5ColorSinglePrice = event.mp.detail
    },
    setB5ColorDuplexPrice (event) {
      setting.b5ColorDuplexPrice = event.mp.detail
    },
    checkIsColor (event) {
      // 需要手动对 checked 状态进行更新
      setting.isColor = event.mp.detail ? 1 : 0
      this.color = event.mp.detail
    },
    setHasGradient (hasGradient) {
      updateHasGradient(store.state.adminId, hasGradient).then((res) => {
        if (res.flag) {
        } else {
          wx.showToast({ title: '网络不佳，请重新尝试', icon: 'none', duration: 2000 })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        }
      })
    },
    onChangetwo (event) { // 开启价格折扣onchange时间
      this.checkedtwo = event.mp.detail
      if (this.checkedtwo) {
        this.setHasGradient(1)
        this.addPriceSale = true
      } else {
        this.setHasGradient(0)
        this.savePriceTier = false
        this.addPriceSale = false
      }
    }
  }
}
</script>
<style>
 .signin-page {
    background: rgba(69,90,100,.6)
  }
  .custom-class{
    height:100rpx;
    background: #fff;
  }
  .setprice{
    font-size:28rpx;
    font-weight: 100;
    background: #06C05F;
    color: #fff;
    margin: 0;
  }
  .price{
    margin-top:10px;
    margin-left:32rpx;
    margin-bottom: 10px
  }
  .hr{
    border-bottom: 1px solid #999;
  }
  .pricechange{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom:10px;
    padding-top:5px;
  }
  .paper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #000;
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding: 10px;
  }
  .text{
    font-size: 10px;
    margin-right: -14px; 
  }
  .popupaper{
    width: 100%;
    height: 100px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .papera {
    width:50%;
    height: 100px;
    color: #000;
    text-align: center;
    line-height: 100px;
  }
  .paperb{
    width:50%;
    height: 100px;
    color: #000;
    text-align: center;
    line-height: 100px;
  }
  .save{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .iscolor{
    border-top: 1px dashed #aaa;
    font-size: 14px;
    color: #000;
  }
  .dele{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .delewid {
    width: 100%;
  }
  .inputset{
    width: 70px;
    height: 30px;
    font-size: 29rpx;
    border: 1px solid #eee;
    border-radius: 10%;
    box-shadow: 2rpx 2rpx 3rpx #999 inset;
    text-align: center;
    
  }
  .groupo{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .textsale{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-right: 10px;
    width: 200px;
  }
  .textinput {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 200px;
    font-size: 12px;
  }
  .textm{
    margin-left: 50rpx;
    font-weight: 600;
  }
  .delet{
    font-size: 12px;
    margin-right: 56rpx;
  }
  .group{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eee;
  }
  .addinput{
    font-size: 10px;
    margin-right: 60rpx;
  }
  .saleset{
    margin-right: 18rpx;
    font-weight: 600;
  }
  .hrs{
    border-bottom: 1rpx solid #000;
    margin-left: -20px;
    margin-top: 10px;
  }
  .change_tier{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon-jiahao{color:green;font-size: 40rpx;text-align: center;line-height:70rpx;margin-left: 10px;}
  .price{
    margin-top: 10px;
  }
</style>