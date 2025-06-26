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
    if (diff === 0) {
      text = '(0hr diff.)';
    } else if (diff > 0) {
      text = `(+${diff}hr diff.)`;
    } else {
      text = `(${diff}hr diff.)`;
    }
    const el = document.getElementById('location-diff');
    if (el) el.textContent = text;
  }

  updateLocationDiff();
  // Optionally update every 10 minutes in case user leaves tab open
  setInterval(updateLocationDiff, 10 * 60 * 1000);
})();
