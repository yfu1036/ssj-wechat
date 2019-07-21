//app.js
App({
  onLaunch: function () {
    console.log('App Launch')
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 授权获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }

              // 调用后台登录接口
              wx.login({
                success: loginRes => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  var code = loginRes.code;
                  console.log("获取到的微信code为:" + code)
                  console.log("获取到的微信昵称为:" + this.globalData.userInfo.nickName)
                  if (code) {
                    wx.request({
                      url: 'http://localhost:8003/user/api/release/wxLogin',
                      data: { 
                        code: code,
                        nickName: this.globalData.userInfo.nickName 
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        if (res.statusCode == 200) {
                          console.log("获取到的token为:" + res.data)
                          this.globalData.token = res.data
                          wx.setStorageSync('token', res.data)
                        } else {
                          console.log(res.errMsg)
                        }
                      },
                    })
                  } else {
                    console.log('用户登录失败：' + res.errMsg);
                  }
                }
              })
              
            }
          })
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    token: null
  }
})