import React from "react"
import './index.css'
import { doGet } from '../../ulils/api'
import { Avatar } from 'antd'
import { withRouter } from 'react-router'
import { Menu, Dropdown } from 'antd'
import store from '../../store'
import 'antd/dist/antd.css'
import isLogin from '../../ulils/isLogin'
// const userId =
class Header extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      // url:`https://www.morningxy.com/headPic/${userId}headPic.jpg`,
      name:store.getState().userList.userInformation.nickName,
      userId:store.getState().userList.userInformation.userId
    }
  }
  
  toPersonal = () => {
    this.props.history.push('/systemAdmin/personnal')
  }
  done = () => {
    doGet('/api/manage/logout').then((res)=>{
      // console.log(res)
      isLogin(this)
    })
  }
  url () {
  }
  componentDidMount () {
    // console.log('111')
    // this.forceUpdate()
    this.setState({
      name:store.getState().userList.userInformation.nickName,
      userId:store.getState().userList.userInformation.userId
    })
    store.subscribe(() =>{
      this.setState({
        name:store.getState().userList.userInformation.nickName,
        userId:store.getState().userList.userInformation.userId
      })
    })  
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
  }
  render () {
    const menu = (
      <Menu>
        <Menu.Item  onClick={this.toPersonal} key="0">
          <span>个人资料</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item  onClick={this.done} key="3">
          <span >注销</span>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="header">
        <a className="text" href="/systemAdmin/home">京致科技</a>
          <span style={{marginRight:'60px'}}>
          <span style={{marginRight:'24px',fontWeight:'700'}}>{this.state.name}</span>
          <Dropdown overlay={menu} trigger={['click']}>
              <Avatar src={`https://www.morningxy.com/headPic/${this.state.userId}headPic.jpg` } size="large" />
          </Dropdown>
        </span>  
      </div>
    )
  }
}
export default withRouter(Header)