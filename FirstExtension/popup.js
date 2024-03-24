// chrome.tabs.create({url: 'index.html'});

chrome.storage.local.get("token", function(tokenStored){
    if (typeof tokenStored.token == 'undefined') {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          console.log(token);

          // save token
          chrome.storage.local.set({ "token": token }, function(){});
      
          const headers = new Headers({
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
          })
      
          const queryParams = { headers };
      
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + new URLSearchParams({
            "timeMin": new Date().toISOString()
        }), queryParams)
          .then((response) => response.json()) // Transform the data into json
          .then(function(data) {
              console.log(data);
          })
        });

    } else {
        console.log("stored token: "+ tokenStored.token);

        const headers = new Headers({
          'Authorization' : 'Bearer ' + tokenStored.token,
          'Content-Type': 'application/json'
        })
    
        const queryParams = { headers };
      
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + new URLSearchParams({
            "timeMin": new Date().toISOString(), "timeMax": new Date(Date.now() + 12096e5).toISOString()
        }), queryParams)
        .then((response) => response.json()) // Transform the data into json
        .then(function(data) {
            console.log(data);
        })
    }
})
 