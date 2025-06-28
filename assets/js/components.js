document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerHtml = await headerResponse.text();
    document.querySelector('#header-placeholder').innerHTML = headerHtml;

    // Load footer
    try {
        const footerResponse = await fetch('/components/footer.html');
        if (!footerResponse.ok) throw new Error('Footer fetch failed');
        const footerHtml = await footerResponse.text();
        const footerPlaceholder = document.querySelector('#footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
            console.log('Footer loaded:', footerHtml);
        } else {
            console.warn('Footer placeholder not found in DOM');
        }
    } catch (err) {
        console.error('Footer could not be loaded:', err);
    }

    // Load contact form modal
    const contactResp = await fetch('/components/contact-form.html');
    const contactHtml = await contactResp.text();
    document.body.insertAdjacentHTML('beforeend', contactHtml);

    // Setup contact modal interactions
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.getElementById('contact-close');
    function closeContact() {
        contactModal.classList.remove('open');
    }
    if (contactClose) contactClose.addEventListener('click', closeContact);
    if (contactModal) {
        contactModal.addEventListener('click', e => {
            if (e.target === contactModal) closeContact();
        });
    }
    // Use the button to open the modal
    const openBtn = document.getElementById('contact-popup-btn');
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.classList.add('open');
        });
    }

    // --- Add this block for form submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Submit on Ctrl+Enter
        contactForm.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                contactForm.requestSubmit();
            }
        });

        contactForm.addEventListener('submit', async function(e) {
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
                    // Show thanks message in place of form
                    contactForm.innerHTML = `<div style="padding:2rem 0;text-align:center;font-size:1.2rem;color:#b07b8c;">thanks!</div>`;
                } else {
                    alert("There was a problem sending your message. Please try again later.");
                }
            } catch (err) {
                alert("There was a problem sending your message. Please try again later.");
            }
        });
    }

    // Set active nav item based on current page
    const currentPage = document.body.className.replace('-page', '');
    const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Ensure DOM is updated before loading home.js
    requestAnimationFrame(() => {
        import('/assets/js/home.js');
    });
});
