/* ******* dont forget :
	- create new History array for user doesn't work yet
********/

let store = {
	currentNode: '',
	previousNode: '',
	history: [],
	googleId: ''
}

if (checkStoreGoogleId()) {
  console.log('store.googleId already exists', store.googleId)
  activateListeners();
}
else {
  chrome.identity.getProfileUserInfo(function(info){
    if( info.id !== '' ) {
    	console.log('googleId on info exists')
        store.googleId  = info.id
        activateListeners();
    } else {
    	console.log('needed to authenticate')
    	startAuth() }
    })
    }


/* ******* ACTIVATE EXTENSION WHEN MATCHING  ********/
function activateListeners() {
	chrome.tabs.onUpdated.addListener(function(id, info, tab){
	  if(tab.url.indexOf('wikipedia.org') > -1){
	    chrome.pageAction.show(tab.id)
	  }

	  if (info.status === 'complete' && tab.active) {
	  	console.log('making page request to postNode, googleId: ', store.googleId)
	  	makeUniquePageRequest(tab)
	  }
	})
}

function checkStoreGoogleId(){
  return store.googleId === '' ? false : true
}

function startAuth() {
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
	else {
      chrome.identity.getProfileUserInfo(function(info) {
        store.googleId  = info.id;
        activateListeners();
      })
    }
  })
}

function makeUniquePageRequest(tab) {
  chrome.history.search({text: '', maxResults: 5}, function(data) {
    if (!isMatchingHashedUrl(data[0].url, data[1].url)) {
      console.log('in a new url', tab.url)
      chrome.tabs.sendMessage(tab.id, {action: "requestPageInfo"})
    } else {
      console.log('in a sub page!')
    }
  })
}

function isMatchingHashedUrl(url1, url2) {
  const firstHash = url1.indexOf('#')
  if (firstHash > -1) {
    const rootUrl1 = url1.substring(0, firstHash)
    const rootUrl2 = url2.substring(0, firstHash)

    return (rootUrl1 === rootUrl2)
  }
  return false
}

/* ******* SENDS MESSAGE TO CONTENT WHEN NEW ACTIVE TAB  ********/

chrome.tabs.onActivated.addListener(function(tabId) {
	// console.log('Tab Changed with current Id: ', tabId)
	chrome.tabs.sendMessage(tabId.tabId, {action: "requestPageInfo"}, function(response) {})
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

const getUserId = function(){
  return chrome.identity.getProfileUserInfo(function(info){ return info.id })
}

/* ******* ASYNC THUNKS  ********/

const fetchUser = function(googleId) {
	return fetch(`http://localhost:8000/api/users/googleId/${googleId}`, {
    	method: 'GET',
    	})
		.then((res) => {
			return res.json()
		})
    	.then(results => {
      		console.log('results inside getUser', results)
      		return results[0]
    	})
}

const fetchNodeData = function(nodeInfo) {
	return fetch(`http://localhost:8000/api/users/googleId/${nodeInfo.googleId}`, {
    	method: 'GET',
    })
    .then(userRow=>{
    	return userRow.json()
    })
    .then(userJSON=>{
    	nodeInfo['userId'] = userJSON[0].id
    	return nodeInfo
    })
    .then(nodeInfo=>{
		return fetch('http://localhost:8000/api/nodes', {
	      method: 'POST',
	      headers: {
	      "Content-type": "application/json"
	      },
	      body: JSON.stringify(nodeInfo),
	    })
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

const fetchSingleNode = function(nodeId) {
  console.log('we have a nodeid', nodeId)
  return fetch(`http://localhost:8000/api/nodes/${nodeId}`, {
    method: 'GET'
  })
  .then(res => res.json())
  .then(node => {
    return node
  })
}

/* ******* SWITCH LISTENER  ********/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				request.data['googleId'] = store.googleId
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

      case 'GET_SINGLE_NODE':
        fetchSingleNode(request.data)
        .then(node => {
          console.log('node?')
          sendResponse(node)
        })
        return true

			default:
				return console.error('error in switch')
		}
    return true
})
