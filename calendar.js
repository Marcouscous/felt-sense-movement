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
    const toggleBtns   = document.querySelectorAll('.calendar-toggle:not(#past-toggle) .calendar-toggle__btn');

    function renderUpcoming(category) {
      if (!calendarList) return;
      const filtered = category
        ? upcoming.filter(e => e.category === category)
        : upcoming;
      calendarList.innerHTML = filtered.length
        ? filtered.map(renderCard).join('')
        : '<li class="calendar-empty">No upcoming events.</li>';
      wireSaveButtons(calendarList, filtered);
      updateCalendarOverflow(calendarList.closest('.calendar-container'));
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
      const pastToggle = document.getElementById('past-toggle');
      const pastToggleBtns = pastToggle ? [...pastToggle.querySelectorAll('.calendar-toggle__btn')] : [];
      let pastCategory = 'class';

      function renderPast(category) {
        const filtered = category
          ? past.filter(e => e.category === category)
          : past;
        pastList.innerHTML = filtered.length
          ? filtered.map(e => renderCard(e, true)).join('')
          : '<li class="calendar-empty">No past events.</li>';
        wireSaveButtons(pastList, filtered);
      }

      if (pastToggle && pastToggleBtns.length) {
        function setPastSlider(btn) {
          const index = pastToggleBtns.indexOf(btn);
          pastToggle.style.setProperty('--_active', index);
        }

        setPastSlider(pastToggleBtns[0]);
        renderPast(pastCategory);

        pastToggleBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            pastToggleBtns.forEach(b => b.classList.remove('calendar-toggle__btn--active'));
            btn.classList.add('calendar-toggle__btn--active');
            pastCategory = btn.dataset.category;
            setPastSlider(btn);
            renderPast(pastCategory);
          });
        });
      } else {
        renderPast(null);
      }
    }

    window.addEventListener('resize', function () {
      updateCalendarOverflow(calendarList && calendarList.closest('.calendar-container'));
      updateCalendarOverflow(pastList && pastList.closest('.calendar-container'));
    });
  } catch (err) {
    console.error('Calendar failed to load:', err);
  }
}

function buildAtcbConfig(event) {
  var config = {
    name: event.title,
    startDate: event.date,
    options: ['Google', 'Apple', 'iCal', 'Outlook.com'],
    timeZone: event.timeZone || 'America/Los_Angeles',
    location: event.locationMap || event.location || '',
    description: event.description || '',
    iCalFileName: event.title.replace(/\s+/g, '-')
  };

  if (event.startTime && event.endTime && !event.allDay) {
    config.endDate = event.date;
    config.startTime = event.startTime;
    config.endTime = event.endTime;
  } else {
    config.endDate = event.endDate || event.date;
  }

  return config;
}

function updateCalendarOverflow(container) {
  if (!container) return;
  container.style.overflowY = container.scrollHeight > container.clientHeight ? 'auto' : 'visible';
}

function wireSaveButtons(container, events) {
  var buttons = container.querySelectorAll('.event-save-btn');
  buttons.forEach(function (btn, i) {
    if (!events[i]) return;
    btn.addEventListener('click', function () {
      console.log('save btn clicked', i, events[i].title, 'atcb_action available:', typeof atcb_action === 'function');
      if (typeof atcb_action === 'function') {
        atcb_action(buildAtcbConfig(events[i]), btn);
      } else {
        console.error('atcb_action not loaded yet');
      }
    });
  });
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
          <span class="event-date__day${event.dateRange ? '' : ' event-date__day--single'}">${day}</span>
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
