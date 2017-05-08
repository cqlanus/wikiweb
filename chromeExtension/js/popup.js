const dashButton = document.getElementById('toDash')
const authButton = document.getElementById('auth')

dashButton.addEventListener('click', function(evt) {
  chrome.tabs.create({
    url: chrome.runtime.getURL('views/dashboard.html')
  })
})
