const https = require('https')
const CryptoJS = require('crypto-js')

// const api_key = 'caf58f2d-a046-4887-93ec-84989c0dc746'
// const sec_key = '875CB6AD307FACF031D0CA1C0ACFAD1E'
// const passphrase = '123456'
// GeoWat

// const api_key = '1992c0f0-c4d2-43b4-ac8f-23a1571ce12c'
// const sec_key = '4D1B1E726EC0CAD7ADBB77D00D629961'
// const passphrase = '515162'
// Yu

const api_key = '3414ef69-78c3-4c8d-a723-86e0fd51c02b'
const sec_key = 'D7034EC4A3F7290CBE77D0269231699F'
const passphrase = '1993612dj'
// Huang

const express = require('express')
const app = express()

var infoContainer = [{}, {}]

var positionEngine = setInterval(() => {
  var timestamp = new Date();
  timestamp.setHours(timestamp.getHours(), timestamp.getMinutes());
  var positionSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.toISOString() + 'GET' + '/api/futures/v3/position', sec_key))
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
  
  const positionInfoGrabber = https.request(positionInfoOpt, (res) => {
    var dataArr = []
    var dataArrLen = 0
    res.on('data', (d) => {
      dataArr.push(d)
      dataArrLen += d.length
    })
    res.on('end', () => {
      console.log(JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()))
      if (JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding !== undefined) {
        infoContainer[0] = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding[0]
      }
    })
  })
  positionInfoGrabber.on('error', (e) => {
    console.error(e);
  });
  positionInfoGrabber.end()
}, 5000)

var accountEngine = setInterval(() => {
  var timestamp = new Date();
  timestamp.setHours(timestamp.getHours(), timestamp.getMinutes());
  var accountSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(timestamp.toISOString() + 'GET' + '/api/futures/v3/accounts', sec_key))
  const accountInfoOpt = {
    host: 'www.okex.com',
    path: '/api/futures/v3/accounts',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'OK-ACCESS-KEY': api_key,
      'OK-ACCESS-SIGN': accountSign,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'OK-ACCESS-TIMESTAMP': timestamp.toISOString()
    }
  }
  
  const accountInfoGrabber = https.request(accountInfoOpt, (res) => {
    var dataArr = []
    var dataArrLen = 0
    res.on('data', (d) => {
      dataArr.push(d)
      dataArrLen += d.length
    })
    res.on('end', () => {
      if (JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).info) {
        infoContainer[1] = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).info
      }
    })
  })
  accountInfoGrabber.on('error', (e) => {
    console.error(e);
  });
  accountInfoGrabber.end()
}, 10000)

var seeThruEngine = setInterval(() => {
  console.log(infoContainer)
}, 5000)

app.get('/info', (req, res) => res.send(JSON.stringify(infoContainer)))

app.listen(8888, () => console.log('hzkd_app is running at port 8888.'))