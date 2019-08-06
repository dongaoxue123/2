import Vue from 'vue'
import Vuex from 'vuex'
import { ADVERT_TYPE } from '@/utils/config'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    adminId: 0,
    // adType: 0,
    isReadMsg: 0,
    isA3: 0,
    isB5: 0,
    shopName: '',
    // 是否是广告商家
    isAdvert: false,
    records: [],
    printHistoryIsRefreshing: false,
    // shopPinter: ['123', '456', '789'],
    // 每一个新用户的奖励金额
    everyNewAward: 0.1,
    // 当前进入的某一天的收款信息 (当天的总金额，笔数，时间)
    incomeInfo: {},
    // 当前进入的某一个订单的详情数据 (1条record)
    pageContent: {},
    // 用户账户信息
    account: {
      balance: 0.0,
      deposit: 0.0,
      cashOutTime: 0
    },
    todayCount: {
      todayIncomeCount: 0,
      todayMoney: 0.0
    },
    adminInfo: {}
  },
  mutations: {
    saveDataAfter: (state, adminType) => {
      state.isAdvert = (adminType === ADVERT_TYPE)
      // console.log('store: ' + state.isAdvert)
    },
    // 只能接收2个参数
    saveDataAfterLogin: (state, {adminId, shopName, everyNewAward, account, todayCount}) => {
      // console.log('shopname设置' + shopName)
      state.adminId = adminId
      state.shopName = shopName === null ? '' : shopName
      state.everyNewAward = everyNewAward
      state.account = account
      state.todayCount = todayCount
    },
    setDataPrice (state, incomeInfo) {
      state.incomeInfo = incomeInfo
    },
    getDataList (state, pageContent) {
      state.pageContent = pageContent
    },
    setReadMsg (state, readMsg) {
      state.isReadMsg = readMsg
    }
  },
  actions: {
  }
})

export default store
