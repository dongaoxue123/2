import { API_HOST } from '@/utils/config'

// 登陆
const login = () => {
  return new Promise(function (resolve, reject) {
    wx.login({
      success (res) {
        if (res.code) {
          wx.request({
            url: `${API_HOST}/api/admin/login`,
            method: 'GET',
            data: {
              code: res.code
            },
            // 登陆成功，存储返回的adminId
            success (res) {
              resolve(res.data)
            },
            fail (error) {
              reject(error)
            }
          })
        } else {
          // 调用wx.login获取code失败
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  })
}

// 注册
const signin = (userName, passWord, authCode) => {
  return new Promise(function (resolve, reject) {
    wx.login({
      success (res) {
        wx.request({
          url: `${API_HOST}/api/admin/signin`,
          method: 'POST',
          data: {
            adminUsername: userName,
            adminPassword: passWord,
            authCode: authCode,
            code: res.code
          },
          success (res) {
            resolve(res.data)
          },
          fail (error) {
            reject(error)
          }
        })
      }
    })
  })
}

// 商家注册后第一次设置
const firstSetting = (setting) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/firstSetting`,
      method: 'POST',
      data: setting,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 第一次注册判断type
const advertAdminFirstSetting = (settingType) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/advertAdminFirstSetting`,
      method: 'POST',
      data: settingType,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 获取账户信息
const getAccount = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/account/getAccount`,
      method: 'GET',
      data: {
        adminId: adminId
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

// 查询打印记录
const getRecords = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/account/getAdminRecords`,
      method: 'GET',
      data: {
        adminId: adminId
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

// 提现
const cashOut = (adminId, amount, formId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/account/cashOut`,
      method: 'POST',
      data: {
        adminId: adminId,
        amount: amount,
        formId: formId
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

// 查询提现记录
const getTxLogs = (adminId, currentPage, pageSize) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/account/getTxLogs`,
      method: 'POST',
      data: {
        adminId: adminId,
        currentPage: currentPage,
        pageSize: pageSize
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

// 获取商家信息
const getAdminInfo = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getAdminInfo`,
      method: 'GET',
      data: {
        adminId: adminId
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

// 修改商家信息
const changeAdminInfo = (adminInfo) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/changeAdminInfo`,
      method: 'POST',
      data: adminInfo,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 修改单价
const updatePrice = (setting) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updatePrice`,
      method: 'POST',
      data: setting,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
const updatePricetow = (setting) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/v2/updatePrice`,
      method: 'POST',
      data: setting,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 查看价格
const getPrice = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getPrice`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 修改店铺名称
const updateShopName = (adminId, shopName) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updateShopName`,
      method: 'POST',
      data: {
        adminId: adminId,
        shopName: shopName
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
// 修改密码
const updatePassWord = (adminId, adminPassword) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updatePassWord`,
      method: 'POST',
      data: {
        adminId: adminId,
        adminPassword: adminPassword
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
// 修改地理位置
const updateLocation = (adminId, latitude, longitude) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updateLocation`,
      method: 'POST',
      data: {
        adminId: adminId,
        latitude: latitude,
        longitude: longitude
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
// 判断客户端是否在线
const checkIsActive = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/system/adminIsActive`,
      // url: `http://192.168.2.107:8080/api/system/adminIsActive`,
      method: 'GET',
      data: {
        adminId: adminId
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

// 查询数据统计
const getCurrentCount = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getCurrentCount`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 查询新用户激励信息
const getNewUserAward = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getNewUserAward`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 收款记录
const getCollectionRecords = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/findThirtyIncome`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 每天的收款记录
const getDayRecords = (adminId, currentPage, pageSize, date) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getOneDayRecords`,
      method: 'POST',
      data: {
        adminId: adminId,
        currentPage: currentPage,
        pageSize: pageSize,
        date: date
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
// 获取商家打印机
const getAllPrinters = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getAllPrinters`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 修改商家打印机
const updateUsablePrinters = (setting) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updateUsablePrinters`,
      method: 'POST',
      data: setting,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 修改价格梯度
const setPriceGradient = (revise) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/setPriceGradient`,
      method: 'POST',
      data: revise,
      success (res) {
        resolve(res.data)
      },
      fail (error) {
        reject(error)
      }
    })
  })
}
// 查看价格梯度
const getPriceGradient = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getPriceGradient`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 查看未读消息
const getUnreadMsg = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getUnreadMsg`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 标记消息已读
const markAsRead = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/markAsRead`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 是否开启远程打印
const setOpenRemote = (adminId, openRemote) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updateOpenRemote`,
      method: 'POST',
      data: {
        adminId: adminId,
        openRemote: openRemote
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
// 商家查询未完成预约订单
const getRemoteOrders = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getAdminNotCompleteRemoteOrder`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 商家查询已完成预约订单
const getAdminComlateRemoteOrder = (adminId, currentPage, pageSize) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getAdminCompleteRemoteOrder`,
      method: 'POST',
      data: {
        adminId: adminId,
        currentPage: currentPage,
        pageSize: pageSize
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
// 打印
const getPrint = (orderNo) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/remote/doPrint`,
      method: 'GET',
      data: {
        orderNo: orderNo
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
// 查看是否开启远程打印
const getRemoteStatus = (adminId) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/getRemoteStatus`,
      method: 'GET',
      data: {
        adminId: adminId
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
// 修改价格折扣是否开启
const updateHasGradient = (adminId, hasGradient) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${API_HOST}/api/admin/updateHasGradient`,
      method: 'POST',
      data: {
        adminId: adminId,
        hasGradient: hasGradient
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
  login,
  signin,
  firstSetting,
  getAccount,
  getRecords,
  cashOut,
  getTxLogs,
  getAdminInfo,
  changeAdminInfo,
  getCurrentCount,
  getNewUserAward,
  getCollectionRecords,
  getDayRecords,
  updatePrice,
  updateShopName,
  updatePassWord,
  updateLocation,
  getAllPrinters,
  checkIsActive,
  updateUsablePrinters,
  getUnreadMsg,
  markAsRead,
  updatePricetow,
  getPrice,
  setPriceGradient,
  getPriceGradient,
  setOpenRemote,
  getRemoteOrders,
  getPrint,
  getAdminComlateRemoteOrder,
  getRemoteStatus,
  advertAdminFirstSetting,
  updateHasGradient
}
