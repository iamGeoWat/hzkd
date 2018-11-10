const https = require('https')
const CryptoJS = require('crypto-js')

// const api_key = 'e0bdc317-88de-4fea-8bc4-e899db1f90f6'
// const sec_key = '4655CA50BB11AFCD67AD5E70252C644E'
// const passphrase = ''

const api_key = 'caf58f2d-a046-4887-93ec-84989c0dc746'
const sec_key = '875CB6AD307FACF031D0CA1C0ACFAD1E'
const passphrase = '123456'

const express = require('express')
const app = express()

var infoContainer = []

var engine = setInterval(() => {
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
        infoContainer = JSON.parse(Buffer.concat(dataArr, dataArrLen).toString()).holding[0]
      }
    })
  })
  positionInfoGrabber.on('error', (e) => {
    console.error(e);
  });
  positionInfoGrabber.end()
}, 5000)

var seeThruEngine = setInterval(() => {
  // console.log(infoContainer)
}, 5000)

app.get('/info', (req, res) => res.send(JSON.stringify(infoContainer)))

app.listen(8888, () => console.log('hzkd_app is running at port 8888.'))