(function() {
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
    const diff = getESTOffset();
    let text = '';
    // Get EST hour for emoji
    const estNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = estNow.getHours();
    let emoji = '';
    if (hour >= 6 && hour < 18) {
      emoji = '☀️'; // Day
    } else {
      emoji = '🌙'; // Night
    }
    if (diff === 0) {
      text = `${emoji} (0hr diff.)`;
    } else if (diff > 0) {
      text = `${emoji} (+${diff}hr diff.)`;
    } else {
      text = `${emoji} (${diff}hr diff.)`;
    }
    // Only update the first two #location-diff elements (header and intro)
    const els = document.querySelectorAll('#location-diff');
    els.forEach((el, idx) => {
      if (idx === 0 || idx === 1) {
        el.textContent = text;
      } else {
        el.textContent = '';
      }
    });
  }

  updateLocationDiff();
  // Optionally update every 10 minutes in case user leaves tab open
  setInterval(updateLocationDiff, 10 * 60 * 1000);
})();
