const Promise = require('bluebird')
const db = require('./db.js')
const {User, Node, Link, History} = require('./models')

const data = {
  users: [
    {name: 'Chris', googleId:'115893302668387505418'}, {name: 'Nick', googleId:'215893302668387505418'}, {name: 'Ellie', googleId: '115897382801290454219'}
  ],

  nodes: [
    
  {title: 'A', url: 'wiki/A', visitCount: 4, userId: 3, content: 'hi'}, // 1
  //   {title: 'B', url: 'wiki/B', visitCount: 2, userId: 3, content: 'hi'}, // 2
  //   {title: 'C', url: 'wiki/C', visitCount: 1, userId: 3, content: 'hi'}, // 3
  //   {title: 'D', url: 'wiki/D', visitCount: 1, userId: 3, content: 'hi'},//4
  //   {title: 'E', url: 'wiki/E', visitCount: 2, userId: 3, content: 'hi'},//5

  //   {title: 'F', url: 'wiki/F', visitCount: 1, userId: 3, content: 'hi'},//6
  //   {title: 'G', url: 'wiki/G', visitCount: 1, userId: 3, content: 'hi'},//7
  //   {title: 'H', url: 'wiki/H', visitCount: 2, userId: 3, content: 'hi'},//8
  //   {title: 'I', url: 'wiki/I', visitCount: 1, userId: 3, content: 'hi'},//9
  //   {title: 'J', url: 'wiki/J', visitCount: 2, userId: 3, content: 'hi'},//10
  //   {title: 'K', url: 'wiki/K', visitCount: 2, userId: 3, content: 'hi'},//11
  //   {title: 'L', url: 'wiki/L', visitCount: 1, userId: 3, content: 'hi'},//12
  //   {title: 'M', url: 'wiki/M', visitCount: 1, userId: 3, content: 'hi'},//13
  //   {title: 'N', url: 'wiki/N', visitCount: 2, userId: 3, content: 'hi'},//14
  //   {title: 'O', url: 'wiki/O', visitCount: 1, userId: 3, content: 'hi'},//15
  //   {title: 'P', url: 'wiki/P', visitCount: 1, userId: 3, content: 'hi'},//16
],

  links: [
    //{source: 1, target: 2, isHyperText: true, strength: 2, userId: 3},
    // {source: 2, target: 3, isHyperText: true, strength: 1, userId: 3},
    // {source: 3, target: 1, isHyperText: true, strength: 1, userId: 3},
    // {source: 2, target: 5, isHyperText: true, strength: 1, userId: 3},
    // {source: 5, target: 1, isHyperText: true, strength: 1, userId: 3},
    // {source: 1, target: 4, isHyperText: true, strength: 2, userId: 3},
    // {source: 1, target: 6, isHyperText: true, strength: 1, userId: 3},
    // {source: 6, target: 7, isHyperText: true, strength: 1, userId: 3},
    // {source: 7, target: 8, isHyperText: true, strength: 1, userId: 3},
    // {source: 8, target: 3, isHyperText: true, strength: 1, userId: 3},
    // {source: 3, target: 9, isHyperText: true, strength: 1, userId: 3},
    // {source: 9, target: 10, isHyperText: true, strength: 1, userId: 3},
    // {source: 10, target: 5, isHyperText: true, strength: 2, userId: 3},
    // {source: 10, target: 8, isHyperText: true, strength: 1, userId: 3},
    // {source: 11, target: 12, isHyperText: true, strength: 1, userId: 3},
    // {source: 12, target: 13, isHyperText: true, strength: 1, userId: 3},
    // {source: 13, target: 11, isHyperText: true, strength: 1, userId: 3},
    // {source: 11, target: 14, isHyperText: true, strength: 1, userId: 3},
    // {source: 14, target: 15, isHyperText: true, strength: 1, userId: 3},
    // {source: 15, target: 16, isHyperText: true, strength: 1, userId: 3},
    // {source: 16, target: 14, isHyperText: true, strength: 1, userId: 3},
  ],

  histories: [
    //{userId: 3, history: [1,2,3,1,2,5,1,4,1,6,7,8,3,9,10,5,10,8,11,12,13,11,14,15,16,14]}
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

    return Promise.all([creatingNodes, creatingLinks, creatingHistory])
  })
  .catch(err => {
    console.error('there was a problem', err, err.stack)
  })
  .finally(() => {
    db.close()
    return null
  })
