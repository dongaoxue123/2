<template>
    <div> 
      <div class="blackchange">
        <span>黑白</span>
        <span style="display:inlink-block;">
          <span v-if="pageChangeShow" @click="pageChange" style="display:flex">
            <span style="font-size:30rpx;color:#999;">编辑</span>
            <span style="font-size:60rpx;" class="iconfont icon-xiugai"></span>
          </span>
          <span v-if="showAdd" @click="addPinter">
            <span style="font-size:30rpx; color:#999;">添加</span>&nbsp;
            <span class="iconfont icon-jiahao"></span>
          </span>
        </span>
      </div>
      <div class="zengjia" style="border-bottom:1px solid #eee" v-for="(index, item) in usableBlackWhitePrinters" :key=item :newprint=item> 
      <!-- <input v-if="showListRadio" type="radio" name="onecheck"/> -->
        <span class="printerItem"  @click.stop="onChange(item)">
          <van-radio-group v-model="name" style="margin-top:10rpx;">
            <van-radio v-show="showListRadio" v-if="showAdd" :name="item"></van-radio>
          </van-radio-group>
          <span v-if="name === item && showAdd" style="color:#999;font-size:14px;display:block;width:80rpx;height:60rpx;line-height:60rpx;">默认</span>
        </span>
        <span class="addpinter" @click="changePinter(item)">{{index}}</span>
        <div style="width:80rpx;text-align:center" @click.stop="dele(item)">
          <span v-if="(name !== item) && showAdd" class="iconfont icon-shanchu" style="font-size:40rpx"></span>
        </div>
        <span v-if="(name === item) || !showAdd" style="width:30rpx;height:10rpx"></span>
      </div>
      <div class="blackchange">
        <span>彩色</span>
        <span>
          <span v-if="showAddColor" @click="addPinterColor">
            <span style="font-size:30rpx; color:#999;">添加</span>&nbsp;
            <span class="iconfont icon-jiahao"></span>
          </span>
        </span>
      </div>
      <div class="zengjia" style="border-bottom:1px solid #eee" v-for="(index, item) in usableColorPrinters" :key=item :newprint=item> 
        <span class="printerItem" @click="onChangeColor(item)">
          <van-radio-group v-model="colorName" style="margin-top:10rpx;">
            <van-radio v-show="showColorListRadio" v-if="showAdd" :name="item"></van-radio>
          </van-radio-group>
          <span v-if="colorName === item && showAdd" style="color:#999;font-size:14px;display:block;width:80rpx;height:60rpx;line-height:60rpx;">默认</span>
        </span>
        <span class="addpinter" @click="changePinterColor(item)">{{index}}</span>
        <div style="width:80rpx;text-align:center" @click.stop="deleColor(item)">
           <span v-if="colorName !== item && showAdd" class="iconfont icon-shanchu" style="font-size:40rpx"></span>
        </div>
        <span v-if="colorName === item || !showAdd" style="width:30rpx;height:10rpx"></span>
      </div>
      <button v-if="saveButton && showAdd" @click="saveChange" style="background:#07c160;color:#eee;margin-top:20rpx;">保存</button>
      <van-action-sheet :show="show" :actions="actions" @close="onClose" @select="onSelect"/>
      <van-action-sheet :show="showColor" :actions="actionsColor" @close="onCloseColor" @select="onSelectColor"/>
      <van-action-sheet :show="addShowColor" :actions="actionsColor" @close="onCloseAddColor" @select="addOnSelectColor"/>
      <van-action-sheet :show="addPinterShow" :actions="actions" @close="onCloseAdd" @select="addOnSelect"/>
    </div>
