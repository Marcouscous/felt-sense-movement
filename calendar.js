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
      const emptyText = category === 'workshop'
        ? 'No upcoming workshops. Check classes.'
        : category === 'class'
          ? 'No upcoming classes. Check workshops.'
          : 'No upcoming events.';
      calendarList.innerHTML = filtered.length
        ? filtered.map(renderCard).join('')
        : `<li class="calendar-empty">${emptyText}</li>`;
      wireSaveButtons(calendarList, filtered);
      updateCalendarOverflow(calendarList.closest('.calendar-container'));
    }

    if (toggleBtns.length) {
      const toggleContainer = toggleBtns[0].closest('.calendar-toggle');
      let activeBtn = document.querySelector('.calendar-toggle__btn--active');

      // Default to Classes when there are no upcoming workshops
      const classBtn = Array.from(toggleBtns).find(b => b.dataset.category === 'class');
      if (activeBtn && activeBtn.dataset.category === 'workshop' && classBtn
          && !upcoming.some(e => e.category === 'workshop')) {
        activeBtn.classList.remove('calendar-toggle__btn--active');
        classBtn.classList.add('calendar-toggle__btn--active');
        activeBtn = classBtn;
      }

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

// ── Slideable Classes / Workshops toggles ─────────────────────────────
// Lets every .calendar-toggle be dragged/swiped as well as tapped: the
// highlight follows the pointer, and releasing on a side selects it by
// clicking that button (so the existing click handlers do the filtering).
// Arrow keys also switch sides.
function makeToggleSlideable(toggle) {
  const btns = [...toggle.querySelectorAll('.calendar-toggle__btn')];
  if (btns.length !== 2) return;

  let startX = 0;
  let startPos = 0;
  let dragging = false;
  let moved = false;

  const activeIndex = () => Math.max(0, btns.findIndex(b => b.classList.contains('calendar-toggle__btn--active')));

  toggle.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startPos = activeIndex();
  });

  toggle.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;   // small wiggle = still a tap
    if (!moved) {
      moved = true;
      toggle.setPointerCapture(e.pointerId);
      toggle.classList.add('calendar-toggle--dragging');
    }
    const half = toggle.getBoundingClientRect().width / 2;
    const pos = Math.min(1, Math.max(0, startPos + dx / half));
    toggle.style.setProperty('--_pos', pos);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    if (!moved) return;   // plain tap: the button's own click handles it
    toggle.classList.remove('calendar-toggle--dragging');
    const pos = parseFloat(toggle.style.getPropertyValue('--_pos')) || 0;
    toggle.style.removeProperty('--_pos');
    const target = btns[pos >= 0.5 ? 1 : 0];
    if (e && toggle.hasPointerCapture(e.pointerId)) toggle.releasePointerCapture(e.pointerId);
    if (!target.classList.contains('calendar-toggle__btn--active')) target.click();
    // ignore the stray click some browsers fire right after a drag
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 300);
  }

  let suppressClick = false;
  toggle.addEventListener('click', ev => {
    if (suppressClick && ev.isTrusted) { ev.stopPropagation(); ev.preventDefault(); }
  }, true);

  toggle.addEventListener('pointerup', endDrag);
  toggle.addEventListener('pointercancel', endDrag);

  toggle.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const target = btns[e.key === 'ArrowRight' ? 1 : 0];
    target.click();
    target.focus();
    e.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.calendar-toggle').forEach(makeToggleSlideable);
});
