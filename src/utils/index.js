function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export const formatNum = function (num) {
  return (isNaN(parseInt(num)) ? 0 : parseInt(num))
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 解析url中的query参数
export function getQueryString (url, argName) {
  if (url) {
    // 截取问号之前的字符串 结果如 ?adminId=1
    var query = url.substr(url.indexOf('?'))
    // console.log('query' + query)
  } else {
    return null
  }
  let reg = new RegExp('(^|&)' + argName + '=([^&]*)(&|$)')
  if (query) {
    let r = query.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
  }
  return null
}

export function scanQRCode () {
  // console.log('开始扫码')
  wx.scanCode({
    success (res) {
      // res.path 为扫描小程序码得到的路径
      let adminId = getQueryString(res.path, 'adminId')
      if (adminId && adminId > 0) {
        // 进入打印页面
        const url = `/pages/order/main?adminId=${adminId}`
        wx.navigateTo({url})
      } else {
        // 扫码失败
        wx.showToast({ title: '请扫描小程序码', icon: 'none', duration: 2000 })
      }
    }
  })
}
export function selfHelp (type, adminId) {
  const url = `/pages/order/main?type=${type}&adminId=${adminId}`
  wx.navigateTo({url})
}
export function noLink (type, adminId) {
  const url = `/pages/order/main?type=${type}&adminId=${adminId}`
  wx.redirectTo({url})
}
export default {
  formatNumber,
  formatNum,
  formatTime,
  getQueryString,
  scanQRCode,
  selfHelp
}
