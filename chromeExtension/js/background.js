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
	googleId: ''
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
  	console.log('in the start auth function')
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
      console.log('in a new url', tab.url)
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
  console.log(end)
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
	let contentPromise =  fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${title}`, {
    	method: 'GET',
	})
	.then((contentRes)=>{
		return (contentRes.json())
	})
	.then(contentOb=>{
		let finalCont=''
		contentOb = contentOb.query.pages
		let contentKeys = Object.keys(contentOb)
		contentKeys.forEach(pageId=>{
			finalCont+=contentOb[pageId].extract
		})
		console.log('content picked up', finalCont)
		return finalCont
	})
	return contentPromise;
}

const postNodePromise = (nodeOb) => {
   //console.log('in postNodePromise', nodeOb)
   let nodeInfoPromise =
     post('nodes/postNode', nodeOb)
     .then((nodeResponse)=>{
   	   //console.log('scuess')
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
	  return resJson[0]
	})
	.then(ew=>{
	  console.log('this is what im returning', ew)
	  return ew
	})
}

const getSelectedNodes = function(requestData) {
  return get(`nodes/user/${requestData.userId}`)
  .then(res => res.json())
  .then(nodesArr => {
    const nodesToReturn = nodesArr.filter(node => {
      return requestData.nodes[node.id]
    })
    return nodesToReturn
  })
}

/* ******* SWITCH LISTENER FOR INCOMING MESSAGES********/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.type){
			case 'postNode':
				request.data['googleId'] = store.googleId
				let title=formatTitle(request.data.title)
				getContentPromise(title)
				.then(contentText=>{
					console.log('contentText', contentText)
					request.data['content']=contentText
					console.log('new request data', request.data)
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
					//console.log('got to end')
					return postLinkPromise(userId)
				})
				break

			case 'getUser':
				//console.log('request.data', request.data)
				getUserPromise(request.data)
				.then((user)=>{
					sendResponse(user)
				})
				return true

      case 'GET_SINGLE_NODE':
        getSelectedNodes(request.data)
        .then(node => {
          sendResponse(node)
        })
        return true

			default:
				return console.error('error in switch')
		}
	//Ellie took this out to fix promises... check if dashboard still works properly
    //return true
})

