// 选择地理位置
const setLocation = () => {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success (res) {
        console.log(res.authSetting['scope.userLocation'])
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              // 获取经纬度
              wx.chooseLocation({
                success (res) {
                  resolve(res)
                },
                complete () {
                  wx.hideToast()
                }
              })
            },
            fail () {
              // 如果用户拒绝授权则下次调用authorize会直接进入fail回调
              console.log('需要授权当前位置')
              // 让用户打开手动设置
              wx.hideToast()
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({
                      success (res) {
                        console.log('授权成功')
                        wx.showToast({ title: '加载中', icon: 'loading', duration: 3000 })
                        // 手动授权成功后 直接进入地图选择位置
                        wx.chooseLocation({
                          success (res) {
                            resolve(res)
                          },
                          complete () {
                            wx.hideToast()
                          }
                        })
                      },
                      fail (err) {
                        reject(err)
                        console.log('授权失败')
                        wx.hideToast()
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          // 已经授过权，直接调用地图选择位置
          wx.chooseLocation({
            success (res) {
              resolve(res)
            },
            complete () {
              wx.hideToast()
            }
          })
        }
      }
    })
  })
}
// 处理小数运算精度问题
// 匹配两个小数点以内的数字
const isPriceIllegal = function (price) {
  var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  return (!reg.test(price) || price === '')
}
const isNotPrice = function (price) {
  var reg = /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)$/
  return (!reg.test(price) || price === '')
}

// 大于等于一
const isPriceTier = function (price) {
  var reg = /^[1-9]\d*$/
  return (!reg.test(price) || price === '')
}
// 0-1
const isPriceTiertext = function (price) {
  var reg = /^0\.(0[1-9]|[1-9]{1,2})$/
  return (!reg.test(price) || price === '')
}

// 处理获取到的时间，截取月份和日期用于显示
const getDateFormat = function (timeStr) {
  let date = timeStr.split(' ')[0]
  let month = Number(date.split('-')[1])
  let day = Number(date.split('-')[2])
  return month + '月' + day + '日'
}

// 处理获取到的时间，截取分钟和秒数用于显示
const getTimeFormat = function (timeStr) {
  let time = timeStr.split(' ')[1]
  return time.substring(time.indexOf(' ') + 1)
}

export { setLocation, isPriceIllegal, getDateFormat, getTimeFormat, isNotPrice, isPriceTier, isPriceTiertext }
