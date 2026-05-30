(function () {
  'use strict';

  const trigger = document.querySelector('.nav__link--trigger');
  if (!trigger) return;

  const navItem = trigger.closest('.nav__item--has-dropdown');
  const mq = window.matchMedia('(max-width: 767px) and (pointer: coarse)');

  function close() {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.blur();
  }

  // Tap Offerings: toggle open/closed
  trigger.addEventListener('click', () => {
    if (!mq.matches) return;
    trigger.getAttribute('aria-expanded') === 'true' ? close() : trigger.setAttribute('aria-expanded', 'true');
  });

  // Tap outside nav: close
  document.addEventListener('click', (e) => {
    if (!mq.matches) return;
    if (!navItem.contains(e.target)) close();
  });

  // Escape key: close (works on both mobile and desktop)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}());
