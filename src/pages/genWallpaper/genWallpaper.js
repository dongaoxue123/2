import ListGroup from 'react-bootstrap/ListGroup'
import 'bootstrap/dist/css/bootstrap.css'
// import DownloadLink from "react-download-link";
import React from 'react';
import { Icon } from 'antd';
import store from '../../store'
import List from './list.js'
import './style.css'
import toLogin from '../../ulils/toLogin'
let adminId = ''
// let codeUrl = 'https://morningxy.com/code/'
let unsubscribe
let img = ['A4','KN', 'KY', 'ZN', 'ZY', 'HB']
class GenWallpaper extends React.Component{
  constructor(props){
  　super(props)
    this.state = {
      curAdminId : 0,
      hrefKn: '',
      hrefA: '',
      hrefKy: '',
      hrefZn: '',
      hrefZy: '',
      hrefHb: '',
    }
  }
  onDownload (e) {
    const a = document.createElement('a')
    a.download = "小程序壁纸"
  }
  // 点击传给img参数
  href = ()=> {
    console.log(adminId) 
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[0] }})
  }
  hrefW = () =>{
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[1] }})
  }
  hrefText = () => {
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[2] }})
  }
  hrefBlock = () => {
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[3] }})
  }
  hrefBlockText = () => {
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[4] }})
  }
  hrefWall = () => {
    this.props.history.push({ pathname : '/systemAdmin/img', state : { name : adminId, id: img[5] }})
  }
  exportFile () {
    Promise.resolve("codeUrl + adminId + 'KN.jpg'")
  }
  callback = () => {
    // 如果从home页面点进来 拿到home页面点击的商家id值 在预览下载处使用 再传给list页面 根据list存好的id 拿到对应的商家名 
    if (this.props.location.state) { 
      adminId = Number(this.props.location.state.adminId)
      this.setState ({
        curAdminId: adminId
      })
    } else {
      store.subscribe(() => {
        if (store.getState().shopListAll) { 
          this.setState({
            // 如果直接进入生成二维码页面，则选择第一个商家
            curAdminId: store.getState().currentAdminPaper.adminId
          })
        }
      })
    }
  }
  // onClick = () => {
  //   this.setState({
  //     href:`/code/${adminId}A4.jpg`
  //   })
  // }
  componentWillMount () {
    store.dispatch({type: 'setKey', data: '3'})
  }
  // 从list点击选择商家 传来的id值
  valueChange (value) { 
    adminId = Number(value)
  }
  componentDidMount () {
    // console.log(111)
    toLogin(this, this.callback)
    adminId = store.getState().currentAdminPaper.adminId
    this.setState({
      hrefKn : `/code/${adminId}KN.jpg`,
      hrefA: `/code/${adminId}A4.jpg`,
      hrefKy:`/code/${adminId}KY.jpg`,
      hrefZn:`/code/${adminId}ZN.jpg`,
      hrefZy:`/code/${adminId}ZY.jpg`,
      hrefHb:`/code/${adminId}HB.jpg`,
    })
    unsubscribe = store.subscribe(() => {
      // console.log(this.state.adminId)
      // console.log(adminId)
      adminId = store.getState().currentAdminPaper.adminId
      this.setState({
        hrefKn : `/code/${adminId}KN.jpg`,
        hrefA:  `/code/${adminId}A4.jpg`,
        hrefKy:`/code/${adminId}KY.jpg`,
        hrefZn:`/code/${adminId}ZN.jpg`,
        hrefZy:`/code/${adminId}ZY.jpg`,
        hrefHb:`/code/${adminId}HB.jpg`,
      })
    })
    
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
    unsubscribe()
  }
  render () {
    return (
      <div>
        <div>
          <List selectAdmin = {this.valueChange.bind(this)}  curAdminId = {this.state.curAdminId} />
          <div style={{ textAlign: 'center',fontWeight:'800',fontSize:'20px', }}>生成壁纸</div>
          <ListGroup style = {{marginTop:'20px'}} as="ul"> 
            <ListGroup.Item className="pic" as="li"><span className="content">A4壁纸<span>
                  <span><span onClick={this.href.bind(this)} className="text-down">预览</span></span>
                    <a href ={this.state.hrefA} download="京致闪印小程序码.jpg"><Icon type="download" />下载</a></span></span>
            </ListGroup.Item>
            <ListGroup.Item className="pic" as="li"><span className="content">宽屏无字<span><span><span className="urlid text-down" onClick={this.hrefW}>预览</span></span>
            <a href ={this.state.hrefKn} download="京致闪印小程序码.jpg"><Icon type="download" />下载
                {/* <span className="iconfont icon-duomeitiicon-">下载 */}</a></span></span>
            
            </ListGroup.Item>
            <ListGroup.Item className="pic" as="li"><span className="content">宽屏有字<span><span><span onClick={this.hrefText} className="text-down">预览</span></span><a href ={this.state.hrefKy} download="京致闪印小程序码.jpg">
              <Icon type="download" />下载</a></span></span></ListGroup.Item>
            <ListGroup.Item className="pic" as="li"><span className="content">正方无字<span><span><span onClick={this.hrefBlock} className="text-down" >预览</span></span><a href ={this.state.hrefZn} download="京致闪印小程序码.jpg">
              <Icon type="download" />下载</a></span></span></ListGroup.Item>
            <ListGroup.Item className="pic" as="li"><span className="content">正方有字<span><span><span onClick={this.hrefBlockText} className="text-down">预览</span></span><a href ={this.state.hrefZy} download="京致闪印小程序码.jpg">
              <Icon type="download" />下载</a></span></span></ListGroup.Item>
            <ListGroup.Item className="pic" as="li"><span className="content">生成海报<span><span><span onClick={this.hrefWall} className="text-down" >预览</span></span><a href ={this.state.hrefHb}download="京致闪印小程序码.jpg">
              <Icon type="download" />下载</a></span></span></ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    )
  }
}
export default GenWallpaper;
