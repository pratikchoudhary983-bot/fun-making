/* =========================================================
   AYLA RIVERA — Interactive layer
   Smooth, fluid, framework-free.
   ========================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (max-width: 900px)').matches;

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('is-done'), 1600);
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('is-in'), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 30);

    if (scrollProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if ('IntersectionObserver' in window) {
    const cIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const isFloat = String(target).includes('.');
          const duration = 1800;
          const start = performance.now();

          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          cIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cIO.observe(c));
  }

  /* ---------- CUSTOM CURSOR ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (dot && ring) {
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx, ry = my;
      let dx = mx, dy = my;

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
      });

      const animate = () => {
        // Dot follows tightly, ring lags for fluid feel
        dx += (mx - dx) * 0.55;
        dy += (my - dy) * 0.55;
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;

        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
      };
      animate();

      // Hover state on interactive elements
      const hoverables = 'a, button, [data-magnetic], .card, .brand-cell, .testimonial, .about-tags li';
      document.querySelectorAll(hoverables).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('is-hover');
          dot.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('is-hover');
          dot.classList.remove('is-hover');
        });
      });

      // Hide while idle on edges
      document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      });
    }
  }

  /* ---------- MAGNETIC ELEMENTS ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach((el) => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------- 3D TILT ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const tilters = document.querySelectorAll('[data-tilt]');
    tilters.forEach((el) => {
      const max = 8; // degrees
      el.style.transformStyle = 'preserve-3d';
      el.style.willChange = 'transform';

      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * max;
        const ry = (x - 0.5) * max;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  /* ---------- PARALLAX ON HERO ORBS & PORTRAIT ---------- */
  if (!prefersReducedMotion) {
    const orbs = document.querySelectorAll('.orb');
    const portrait = document.querySelector('.portrait-img');

    let ticking = false;
    const onParallax = () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.08;
        orb.style.translate = `0 ${y * speed}px`;
      });
      if (portrait) {
        portrait.style.transform = `translateY(${y * -0.04}px) scale(1.02)`;
      }
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(onParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- HERO MOUSE PARALLAX ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const hero = document.querySelector('.hero');
    const title = document.querySelector('.hero-title');
    if (hero && title) {
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        title.style.transform = `translate(${x * -10}px, ${y * -6}px)`;
      });
      hero.addEventListener('mouseleave', () => {
        title.style.transform = 'translate(0,0)';
      });
    }
  }
})();
