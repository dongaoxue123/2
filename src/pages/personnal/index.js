import React from 'react'
import { Form,Upload, Icon, message } from 'antd';
import { Descriptions } from 'antd';
import { Button } from 'antd';
import './style.css'
import { doPost } from '../../ulils/api'
import isLogin from '../../ulils/isLogin'
import store from '../../store'
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class NormalLoginForm extends React.Component{
  constructor (props) {
    super(props);
      this.state = {
        loading: false,
        userId:'',
        idname:'',
        phone:'',
        value:'',
        inputname:'',
        display :'none',
        butplay: 'block',
        fileList: [{ }]
      }
  }
  // state = {value:''}
  handleInputChange = e => {
    // console.log(store.getState().userList.userInformation)
    var target = e.target
    var key = target.name
    this.setState({
      [key] : target.value
    })
  }
  handleSubmit = e => {
    this.setState({
      display:'none',
      butplay:'block'
    })
    e.preventDefault ();
    doPost('/api/manage/editProfile', {nickName:this.state.inputname ,username:this.state.idname,mobile:this.state.phone}).then(res=>{
      if (res.data.flag) {
        localStorage.setItem("userList", JSON.stringify({'nickName':this.state.inputname, 'userName': this.state.idname, 'mobile': this.state.phone,'userId': this.state.userId}))
      } else if (res.data.code === 401) {
        isLogin(this)
      } else {
        alert ("保存失败")
      }
    })
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  }

  // getPdfURL= ()=> {
  //   const _this = this;
  //   const props = {
  //       name: 'file',
  //       action:' /api/manage/headPicUpload',
    
  //       headers: {
  //         Authentication: localStorage.name,
  //       },
  //       onChange(info) {
  //           if (info.file.status !== 'uploading') {
  //           }
  //           if (info.file.status === 'done') {
  //               message.success(`${info.file.name} 上传成功！`);
  //               _this.setState({
  //                   // pdfUrl:AjaxUrl + info.file.response.url,
  //                   wordName:info.file.response.wordName
  //               })

  //           } else if (info.file.status === 'error') {
  //               message.error(`${info.file.name} 上传失败！`);
  //           }
  //       },
  //   };
  //   return props;
  // }
  changeInfo = () =>{
    this.setState({
      display:'block',
      butplay:'none'
    })
  }
  componentDidMount () {
    // console.log('123')
    this.setState({
      idname:store.getState().userList.userInformation.userName,
      inputname:store.getState().userList.userInformation.nickName,
      phone:store.getState().userList.userInformation.mobile,
      userId:store.getState().userList.userInformation.userId
    })
    store.subscribe(() =>{
    this.setState({
      idname:store.getState().userList.userInformation.userName,
      inputname:store.getState().userList.userInformation.nickName,
      phone:store.getState().userList.userInformation.mobile,
      userId:store.getState().userList.userInformation.userId
    })
    })
    }
    componentWillUnmount () {
      this.setState = (state,callback)=>{
        return;
      }
    }
  render(){
    const props = {
      name: 'file',
      action: '/api/manage/headPicUpload',
      headers: {
        Authentication: localStorage.name,
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }
    // const uploadButton = (
    //   <div style={{display:this.state.display}}>
    //     <Icon type={this.state.loading ? 'loading' : 'plus'} />
    //     <div className="ant-upload-text">上传用户头像</div>
    //   </div>
    // );
    // const { imageUrl } = this.state
    const { getFieldDecorator } = this.props.form
    return(
      <div>
        <span style={{display:this.state.display}}>
        {/* <Upload
          name='file'
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/manage/headPicUpload"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          fileList={this.fileList}
        > */}
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传图片
          </Button>
        </Upload>
        {/* {imageUrl ? <img src={imageUrl} alt="avatar"/> : uploadButton} */}
      </span>
        <Button style={{display:this.state.butplay, lineHeight:'10px'}}  onClick={ this.changeInfo} shape="circle" icon="edit" />
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
        <div className="labol">
          
          <Descriptions title="个人信息">
            {/* <span className="listname"> */}
            <Descriptions.Item label="用户名">{this.state.idname}
            </Descriptions.Item>
            <Descriptions.Item style={{marginTop:'0'}} label="昵称" ><span style={{display:this.state.butplay}}>{this.state.inputname}</span>
            <Form.Item  style={{display:this.state.display}}>
            {getFieldDecorator('inputname',{})(
              <div style={{height:'10px',lineHeight:'0'}}>
            <input initialvalue={this.state.inputname} 
            placeholder={this.state.inputname} 
            name="inputname"
           
            onChange={this.handleInputChange}
            /></div>)}
            </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="手机号码">{this.state.phone}
            </Descriptions.Item>
            {/* </span> */}
            <Descriptions.Item label="身份">管理员</Descriptions.Item>
          </Descriptions>
          
        </div>
        <div style={{display:this.state.display}} className="but"><Button htmlType="submit" onClick={this.saveAvatar}>保存</Button></div>
        </form>
      </div>
    )
  }
}
const Personnal = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default Personnal;