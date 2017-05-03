chrome.tabs.onUpdated.addListener(function(id, info, tab){
  if(tab.url.indexOf('en.wikipedia.org') > -1){
    console.log('worked')
    chrome.pageAction.show(tab.id)
  }
})
