console.log('in background')
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('wikipedia.org') > -1){
    chrome.pageAction.show(tab.id)
  }
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type==='sendTitle') {
		fetch('http://localhost:8000/api/users/3')
		.then((res) => {
			return res.json()
		})
		.then(resjson=> {
			console.log(resjson)
		})
	}
})
