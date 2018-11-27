// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const db = wx.cloud.database()

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  return new Promise((resolve, reject) => {
    http.get('http://45.77.211.142:8888/info', (res) => {
      var rawData = ''
      res.on('data', (d) => {
        rawData += d
      })
      res.on('end', () => {
        resolve(rawData.toString())
      })
    })
  })
}