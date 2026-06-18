async function loadCalendar() {
  try {
    const res = await fetch('events.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const allEvents = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = allEvents
      .filter(e => new Date(e.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const past = allEvents
      .filter(e => new Date(e.date + 'T00:00:00') < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const calendarList = document.getElementById('calendar-list');
    const pastList     = document.getElementById('past-events-list');
    const toggleBtns   = document.querySelectorAll('.calendar-toggle__btn');

    function renderUpcoming(category) {
      if (!calendarList) return;
      const filtered = category
        ? upcoming.filter(e => e.category === category)
        : upcoming;
      calendarList.innerHTML = filtered.length
        ? filtered.map(renderCard).join('')
        : '<li class="calendar-empty">No upcoming events.</li>';
    }

    if (toggleBtns.length) {
      const toggleContainer = toggleBtns[0].closest('.calendar-toggle');
      const activeBtn = document.querySelector('.calendar-toggle__btn--active');
      let activeCategory = activeBtn ? activeBtn.dataset.category : null;

      function setSlider(btn) {
        const index = Array.from(toggleBtns).indexOf(btn);
        if (toggleContainer) toggleContainer.style.setProperty('--_active', index);
      }

      setSlider(activeBtn || toggleBtns[0]);
      renderUpcoming(activeCategory);

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          toggleBtns.forEach(b => b.classList.remove('calendar-toggle__btn--active'));
          btn.classList.add('calendar-toggle__btn--active');
          activeCategory = btn.dataset.category;
          setSlider(btn);
          renderUpcoming(activeCategory);
        });
      });
    } else {
      renderUpcoming(null);
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
  const day      = event.dateRange || date.getDate();
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
