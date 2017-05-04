store = {
	currentNode: '',
	previousNode: '',
}


console.log('in background')
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('wikipedia.org') > -1){
    chrome.pageAction.show(tab.id)
  }
})

const postNode = (body) => {
  fetch('http://localhost:8000/api/nodes', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
      body: JSON.stringify(body),
    })
	.then((res) => {
		return res.json()
	})
	.then(nodeData=> {
	  store.previousNode = store.currentNode
	  store.currentNode = nodeData.id
	  let historyData= {
	  	userId: 1,
	  	newNode: nodeData.id
	  }
	  fetch('http://localhost:8000/api/history', {
    	method: 'POST',
    	headers: {
      	"Content-type": "application/json"
    	},
      	body: JSON.stringify(historyData),
    	})
	  .then((res) => {
		return res.json()
		})
	.then((historyData) => {
	  let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode, 
	  	isHyperText: true,
	  	userId: 1
	  }
	  return linkData
	})
	.then(linkData=> {
	  if (linkData.source!='') {
	  fetch('http://localhost:8000/api/links', {
	  	method: 'POST', 
	  	headers: {
      "Content-type": "application/json"
      }, 
        body: JSON.stringify(linkData)
	  })
	  .then(res=>{
 		return res.json()
	  })
	  .then(resjson=> {
	  	console.log('row inserted into links: ', resjson)
	  })
	}
	})
	})
	}

const getUser = (userId) => {
	 return fetch(`http://localhost:8000/api/users/${userId}`, {
    method: 'GET',
    })
		.then((res) => {
			return res.json()
		})
    .then(results => {
      console.log('results inside getUser', results)
      return results
    })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				postNode(request.data)
				break
			case 'getUser':
				getUser(request.data, sendResponse)
        .then(results => {
          console.log('results returned from getUser', results)
          sendResponse(results)
        })
				break
			default:
				return console.error('error in switch')
		}

    return true

})
