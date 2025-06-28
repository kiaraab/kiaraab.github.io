document.addEventListener("DOMContentLoaded", function () {
    const introEl = document.querySelector('.intro-hi');
    if (!introEl) return;

    const tagline = "hi, i'm Kiara Raab";
    let i = 0;
    introEl.textContent = "";

    function typeNext() {
        if (i < tagline.length) {
            introEl.textContent += tagline[i];
            let delay = 55;
            if (tagline[i] === ',' || tagline[i] === '\n') delay = 400;
            i++;
            setTimeout(typeNext, delay);
        }
    }
    typeNext();
});
