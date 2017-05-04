
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
			console.log(resjson)
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
