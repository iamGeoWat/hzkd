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
    engine: ''
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
    this.openDataTunnel()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.engine)
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
      name: 'grabShowInfo',
      data: {},
      success: res => {
        if (res.result !== '') {
          console.log(res.result)
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
  }
})