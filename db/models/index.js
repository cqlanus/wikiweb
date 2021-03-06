const db = require('../db');
const Sequelize = require('sequelize')

//set up Rosette
// const variables = require('../../variables.json')
var Api = require('rosette-api')
var api = new Api(process.env.rosette)


const Node = db.define('nodes', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,     //validate as url, + getter for full address
   },
  visitCount: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  pictureUrl: {
    type: Sequelize.STRING,
    //defaultValue: 'http://placehold.it/350x150'
  },
  content: {
    type: Sequelize.TEXT,
  },
  category: {
    type: Sequelize.STRING,
  },
  datesVisited: {
    type: Sequelize.ARRAY(Sequelize.DATE),
    defaultValue: []
  }
},{
   instanceMethods: {
      incrementVisitCount: function(){
         this.update({
              visitCount: ++this.visitCount
          })
         addVisitDate(this)
         this.save()
         return this
      },
   },
   hooks: {
    beforeCreate: addVisitDate,
    afterUpdate: addVisitDate,
   }
 }
)

function addVisitDate (node) {
  const now = new Date()
  node.datesVisited = [...node.datesVisited, now]
}


const User = db.define('users', {
  name: {
      type: Sequelize.STRING,
  },
  googleId: {
        type: Sequelize.STRING,
        allowNull: true
      }

})

const Link = db.define('links', {
  source: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  target: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isHyperText: {
    type: Sequelize.BOOLEAN,
  },
  strength: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
},{
  instanceMethods: {
    incrementStrength: function(){
        this.update({
            strength: ++this.strength
        })
        this.save()
        return this
    },
 }
})

//link has virtual value

const Category = db.define('categories', {
  name: {
    type: Sequelize.STRING
  }
})

const History = db.define('histories', {
  history: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
})

  Node.belongsTo(User)  // we want Node.setUser()
  User.hasMany(Node)

  Link.belongsTo(User)  // Link.setUser()
  User.hasMany(Link)

  History.belongsTo(User)
  User.hasOne(History)

module.exports = {
  Node: Node,
  Link: Link,
  User: User,
  Category: Category,
  History: History,
};
