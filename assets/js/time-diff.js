document.addEventListener("DOMContentLoaded", function() {
  function getESTOffset() {
    // Get EST offset in minutes for now (handles DST)
    const estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const localDate = new Date();
    const est = new Date(estDate);

    // Difference in minutes
    const diffMinutes = Math.round((localDate - est) / (60 * 1000));
    // Convert to hours, round to nearest integer
    const diffHours = Math.round(diffMinutes / 60);

    return diffHours;
  }

  function updateLocationDiff() {
    // Only run on index page
    if (!document.body.classList.contains('index-page')) return;

    const diff = getESTOffset();
    const estNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = estNow.getHours();
    let emoji = '';
    if (hour >= 6 && hour < 18) {
      emoji = '☀️';
    } else {
      emoji = '🌙';
    }
    let introText = '';
    if (diff === 0) {
      introText = ` ${emoji} (0hr diff.)`;
    } else if (diff > 0) {
      introText = ` ${emoji} (+${diff}hr diff.)`;
    } else {
      introText = ` ${emoji} (${diff}hr diff.)`;
    }

    const introEl = document.getElementById('location-diff-intro');
    if (introEl) {
      introEl.textContent = introText;
      if (diff === 0) {
        introEl.classList.add('no-diff');
      } else {
        introEl.classList.remove('no-diff');
      }
      console.log('location-diff-intro updated:', introText);
    } else {
      console.warn('location-diff-intro element not found');
    }
    // Only update the #location-diff in the intro section (home page)
    const el = document.querySelector('.intro-location #location-diff');
    if (el) el.textContent = text;
  }

  updateLocationDiff();
  setInterval(updateLocationDiff, 10 * 60 * 1000);
})();
