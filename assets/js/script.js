document.addEventListener("DOMContentLoaded", function() {
    function updateTime() {
        const timeZone = 'America/New_York'; // EST Time Zone
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        let currentTime = new Date().toLocaleTimeString('en-US', { timeZone, ...options });

        // Convert AM/PM to lowercase
        currentTime = currentTime.replace(/AM/g, 'am').replace(/PM/g, 'pm');

        // Or to uppercase (uncomment to use)
        // currentTime = currentTime.replace(/am/g, 'AM').replace(/pm/g, 'PM');

        // Bold the EST time zone and the current time
        const message = `kiara is working in the <strong>est</strong> time zone. it is currently <strong>${currentTime}</strong>.`;

        document.getElementById('time-status').innerHTML = message;  // Use innerHTML to interpret the <strong> tags
    }

    // Update time every second
    setInterval(updateTime, 1000);
});
