import React from 'react'
import store from '../../store'
import { Card, Icon } from 'antd'
// import shopTabel from './shopTabel.js'
import ShopTabel from './ShopTabel.js'
import './style.css'
class Advert extends React.Component{
  componentWillMount () {
    // toLogin(this, this.callback)
    store.dispatch({type: 'setKey', data: '6'})
  }
  render () {
    return (
      <div>
         <div className="card_advert">
            <div className="card_flex">
              <Card title="机器总数" style={{ width: 300 }}>
                <span className="shop"><Icon style={{fontSize:"30px"}} type="printer" />
                  <span><Icon style={{color:'green',fontSize:'18px'}} type="user" />在线 7777</span>
                </span>
                <p style={{fontSize:'40px',textIndent:'30px'}}>3333</p>
              </Card>
            </div>
            <div className="card_flex">
              <Card title="商家总数" style={{ width: 300 }}>
                <span className="shop"><Icon style={{fontSize:"30px"}} type="team" />
                  <span><Icon style={{color:'green',fontSize:'18px'}} type="user" />在线 7777</span>
                </span>
                <p style={{fontSize:'40px',textIndent:'30px'}}>3333</p>
                {/*  */}
              </Card>
            </div>
        </div>
        <div className="data_list">
          <ShopTabel />
        </div>
      </div>
    )
  }
}
export default Advert