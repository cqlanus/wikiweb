const Rosette = require('rosette-api')
const variables = require('../../../variables.json')

const getSentimentAnalysis = content => {
  const endpoint = 'sentiment'
  const api = new Rosette(variables.rosette)
  api.parameters.content = content;
  const sentimentPromise = new Promise((resolve, reject) => {
    api.rosette(endpoint, function(err, results){
      if(err){
        reject(err)
      } else {
        resolve(results)
      }
    });
  })

  return sentimentPromise
}

module.exports = getSentimentAnalysis