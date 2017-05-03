'use strict'

const db = require('../../db')
const History = db.History
const User = db.User

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    History.findAll()
      .then(histories => res.json(histories))
      .catch(next)
  })
  .get('/:userId', (req, res, next) => {
    History.findAll({
      where: { userId: req.params.userId}
    })
  })
  .post('/', (req, res, next) => {
    History.findOne({
      where: { userId: req.body.userId }
    })
    then(history => {
      history.history.push(req.body.nodeId)
      return history.save()
    })
    .then(history => res.status(200).json(history))
    .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    History.findById(req.params.id)
    .then(history => history.destroy())
    .then(() => res.sendStatus(204))
    .catch(next)
  })