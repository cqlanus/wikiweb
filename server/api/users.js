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
.get('/:id', (req, res, next) => {
    User.findById(req.params.id, {
      include: [Node, Link]
    })
    .then(user => res.json(user))
    .catch(next)
  })
//get user based on googleId
.get('/googleId/:googleId', (req, res, next) => {
    User.findOrCreate( {
        where: {
          googleId: req.params.googleId
        },
        defaults: {
          googleId: req.params.googleId
        },
        include: [Node, Link]
    })
    .then(foundUser => {
      res.json(foundUser)
    })
    .catch(next)
  }
)

  .post('/', (req, res, next) => {
    console.log('in post for user', req.body)
    User.findOrCreate({
      where: {googleId: req.body.googleId}, 
      defaults: {googleId: req.body.googleId}
    })
    .then(res2 => {
      console.log('res', res2)
      res.status(201).json(res2)
    })
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

