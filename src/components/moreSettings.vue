<template>
  <section class="settings">
    <van-popup :show="show" position="bottom" @close="closePopup">
      <div class="more-settings-pop">
        <h1 style="padding: 0;font-size: 40rpx;">打印设置-更多设置</h1>
        <!-- color Orientation Scaling 值 与 开发任务 打印参数 匹配 -->
        <!-- 颜色设置 -->
        <div class="color">
          <h1>颜色</h1>
          <van-radio-group :value="radioColor" @change="onChange" data-color>
            <van-row>
              <van-col span="5">
                <van-radio name="0" :checkedColor="checkedColor"><span>黑白</span></van-radio>
              </van-col>
              <van-col span="5" offset="7">
                <van-radio name="1" :checkedColor="checkedColor" :disabled="disabled"><span>彩印</span></van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </div>
        <!-- 缩印设置 -->
        <div class="Scaling">
          <h1>缩印</h1>
          <van-radio-group :value="radioScaling" @change="onChange" data-scaling>
            <van-row>
              <van-col span="6">
                <van-radio name="0" :checkedColor="checkedColor"><span>一合一</span></van-radio>
              </van-col>
              <van-col span="6">
                <van-radio name="1" :checkedColor="checkedColor"><span>二合一</span></van-radio>
              </van-col>
              <van-col span="6">
                <van-radio name="2" :checkedColor="checkedColor"><span>四合一</span></van-radio>
              </van-col>
              <van-col span="6">
                <van-radio name="3" :checkedColor="checkedColor"><span>六合一</span></van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </div>
        <!-- 纸张设置 -->
        <div class="Paper" v-if="paper">
          <h1>纸张</h1>
          <van-radio-group :value="radioPaper" @change="onChange" data-paper>
            <van-row>
              <van-col span="6">
                <van-radio name="0" :checkedColor="checkedColor"><span>A4</span></van-radio>
              </van-col>
              <van-col span="6">
                <van-radio name="1" :checkedColor="checkedColor" :disabled="isA3"><span>A3</span></van-radio>
              </van-col>
              <van-col span="6">
                <van-radio name="2" :checkedColor="checkedColor" :disabled="isB5"><span>B5</span></van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </div>
        <!-- 方向设置 -->
        <div class="Orientation">
          <h1>方向</h1>
          <van-radio-group :value="radioOrientation" @change="onChange" data-orientation>
            <van-row>
              <van-col span="5">
                <van-radio name="0" :checkedColor="checkedColor"><span>纵向</span></van-radio>
              </van-col>
              <van-col span="5" offset="7">
                <van-radio name="1" :checkedColor="checkedColor"><span>横向</span></van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </div>
        <!-- 确认设置 -->
        <div class="confirm" @click="clickConfirmed">
          <button type="default" hover-class="button-hover" hover-stay-time="100">确认</button>
        </div>
      </div>
    </van-popup>
  </section>
</template>
<script>
/**
 * 更多设置组件
 * 1. 颜色
 *    黑白    彩印
 * 2. 缩印
 *    一合一  二合一  四合一 六合一
 * 3. 方向
 *    纵向    横向
 */
