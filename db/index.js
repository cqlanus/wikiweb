const Sequelize = require('Sequelize');
const models = require('./models');



models.Node.sync({})
  .then(function(){
    return models.Link.sync({})
  })
  .then(function(){
    return models.User.sync({})
  })
.then(function () {
    return models.Category.sync({})
})
.catch(console.error);

