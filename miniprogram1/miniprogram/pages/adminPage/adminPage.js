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
    adminData: [],
    engine: '',
    adminEngine: ''
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
    that.data.adminEngine = setInterval(function() {
      that.refreshData()
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.engine)
    clearInterval(this.data.adminEngine)
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
          //modify position info
          if (JSON.parse(res.result)[0] !== null) {
            // console.log(JSON.parse(res.result)[1])
            var modPositionInfo = JSON.parse(res.result)[0]
            var accountInfo = JSON.parse(res.result)[1]
            for (var i = 0; i < modPositionInfo.length; i++) {
              var tokenName = modPositionInfo[i].instrument_id.substr(0, 3)
              var contractType = modPositionInfo[i].instrument_id.substr(8, 6)
              //to be fixed
              var lowercaseToken = tokenName.toLowerCase()
              modPositionInfo[i].instrument_id = { 'token': tokenName, 'type': contractType, 'lowercaseToken': lowercaseToken }
            }
            for (var i = 0; i < modPositionInfo.length; i++) {
              var short_pnl = modPositionInfo[i].short_margin * modPositionInfo[i].short_pnl_ratio
              var short_pnl_ratio_percent = (Math.round(modPositionInfo[i].short_pnl_ratio * 10000) / 100).toFixed(2) + '%'
              modPositionInfo[i].short_pnl_ratio = { 'short_pnl': short_pnl, 'short_pnl_ratio': modPositionInfo[i].short_pnl_ratio, 'short_pnl_ratio_percent': short_pnl_ratio_percent }
            }
            for (var i = 0; i < modPositionInfo.length; i++) {
              var long_pnl = modPositionInfo[i].long_margin * modPositionInfo[i].long_pnl_ratio
              var long_pnl_ratio_percent = (Math.round(modPositionInfo[i].long_pnl_ratio * 10000) / 100).toFixed(2) + '%'
              modPositionInfo[i].long_pnl_ratio = {
                'long_pnl': long_pnl, 'long_pnl_ratio': modPositionInfo[i].long_pnl_ratio, 'long_pnl_ratio_percent': long_pnl_ratio_percent
              }
            }
          }
          //modify account info
          if (JSON.parse(res.result)[1] !== null) {
            // console.log(JSON.parse(res.result)[1])
            var modAccountInfo = JSON.parse(res.result)[1]
            for (var token in modAccountInfo) {
              var total_margin_frozen = 0
              for (var i = 0; i < modAccountInfo[token].contracts.length; i++) {
                total_margin_frozen += modAccountInfo[token].contracts[i].margin_frozen
              }
              // if ((total_margin_frozen / modAccountInfo[token].equity * 100) >= 0.3) {
              //   modAccountInfo[token].position_ratio = '32.16%'
              // } else {
              //   modAccountInfo[token].position_ratio = (total_margin_frozen / modAccountInfo[token].equity * 100).toString().substr(0, 5) + '%'
              // }
              modAccountInfo[token].position_ratio = (total_margin_frozen / modAccountInfo[token].equity * 100).toString().substr(0, 5) + '%'
              modAccountInfo[token].weeklyPnL = Math.round(modAccountInfo[token].equity - modAccountInfo[token].total_avail_balance)
            }
          }
          this.setData({
            infoContainer: [modPositionInfo, modAccountInfo]
          })
          console.log(this.data.infoContainer[0])
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
    that.data.engine = setInterval(function () {
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
        // console.log(res.data)
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