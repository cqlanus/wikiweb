const POST_NODE = "postNode"
const GET_USER = "getUser"
console.log('in content')

console.log('this is local users id',  chrome.storage.local.get(["userId"], function(items){
   console.log('items')
}))

chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action === 'requestPageInfo') {
		let title = document.getElementById("firstHeading").innerHTML
		console.log('title', title)
		chrome.runtime.sendMessage({type: POST_NODE, data: {title: title, url: window.location.href, userId: 1}})
	}

})

