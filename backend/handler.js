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
    path: [{ url: '/user/login', methods: ['POST'] }, { url: '/user/register', methods: ['POST'] }, { url: '/test', methods: ['GET', 'POST'] }, { url: /\/schedule\//, methods: ['GET'] }]
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
  console.log(req.body.name || 'abcd')
  res.json({ status: 'ok' })
})

app.get('/schedule/:sid', (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeNames: {
      '#pk': 'pk'
    },
    ExpressionAttributeValues: {
      ':pk': 'schedule-' + req.params.sid
    }
  }

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get schedule' })
    } else {
      console.log('Query succeeded.')
      if (result.Items.length == 0) {
        res.status(404).json({ error: 'Schedule does not exist' })
      } else {
        res.json({ status: 'succ', data: result.Items[0] })
      }
    }
  })
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
      tz: req.body.tz,
      cm: req.body.cm || 'ISNA',
      lang: req.body.lang || 'EN',
      imask_delta: req.body.imask_delta || 0,
      fajr_delta: req.body.fajr_delta || 0,
      sunrise_delta: req.body.sunrise_delta || 0,
      dhuhr_delta: req.body.dhuhr_delta || 0,
      athan: req.body.athan || 0,
      jamaah: req.body.jamaah || 0,
      asr_delta: req.body.asr_delta || 0,
      maghrib_delta: req.body.maghrib_delta || 0,
      isha_delta: req.body.isha_delta || 0,
      imask_fixed: req.body.imask_fixed || 0,
      fajr_fixed: req.body.fajr_fixed || 0,
      sunrise_fixed: req.body.sunrise_fixed || 0,
      jamaah_fixed: req.body.jamaah_fixed || 0,
      asr_fixed: req.body.asr_fixed || 0,
      maghrib_fixed: req.body.maghrib_fixed || 0,
      isha_fixed: req.body.isha_fixed || 0
    }
  }
  if (path !== '') {
    params.Item.image = path
  }

  dynamoDb.put(params, error => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not create schedule' })
    }
    res.json({ status: 'succ', data: params.Item, id })
  })
})

app.delete('/schedule/:sid', (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: 'schedule-' + req.params.sid,
      sk: 'schedule-' + req.user.email
    }
  }

  dynamoDb.delete(params, function(err, result) {
    if (err) {
      res.status(400).json({ error: 'Could not delete schedule' })
    } else {
      res.json({ status: 'succ' })
    }
  })
})

app.put('/schedule/:sid', (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: 'schedule-' + req.params.sid,
      sk: 'schedule-' + req.user.email
    },
    UpdateExpression: 'set lat=:lat, lon=:lon, tz=:tz, cm=:cm, lang=:lang, imask_delta=:imask_delta, fajr_delta=:fajr_delta, sunrise_delta=:sunrise_delta, dhuhr_delta=:dhuhr_delta, athan_delta=:athan_delta, jamaah_delta=:jamaah_delta, asr_delta=:asr_delta, maghrib_delta=:maghrib_delta, isha_delta=:isha_delta, imask_fixed=:imask_fixed, fajr_fixed=:fajr_fixed, sunrise_fixed=:sunrise_fixed, dhuhr_fixed=:dhuhr_fixed, athan_fixed=:athan_fixed, jamaah_fixed=:jamaah_fixed, asr_fixed=:asr_fixed, maghrib_fixed=:maghrib_fixed, isha_fixed=:isha_fixed',
    ExpressionAttributeValues: {
      ':lat': req.body.lat,
      ':lon': req.body.lon,
      ':tz': req.body.tz,
      ':cm': req.body.cm || 'ISNA',
      ':lang': req.body.lang || 'EN',
      ':imask_delta': req.body.imask_delta || 0,
      ':fajr_delta': req.body.fajr_delta || 0,
      ':sunrise_delta': req.body.sunrise_delta || 0,
      ':dhuhr_delta': req.body.dhuhr_delta || 0,
      ':athan_delta': req.body.athan_delta || 0,
      ':jamaah_delta': req.body.jamaah_delta || 0,
      ':asr_delta': req.body.asr_delta || 0,
      ':maghrib_delta': req.body.maghrib_delta || 0,
      ':isha_delta': req.body.isha_delta || 0,
      ':imask_fixed': req.body.imask_fixed || 0,
      ':fajr_fixed': req.body.fajr_fixed || 0,
      ':sunrise_fixed': req.body.sunrise_fixed || 0,
      ':dhuhr_fixed': req.body.dhuhr_fixed || 0,
      ':athan_fixed': req.body.athan_fixed || 0,
      ':jamaah_fixed': req.body.jamaah_fixed || 0,
      ':asr_fixed': req.body.asr_fixed || 0,
      ':maghrib_fixed': req.body.maghrib_fixed || 0,
      ':isha_fixed': req.body.isha_fixed || 0
    },
    ReturnValues: 'UPDATED_NEW'
  }

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not update schedule' })
    } else {
      res.json({ status: 'succ', data: result.Attributes, id: req.params.sid })
    }
  })
})

app.get('/schedules', (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'GSI',
    KeyConditionExpression: '#sk = :sk',
    ExpressionAttributeNames: {
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':sk': 'schedule-' + req.user.email
    }
  }

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.log(error)
      res.status(400).json({ error: 'Could not get schedule' })
    } else {
      console.log('Query succeeded.')
      res.json({ status: 'succ', data: result.Items })
    }
  })
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

module.exports.handler = serverless(app)
