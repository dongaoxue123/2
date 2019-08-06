<template>
  <section class="flex file" :class="config.isPrintStatus ? 'is-print' : ''">
    <span class="headernumber" v-if="config.isPrintStatus">{{number}}.</span>
    <van-checkbox
      :name="file.key"
      class="flex file-checkbox"
      shape="round"
      :checkedColor="checkedColor"
      v-model="file.checked"
      :value="checked"
      @change="changeFileChecked"
      v-if="config.isPrintStatus"
    />
    <!-- 文件类型图标 -->
    <span class="iconfont flex file-type" @click="changeFileChecked" :class="{ 'icon-pdf': pdfIcon, 'icon-word': wordIcon, 'icon-excel': excelIcon, 'icon-ppt': pptIcon, 'icon-img': imgIcon }"></span>
    <!-- 文件信息 -->
    <div class="file-info">
      <h2 class="file-info-name" @click="preview" :class="config.isPrintStatus ? 'is-print' : ''" v-if="!config.isPrintStatus">{{file.fileName}}</h2>
      <h2 class="file-info-name" @click="changeFileChecked" :class="config.isPrintStatus ? 'is-print' : ''" v-if="config.isPrintStatus">{{file.fileName}}</h2>
      <van-row v-if="!config.isPrintStatus">
        <van-col span="6"><span>{{convertFileTotalPage}}</span></van-col>
        <van-col span="6"><span>{{convertFileSize}}</span></van-col>
      </van-row>
      <!-- <div class="file-info-count"> -->
      <fileCount :count="file.copies" :getCount="getFileCount" minCount='1' v-if="config.isPrintStatus">份数</fileCount>
      <filePageNum :count="file.count" :startPage="file.startPage" :getPageNum="getFilePageNum" :totalPage="file.totalPage" v-if="config.isPrintStatus">页码</filePageNum>
      <!-- </div> -->
      <van-row>
        <van-radio-group :value="radioName" @change="togglePageSet" v-if="config.isPrintStatus">
          <van-col span="6">
            <span>单面</span>
          </van-col>
          <van-col span="5">
            <van-radio :color="checkedColor" :custom-style="fileIconStyle" name="0"/>
          </van-col>
          <van-col span="6">
            <span>双面</span>
          </van-col>
          <van-col span="6">
            <van-radio :color="checkedColor" :custom-style="fileIconStyle" name="1"/>
          </van-col>
        </van-radio-group>
      </van-row>
      <!-- 更多设置参数 -->
      <div class="rowStyle">
        <van-row v-if="config.isPrintStatus">
          <van-col span="7"> {{convertFileColor}}</van-col>
          <van-col span="9.5">{{convertFileOrientation}}</van-col>
          <van-col span="7">{{convertFileScaling}}</van-col>
        </van-row>
      </div>
    </div>
    <!-- 文件预览和删除 -->
    <div class="file-right">
      <van-icon
        name="browsing-history-o"
        size="60rpx"
        class="flex"
        :custom-style="fileIconStyle"
        @click="preview"
      />
      <van-icon
        name="delete"
        size="50rpx"
        class="flex"
        key="this.file.fileId"
        :custom-style="fileIconStyle"
        @click="deleteFile"
      />
      <!-- 更多设置按钮 -->
      <div class="flex more-set" @click="openPrintSetDialog" v-if="config.isPrintStatus">
        <button type="mini" hover-class="button-hover" hover-stay-time="100">更多设置</button>
      </div>
      <!-- <van-icon
        size="40rpx"
        class="flex"
        v-if="config.isPrintStatus"
      /> -->

      <!-- <van-icon
        name="setting-o"
        size="50rpx"
        class="flex"
        :custom-style="fileIconStyle"
        @click="openPrintSetDialog"
        v-if="config.isPrintStatus"
      /> -->
    </div>
  </section>
</template>

<script>
/**
 * 文件组件
 * 1. 查看状态
 * 2. 待打印状态
 * 功能：
 * 1. 预览
 * 2. 删除文件
 * 3. 显示文件信息
 * 4. 打印设置
 */
import store from '@/stores/store'
import { deleteFile } from '@/utils/api'
import fileCount from '@/components/fileCount'
import filePageNum from '@/components/filePageNum'
import { themeColor } from '@/utils/config'

