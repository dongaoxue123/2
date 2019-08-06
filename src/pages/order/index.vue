<template>
  <section class="page-wrapper">
    <van-notice-bar
      left-icon="../../../static/images/tz.png"
      :text="text"
      color="rgb(25,137,250)"
      backgroundColor="rgb(236,249,255)"
      speed="40"
      v-if="isShowNotice"
    />
    <!-- <div class="shop">
        <div class="shopname"><b>&nbsp&nbsp&nbsp{{shopName}}</b></div>
        <div class="wbsd">
        <span>黑白单面：¥ {{blackWhiteSinglePrice}}</span>
        <span>黑白双面：¥ {{blackWhiteDuplexPrice}}</span>
        </div>
        <div class="wbsd">
        <span>彩色单面：¥ {{colorSinglePrice}}</span>
        <span>彩色双面：¥ {{colorDuplexPrice}}</span>
        </div>
    </div>-->
    <div class="nearDistance" v-if="farPrinter">
      <div class="shopName">
        <span>{{nearShop.shopName}}</span>
        <span style="color:#999;font-size:30rpx;margin-top:10rpx">距您 {{nearShop.shopDistance}}</span>
      </div>
      <div class="shop_do">
        <span class="btn btn_border" @click="checkShop">切换商家</span>
        <span class="btn" style="margin-top:8rpx;" @click="showPrice">查看价格</span>
      </div>
    </div>
    <div class="hide" v-if="isShow">
      <div class="choosePrinterWrap">
        <div class="choosePrinter">
          <div class="printerWrap">
            <div v-if="isBlackWhite">
              <div style="text-align:center;width:100%">黑白打印机</div>
              <div class="changePrinterWrap">
                <span style="width:400rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{printerName}}</span>
                <span class="changePrinter" @click="changePrinter">切换</span>
              </div>
            </div>
            <div v-if="isColor">
              <div style="text-align:center;width:100%;color:red">彩色打印机</div>
              <div class="changePrinterWrap">
                <span style="width:400rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{colorPrinterName}}</span>
                <span class="changePrinter" @click="changePrinterColor">切换</span>
              </div>
            </div>
         </div>
         <div class="printerSure">
            <button @click="setCancel" style="border:1px soild #000;background:#fff;color:#000">取消</button>
            <button @click="setSure">确认</button>
          </div>
          <van-action-sheet :show="show" :actions="actions" @close="onClose" @select="onSelect"/>
          <van-action-sheet :show="colorShow" :actions="actionsColor" @close="onCloseColor" @select="onSelectColor"/>
        </div>
      </div>
    </div>
    <div class="hide" v-if="isShowPrice" @click.stop="closePrice">
      <div class="choosePrinterWrap">
        <div class="choosePrinter" style="width:480rpx;max-height:500rpx;overflow:auto">
          <div>
            <div class="price_title">A4</div>
            <div class="show_price">
              <span>黑白单面：¥ {{blackWhiteSinglePrice}}</span>
              <span>黑白双面：¥ {{blackWhiteDuplexPrice}}</span>
            </div>
            <div class="show_price">
              <span>彩色单面：¥ {{colorSinglePrice}}</span>
              <span>彩色双面：¥ {{colorDuplexPrice}}</span>
            </div>
          </div>
          <div v-if="isA3">
            <div class="price_title">A3</div>
            <div class="show_price">
              <span>黑白单面：¥ {{a3BlackWhiteSinglePrice}}</span>
              <span>黑白双面：¥ {{a3BlackWhiteDuplexPrice}}</span>
            </div>
            <div class="show_price">
              <span>彩色单面：¥ {{a3ColorSinglePrice}}</span>
              <span>彩色双面：¥ {{a3ColorDuplexPrice}}</span>
            </div>
          </div>
          <div v-if="isB5">
            <div class="price_title">B5</div>
            <div class="show_price">
              <span>黑白单面：¥ {{b5BlackWhiteSinglePrice}}</span>
              <span>黑白双面：¥ {{b5BlackWhiteDuplexPrice}}</span>
            </div>
            <div class="show_price">
              <span>彩色单面：¥ {{b5ColorSinglePrice}}</span>
              <span>彩色双面：¥ {{b5ColorDuplexPrice}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup :show="popupShow" @close="onPopupClose" z-index="200" position="bottom">
      <form report-submit="true" style="width:200rpx;height:200rpx" @submit="toSureOrders">
        <div class="tel text">
          <span>手机号:</span>
          <input type="number" placeholder="请输入手机号" :value="tel" @blur="checkTel" @change="telChange">
          <b>(选填)</b>
        </div>
        <div class="tel_number" v-if="telShow">
          <van-icon name="clear" style="margin-top:3rpx;margin-right:3rpx;"/>
          <span> 手机号码格式不正确</span>
        </div>
        <div class="text">
          <span>备&nbsp;&nbsp;&nbsp;&nbsp;注:</span>
          <textarea name="text" id="text" cols="1" rows="3" placeholder="填写信息" v-model="textArea"></textarea>
          <b>(选填)</b>
        </div>
        <div class="btn">
          <button form-type="submit">确认下单</button>
        </div>
      </form>
    </van-popup>
    <!-- <div class="hide">
      <div class="choosePrinterWrap">
        <div class="choosePrinter">
          <div class="tel">
            <span>手机号:</span>
            <input type="tel" placeholder="输入手机号" id="tel" style="line-height:40rpx"/>
          </div>
        </div>
      </div>
    </div> -->
    <main>
      <!-- 重复代码 -->
      <!-- <div class="filelist-empty-toast">
        <div class="upload-from-wechat'@click="clickUploadWxFile">
          <span class="iconfont icon-weixin2"></span>
          <span class="icon-text">上传微信文件</span>
        </div>
        <div class="upload-from-local" @click="clickUploadLocalFile">
          <span class="iconfont icon-bendishangchuan2"></span>
          <span class="icon-text">上传本地文件</span>
        </div>
       
      </div>-->
      <scroll-view class="file-list" scroll-y>
        <div v-if="showFileList">
          <file
            v-for="(file, index) in fileList"
            :key="file.key"
            :index="index"
            :file="file"
            :config="{isPrintStatus: true}"
            :moreSet="set"
            :openPopup="openPopupSet"
            ref="file"
          ></file>
        </div>
      </scroll-view>
    </main>
    <!-- 弹层 -->
    <moreSettings
      :show='popShow'
      @hide='hidePopup'
      @setConfirmed='receiveSettings'
      :set='printSet'
      ref="setting"
    ></moreSettings>
    <footer class="upload-file">
      <!-- 重复代码 -->
      <!---上传本地文件---->
      <!-- <div class="upload-from-local local-hidden" @click="clickUploadLocalFile">
        <span class="iconfont icon-bendishangchuan"></span>
        <span>上传本地文件</span>
      </div> -->
      <div v-if="farPrinter" style="width:135rpx;padding:0 30rpx;"></div>
      <div class="chooseColor upload-from-local" @click="setPrinter" v-if="!farPrinter">
        <span class="iconfont icon-dayin"></span>
        <span style="width:135rpx;height:50rpx;line-height:53rpx;text-align:center;">切换打印机</span>
        <!-- <span class="colorShow">黑白：dfwioehfwies</span> -->
        <!-- <span class="colorShow">彩印：dfwioehfwies</span> -->
      </div>
      <div class="order-sum">
        <span class="iconfont icon-ordersum"></span>
        <strong v-if="flag">{{offSum}}</strong>
        <strong :class="flag ? 'beforeSum' : ''"><span v-if="flag ">￥</span>{{orderSum}}</strong>
      </div>
      <div class="go-upload" @click="goToUpload">
        <span class="iconfont icon-bendishangchuan"></span>
        <span>文件上传</span>
      </div>
    </footer>
    <!-- 打印按钮 -->
    <div class="confirm" @click="toCreateOrder">
      <button type="default" hover-class="button-hover" hover-stay-time="100">打印</button>
    </div>
    <van-dialog id="van-dialog"/>
  </section>
</template>
<script>
import { createOrder, getAdminInfo, getPriceGradient } from '@/utils/api'
import file from '@/components/file'
import store from '@/stores/store'
import moreSettings from '@/components/moreSettings'
import Dialog from '../../../static/vant-weapp/dialog/dialog'
import '@/assets/styles/iconfont2.css'
// 当前进行更多设置操作的 文件id
var currentFileId = ''
let orders = []
let tel = ''
let adminId = 0
export default {
  components: {
    file,
    moreSettings
  },
  data () {
    return {
      showFileList: true,
      popShow: false,
      index: 1,
      blackWhiteSinglePrice: 0,
      blackWhiteDuplexPrice: 0,
      colorSinglePrice: 0,
      colorDuplexPrice: 0,
      a3BlackWhiteSinglePrice: 0,
      a3BlackWhiteDuplexPrice: 0,
      a3ColorSinglePrice: 0,
      a3ColorDuplexPrice: 0,
      b5BlackWhiteSinglePrice: 0,
      b5BlackWhiteDuplexPrice: 0,
      b5ColorSinglePrice: 0,
      b5ColorDuplexPrice: 0,
      shopName: '',
      isShow: false,
      show: false,
      colorShow: false,
      actions: [],
      actionsColor: [],
      printerName: '',
      colorPrinterName: '',
      printerNameList: [],
      colorPrinterNameList: [],
      isBlackWhite: true,
      isColor: false.startPage,
      colorPrinter: '',
      printer: '',
      isShowNotice: false,
      text: '本店通知：凡进店打印者优惠',
      type: 0,
      farPrinter: false,
      isShowPrice: false,
      popupShow: false,
      isA3: false,
      isB5: false,
      textArea: '',
      telShow: false
    }
  },
  onShow () {
    // this.farPrinter = false
    // console.log('刷新了')
    this.isShow = false
    this.isShowPrice = false
    this.popupShow = false
    this.telShow = false
    this.isA3 = false
    this.isB5 = false
    let that = this
    // console.log(this.updateUniqueKey())
    adminId = store.state.adminId
    getAdminInfo(adminId).then(function (res) {
      // console.log(res.data)
      // 设置adminId
      if (res.data) {
        // console.log(res)
        res.data.adminId = adminId
        store.commit('setAdminInfo', res.data)
        // console.log(store.state.adminInfo)
        // store.commit('getIsColor', res.data.isColor)
        // store.commit('getBlackWhitePrinters', res.data.blackWhitePrinters)
        that.blackWhiteSinglePrice = res.data.blackWhiteSinglePrice
        that.blackWhiteDuplexPrice = res.data.blackWhiteDuplexPrice
        that.colorSinglePrice = res.data.colorSinglePrice
        that.colorDuplexPrice = res.data.colorDuplexPrice
        if (res.data.isA3) {
          that.isA3 = true
          that.a3BlackWhiteSinglePrice = res.data.a3BlackWhiteSinglePrice
          that.a3BlackWhiteDuplexPrice = res.data.a3BlackWhiteDuplexPrice
          that.a3ColorSinglePrice = res.data.a3ColorSinglePrice
          that.a3ColorDuplexPrice = res.data.a3ColorDuplexPrice
        }
        if (res.data.isB5) {
          that.isB5 = true
          that.b5BlackWhiteSinglePrice = res.data.b5BlackWhiteSinglePrice
          that.b5BlackWhiteDuplexPrice = res.data.b5BlackWhiteDuplexPrice
          that.b5ColorSinglePrice = res.data.b5ColorSinglePrice
          that.b5ColorDuplexPrice = res.data.b5ColorDuplexPrice
        }
        // console.log(res.data.blackWhitePrinters)
        that.shopName = res.data.shopName
        // that.adminId = res.data.adminId
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res.data.shopName
        })
        // 设置打印机
        that.printerNameList = JSON.parse(res.data.usableBlackWhitePrinters)
        that.colorPrinterNameList = JSON.parse(res.data.usableColorPrinters)
        that.printerName = that.printerNameList[0]
        that.colorPrinterName = that.colorPrinterNameList[0]
        that.printer = that.printerNameList[0]
        that.colorPrinter = that.colorPrinterNameList[0]
        store.commit('setPrinter', {bwPrinter: that.printer, colorPrinter: that.colorPrinter})
      } else {
        Dialog.alert({
          title: '网络异常',
          message: '获取商家信息失败，请尝试重新扫码'
        }).then(() => {
          wx.switchTab({url: '/pages/file/main'})
        })
      }
      wx.hideLoading()
    })
    getPriceGradient(this.adminId).then(function (res) {
      if (res.flag) {
        if (res.data.hasGradient) {
          that.isShowNotice = true
          store.commit('setOffArr', res.data.gradients)
          res.data.gradients.map(item => {
            that.text += `满${item.threshold}张，享${item.discount * 10}折。 `
          })
        }
      } else {
        this.flag = false
      }
      // console.log(store.state.pageArr)
    })
  },
  onLoad (options) {
    adminId = this.$mp.query.adminId
    this.adminId = Number(adminId)
    // console.log('adminId: ' + options.adminId)
    // console.log(options)
    // if (!this.fileList || this.fileList.length === 0) {
    //   wx.navigateTo({'url': '../printUpload/main'})
    // }
    if (this.adminId && this.adminId > 0) {
      wx.showLoading({
        title: '加载中',
        icon: 'loading',
        duration: 3000,
        mask: 'true'
      })
      if (options.type) {
        // console.log('远程打印')
        this.type = options.type
        this.farPrinter = true
      } else {
        this.farPrinter = false
      }
    } else {
      Dialog.alert({
        title: '网络异常',
        message: '获取商家信息失败，请尝试重新扫码'
      }).then(() => {
        wx.switchTab({url: '/pages/file/main'})
      })
    }
  },
  mounted: function () {
    let that = this
    store.commit('setPrintStatus', true)
    // 强制刷新文件组件列表，防止因为页面回退不销毁导致的问题
    this.$data.showFileList = false
    // 在组件移除后，重新渲染组件
    // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
    this.$nextTick(() => {
      this.$data.showFileList = true
    })
    // 重新计算价格
    store.commit('calcOrderSum')
    // 关闭弹层
    this.$data.popShow = false
    setTimeout(function () {
      // console.log(that.showFileList)
      if (!that.showFileList) {
        that.showFileList = true
      }
    }, 100)
    setTimeout(function () {
      if (!that.showFileList) {
        that.showFileList = true
      }
      if (!that.fileList || that.fileList.length === 0) {
        wx.navigateTo({url: '../printUpload/main'})
      }
    }, 500)
    setTimeout(function () {
      if (!that.showFileList) {
        that.showFileList = true
      }
    }, 1000)
  },
  computed: {
    nearShop: function () {
      return store.state.nearShop
    },
    flag: function () {
      return store.state.flag
    },
    offSum: function () {
      return store.state.offSum
    },
    fileList: function () {
      // 这里其实只有当 store.state.files 的个数发生改变后才会触发
      // console.log('computed: 又刷新了')
      this.updateFilesFlag(store.state.files)
      // console.log(store.state.files)
      return store.state.files
    },
    // adminId: function () {
    //   console.log(store.state.files)
    // },
    // blackWhiteSinglePrice: function () {
    //   return
    // },
    orderSum: function () {
      return store.state.orderSum
    },
    active: function () {
      return this.fileList && this.fileList.length === 0
    }
  },
  // onShow (file) {
  //   console.log(this.fileList.key)
  //   file.forEach((fileList, index) => {
  //     fileList.key = index + '_' + fileList.fileId
  //   })
  // },
  methods: {
    // 远程打印下单
    toSureOrders (e) {
      // console.log(this.tel, this.textArea)
      if (this.telShow) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        })
      } else {
        for (let i in orders) {
          if (orders[i].color) {
            orders[i].printerName = this.colorPrinterName
          } else {
            orders[i].printerName = this.printerName
          }
        }
        // console.log(e)
        createOrder(store.state.adminInfo.adminId, orders, 1, e.mp.detail.formId, tel, this.textArea)
      }
    },
    telChange (e) {
      // console.log(e.target)
      tel = e.target.value
      if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel) || tel === '') {
        this.telShow = false
      } else {
        this.telShow = true
      }
    },
    closePrice () {
      // console.log('关闭')
      this.isShowPrice = false
    },
    showPrice () {
      this.isShowPrice = true
    },
    checkShop () {
      wx.navigateTo({url: '/pages/shopList/main'})
      // wx.navigateBack({ delta: 1 })
    },
    setSure () {
      this.printer = this.printerName
      this.colorPrinter = this.colorPrinterName
      this.isShow = false
      // this.isBlackWhite = false
      this.isColor = false

      // 将当前选择的打印机保存到store中
      store.commit('setPrinter', {bwPrinter: this.printer, colorPrinter: this.colorPrinter})
    },
    setCancel () {
      this.printerName = this.printer
      this.colorPrinterName = this.colorPrinter
      this.isShow = false
      // this.isBlackWhite = false
      this.isColor = false
    },
    changePrinter () {
      this.actions = []
      for (let i in this.printerNameList) {
        this.actions.push({'name': this.printerNameList[i]})
      }
      this.show = true
    },
    onClose () {
      this.show = false
    },
    onPopupClose () {
      this.popupShow = false
    },
    onSelect (event) {
      this.printerName = event.target.name
      this.show = false
    },
    changePrinterColor () {
      this.actionsColor = []
      for (let i in this.colorPrinterNameList) {
        this.actionsColor.push({'name': this.colorPrinterNameList[i]})
      }
      this.colorShow = true
    },
    onCloseColor () {
      this.colorShow = false
    },
    onSelectColor (event) {
      this.colorPrinterName = event.target.name
      this.colorShow = false
    },
    setPrinter () {
      for (let i in store.state.files) {
        if (!store.state.files[i].color) {
          this.isBlackWhite = true
        } else {
          this.isColor = true
        }
      }
      this.isShow = true
      // console.log(this.isShow)
    },
    goToUpload () {
      wx.navigateTo({url: '../printUpload/main'})
    },
    updateFilesFlag (files) {
      // 生成唯一标识
      files.forEach((file, index) => {
        file.key = index + '_' + file.fileId
        file.checked = Boolean(file.checked)
      })
    },
    // clickUploadLocalFile () {
    //   wx.navigateTo({'url': '../upload/main'})
    // },
    // clickUploadWxFile () {
    //   // console.log('上传微信文件')
    //   try {
    //     uploadWxFile()
    //   } catch (e) {
    //     Dialog.alert({
    //       title: '微信版本过低',
    //       message: '您的微信版本不支持\n上传微信中文件，请更新后使用'
    //     }).then(() => {
    //       // on close
    //     })
    //   }
    // },
    // 兄弟组件通过父组件进行通信：  file组件让开弹层，传入初始打印参数
    // order.vue引入并调用setting组件方法changeData,使得弹层显示初始打印参数
    openPopupSet (isShow, fileId, fileName, color, scaling, paperSize, orientation) {
      // console.log('file你好，我收到了，弹层开了，打印参数我帮你中转给弹层: ' + fileId)
      this.$data.popShow = isShow
      currentFileId = fileId
      this.$refs.setting.changeData(color, scaling, orientation, paperSize)
      this.$refs.setting.receiveFileName(fileName)
    },
    // 监听setting子组件传来的消息，关闭弹层
    hidePopup: function (msg) {
      this.$data.popShow = msg
    },
    // 监听setting子组件传来的消息，接收打印参数
    receiveSettings (msg) {
      // console.log('父组件收到打印参数传给file组件啦')
      // console.log(msg)
      // 用fileId进行过滤
      let foundFile = this.$refs.file.filter(
        fileItem => fileItem.file.fileId === currentFileId
      )
      // console.log('找到了是这个文件要更改参数')
      foundFile[0].updatePrintSet(msg)
    },
    blackWhiteSinglePrice () {
      return this.blackWhiteSinglePrice
    },
    toCreateOrder () {
      orders = this.fileList
        .filter(function (file) {
          return file.checked
        })
        .map(function ({
          fileId,
          copies,
          startPage,
          count,
          duplexMode,
          color,
          scaling,
          paperSize,
          orientation
        }) {
          return {
            fileId,
            copies,
            startPage,
            count,
            duplexMode,
            color,
            scaling,
            paperSize,
            orientation
          }
        })
        // console.log(orders)
        // 遍历数据进行校验
        // 参数校验
      for (let i in orders) {
        if (orders[i].count <= 0 || orders[i].startPage <= 0) {
          wx.showToast({
            title: '页码范围设置错误',
            icon: 'none',
            duration: 2000
          })
          return false
        }
      }
      if (orders.length) {
        if (orders.length > 30) {
          wx.showToast({
            title: '一次只能打印不超过30个文件',
            icon: 'none',
            duration: 3000
          })
          return false
        }
        if (this.type) {
          this.popupShow = true
        } else {
          for (let i in orders) {
            if (orders[i].color) {
              orders[i].printerName = this.colorPrinterName
            } else {
              orders[i].printerName = this.printerName
            }
          }
          createOrder(store.state.adminInfo.adminId, orders, 0)
        }
        // console.log(orders)
      } else {
        wx.showToast({
          title: '订单为空，请选择文件',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  // 页面转发处理逻辑
  onShareAppMessage () {
    console.log('转发')
  }
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.hide{
  height:100%;
  width:100%;
  position: absolute;
  z-index: 150;
  background:rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-items: center;
}
main {
  width: 100%;
  height: 100%;
  flex-basis: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
main .filelist-empty-toast {
  font-size: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  flex-direction: column;
  height: 100%;
}
main .filelist-empty-toast .upload-from-wechat {
  border: 4rpx solid #07c160;
  margin-bottom: 140rpx;
  width: 260rpx;
  height: 260rpx;
  border-radius: 4px;
  box-shadow: inset 0px 0px 18px -4px rgba(7, 193, 96, 1);
}
/* main .filelist-empty-toast .upload-from-wechat:hover {
  border: 4rpx solid #07C160;
} */
main .filelist-empty-toast .upload-from-local {
  border: 4rpx solid #07c160;
  width: 260rpx;
  height: 260rpx;
  border-radius: 4px;
  box-shadow: inset 0px 0px 18px -4px rgba(7, 193, 96, 1);
}
main .filelist-empty-toast .icon-text {
  font-size: 34rpx;
}
main .filelist-empty-toast .icon-bendishangchuan2 {
  font-size: 90rpx;
  color: #799fff;
}
main .filelist-empty-toast .icon-weixin2 {
  font-size: 90rpx;
  color: #3cb035;
}
footer {
  height: 180rpx;
}
.file-list {
  width: 100%;
  height: 100%;
}
.upload-file {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  justify-items: center;
}
.upload-from-local {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
}
.local-hidden {
  visibility: hidden;
}
.go-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
  z-index: 100;
}
.order-sum {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100px;
}
/* .hide_printer{
  visibility: hidden;
} */
span {
  font-size: 24rpx;
}
.button-hover {
  color: #07c160;
}

button {
  border: 4rpx solid #07c160;
  margin: 30rpx 20rpx;
  background-color: white;
}
.page-wrapper .shop {
  padding-top: 10px;
  /* background: #f8f8f8; */
  padding-bottom: 10px;
  /* border-bottom: 1px solid #eee; */
  border-bottom: 1rpx solid rgb(241, 241, 241);
  background: #f9f9f9;
}
.changePrinterWrap{
  display: flex;
  justify-content: space-between;
  padding:0 0 20rpx 30rpx;
  border-bottom: 1px solid #eee;
  margin-top: 20rpx;
  margin-bottom:40rpx
}
.changePrinterWrap span{
  font-size: 35rpx;
  color:#999;
}
.page-wrapper .shop .shopname {
  font-size: 20px;
  line-height: 32px;
  font-weight: 600;
  text-align: center;
}
.page-wrapper .shop .wbsd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 28px;
}
.page-wrapper .shop .wbsd span {
  font-size: 15px;
  color: #999;
  margin-right: 14px;
  margin-left: 36rpx;
}
.choosePrinterWrap{
 /* position: absolute; */
 margin: 0 auto;
 /* height:100%;
 width:100%; */
 z-index:200;
 display: flex;
}
.choosePrinter{
  width:550rpx;
  min-height:200rpx;
  border-radius: 40rpx;
  background: #fff;
  margin:auto;
  padding:30rpx;
  padding-top: 38rpx;
}
.changePrinterWrap .changePrinter{
  width:100rpx;
  height:50rpx;
  background:#07c160;
  text-align: center;
  line-height: 50rpx;
  color:#fff;
  border-radius: 10rpx;
}
.printerSure{
  display: flex;
}
.printerSure button{
  border:0;
  width:130rpx;
  height:70rpx;
  background:#07c160;
  font-size:35rpx;
  margin: 0 auto;
  padding:0;
  line-height: 70rpx;
  color:#fff;
}
.colorShow{
  width:200rpx;
  height:50rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color:#aaa;
  z-index:200;
}
/* 引入icon样式 */
.iconfont {
  font-size: 80rpx;
}
.icon-bendishangchuan {
  color: #799fff;
}
.icon-weixin {
  color: #3cb035;
}
.icon-ordersum {
  color: #e0620d;
  font-size: 60rpx;
  margin-right: 10rpx;
  z-index: 110px;
}
.icon-dayin{
   width:78rpx;
   height:78rpx;
   border-radius: 78rpx;
   background: #07c160;
   color:#fff;
   font-size: 50rpx;
   text-align: center;
   line-height: 78rpx;
   margin-top: 22rpx;
   font-weight: 100;
}
.icon-saoma {
  color: #3cb035;
}
.beforeSum{
  text-decoration: line-through;
  color:#f8580e;
  font-size:30rpx;
  margin-left: 20rpx;
  margin-top:10rpx;
}
.nearDistance{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:20rpx 20rpx 20rpx 50rpx;
  border-bottom: 1rpx solid rgb(241, 241, 241); 
  background:#f9f9f9;
}
.nearDistance .btn{
  width:120rpx;
  height:50rpx;
  margin: 0;
  font-size: 27rpx;
  /* padding:0 10rpx; */
  line-height: 50rpx;
  color:rgb(38,108,220);
  border:0;
  text-align: center;
  /* border:1rpx solid #ccc;
  background: #ffffff; */
}
.nearDistance .btn_border{
  /* border:1rpx solid #07c160; */
  border-radius: 10rpx;
  /* background: rgb(38,108,220); */
  /* background: #07c160; */
  /* color:#07c160; */
  /* color: #fff; */
  color:rgb(38,108,220);
  /* color: #333; */
  margin-bottom:10rpx;
  margin-top:15rpx;
}
.shop_do{
  display: flex;
  flex-direction: column;
}
.nearDistance .shopName span{
  display: flex;
  font-size: 35rpx;
  color:#333;
  padding:10rpx 0;
}
.chooseColor{
  z-index:100
}
.show_price{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.show_price span{
  font-size: 28rpx;
  color:#333;
}
.price_title{
  text-align: center;
  margin-bottom:10rpx;
}
.tel{
  display: flex;
  font-size: 30rpx;
}
.choosePrinter #tel{
  width:400rpx;
  height:40rpx;
  /* line-height:40rpx; */
  text-align: left;
  text-indent: 20rpx;
  margin-left: 20rpx;
}
.text{
  width:600rpx;
  margin: 30rpx auto;
  display: flex;
  justify-content: space-between;
}
.tel{
  margin-bottom:0;
}
.text span{
  color:#333;
  font-size: 30rpx;
  margin-right: 20rpx;
}
.text b{
  width:80rpx;
  font-size: 25rpx;
  margin-left:20rpx;
  color:#aaa;
  font-weight: 100;
  
}
.text textarea{
  /* width:420rpx; */
  /* text-indent: 20rpx; */
  flex:1;
  border:1px solid #eee;
  font-size: 25rpx;
  color:#999;
  /* padding:0 10rpx; */
  height:150rpx;
  text-indent:10rpx;
}
.tel input{
  height:50rpx;
  border:1px solid #eee;
  flex:1;
  text-align: left;
  font-size: 28rpx;
  color:#333;
  text-indent:10rpx;
}
.btn button{
  width:140rpx;
  padding:0;
  margin:10rpx auto 40rpx;
  font-size: 28rpx;
  border:0;
  background:#3cb035;
  color:#fff;
}
.tel_number{
  display: flex;
  width:350rpx;
  margin: 0 auto;
  color:red;
  font-size: 25rpx;
  /* text-align:center; */
}
</style>
