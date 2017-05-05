/* ******* dont forget :
	- create new History array for user doesn't work yet
********/

/******  OAUTH *******/

// var oauth = ChromeExOAuth.initBackgroundPage({
//   'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
//   'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
//   'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
//   'consumer_key': 'anonymous',
//   'consumer_secret': 'anonymous',
//   'scope': 'https://docs.google.com/auth/drive',
//   'app_name': 'WikiWebJr'
// });



// function callback(resp, xhr) {
// 	console.log('in callback reponse', resp)
// }

// function onAuthorized() {
//   var url = 'https://docs.google.com/feeds/default/private/full';
//   var request = {
//     'method': 'GET',
//     'parameters': {'alt': 'json'}
//   }

//   // Send: GET https://docs.google.com/feeds/default/private/full?alt=json
//   oauth.sendSignedRequest(url, callback, request);
// }

// oauth.authorize(onAuthorized);




/* ******* STORE ********/

store = {
	currentNode: '',
	previousNode: '',
	history: [],
}

/* ******* ACTIVATE EXTENSION WHEN MATCHING  ********/

chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('wikipedia.org') > -1){
    chrome.pageAction.show(tab.id)
  }
})

/* ******* ACTIONS  ********/


const postNode = (nodeOb) => {
  	return fetchNodeData(nodeOb)
	.then(nodeData=> {
	  store.previousNode = store.currentNode
	  store.currentNode = nodeData.id
	})
}

const postHistory = function(userId) {
	let historyData= {
	  	userId: userId,
	  	newNode: store.currentNode
	  }
	  return fetchHistoryData(historyData)
	  .then(historyRow=>{
	  	store.history = historyRow.history
	  })
}

const postLink = function() {
	let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode,
	  	isHyperText: true,
	  	userId: 1
	 }
	 if (linkData.source!='') {
	  	return fetchLinkData(linkData)
	 }
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
				return postNode(request.data)
				.then(()=>{
					return postHistory(1)
				})
				.then(()=>{
					return postLink();
				})
				.then((resjson)=>{
					console.log('row inserted into links: ', resjson)
				})
				break
			case 'getUser':
				fetchUser(request.data)
				.then((user)=>{
					sendResponse(user)
				})
				return true
				case 'START_AUTH':
					 chrome.identity.getAuthToken({"interactive": true}, function(token){
    				console.log('this is token', token)
  				})
					break;

			default:
				return console.error('error in switch')
		}

    return true

})
