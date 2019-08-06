import React from 'react';
import Head from './components/header'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import Cashout from './pages/cashoutPage/Cashout'
import WaitSure from './pages/cashoutPage/WaitSure'
import GenWallpaper from './pages/genWallpaper/genWallpaper'
import Home from './pages/homePage/home'
import Download from './pages/download/index'
import Generate from './pages/generateCode/index'
import Login from './pages/login/index'
import getShopInformation from './ulils/getShopInformation'
import Signup from './pages/signup/index'
import Personnal from './pages/personnal/index'
import Advert from './pages/Advert/index'
import store from './store'
import axios from 'axios'
import './App.css'
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import Img from './pages/img/img';
const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu
class App extends React.Component {
  state = {
    key: ''
  }
  componentWillMount () {
    store.subscribe(() => {
      this.setState({
        key: store.getState().keyState.key
      })
    })
  }
  componentDidMount () {
    //在每个请求中判断token是否过期如果过期跳转login页面，没有过期将localstorage加到请求header中，发送请求。
    if (localStorage.name) {
      axios.defaults.headers.common['Authentication'] = localStorage.name
      getShopInformation ()
      store.dispatch({type: 'saveUser', userInformation: JSON.parse(localStorage.getItem("userList"))})
    } else {
      localStorage.removeItem('userList')
    }
    console.log(store.getState())
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
  }
  render () {
    return (
      <div className="App">      
        <Router>
          <Switch>
            <Route path="/systemAdmin/login" component={Login}></Route>
            <Route path="/systemAdmin/signup" component={Signup}></Route>
            <React.Fragment>
            <Head/>
            <div className="nav">
              <Layout>
                <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={broken => {
                    // console.log(broken);
                  }}
                  onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                  }}
                >
                <div className="logo" />
                  <Menu theme="dark" mode="inline" selectedKeys={[this.state.key]} defaultOpenKeys= {['sub2']}>
                  <SubMenu key="sub2" title={<span className="link"> <Icon type="appstore"/><span>总览</span></span>}>
                    <Menu.Item key="1">
                    <Link to="/systemAdmin" className="link">
                      <Icon type="bank" />
                      <span className="nav-text">打印</span>
                    </Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                    <Link to="/systemAdmin/advert" className="link">
                      <Icon type="codepen-circle" />
                      <span className="nav-text">广告</span>
                    </Link>
                    </Menu.Item>
                  </SubMenu>
                    <Menu.Item key="2">
                      <Link to="/systemAdmin/cashout" className="link">
                        <Icon type="file-done" />
                        <span className="nav-text">提现记录</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link to="/systemAdmin/genWallpaper" className="link">
                        <Icon type="qrcode" />
                        <span className="nav-text">生成二维码</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Link to="/systemAdmin/generateCode" className="link">
                      <Icon type="barcode" />
                        <span className="nav-text">生成注册码</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                      <Link to="/systemAdmin/download" className="link">
                        <Icon type="user" />
                        <span className="nav-text">下载客户端</span>
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Sider>
                  <Layout>
                    <Content style={{ margin: '18px 14px 0 14px' }}>
                      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Switch>                 
                          <Route path="/systemAdmin/img" component={Img}></Route>
                          <Route path="/systemAdmin/genWallpaper" component={GenWallpaper}></Route>
                          <Route path="/systemAdmin/home" exact component={Home}></Route>
                          <Route path="/systemAdmin/advert" component={Advert}></Route>
                          <Route path="/systemAdmin/cashout" component={Cashout}></Route>
                          <Route path="/systemAdmin/waitSure" component={WaitSure}></Route>
                          <Route path="/systemAdmin/download" component={Download}></Route>
                          <Route path="/systemAdmin/generateCode" component={Generate}></Route>
                          <Route path="/systemAdmin/personnal" component={Personnal}></Route>                        
                          <Redirect from="/systemAdmin" to="/systemAdmin/home"/>
                          <Redirect from="/" to="/systemAdmin/home"/>
                        </Switch>
                      </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>京致闪印 ©2019 Created by Ns and Dax</Footer>
                  </Layout>
                </Layout>
              </div>
            </React.Fragment>
          </Switch>
        </Router>
      </div>
    )
  }
}
export default App;
