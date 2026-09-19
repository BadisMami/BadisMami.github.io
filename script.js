document.getElementById('year').textContent = new Date().getFullYear();

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Flip cards ---- */

(function () {
  if (prefersReducedMotion) return;

  var buttons = document.querySelectorAll('.card-flip-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.project-card');
      if (!card) return;
      var flipped = card.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(flipped));
      btn.textContent = flipped ? 'Back' : 'Flip';
    });
  });
})();

/* ---- Scroll-triggered reveal ---- */

(function () {
  var revealEls = document.querySelectorAll('.project-card');

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
