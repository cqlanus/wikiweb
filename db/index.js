const db = require('./db')
require('./models')


const syncedPromise = db.sync({force: true})
  .then(function(){
    console.log('SYNCED')
  })
  .catch(console.log)

module.exports = syncedPromise
