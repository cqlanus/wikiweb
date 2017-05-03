'use strict'

const {History, User} = require('../../db/models')

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
    .then(foundHistory => {
      foundHistory.update({
              history: [...foundHistory.history, parseInt(req.body.nodeId)]
            })
      foundHistory.save()
      return foundHistory
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