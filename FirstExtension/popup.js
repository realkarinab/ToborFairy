// chrome.tabs.create({url: 'index.html'});
chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log(token);

    const headers = new Headers({
      'Authorization' : 'Bearer ' + token,
      'Content-Type': 'application/json'
    })

    const queryParams = { headers };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', queryParams)
    .then((response) => response.json()) // Transform the data into json
    .then(function(data) {
        console.log(data);
    })
  });
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
 