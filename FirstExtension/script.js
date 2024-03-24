// Function to generate event card HTML
function createEventCard(clubName, eventName, eventTime, eventLocation) {
    return `
    <div class="card">
        <div class="club-name">
            <span class="club-text">${clubName}</span>
        </div>
        <div class="event-info">
            <span class="event-name">${eventName}</span>
            <span class="event-time">${eventTime}</span>
            <span class="event-location">${eventLocation}</span>
        </div>
        <div class= "circle"></div>
    </div>
    `;
}

// Function to add event card to the cards container
function addEventCard(clubName, eventName, eventTime, eventLocation) {
    const cardsContainer = document.getElementById('cards-container');
    const eventCardHTML = createEventCard(clubName, eventName, eventTime, eventLocation);
    cardsContainer.innerHTML += eventCardHTML;
}

addEventCard("SWE","Intro to React", "6-7pm", "ECSW 1.315");
addEventCard("Abel","bye abel", "8-9pm", "abel's car");
addEventCard("SWE","Intro to React", "6-7pm", "ECSW 1.315");
addEventCard("Abel","bye abel", "8-9pm", "abel's car");