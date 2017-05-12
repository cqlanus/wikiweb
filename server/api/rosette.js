'use strict'

const {User, Node, Link, History} = require('../../db/models')
const getSentimentAnalysis = require('../../chromeExtension/js/rosette/sentiment')

module.exports = require('express').Router()
  .post('/sentiment', (req, res, next) => {
    const nodeIdArr = Object.keys(req.body.nodes)
    Node.findAll({
      where: {
        $or: [
          {userId: req.body.userId},
          {id: {$in: nodeIdArr}}
        ]
      }
    })
    .then(nodes => {
      const content = nodes.map(node => node.content).join('; ')
      return getSentimentAnalysis(content)
    })
    .then(analysis => res.json(analysis))
  })