(function () {
  var btn = document.querySelector('.rr-nav__hamburger');
  if (!btn) return;

  var menu = btn.closest('.rr-nav__menu');

  function close() {
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.querySelectorAll('.rr-nav__dropdown-link').forEach(function (link) {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) {
      close();
    }
  });
}());
