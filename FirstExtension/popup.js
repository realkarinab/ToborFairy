console.log("this is a popup!")

// chrome.tabs.create({url: 'index.html'});
chrome.storage.local.get("token", function(tokenStored){
    if (!tokenStored) {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            console.log(token);
            chrome.storage.local.set({ "token": token }, function(){});
        });
    } else {
        console.log("stored token: "+ tokenStored.token);
    }
})
 