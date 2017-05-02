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
  .get('/:userId/:sourceId/:targetId', (req, res, next) => {
    const user = req.params.userId
    const source = req.params.sourceId
    const target = req.params.targetId
    Link.findAll({
      where: {
        user_id: user,
        $or: {
          $and: {
            source: source,
            target: target
          },
          $and: {
            source: target,
            target: source
          }
        }
      }
    })
    .then(links => res.json(links))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    Link.create(req.body)
      .then(link => res.status(201).json(link))
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