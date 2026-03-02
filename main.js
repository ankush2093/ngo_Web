/* ============================================================
   main.js — EKRI Shared JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle  = document.querySelector('.nav-toggle');
  const navDrawer  = document.querySelector('.nav-drawer');
  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('active');
      navDrawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      navToggle.setAttribute('aria-expanded', open);
    });
    // close on backdrop click
    navDrawer.addEventListener('click', (e) => {
      if (e.target === navDrawer) {
        navToggle.classList.remove('active');
        navDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll Animations (IntersectionObserver) ---------- */
  const animatedEls = document.querySelectorAll('.animate-fade-in-up');
  if (animatedEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animatedEls.forEach(el => observer.observe(el));
  }

  /* ---------- Back to Top ---------- */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Notification Banner ---------- */
  const banner       = document.getElementById('notification-banner');
  const bannerClose  = document.getElementById('banner-close');
  if (bannerClose && banner) {
    bannerClose.addEventListener('click', () => {
      banner.style.maxHeight = banner.offsetHeight + 'px';
      requestAnimationFrame(() => {
        banner.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';
        banner.style.maxHeight  = '0';
        banner.style.opacity    = '0';
        banner.style.overflow   = 'hidden';
        setTimeout(() => banner.remove(), 400);
      });
    });
  }

  /* ---------- Resource / Content Tabs ---------- */
  document.querySelectorAll('.tabs-bar').forEach(bar => {
    const btns   = bar.querySelectorAll('.tab-btn');
    const panels = bar.closest('section, .tabs-container')?.querySelectorAll('.tab-panel') || [];
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---------- Newsletter Form ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.form-input');
      const email = input?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input?.classList.add('error');
        input?.focus();
        return;
      }
      input.value = '';
      const btn = form.querySelector('.btn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'var(--color-success)';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
      }
    });
  });

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        field.style.borderColor = field.value.trim() ? '' : 'var(--color-danger)';
        if (!field.value.trim()) valid = false;
      });
      if (!valid) return;
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--color-success)';
      contactForm.reset();
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 4000);
    });
  }

  /* ---------- Language Switch ---------- */
  document.querySelectorAll('.lang-switch').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = btn.textContent.trim() === 'EN | FR' ? 'FR | EN' : 'EN | FR';
    });
  });

  /* ---------- Animated Counter ---------- */
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const step     = 16;
    const steps    = Math.floor(duration / step);
    const inc      = target / steps;
    let current    = 0;
    const timer    = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  /* ---------- Smooth Scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
