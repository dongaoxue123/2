import store from '@/stores/store'
const number = 9
let sum = 0
function uploadFile (type, callback, progressCallBack, progressState) {
  if (type === 'wxDoc') {
    uploadWxFile(callback, progressCallBack, progressState)
  } else if (type === 'wxImg') {
    uploadWxImage(callback, progressCallBack, progressState)
  } else if (type === 'localImg') {
    uploadLocalImage(callback, progressCallBack, progressState)
  }
}

// function uploadWxFile (callback, progressCallBack) {
function uploadWxFile (callback, progressCallBack, progressState) {
  // 选择微信聊天记录内文件
  wx.chooseMessageFile({
    // 限制只能上传一个文件
    count: number,
    type: 'file',
    extension: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
    success (res) {
      let fileNum = res.tempFiles.length
      for (let i = 0; i < fileNum; i++) {
        const file = res.tempFiles[i]
        // 文件临时路径
        let filePath = file.path
        // 文件大小 (KB)
        let fileSize = parseInt(file.size / 1000)
        // 文件名
        let fileName = file.name
        // 新上传直接选中
        if (fileSize > 50 * 1024) {
          wx.showToast({ title: '( ╯□╰ )文件大小不能超过50M!', icon: 'none', duration: 2000 })
          continue
        }
        // 上传临时文件到远程服务器
        const uploadTask = wx.uploadFile({
          url: store.state.url + '/api/upload',
          filePath: filePath,
          name: 'file',
          formData: {
            userId: store.state.userId,
            fileSize: fileSize,
            fileName: fileName
          },
          success (res) {
            var resData = JSON.parse(res.data)
            if (resData.flag) {
              typeof progressState === 'function' && progressState(resData.flag, i)
              let data = resData.data
              let fileInfo = {
                'fileId': data.fileId,
                'fileSize': fileSize,
                'fileName': fileName,
                'totalPage': data.totalPage,
                'previewPath': data.previewPath
              }
              if (store.state.isPrintStatus) {
                fileInfo.checked = true
                // 订单页面从后追加入列表
              //   store.state.files.push(fileInfo)
              // } else {
              //   store.state.files.unshift(fileInfo)
              }
              store.state.files.unshift(fileInfo)
              // console.log('文件信息更新啦！')
              // console.log(store.state.files)
              // 存储文件临时路径供后续预览
              mpvue.setStorageSync(String(fileInfo.fileId), filePath)
              // console.log(filePath)
            } else {
              typeof progressState === 'function' && progressState(false, i)
              wx.showModal({ title: '上传失败', content: `${fileName}上传失败，请检查文件是否被加密或被损坏`, icon: 'none', duration: 3000, showCancel: false, confirmText: '知道了' })
            }
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              wx.showToast({ title: '成功', icon: 'success', duration: 1500 })
              typeof callback === 'function' && callback()
              sum = 0
            }
          },
          fail (res) {
            wx.showToast({ title: `${fileName}上传失败`, icon: 'none', duration: 2000 })
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              typeof callback === 'function' && callback()
              sum = 0
            }
          }
        })
        uploadTask.onProgressUpdate((res) => {
          // console.log(res.progress)
          // console.log(res.totalBytesSent)
          // console.log(res.totalBytesExpectedToSend)
          typeof progressCallBack === 'function' && progressCallBack(res.progress, i, fileName, uploadTask)
          // console.log(res.progress)
        })
      }
      // 从微信聊天记录上传到小程序的临时文件
    }
  })
}

