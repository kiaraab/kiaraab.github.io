document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerHtml = await headerResponse.text();
    document.querySelector('#header-placeholder').innerHTML = headerHtml;

    // Load footer
    const footerResponse = await fetch('/components/footer.html');
    const footerHtml = await footerResponse.text();
    document.querySelector('#footer-placeholder').innerHTML = footerHtml;

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
    document.querySelectorAll('a[href="/contact.html"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const content = contactModal.querySelector('.contact-modal-content');
            if (content) {
                content.classList.add('pop');
                content.addEventListener('animationend', () => {
                    content.classList.remove('pop');
                }, { once: true });
            }
            contactModal.classList.add('open');
        });
    });

    // Set active nav item based on current page
    const currentPage = document.body.className.replace('-page', '');
    const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Ensure DOM is updated before loading home.js
    requestAnimationFrame(() => {
        import('/assets/js/home.js');
    });
});
