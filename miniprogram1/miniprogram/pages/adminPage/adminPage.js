Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    infoContainer: [{}, {}],
    currentTab: "watch",
    isLoaded: false,
    adminData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    this.refreshData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.openDataTunnel()
    setInterval(function() {
      that.refreshData()
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      imageUrl: '/images/logo.png',
      path: '/pages/redirectPage/redirectPage'
    }
  },

  getContractInfo: function () {
    wx.cloud.callFunction({
      name: 'grabInfo',
      data: {},
      success: res => {
        if (res.result !== '') {
          console.log(JSON.parse(res.result))
          var modifiedResult = JSON.parse(res.result)
          for (var i = 0; i < modifiedResult.length; i++) {
            var tokenName = modifiedResult[i].instrument_id.substr(0, 3)
            var contractType = modifiedResult[i].instrument_id.substr(8, 6)
            //to be fixed
            if (tokenName === "EOS") {
              tokenName = "Pomelo"
            }
            modifiedResult[i].instrument_id = { 'token': tokenName, 'type': contractType }
          }
          for (var i = 0; i < modifiedResult.length; i++) {
            var short_pnl = modifiedResult[i].short_margin * modifiedResult[i].short_pnl_ratio
            var short_pnl_ratio_percent = (Math.round(modifiedResult[i].short_pnl_ratio * 10000) / 100).toFixed(2) + '%'
            modifiedResult[i].short_pnl_ratio = { 'short_pnl': short_pnl, 'short_pnl_ratio': modifiedResult[i].short_pnl_ratio, 'short_pnl_ratio_percent': short_pnl_ratio_percent }
          }
          for (var i = 0; i < modifiedResult.length; i++) {
            var long_pnl = modifiedResult[i].long_margin * modifiedResult[i].long_pnl_ratio
            var long_pnl_ratio_percent = (Math.round(modifiedResult[i].long_pnl_ratio * 10000) / 100).toFixed(2) + '%'
            modifiedResult[i].long_pnl_ratio = {
              'long_pnl': long_pnl, 'long_pnl_ratio': modifiedResult[i].long_pnl_ratio, 'long_pnl_ratio_percent': long_pnl_ratio_percent
            }
          }
          this.setData({
            infoContainer: [modifiedResult, this.data.infoContainer[1]]
          })
        }
        
      },
      fail: e => {
        console.log(e)
      }
    })
  },

  openDataTunnel: function () {
    var that = this
    setTimeout(function () {
      that.setData({
        isLoaded: true
      })
    }, 1000)
    that.getContractInfo()
    setInterval(function () {
      that.getContractInfo()
    }, 12000)
  },

  changeTab: function ({ detail }) {
    this.setData({
      currentTab: detail.key
    })
  },

  handlePass: function (e) {
    var _id = e.currentTarget.dataset['id']
    var _openid = e.currentTarget.dataset['openid']
    var _operatorid = e.currentTarget.dataset['operatorid']
    var _name = e.currentTarget.dataset['name']
    wx.cloud.callFunction({
      name: 'passApply',
      data: {
        id: _id,
        openid: _openid,
        operatorid: _operatorid,
        name: _name
      },
      success: res => {
        console.log(res.data)
        this.refreshData()
        wx.showToast({
          title: '已通过'
        })
      },
      fail: res => {
        console.log(res.data)
        wx.showToast({
          icon: 'none',
          title: '服务器或数据库出错'
        })
      }
    })
  },
  
  handleReject: function (e) {
    var _id = e.currentTarget.dataset['id']
    wx.cloud.callFunction({
      name: 'rejectApply',
      data: {
        id: _id
      },
      success: res => {
        console.log(res.data)
        this.refreshData()
        wx.showToast({
          title: '已处理'
        })
      },
      fail: res => {
        console.log(res.data)
        wx.showToast({
          icon: 'none',
          title: '服务器或数据库出错'
        })
      }
    })
  },
  
  refreshData: function () {
    var that = this
    const db = wx.cloud.database()
    db.collection('touristApply').where({
      hasHandled: false
    }).get({
      success: res => {
        console.log(res.data)
        that.setData({
          adminData: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库错误'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})