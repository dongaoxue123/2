import React from 'react'
// import ListGroup from 'react-bootstrap/ListGroup'
import 'bootstrap/dist/css/bootstrap.css'
import { withRouter } from 'react-router-dom'
import { doGet } from '../../ulils/api'
import store from '../../store'
import toLogin from '../../ulils/toLogin'
import isLogin from '../../ulils/isLogin'
import { Button } from 'antd'
import './style.css'
import { Select } from 'antd'
const { Option } = Select;
let num, type
class Generate extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      code:'',
      codes:'',
      codess:'',
      codesss:'',
      codessss:'',
      shopNumber: '商家'
    }
  }
  getTypeGet () {
    doGet('/api/manage/getAuthCodeByType',{num:num,type:type}).then(res => {
      if (res.data.flag) {
        // console.log(res)
        this.setState({
          code:res.data.data.authCode,
          codes:'',
          codess:'',
          codesss:'',
          codessss:''
        })
      } else if (res.data.code === 401) {
        isLogin(this)
      }
    })
  }
  getTypeGetFive () {
    doGet('/api/manage/getAuthCodeByType',{num:num,type:type}).then(res => {
      if (res.data.flag) {
          this.setState({
            code:res.data.data.authCode[0],
            codes:res.data.data.authCode[1],
            codess:res.data.data.authCode[2],
            codesss:res.data.data.authCode[3],
            codessss:res.data.data.authCode[4]
          })
        } else if (res.data.code === 401) {
          isLogin(this)
        }
    })    
  }
  handleChange=(value)=> {
    this.setState({
      shopNumber: value
    })
  }
  oneCode = () => {
    console.log(this.state.shopNumber)
    if (this.state.shopNumber==='商家') {
      this.getTypeGet (num=1,type=0)
    } else if (this.state.shopNumber==='广告') {
      this.getTypeGet (num=1,type=1)
    } else if (this.state.shopNumber==='客户端') {
      this.getTypeGet (num=1,type=2)
    }
  }
  fiveCode = () => {
    if (this.state.shopNumber==='商家') {
      this.getTypeGetFive (num=5,type=0)
    } else if (this.state.shopNumber==='广告') {
      this.getTypeGetFive (num=5,type=1)
    } else if (this.state.shopNumber==='客户端') {
      this.getTypeGetFive (num=5,type=2)
    }
  } 
  callback = () => {
  }
  componentWillMount () {
    toLogin(this, this.callback)
    store.dispatch({type: 'setKey', data: '4'})
    console.log(this.state.shopNumber)
  }
  render(){
    return(
      <div>
        <div>
          <Select defaultValue="商家" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="商家">打印商家</Option>
            <Option value="广告">广告商家</Option>
            <Option value="客户端">机器注册</Option>
          </Select>
        </div>
        <div className="block">
          <div className="codewill">生成注册码</div>
          
          <div className="coded" style={{minHeight:'36px'}}>
            <span className="code">{this.state.code}</span>
            <div className="code">{this.state.codes}</div>
            <div className="code">{this.state.codess}</div>
            <div className="code">{this.state.codesss}</div>
            <div className="code">{this.state.codessss}</div>
            <span></span>
          </div>
          <div className="getcode">
          <Button onClick={this.oneCode} type="primary">我要一个</Button>
          </div>
          <div className="getcodes">
          <Button onClick={this.fiveCode} type="primary">我要五个</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Generate);