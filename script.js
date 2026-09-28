const progressBar = document.getElementById('progressBar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
document.getElementById('year').textContent = new Date().getFullYear();

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Gentle pointer tilt on the 3D cube. Disabled for touch and reduced-motion users.
const heroScene = document.getElementById('heroScene');
const cube = document.querySelector('.cube');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroScene && cube && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  heroScene.addEventListener('pointermove', event => {
    const rect = heroScene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cube.style.animation = 'none';
    cube.style.transform = `rotateX(${-22 - y * 22}deg) rotateY(${-32 + x * 30}deg) translateY(${-y * 9}px)`;
  });
  heroScene.addEventListener('pointerleave', () => {
    cube.style.transform = '';
    cube.style.animation = '';
  });
}
