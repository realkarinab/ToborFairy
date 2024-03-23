console.log("this is a popup!")

// chrome.tabs.create({url: 'index.html'});
chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log(token);
  });