const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json({ strict: false }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/user/login', (req, res) => {
  res.send('lalal')
})

app.post('/user/register', (req, res) => {
  console.log(req.body)
  res.send('lalal')
})

module.exports.handler = serverless(app)
