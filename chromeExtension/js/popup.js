const dashButton = document.getElementById('toDash')
const authButton = document.getElementById('auth')

dashButton.addEventListener('click', function(evt) {
  chrome.tabs.create({
    url: chrome.runtime.getURL('views/dashboard.html')
  })
})

authButton.addEventListener('click', function(evt){
  chrome.runtime.sendMessage({'type': "START_AUTH"})

})
