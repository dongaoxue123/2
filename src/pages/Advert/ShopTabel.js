import { Table, Input, Button, Icon, Pagination } from 'antd';
import React from "react"
import Highlighter from 'react-highlight-words'
// import { withRouter } from 'react-router-dom'
// import store from '../../store'
class ShopTabel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      data:[{'adminId': 1, 'shopName':'sss', 'isAlive': '2/5'}],
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
  // 选择页码发送请求实现分页
  onChange = (page,pageSize) => {
    console.log(page, pageSize)
  }
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  // *render之后执行*
  componentDidMount() {
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
        title: '机器数',
        dataIndex: 'isAlive',
        key: 'isAlive',
        // ...this.getColumnSearchProps('online'),
      }
    ]
    return (
      <div>
        <Table columns={columns} dataSource={this.state.data} rowKey={(record, index) => `complete${record.id}${index}`} pagination={false}/>
        <Pagination total={85}  pageSize={3} defaultCurrent={1} onChange={this.onChange}/>
      </div>
    )
    
  }
}

export default ShopTabel