const POST_NODE = "postNode"
console.log('in content')


let title = document.getElementById("firstHeading").innerHTML
console.log('TITLE', title)


chrome.runtime.sendMessage({type: POST_NODE, data: {title: title, url: window.location.href, userId: 1}})



