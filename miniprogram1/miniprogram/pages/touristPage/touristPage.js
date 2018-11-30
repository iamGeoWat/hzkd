// pages/touristPage/touristPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isApplying: false,
    hasHandled: false,
    openid: '',
    handleAdminName: '',
    handleAdminComment: '',
    wechatName: '',
    operatorid: '',
    reason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      openid: options.openid
    })
    const db = wx.cloud.database()
    db.collection('touristApply').where({
      openid: that.data.openid
    }).get({
      success: res => {
        console.log(res.data[0])
        if (res.data[0] === undefined) {
          that.setData({
            isApplying: false,
            hasHandled: false
          })
        }
        if (res.data[0] !== undefined) {
          console.log('2')
          console.log(res.data[0].hasHandled)
          if (res.data[0].hasHandled) {
            that.setData({
              isApplying: true,
              hasHandled: true,
              handleAdminName: res.data[0].handleAdminName,
              handleAdminComment: res.data[0].handleAdminComment
            })
          } else {
            that.setData({
              isApplying: true,
              hasHandled: false
            })
          }
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

  handleSubmit: function () {
    var that = this
    const db = wx.cloud.database()
    db.collection('touristApply').add({
      data: {
        handleAdminComment: '',
        handleAdminName: '',
        hasHandled: false,
        hasPassed: false,
        name: that.data.wechatName,
        openid: that.data.openid,
        operatorid: that.data.operatorid,
        reason: that.data.reason
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        // this.setData({
        //   counterId: res._id,
        //   count: 1
        // })
        wx.showToast({
          title: '提交成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        setTimeout(function () {
          wx.redirectTo({
            url: '../redirectPage/redirectPage',
          })
        }, 500)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '提交失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onChangeForm: function (e) {
    if (e.currentTarget.dataset['what'] === 'openid') {
      this.setData({
        openid: e.detail.detail.value
      })
    } else if (e.currentTarget.dataset['what'] === 'reason') {
      this.setData({
        reason: e.detail.detail.value
      })
    } else if (e.currentTarget.dataset['what'] === 'wechatName') {
      this.setData({
        wechatName: e.detail.detail.value
      })
    } else if (e.currentTarget.dataset['what'] === 'operatorid') {
      this.setData({
        operatorid: e.detail.detail.value
      })
    }
  }
})