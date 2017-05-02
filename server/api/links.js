'use strict'

const db = require('../../db')
const Link = db.models('links')
const Node = db.models('nodes')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Link.findAll()
      .then(links => res.json(links))
      .catch(next)
  })
  .get('/:userId', (req, res, next) => {
    Link.findAll({
      where: { user_id: req.params.userId}
    })
    .then(links => res.json(links))
  })
  .post('/', (req, res, next) => {
    const user = req.body.user
    const source = req.body.source
    const target = req.body.target
    Link.findOrCreate({
      where: {
        user_id: user,
        $or: {
          $and: { source: source, target: target },
          $and: { source: target, target: source }
        }
      },
      defaults: {
        value: 1
      }
    })
    .spread((link, created) => {
      if (created) {
        res.json(link)
      } else {
        link.incrementValue()
        res.sendStatus(204) // another status?
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
    .then(() => res.status(200).end())
    .catch(next)
  })