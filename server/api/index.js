'use strict'

const api = module.exports = require('express').Router()

api
  .use('/users', require('./users'))
  .use('/nodes', require('./nodes'))
  .use('/links', require('./links'))
  .use('/categories', require('./categories'))

// No routes matched? 404.
api.use((req, res) => res.status(404).end())