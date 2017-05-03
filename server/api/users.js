'use strict'

const db = require('../../db')
const User = db.model('users')
const Node = db.model('nodes')
const Link = db.model('links')
const Category = db.model('categories')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    User.findAll()
    .then(users => res.json(users))
    .catch(next)
  })
  .post('/', (req, res, next) => {
    User.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(next)
  })
  .get('/:id', (req, res, next) => {
    User.findById(req.params.id, {
      include: [Node, Link]
    })
    .then(user => res.json(user))
    .catch(next)
  })
  .put('/:id', (req, res, next) => {
    User.update(req.body, {
      where: { id: req.params.id }
    })
    .then(user => res.json(user))
    .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(user => user.destroy())
    .then(() => res.status(200).end())
    .catch(next)
  })
