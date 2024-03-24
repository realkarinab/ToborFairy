// Function to generate event card HTML
function createEventCard(eventName, eventTime, eventLocation) {
    return `
    <div class="card">
        <div class="club-name">
            <span class="event-name">${eventName}</span>
        </div>
        <div class="event-info">
            <span class="event-time">${eventTime}</span>
            <span class="event-location">${eventLocation}</span>
        </div>
    </div>
    `;
}

// Function to add event card to the cards container
function addEventCard(eventName, eventTime, eventLocation) {
    const cardsContainer = document.getElementById('cards-container');
    const eventCardHTML = createEventCard(eventName, eventTime, eventLocation);
    cardsContainer.innerHTML += eventCardHTML;
}

addEventCard("Intro to React", "6-7pm", "ECSW 1.315");
addEventCard("bye abel", "8-9pm", "abel's car");