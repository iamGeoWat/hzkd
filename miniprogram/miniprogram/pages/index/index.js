//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    infoContainer: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  getContractInfo: function() {
    wx.cloud.callFunction({
      name: 'grabInfo',
      data: {},
      success: res => {
        console.log(JSON.parse(res.result))
        var modifiedResult = JSON.parse(res.result)
        for (var i = 0; i < modifiedResult.length; i++) {
          var tokenName = modifiedResult[i].instrument_id.substr(0,3)
          var contractType = modifiedResult[i].instrument_id.substr(8, 6)
          modifiedResult[i].instrument_id = { 'token': tokenName, 'type': contractType}
        }
        for (var i = 0; i < modifiedResult.length; i++) {
          var short_pnl = modifiedResult[i].short_margin * modifiedResult[i].short_pnl_ratio
          var short_pnl_ratio_percent = (Math.round(modifiedResult[i].short_pnl_ratio * 10000)/100).toFixed(2) + '%'
          modifiedResult[i].short_pnl_ratio = { 'short_pnl': short_pnl, 'short_pnl_ratio': modifiedResult[i].short_pnl_ratio, 'short_pnl_ratio_percent': short_pnl_ratio_percent }
        }
        for (var i = 0; i < modifiedResult.length; i++) {
          var long_pnl = modifiedResult[i].long_margin * modifiedResult[i].long_pnl_ratio
          var long_pnl_ratio_percent = (Math.round(modifiedResult[i].long_pnl_ratio * 10000) / 100).toFixed(2) + '%'
          modifiedResult[i].long_pnl_ratio = {
            'long_pnl': long_pnl, 'long_pnl_ratio': modifiedResult[i].long_pnl_ratio, 'long_pnl_ratio_percent': long_pnl_ratio_percent }
        }
        this.setData({
          infoContainer: modifiedResult
        })
      },
      fail: e => {
        console.log(e)
      }
    })
  },

  windIt: function() {
    var that = this
    setInterval(function(){
      that.getContractInfo()
    }, 3000)
  }

})
