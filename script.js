/* ============================================
   AURORE COMMODITIES — Enhanced Script
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Header scroll --- */
  const header = document.querySelector('.header');
  const isHome = !!document.querySelector('.hero');

  if (!isHome) header.classList.add('header--scrolled');
  else header.classList.add('header--transparent');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('header--scrolled');
      header.classList.remove('header--transparent');
    } else if (isHome) {
      header.classList.remove('header--scrolled');
      header.classList.add('header--transparent');
    }
    lastScroll = y;
  }, { passive: true });

  /* --- Hamburger menu --- */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll fade-in with stagger --- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* --- Subtle parallax on hero video --- */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroVideo.style.transform = `translateY(${y * 0.2}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  /* --- Tilt effect on feature cards (desktop only) --- */
  if (window.matchMedia('(min-width: 1025px)').matches) {
    const cards = document.querySelectorAll('.feature-card, .product-card, .value-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -2;
        const rotateY = (x - centerX) / centerX * 2;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* --- Magnetic effect on CTA buttons --- */
  const ctaBtns = document.querySelectorAll('.btn-primary');
  if (window.matchMedia('(min-width: 1025px)').matches) {
    ctaBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --- Smooth counter animation for stat numbers --- */
  const statNumbers = document.querySelectorAll('.stat-box__number');
  if (statNumbers.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const numMatch = text.match(/^(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = text.replace(numMatch[1], '');
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = current + suffix;
            }, 30);
          }
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObs.observe(el));
  }

  /* --- Contact form --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        showMsg('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMsg('Please enter a valid email address.', 'error');
        return;
      }

      const btn = contactForm.querySelector('.btn');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">Sending<span class="dot-loader">...</span></span>';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        showMsg('Thank you for your enquiry. We will respond within 24 hours.', 'success');
        contactForm.reset();
        btn.innerHTML = orig;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      }, 1400);
    });
  }

  function showMsg(text, type) {
    let msg = document.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      contactForm.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.cssText = `
      margin-top: 18px; padding: 16px 22px;
      border-radius: 8px; font-size: 0.9rem; font-weight: 500;
      opacity: 0; transform: translateY(8px);
      transition: all 0.4s ease;
      ${type === 'success'
        ? 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;'
        : 'background:#fef2f2;color:#991b1b;border:1px solid #fecaca;'}
    `;
    requestAnimationFrame(() => {
      msg.style.opacity = '1';
      msg.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(8px)';
      setTimeout(() => msg.remove(), 400);
    }, 5000);
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