</template>
<script>
import store from '@/stores/store'
import '@/style/styles.css'
import { getAllPrinters, updateUsablePrinters } from '@/utils/api'
// import Dialog from '../../../static/vant-weapp/dialog/dialog'
let setting = {
  usableBlackWhitePrinters: [],
  usableColorPrinters: []
}
export default {
  data () {
    return {
      name: 0,
      colorName: 0,
      usableBlackWhitePrinters: [],
      usableColorPrinters: [],
      showAdd: false,
      showListRadio: false,
      saveButton: false,
      pageChangeShow: true,
      showAddColor: false,
      show: false,
      addPinterShow: false,
      addShowColor: false,
      showColor: false,
      blackWhitePrinters: '',
      colorPrinters: '',
      actions: [],
      actionsColor: [],
      printerIndex: 0
    }
  },
  onLoad () {
    this.pageChangeShow = true
    this.showAdd = false
    this.showAddColor = false
    this.name = 0
    this.colorName = 0

    this.onecheck = false
    this.actions = []
    this.actionsColor = []
    wx.showToast({ title: '加载中', icon: 'loading', duration: 3000, mask: true })
    getAllPrinters(store.state.adminId).then((res) => {
      wx.hideToast()
      // console.log(res.data)
      if (res.flag) {
        this.usableBlackWhitePrinters = res.data.usableBlackWhitePrinters
        this.usableColorPrinters = res.data.usableColorPrinters
        for (let i in res.data.blackWhitePrinters) {
          if (this.usableBlackWhitePrinters.indexOf(res.data.blackWhitePrinters[i]) < 0) {
            this.actions.push({'name': res.data.blackWhitePrinters[i]})
          }
        }
        for (let i in res.data.colorPrinters) {
          if (this.usableColorPrinters.indexOf(res.data.colorPrinters[i]) < 0) {
            this.actionsColor.push({'name': res.data.colorPrinters[i]})
          }
        }
      }
    })
  },
  methods: {
    onChange (index) {
      this.name = index
      this.addRadioText = true
    },
    onChangeColor (index) {
      this.colorName = index
    },
    pageChange () {
      this.showAdd = true
      this.pageChangeShow = false
      this.showAddColor = true
      this.saveButton = true
      this.showListRadio = true
      this.showColorListRadio = true
    },
    onClose () {
      // console.log('close')
      this.show = false
    },
    onCloseAdd () {
      this.addPinterShow = false
    },
    dele (index) {
      let that = this
      wx.showModal({
        content: '确定要删除吗?',
        confirmColor: '#1989fa',
        success: function (res) {
          if (res.confirm) {
            that.actions.push({'name': that.usableBlackWhitePrinters[index]})
            that.usableBlackWhitePrinters.splice(index, 1)
            if (index < that.name) {
              that.name--
            }
          }
        }
      })
    },
    deleColor (index) {
      let that = this
      wx.showModal({
        content: '确定要删除吗?',
        confirmColor: '#1989fa',
        success: function (res) {
          if (res.confirm) {
            that.actionsColor.push({'name': that.usableColorPrinters[index]})
            that.usableColorPrinters.splice(index, 1)
            if (index < that.colorName) {
              that.colorName--
            }
          }
        }
      })
    },
    onCloseColor () {
      this.showColor = false
    },
    onCloseAddColor () {
      this.addShowColor = false
    },
    changePinter (index) {
      if (this.showAdd) {
        if (this.actions.length === 0) {
          wx.showToast({ title: '没有可供修改的打印机', icon: 'none', duration: 2000, mask: true })
        } else {
          this.printerIndex = index
          // console.log(this.show)
          this.show = true
        }
      }
    },
    changePinterColor (index) {
      if (this.showAdd) {
        if (this.actionsColor.length === 0) {
          wx.showToast({ title: '没有可供修改的打印机', icon: 'none', duration: 2000, mask: true })
        } else {
          this.printerIndex = index
          this.showColor = true
        }
      }
    },
    onSelectColor (event) {
      for (let i in this.actionsColor) {
        if (this.actionsColor[i].name === event.mp.detail.name) {
          this.$set(this.actionsColor, i, {'name': this.usableColorPrinters[this.printerIndex]})
        }
      }
      this.$set(this.usableColorPrinters, this.printerIndex, event.mp.detail.name)
      this.showColor = false
    },
    onSelect (event) {
      for (let i in this.actions) {
        if (this.actions[i].name === event.mp.detail.name) {
          this.$set(this.actions, i, {'name': this.usableBlackWhitePrinters[this.printerIndex]})
        }
      }
      this.$set(this.usableBlackWhitePrinters, this.printerIndex, event.mp.detail.name)
      // this.colorPrinters = event.mp.detail.name
      this.show = false
    },
    addOnSelect (event) {
      // console.log(event.mp.detail.name)
      this.usableBlackWhitePrinters.push(event.mp.detail.name)
      for (let i in this.actions) {
        if (this.actions[i].name === event.mp.detail.name) {
          this.actions.splice(i, 1)
        }
      }
      this.addPinterShow = false
    },
    addOnSelectColor (event) {
      this.usableColorPrinters.push(event.mp.detail.name)
      for (let i in this.actionsColor) {
        if (this.actionsColor[i].name === event.mp.detail.name) {
          this.actionsColor.splice(i, 1)
        }
      }
      this.addShowColor = false
    },
    addPinter () {
      if (this.actions.length === 0) {
        wx.showToast({ title: '没有可供添加的打印机', icon: 'none', duration: 2000, mask: true })
      } else {
        this.addPinterShow = true
      }
      // this.nodele = true
      // console.log(this.newprint)
    },
    addPinterColor () {
      if (this.actionsColor.length === 0) {
        wx.showToast({ title: '没有可供添加的打印机', icon: 'none', duration: 2000, mask: true })
      } else {
        this.addShowColor = true
      }
    },
    saveChange () {
      if (this.usableBlackWhitePrinters.length > 0) {
        let checkedPrinter = this.usableBlackWhitePrinters[this.name]
        this.usableBlackWhitePrinters.splice(this.name, 1)
        this.name = 0
        this.usableBlackWhitePrinters.unshift(checkedPrinter)
      }
      if (this.usableColorPrinters.length > 0) {
        let checkedColorPrinter = this.usableColorPrinters[this.colorName]
        this.usableColorPrinters.splice(this.colorName, 1)
        this.colorName = 0
        this.usableColorPrinters.unshift(checkedColorPrinter)
      }
      setting.adminId = store.state.adminId
      setting.usableBlackWhitePrinters = this.usableBlackWhitePrinters
      setting.usableColorPrinters = this.usableColorPrinters
      wx.showToast({ title: '提交中', icon: 'loading', duration: 3000, mask: true })
      updateUsablePrinters(setting).then(res => {
        wx.hideToast()
        if (res.flag) {
          wx.showToast({ title: '设置成功', icon: 'success', duration: 2000 })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({ title: '设置失败，请重新尝试', icon: 'none', duration: 2000 })
        }
      })
    }
  }
}
</script>
<style>
.xiugai{
  font-size:30rpx;
  margin: 0;
  margin-right: 12px;
}
.blackchange{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-left: 24rpx;
  line-height: 100rpx;
  background: #f5f5f5;
  padding-right: 24rpx;
}
.printerItem{
  width:80rpx;
  height:100%;
  display:flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: center;
}
.black{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:20px 15px;
  font-size:18px;
  border-bottom: 1px solid #eee;
}
.printname{
  color: #999;
  font-size: 15px;
}
.zengjia{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height:100rpx;
  line-height: 100rpx;
  padding:20rpx 0rpx 20rpx 30rpx;
}
.addpinter{
  color:#999;
  font-size:30rpx;
  width:550rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.icon-xiugai{font-size: 40rpx;}
.icon-jiahao{color:green;font-size: 40rpx;text-align: center;line-height:70rpx;}
.icon-shanchu{font-size: 50rpx;line-height:70rpx;width:30rpx;}
</style>
