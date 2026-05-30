(function () {
  'use strict';

  const section = document.querySelector('.mobile-carousel-section');
  if (!section) return;

  const track   = section.querySelector('.mobile-carousel__track');
  const dots    = section.querySelectorAll('.mobile-carousel__dot');
  const prevBtn = section.querySelector('.mobile-carousel__btn--prev');
  const nextBtn = section.querySelector('.mobile-carousel__btn--next');

  const TOTAL        = dots.length;   /* 5 */
  const AUTO_DELAY   = 4000;
  const RESUME_DELAY = 4000;

  let current     = 0;
  let autoTimer   = null;
  let resumeTimer = null;

  function goTo(index) {
    current = ((index % TOTAL) + TOTAL) % TOTAL;
    track.style.transform = `translateX(${-current * 100}vw)`;
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('mobile-carousel__dot--active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), AUTO_DELAY);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  function onInteract() {
    stopAuto();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, RESUME_DELAY);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); onInteract(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); onInteract(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); onInteract(); }));

  goTo(0);
  startAuto();
}());
