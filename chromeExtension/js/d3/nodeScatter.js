const d3 = require('d3')

const createNodeScatter = () => {
  const GET_SINGLE_NODE = 'GET_SINGLE_NODE'
  chrome.runtime.sendMessage({
    type: GET_SINGLE_NODE,
    data: 17
  }, function(node) {
    console.log('we have a node', node)
  })
}

export default createNodeScatter