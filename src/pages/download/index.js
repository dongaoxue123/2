import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import 'bootstrap/dist/css/bootstrap.css'
import { Icon } from 'antd';
import './style.css'
import store from '../../store'
import toLogin from '../../ulils/toLogin'
class Download extends React.Component{
  callback = () => {

  }
  componentWillMount () {
    toLogin(this, this.callback)
    store.dispatch({type: 'setKey', data: '5'})
  }
  render () {
    return(
      <div>
        <ListGroup>
        <ListGroup.Item style={{textAlign:'center'}}>下载客户端</ListGroup.Item>
        <ListGroup.Item><span className="type"><span>广告客户端-v1.0.0<div className="date">2019-07-26 17:46</div></span><span></span><span></span><span></span><span><a href="https://morningxy.com/client/jzadClient_v1.0.zip"><Icon type="vertical-align-bottom" />下载</a></span></span></ListGroup.Item>
        <ListGroup.Item><span className="type"><span>客户端下载-v2.2.0<div className="date">2019-07-26 17:46</div></span><span></span><span></span><span></span><span><a href="https://morningxy.com/client/jzsyClient_v2.2.zip"><Icon type="vertical-align-bottom" />下载</a></span></span></ListGroup.Item>
        <ListGroup.Item><div className="type_"><span>.net4.0_full.exe <div className="date">2019-07-26 17:46</div></span><span></span><span></span><span></span><span><a href="https://morningxy.com/client/net4.0full.exe"><Icon type="vertical-align-bottom" />下载</a></span></div></ListGroup.Item>
        </ListGroup>
        <ListGroup>
        <ListGroup.Item style={{textAlign:'center',marginTop:'30px'}}>历史</ListGroup.Item>
        <ListGroup.Item><span className="type"><span>客户端下载-v2.1.0<div className="date">2019-06-19 18:57</div></span><span></span><span></span><span></span><span><a href="https://morningxy.com/client/jzsyClient_v2.1.zip"><Icon type="vertical-align-bottom" />下载</a></span></span></ListGroup.Item>
        <ListGroup.Item><div className="type_"><span>.net 4.0手动下载<div className="date">2019-06-03 11:11 </div></span><span></span><span></span><span></span><span><a href="https://morningxy.com/client/dotNetFx40_Full_x86_x64.exe"><Icon type="vertical-align-bottom" />下载</a></span></div></ListGroup.Item>
        </ListGroup>
      </div>
    )
  }
}
export default Download;