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
    const userId = req.body.userId
    const newNode = parseInt(req.body.newNode)
    History.findOrCreate({
      where: {
        userId: userId
      },
      defaults: {
        userId: userId,
        history: [newNode]
      }
    })
    .spread((foundHistory, created) => {
      if (!created) {
        foundHistory.update({
                history: [...foundHistory.history, (req.body.newNode)]
              })
        foundHistory.save()
      }
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