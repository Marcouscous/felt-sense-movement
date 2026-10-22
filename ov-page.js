// The Overscore page.
(function () {
  // Score-map, roots and FAQ accordions start open on desktop (≥ 650px, this
  // page's breakpoint) and closed on mobile. Toggling is handled by
  // rr-accordion.js.
  if (window.matchMedia('(min-width: 650px)').matches) {
    document.querySelectorAll('.ov-about .rr-accordion').forEach(function (accordion) {
      accordion.classList.add('rr-accordion--open');
      var toggle = accordion.querySelector('.rr-accordion__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
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
