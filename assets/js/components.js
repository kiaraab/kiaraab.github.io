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
        if (!contactModal) return;
        contactModal.style.transition = 'opacity 0.18s cubic-bezier(.4,2,.6,1)';
        contactModal.style.opacity = '0';
        setTimeout(() => {
            contactModal.classList.remove('open');
            contactModal.style.transition = '';
            contactModal.style.opacity = '';
        }, 180);
    }
    if (contactClose) contactClose.addEventListener('click', closeContact);
    if (contactModal) {
        contactModal.addEventListener('click', e => {
            if (e.target === contactModal) closeContact();
        });
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (contactModal.classList.contains('open') && e.key === 'Escape') {
                closeContact();
            }
        });
        // Reset opacity instantly when opening
        contactModal.addEventListener('transitionend', function() {
            if (contactModal.classList.contains('open')) {
                contactModal.style.opacity = '1';
            }
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

    // Toast utility
    function showToast(message) {
        let toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '32px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#b07b8c';
        toast.style.color = '#fff';
        toast.style.padding = '1rem 2.2rem';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '1.1rem';
        toast.style.boxShadow = '0 4px 24px rgba(176,123,140,0.13)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s cubic-bezier(.4,2,.6,1)';
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2200);
    }

    // --- Add this block for form submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Autofill test data for development
        contactForm.name.value = "Test User";
        contactForm.email.value = "test@example.com";
        contactForm.message.value = "This is a test message.";

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
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            // Real validation
            if (!name) {
                showToast("Please enter your name.");
                form.name.focus();
                return;
            }
            // Simple email regex
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast("Please enter a valid email.");
                form.email.focus();
                return;
            }
            if (!message) {
                showToast("Please enter a message.");
                form.message.focus();
                return;
            }

            const data = { name, email, message };
            const endpoint = "https://script.google.com/macros/s/AKfycbzbLHbtwquvY96A4eWUUnanKhuft2SsGDW7Phv0j9cg9LwZXrcvMWOc-2OenKDdYRo/exec";
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "text/plain" }
                });
                if (response.ok) {
                    // Auto-close modal and show toast
                    closeContact();
                    showToast("Thanks for your message!");
                } else {
                    showToast("There was a problem sending your message.");
                }
            } catch (err) {
                showToast("There was a problem sending your message.");
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

    // Theme toggle logic
    function applyTheme(theme) {
        // Remove both classes first to ensure a clean toggle
        document.body.classList.remove('light', 'dark');
        if (theme === 'light') {
            document.body.classList.add('light');
            document.body.style.background = "url('/assets/images/lightmode.gif') center center/cover no-repeat fixed, #fff";
        } else {
            document.body.classList.add('dark');
            document.body.style.background = "url('/assets/images/background.gif') center center/cover no-repeat fixed, #ffe5ec";
        }
        const toggleInput = document.getElementById('theme-toggle');
        if (toggleInput && toggleInput.type === 'checkbox') {
            toggleInput.checked = theme === 'light';
        }
    }
    function getPreferredTheme() {
        if (localStorage.getItem('theme')) return localStorage.getItem('theme');
        if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        return 'dark';
    }
    // Wait for header to be loaded before binding toggle
    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        let theme = getPreferredTheme();
        applyTheme(theme);
        if (themeToggle) {
            if (themeToggle.type === 'checkbox') {
                themeToggle.checked = theme === 'light';
                themeToggle.addEventListener('change', function() {
                    theme = this.checked ? 'light' : 'dark';
                    localStorage.setItem('theme', theme);
                    applyTheme(theme);
                });
            } else {
                themeToggle.onclick = function() {
                    theme = document.body.classList.contains('light') ? 'dark' : 'light';
                    localStorage.setItem('theme', theme);
                    applyTheme(theme);
                };
            }
        }
    }
    // Run after header is loaded
    setTimeout(setupThemeToggle, 0);
});
