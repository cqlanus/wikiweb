const Promise = require('bluebird')
const db = require('./db.js')
const {User, Node, Link, History} = require('./models')
// Could we put all this data into a JSON file?
const data = {
  users: [
    {name: 'Chris', googleId:'115893302668387505418'}, {name: 'Nick', googleId:'215893302668387505418'}, {name: 'Ellie', googleId: '315893302668387505418'}
  ],

  nodes: [
    {title: 'A', url: 'wiki/A', visitCount: 4, userId: 1}, // 1
    {title: 'B', url: 'wiki/B', visitCount: 2, userId: 1}, // 2
    {title: 'C', url: 'wiki/C', visitCount: 1, userId: 1}, // 3
    {title: 'D', url: 'wiki/D', visitCount: 1, userId: 1},//4
    {title: 'E', url: 'wiki/E', visitCount: 2, userId: 1},//5

    {title: 'F', url: 'wiki/F', visitCount: 1, userId: 1},//6
    {title: 'G', url: 'wiki/G', visitCount: 1, userId: 1},//7
    {title: 'H', url: 'wiki/H', visitCount: 2, userId: 1},//8
    {title: 'I', url: 'wiki/I', visitCount: 1, userId: 1},//9
    {title: 'J', url: 'wiki/J', visitCount: 2, userId: 1},//10
    {title: 'K', url: 'wiki/K', visitCount: 2, userId: 1},//11
    {title: 'L', url: 'wiki/L', visitCount: 1, userId: 1},//12
    {title: 'M', url: 'wiki/M', visitCount: 1, userId: 1},//13
    {title: 'N', url: 'wiki/N', visitCount: 2, userId: 1},//14
    {title: 'O', url: 'wiki/O', visitCount: 1, userId: 1},//15
    {title: 'P', url: 'wiki/P', visitCount: 1, userId: 1},//16

  ],

  links: [
    {source: 1, target: 2, isHyperText: true, strength: 2, userId: 1},
    {source: 2, target: 3, isHyperText: true, strength: 1, userId: 1},
    {source: 3, target: 1, isHyperText: true, strength: 1, userId: 1},
    {source: 2, target: 5, isHyperText: true, strength: 1, userId: 1},
    {source: 5, target: 1, isHyperText: true, strength: 1, userId: 1},
    {source: 1, target: 4, isHyperText: true, strength: 2, userId: 1},
    {source: 1, target: 6, isHyperText: true, strength: 1, userId: 1},
    {source: 6, target: 7, isHyperText: true, strength: 1, userId: 1},
    {source: 7, target: 8, isHyperText: true, strength: 1, userId: 1},
    {source: 8, target: 3, isHyperText: true, strength: 1, userId: 1},
    {source: 3, target: 9, isHyperText: true, strength: 1, userId: 1},
    {source: 9, target: 10, isHyperText: true, strength: 1, userId: 1},
    {source: 10, target: 5, isHyperText: true, strength: 2, userId: 1},
    {source: 10, target: 8, isHyperText: true, strength: 1, userId: 1},
    {source: 11, target: 12, isHyperText: true, strength: 1, userId: 1},
    {source: 12, target: 13, isHyperText: true, strength: 1, userId: 1},
    {source: 13, target: 11, isHyperText: true, strength: 1, userId: 1},
    {source: 11, target: 14, isHyperText: true, strength: 1, userId: 1},
    {source: 14, target: 15, isHyperText: true, strength: 1, userId: 1},
    {source: 15, target: 16, isHyperText: true, strength: 1, userId: 1},
    {source: 16, target: 14, isHyperText: true, strength: 1, userId: 1},
  ],

  histories: [
    {userId: 1, history: [1,2,3,1,2,5,1,4,1,6,7,8,3,9,10,5,10,8,11,12,13,11,14,15,16,14]}
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
    const creatingHistory = Promise.map(data.histories, history => History.create(history)) //Why am I just used? You kick off the async operation but never wait for it to resolve

    return Promise.all([creatingNodes, creatingLinks])
  })
  .catch(err => {
    console.error('there was a problem', err, err.stack)
  })
  .finally(() => {
    db.close()
    return null
  })
