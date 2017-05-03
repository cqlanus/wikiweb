const Sequelize = require('sequelize');
const db =  new Sequelize('postgres://localhost:5432/wikiweb');

const Node = db.define('node', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,

   },
  vistCount: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
},{
   instanceMethods: {
      incrementVisitCount: function(){

         return Node.put({
              visitCount: this.visitCount++
          })
      },
   }
)

const User = db.define('user', {
  userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
  },
})

const Link = db.define('link', {
  source: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  target: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hyperText: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  strength: {
    type:Sequelize.INTEGER
  }

},{
  instanceMethods: {
    incrementVisitCount: function(){
        return Link.put({
            visitCount: this.visitCount++
        })
    },
})

//link has virtual value

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING
  }
})

//node always belongs to user
//links belongs to user

module.exports = {
  Node: Node,
  Link: Link,
  User: User,
  Category: Category,
  db: db
};
