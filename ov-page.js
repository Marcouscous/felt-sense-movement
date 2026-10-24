// The Overscore page.
(function () {
  // All accordions start closed on every screen size (default markup);
  // toggling is handled by rr-accordion.js.

  // "Save event to your calendar": the site-wide pop-up menu (cal-menu.js),
  // as one all-day event over Sat + Sun.
  var saveBtn = document.querySelector('.ov-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (!window.FSMCalMenu) return;
      // Same all-day event as the Overscore card on the home/events pages
      window.FSMCalMenu.open(saveBtn, {
        title: 'The Overscore (2:30–5:30pm)',
        description: 'Saturday 2:30–5:30pm\nSunday 2:30–5:30pm\nBerkeley Finnish Hall',
        url: 'https://feltsensemovement.com/offerings/the-overscore.html',
        location: 'Berkeley Finnish Hall, 1970 Chestnut St, Berkeley, CA 94702',
        timeZone: 'America/Los_Angeles',
        date: '2026-11-28',
        endDate: '2026-11-29',
        allDay: true
      });
    });
  }

  // FAQ "Have a question?" form: send to Formspree in the background and show
  // a thank-you in place, instead of navigating to Formspree's page. Without
  // JS the form still posts normally.
  var form = document.querySelector('.ov-ask');
  if (!form) return;
  var status = form.querySelector('.ov-ask__status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    button.disabled = true;
    status.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        form.reset();
        status.textContent = 'Thanks! Marcus will reply to you by email.';
      })
      .catch(function () {
        status.textContent = 'Sorry, that didn’t send. Please try again in a moment.';
      })
      .then(function () {
        button.disabled = false;
      });
  });
}());
