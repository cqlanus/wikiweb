//const axios = require('axios')
chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('wikipedia.org') > -1){
    console.log('worked')
    chrome.pageAction.show(tab.id)
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type==='sendTitle') {
		console.log(request.data)
		jQuery.ajax('/api/users/3', {
			method: 'GET',
			success: function(user) {
				console.log('user', user)
			},
			error: function() {
				console.log('error')
			}
		})

	}
})
