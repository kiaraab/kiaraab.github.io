document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-quart',
        once: true,
        offset: 100
    });

    // Custom intersection observer for timeline items
    const timelineItems = document.querySelectorAll('.timeline__item');
    const valueCards = document.querySelectorAll('.value-card');
    const personalFacts = document.querySelectorAll('.personal-fact');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    [...timelineItems, ...valueCards, ...personalFacts].forEach(item => {
        observer.observe(item);
    });

    // Add staggered animation delays to value cards
    valueCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 80}ms`;
    });

    // Add staggered animation delays to personal facts
    personalFacts.forEach((fact, index) => {
        fact.style.transitionDelay = `${index * 150}ms`;
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to timeline photos
    const timelinePhotos = document.querySelectorAll('.photo--taped');
    timelinePhotos.forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            photo.style.transform = 'rotate(0deg) scale(1.02)';
        });
        
        photo.addEventListener('mouseleave', () => {
            photo.style.transform = 'rotate(-2deg) scale(1)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroPhoto = document.querySelector('.hero__photo');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (hero && heroPhoto) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                heroPhoto.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }
    });

    // Add typing effect to hero tagline
    const tagline = document.querySelector('.hero__tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        
        // Create a span for the text and cursor
        const textSpan = document.createElement('span');
        const cursorSpan = document.createElement('span');
        cursorSpan.textContent = '|';
        cursorSpan.style.color = 'var(--primary-color, #af1658)';
        cursorSpan.style.animation = 'blink 1s infinite';
        
        // Add blinking cursor animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        tagline.appendChild(textSpan);
        tagline.appendChild(cursorSpan);
        
        let i = 0;
        const typeSpeed = 80;
        
        function typeWriter() {
            if (i < text.length) {
                textSpan.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    cursorSpan.remove();
                }, 1500);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Add loading animation
    const main = document.querySelector('.about-main');
    if (main) {
        main.style.opacity = '0';
        main.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            main.style.transition = 'all 0.8s ease-out';
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        }, 300);
    }

    // Counter animation for any numeric elements (if added later)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const range = target - start;
        const increment = target > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = start;
            if (start === target) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Error handling for missing elements
    console.log('About page JavaScript initialized successfully');
});