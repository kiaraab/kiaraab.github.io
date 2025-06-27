document.addEventListener('DOMContentLoaded', () => {
    // More detailed data for each year
    const data = [
        {
            year: '2019',
            title: 'Started B.S. in Information Science',
            subtitle: 'University of Maryland',
            details: 'Began undergraduate studies, focusing on data, design, and research. Joined student organizations and explored tech interests.'
        },
        {
            year: '2020',
            title: 'Mentor & Research Fellow',
            subtitle: 'Tiny Catalyst, USDA',
            details: 'Worked as an Academic Peer Mentor. Participated in research fellowships with Tiny Catalyst and the USDA, gaining hands-on experience in data science and research.'
        },
        {
            year: '2021',
            title: 'Data Science Intern',
            subtitle: 'Sierra Nevada Corporation',
            details: 'Interned as a data scientist, working on real-world projects in aerospace and defense. Developed skills in analytics, teamwork, and communication.'
        },
        {
            year: '2022',
            title: 'Graduated & Joined PwC',
            subtitle: 'UMD & PwC',
            details: 'Graduated from UMD. Joined PwC as a Data Science Associate, contributing to client projects and building professional skills.'
        },
        {
            year: '2023',
            title: 'M.S. Analytics & PwC',
            subtitle: 'Georgia Tech',
            details: 'Started the M.S. Analytics program at Georgia Tech while continuing at PwC. Balanced work and graduate studies, focusing on advanced analytics and leadership.'
        }
    ];

    const timeline = document.getElementById('timeline');
    const details = document.getElementById('timeline-details');

    // Create scrollable container
    timeline.innerHTML = `
      <button class="timeline-scroll-btn left" aria-label="Scroll left">&#8592;</button>
      <div class="timeline-scroll-area">
        <div class="timeline-line"></div>
        <div class="timeline-nodes"></div>
      </div>
      <button class="timeline-scroll-btn right" aria-label="Scroll right">&#8594;</button>
    `;

    const scrollArea = timeline.querySelector('.timeline-scroll-area');
    const nodesContainer = timeline.querySelector('.timeline-nodes');

    // Add nodes
    data.forEach((item, idx) => {
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.tabIndex = 0;
        node.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-year">${item.year}</div>
        `;
        node.addEventListener('click', () => selectNode(idx));
        node.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') selectNode(idx);
        });
        nodesContainer.appendChild(node);
    });

    function selectNode(idx) {
        nodesContainer.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
        const node = nodesContainer.children[idx];
        node.classList.add('active');
        const item = data[idx];
        details.innerHTML = `
          <div class="timeline-details-title">${item.title}</div>
          <div class="timeline-details-subtitle">${item.subtitle}</div>
          <div class="timeline-details-desc">${item.details}</div>
        `;
        // Scroll node into view
        node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // Select the last node by default
    selectNode(data.length - 1);

    // Scroll buttons
    timeline.querySelector('.timeline-scroll-btn.left').onclick = () => {
        scrollArea.scrollBy({ left: -200, behavior: 'smooth' });
    };
    timeline.querySelector('.timeline-scroll-btn.right').onclick = () => {
        scrollArea.scrollBy({ left: 200, behavior: 'smooth' });
    };
});
