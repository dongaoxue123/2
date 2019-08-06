import React from 'react'
import { doPost } from '../../ulils/api'
import './Cashout.css'
import { Table } from 'antd';
import { withRouter } from 'react-router-dom'
import toLogin from '../../ulils/toLogin'
import isLogin from '../../ulils/isLogin'
class WaitSure extends React.Component{
    constructor () {
        super()
        this.state = {
            currentPage:0,
            pageSize:10,
            columns :[
                {
                  title: '提现号',
                  dataIndex: 'txId'
                },
                {
                  title: '商家ID',
                  dataIndex: 'adminId',
                  defaultSortOrder: 'descend'
                },
                {
                  title: '账户名',
                  dataIndex: 'adminUsername'
                },
                {
                  title: '店铺名',
                  dataIndex: 'shopName'
                },
                {
                  title: '提现金额',
                  dataIndex: 'amount',
                  sorter: (a, b) => a.amount - b.amount,
                },
                {
                  title: '提现时间',
                  dataIndex: 'createTime'
                },
                {
                  title: '状态',
                  dataIndex: 'status'
                },
                {
                  title: '操作',
                  dataIndex: 'do',
                  render: () => <button>操作</button>
                }
              ],
              data: []
        }
    }
    onChangeRecord = () => {
        this.props.history.push('/systemAdmin/cashout');
      }
    onChange(pagination) {
      doPost('/api/manage/account/getTxLogByStatus', {status: 0, currentPage:pagination.current - 1, pageSize:10}).then(res => {
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
        doPost('/api/manage/account/getTxLogByStatus', {status: 0, currentPage:this.state.currentPage, pageSize:10}).then(res => {
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
      componentDidMount () {
        toLogin(this, this.callback)
      }
      componentWillUnmount () {
        this.setState = (state,callback)=>{
          return;
        }
      }
      render () {
        return (
          <div>
             <Table columns={this.state.columns} dataSource={this.state.data} onChange={this.onChange} pagination={{pageSize: 10, total: this.state.current}} /> 
             <div style={{textAlign:'center', marginTop: '20px'}}>
               <button className="all-records" onClick={this.onChangeRecord}>所有记录</button>
             </div>
          </div>
      )
      }
}
export default withRouter(WaitSure)