const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const dynamoDb = require('./dynamodb')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check')
const app = express()
const jwt_key = process.env.JWT_KEY

app.use(bodyParser.json({ strict: false }))
app.use(
  expressJWT({
    secret: jwt_key
  }).unless({
    path: ['/user/login', '/user/register']
  })
)
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'jwt token error' })
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
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