import { themeColor } from '@/utils/config'
import store from '@/stores/store'
export default {
  props: ['show'],
  data () {
    return {
      show: false,
      // disabled: true,
      checkedColor: themeColor,
      radioColor: '1',
      radioPaper: '1',
      radioScaling: '1',
      radioOrientation: '1',
      fileName: ''
    }
  },
  // mounted () {
  //   console.log(store.state.adminInfo.isColor)
  // },
  computed: {
    disabled: function () {
      return store.state.adminInfo.isColor === 0
    },
    isA3: function () {
      return store.state.adminInfo.isA3 === 0
    },
    isB5: function () {
      return store.state.adminInfo.isB5 === 0
    },
    paper: function () {
      return store.state.adminInfo.isA3 === 1 || store.state.adminInfo.isB5 === 1
    }
  },
  methods: {
    // disabled () {
    //   // console.log(store.state.ifColor)
    //   return store.state.adminInfo.isColor === 1
    // },
    closePopup () {
      // 点击蒙层给父组件发送关闭消息
      this.$emit('hide', false)
    },
    changeData (color, scaling, orientation, paperSize) {
      this.$data.radioColor = String(color)
      this.$data.radioScaling = String(scaling)
      this.$data.radioPaper = String(paperSize)
      this.$data.radioOrientation = String(orientation)
    },
    receiveFileName (fileName) {
      this.$data.fileName = fileName
    },
    // 当绑定值改变时触发的事件
    onChange (e) {
      let flag = true
      let fileSuffix = this.fileName.substring(this.fileName.lastIndexOf('.') + 1)
      // console.log(fileSuffix)
      switch (flag) {
        case e.target.dataset['color']:
        {
          this.$data.radioColor = e.target[0]
          // console.log('color' + e.target[0])
          break
        }
        case e.target.dataset['scaling']:
        {
          this.$data.radioScaling = e.target[0]
          let isppt = (fileSuffix === 'ppt' || fileSuffix === 'pptx')
          if (isppt) {
            // ppt四合一和一合一横向      其他纵向
            this.$data.radioOrientation = e.target[0] === '0' || e.target[0] === '2' ? '1' : '0'
            // console.log('方向' + this.$data.radioOrientation)
          } else {
            // 其他文件四合一和一合一纵向   其他横向
            this.$data.radioOrientation = e.target[0] === '0' || e.target[0] === '2' ? '0' : '1'
          }
          // console.log('daozhe')
          break
        }
        case e.target.dataset['paper']:
        {
          this.$data.radioPaper = e.target[0]
          break
        }
        case e.target.dataset['orientation']:
        {
          this.$data.radioOrientation = e.target[0]
          break
        }
      }
      // console.log(this.radioPaper)
    },
    // 用户点击确认触发的事件
    clickConfirmed (e) {
      let settings = {color: Number(this.radioColor), scaling: Number(this.radioScaling), paperSize: Number(this.radioPaper), orientation: Number(this.radioOrientation)}
      // 子组件给父组件传递打印参数 和 关闭弹层消息
      this.$emit('setConfirmed', settings)
      this.$emit('hide', false)
      if (store.state.paperObject.a3 === 0 && Number(this.radioPaper) === 1) {
        if (store.state.paperObject.b5 === 0) {
          store.commit('setPaperObject', {a3: 1, b5: 0})
        } else {
          store.commit('setPaperObject', {a3: 1, b5: 1})
        }
        wx.showModal({
          title: '提示',
          content: '请向商家确认该打印机是否支持A3打印',
          showCancel: false,
          confirmText: '知道了'
        })
      }
      if (store.state.paperObject.b5 === 0 && Number(this.radioPaper) === 2) {
        if (store.state.paperObject.a3 === 0) {
          store.commit('setPaperObject', {a3: 0, b5: 1})
        } else {
          store.commit('setPaperObject', {a3: 1, b5: 1})
        }
        wx.showModal({
          title: '提示',
          content: '请向商家确认该打印机是否支持A3打印',
          showCancel: false,
          confirmText: '知道了'
        })
      }
      // if (Number(this.radioPaper) !== 0) {
      //   wx.showModal({
      //     title: '提示',
      //     content: `请向商家确认该打印机是否支持${Number(this.radioPaper) === 1 ? 'A3' : 'B5'}打印`,
      //     showCancel: false,
      //     confirmText: '知道了'
      //   })
      // }
    }
  }
}
</script>
<style scoped>
.settings{
  z-index:150;
}
span {
  font-size: 34rpx;
}
h1 {
  padding: 20px 0 10px;
}
.confirm {
  padding: 20px 0 0;
}
.more-settings-pop {
  padding: 10px;
}
.button-hover {
  color: #07C160;
}
button {
  border: 4rpx solid #07C160;
  margin: 20rpx 20rpx;
  background-color: white;
}
</style>
