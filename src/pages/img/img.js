import React from 'react'
import store from '../../store'
class Img extends React.Component{
  componentWillMount () {
    store.dispatch({type: 'setKey', data: '3'})
  }
  componentDidMount () {
    console.log(this.props.location.state.name )
  }
  render () {
    return(
      <div align="center">
        <img style={{width:'60%',height:'100%',textAlign:'center'}} src={`https://morningxy.com/code/${this.props.location.state.name}${this.props.location.state.id}.jpg`} alt=""/>
      </div>
    )
  }
}
export default Img;