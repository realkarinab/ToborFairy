chrome.storage.local.get("token", function(tokenStored) {
  if (typeof tokenStored.token == 'undefined') {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
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
          'Authorization': 'Bearer ' + tokenStored.token,
          'Content-Type': 'application/json'
        })
    
        const queryParams = { headers };
      
          fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + new URLSearchParams({
            "timeMin": new Date().toISOString(), "timeMax": new Date(Date.now() + 12096e5).toISOString()
        }), queryParams)
        .then((response) => response.json()) // Transform the data into json
        .then(function(data) {
            console.log(data);

            // Process events to find free slots
            const events = data.items || [];
            const freeSlots = findFreeSlots(events);
            console.log("Free Slots:", freeSlots);
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

        // Process events to find free slots
        const events = data.items || [];
        const freeSlots = findFreeSlots(events);
        console.log("Free Slots:", freeSlots);
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

// Function to find free slots between events
function findFreeSlots(events) {
  const sortedEvents = events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));

  const freeSlots = [];
  let previousEnd = new Date();

  sortedEvents.forEach(event => {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);

      if (start > previousEnd) {
          freeSlots.push({ start: previousEnd, end: start });
      }

      if (event.recurrence) {
          // Handle recurring events
          const recurrence = event.recurrence[0]; // Assuming only one recurrence rule
          const rule = recurrence.split(':')[1]; // Extracting the recurrence rule

          // Get the start date of the event
          let eventStart = new Date(event.start.dateTime);

          // Determine the end date for recurring events (maximum 10 occurrences)
          const maxOccurrences = 10;
          let count = 0;
          while (count < maxOccurrences) {
              count++;
              const endDate = new Date(eventStart.getTime() + 1000 * 60 * 60 * 24 * 7); // Increment by 7 days for weekly events
              const slot = { start: eventStart, end: endDate };
              if (endDate > previousEnd) {
                  freeSlots.push(slot);
              }
              eventStart = endDate;
          }
      }

      previousEnd = end;
  });

  return freeSlots;
}