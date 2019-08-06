import { Select } from 'antd';
import React from 'react'
import store from '../../store'
const { Option } = Select;


class List extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      currentValue : 0,
      defaultValue : 1
    }
  }
  componentDidMount () {
    store.subscribe(() =>{
      this.setState({
        // 直接进入生成壁纸页面 默认显示商家名为数组的第一项 id为1 从home页面点击进入 传id 根据id值 显示商家名字
        defaultValue: store.getState().currentAdminPaper.adminId
      })
    })
  }
  componentWillReceiveProps (newProps) {
    // console.log(newProps.curAdminId)
    if (newProps.curAdminId > 0) {
      this.setState({
        currentValue: newProps.curAdminId
      })
    }
  }

  handleChange = (value) => {
    // this.setState({currentValue: value})
    // this.props.selectAdmin(value)
    // 传给生成壁纸页面id
    store.dispatch({type: 'set', adminId: value})
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
  }
  render () {
    return(
      // 更改两次defaultValue 直接进入 默认为第一项  从home进入 由生成壁纸传id
      <Select defaultValue={this.state.defaultValue} style={{ width: 180 }} value={store.getState().currentAdminPaper.adminId} onChange={this.handleChange}>
        {/*从store拿的商家列表 */}
        {store.getState().shopListAll.shopList.dataShopList.map((shop,index) =>
          <Option  value = {shop.adminId} key = {index}>{shop.shopName}</Option>
        )}
      </Select>
    )
  }
}
export default List;