const POST_NODE = "postNode"
const GET_USER = "getUser"
console.log('in content')


let title = document.getElementById("firstHeading").innerHTML
console.log('TITLE', title)


chrome.runtime.sendMessage({type: POST_NODE, data: {title: title, url: window.location.href, userId: 1}})

chrome.runtime.sendMessage({type: GET_USER, data: 2})


