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
});
