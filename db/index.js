const db = require('./db')
require('./models')


const syncedPromise = db.sync()
  .then(function(database){
    console.log('SYNCED')
  })
  .catch(console.log)

module.exports = syncedPromise
