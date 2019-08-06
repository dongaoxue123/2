import React from 'react'
import { Form, Icon, Input, Button, Spin } from 'antd';
import axios from 'axios'
import './style.css'
import { doPost, doGet } from '../../ulils/api'
import getShopInformation from '../../ulils/getShopInformation'
import store from '../../store'
class NormalLoginForm extends React.Component {
  state = {
    isCheckCode: false,
    checkCode: '发送验证码',
    countdowm: 60,
    isCountdown: false,
    isShowLoding: false
  }
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 仅账号密码登录
      //  setTimeout(function() {
        this.setState({
          isShowLoding: true
        })
       if (!this.state.isCheckCode) {
        doPost('/api/manage/login', {username: values.username, password: values.password}).then(res => {
          this.setState({
            isShowLoding: false           
          })
          console.log(this.state.isShowLoding)
          
          if (res.data.flag) {
            store.dispatch({type: 'saveUser', userInformation: {'userId': res.data.data.userId, 'nickName': res.data.data.nickName, 'userName': res.data.data.userName, 'mobile': res.data.data.mobile}})
            localStorage.setItem("userList", JSON.stringify(store.getState().userList.userInformation))
            // console.log(store.getState().userList.userInformation)
            // 登录成功，将token存到localStorage中，将token放入请求头中，并发送获取今天商家信息请求
            localStorage['name'] = res.headers.authentication
            axios.defaults.headers.common['Authentication'] = localStorage.name
            getShopInformation()
            const that = this
            // setTimeout(function() {
              that.props.history.push('/systemAdmin/home')
            // },3000)
          } else if (res.data.code === 406) {
            this.setState({
              isCheckCode: true              
            })
          } else if (res.data.code === 407) {
            alert('用户名不存在，请重试！')
          } else if (res.data.code === 408) {
            alert('密码错误，请重试！')
          } else {
            alert('登录失败，请重试！')
          } 
        })
       }else {
        // 不安全登录时，需验证码登录
        doPost('/api/manage/login', {username: values.username, password: values.password, code: values.code}).then(res => {
            this.setState({
              isShowLoding: false           
            })
            // console.log(res)
            if (res.data.flag) {
              store.dispatch({type: 'saveUser', userInformation: {'userId': res.data.data.userId, 'nickName': res.data.data.nickName, 'userName': res.data.data.userName, 'mobile': res.data.data.mobile}})
              localStorage.setItem("userList", JSON.stringify(store.getState().userList.userInformation))
              // 登录成功，将token存到localStorage中，将token放入请求头中，并发送获取今天商家信息请求
              localStorage['name'] = res.headers.authentication
              axios.defaults.headers.common['Authentication'] = localStorage.name
              getShopInformation()
              const that = this
              that.setState({
                isShowLoding: true
              })
              setTimeout(function() {
                that.props.history.push('/systemAdmin/home')
              },3000)
            } else if (res.data.code === 407) {
              alert('用户名不存在，请重试！')
            } else if (res.data.code === 408){
              alert('密码错误，请重试！')
            } else if (res.data.code === 409){
              alert('验证码错误，请重试！')
            } else {
              alert('登录失败，请重试！')
            }
          })
       }
      }
    });
  };
  getNumber = () => {
    if (!this.state.isCountdown) {
       // 获取username输入框的values
      const nameValue = this.props.form.getFieldValue(['username']).ername
      // 验证手机号格式
          doGet('/api/manage/sendSMS', {username: nameValue}).then(res => {
            let that = this
            // console.log(res)
            if (res.data.flag) {
              let codeTime = 60
              this.setState({
              checkCode: '重新发送',
              isCountdown: true
             })
             let timer = setInterval(function () {
                codeTime = codeTime - 1
                that.setState({
                  countdowm: codeTime
                })
                if (that.state.countdowm < 0) {
                  clearInterval(timer)
                  that.setState({
                    checkCode: '发送验证码',
                    isCountdown: false
                  })
                }
              },1000)
            }
          })
        }
    }
  componentWillMount () {
    this.setState({
      isShowLoding: false
    })
    // console.log(localStorage)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    // 定义手机号，验证码组件
    let button, checkedCode, showLoding
    if (this.state.isShowLoding) {
      showLoding =  <div className="example">
                       <Spin size="large"/>
                    </div>
    }
    if (this.state.isCountdown) {
      checkedCode = <span>({this.state.countdowm})</span>
    }
    if (this.state.isCheckCode) {
      button = <div style={{marginTop:'-5px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between'}}>
                 <div style={{textAlign:'left'}}>
                 {getFieldDecorator('code', {
                   rules: [ { required: true, message: '请输入你的验证码!' }],
                     })(
                  <Input
                     placeholder="验证码" className="input_code"
                  />
                 )}
                   {/* <input className="input_code" placeholder="验证码"/> */}
                 </div>
                 <Button className="check_code" onClick={this.getNumber}>{this.state.checkCode}{checkedCode}</Button>
                </div>
    }
    return (
     <div className="login">
       <div className="title_name">京致科技</div>
        <div className="login_wrap">
          <div className="title">登&nbsp;&nbsp;录</div>
          <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入你的用户名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入你的密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          {button}
          <Form.Item>
          <a href="/systemAdmin/signup" className="dis_register">点我注册</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            <a href="/systemAdmin/signup" className="register">点我注册</a>
          </Form.Item>
        </Form>
        </div>
        {showLoding}
     </div>
    );
  }
}
const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default Login
