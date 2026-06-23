(function () {
  if (window.matchMedia('(max-width: 767px)').matches) {
    document.querySelectorAll('.kw-about .rr-accordion--open').forEach(function (acc) {
      acc.classList.remove('rr-accordion--open');
      acc.querySelector('.rr-accordion__toggle').setAttribute('aria-expanded', 'false');
    });
  }

  loadKwCalendar();

  async function loadKwCalendar() {
    try {
      var res = await fetch('../events.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var allEvents = await res.json();

      var today = new Date();
      today.setHours(0, 0, 0, 0);

      var kwUpcoming = allEvents
        .filter(function (e) {
          return e.offering === 'kinetic-waves' && new Date(e.date + 'T00:00:00') >= today;
        })
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

      var list = document.getElementById('kw-calendar-list');
      if (!list) return;

      list.innerHTML = kwUpcoming.length
        ? kwUpcoming.map(renderKwCard).join('')
        : '<li class="calendar-empty">No upcoming classes.</li>';

      wireSaveButtons(list, kwUpcoming);

      var container = list.closest('.kw-calendar__container');
      if (container) {
        if (kwUpcoming.length > 6) {
          container.style.maxHeight = window.innerWidth >= 650 ? '44.375rem' : '42.125rem';
          container.style.overflowY = 'auto';
        } else {
          container.style.maxHeight = 'none';
          container.style.overflowY = 'visible';
        }
      }
    } catch (err) {
      console.error('KW calendar failed to load:', err);
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

  function wireSaveButtons(container, events) {
    var buttons = container.querySelectorAll('.event-save-btn');
    buttons.forEach(function (btn, i) {
      if (!events[i]) return;
      btn.addEventListener('click', function () {
        console.log('kw save btn clicked', i, events[i].title, 'atcb_action available:', typeof atcb_action === 'function');
        if (typeof atcb_action === 'function') {
          atcb_action(buildAtcbConfig(events[i]), btn);
        } else {
          console.error('atcb_action not loaded yet');
        }
      });
    });
  }

  function renderKwCard(event) {
    var date  = new Date(event.date + 'T00:00:00');
    var month = date.toLocaleString('default', { month: 'short' });
    var day   = event.dateRange || date.getDate();
    var mapsHref = event.locationMap && event.locationMap.startsWith('http')
      ? event.locationMap
      : 'https://maps.google.com/?q=' + encodeURIComponent(event.locationMap || event.location);

    return `
      <li class="event-card">
        <div class="event-date">
          <span class="event-date__month">${month}</span>
          <div class="event-date__day-box">
            <span class="event-date__day event-date__day--single">${day}</span>
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
        ${event.theme ? '<span class="kw-event-theme">' + event.theme + '</span>' : ''}
      </li>`;
  }
}());
