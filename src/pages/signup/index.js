import { Form, Icon, Input, Button } from 'antd';
import React from 'react'
import { doPost } from '../../ulils/api'
// import axios from 'axios'
import './style.css'
import { Spin } from 'antd';
class NormalLoginForm extends React.Component {
  state = { username:'', password:'', mobile:'',loding:false,}
  handleInputChange = e => {
    var target = e.target
    var key = target.name
    this.setState({
      [key] : target.value
    })
  }
  getform () {

  }
  handleSubmit = e => {
    e.preventDefault ();
    // 手机号格式
    this.props.form.validateFields((err, values) => {
      var phone = values.mobile
      var wordtext = values.password
      var nametext = values.username
      if(!(/^.{4,10}$/.test(nametext))) {
        alert("账户名需四到十位")
        return false
      }
      else if(!(/^1[3456789]\d{9}$/.test(phone))) {
        alert("手机号码有误，请重填")
        return false
      }      
      else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(wordtext))) {
        alert("密码需同时含有数字和字母，且长度要在6-15位之间")
        return false
      }
      // else if (!err) {
      //   console.log('Received values of form: ', values)
      // }
      else{
        this.setState({
          loding:true

        })
        doPost('/api/manage/register',{username:this.state.username,password:this.state.password,mobile:this.state.mobile}).then(res=>{
          if (res.data.flag) {
            this.setState({
              loding:true
            })
            // setTimeout(() => {
              this.props.history.push('/systemAdmin/login')
            // }, 3000);
            
          } else {
            this.setState({
              loding:false
    
            })
            alert ("注册失败")
          }
        })
      }
    })
  }
  render () {

    const { getFieldDecorator } = this.props.form;
    let isloding
    if(this.state.loding){
      isloding=<div className="example">
      <Spin size="large"  />
    </div>
    }
    return (
      <div>

        <div className="title_name">京致科技</div>
      {isloding}
        <div className="box">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <div className="text">注&nbsp;&nbsp;册</div>
            <Form.Item>
              {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)',width:'50%' }} />}
                  initialvalue={this.state.username}
                  name="username"
                  onChange={this.handleInputChange}
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  initialvalue={this.state.password}
                  type="password"
                  name="password"
                  onChange={this.handleInputChange}
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('mobile', {
                rules: [{ required: true, message: '请输入手机号码!' }]
              })(
                <Input
                  prefix={<Icon type="mobile"  style={{ color: 'rgba(0,0,0,.25)' }} />}
                  initialvalue={this.state.mobile}
                  type="text"
                  name="mobile"
                  onChange={this.handleInputChange}
                  placeholder="手机号码"                  
                />
              )}
            </Form.Item>
            <Form.Item style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit" className="login-form-button">
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
        
      </div>
    );
  }
}

const Signup = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default Signup