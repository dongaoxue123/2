<template>
  <div>
    <div class="set_valueblock">
    <van-cell size="large" title="阈值" is-link :value="amountValue" @click="showPopup" />
    </div>
    <van-popup class="pop" :show="isPopupShow" @close="onClose" custom-style="padding:30px;height:200px;width:300px">
        <div class="input_value">
        <van-field
          :value="popValue"
          placeholder="请输入阈值"
          border="false"
          @change="onChange"
          class="input"
          size="large"
        />
        </div>
        <div class="but"><button class="cannel" @click="cannelPop">取消</button><button class="save" @click="setValue">保存</button></div>
    </van-popup>
  </div>
</template>
<script>
export default {
  data () {
    return {
      amountValue: '0元',
      isPopupShow: false,
      popValue: 0
    }
  },
  methods: {
    showPopup () {
      this.isPopupShow = true
    },
    onClose () {
      this.isPopupShow = false
    },
    cannelPop () {
      this.isPopupShow = false
      this.amountValue = this.popValue
    },
    onChange (event) {
      this.popValue = event.mp.detail
    },
    setValue () {
      this.isPopupShow = false
      this.amountValue = this.popValue
    }
  }
}
</script>
<style>
page{
  background: #eee
}
.set{
  width: 20px;
  height: 14px;
}
.pop{
  padding: 20px;
}
.save{
  background: green;
  width:60px;
  height:30px;
  color: #eee;
  font-size: 12px;
  line-height: 30px;
  margin: 0;
  text-align: center;
  padding: 0;
}
.cannel{
  width:60px;
  height:30px;
  font-size: 12px;
  line-height: 30px;
  margin: 0;
  text-align: center;
  padding: 0;
}
.but{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  border: 1px solid #fff;
}
.group{
  background: #eee;
}
.input{
  width: 100%;
}
.input_value {
  border: 1px solid #eee;
}
.set_valueblock{
  margin-top: 10px;
}
</style>

