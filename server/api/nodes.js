'use strict'

const {Node, Link, User} = require('../../db/models')
//set up Rosette
// const variables = require('../../variables.json')
var Api = require('rosette-api')
var api = new Api(process.env.rosette)
let endpoint='categories'
const db = require('../../db')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Node.findAll()
      .then(nodes => res.json(nodes))
      .catch(next)
  })

  .get('/cat', (req, res, next) => {
    Node.findAll({
      attributes: ['category', 'visitCount']
    })
    .then(node => res.json(node))
    .catch(next)
  })

  .get('/:id', (req, res, next) => {
    Node.findById(req.params.id)
    .then(node => res.json(node))
    .catch(next)
  })

  .post('/byId', (req, res, next) => {
    console.log('IN FIND BY ID ROUTE')
    let idArr=req.body
    console.log('idArr', idArr)
    Node.findAll({
      where: {id: idArr}
    })
    .then(node => res.json(node))
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

  .post('/postNode', (req, res, next) => {
    User.findOne({
      where: {googleId: req.body.googleId}
    })
    .then(user=>{
      return user.dataValues.id
    })

    .then(userId=>{
      req.body['userId'] = userId;
      console.log('REQBODYFOR POSTNODE', req.body)
      let content = req.body.content
      api.parameters.content=content

      api.rosette(endpoint, (err, result)=>{
      if (err) {
        console.log(err)
      } else {
        let formattedCat = result.categories[0].label.split('_').join(' ')
        console.log('formattedCat', formattedCat)
        req.body['category']=formattedCat
        console.log('new req body', req.body)
        Node.findOrCreate({
            where: {title: req.body.title},
            defaults: req.body
            })
          .spread((node, created) => {
            console.log('something happened')
            if (created) {
              console.log('node created', node)
              res.status(201).json(node)
            } else {
              const updated = node.incrementVisitCount()
              res.json(node)
            }
           })
        }
      })
    })

  })

  .post('/text', (req, res, next) => {
    const nodeIdArr = Object.keys(req.body.nodes).map(key => parseInt(key))
    const textToFind = req.body.text
    Node.findAll({
      where: {
        id: { $in: nodeIdArr},
        content: {$like: `%${textToFind}%`}
      }
    })
    .then(nodes => {
      res.json(nodes)})
    .catch(next)
  })

  .get('/user/:userId', (req, res, next) => {
    console.log('userId', req.params.userId)
    Node.findAll({
      where: {userId: req.params.userId}
    })
    .then(nodes => res.json(nodes))
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
