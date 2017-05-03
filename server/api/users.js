'use strict'

const {User, Node, Link} = require('../../db/models')

//const Category = db.model.category
module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    console.log('what is user', User)
    User.findAll()
    .then(users => {
      console.log('hitting the route', users)
      res.json(users)})
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
