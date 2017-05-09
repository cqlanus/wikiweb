'use strict'

const {Node, Link} = require('../../db/models')

module.exports = require('express').Router()
  .get('/', (req, res, next) => {
    Link.findAll()
      .then(links => res.json(links))
      .catch(next)
  })
  //weirrrrddddd
  .get('/:userId', (req, res, next) => {
    Link.findAll({
      where: { userId: req.params.userId}
    })
    .then(links => res.json(links))
  })
  .post('/', (req, res, next) => {
    const user = req.body.userId //Not needed
    //Can you wrap this logic in function names that make it clear what you're doing?
    const source = req.body.source < req.body.target ? req.body.source : req.body.target
    const target = req.body.source > req.body.target ? req.body.source : req.body.target
    const isHyperText = req.body.isHyperText //Not needed
    Link.findOrCreate({
      where: {
        userId: user,
        source: source,
        target: target,
        isHyperText: isHyperText
      },
      defaults: {
        userId: user,
        source: source,
        target: target,
        isHyperText: isHyperText
      }
    })
    .spread((link, created) => {
      if (created) {
        res.status(201).json(link)
      } else {
        //You should always make new links and be doing aggregate queries to determine strength
        const updated = link.incrementStrength()
        res.json(updated)

      }
    })
    .catch(next)
  })
  //Will never run
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
    .then(() => res.sendStatus(204))
    .catch(next)
  })
