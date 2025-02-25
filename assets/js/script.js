<script>
// Function to update time and display it
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format time to hh:mm:ss
    const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    // Set the dynamic text in the paragraph
    document.getElementById('current-time').innerText = `It is currently ${timeString} where Kiara lives.`;
}

// Update time every second
setInterval(updateTime, 1000);
</script>
