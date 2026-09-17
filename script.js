document.getElementById('year').textContent = new Date().getFullYear();

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Seven-segment "GO FSU" display, recreated from the Verilog original ---- */

(function () {
  var SEGMENTS = {
    ' ': [],
    'G': ['a', 'f', 'e', 'd', 'c', 'g'],
    'O': ['a', 'b', 'c', 'd', 'e', 'f'],
    'F': ['a', 'f', 'g', 'e'],
    'S': ['a', 'f', 'g', 'c', 'd'],
    'U': ['b', 'c', 'd', 'e', 'f']
  };
  var MESSAGE = 'GO FSU   ';
  var LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  var display = document.querySelector('.sevenseg-display');
  if (!display) return;

  var digits = Array.prototype.slice.call(display.querySelectorAll('.digit'));
  var toggleBtn = document.getElementById('sevenseg-toggle');
  var frame = 0;
  var timer = null;
  var playing = false;

  function render() {
    for (var i = 0; i < digits.length; i++) {
      var ch = MESSAGE[(frame + i) % MESSAGE.length];
      var lit = SEGMENTS[ch] || [];
      for (var s = 0; s < LETTERS.length; s++) {
        var seg = digits[i].querySelector('.seg-' + LETTERS[s]);
        if (seg) seg.classList.toggle('on', lit.indexOf(LETTERS[s]) !== -1);
      }
    }
  }

  function tick() {
    frame = (frame + 1) % MESSAGE.length;
    render();
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, 450);
    playing = true;
    if (toggleBtn) {
      toggleBtn.textContent = 'Pause';
      toggleBtn.setAttribute('aria-label', 'Pause display');
    }
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    playing = false;
    if (toggleBtn) {
      toggleBtn.textContent = 'Play';
      toggleBtn.setAttribute('aria-label', 'Play display');
    }
  }

  render();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (playing) stop(); else start();
    });
  }

  if (!prefersReducedMotion) {
    start();
  } else {
    stop();
  }
})();

/* ---- Expandable project sheets ---- */

(function () {
  var toggles = document.querySelectorAll('.sheet-toggle');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var target = document.getElementById(btn.getAttribute('aria-controls'));
      if (target) target.classList.toggle('open', !expanded);
    });
  });
})();

/* ---- Scroll-triggered reveal ---- */

(function () {
  var revealEls = document.querySelectorAll('.sheet, .sevenseg-figure');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });
})();
