'use strict'

const {Node, Link} = require('../../db/models')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Link.findAll()
      .then(links => res.json(links))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    Link.findById(req.params.id)
    .then(link => res.json(link))
  })
  .get('/user/:userId', (req, res, next) => {
    Link.findAll({
      where: {userId: req.params.userId}
    })
    .then(link => res.json(link))
  })
  .post('/', (req, res, next) => {
    const user = req.body.userId
    const source = req.body.source < req.body.target ? req.body.source : req.body.target
    const target = req.body.source > req.body.target ? req.body.source : req.body.target
    const isHyperText = req.body.isHyperText
    console.log('params', user, source, target, isHyperText)
    Link.findOrCreate({
      where: {
        userId: user,
        source: source,
        target: target,
        isHyperText: isHyperText
      },
      defaults: {
        userId: user,
        source: source,
        target: target,
        isHyperText: isHyperText
      }
    })
    .spread((link, created) => {
      if (created) {
        res.status(201).json(link)
      } else {
        const updated = link.incrementStrength()
        res.json(link)
      }
    })
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
