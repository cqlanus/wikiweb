'use strict'

const {User, Node, Link, History} = require('../../db/models')
const getSentimentAnalysis = require('../../chromeExtension/js/rosette/sentiment')

module.exports = require('express').Router()
  .post('/sentiment', (req, res, next) => {
    getNodes(req)
    .then(nodes => {
      const content = nodes.map(node => node.content).join('; ')
      return getSentimentAnalysis(content)
    })
    .then(analysis => res.json(analysis))
  })

function getNodes(req) {
  const nodeIdArr = Object.keys(req.body.nodes)
    if (nodeIdArr.length) {

      return Node.findAll({
        where: {
          id: {$in: nodeIdArr}
        },
      })
    } else {
      return Node.findAll({
        where: {
          userId: req.body.userId
        },
        limit: 20
      })
    }
}