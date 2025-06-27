document.addEventListener('DOMContentLoaded', () => {
  // Stat counters
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const duration = 1200;
    const step = Math.ceil(target / (duration / 16));
    function animate() {
      current += step;
      if (current >= target) {
        el.textContent = target;
      } else {
        el.textContent = current;
        requestAnimationFrame(animate);
      }
    }
    // Animate when in view
    function onScroll() {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animate();
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  });

  // Skill bars
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const fill = bar.querySelector('.skill-bar-fill');
    const percent = bar.dataset.skill;
    function animateBar() {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        fill.style.width = percent + '%';
        window.removeEventListener('scroll', animateBar);
      }
    }
    window.addEventListener('scroll', animateBar);
    animateBar();
  });
});