'use strict'

const express = require('express')
const hsts = require('hsts')
const corser = require('corser')
const noCache = require('nocache')()
const morgan = require('morgan')
const sha3 = require('web3/lib/utils/sha3')
const bodyParser = require('body-parser')
const config = require('config')
const spdy = require('spdy')
const fs = require('fs')

const verify = require('./verify')

const api = express()
module.exports = api

api.use(hsts({maxAge: 3 * 24 * 60 * 60 * 1000})) // 3 days

// CORS
const allowed = corser.simpleRequestHeaders.concat(['User-Agent'])
api.use(corser.create({requestHeaders: allowed}))

api.use(bodyParser.json())

morgan.token('email', (req) => sha3(req.query.email))
morgan.token('address', (req) => req.query.address)
api.use(morgan(':date[iso] :email :address :status :response-time ms'))

api.post('/', noCache, verify)

api.use((err, req, res, next) => {
  if (res.headersSent) return next()
  console.error(err.stack)
  if (err.isBoom) err = err.output.payload
  return res
  .status(err.output.statusCode || 500)
  .json({status: 'error', message: err.message})
})

const server = spdy.createServer({
  cert: fs.readFileSync(config.http.cert),
  key: fs.readFileSync(config.http.key)
}, api)
server.listen(config.http.port, (err) => {
  if (err) return console.error(err)
  console.info(`Listening on ${config.http.port}.`)
})
