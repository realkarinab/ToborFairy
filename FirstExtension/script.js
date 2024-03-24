// Function to generate event card HTML
function createEventCard(clubName, eventName, eventTime, eventLocation) {
    return `
    <div class="card">
        <div class="club-name">
            <span class="club-text">${clubName}</span>
        </div>
        <div class="event-info">
            <span class="event-name">${eventName}</span>
            <div id="time-container">
                <span class="event-time">${eventTime}</span>
                <span class="event-location">${eventLocation}</span>
            </div>
        </div>
        <button class= "circle button1">
            <span class = "plus">+</span>
        </button>
    </div>
    `;
}

// Function to add event card to the cards container
function addEventCard(clubName, eventName, eventTime, eventLocation) {
    const cardsContainer = document.getElementById('cards-container');
    const eventCardHTML = createEventCard(clubName, eventName, eventTime, eventLocation);
    cardsContainer.innerHTML += eventCardHTML;
}

/*
addEventCard("Society of Women Engineers","Intro to React", "6-7pm", "ECSW 1.315");
addEventCard("Abel","bye abel", "8-9pm", "abel's car");
addEventCard("SWE","Intro to React", "6-7pm", "ECSW 1.315");
addEventCard("Abel","bye abel", "8-9pm", "abel's car");
*/

chrome.storage.local.get("events", function(data) {
    const events = data.events;
    console.log("Events retrieved from Chrome storage:", events);
    // Do something with the retrieved events
    events.forEach(event => {
        addEventCard(event.organization, event.summary, (new Date(event.start.dateTime)).toLocaleDateString('en-US', {
            weekday: 'short', // Short day of the week (e.g., "Fri")
            month: 'short',   // Short month name (e.g., "Mar")
            day: '2-digit',   // Two-digit day (e.g., "29")
            year: 'numeric'   // Full year (e.g., "2024")
        }), event.location);
    });
 });
 