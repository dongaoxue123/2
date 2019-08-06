import React from 'react'
import './style.css'
import { Icon } from 'antd';
import { Card } from 'antd';
import TodayAdminData from './search.js'
import { doGet,doPost } from '../../ulils/api'
import { DatePicker } from 'antd'
import store from '../../store'
import toLogin from '../../ulils/toLogin'
import isLogin from '../../ulils/isLogin'
import moment from 'moment'
function setDate(date) {
  return date > 9 ? date : '0' + date
}
let today = new Date()
let todayDate = today.getFullYear() + '-' + setDate((today.getMonth() + 1)) + '-' + setDate(today.getDate())
class Home extends React.Component { 
  constructor(props) {
  super(props);
  this.state={
    recordNumberCount:'',
    priceCount:'',
    userCount:'',
    adminCount:'',
    adminActiveCount:'',
    oneDayShopList: []
  }
}
callBack = () => {
  this.setState({
    oneDayShopList:[]
  })
  doGet('/api/manage/getTodayAdminCount').then(res => { 
    if (res.data.flag) {
      // console.log(res)
      this.setState({
        recordNumberCount:res.data.data.recordNumberCount,
        priceCount:res.data.data.priceCount,
        userCount:res.data.data.userCount,
        adminCount:res.data.data.adminCount,
        adminActiveCount:res.data.data.adminActiveCount
      })
    } else if (res.data.code === 401) {
      isLogin(this)
    }
    
})
}
onChange = (e, date) =>{
  if (todayDate === date) {
    doGet('/api/manage/getTodayAdminCount').then(res => { 
      if (res.data.flag) {
        // console.log(res)
        this.setState({
          recordNumberCount:res.data.data.recordNumberCount,
          priceCount:res.data.data.priceCount,
          userCount:res.data.data.userCount,
          adminCount:res.data.data.adminCount,
          adminActiveCount:res.data.data.adminActiveCount
        })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
  })
  doPost('/api/manage/getTodayAdminData', {currentPage:0, pageSize:10}).then(res => {
      let shopList = []
      if (res.data.flag) {
        res.data.data.pageContents.forEach((item) => {
          shopList.push({'adminId':item.adminId,
          'shopName':item.shopName,
          'recordNumber':item.recordNumber,
          'price':item.price,
          'isAlive':item.isActive ? '在线' : '离线'})
        }); 
        this.setState({
          oneDayShopList: shopList
        })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
  })
  } else {
    doGet('/api/manage/getOneDayAdminCount',{date: date}).then(res => { 
        if (res.data.flag) {
          this.setState({
            recordNumberCount:res.data.data.recordNumberCount,
            priceCount:res.data.data.priceCount,
            userCount:res.data.data.userCount,
            adminCount:res.data.data.adminCount,
            adminActiveCount:res.data.data.adminActiveCount === null ? 0 : res.data.data.adminActiveCount
          })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
  })
  doPost('/api/manage/getOneDayAdminData', {currentPage:0, pageSize:18, date: date}).then(res => {
      let shopList = [] 
      if (res.data.flag) {
      res.data.data.pageContents.forEach((item) => {
        shopList.push({'adminId':item.adminId,
        'shopName':item.shopName,
        'recordNumber':item.recordNumber,
        'price':item.price,
        'isAlive':item.isActive ? '在线' : '离线'})
      }); 
      this.setState({
        oneDayShopList: shopList
      })
    } else if (res.data.code === 401) {
      isLogin(this)
    }
   })
  }
}
componentWillMount () {
  store.dispatch({type: 'setKey', data: '1'})
}
  componentDidMount () {
    toLogin(this, this.callBack)
}
componentWillUnmount () { 
  this.setState = (state,callback) => {
    return;
  }
}
render(){
    return (
      <div>
        <div>      
        </div>
        <div className="card">
          <Card title="当日总订单" style={{ width: 300 }}>
          <Icon style={{fontSize:"30px"}} type="file-text" /><p style={{fontSize:'40px',textIndent:'30px'}}>{this.state.recordNumberCount}</p>
          </Card>
          <Card title="当日总金额" style={{ width: 300 }}>
          <Icon style={{fontSize:"30px"}} type="pay-circle" /><p style={{fontSize:'40px',textIndent:'30px'}}>{this.state.priceCount}</p>
          </Card>
          <Card title="用户总数" style={{ width: 300 }}>
          <Icon style={{fontSize:"30px"}} type="contacts" /><p style={{fontSize:'40px',textIndent:'30px'}}>{this.state.userCount}</p>
          </Card>
          <Card title="商家总数" style={{ width: 300 }}>
            <span className="shop"><Icon style={{fontSize:"30px"}} type="team" />
              <span><Icon style={{color:'green',fontSize:'18px'}} type="user" />在线 {this.state.adminActiveCount}</span>
            </span>
            <p style={{fontSize:'40px',textIndent:'30px'}}>{this.state.adminCount}</p>
         {/*  */}
         </Card>
        </div>
        <div className="data_choose">
          <DatePicker style={{marginTop:'30px'}} onChange={this.onChange} allowClear={false} defaultValue= {moment(todayDate)} format = 'YYYY-MM-DD'/> 
        </div>
        <TodayAdminData oneDayShopList = {this.state.oneDayShopList} />
        {/* <div className="button"><Button style={{margin:'0 auto'}}>查看更多</Button></div> */}
        </div>
    )}
}
export default Home;