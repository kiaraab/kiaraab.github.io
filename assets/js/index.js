import { projects } from './Projects.js';

const gallery = document.getElementById('workGallery');
gallery.innerHTML = projects.map(p => `
  <div class="project-card" onclick="location.href='${p.link}'">
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
