// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const observeElements = document.querySelectorAll('.stat-card, .achievement-card, .project-card, .research-card, .leadership-card, .skill-category');
observeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add typing effect to the hero section
const taglineText = document.querySelector('.tagline');
if (taglineText) {
    const originalText = taglineText.textContent;
    taglineText.textContent = '';
    let charIndex = 0;

    function typeText() {
        if (charIndex < originalText.length) {
            taglineText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 50);
        }
    }

    // Start typing after a short delay
    setTimeout(typeText, 500);
}

// Add parallax effect to hero background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroElements = document.querySelectorAll('.hero::before, .hero::after');

    document.querySelector('.hero').style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add hover effect for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Counter animation for stats
const statNumbers = document.querySelectorAll('.stat-card h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateValue(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

function animateValue(element) {
    const text = element.textContent;
    const hasDecimals = text.includes('.');
    const isPercentage = text.includes('%');
    const isSAT = text.includes('SAT');
    const isIELTS = text.includes('IELTS');
    const isGPA = text.includes('GPA');
    const isMaster = text.includes('Master');

    let targetValue, prefix = '', suffix = '';

    if (isSAT) {
        prefix = 'SAT ';
        targetValue = 1570;
    } else if (isIELTS) {
        prefix = 'IELTS ';
        targetValue = 7.5;
    } else if (isGPA) {
        prefix = 'GPA ';
        targetValue = 9.5;
    } else if (isMaster) {
        // Skip animation for Codeforces Master rank
        return;
    } else if (isPercentage) {
        targetValue = parseFloat(text);
        suffix = '%';
    } else {
        targetValue = parseFloat(text);
    }

    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }

        const displayValue = hasDecimals ? currentValue.toFixed(1) : Math.floor(currentValue);
        element.textContent = prefix + displayValue + suffix;
    }, 30);
}

// Add click effect to buttons
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add mobile menu toggle (for future implementation)
const createMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-label', 'Toggle menu');

    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.nav-container');
        if (!document.querySelector('.menu-toggle')) {
            nav.insertBefore(menuToggle, navLinks);
        }

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.textContent = navLinks.classList.contains('show') ? '✕' : '☰';
        });
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Log page load completion
console.log('Personal portfolio website loaded successfully!');
console.log('Built for Tran Thuan Hieu');
