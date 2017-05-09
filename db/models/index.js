const db = require('../db');
const Sequelize = require('sequelize')
//Why are all your models in one file?
const Node = db.define('nodes', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,     //validate as url, + getter for full address
   },
  visitCount: { //Specify allowNull - How does this interact with defaultValue?
    type: Sequelize.INTEGER,
    defaultValue: 1,
  }
},{
   instanceMethods: {
      incrementVisitCount: function(){
         this.update({
              visitCount: ++this.visitCount
          })
          //.then??? I think update is going to save already, so .save is extraneous.
         this.save()
         //Why do we return this? Do we handle async?
         // Maybe
          // this.update({
          //     visitCount: ++this.visitCount
          // }).then(model) {
          //   return model
          // }
         return this
      },
   }
 }
)

//Define allowNull - should probably be false oftentimes
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
        //Same thing here
        this.save()
        return this
    },
 }
})

//link has virtual value
//categories of what? Can we be more specific?
const Category = db.define('categories', {
  name: {
    type: Sequelize.STRING
  }
})

const History = db.define('histories', {
  history: {
    // SHould this have a foreign key constraint? What do these integers mean?
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
