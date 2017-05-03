'use strict'

const {Node, Link} = require('../../db/models')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Link.findAll()
      .then(links => res.json(links))
      .catch(next)
  })
  .get('/:userId', (req, res, next) => {
    Link.findAll({
      where: { userId: req.params.userId}
    })
    .then(links => res.json(links))
  })
  .post('/', (req, res, next) => {
    const user = req.body.userId
    const source = req.body.source < req.body.target ? req.body.source : req.body.target
    const target = req.body.source > req.body.target ? req.body.source : req.body.target
    Link.findOrCreate({
      where: {
        userId: user,
        source: source,
        target: target
      },
      defaults: {
        userId: user,
        source: source,
        target: target
      }
    })
    .spread((link, created) => {
      if (created) {
        res.status(201).json(link)
      } else {
        const updated = link.incrementStrength()
        res.json(updated)

      }
    })
    .catch(next)
  })
  .get('/:id', (req, res, next) => {
    Link.findById(req.params.id)
    .then(link => res.json(link))
    .catch(next)
  })
  .put('/:id', (req, res, next) => {
    Link.update(req.body, {
      where: { id: req.params.id }
    })
    .then(link => res.json(link))
    .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    Link.findById(req.params.id)
    .then(link => link.destroy())
    .then(() => res.sendStatus(204))
    .catch(next)
  })
