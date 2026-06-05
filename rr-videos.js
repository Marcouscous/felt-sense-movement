(function () {
  document.querySelectorAll('.rr-videos__item').forEach(function (item) {
    const video = item.querySelector('video');
    const btn   = item.querySelector('.rr-videos__play-btn');

    if (!video || !btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.classList.add('rr-videos__play-btn--hidden');
      video.play();
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        btn.classList.add('rr-videos__play-btn--hidden');
        video.play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      btn.classList.add('rr-videos__play-btn--hidden');
    });

    video.addEventListener('pause', function () {
      btn.classList.remove('rr-videos__play-btn--hidden');
    });

    video.addEventListener('ended', function () {
      btn.classList.remove('rr-videos__play-btn--hidden');
    });
  });
}());
