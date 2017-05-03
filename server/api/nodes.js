'use strict'

const db = require('../../db')
const Node = db.models('nodes')
const Link = db.models('links')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Node.findAll()
      .then(nodes => res.json(nodes))
      .catch(next)
  })
  .post('/', (req, res, next) => {
    Node.findOrCreate({
      where: req.body // body should have unique name/url combo
    })
    .spread((node, created) => {
      if (created) { res.status(201).json(node)}
      else {
        node.incrementVisitCount()
        res.json(node)
      }
    })
    .catch(next)
  })
  .get('/:id', (req, res, next) => {
    Node.findById(req.params.id, {
      include: [Link]
    })
    .then(node => res.json(node))
    .catch(next)
  })
  .put('/:id', (req, res, next) => {
    Node.update(req.body, {
      where: { id: req.params.id }
    })
    .then(node => res.json(node))
    .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    Node.findById(req.params.id)
    .then(node => node.destroy())
    .then(() => res.sendStatus(204))
    .catch(next)
  })