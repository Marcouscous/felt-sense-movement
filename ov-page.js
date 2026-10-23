// The Overscore page.
(function () {
  // All accordions start closed on every screen size (default markup);
  // toggling is handled by rr-accordion.js.

  // "Save to your calendar": two sessions (Sat + Sun) as separate calendar
  // entries, via the add-to-calendar-button library loaded in <head>.
  var saveBtn = document.querySelector('.ov-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (typeof window.atcb_action !== 'function') return;
      window.atcb_action({
        name: 'The Overscore',
        description: 'An improvised ritual of movement, voice, and live music.\n\nhttps://feltsensemovement.com/offerings/the-overscore.html',
        location: 'The Finnish Hall, 1970 Chestnut St, Berkeley, CA 94702',
        timeZone: 'America/Los_Angeles',
        options: ['Google', 'Apple', 'iCal', 'Outlook.com'],
        iCalFileName: 'The-Overscore',
        dates: [
          { name: 'The Overscore — Day 1: World building', startDate: '2026-11-28', startTime: '14:30', endTime: '17:30' },
          { name: 'The Overscore — Day 2', startDate: '2026-11-29', startTime: '14:30', endTime: '17:30' }
        ]
      }, saveBtn);
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
