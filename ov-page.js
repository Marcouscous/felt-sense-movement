// The Overscore page: score-map and roots accordions start open on
// desktop (≥ 650px, this page's breakpoint) and closed on mobile.
// Toggling itself is handled by rr-accordion.js.
(function () {
  if (!window.matchMedia('(min-width: 650px)').matches) return;

  document.querySelectorAll('.ov-about .rr-accordion').forEach(function (accordion) {
    accordion.classList.add('rr-accordion--open');
    var toggle = accordion.querySelector('.rr-accordion__toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  });
}());
