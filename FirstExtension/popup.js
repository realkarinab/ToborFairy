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

              // Find club events you can attend
              const eventsYouCanAttend = clubEvents.filter(event => canAttendEvent(event, freeSlots));
              console.log("Events you can attend:", eventsYouCanAttend);
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

          // Find club events you can attend
          const eventsYouCanAttend = clubEvents.filter(event => canAttendEvent(event, freeSlots));
          console.log("Events you can attend:", eventsYouCanAttend);

          // Add events to the user's Google Calendar
          eventsYouCanAttend.forEach(event => {
            insertEventToGoogleCalendar(event, tokenStored.token);
        });
      });
  }
});

// Function to check if a user can attend a club event based on free slots
function canAttendEvent(event, freeSlots) {
  const eventStart = new Date(event.start.dateTime).getTime();
  const eventEnd = new Date(event.end.dateTime).getTime();
  for (const slot of freeSlots) {
      const slotStart = new Date(slot.start).getTime();
      const slotEnd = new Date(slot.end).getTime();
      if (eventStart >= slotStart && eventEnd <= slotEnd) {
          return true; // Event fits within a free slot
      }
  }
  return false; // Event doesn't fit within any free slot
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

// Function to insert an event to the user's Google Calendar
function insertEventToGoogleCalendar(event, token) {
  const headers = new Headers({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
  });

  const body = JSON.stringify(event);

  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: headers,
      body: body
  })
  .then(response => response.json())
  .then(data => console.log('Event added:', data))
  .catch(error => console.error('Error adding event:', error));
}

// Define your club events
const clubEvents = [
  {
      "summary": "SWE Intro to React Workshop",
"organization": "Society of Women Engineers",
      "start": {
          "dateTime": "2024-03-29T18:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-29T19:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/sweutd/"
  },
{
      "summary": "Intro to CTFs",
"organization": "Women in Cybersecurity",
      "start": {
          "dateTime": "2024-03-27T19:00:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-27T20:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/wicys.utd/"
  },
{
      "summary": "SWE Intro to React Workshop",
"organization": "Society of Women Engineers",
      "start": {
          "dateTime": "2024-03-29T18:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-29T19:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/sweutd/"
  },
{
      "summary": "Women in STEM Panel: Discussions in STEM",
"organization": "Association for Computing Machinery",
      "start": {
          "dateTime": "2024-03-27T18:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-27T20:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/acmutd/"
  },
{
      "summary": "Intro to Arduino Workshop",
"organization": "IEEE and SWE",
      "start": {
          "dateTime": "2024-03-29T20:00:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-29T21:00:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/sweutd/"
  },
{
      "summary": "ACM Olympics",
"organization": "Association for Computing Machinery",
      "start": {
          "dateTime": "2024-04-05T10:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-04-05T13:30:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/acmutd/"
  },
{
      "summary": "Interview Workshop",
"organization": "Girls Who Code",
      "start": {
          "dateTime": "2024-03-28T19:00:00-05:00",
          "timeZone": "America/Chicago"
      },
      "end": {
          "dateTime": "2024-03-28T20:00:00-05:00",
          "timeZone": "America/Chicago"
      },
      "link": "https://www.instagram.com/utdgwc/"
  },
];