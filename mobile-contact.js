(function () {
  'use strict';

  const form = document.getElementById('mobile-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn   = form.querySelector('.mobile-contact__submit');
    const input = form.querySelector('.mobile-contact__input');
    input.disabled = true;
    btn.textContent = "You're in!";
    btn.disabled = true;
  });
}());
