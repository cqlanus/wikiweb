const db = require('../db');
const Sequelize = require('sequelize')

const Node = db.define('nodes', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,     //validate as url, + getter for full address
   },
  vistCount: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  }
},{
   instanceMethods: {
      incrementVisitCount: function(){
         return this.update({
              visitCount: this.visitCount++       //test
          })
      },
   }
 }
)

const User = db.define('users', {
  name: {
      type: Sequelize.STRING,
      allowNull: false,
  },
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
        return this.update({
            strength: this.strength++
        })
    },
 }
})

//link has virtual value

const Category = db.define('categories', {
  name: {
    type: Sequelize.STRING
  }
})

  Node.belongsTo(User)  // we want Node.setUser()
  Link.belongsTo(User)  // Link.setUser()


module.exports = {
  Node: Node,
  Link: Link,
  User: User,
  Category: Category,
};
