const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/namansirohi',
  github: 'https://github.com/Namansirohi-code'
};
const linkedinLink = document.getElementById('linkedin-link');
const githubLink = document.getElementById('github-link');
function configureProfileLink(element, url) {
  if (!element || !url) return;
  element.href = url;
  element.target = '_blank';
  element.rel = 'noreferrer';
}
configureProfileLink(linkedinLink, LINKS.linkedin);
configureProfileLink(githubLink, LINKS.github);

// Highlight the active navigation section as the page scrolls.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}

// Reveal content on scroll, while keeping everything visible for reduced-motion users.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.section-label, .about-grid, .project-card, .timeline-item, .skill-card, .cert-row, .contact-inner > *');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.matches('.project-card, .skill-card, .cert-row')) element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });
}

// Subtle 3D tilt on the hero analytics panel (disabled for touch and reduced motion).
const tiltCard = document.querySelector('.tilt-card');
if (tiltCard && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  tiltCard.addEventListener('pointermove', event => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 7;
    const rotateX = (0.5 - y) * 6;
    tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });
  tiltCard.addEventListener('pointerleave', () => { tiltCard.style.transform = ''; });
}

// Lightweight animated particle field: no external library or build step required.
const canvas = document.getElementById('particle-field');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, particles = [], frame = 0;
  const pointer = { x: -1000, y: -1000 };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(65, Math.max(24, Math.floor(width / 22)));
    particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.5 + .5 }));
  };
  const draw = () => {
    frame = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10 || p.x > width + 10) p.vx *= -1;
      if (p.y < -10 || p.y > height + 10) p.vy *= -1;
      const dx = pointer.x - p.x, dy = pointer.y - p.y, distance = Math.hypot(dx, dy);
      if (distance < 130) { p.x -= dx * .0007; p.y -= dy * .0007; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(139, 190, 220, .55)'; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], ddx = p.x - q.x, ddy = p.y - q.y, d = Math.hypot(ddx, ddy);
        if (d < 105) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(85, 230, 193, ${.12 * (1 - d / 105)})`; ctx.lineWidth = .6; ctx.stroke(); }
      }
    });
  };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(frame); else draw(); });
  resize(); draw();
}
