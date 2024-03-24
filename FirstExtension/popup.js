// chrome.tabs.create({url: 'index.html'});

chrome.storage.local.get("token", function(tokenStored){
    if (typeof tokenStored.token == 'undefined') {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          console.log(token);

          // save token
          chrome.storage.local.set({ "token": token }, function(){});
          getEventsFromToken(token);
          //getFreeBusyFromToken(token);
        });

    } else {
        console.log("stored token: "+ tokenStored.token);

        // getFreeBusyFromToken(tokenStored.token);

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
        }).catch(function(error) {
            chrome.identity.getAuthToken({interactive: true}, function(token) {
              console.log("generated new token:" + token);
              chrome.storage.local.set({ "token": token }, function(){});

              getEventsFromToken(token);
            });
           })
    }
})
 
function getEventsFromToken(token) {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
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
}

function getFreeBusyFromToken(token) {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    const headers = new Headers({
      'Authorization' : 'Bearer ' + token,
      'Content-Type': 'application/json'
    })

    const queryParams = { "method": "POST", body: {
      "timeMin": new Date("2024-03-29T18:30:00-05:00"),
      "timeMax": new Date("2024-03-29T19:30:00-05:00"),
      "timeZone": "America/Chicago",
      "items": [
        {"id": "geekamunk@gmail.com"}
      ]
    }, headers: headers };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', queryParams)
    .then((response) => response.json()) // Transform the data into json
    .then(function(data) {
        console.log(data);
    })
  });
}

