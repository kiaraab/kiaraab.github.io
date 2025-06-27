document.addEventListener('DOMContentLoaded', () => {
    const data = {
        '2019': 'Began B.S. in Information Science at the University of Maryland.',
        '2020': 'Academic Peer Mentor and research fellowships with Tiny Catalyst and the USDA.',
        '2021': 'Data Science Intern at Sierra Nevada Corporation.',
        '2022': 'Graduated from UMD and joined PwC as a Data Science Associate.',
        '2023': 'Started the M.S. Analytics program at Georgia Tech while continuing at PwC.'
    };

    const timeline = document.getElementById('timeline');
    const details = document.getElementById('timeline-details');

    Object.keys(data).forEach(year => {
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.textContent = year;
        node.addEventListener('click', () => {
            timeline.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            details.textContent = data[year];
        });
        timeline.appendChild(node);
    });
});
