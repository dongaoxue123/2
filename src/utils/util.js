import { getNearByAdmin } from '@/utils/api'
export function setLocation () {
  return new Promise(function (resolve, reject) {
    let markers = []
    let isActive = []
    let distance = []
    let adminId = []
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        getNearByAdmin(latitude, longitude).then(function (res) {
          if (res.flag) {
            // console.log('获取商家位置')
            for (var i = 0; i < res.data.length; i++) {
              isActive.push(res.data[i].isActive)
              distance.push(res.data[i].distance > 9999 ? `${Math.round(res.data[i].distance / 1000) / 10}km` : `${res.data[i].distance}m`)
              adminId.push(res.data[i].admin_id)
              markers.push({
                iconPath: res.data[i].isActive ? '/static/images/logo.png' : '/static/images/glayLogo.png',
                // iconPath: '/static/images/logo.png',
                id: i,
                latitude: res.data[i].latitude,
                longitude: res.data[i].longitude,
                width: 30,
                height: 30,
                zIndex: 1000,
                callout: {
                  content: res.data[i].shop_name,
                  bgColor: '#000',
                  color: '#fff',
                  display: 'BYCLICK',
                  padding: 5
                }
              })
            }
            resolve({ latitude: latitude, longitude: longitude, markers: markers, isActive: isActive, distance: distance, adminId: adminId })
          }
        })
      }
    })
  })
}
