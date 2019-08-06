function isLogin(that) {
  localStorage.removeItem('userList')
  localStorage['name'] = ''
  that.props.history.push('/systemAdmin/login')
}
export default isLogin