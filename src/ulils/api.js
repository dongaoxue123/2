import axios from 'axios'

//get请求
function doGet(url, data) {
    return axios.get(url, {'params':data}).then((res) => Promise.resolve(res))
}
//post请求
function doPost(url, data) {
    return axios.post(url, data).then((res) => Promise.resolve(res))
}
export {doGet, doPost}