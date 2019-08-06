<template>
  <div class="data-page">
    <cashout></cashout>
  </div>
</template>

<script>
// import store from '@/stores/store'
import cashout from '@/components/cashout'
export default {
  data () {
    return {
    }
  },
  onShow () {
    // console.log(store.state)
  },
  components: {
    cashout
  },
  methods: {
    showData () {
      console.log(this.$data)
    }
  }
}
</script>

<style>
  .data-page {
    height: 100vh;
    padding: 20rpx;
    background: #ededed;
  }
</style>
