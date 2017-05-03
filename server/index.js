'use strict'

const path = require('path')
const express = require('path')
const bodyParser = require('body-parser')

const app = express()

const db = require('../db')

module.exports = app

  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())

  .use('/api', require('./api'))

  .use((err, req, res, next) => {
    console.log(err)
    res.sendStatus(500)
  })


  const server = app.listen(8000, (err) => {
    if (err) { throw err }
    console.log('--- Started HTTP Server ---')
    console.log('--- Listening on http://localhost:8000 ---')

    db.sync()
      .then(() => console.log('DB synced and connected'))
  })