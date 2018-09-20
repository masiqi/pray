const serverless = require('serverless-http')
const fileType = require('file-type')
const AWS = require('aws-sdk')
const md5 = require('md5')
const bodyParser = require('body-parser')
const express = require('express')
const dynamoDb = require('./dynamodb')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { check, validationResult } = require('express-validator/check')
const app = express()
const cors = require('cors')
const jwt_key = process.env.JWT_KEY

app.use(bodyParser.json({ strict: false }))
app.use(cors())
app.use(
  expressJWT({
    secret: jwt_key
  }).unless({
    path: [{ url: '/user/login', methods: ['POST'] }, { url: '/user/register', methods: ['POST'] }, { url: '/schedule/:sid', methods: ['GET'] }, { url: '/test', methods: ['GET', 'POST'] }]
  })
)
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'jwt token error' })
  }
})

app.get('/', (req, res) => {
  console.log(req.user)
  res.send('Hello World!')
})

app.post('/test', (req, res) => {
  console.log(req.body.name)
  res.json({ status: 'ok' })
})

app.get('/schedule/:sid', (req, res) => {
  res.json({ status: 'succ', sid: req.params.sid })
})

//[check('lat').isFloat(), check('lon').isFloat(), check('tz').isInt()],
app.post('/schedule', [check('lat').isFloat(), check('lon').isFloat(), check('tz').isInt()], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }

  const id = uuid.v1()
  var path = ''
  if (req.body.image) {
    const buf = Buffer.from(req.body.image, 'base64')
    const tp = fileType(buf.slice(0, 4100))
    if (tp.mime === 'image/jpeg' || tp.mime === 'image/png') {
      path = 'upload/' + md5(req.user.email) + '/' + id + '.' + tp.ext
      const s3bucket = new AWS.S3({ Bucket: process.env.BUCKET })
      var s3params = {
        Bucket: process.env.BUCKET,
        Key: path,
        Body: buf,
        ACL: 'public-read',
        ContentType: tp.mime
      }
      s3bucket.upload(s3params, function(err, data) {
        if (err) {
          return res.status(422).json({ error: 'upload to s3 error' })
        } else {
          console.log(data)
        }
      })
    } else {
      return res.status(422).json({ erro: 'mime type error' })
    }
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      pk: 'schedule-' + id,
      sk: 'schedule-' + req.user.email,
      lat: req.body.lat,
      lon: req.body.lon,
      tz: req.body.tz
    }
  }
  if (req.file) {
    params.Item.background = path
  }

  dynamoDb.put(params, error => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not create schedule' })
    }
    res.json({ status: 'succ', data: params.Item, id })
  })
})

app.put('/schedule/:sid', (req, res) => {
  res.json({ status: 'succ', sid: req.params.sid })
})

app.get('/schedule/list', (req, res) => {
  res.json({ status: 'succ' })
})

app.post('/user/login', [check('email').isEmail(), check('password').isLength({ min: 6 })], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
  const { email, password } = req.body

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: 'email-' + email,
      sk: 'email-' + email
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get user' })
    }
    if (result.Item) {
      if (result.Item.password === password) {
        res.json({ status: 'succ', token: generateJwtToken(email), email })
      } else {
        res.status(400).json({ error: 'Password error' })
      }
    } else {
      res.status(404).json({ error: 'Email does not exist' })
    }
  })
})

app.post('/user/register', [check('email').isEmail(), check('password').isLength({ min: 6 })], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
  const { email, password } = req.body

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: 'email-' + email,
      sk: 'email-' + email
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get user' })
    }
    if (result.Item) {
      res.status(400).json({ error: 'Email already exist' })
    } else {
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: 'email-' + email,
          sk: 'email-' + email,
          password: password
        }
      }

      dynamoDb.put(params, error => {
        if (error) {
          console.log(error)
          res.status(400).json({ error: 'Could not create user' })
        }
        res.json({ status: 'succ', token: generateJwtToken(email), email })
      })
    }
  })
})

const generateJwtToken = email => {
  return jwt.sign(
    {
      email: email
    },
    jwt_key,
    {
      expiresIn: 60 * 60 * 24
    }
  )
}

module.exports.handler = serverless(app, {
  binary: ['application/json', 'image/*']
})
