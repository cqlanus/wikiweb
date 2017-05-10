'use strict'

const {Node, Link, User} = require('../../db/models')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Node.findAll()
      .then(nodes => res.json(nodes))
      .catch(next)
  })

  .post('/postNode', (req, res, next) => {
    User.findOne({
      where: {googleId: req.body.googleId}
    })
    .then(user=>{
      return user.dataValues.id
    })
    .then(userId=>{
      req.body['userId'] = userId;
      return Node.findOrCreate({
        where: {title: req.body.title},
        defaults: req.body
      })
    })
    .spread((node, created) => {
      console.log('node', node)
      if (created) { 
        res.status(201).json(node)}
      else {
        const updated = node.incrementVisitCount()
        res.json(node)
      }
    })
    .catch(next)
    })
  

  .post('/', (req, res, next) => {
    console.log('req body',req.body)
    Node.findOrCreate({
      where: { title: req.body.title}, // body should have unique name/url combo
      defaults: req.body
    })
    .spread((node, created) => {
      if (created) { res.status(201).json(node)}
      else {
        const updated = node.incrementVisitCount()
        res.json(updated)
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