function uploadWxImage (callback, progressCallBack, progressState) {
  // 选择微信聊天记录内文件
  wx.chooseMessageFile({
    // 限制只能上传一个文件
    count: number,
    type: 'image',
    extension: ['jpg', 'jpeg', 'png'],
    success (res) {
      let fileNum = res.tempFiles.length
      for (let i = 0; i < fileNum; i++) {
        const file = res.tempFiles[i]
        // 文件临时路径
        let filePath = file.path
        // 文件大小 (KB)
        let fileSize = parseInt(file.size / 1000)
        // 文件名
        let fileName = file.name
        // 新上传直接选中
        if (fileSize > 50 * 1024) {
          wx.showToast({ title: '( ╯□╰ )文件大小不能超过50M!', icon: 'none', duration: 2000 })
          continue
        }
        // 上传临时文件到远程服务器
        const uploadTask = wx.uploadFile({
          url: store.state.url + '/api/upload',
          filePath: filePath,
          name: 'file',
          formData: {
            userId: store.state.userId,
            fileSize: fileSize,
            fileName: fileName
          },
          success (res) {
            var resData = JSON.parse(res.data)
            let data = resData.data
            if (resData.flag) {
              typeof progressState === 'function' && progressState(resData.flag, i)
              let fileInfo = {
                'fileId': data.fileId,
                'fileSize': fileSize,
                'fileName': fileName,
                'totalPage': data.totalPage,
                'previewPath': data.previewPath
              }
              if (store.state.isPrintStatus) {
                fileInfo.checked = true
                // 订单页面从后追加入列表
              //   store.state.files.push(fileInfo)
              // } else {
              //   store.state.files.unshift(fileInfo)
              }
              store.state.files.unshift(fileInfo)
              // console.log('文件信息更新啦！')
              // console.log(store.state.files)
              // 存储文件临时路径供后续预览
              // mpvue.setStorageSync(String(fileInfo.fileId), filePath)
              // console.log(filePath)
            } else {
              typeof progressState === 'function' && progressState(false, i)
              wx.showModal({ title: '上传失败', content: `${fileName}上传失败，请检查文件是否被加密或被损坏`, icon: 'none', duration: 3000, showCancel: false, confirmText: '知道了' })
            }
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              wx.showToast({ title: '成功', icon: 'success', duration: 1500 })
              typeof callback === 'function' && callback()
              sum = 0
            }
          },
          fail (res) {
            wx.showToast({ title: '( ╯□╰ )文件走丢了!请重新上传文件~', icon: 'none', duration: 2000 })
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              typeof callback === 'function' && callback()
              sum = 0
            }
          }
        })
        uploadTask.onProgressUpdate((res) => {
          typeof progressCallBack === 'function' && progressCallBack(res.progress, i, fileName, uploadTask)
        })
      }
      // 从微信聊天记录上传到小程序的临时文件
    }
  })
}

// 相册中的图片无法获取文件名，需要在请求中设置fileName为空，后台随机生成后返回fileName字段
function uploadLocalImage (callback, progressCallBack, progressState) {
  // 选择本地相册内文件
  wx.chooseImage({
    count: number,
    success (res) {
      let fileNum = res.tempFiles.length
      for (let i = 0; i < fileNum; i++) {
        const file = res.tempFiles[i]
        // console.log(file)
        // 文件临时路径
        let filePath = file.path
        // 文件大小 (KB)
        let fileSize = parseInt(file.size / 1000)
        // 文件名
        let fileName = ''
        // 新上传直接选中
        if (fileSize > 50 * 1024) {
          wx.showToast({ title: '( ╯□╰ )文件大小不能超过50M!', icon: 'none', duration: 2000 })
          continue
        }
        // console.log('123' + filePath)
        // 上传临时文件到远程服务器
        const uploadTask = wx.uploadFile({
          url: store.state.url + '/api/upload',
          filePath: filePath,
          name: 'file',
          formData: {
            userId: store.state.userId,
            fileSize: fileSize,
            fileName: fileName
          },
          success (res) {
            var resData = JSON.parse(res.data)
            if (resData.flag) {
              typeof progressState === 'function' && progressState(resData.flag, i)
              let data = resData.data
              let fileInfo = {
                'fileId': data.fileId,
                'fileSize': fileSize,
                'fileName': data.fileName,
                'totalPage': data.totalPage,
                'previewPath': data.previewPath
              }
              console.log(fileInfo)
              if (store.state.isPrintStatus) {
                fileInfo.checked = true
                // 订单页面从后追加入列表
              //   store.state.files.push(fileInfo)
              // } else {
              //   store.state.files.unshift(fileInfo)
              }
              store.state.files.unshift(fileInfo)
              // console.log('文件信息更新啦！')
              // console.log(store.state.files)
              // 存储文件临时路径供后续预览
              // mpvue.setStorageSync(String(fileInfo.fileId), filePath)
              // console.log(filePath)
            } else {
              typeof progressState === 'function' && progressState(false, i)
              wx.showModal({ title: '上传失败', content: `${fileName}上传失败，请检查文件是否被加密或被损坏`, icon: 'none', duration: 3000, showCancel: false, confirmText: '知道了' })
            }
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              wx.showToast({ title: '成功', icon: 'success', duration: 1500 })
              typeof callback === 'function' && callback()
              sum = 0
            }
          },
          fail (res) {
            wx.showToast({ title: '( ╯□╰ )文件走丢了!请重新上传文件~', icon: 'none', duration: 2000 })
            sum = sum + 1
            if (sum === fileNum) {
              // 全部文件成功时显示成功
              typeof callback === 'function' && callback()
              sum = 0
            }
          }
        })
        uploadTask.onProgressUpdate((res) => {
          typeof progressCallBack === 'function' && progressCallBack(res.progress, i, fileName, uploadTask)
        })
      }
      // 从微信聊天记录上传到小程序的临时文件
    }
  })
}

export { uploadFile }
