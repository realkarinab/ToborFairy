chrome.storage.local.get("token", function(tokenStored) {
  if (typeof tokenStored.token == 'undefined') {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
          console.log(token);

          // Save token
          chrome.storage.local.set({ "token": token }, function() {});

          const headers = new Headers({
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
          });

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
              });
      });
  } else {
      console.log("Stored token: " + tokenStored.token);

      const headers = new Headers({
          'Authorization': 'Bearer ' + tokenStored.token,
          'Content-Type': 'application/json'
      });

      const queryParams = { headers };

      fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + new URLSearchParams({
              "timeMin": new Date().toISOString(),
              "timeMax": new Date(Date.now() + 12096e5).toISOString()
          }), queryParams)
          .then((response) => response.json()) // Transform the data into json
          .then(function(data) {
              console.log(data);

              // Process events to find free slots
              const events = data.items || [];
              const freeSlots = findFreeSlots(events);
              console.log("Free Slots:", freeSlots);
          });
  }
});

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
