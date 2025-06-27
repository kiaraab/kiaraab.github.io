document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerHtml = await headerResponse.text();
    document.querySelector('#header-placeholder').innerHTML = headerHtml;

    // Load footer
    const footerResponse = await fetch('/components/footer.html');
    const footerHtml = await footerResponse.text();
    document.querySelector('#footer-placeholder').innerHTML = footerHtml;

    // Set active nav item based on current page
    const currentPage = document.body.className.replace('-page', '');
    const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Ensure DOM is updated before loading home.js
    requestAnimationFrame(() => {
        import('/assets/js/home.js');
    });

    // Inject contact popup HTML at end of body
    const popupHtml = `
    <div id="contact-popup-overlay" class="contact-popup-overlay" style="display:none;">
      <div class="contact-popup-modal">
        <button class="contact-popup-close" aria-label="Close contact form">&times;</button>
        <form class="contact-form" id="contactPopupForm" autocomplete="off">
            <label>
                Your Name
                <input type="text" name="name" required>
            </label>
            <label>
                Your Email
                <input type="email" name="email" required>
            </label>
            <label>
                Message
                <textarea name="message" required></textarea>
            </label>
            <button type="submit">send</button>
        </form>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // Popup open/close logic
    const popupOverlay = document.getElementById('contact-popup-overlay');
    const openBtn = document.getElementById('contact-popup-btn');
    const closeBtn = popupOverlay.querySelector('.contact-popup-close');
    function openPopup() {
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        popupOverlay.querySelector('input[name="name"]').focus();
    }
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = '';
        popupOverlay.querySelector('form').reset();
    }
    if (openBtn) openBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', e => {
        if (e.target === popupOverlay) closePopup();
    });
    document.addEventListener('keydown', e => {
        if (popupOverlay.style.display === 'flex' && e.key === 'Escape') closePopup();
    });

    // Handle form submit (same as before, but for popup)
    document.getElementById('contactPopupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };
        const endpoint = "https://script.google.com/macros/s/AKfycbzbLHbtwquvY96A4eWUUnanKhuft2SsGDW7Phv0j9cg9LwZXrcvMWOc-2OenKDdYRo/exec";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "text/plain" }
            });
            if (response.ok) {
                closePopup();
                window.location.href = "/thanks.html";
            } else {
                alert("There was a problem sending your message. Please try again later.");
            }
        } catch (err) {
            alert("There was a problem sending your message. Please try again later.");
        }
    });
});
