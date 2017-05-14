/* *******
RUNS AS SOON AS EXTENSION IS OPENED
********/

//run startAuth
//then findOrCreate
startAuth()

let store = {
	currentNode: '',
	previousNode: '',
	history: [],
	googleId: '',
  selectedNodes: {}
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
  	console.log('got token', token)
      chrome.identity.getProfileUserInfo(function(info) {
        store.googleId  = info.id;
        checkUser()
        activateListeners();
      })
    //}
  })
}

function makeUniquePageRequest(tab) {
  chrome.history.search({text: '', maxResults: 5}, function(data) {
    if (!isMatchingHashedUrl(data[0].url, data[1].url)) {
      chrome.tabs.sendMessage(tab.id, {action: "requestPageInfo"})
    } else {
    }
  })
}

function post(endRoute, body) {
	return fetch(`http://localhost:8000/api/${endRoute}`, {
  	  method: 'POST',
      headers: {
      "Content-type": "application/json"
      },
      body: JSON.stringify(body),
   })
}

function get(endRoute) {
	return fetch(`http://localhost:8000/api/${endRoute}`, {
    	method: 'GET',
    	})
}

/* ******* HELPER FUNCTIONS ********/


function isMatchingHashedUrl(url1, url2) {
  const firstHash = url1.indexOf('#')
  if (firstHash > -1) {
    const rootUrl1 = url1.substring(0, firstHash)
    const rootUrl2 = url2.substring(0, firstHash)

    return (rootUrl1 === rootUrl2)
  }
  return false
}

function formatTitle(title) {
  let end=title.indexOf(' - Wikipedia')

	title = title.slice(0, end)
	if (title.indexOf(' ')>-1) {
	  newArr=[]
	  title=title.split(' ').join('%20')
	  return title
	} else {
	  return title
	}
}

/* ******* NEED TO PROMISIFY ********/

chrome.tabs.onActivated.addListener(function(tabId) {
	chrome.tabs.sendMessage(tabId.tabId, {action: "requestPageInfo"}, function(response) {})
})

/* ******* RETURN PROMISES  ********/

//postNode returns a promise for info on insertedNode
const getContentPromise = (title) => {
  console.log('title', title)
	let contentPromise =  fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${title}`, {
    	method: 'GET',
	})
	.then((contentRes)=>{
		return (contentRes.json())
	})
	.then(contentOb=>{
    console.log('contentObj from wiki api', contentOb)
		let finalCont=''
		contentOb = contentOb.query.pages
		let contentKeys = Object.keys(contentOb)
		contentKeys.forEach(pageId=>{
			finalCont+=contentOb[pageId].extract
		})
		return finalCont
	})
	return contentPromise;
}

const postNodePromise = (nodeOb) => {
	console.log('nodeOb', nodeOb)
   let nodeInfoPromise =
     post('nodes/postNode', nodeOb)
     .then((nodeResponse)=>{
	   return nodeResponse.json()
     })
   return nodeInfoPromise
}

const checkUser = (nodeOb) => {
	//console.log('in checkUser promise maker')
   let checkUserPromise =
     post('users/', store)
    //  .then((nodeResponse)=>{
   	//    console.log('scuess')
	   // return nodeResponse.json()
    //  })
   //return nodeInfoPromise
}

const postHistoryPromise = function(userId) {
	let historyData= {
	  	userId: userId,
	  	newNode: store.currentNode
	  }
	let historyInfoPromise =
	  post('/history', historyData)
	  .then(hisResponse=>{
   		return hisResponse.json()
   	})
	return historyInfoPromise
}

const postLinkPromise = function(userId) {
	let linkData = {
	  	source: store.previousNode,
	  	target: store.currentNode,
	  	isHyperText: true,
	  	userId: userId
	 }
	 if (linkData.source!='') {
	  	linkInfoPromise =
	  	post('/links', linkData)
	   	.then(linkResponse=>{
	   		return linkResponse.json()
	   	})
	  return linkInfoPromise
	 }
}

const getUserPromise = function(googleId) {
	return get(`users/googleId/${googleId}`)
	.then((res) => {
	  return res.json()
	})
	.then(resJson=>{
	  return resJson
	})
  .catch(console.log)
}

const getSelectedNodes = function(requestData) {
  return getUserPromise(store.googleId)
  .then(user => get(`nodes/user/${user.id}`))
  .then(res => res.json())
  .then(nodesArr => {
    const nodesToReturn = nodesArr.filter(node => {
      return requestData.nodes[node.id]
    })
    return nodesToReturn.length ? nodesToReturn : nodesArr
  })
  .catch(console.log)
}

const getSentimentByUserId = (nodesObj, googleId) => {
  return getUserPromise(store.googleId)
  .then(user => {
    return post('rosette/sentiment', {nodes: nodesObj, userId: user.id})
  })
  .then(res => res.json())
  .then(analysis => analysis)
  .catch(console.log)
}

const getNodesByText = (dataObj) => {
 return post('nodes/text', dataObj)
 .then(res => res.json())
 .then(nodes => nodes)
 .catch(console.log)
}

/* ******* SWITCH LISTENER FOR INCOMING MESSAGES********/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				request.data['googleId'] = store.googleId
				let title=formatTitle(request.data.title)
				getContentPromise(title)
				.then(contentText=>{
					request.data['content']=contentText
					return postNodePromise(request.data)
				})
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
          // console.log('user???', user)
					sendResponse(user)
				})
				return true

      case 'GET_SINGLE_NODE':
        getSelectedNodes(request.data)
        .then(node => {
          sendResponse(node)
        })
        return true

      case 'GET_SENTIMENT_BY_USERID':
        getSentimentByUserId(request.data)
        .then(analysis => {
          sendResponse(analysis)
        })
        return true

      case 'SET_SELECTED':
        store.selectedNodes = request.data
        sendResponse(request.data)
        return true

      case 'GET_SELECTED':
        sendResponse(store.selectedNodes)
        return true

      case 'GET_NODES_BY_TEXT_CONTENT':
        getNodesByText(request.data)
        .then(nodes => sendResponse(nodes))
        return true

			default:
				return console.error('error in switch')
		}
	//Ellie took this out to fix promises... check if dashboard still works properly
    //return true
})

