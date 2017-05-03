
let post = document.getElementById("firstHeading")
let title = post.innerHTML
console.log('TITLE', title)
chrome.runtime.sendMessage({type: 'sendTitle', data: title})