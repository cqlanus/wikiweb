'use strict'

const {History, User} = require('../../db/models')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    History.findAll()
      .then(histories => res.json(histories))
      .catch(next)
  })
  //THis is confusing. I would expect it to take the ID of the History you want. Not conventational REST
  // Maybe use a query param to filter user ID
  .get('/:userId', (req, res, next) => {
    History.findAll({
      where: { userId: req.params.userId}
    })
    //res.send/.catch(next)
  })
  .post('/', (req, res, next) => {
    const userId = req.body.userId
    const newNode = parseInt(req.body.newNode) //Sequelize wouldn't do this by default?
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
        //If not created, post updates??
        //Also, update already saves,
        foundHistory.update({
                history: [...foundHistory.history, req.body.newNode]
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