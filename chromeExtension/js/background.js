/* ******* 
RUNS AS SOON AS EXTENSION IS OPENED
********/

let store = {
	currentNode: '',
	previousNode: '',
	history: [],
	googleId: ''
}

if (store.googleId) {
  console.log('googleId on store already exists', store.googleId)
  activateListeners();
}
else {
  chrome.identity.getProfileUserInfo(function(info){
    if( info.id !== '' ) {
    	console.log('googleId on google profile exists')
        store.googleId  = info.id
        activateListeners();
    } else { 
    	console.log('needed to authenticate')
    	startAuth() }
    })
}


/* *******  Wrappers ********/
function activateListeners() {
	chrome.tabs.onUpdated.addListener(function(id, info, tab){
	  if(tab.url.indexOf('wikipedia.org') > -1){
	    chrome.pageAction.show(tab.id)
	  }

	  if (info.status==='complete' && tab.active && tab.url!='https://www.wikipedia.org/' && tab.url!='https://en.wikipedia.org/wiki/Main_Page' ) {
	  	makeUniquePageRequest(tab)
	  }
	})
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

/* ******* NEED TO PROMISIFY ********/


chrome.tabs.onActivated.addListener(function(tabId) {
	chrome.tabs.sendMessage(tabId.tabId, {action: "requestPageInfo"}, function(response) {})
})

/* ******* RETURNS PROMISES  ********/

//postNode returns a promise for info on insertedNode
const postNodePromise = (nodeOb) => {
  return fetch('http://localhost:8000/api/nodes/postNode', {
  	method: 'POST',
      headers: {
      "Content-type": "application/json"
      },
      body: JSON.stringify(nodeOb),
   })
   .then((nodeResponse)=>{
		return nodeResponse.json()
	})
}

const postHistoryPromise = function(userId) {
	let historyData= {
	  	userId: userId,
	  	newNode: store.currentNode
	  }
	return promiseForUpdatedHistory = fetch('http://localhost:8000/api/history/', {
  	  method: 'POST',
      headers: {
      "Content-type": "application/json"
      },
      body: JSON.stringify(historyData),
   	})
   	.then(hisResponse=>{
   		return hisResponse.json()
   	})
}

const postLinkPromise = function(userId) {
	let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode,
	  	isHyperText: true,
	  	userId: userId
	 }
	 console.log('linkData', linkData)
	 if (linkData.source!='') {
	  	return fetch('http://localhost:8000/api/links', {
	    	method: 'POST',
	    	headers: {
	      	"Content-type": "application/json"
	    	},
	      	body: JSON.stringify(linkData),
	   	})
	   	.then(linkResponse=>{
	   		return linkResponse.json()
	   	})
	 }
}

const getUserPromise = function(googleId) {
	return fetch(`http://localhost:8000/api/users/googleId/${googleId}`, {
    	method: 'GET',
    	})
		.then((res) => {
			return res.json()
		})
}

/* ******* SWITCH LISTENER FOR INCOMING MESSAGES********/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				request.data['googleId'] = store.googleId
				return postNodePromise(request.data)
				.then(node=>{
					store.previousNode = store.currentNode
					store.currentNode = node.id
					return node.userId
				})
				.then(userId => {
					return postHistoryPromise(userId)
				})
				.then(history=>{
					store.history = history.history
					return history.userId
				})
				.then(userId=>{
					return postLinkPromise(userId)
				})
				break

			case 'getUser':
				getUserPromise(request.data)
				.then((user)=>{
					sendResponse(user)
				})
				return true
			default:
				return console.error('error in switch')
		}
    return true
})

