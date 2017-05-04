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
	.then(resjson=> {
	  store.previousNode=store.currentNode
	  store.currentNode=resjson.id
	  let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode, 
	  	isHyperText: true,
	  	userId: 1
	  }
	  console.log('linkData', linkData)
	  return linkData;
	})
	.then(linkData=> {
		console.log('in then')
	  if (linkData.source!='') {
	  	console.log('going to fetch')
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
	}

const getUser = (sendReponse) => {
	 fetch('http://localhost:8000/api/users', {
    method: 'GET',
    })
		.then((res) => {
			return res.json()
		})
		.then(resjson=> {
			sendResponse(resjson)
		})
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				postNode(request.data)
				break
			case 'getUser':
				getUser(sendResponse)
				break
			default:
				return console.error('error in switch')
		}


})
