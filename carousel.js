(function () {
  'use strict';

  const viewport = document.querySelector('.carousel-viewport');
  const track    = document.querySelector('.carousel-track');
  const slides   = [...track.querySelectorAll('.carousel-slide')];
  const dots     = [...document.querySelectorAll('.carousel-dot')];
  const prevBtn  = document.querySelector('.carousel-btn--prev');
  const nextBtn  = document.querySelector('.carousel-btn--next');

  const PER_GROUP    = 3;
  const TOTAL_GROUPS = Math.ceil(slides.length / PER_GROUP);
  let   current      = 0;

  // Center the active group within the full-width viewport.
  // Slide widths are determined by each image's aspect ratio at the
  // fixed height, so offsetWidth is read at call-time (post-load).
  function getOffset(groupIndex) {
    const startIndex  = groupIndex * PER_GROUP;
    const slide       = slides[startIndex];
    if (!slide) return 0;

    const trackGap    = parseFloat(getComputedStyle(track).gap) || 0;
    const viewportW   = viewport.offsetWidth;

    const groupSlides = slides.slice(startIndex, startIndex + PER_GROUP);
    const activeW     = groupSlides.reduce((sum, s) => sum + s.offsetWidth, 0)
                      + (groupSlides.length - 1) * trackGap;

    const sideSpace   = (viewportW - activeW) / 2;
    return Math.max(0, slide.offsetLeft - sideSpace);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, TOTAL_GROUPS - 1));

    track.style.transform = `translateX(-${getOffset(current)}px)`;

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('carousel-dot--active', active);
      dot.setAttribute('aria-pressed', String(active));
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === TOTAL_GROUPS - 1;
  }

  // Re-center on resize without triggering the slide animation
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${getOffset(current)}px)`;
    resizeTimer = setTimeout(() => {
      track.style.transition = '';
    }, 150);
  });

  const AUTOPLAY_MS = 20000;
  let autoplayTimer;

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo((current + 1) % TOTAL_GROUPS), AUTOPLAY_MS);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAutoplay(); }));

  // Defer initial positioning until images are loaded — slide widths
  // are 0 until each image's intrinsic dimensions are known.
  const imgs = slides.map(s => s.querySelector('.carousel-img')).filter(Boolean);
  const ready = imgs.map(img =>
    img.complete
      ? Promise.resolve()
      : new Promise(res => {
          img.addEventListener('load',  res, { once: true });
          img.addEventListener('error', res, { once: true });
        })
  );
  Promise.all(ready).then(() => { goTo(0); startAutoplay(); });
}());
