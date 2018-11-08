const https = require('https')
// const querystring = require('querystring')
// const md5 = require('./md5')
const CryptoJS = require('crypto-js')
const api_key = 'caf58f2d-a046-4887-93ec-84989c0dc746'
const sec_key = '875CB6AD307FACF031D0CA1C0ACFAD1E'
const passphrase = '123456'
const express = require('express')
const app = express()



// var infoContainer =
//   {
//     userInfo:
//       {
//         totalEOS: '',
//         profitLoss: '',
//         open: '',
//         openProfit: ''
//       },
//     positionInfo:
//     {
//       shortInfo:
//         {
//           openPrice: '',
//           profitLossRatio: '',
//           profitLoss: '',
//           holding: '',
//           available: '',
//           margin: '',
//           deadPrice: ''
//         },
//       longInfo:
//         {
//           openPrice: '',
//           profitLossRatio: '',
//           profitLoss: '',
//           holding: '',
//           available: '',
//           margin: '',
//           deadPrice: ''
//         }
//     }
//   }

var infoContainer = []

var engine = setInterval(() => {
  // var infoSign = md5('api_key=' + api_key + '&secret_key=' + sec_key).toUpperCase()
  // var userInfoData = querystring.stringify({
  //   api_key: 'a04faf5d-4eb8-4b25-8736-8440af7e5d3b',
  //   sign: infoSign
  // })
  // const userInfoOpt = {
  //   host: 'www.okex.com',
  //   path: '/api/v1/future_userinfo_4fix.do',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // }
  
  

  // var positionInfoData = querystring.stringify({
  //   // symbol: 'eos_usd',
  //   // contract_type: 'quarter',
  //   'OK-ACCESS-KEY': api_key,
  //   'OK-ACCESS-SIGN': positionSign,
  //   'OK-ACCESS-PASSPHRASE': passphrase,
  //   'OK-ACCESS-TIMESTAMP': timestamp
  //   // type: '1'
  // })
  var timestamp = new Date();
  timestamp.setHours(timestamp.getHours(), timestamp.getMinutes());
  // var positionSign = md5('api_key=' + api_key + '&contract_type=quarter&symbol=eos_usd&type=1' + '&secret_key=' + sec_key).toUpperCase()
  var positionSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.toISOString() + 'GET' + '/api/futures/v3/position', sec_key))
  // console.log(timestamp.toISOString())
  const positionInfoOpt = {
    host: 'www.okex.com',
    path: '/api/futures/v3/position',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': api_key,
      'OK-ACCESS-SIGN': positionSign,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'OK-ACCESS-TIMESTAMP': timestamp.toISOString()
    }
  }
  
  
  // const userInfoGrabber = https.request(userInfoOpt, (res) => {
  //   var dataArr = []
  //   var dataArrLen = 0
  //   res.on('data', (d) => {
  //     dataArr.push(d)
  //     dataArrLen += d.length
  //   })
  //   res.on('end', () => {
  //     var userInfo = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).info
  //     infoContainer.userInfo.totalEOS = userInfo.eos.rights
  //     infoContainer.userInfo.profitLoss = userInfo.eos.contracts[0].profit
  //     infoContainer.userInfo.openProfit = userInfo.eos.contracts[0].unprofit
  //     infoContainer.userInfo.open = userInfo.eos.contracts[0].bond
  //     // console.log(infoContainer)
  //   })
  // })
  // userInfoGrabber.on('error', (e) => {
  //   console.error(e);
  // });
  // userInfoGrabber.write(userInfoData);
  // userInfoGrabber.end();
  
  
  const positionInfoGrabber = https.request(positionInfoOpt, (res) => {
    var dataArr = []
    var dataArrLen = 0
    res.on('data', (d) => {
      dataArr.push(d)
      dataArrLen += d.length
    })
    res.on('end', () => {
      console.log(JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding)
      infoContainer = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding[0]
      // var positionInfo = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding[0]
      // infoContainer.positionInfo.shortInfo.openPrice = positionInfo.sell_price_avg
      // infoContainer.positionInfo.shortInfo.profitLossRatio = positionInfo.sell_profit_lossratio
      // infoContainer.positionInfo.shortInfo.profitLoss = (positionInfo.sell_bond * positionInfo.sell_profit_lossratio / 100)
      // infoContainer.positionInfo.shortInfo.holding = positionInfo.sell_amount
      // infoContainer.positionInfo.shortInfo.available = positionInfo.sell_available
      // infoContainer.positionInfo.shortInfo.margin = positionInfo.sell_bond
      // infoContainer.positionInfo.shortInfo.deadPrice = positionInfo.sell_flatprice
      //
      // infoContainer.positionInfo.longInfo.openPrice = positionInfo.buy_price_avg
      // infoContainer.positionInfo.longInfo.profitLossRatio = positionInfo.buy_profit_lossratio
      // infoContainer.positionInfo.longInfo.profitLoss = (positionInfo.buy_bond * positionInfo.buy_profit_lossratio / 100)
      // infoContainer.positionInfo.longInfo.holding = positionInfo.buy_amount
      // infoContainer.positionInfo.longInfo.available = positionInfo.buy_available
      // infoContainer.positionInfo.longInfo.margin = positionInfo.buy_bond
      // infoContainer.positionInfo.longInfo.deadPrice = positionInfo.buy_flatprice
    })
  })
  positionInfoGrabber.on('error', (e) => {
    console.error(e);
  });
  // positionInfoGrabber.write(positionInfoData)
  positionInfoGrabber.end()
}, 5000)

var seeThruEngine = setInterval(() => {
  // console.log(infoContainer)
}, 5000)

// var autoDrive = setInterval(() => {
//   var options = {
//     host: 'm1e7pv64.qcloud.la',
//     path: '/weapp/webhook',
//     port: 5757,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }
//   var body = JSON.stringify(infoContainer)
//   var req = https.request(options, (res) => {
//     res.on('data', (d) => {
//       console.log(d.toString())
//     })
//   })
//   req.on('error', (e) => {
//     console.error(e);
//   });
//   req.write(body)
//   console.log(infoContainer)
//   req.end()
// }, 5000)

app.get('/info', (req, res) => res.send(JSON.stringify(infoContainer)))

app.listen(8888, () => console.log('hzkd_app is running at port 8888.'))