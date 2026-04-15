// Athena CTF — single-page behaviors

(function () {
    'use strict';

    // ---------- Year in footer ----------
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    // ---------- Mobile nav toggle ----------
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) links.classList.remove('open');
        });
    }

    // ---------- Scroll progress bar ----------
    const progress = document.getElementById('navProgress');
    const onScrollProgress = () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
        if (progress) progress.style.width = Math.min(100, Math.max(0, scrolled * 100)) + '%';
    };

    // ---------- Active nav link (scroll-spy) ----------
    const sections = Array.from(document.querySelectorAll('main .section'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const linkById = Object.fromEntries(
        navLinks.map(a => [a.getAttribute('href').replace('#', ''), a])
    );

    const setActive = () => {
        const y = window.scrollY + 120;
        let current = sections[0]?.id;
        for (const s of sections) {
            if (s.offsetTop <= y) current = s.id;
        }
        navLinks.forEach(a => a.classList.remove('active'));
        if (current && linkById[current]) linkById[current].classList.add('active');
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScrollProgress();
                setActive();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    onScrollProgress();
    setActive();

    // ---------- Reveal-on-scroll ----------
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('in');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ---------- Card hover spotlight ----------
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });

    // ---------- 3D tilt for media shots ----------
    document.querySelectorAll('.shot.tilt').forEach(shot => {
        shot.addEventListener('pointermove', (e) => {
            const r = shot.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            const rx = (-py * 6).toFixed(2);
            const ry = (px * 6).toFixed(2);
            shot.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
        });
        shot.addEventListener('pointerleave', () => {
            shot.style.transform = '';
        });
    });

    // ---------- Floating particles ----------
    const particleHost = document.querySelector('.particles');
    if (particleHost && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const COUNT = 26;
        for (let i = 0; i < COUNT; i++) {
            const p = document.createElement('span');
            p.className = 'particle' + (i % 3 === 0 ? ' hex' : '');
            const size = 4 + Math.random() * 10;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (100 + Math.random() * 40) + '%';
            p.style.animationDuration = (14 + Math.random() * 22) + 's';
            p.style.animationDelay = (-Math.random() * 20) + 's';
            particleHost.appendChild(p);
        }
    }

    // ---------- Parallax for hero blobs/orbits ----------
    const blobs = document.querySelectorAll('.blob');
    const orbits = document.querySelectorAll('.orbit');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        blobs.forEach((b, i) => {
            b.style.transform = `translate(${(i - 1) * 12}px, ${y * 0.04 * (i + 1)}px)`;
        });
        orbits.forEach((o, i) => {
            o.style.marginTop = (y * -0.03 * (i + 1)) + 'px';
        });
    }, { passive: true });

    // ---------- Smooth scroll for older browsers already handled by CSS ----------
})();
