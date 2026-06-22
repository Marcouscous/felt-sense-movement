(function () {
  const grid = document.querySelector('.rr-videos__grid');
  const dots = document.querySelectorAll('.rr-videos__dot');
  if (!grid || !dots.length) return;

  function setActive(index) {
    dots.forEach(function (d, i) {
      d.classList.toggle('rr-videos__dot--active', i === index);
      d.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      var items = grid.querySelectorAll('.rr-videos__item');
      if (items[i]) {
        items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setActive(i);
    });
  });

  var scrollTimer;
  grid.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var items = grid.querySelectorAll('.rr-videos__item');
      var gridLeft = grid.scrollLeft;
      var gridWidth = grid.offsetWidth;
      var closest = 0;
      var closestDist = Infinity;
      items.forEach(function (item, i) {
        var center = item.offsetLeft + item.offsetWidth / 2 - grid.offsetLeft;
        var dist = Math.abs(center - gridLeft - gridWidth / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    }, 50);
  });
})();
