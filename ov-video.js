(function () {
  var video = document.querySelector('.ov-hero__video');
  var btn = document.querySelector('.ov-hero__sound-btn');
  if (!video || !btn) return;

  btn.addEventListener('click', function () {
    video.muted = !video.muted;
    btn.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
    btn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  });
}());
