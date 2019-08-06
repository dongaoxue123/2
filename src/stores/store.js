import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userId: 0,
    // ifColor: 1,
    files: [],
    url: '',
    authored: false,
    isPrintStatus: false,
    adminInfo: {},
    orderSum: '0.00',
    records: [],
    bothColor: [],
    printHistoryIsRefreshing: false,
    shopInformation: {shopName: '', distance: '', isActive: '', adminId: 0, longitude: 0, latitude: 0},
    location: {},
    bwPrinter: '',
    colorPrinter: '',
    pageSum: 1,
    pageArr: [],
    offSum: 0,
    nearShop: {},
    flag: false,
    adminId: 0,
    paperObject: {a3: 0, b5: 0}
  },
  mutations: {
    setUserId: (state, userId) => {
      const obj = state
      obj.userId = userId
    },
    setURL: (state, url) => {
      const obj = state
      obj.url = url
    },
    setPrintStatus: (state, status) => {
      state.isPrintStatus = !!status
    },
    getBothColor: (state, orderColors) => {
      // state.bothColor.push(color)
      state.bothColor = orderColors
      // console.log(bothColor)
    },
    // getBlackWhitePrinters: (state, printers) => {
    //   state.blackWhitePrinters = printers
    //   console.log(store.state.blackWhitePrinters)
    // },
    setAdminInfo: (state, info) => {
      state.adminInfo = info
      // console.log(store.state.adminInfo.isColor)
    },
    setNearShop: (state, nearShop) => {
      state.nearShop = nearShop
      // console.log(store.state.adminInfo.isColor)
    },
    setLocation: (state, location) => {
      state.location = location
      // console.log(store.state.adminInfo.isColor)
    },
    setPaperObject: (state, paperObject) => {
      state.paperObject = paperObject
      // console.log(store.state.adminInfo.isColor)
    },
    setAdminId: (state, adminId) => {
      state.adminId = adminId
      // console.log(store.state.adminInfo.isColor)
    },
    // getIsColor: (state, isColor) => {
    //   state.ifColor = isColor
    //   // console.log(store.state.adminInfo.blackWhitePrinters)
    // },
    updateFiles: (state, {index, file}) => {
      state.files[index] = {...file}
      // console.log('有文件更新参数 index: ' + index)
      // console.log(store.state.files[index].color)
    },
    calcOrderSum: (state) => {
      let orderSum = 0
      let pageSum = 0
      state.files.forEach(file => {
        if (file.checked) {
          orderSum += file.fileSum
          pageSum += file.count * file.copies
        }
      })
      state.orderSum = Number(orderSum.toFixed(2))
      state.pageSum = Number(pageSum)
      // console.log(state.pageSum)
      for (let i = 0; i < state.pageArr.length; i++) {
        if (state.pageSum < state.pageArr[i].threshold) {
          if (i === 0) {
            state.flag = false
          } else {
            state.flag = true
            state.offSum = (state.orderSum * 1000 * state.pageArr[i - 1].discount / 1000).toFixed(2)
          }
          break
        }
        state.flag = true
        state.offSum = (state.orderSum * 1000 * state.pageArr[i].discount / 1000).toFixed(2)
      }
      // if (state.pageSum >= state.pageArr[0].threshold) {
      //   state.offSum = state.orderSum * 1000 * state.pageArr[0].discount / 1000/
      // }
    },
    setShopInformation (state, {shopName, distance, isActive, adminId, longitude, latitude}) {
      state.shopInformation.shopName = shopName
      state.shopInformation.distance = distance
      state.shopInformation.isActive = isActive
      state.shopInformation.adminId = adminId
      state.shopInformation.longitude = longitude
      state.shopInformation.latitude = latitude
    },
    setPrinter: (state, {bwPrinter, colorPrinter}) => {
      state.bwPrinter = bwPrinter
      state.colorPrinter = colorPrinter
    },
    setOffArr: (state, arr) => {
      state.pageArr = [...arr]
    }
  },
  actions: {
  }
})

export default store
