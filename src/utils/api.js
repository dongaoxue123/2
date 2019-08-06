import { API_HOST } from '@/utils/config'
import store from '@/stores/store'

const deleteFile = (userId, fileId) => {
  return new Promise(function (resolve, reject) {
    wx.showToast({ title: '删除中', icon: 'loading', duration: 20000 })
    wx.request({
      url: `${API_HOST}/api/deleteFile`,
      data: {
        userId,
        fileId
      },
      success (res) {
        if (res.data.flag) {
          store.state.files = store.state.files.filter((file) => file.fileId !== fileId)
          wx.showToast({ title: '删除成功', icon: 'success', duration: 1500 })
        } else {
          wx.showToast({ title: '删除失败', icon: 'none', duration: 1500 })
        }
        resolve(res.data)
      },
      fail (error) {
        reject(error)
        wx.showToast({ title: '删除失败', icon: 'none', duration: 1500 })
      },
      complete () {
        wx.hideToast()
      }
    })
  })
}
const getRecords = (currentPage, pageSize = 10) => {
  return new Promise(function (resolve, reject) {
    // wx.showToast({ title: '', icon: 'loading', duration: 20000 })
    wx.request({
      url: `${API_HOST}/api/getRecords`,
      method: 'POST',
      data: {
        userId: store.state.userId,
        currentPage,
        pageSize
      },
      success (res) {
        resolve(res.data)
        if (res.data.flag) {
          // store.state.records = res.data.data
        } else {
          console.log('获取打印记录失败')
          wx.showToast({ title: '获取打印记录失败: ' + res.data.message, icon: 'none', duration: 2000 })
        }
      },
      fail (error) {
        reject(error)
        wx.showToast({ title: '删除失败', icon: 'none', duration: 1500 })
      },
      complete () {
        wx.hideToast()
      }
    })
  })
}

// 发送打印信息到后台 生成订单
function createOrder (adminId, printOrders, printType, formId, phone, remark) {
  wx.request({
    url: `${API_HOST}/api/createOrder`,
    // url: 'http://192.168.2.116:8080/api/createOrder',
    method: 'POST',
    // test data
    data: {
      adminId,
      userId: store.state.userId,
      type: 1,
      printOrders,
      printType,
      formId,
      phone,
      remark
    },
    success (res) {
      if (res.data.flag) {
        console.log(res.data)
        // 调起支付
        doPay(res.data.data, printOrders)
      } else {
        console.log('支付失败')
        wx.showToast({ title: '下单失败: ' + res.data.message, icon: 'none', duration: 2000 })
      }
    }
  })
}

// 拉起收银台
function doPay (data, printOrders) {
  // console.log(printOrders[index])
  wx.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.package,
    signType: data.signType,
    paySign: data.paySign,
    success (res) {
      console.log('支付成功')
      // 遍历文件列表并删除支付成功的文件
      let orderColors = []
      for (let index in printOrders) {
        store.state.files = store.state.files.filter((file) => file.fileId !== printOrders[index].fileId)
        orderColors.push(printOrders[index].color)
        // console.log(store.state.bothColor)
      }
      store.commit('getBothColor', orderColors)
      // 跳到打印成功页面
      wx.navigateTo({url: '/pages/printSuccess/main'})
    },
    fail (res) {
      console.log('支付失败')
    }
  })
}

// 用户授权
function doAuth (data, callback) {
  // console.dir(data)
  wx.request({
    url: `${API_HOST}/api/auth`,
    method: 'POST',
    // test data
    data: data,
    success (res) {
      typeof callback === 'function' && callback(res.data)
    }
  })
}

// 获取商家信息
const getAdminInfo = adminId => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/getAdminInfo`,
      // url: 'http://192.168.2.113:8080/api/getAdminInfo',
      data: {
        adminId
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
function getClipboardData (d) {
  wx.setClipboardData({
    data: d,
    success (res) {
      wx.getClipboardData({
        success (res) {
          console.log(res.data) // data
        }
      })
    }
  })
}
// 附近商家位置
const getNearByAdmin = (userLatitude, userLongitude) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/getNearByAdmin`,
      method: 'POST',
      data: {
        userLatitude,
        userLongitude
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 最近商家
const getRecentAdmin = (userLatitude, userLongitude) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/getRecentAdmin`,
      // url: `http://192.168.2.121:8080/api/getRecentAdmin`,
      method: 'POST',
      data: {
        userLatitude,
        userLongitude
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 商家详情页
const getAdminDetailedInfo = adminId => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/getAdminDetailedInfo`,
      method: 'GET',
      data: {
        adminId
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 用户获取价格梯度
const getPriceGradient = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/getPriceGradient`,
      // url: `http://192.168.2.114:8080/api/getPriceGradient`,
      method: 'GET',
      data: {
        userId: store.state.userId,
        adminId
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 用户查询预约订单
const getUserRemoteOrder = (userId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/remote/getUserRemoteOrder`,
      // url: `http://192.168.2.114:8080/api/remote/getUserRemoteOrder`,
      method: 'GET',
      data: {
        userId
      },
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
export {
  deleteFile,
  getRecords,
  createOrder,
  getAdminInfo,
  doAuth,
  getClipboardData,
  getNearByAdmin,
  getRecentAdmin,
  getAdminDetailedInfo,
  getPriceGradient,
  getUserRemoteOrder
}
