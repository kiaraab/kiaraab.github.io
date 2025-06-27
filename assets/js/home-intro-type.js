document.addEventListener("DOMContentLoaded", function () {
    const introEl = document.querySelector('.intro-hi');
    if (!introEl) return;

    const tagline = "hi, i'm kiara raab";
    let i = 0;
    introEl.textContent = "";

    function typeNext() {
        if (i < tagline.length) {
            introEl.textContent += tagline[i];
            let delay = 50;
            if (tagline[i] === ',' || tagline[i] === '\n') delay = 500;
            i++;
            setTimeout(typeNext, delay);
        }
    }
    typeNext();
    // Do NOT touch .intro-location or #location-diff-intro here!
});
