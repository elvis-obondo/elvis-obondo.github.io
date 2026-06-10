/* ── Lenis smooth scroll ──────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
});

/* ── GSAP + ScrollTrigger setup ───────────────────────── */
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ── Hero entrance animation ─────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const nameInners = document.querySelectorAll('.hero-name-inner');

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to(nameInners, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.12,
      delay: 0.3,
    });

  /* hero photo reveal */
  const photo = document.getElementById('hero-photo');
  if (photo) {
    const revealPhoto = () => photo.classList.add('loaded');
    if (photo.complete) {
      revealPhoto();
    } else {
      photo.addEventListener('load', revealPhoto);
      /* fallback if photo missing */
      photo.addEventListener('error', () => {
        photo.style.display = 'none';
      });
    }
  }
});

/* ── Nav: cream bg on scroll ─────────────────────────── */
const nav = document.getElementById('nav');

ScrollTrigger.create({
  start: 'top -60px',
  onEnter: () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});

/* ── Scroll reveal for .reveal elements ──────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => observer.observe(el));

/* ── Smooth anchor scroll (nav links) ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: -80, duration: 1.6 });
  });
});

/* ── Active nav link highlight ───────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

ScrollTrigger.create({
  onUpdate: () => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) current = section.id;
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.style.color = isActive ? 'var(--ink)' : '';
    });
  },
});

/* ── Mobile nav toggle ───────────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');

if (hamburger && mobileNav) {
  const openMenu = () => {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ── Project card GSAP hover ─────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -6, duration: 0.5, ease: 'expo.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, duration: 0.6, ease: 'expo.out' });
  });
});
