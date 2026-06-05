(function () {
  const track = document.querySelector('.rr-carousel__track');
  const dots  = document.querySelectorAll('.rr-carousel__dot');
  const prev  = document.querySelector('.rr-carousel__btn--prev');
  const next  = document.querySelector('.rr-carousel__btn--next');

  if (!track || dots.length === 0) return;

  let current = 0;
  const total = dots.length;

  function goTo(index) {
    dots[current].classList.remove('rr-carousel__dot--active');
    dots[current].setAttribute('aria-pressed', 'false');

    current = (index + total) % total;

    track.style.transform = `translateX(-${current * 100}vw)`;
    dots[current].classList.add('rr-carousel__dot--active');
    dots[current].setAttribute('aria-pressed', 'true');
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', () => goTo(i));
  });
}());
