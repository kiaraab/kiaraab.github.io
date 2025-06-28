import { projects } from './Projects.js';

// --- Begin nav-mobile.js logic ---
function initHomeScripts() {
    const hamburger = document.querySelector('.nav-hamburger');
    const navDropdown = document.getElementById('nav-dropdown');
    const siteTitle = document.querySelector('.site-title');
    if (hamburger && navDropdown) {
        function openNav() {
            navDropdown.classList.add('open');
            navDropdown.setAttribute('aria-hidden', 'false');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.classList.add('active');
        }
        function closeNav() {
            navDropdown.classList.remove('open');
            navDropdown.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
        }
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            // Animate shrink
            hamburger.classList.add('shrink');
            setTimeout(() => {
                hamburger.classList.remove('shrink');
                if (navDropdown.classList.contains('open')) {
                    closeNav();
                } else {
                    openNav();
                }
            }, 120);
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!navDropdown.contains(e.target) && !hamburger.contains(e.target)) {
                closeNav();
            }
        });
        // About link always routes to /about.html
        const aboutLink = navDropdown.querySelector('a[href*="about"]');
        if (aboutLink) {
            aboutLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Prevent other click handlers
                window.location.href = '/about.html';
            });
        }
        // Résumé link always routes to /resume.html
        const resumeLink = navDropdown.querySelector('a[href*="resume"]');
        if (resumeLink) {
            resumeLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Prevent other click handlers
                window.location.href = '/resume.html';
            });
        }
        // Close dropdown when clicking a link
        navDropdown.querySelectorAll('a').forEach(link => {
            // Don't add closeNav to about or resume link, since they're handled above
            if (link !== aboutLink && link !== resumeLink) {
                link.addEventListener('click', closeNav);
            }
        });
        // Optional: close on ESC
        document.addEventListener('keydown', e => {
            if (navDropdown.classList.contains('open') && e.key === 'Escape') closeNav();
        });
        // Site title click routes to /
        if (siteTitle) {
            siteTitle.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = '/';
            });
        }
    }

    const gallery = document.getElementById('workGallery');
    if (gallery) {
        gallery.innerHTML = projects.map((p, i) => `
          <div class="project-card${i === 1 ? ' project-card-wedding' : ''}" onclick="location.href='${p.link}'">
            <div class="project-thumb-area">
              <div class="project-thumb-title">${p.title}</div>
            </div>
            <div class="project-info" style="background-image: url('${p.img}');">
              <div class="project-date">date last modified: 06/26/2025</div>
              <div class="project-blurb">${p.blurb}</div>
            </div>
          </div>
        `).join('');
        // Optional: keyboard accessibility
        gallery.querySelectorAll('.project-card').forEach(card => {
            card.tabIndex = 0;
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') card.click();
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeScripts);
} else {
    initHomeScripts();
}
// --- End nav-mobile.js logic ---
