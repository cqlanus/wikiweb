const Sequelize = require('sequelize');
const db =  new Sequelize('postgres://localhost:5432/wikiweb');



const Node = db.define('node', {
  name: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,

   },
  vistCount: {
    type: Sequelize.INTEGER,
  },
})

const User = db.define('user', {
  userId: {
      type: Sequelize.INTEGER,
  },
})

const Link = db.define('link', {
  source: {
    type: Sequelize.STRING,
  },
  target: {
    type: Sequelize.STRING,
  },
  hyperText: {
    type: Sequelize.BOOLEAN,
  }

})
//link has virtual value

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING
  }
})


//node belongs to

module.exports = {
  Node: Node,
  Link: Link,
  User: User,
  Category: Category,
  db: db
};
