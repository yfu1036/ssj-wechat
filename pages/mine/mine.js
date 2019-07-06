//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if(this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有open-type=getUserInfo版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  //授权登录按钮绑定事件
  bindGetUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    //调用后台登录接口
    wx.login({
      success: res => {
        // 发送res.code到后台换取openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          wx.request({
            url: 'http://localhost:8003/user/api/release/wxLogin',
            data: { code: code },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.statusCode == 200) {
                console.log("获取到的token为：" + res.data)
                that.globalData.token = res.data.token
                wx.setStorageSync('token', res.data.token)
              } else {
                console.log(res.errMsg)
              }
            },
          })
        } else {
          console.log('获取用户登录失败：' + res.errMsg);
        }
      }
    })

  }
})
