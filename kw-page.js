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
    } catch (err) {
      console.error('KW calendar failed to load:', err);
    }
  }

  function renderKwCard(event) {
    var date  = new Date(event.date + 'T00:00:00');
    var month = date.toLocaleString('default', { month: 'short' });
    var day   = event.dateRange || date.getDate();
    var mapsHref = 'https://maps.google.com/?q=' + encodeURIComponent(event.locationMap || event.location);

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
