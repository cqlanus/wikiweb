const POST_NODE = "postNode"


let title = document.getElementById("firstHeading").innerHTML
//console.log('TITLE', title)

chrome.runtime.sendMessage({type: POST_NODE, data: {title: title, url: window.location.href}})



