const POST_NODE = "postNode"
const GET_USER = "getUser"


console.log('this is local users id',  chrome.storage.local.get(["userId"], function(items){
   console.log('items')
}))

//https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Dog

let imgSrc = document.getElementsByClassName('thumbimage')[0] ? document.getElementsByClassName('thumbimage')[0].currentSrc : '';

chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action === 'requestPageInfo') {
		let title = document.title
    console.log('title', title)
		chrome.runtime.sendMessage({type: POST_NODE, data: {title: title, url: window.location.href, pictureUrl: imgSrc}})
	}

})

