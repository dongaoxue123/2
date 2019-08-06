import axios from 'axios'
export default function toLogin (that, callback) {
  if (!localStorage.name) {
    that.props.history.push('/systemAdmin/login')
  } else {
    axios.defaults.headers.common['Authentication'] = localStorage.name
    callback ()
  }
}