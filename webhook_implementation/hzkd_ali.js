const express = require('express')
var bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
  console.log(req.body)
  res.send('Received.')
})

app.get('/')

app.listen(8888, ()=>{console.log('HZKD app running at port 8888.')})