(function () {
    'use strict';

    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    const progress = document.getElementById('navProgress');
    const onScroll = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
        if (progress) progress.style.width = Math.min(100, Math.max(0, scrolled * 100)) + '%';
    };

    // Scroll-spy for TOC
    const sections = Array.from(document.querySelectorAll('.docs-section'));
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    const linkBySlug = Object.fromEntries(tocLinks.map(a => [a.dataset.slug, a]));

    const setActive = () => {
        const y = window.scrollY + 140;
        let current = sections[0]?.id;
        for (const s of sections) if (s.offsetTop <= y) current = s.id;
        tocLinks.forEach(a => a.classList.remove('active'));
        if (current && linkBySlug[current]) linkBySlug[current].classList.add('active');
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); setActive(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    onScroll();
    setActive();

    // Smooth scroll for anchor links inside the docs body (e.g. from rendered md links)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                history.replaceState(null, '', '#' + id);
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
