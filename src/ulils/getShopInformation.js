import { doPost } from './api'
import store from '../store'
import isLogin from './isLogin'
function addShopList(shopList) {
  return {
      type: 'shopList',
      dataList: shopList
  }
}
 function getShopInformation () {
  return doPost('/api/manage/getTodayAdminData', {currentPage:0, pageSize:10}).then(res => {
    // console.log(res)
      let shopList = {dataShopList:[],totalLine:''}
      if (res.data.flag) {
      res.data.data.pageContents.forEach((item) => {
        shopList.dataShopList.push({
          'adminId':item.adminId,
          'shopName':item.shopName,
          'recordNumber':item.recordNumber,
          'price':item.price,
          'isAlive':item.isActive ? '在线' : '离线'})
        }); 
        shopList.totalLine = res.data.data.totalLine
        store.dispatch(addShopList(shopList))
        // console.log(shopList.dataShopList[0].adminId)
        store.dispatch({type: 'set', adminId: shopList.dataShopList[0].adminId})
      // console.log(store.getState())
    } else if (res.data.code === 401) {
      isLogin(this)
    }
})
}
export default getShopInformation