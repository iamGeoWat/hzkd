// pages/redirectPage/redirectPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({
          openid: res.result.openid
        })
        console.log(res.result)
          that.getUserType(res.result.openid).then(function(res) {
            if (res === 'admin') {
              wx.redirectTo({
                url: '../adminPage/adminPage?openid=' + that.data.openid
              })
            } else if (res === 'normal') {
              wx.redirectTo({
                url: '../userPage/userPage?openid=' + that.data.openid
              })
            } else if (res === 'operator') {
              wx.redirectTo({
                url: '../operatorPage/operatorPage?openid=' + that.data.openid
              })
            } else if (res === 'tourist') {
              wx.redirectTo({
                url: '../touristPage/touristPage?openid=' + that.data.openid
              })
            }
          })
      }
    })
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

  },

  getUserType: function (in_openid) {
    console.log(in_openid)
    const db = wx.cloud.database()
    return new Promise((resolve, reject) => {
      db.collection('user').where({
        openid: in_openid
      }).get({
        success: res => {
          if (res.data[0] === undefined) {
            console.log('Tourist', res)
            resolve('tourist')
          }
          if (res.data[0].type === 'admin') {
            console.log('Admin')
            resolve('admin')
          } else if (res.data[0].type === 'operator') {
            console.log('Operator', res)
            resolve('operator')
          } else if (res.data[0].type === 'normal') {
            console.log('Normal', res)
            resolve('normal')
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '数据库错误'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    })
  }
})