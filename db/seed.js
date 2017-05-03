const Promise = require('bluebird')
const db = require('./db.js')
const {User, Node, Link, History} = require('./models')

const data = {
  users: [
    {name: 'Chris'}, {name: 'Nick'}, {name: 'Ellie'}
  ],

  nodes: [
    {title: 'A', url: 'wiki/A', visitCount: 4, userId: 1},
    {title: 'B', url: 'wiki/B', visitCount: 2, userId: 1},
    {title: 'C', url: 'wiki/C', visitCount: 1, userId: 1},
    {title: 'D', url: 'wiki/D', visitCount: 1, userId: 1},
    {title: 'E', url: 'wiki/E', visitCount: 1, userId: 1},
  ],

  links: [
    {source: 1, target: 2, isHyperText: true, strength: 2, userId: 1},
    {source: 2, target: 3, isHyperText: true, strength: 1, userId: 1},
    {source: 3, target: 1, isHyperText: true, strength: 1, userId: 1},
    {source: 2, target: 5, isHyperText: true, strength: 1, userId: 1},
    {source: 5, target: 1, isHyperText: true, strength: 1, userId: 1},
    {source: 1, target: 4, isHyperText: true, strength: 2, userId: 1},
  ],

  histories: [
    {userId: 1, history: [1,2,3,1,2,5,1,4,1]}
  ]
}

db.sync({force:true})
  .then(() => {
    console.log('old data was dropped, now inserting')
    const creatingUsers = Promise.map(data.users, user => User.create(user))

    return Promise.resolve(creatingUsers)
  })
  .then(() => {
    console.log('now creating data for nodes and links')
    const creatingNodes = Promise.map(data.nodes, node => Node.create(node))
    const creatingLinks = Promise.map(data.links, link => Link.create(link))
    const creatingHistory = Promise.map(data.histories, history => History.create(history))

    return Promise.all([creatingNodes, creatingLinks])
  })
  .catch(err => {
    console.error('there was a problem', err, err.stack)
  })
  .finally(() => {
    db.close()
    return null
  })