(function () {
  document.querySelectorAll('.rr-accordion__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var accordion = btn.closest('.rr-accordion');
      var isOpen = accordion.classList.contains('rr-accordion--open');
      accordion.classList.toggle('rr-accordion--open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}());
