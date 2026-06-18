(function () {
  const track = document.querySelector('.rr-carousel__track');
  const dots  = document.querySelectorAll('.rr-carousel__dot');
  const prev  = document.querySelector('.rr-carousel__btn--prev');
  const next  = document.querySelector('.rr-carousel__btn--next');

  if (!track || dots.length === 0) return;

  let current = 0;

  function isDesktop() {
    return window.innerWidth >= 768;
  }

  function getTotal() {
    return isDesktop() ? 2 : 5;
  }

  function getStep() {
    return isDesktop() ? 2 : 1;
  }

  function getActiveDots() {
    return Array.from(dots).slice(0, getTotal());
  }

  function setActive(index) {
    getActiveDots().forEach(function (d, i) {
      var active = i === index;
      d.classList.toggle('rr-carousel__dot--active', active);
      d.setAttribute('aria-pressed', String(active));
    });
  }

  function goTo(index) {
    var t = getTotal();
    current = (index + t) % t;
    var slideWidth = track.children[0].offsetWidth;
    track.style.transform = 'translateX(-' + (current * getStep() * slideWidth) + 'px)';
    setActive(current);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      current = 0;
      track.style.transform = 'translateX(0)';
      setActive(0);
    }, 100);
  });

  prev.addEventListener('click', function () { goTo(current - 1); });
  next.addEventListener('click', function () { goTo(current + 1); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      var active = getActiveDots();
      var idx = active.indexOf(dot);
      if (idx !== -1) goTo(idx);
    });
  });
}());
