async function loadCalendar() {
  try {
    const res = await fetch('events.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const events = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => new Date(e.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const past = events
      .filter(e => new Date(e.date + 'T00:00:00') < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const calendarList = document.getElementById('calendar-list');
    const pastList     = document.getElementById('past-events-list');

    if (calendarList) {
      calendarList.innerHTML = upcoming.length
        ? upcoming.map(renderCard).join('')
        : '<li class="calendar-empty">No upcoming events.</li>';
    }

    if (pastList) {
      pastList.innerHTML = past.length
        ? past.map(e => renderCard(e, true)).join('')
        : '<li class="calendar-empty">No past events.</li>';
    }
  } catch (err) {
    console.error('Calendar failed to load:', err);
  }
}

function renderCard(event, isPast = false) {
  const date     = new Date(event.date + 'T00:00:00');
  const month    = date.toLocaleString('default', { month: 'short' });
  const day      = date.getDate();
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(event.locationMap || event.location)}`;

  return `
    <li class="event-card${isPast ? ' event-card--past' : ''}">
      <div class="event-date">
        <span class="event-date__month">${month}</span>
        <div class="event-date__day-box">
          <span class="event-date__day">${day}</span>
        </div>
      </div>
      <div class="event-text">
        <p class="event-text__title">${event.title}</p>
        <a class="event-text__location"
           href="${mapsHref}"
           target="_blank"
           rel="noopener noreferrer">${event.location}</a>
        <button class="event-save-btn" type="button">Save Event</button>
      </div>
      <a class="learn-more-btn"
         href="${event.link}"
         target="_blank"
         rel="noopener noreferrer">Learn More</a>
    </li>`;
}

document.addEventListener('DOMContentLoaded', loadCalendar);
