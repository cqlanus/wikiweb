'use strict'

const path = require('path')//never used
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const db = require('../db') //never used
const app = express()

module.exports = app

  .use(bodyParser.urlencoded({extended: true})) //Are you ever going to do this>\?
  .use(bodyParser.json())
  .use(morgan('dev'))

  .use('/api', require('./api'))

  .use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(500)
  })

  const server = app.listen(8000, (err) => {
    if (err) { throw err }
    console.log('--- Started HTTP Server ---')
    console.log('--- Listening on http://localhost:8000 ---')
  })
