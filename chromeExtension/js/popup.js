const dashButton = document.getElementById('toDash')

dashButton.addEventListener('click', function(evt) {
  chrome.tabs.create({
    url: chrome.runtime.getURL('views/dashboard.html')
  })
})