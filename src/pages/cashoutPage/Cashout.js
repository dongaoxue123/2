import React from 'react'
import { doPost } from '../../ulils/api'
import './Cashout.css'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'
import store from '../../store'
import toLogin from '../../ulils/toLogin'
import isLogin from '../../ulils/isLogin'
class Cashout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:0,
      pageSize:10,
      columns :[
      {
        title: '提现号',
        dataIndex: 'txId',
        key: 'txId',
        sorter: (a, b) => a.txId - b.txId
      },
      {
        title: '商家ID',
        dataIndex: 'adminId',
        key: 'adminId',
        defaultSortOrder: 'descend'
      },
      {
        title: '账户名',
        dataIndex: 'adminUsername',
        key: 'adminUsername'
      },
      {
        title: '店铺名',
        dataIndex: 'shopName',
        key: 'shopName'
      },
      {
        title: '提现金额',
        dataIndex: 'amount',
        key: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '提现时间',
        dataIndex: 'createTime',
        key: 'createTime'
      }
    ],
    data: []
  };
  }
  onChangeRecord = () => {
    this.props.history.push('/systemAdmin/waitSure');
  }
  onChange = (pagination) =>{
    doPost('/api/manage/account/getTxLogByStatus', {status: 1, currentPage:pagination.current - 1, pageSize:10}).then(res => {
      // console.log(res)
      if (res.data.flag) {
        let dataList = []
        res.data.data.pageContents.forEach((item) => {
          dataList.push({'txId':item.accountLog.txId,
          'adminId':item.accountLog.adminId,
          'adminUsername':item.adminUsername,
          'shopName':item.shopName,
          'amount':item.accountLog.amount,
          'createTime':item.accountLog.createTime})
        }); 
        this.setState({ 
          data: dataList,
          current:res.data.data.totalLine
        })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
  })
  }
  callback = () => {
    doPost('/api/manage/account/getTxLogByStatus', {status: 1, currentPage:this.state.currentPage, pageSize:10}).then(res => {
      // console.log(res)
      if (res.data.flag) {
        let dataList = []
        res.data.data.pageContents.forEach((item) => {
          dataList.push({'txId':item.accountLog.txId,
          'adminId':item.accountLog.adminId,
          'adminUsername':item.adminUsername,
          'shopName':item.shopName,
          'amount':item.accountLog.amount,
          'createTime':item.accountLog.createTime})
        }); 
        this.setState({ 
          data: dataList,
          current:res.data.data.totalLine
        })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
  })
  }
  componentWillMount () {
    store.dispatch({type: 'setKey', data: '2'})
  }
  componentDidMount () {
    toLogin(this, this.callback)
  // console.log(shopList)
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
  }
  render () {
    return (
      <div>
         <Table columns={this.state.columns} dataSource={this.state.data} rowKey={(record, index) => `complete${record.id}${index}`} onChange={this.onChange} pagination={{pageSize: 10, total: this.state.current}} /> 
         <div style={{textAlign:'right', marginRight: '10%'}}>
           {/* <button className="all-records" onClick={this.onChangeRecord}>待确认</button> */}
         </div>
      </div>
    )
  }
}
export default withRouter(Cashout);