export default {
  props: [ 'file', 'index', 'config', 'moreSet', 'openPopup' ],
  components: {
    fileCount,
    filePageNum
  },
  data () {
    this.initFileData(this.file)
    return {
      fileIconStyle: `display: flex;flex-grow: 1;justify-content: center;align-items: center;`,
      checked: this.checked || false,
      _checkedColor: themeColor,
      // radioCheck: true,
      radioName: '0',
      get checkedColor () {
        return this._checkedColor
      },
      set checkedColor (value) {
        this._checkedColor = value
      }
    }
  },
  mounted: function () {
    this.radioName = this.file.duplexMode === 0 ? '0' : '1'
    let suffix = this.file.fileName.substring(this.file.fileName.lastIndexOf('.') + 1)
    if ((suffix === 'ppt' || suffix === 'pptx') && this.file.scaling === 0) {
      this.file.orientation = 1
    }
    // console.log('file组件渲染')
    // 防止新上传的文件被选中却不计算金额，将新渲染的文件组件参数更新到store
    this.coverFileProps()
  },
  computed: {
    suffix: function () {
      // console.log('当前传入文件名' + this.file.fileName)
      return this.file.fileName.substring(this.file.fileName.lastIndexOf('.') + 1)
    },
    pdfIcon: function () {
      return this.suffix === 'pdf'
    },
    wordIcon: function () {
      return this.suffix === 'doc' || this.suffix === 'docx'
    },
    pptIcon: function () {
      return this.suffix === 'ppt' || this.suffix === 'pptx'
    },
    excelIcon: function () {
      return this.suffix === 'xls' || this.suffix === 'xlsx'
    },
    imgIcon: function () {
      return this.suffix === 'jpg' || this.suffix === 'jpeg' || this.suffix === 'png'
    },
    convertFileSize: function () {
      let fileSize = this.file.fileSize
      return fileSize > 999 ? (fileSize / 1024).toFixed(1) + 'MB' : fileSize + 'KB'
    },
    convertFileTotalPage: function () {
      return this.file.totalPage + '页'
    },
    convertFileColor: function () {
      return this.file.color === 0 ? '黑白' : '彩印'
    },
    convertFileOrientation: function () {
      // 注意：如果要增加合一 需要修改这里
      return this.file.scaling === 0 ? '一合一' : this.file.scaling === 1 ? '二合一' : this.file.scaling === 2 ? '四合一' : '六合一'
    },
    convertFileScaling: function () {
      return this.file.orientation === 0 ? '纵向' : '横向'
    },
    number: function () {
      // console.log(this.index)
      return this.index + 1
    }
  },
  methods: {
    initFileData (file) {
      let count = file.count || file.totalPage
      let printSet = {
        checked: false,
        duplexMode: 0,
        copies: 1,
        startPage: 1,
        count,
        color: 0,
        paperSize: 0,
        orientation: 0,
        scaling: 0
      }
      this.file = Object.assign(printSet, file)
      this.checked = file.checked
      // console.log('--file', JSON.stringify(file))
    },
    updatePrintSet (set) {
      // console.log('用户更新了打印参数，兄弟组件也更新一下')
      this.file = {...this.file, ...set}
      // 更多设置发生修改，同步到store中，并重新计算金额
      this.coverFileProps()
    },
    changeFileChecked () {
      this.checked = !this.checked
      this.file.checked = !this.file.checked
      this.coverFileProps()
      // console.log(store.state.pageSum)
    },
    getFileCount (count) {
      this.file.copies = count
      this.coverFileProps()
    },
    getFilePageNum (start, end) {
      this.file.startPage = start
      // this.file.endPage = end
      this.file.count = end - start + 1
      this.coverFileProps()
    },
    togglePageSet (e) {
      this.file.duplexMode = Number(e.mp.detail)
      this.radioName = e.mp.detail
      this.coverFileProps()
    },
    preview () {
      let self = this
      const fsm = wx.getFileSystemManager()
      wx.showLoading({ title: '加载中', icon: 'loading', duration: 20000, mask: 'true' })
      const filePath = mpvue.getStorageSync(String(self.file.fileId))
      if (filePath) {
        fsm.access({
          'path': filePath,
          success (res) {
            // console.log(res)
            wx.openDocument({
              filePath,
              success (res) {
                // console.log('缓存预览成功')
                wx.hideLoading()
              },
              // 打开文档失败则从服务器下载：可能是临时路径还存在缓存，但是文件已经失效
              fail (res) {
                // console.dir(res)
                // 这里不能用 this.$options
                self.downloadBeforePreview()
              }
            })
          },
          fail (res) {
            self.downloadBeforePreview()
          }
        })
      } else {
        self.downloadBeforePreview()
      }
    },
    // 从服务器下载
    downloadBeforePreview () {
      // 这里用this.file获取不到文件属性
      let self = this
      wx.downloadFile({
        url: store.state.url + '/preview/' + self.file.previewPath,
        success (res) {
          // 关闭加载框
          wx.hideLoading()
          const filePath = res.tempFilePath
          // 打开文档进行预览
          wx.openDocument({
            filePath,
            success (res) {
              // 保存临时路径到缓存
              mpvue.setStorageSync(String(self.file.fileId), filePath)
            },
            fail (res) {
              console.dir(res)
              console.log('再次失败')
            }
          })
        },
        fail () {
          console.log('失败')
          wx.hideLoading()
          wx.showToast({ title: '预览失败', icon: 'none', duration: 2000 })
        }
      })
    },
    deleteFile () {
      let self = this
      self.file.isDeleting = true
      wx.showModal({
        content: '确定删除文件吗？',
        confirmColor: '#1989fa',
        success: function (res) {
          if (res.confirm) {
            store.state.orderSum = 0
            store.commit('calcOrderSum')
            deleteFile(store.state.userId, self.file.fileId).then(res => {
              if (res.flag) {
                // 删除文件时重新计算价格
                store.commit('calcOrderSum')
              }
            })
          } else if (res.cancel) {
            // console.log('取消删除')
          }
        },
        fail: function () {
          console.debug('删除文件，调用确认dialog失败')
        }
      })
    },
    // 点击图标，打开弹层，传递初始打印参数给弹层用来显示
    openPrintSetDialog () {
      // console.log('设置' + this.file.fileName + '的更多打印参数')
      // 调用父组件的方法
      this.openPopup(true, this.file.fileId, this.file.fileName, this.file.color, this.file.scaling, this.file.paperSize, this.file.orientation)
    },
    coverFileProps () {
      if (this.index == null) return false
      // this.file = {...this.file, ...this.file}
      this.file.fileSum = this.calcFileSum(this.file)
      // console.log(JSON.stringify(this.file, '', 2))
      store.commit('updateFiles', {file: this.file, index: this.index})
      // store.commit('getBothColor', this.file.color)
      // console.log(store.state.bothColor)
      // 更新总金额
      store.commit('calcOrderSum')
    },
    calcFileSum (file) {
      var colorArr = [ 'blackWhite', 'color' ]
      var paperColorArr = [ 'BlackWhite', 'Color' ]
      var duplexModeArr = [ 'Single', 'Duplex' ]
      var paperArr = [ 'a3', 'b5' ]
      var scaleArr = [ 1, 2, 4, 6, 8 ]
      let price
      if (file.paperSize !== 0) {
        price = store.state.adminInfo[`${paperArr[file.paperSize - 1]}${paperColorArr[file.color]}${duplexModeArr[file.duplexMode]}Price`]
      } else {
        price = store.state.adminInfo[`${colorArr[file.color]}${duplexModeArr[file.duplexMode]}Price`]
      }
      // 当前文件打印价格
      return Math.ceil(file.count / (scaleArr[file.scaling] * (Number(file.duplexMode) + 1))) * price * Number(file.copies)
    }
  }
}
</script>

