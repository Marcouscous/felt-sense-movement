// The Overscore page.
(function () {
  // All accordions start closed on every screen size (default markup);
  // toggling is handled by rr-accordion.js.

  // "Save event to your calendar": the site-wide pop-up menu (cal-menu.js),
  // with Saturday and Sunday as two sessions.
  var saveBtn = document.querySelector('.ov-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (!window.FSMCalMenu) return;
      window.FSMCalMenu.open(saveBtn, {
        title: 'The Overscore',
        description: 'An improvised ritual of movement, voice, and live music. Sat & Sun 2:30–5:30pm.',
        url: 'https://feltsensemovement.com/offerings/the-overscore.html',
        location: 'The Finnish Hall, 1970 Chestnut St, Berkeley, CA 94702',
        timeZone: 'America/Los_Angeles',
        sessions: [
          { date: '2026-11-28', start: '14:30', end: '17:30', title: 'The Overscore — Day 1: World building' },
          { date: '2026-11-29', start: '14:30', end: '17:30', title: 'The Overscore — Day 2' }
        ]
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
