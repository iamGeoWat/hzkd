// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const querystring = require('querystring')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  return new Promise((resolve, reject) => {
    // http.request('http://zhnext.com:8877/showInfo', {
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: {
    //     userid: 2
    //   }
    // }, (res) => {
    //   var rawData = ''
    //   res.on('data', (d) => {
    //     rawData += d
    //   })
    //   res.on('end', () => {
    //     resolve(rawData.toString())
    //   })
    // })
    var req = http.request({
      hostname: 'zhnext.com',
      port: 8877,
      path: '/showInfo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      var rawData = ''
      res.on('data', (d) => {
        rawData += d
      })
      res.on('end', () => {
        resolve(rawData.toString())
      })
    }),
    var data = querystring.stringfy({
      'userid': '2'
    })
    req.write(data)
    req.end()
  })
}