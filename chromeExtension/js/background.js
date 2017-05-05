/* ******* dont forget :
	- create new History array for user doesn't work yet
********/



/* ******* STORE ********/

store = {
	currentNode: '',
	previousNode: '',
}

/* ******* ACTIVATE EXTENSION WHEN MATCHING  ********/

chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('wikipedia.org') > -1){
    chrome.pageAction.show(tab.id)
  }
})

/* ******* ACTIONS  ********/


const postNode = (nodeOb) => {
  	fetchNodeData(nodeOb)
	.then(nodeData=> {
	  store.previousNode = store.currentNode
	  store.currentNode = nodeData.id
	  let historyData= {
	  	userId: 1,
	  	newNode: nodeData.id
	  }
	  fetchHistoryData(historyData)
	  .then((historyData) => {
	  	let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode, 
	  	isHyperText: true,
	  	userId: 1
	  	}
	  	if (linkData.source!='') {
	  	  fetchLinkData(linkData)
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
	  fetchUser(userId)
	    .then(res=>{
	    	console.log('res', res)
	    })
	}

/* ******* ASYNC THUNKS  ********/

const fetchUser = function(userId) {
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

const fetchNodeData = function(nodeInfo) {
	return fetch('http://localhost:8000/api/nodes', {
      method: 'POST',
      headers: {
      "Content-type": "application/json"
      },
      body: JSON.stringify(nodeInfo),
    })
	.then((nodeRes) => {
		return nodeRes.json()
	})
}

const fetchHistoryData = function(historyInfo) {
	return fetch('http://localhost:8000/api/history', {
    	method: 'POST',
    	headers: {
      	"Content-type": "application/json"
    	},
      	body: JSON.stringify(historyInfo),
   	})
	.then((historyRes) => {
		return historyRes.json()
	})
}

const fetchLinkData = function(linkInfo) {
  return fetch('http://localhost:8000/api/links', {
    method: 'POST', 
    headers: {
    "Content-type": "application/json"
	}, 
	body: JSON.stringify(linkInfo)
})

}



/* ******* SWITCH LISTENER  ********/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				postNode(request.data)
				break
			case 'getUser':
				getUser(request.data)
				break
			default:
				return console.error('error in switch')
		}

    return true

})