<style scoped lang="postcss">
.file {
  padding: 30rpx 20rpx;
  font-size: 30rpx;
  border-bottom: 1rpx solid rgb(220, 220, 220);
  background-color: white;
}
.file-checkbox {
  align-items: center;
}
.file-type {
  flex-basis: 220rpx;
  justify-content: space-between;
  text-align: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}
.file-info {
  flex-grow: 1;
  color: #999;
  margin: 0rpx 20rpx;
  width: 700rpx;
  overflow: hidden;
  font-size: 30rpx;
}
.file-info-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 38rpx;
  color: rgb(0,0,0);
  margin-bottom: 30rpx;
}
.file-info-name.is-print {
  margin-bottom: 20rpx;
}
.file-right {
  flex-basis: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.file.is-print .file-right {
  flex-basis: 150rpx;
} 
.file.is-print .radio-group radio {
  transform: scale(0.8);
}
.file.is-print .radio-group span {
  display: flex;
  padding-top: 2px;
}
.button-hover {
  color: #07C160;
  border: 1rpx solid #07C160;
}
button {
  border: 1rpx solid #000;
  background-color: white;
  /* display: inline-block; */
  font-size: 24rpx;
  padding: 0;
  margin: 0;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  width: 110rpx;
  height: 60rpx;
}
.rowStyle {
  margin-top: 16rpx;
}
.more-set {
  margin-bottom: 40rpx;
}
.headernumber{
  font-size: 18px;
  /* font-family: 'Courier New', Courier, monospace; */
  color: #333;
  font-weight: 600;
  /* text-shadow:1px 1px 1px #333; */
  margin-top:4px;
}
/* 引入icon样式 */
.iconfont {font-size: 90rpx;}
.icon-pdf {color: #d24625;}
.icon-word {color: #3a80fc;}
.icon-excel {color: #00b26a;}
.icon-ppt {color: #fbb03b;}
.icon-img {color: #74B3F8;}

</style>
