document.addEventListener('DOMContentLoaded', () => {
    const mailbox = document.getElementById('mailbox');
    const coupon = document.getElementById('coupon');
    const paper = document.getElementById('paper');
    let clicks = 0;

    if (mailbox && coupon && paper) {
        mailbox.addEventListener('click', () => {
            clicks++;
            if (clicks === 1) {
                // First click: reveal coupon
                coupon.classList.add('reveal');
                paper.style.opacity = 1; // Make paper visible behind coupon
            } else if (clicks === 2) {
                // Second click: paper flies out
                paper.classList.add('fly-out');
            }
        });
    }
});
