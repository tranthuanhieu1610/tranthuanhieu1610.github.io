// ===== Smooth scroll for in-page nav =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

// ===== Header hide/show on scroll (matches portfolio behaviour) =====
let lastScrollTop = 0;
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== Article topic filtering =====
const chips = document.querySelectorAll('.filter-chip');
const cards = document.querySelectorAll('.article-card');
const noResults = document.getElementById('noResults');

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.dataset.filter;
        let visible = 0;
        cards.forEach(card => {
            const topics = (card.dataset.topics || '').split(/\s+/);
            const show = filter === 'all' || topics.includes(filter);
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
});

// ===== Whole article card opens the source article =====
document.querySelectorAll('.article-card').forEach(card => {
    const link = card.querySelector('a.article-link');
    if (!link) return;
    card.addEventListener('click', (e) => {
        // Let real links (and their children) behave normally
        if (e.target.closest('a')) return;
        window.open(link.href, '_blank', 'noopener');
    });
});

// ===== Interview Q&A accordion =====
document.querySelectorAll('.qa-q').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('open');
    });
});

// ===== Fade-in on scroll =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.article-card, .fact-card, .wiki-stat, .tl-item, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

console.log('Press Wiki loaded — Trần Thuận Hiếu');
