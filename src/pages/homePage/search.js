import { Table, Input, Button, Icon } from 'antd';
import React from "react"
// import ReactDOM from "react-dom"
// import mountNode from "mo"
import Highlighter from 'react-highlight-words'
import { withRouter } from 'react-router-dom'
import store from '../../store'
class TodayAdminData extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      data:[],
    }
  }
  // onChange = (pagination) =>{
  //   doPost('/api/manage/account/getTxLogByStatus', {currentPage:pagination.current - 1, pageSize:10}).then(res => {
  //     console.log(res)
  //     if (res.flag) {
  //       let dataList = []
  //       res.data.pageContents.forEach((item) => {
  //         dataList.push({'adminId':item.adminId,
  //         'shopName':item.shopName,
  //         'recordNumber':item.recordNumber,
  //         'price':item.price,
  //         'isAlive':item.isActive})
  //       }); 
  //       this.setState({ 
  //         data: dataList,
  //         current:res.data.totalLine
  //       })
  //     }
  // })
  // }
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  goPicture = (adminId) => {
    store.dispatch({type: 'set', adminId: Number(adminId)})
    this.props.history.push({ pathname : '/systemAdmin/genWallpaper'})
    // this.props.history.push({ pathname : '/systemAdmin/img' , state : { adminId: adminId}})
  }
  // 获得父组件传过来的数据
  componentWillReceiveProps(nextProps){
    if(nextProps.oneDayShopList.length > 0 ) {
      this.setState({
        data: nextProps.oneDayShopList
      })
    }
  }
  // *render之后执行*
  componentDidMount() {
      this.setState({
        data:store.getState().shopListAll.shopList.dataShopList
      })
      store.subscribe(() =>{
        this.setState({
          data:store.getState().shopListAll.shopList.dataShopList
        })
      })
      // console.log(store.getState())
  }
  componentWillUnmount () {
    this.setState = (state,callback)=>{
      return;
    }
  }
  render() {
    const columns = [
      {
        title: '商家ID',
        dataIndex: 'adminId',
        key: 'adminId',
        sorter: (a, b) => b.adminId - a.adminId
      },
      {
        title: '店铺名',
        dataIndex: 'shopName',
        key: 'shopName',
        width: '30%',
        ...this.getColumnSearchProps('shopName')
      },
      {
        title: '今日单数',
        dataIndex: 'recordNumber',
        key: 'recordNumber',
        width: '20%',
        defaultSortOrder: [],
        sorter: (a, b) => b.recordNumber - a.recordNumber
        // ...this.getColumnSearchProps('age'),
      },
      {
        title: '今日金额',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price
        // ...this.getColumnSearchProps('address'),
      },
      {
        title: '是否在线',
        dataIndex: 'isAlive',
        key: 'isAlive',
        // ...this.getColumnSearchProps('online'),
        className: 'isAlive'
      },
      {
        title: '操作',
        dataIndex: 'onClick',
        key: 'onClick',
        render: (text, record) => <button onClick={this.goPicture.bind(this, record.adminId)}>壁纸</button>
        // this.change
        // ...this.getColumnSearchProps('change'),
      }
    ]
    return <Table columns={columns} dataSource={this.state.data} pagination={{pageSize: 5}} rowKey={(record, index) => `complete${record.id}${index}`}/>
    
  }
}

export default withRouter(TodayAdminData)